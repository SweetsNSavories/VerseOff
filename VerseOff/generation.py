import logging
import re
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Iterable, Sequence

try:
    from VerseOff.client_script_metadata import (
        collect_web_resource_names,
        sitemap_web_resource_names,
        web_resource_content_dependency_names,
        web_resource_dependency_names,
    )
    from VerseOff.code_generator import CodeGenerator
    from VerseOff.metadata_fetcher import MetadataFetcher
    from VerseOff.timeline_metadata import (
        extract_timeline_definitions,
        timeline_dependency_names,
    )
except ImportError:
    from client_script_metadata import (
        collect_web_resource_names,
        sitemap_web_resource_names,
        web_resource_content_dependency_names,
        web_resource_dependency_names,
    )
    from code_generator import CodeGenerator
    from metadata_fetcher import MetadataFetcher
    from timeline_metadata import (
        extract_timeline_definitions,
        timeline_dependency_names,
    )


logger = logging.getLogger(__name__)

DEFAULT_PUBLIC_CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d"
MAX_GENERATED_ENTITIES = 250
MAX_GENERATED_WEB_RESOURCES = 1000
ProgressCallback = Callable[[int, int, str], None]


@dataclass(frozen=True)
class ModelDrivenApp:
    app_module_id: str
    name: str
    unique_name: str = ""
    description: str = ""
    app_module_id_unique: str = ""

    @classmethod
    def from_metadata(cls, app: dict) -> "ModelDrivenApp":
        app_module_id = str(app.get("appmoduleid") or "").strip()
        name = str(app.get("name") or app.get("uniquename") or "").strip()
        if not app_module_id:
            raise ValueError("The selected app is missing its appmoduleid.")
        if not name:
            raise ValueError("The selected app is missing its display name.")

        return cls(
            app_module_id=app_module_id,
            name=name,
            unique_name=str(app.get("uniquename") or "").strip(),
            description=str(app.get("description") or "").strip(),
            app_module_id_unique=str(app.get("appmoduleidunique") or "").strip(),
        )

    def to_manifest(self) -> dict:
        return {
            "appmoduleid": self.app_module_id,
            "appmoduleidunique": self.app_module_id_unique,
            "name": self.name,
            "uniquename": self.unique_name,
            "description": self.description,
        }


@dataclass(frozen=True)
class GenerationRequest:
    org_url: str
    auth_token: str
    selected_app: ModelDrivenApp
    entity_names: Sequence[str]
    output_dir: Path
    client_id: str = ""
    tenant_id: str = "common"
    sync_interval: int = 300
    max_workers: int = 4
    bpf_definitions: dict | None = None


@dataclass(frozen=True)
class GenerationResult:
    output_dir: Path
    manifest: dict
    generated_files: tuple[str, ...]


def project_directory_name(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9._-]+", "-", value.strip())
    normalized = normalized.strip(" .-_")
    return normalized or "VerseOffApp"


def normalize_entity_names(entity_names: Iterable[str]) -> list[str]:
    normalized = []
    seen = set()
    for raw_name in entity_names:
        logical_name = str(raw_name or "").strip().lower()
        if not logical_name:
            continue
        if not re.fullmatch(r"[a-z][a-z0-9_]*", logical_name):
            raise ValueError(f"Invalid Dataverse table logical name: {raw_name!r}")
        if logical_name not in seen:
            seen.add(logical_name)
            normalized.append(logical_name)
    return normalized


def bpf_entity_names(bpf_definitions: dict) -> list[str]:
    names = []
    for definition in bpf_definitions.values():
        names.append(definition.get("primary_entity"))
        names.extend(stage.get("entity") for stage in definition.get("stages", []))
    return normalize_entity_names(name for name in names if name)


def form_dependency_names(entity_definition: dict) -> list[str]:
    """Returns tables directly referenced by controls on Main forms."""
    dependencies = []
    lookup_targets = entity_definition.get("lookup_targets", {})
    forms = [
        form
        for form in entity_definition.get("forms", [])
        if form.get("type") in (None, "", 2, "2")
    ]
    timelines = (
        entity_definition.get("timelines")
        or extract_timeline_definitions(
            forms,
            entity_definition.get("LogicalName", ""),
        )
    )
    dependencies.extend(timeline_dependency_names(timelines))
    for form in forms:
        form_xml = form.get("formxml") or ""
        if not form_xml:
            continue
        try:
            root = ET.fromstring(form_xml)
        except ET.ParseError as exc:
            raise ValueError(
                f"Invalid FormXML in form {form.get('name') or 'Unnamed'}: "
                f"{exc}"
            ) from exc

        for control in root.findall(".//control"):
            data_field = control.get("datafieldname")
            if data_field:
                dependencies.extend(lookup_targets.get(data_field, []))

            parameters = control.find("parameters")
            if parameters is None:
                continue
            target = parameters.find("TargetEntityType")
            if target is not None and target.text:
                dependencies.append(target.text)
            quick_forms_node = parameters.find("QuickForms")
            if quick_forms_node is not None and quick_forms_node.text:
                try:
                    quick_forms = ET.fromstring(quick_forms_node.text)
                except ET.ParseError:
                    continue
                dependencies.extend(
                    form_node.get("entityname")
                    for form_node in quick_forms.findall(".//QuickFormId")
                )

    own_name = entity_definition.get("LogicalName")
    return [
        name
        for name in normalize_entity_names(
            dependency
            for dependency in dependencies
            if dependency
        )
        if name != own_name
    ]


