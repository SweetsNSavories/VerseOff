import csv
import hashlib
import os
import posixpath
import re
import xml.etree.ElementTree as ET


def normalize_web_resource_name(value):
    name = str(value or "").strip()
    if re.match(
        r"^(?:https?|data|about|javascript|file|qrc):",
        name,
        re.IGNORECASE,
    ):
        return ""
    name = re.sub(
        r"^\$webresource:",
        "",
        name,
        flags=re.IGNORECASE,
    )
    return name.lstrip("/")


def safe_web_resource_path(name):
    normalized = normalize_web_resource_name(name)
    segments = [
        re.sub(r"[^A-Za-z0-9._-]+", "_", segment)
        for segment in re.split(r"[\\/]+", normalized)
        if segment not in {"", ".", ".."}
    ]
    if not segments:
        digest = hashlib.sha256(
            normalized.encode("utf-8")
        ).hexdigest()[:12]
        segments = [f"resource_{digest}.js"]
    return os.path.join("webresources", *segments)


def _xml_local_name(tag):
    return str(tag or "").rsplit("}", 1)[-1]


def _xml_bool(value, default=True):
    if value is None:
        return default
    return str(value).strip().casefold() not in {"false", "0", "no"}


def _handler_parameters(value):
    if not value:
        return []
    try:
        return next(csv.reader([value], skipinitialspace=True))
    except csv.Error as exc:
        raise ValueError(
            f"Invalid FormXML event-handler parameters {value!r}: {exc}"
        ) from exc


def _event_name(raw_name, control_node):
    name = str(raw_name or "").strip().casefold()
    aliases = {
        "loaded": "formloaded",
        "onpostsave": "postsave",
        "ondataonload": "dataonload",
    }
    name = aliases.get(name, name)
    if control_node is None:
        return name
    return {
        "onload": "gridonload",
        "onsave": "gridonsave",
        "onchange": "gridonchange",
    }.get(name, name)


def parse_form_event_handlers(form_xml):
    """Return FormXML handlers in Dataverse execution order."""
    if not form_xml:
        return []
    root = ET.fromstring(form_xml)
    parents = {
        child: parent
        for parent in root.iter()
        for child in list(parent)
    }
    handlers = []
    order = 0

    for event_node in root.iter():
        if _xml_local_name(event_node.tag).casefold() != "event":
            continue

        control_node = None
        ancestor = parents.get(event_node)
        while ancestor is not None:
            if _xml_local_name(ancestor.tag).casefold() == "control":
                control_node = ancestor
                break
            ancestor = parents.get(ancestor)

        control_name = event_node.get("attribute")
        if not control_name and control_node is not None:
            control_name = (
                control_node.get("datafieldname")
                or control_node.get("id")
            )
        event_name = _event_name(event_node.get("name"), control_node)
        event_enabled = _xml_bool(event_node.get("active"), True)

        for handler_node in event_node.iter():
            if _xml_local_name(handler_node.tag).casefold() != "handler":
                continue
            handlers.append({
                "event": event_name,
                "raw_event": str(event_node.get("name") or "").casefold(),
                "function": handler_node.get("functionName") or "",
                "library": handler_node.get("libraryName") or "",
                "pass_context": _xml_bool(
                    handler_node.get("passExecutionContext"),
                    False,
                ),
                "parameters": _handler_parameters(
                    handler_node.get("parameters")
                ),
                "control": control_name,
                "scope": "control" if control_node is not None else "form",
                "enabled": event_enabled and _xml_bool(
                    handler_node.get("enabled"),
                    True,
                ),
                "handler_id": handler_node.get("handlerUniqueId") or "",
                "behavior_in_bulk_edit": (
                    event_node.get("BehaviorInBulkEditForm") or ""
                ),
                "order": order,
            })
            order += 1
    return handlers