class SourceProjectBuilder:
    def __init__(
        self,
        fetcher_factory=MetadataFetcher,
        generator_factory=CodeGenerator,
    ):
        self.fetcher_factory = fetcher_factory
        self.generator_factory = generator_factory

    def generate(
        self,
        request: GenerationRequest,
        progress: ProgressCallback | None = None,
    ) -> GenerationResult:
        if not request.auth_token:
            raise ValueError("An authenticated Dataverse access token is required.")
        if request.sync_interval < 60:
            raise ValueError("The sync interval must be at least 60 seconds.")
        if not 1 <= request.max_workers <= 8:
            raise ValueError("Metadata workers must be between 1 and 8.")

        output_dir = Path(request.output_dir).expanduser().resolve()
        if output_dir.exists() and not output_dir.is_dir():
            raise ValueError(f"The target output path is not a folder: {output_dir}")

        fetcher = self.fetcher_factory(request.org_url, request.auth_token)
        bpfs = request.bpf_definitions
        if bpfs is None:
            bpfs = fetcher.get_bpf_definitions_for_app(
                request.selected_app.app_module_id
            )

        entity_names = normalize_entity_names(request.entity_names)
        for dependency in bpf_entity_names(bpfs):
            if dependency not in entity_names:
                entity_names.append(dependency)
        if not entity_names:
            raise ValueError("Select at least one Dataverse table to generate.")
        if len(entity_names) > MAX_GENERATED_ENTITIES:
            raise ValueError(
                f"Select no more than {MAX_GENERATED_ENTITIES} tables."
            )

        total_steps = len(entity_names) + 2

        def report(current: int, message: str):
            if progress:
                progress(current, total_steps, message)

        report(1, "Reading the selected app SiteMap and business processes...")
        sitemap = fetcher.get_app_sitemap(request.selected_app.app_module_id)
        timeline_settings = fetcher.get_timeline_organization_settings()
        client_context = fetcher.get_client_context()

        entities = []
        requested_entities = set(entity_names)
        queued_entities = list(entity_names)
        fetched_entities = set()
        pending_entities = list(entity_names)
        completed_count = 0

        def fetch_definition(logical_name):
            worker_fetcher = self.fetcher_factory(
                request.org_url,
                request.auth_token,
            )
            return worker_fetcher.get_entity_definition(logical_name)

        with ThreadPoolExecutor(
            max_workers=request.max_workers,
            thread_name_prefix="verseoff-metadata",
        ) as executor:
            while pending_entities:
                batch = [
                    name
                    for name in pending_entities
                    if name not in fetched_entities
                ]
                pending_entities = []
                if not batch:
                    break
                definitions = {}
                futures = {
                    executor.submit(fetch_definition, name): name
                    for name in batch
                }
                for future in as_completed(futures):
                    logical_name = futures[future]
                    try:
                        definitions[logical_name] = future.result()
                    except Exception as exc:
                        for pending in futures:
                            pending.cancel()
                        raise RuntimeError(
                            "Failed to extract metadata for "
                            f"{logical_name}: {exc}"
                        ) from exc
                    completed_count += 1
                    total_steps = max(
                        total_steps,
                        len(queued_entities) + 2,
                    )
                    report(
                        completed_count + 1,
                        f"Extracted metadata for '{logical_name}'.",
                    )

                for logical_name in batch:
                    definition = definitions[logical_name]
                    if logical_name not in requested_entities:
                        definition["_verseoff_dependency_only"] = True
                    entities.append(definition)
                    fetched_entities.add(logical_name)
                    for dependency in form_dependency_names(definition):
                        if (
                            dependency not in fetched_entities
                            and dependency not in queued_entities
                        ):
                            queued_entities.append(dependency)
                            pending_entities.append(dependency)
                            if (
                                len(queued_entities)
                                > MAX_GENERATED_ENTITIES
                            ):
                                raise RuntimeError(
                                    "FormXML dependency expansion exceeded "
                                    f"{MAX_GENERATED_ENTITIES} tables. "
                                    "Reduce the selected app components."
                                )
        entity_names = queued_entities
        total_steps = len(entity_names) + 2
        web_resources = []
        resource_names = collect_web_resource_names(entities)
        for name in sitemap_web_resource_names(sitemap):
            if name not in resource_names:
                resource_names.append(name)
        if resource_names:
            total_steps = len(entity_names) + len(resource_names) + 2

            def fetch_resource(resource_name):
                worker_fetcher = self.fetcher_factory(
                    request.org_url,
                    request.auth_token,
                )
                return worker_fetcher.get_web_resource(resource_name)

            resources_by_name = {}
            ordered_resource_names = []
            queued_resources = list(resource_names)
            completed_resources = 0
            with ThreadPoolExecutor(
                max_workers=request.max_workers,
                thread_name_prefix="verseoff-resources",
            ) as executor:
                while queued_resources:
                    batch = [
                        name
                        for name in queued_resources
                        if name not in resources_by_name
                    ]
                    queued_resources = []
                    if not batch:
                        break
                    futures = {
                        executor.submit(fetch_resource, name): name
                        for name in batch
                    }
                    batch_results = {}
                    for future in as_completed(futures):
                        resource_name = futures[future]
                        try:
                            resource = future.result()
                        except Exception as exc:
                            for pending in futures:
                                pending.cancel()
                            raise RuntimeError(
                                "Failed to download web resource "
                                f"{resource_name}: {exc}"
                            ) from exc
                        if resource is None:
                            raise RuntimeError(
                                "Required web resource was not found: "
                                f"{resource_name}"
                            )
                        batch_results[resource_name] = resource
                    for resource_name in batch:
                        resource = batch_results[resource_name]
                        resources_by_name[resource_name] = resource
                        ordered_resource_names.append(resource_name)
                        completed_resources += 1
                        dependencies = (
                            web_resource_dependency_names(resource)
                            + web_resource_content_dependency_names(
                                resource
                            )
                        )
                        for dependency in dependencies:
                            if (
                                dependency not in resources_by_name
                                and dependency not in queued_resources
                            ):
                                queued_resources.append(dependency)
                        if (
                            len(resources_by_name)
                            + len(queued_resources)
                            > MAX_GENERATED_WEB_RESOURCES
                        ):
                            raise RuntimeError(
                                "Web-resource dependency expansion "
                                f"exceeded {MAX_GENERATED_WEB_RESOURCES} "
                                "files."
                            )
                        total_steps = max(
                            total_steps,
                            (
                                len(entity_names)
                                + len(resources_by_name)
                                + len(queued_resources)
                                + 2
                            ),
                        )
                        report(
                            len(entity_names) + completed_resources + 1,
                            f"Downloaded web resource '{resource_name}'.",
                        )
            web_resources = [
                resources_by_name[name]
                for name in ordered_resource_names
                if resources_by_name.get(name)
            ]

        manifest = {
            "manifest_version": 1,
            "generator": "VerseOff Maker",
            "app_name": request.selected_app.name,
            "source_app": request.selected_app.to_manifest(),
            "org_url": fetcher.org_url,
            "client_id": request.client_id.strip() or DEFAULT_PUBLIC_CLIENT_ID,
            "tenant_id": request.tenant_id,
            "sync_interval": request.sync_interval,
            "metadata_workers": request.max_workers,
            "auto_sync_on_start": True,
            "entities": entities,
            "bpfs": bpfs,
            "sitemap": sitemap,
            "timeline_settings": timeline_settings,
            "client_context": client_context,
            "web_resources": web_resources,
        }

        report(total_steps, "Writing the target application source project...")
        generator = self.generator_factory(str(output_dir))
        generated_files = tuple(generator.generate(manifest) or ())
        self._write_generation_log(output_dir, request, entity_names)
        logger.info(
            "Generated %s from model-driven app %s",
            output_dir,
            request.selected_app.name,
        )
        return GenerationResult(output_dir, manifest, generated_files)

    @staticmethod
    def _write_generation_log(
        output_dir: Path,
        request: GenerationRequest,
        entity_names: Sequence[str],
    ):
        output_dir.mkdir(parents=True, exist_ok=True)
        lines = [
            "VerseOff source generation",
            f"Target app: {request.selected_app.name}",
            f"App module ID: {request.selected_app.app_module_id}",
            f"Environment: {request.org_url}",
            f"Tables: {len(entity_names)}",
            "",
            *[f"- {logical_name}" for logical_name in entity_names],
            "",
        ]
        (output_dir / "generation_log.txt").write_text(
            "\n".join(lines),
            encoding="utf-8",
        )