def parse_form_parameters(form_xml):
    """Return custom query-string parameters declared by FormXML."""
    if not form_xml:
        return {}
    root = ET.fromstring(form_xml)
    parameters = {}
    allowed_types = {
        "Boolean",
        "DateTime",
        "Double",
        "EntityType",
        "Integer",
        "Long",
        "PositiveInteger",
        "SafeString",
        "UniqueId",
        "UnsignedInt",
    }
    for node in root.iter():
        if _xml_local_name(node.tag).casefold() != "querystringparameter":
            continue
        name = str(node.get("name") or "").strip()
        if not name:
            raise ValueError(
                "FormXML querystringparameter is missing its name."
            )
        if (
            "_" not in name
            or name.startswith("_")
            or name.casefold().startswith("crm_")
        ):
            raise ValueError(
                f"Form parameter {name!r} violates Dataverse naming rules."
            )
        if name in parameters:
            raise ValueError(
                f"FormXML declares duplicate form parameter {name!r}."
            )
        parameter_type = str(node.get("type") or "SafeString")
        if parameter_type not in allowed_types:
            raise ValueError(
                f"Form parameter {name!r} has unsupported type "
                f"{parameter_type!r}."
            )
        parameters[name] = {
            "name": name,
            "type": parameter_type,
        }
    return parameters


def form_script_names(form):
    form_xml = form.get("formxml") or ""
    if not form_xml:
        return []
    try:
        root = ET.fromstring(form_xml)
    except ET.ParseError:
        return []
    names = []

    def include(value):
        normalized = normalize_web_resource_name(value)
        if normalized and normalized not in names:
            names.append(normalized)

    for library in root.findall(".//formLibraries/Library"):
        include(library.get("name"))
    for handler in parse_form_event_handlers(form_xml):
        include(handler.get("library"))
    for source_node in root.findall(
        ".//parameters/UClientRecordSourcesJSON"
    ):
        text = source_node.text or ""
        for match in re.findall(
            r'"name"\s*:\s*"([^"]+)"',
            text,
        ):
            include(match)
    return names


def form_web_resource_names(form):
    """Return every web resource directly referenced by a form."""
    form_xml = form.get("formxml") or ""
    if not form_xml:
        return []
    try:
        root = ET.fromstring(form_xml)
    except ET.ParseError:
        return []
    names = []

    def include(value):
        normalized = normalize_web_resource_name(value)
        if normalized and normalized not in names:
            names.append(normalized)

    for node in root.iter():
        local_name = _xml_local_name(node.tag).casefold()
        if local_name == "library":
            include(node.get("name"))
        elif local_name == "handler":
            include(node.get("libraryName"))
        elif local_name in {
            "url",
            "webresourcename",
            "richtexteditorconfigurationurl",
        }:
            include(node.text)
        for attribute_name in (
            "libraryName",
            "library",
            "webResourceName",
            "webresource",
        ):
            include(node.get(attribute_name))
    for source_node in root.iter():
        if (
            _xml_local_name(source_node.tag).casefold()
            != "uclientrecordsourcesjson"
        ):
            continue
        text = source_node.text or ""
        for match in re.findall(
            r'"(?:name|configurationResource)"\s*:\s*"([^"]+)"',
            text,
        ):
            include(match)
    return names


def web_resource_dependency_names(resource):
    """Parse Dataverse dependency XML without discarding unknown shapes."""
    dependency_xml = resource.get("dependency_xml") or ""
    if not dependency_xml:
        return []
    try:
        root = ET.fromstring(dependency_xml)
    except ET.ParseError:
        return []
    names = []

    def include(value):
        normalized = normalize_web_resource_name(value)
        if normalized and normalized not in names:
            names.append(normalized)

    for node in root.iter():
        for attribute_name in (
            "name",
            "webresource",
            "webResourceName",
            "library",
        ):
            value = node.get(attribute_name)
            if value and (
                "$webresource:" in value.casefold()
                or "." in value
                or "/" in value
            ):
                include(value)
        text = (node.text or "").strip()
        if text and "$webresource:" in text.casefold():
            include(text)
    return names


def web_resource_content_dependency_names(resource):
    content = resource.get("content")
    resource_name = normalize_web_resource_name(resource.get("name"))
    if not content or not resource_name:
        return []
    resource_type = str(resource.get("type") or "")
    if resource_type not in {"1", "2", "3", "4", "9", "11", "12"}:
        return []
    candidates = []
    patterns = (
        r"""(?:src|href)\s*=\s*["']([^"'#]+)["']""",
        r"""url\(\s*["']?([^"'()#]+)["']?\s*\)""",
        r"""(?:import\s+(?:[^"'()]+\s+from\s+)?|require\(\s*)"""
        r"""["']([^"']+)["']""",
        r"""(\$webresource:[A-Za-z0-9_./\\-]+)""",
    )
    for pattern in patterns:
        candidates.extend(
            re.findall(pattern, content, flags=re.IGNORECASE)
        )
    base_directory = posixpath.dirname(
        resource_name.replace("\\", "/")
    )
    dependencies = []
    for candidate in candidates:
        value = str(candidate or "").strip()
        if not value or re.match(
            r"^(?:https?|data|about|javascript|blob|file|qrc):",
            value,
            re.IGNORECASE,
        ):
            continue
        value = value.split("?", 1)[0].split("#", 1)[0]
        rooted = bool(
            re.match(
                r"^/?WebResources/",
                value,
                re.IGNORECASE,
            )
            or value.casefold().startswith("$webresource:")
        )
        value = re.sub(
            r"^/?WebResources/",
            "",
            value,
            flags=re.IGNORECASE,
        )
        if value.startswith("$webresource:"):
            value = value[len("$webresource:"):]
        if rooted or value.startswith("/"):
            resolved = value.lstrip("/")
        else:
            resolved = posixpath.normpath(
                posixpath.join(base_directory, value)
            )
        if resolved.startswith("../") or resolved in {"", "."}:
            continue
        normalized = normalize_web_resource_name(resolved)
        if normalized.casefold().endswith(
            "clientglobalcontext.js.aspx"
        ):
            continue
        if normalized and normalized not in dependencies:
            dependencies.append(normalized)
    return dependencies


def collect_web_resource_names(entities):
    names = []

    def include(value):
        normalized = normalize_web_resource_name(value)
        if normalized and normalized not in names:
            names.append(normalized)

    for entity in entities or []:
        for form in entity.get("forms", []):
            for name in form_web_resource_names(form):
                include(name)
        ribbon = entity.get("ribbon") or {}
        for command in ribbon.get("commands", {}).values():
            for action in command.get("actions", []):
                if action.get("type") == "JavaScriptFunction":
                    include(action.get("library"))
        for timeline in entity.get("timelines", []):
            for source in timeline.get("custom_record_sources", []):
                include(source.get("name"))
                include(
                    source.get("configurationResource")
                    or source.get("configuration_resource")
                )
        for control in entity.get("pcf_controls", []):
            if str(control.get("name") or "").startswith(
                "MscrmControls."
            ):
                continue
            for resource in control.get("resources", []):
                include(resource.get("web_resource_name"))
    return names


def sitemap_web_resource_names(sitemap):
    names = []

    def include(value):
        text = str(value or "").strip()
        if not text:
            return
        if (
            "$webresource:" not in text.casefold()
            and not re.search(
                r"\.(?:html?|js|css|svg|png|jpe?g|gif|ico|xml|resx)$",
                text,
                re.IGNORECASE,
            )
        ):
            return
        normalized = normalize_web_resource_name(text)
        if normalized and normalized not in names:
            names.append(normalized)

    for area in (sitemap or {}).get("areas", []):
        include(area.get("icon"))
        for group in area.get("groups", []):
            include(group.get("icon"))
            for subarea in group.get("subareas", []):
                include(subarea.get("url"))
                include(subarea.get("icon"))
                include(subarea.get("vector_icon"))
    return names
