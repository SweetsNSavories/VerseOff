import base64
import os
import jinja2
import logging
import json
import re
import shutil
import copy
import hashlib
import xml.etree.ElementTree as ET

try:
    from VerseOff.client_script_metadata import safe_web_resource_path
except ImportError:
    from client_script_metadata import safe_web_resource_path

logger = logging.getLogger(__name__)

class CodeGenerator:
    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        import sys
        if getattr(sys, 'frozen', False):
            # Running as a PyInstaller executable
            base_dir = sys._MEIPASS
        else:
            # Running as a normal Python script
            base_dir = os.path.dirname(__file__)
        self.base_dir = base_dir
        template_dir = os.path.join(base_dir, "templates")
        self.env = jinja2.Environment(
            loader=jinja2.FileSystemLoader(template_dir),
            autoescape=False,
            trim_blocks=True,
            lstrip_blocks=True
        )

    def generate(self, manifest: dict):
        """
        Generates the offline PyQt6 app based on the complete manifest.
        manifest = {
          "app_name": "My Field App",
          "org_url": "https://...",
          "client_id": "...",
          "sync_interval": 300,
          "entities": [
            {
              "logical_name": "incident",
              "display_name": "Case",
              "entity_set_name": "incidents",
              "primary_id": "incidentid",
              "primary_name": "title",
              "forms": [parsed_form_dict, ...],
              "option_sets": {"prioritycode": [{"value": 1, "label": "High"}, ...]},
              "lookup_targets": {"customerid": ["account", "contact"]},
              "ribbon": {...}
            },
            ...
          ]
        }
        """
        self._validate_manifest(manifest)
        logger.info("Generating app in %s", self.output_dir)
        os.makedirs(self.output_dir, exist_ok=True)
        manifest = copy.deepcopy(manifest)
        generated_files = self._materialize_web_resources(manifest)
        client_global_context = """
(function (global) {
    "use strict";
    global.GetGlobalContext = function () {
        if (global.__verseOffGlobalContext) {
            return global.__verseOffGlobalContext;
        }
        if (
            global.parent &&
            global.parent.__verseOffGlobalContext
        ) {
            return global.parent.__verseOffGlobalContext;
        }
        throw new Error(
            "VerseOff global context has not been injected."
        );
    };
})(window);
""".lstrip()
        self._write_text(
            os.path.join(
                "webresources",
                "ClientGlobalContext.js.aspx",
            ),
            client_global_context,
        )
        generated_files.append(
            "webresources/ClientGlobalContext.js.aspx"
        )
        
        # 1. Manifest / Config JSON
        config_path = os.path.join(self.output_dir, "manifest.json")
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
        generated_files.append("manifest.json")

        # 2. Main Entry Point
        self._render_template(
            "ui_components.j2",
            "ui_components.py",
            manifest=manifest,
        )
        generated_files.append("ui_components.py")
        fluent_chevron = """<svg xmlns="http://www.w3.org/2000/svg"
     width="12" height="7" viewBox="0 0 12 7">
  <path d="M1 1L6 6L11 1" fill="none" stroke="#605E5C"
        stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round"/>
</svg>
"""
        self._write_text("fluent_chevron.svg", fluent_chevron)
        generated_files.append("fluent_chevron.svg")

        self._render_template("generated_main.j2", "main.py", manifest=manifest)
        generated_files.append("main.py")
        
        # 3. Database Layer & Enterprise Crypto
        self._render_template("generated_db.j2", "db.py", manifest=manifest)
        generated_files.append("db.py")

        crypto_manager_source = os.path.join(
            self.base_dir,
            "crypto_manager.py",
        )
        if os.path.exists(crypto_manager_source):
            shutil.copyfile(
                crypto_manager_source,
                os.path.join(self.output_dir, "crypto_manager.py"),
            )
            generated_files.append("crypto_manager.py")

        timeline_metadata_source = os.path.join(
            self.base_dir,
            "timeline_metadata.py",
        )
        if not os.path.exists(timeline_metadata_source):
            raise FileNotFoundError(
                "Timeline metadata runtime not found: "
                f"{timeline_metadata_source}"
            )
        shutil.copyfile(
            timeline_metadata_source,
            os.path.join(self.output_dir, "timeline_metadata.py"),
        )
        generated_files.append("timeline_metadata.py")
        
        for logo_file in ("logo.png", "logo.jpg"):
            logo_src = os.path.join(self.base_dir, "templates", logo_file)
            if os.path.exists(logo_src):
                shutil.copyfile(logo_src, os.path.join(self.output_dir, logo_file))
                generated_files.append(logo_file)
            
        client_script_metadata_source = os.path.join(
            self.base_dir,
            "client_script_metadata.py",
        )
        if not os.path.exists(client_script_metadata_source):
            raise FileNotFoundError(
                "Client script metadata runtime not found: "
                f"{client_script_metadata_source}"
            )
        shutil.copyfile(
            client_script_metadata_source,
            os.path.join(self.output_dir, "client_script_metadata.py"),
        )
        generated_files.append("client_script_metadata.py")
        pcf_metadata_source = os.path.join(
            self.base_dir,
            "pcf_metadata.py",
        )
        if not os.path.exists(pcf_metadata_source):
            raise FileNotFoundError(
                f"PCF metadata runtime not found: {pcf_metadata_source}"
            )
        shutil.copyfile(
            pcf_metadata_source,
            os.path.join(self.output_dir, "pcf_metadata.py"),
        )
        generated_files.append("pcf_metadata.py")
        self._render_template(
            "timeline_widget.j2",
            "timeline_widget.py",
            manifest=manifest,
        )
        generated_files.append("timeline_widget.py")
        
        # 4. Sync Engine Layer
        self._render_template("generated_sync.j2", "sync_engine.py", manifest=manifest)
        generated_files.append("sync_engine.py")
        
        # 5. Offline XRM compatibility bridge
        self._render_template("mock_xrm.j2", "mock_xrm.py", manifest=manifest)
        generated_files.append("mock_xrm.py")
        
        # 6. Custom Events (Offline Extensibility)
        custom_events_path = os.path.join(self.output_dir, "custom_events.py")
        if not os.path.exists(custom_events_path):
            self._render_template("custom_events.j2", "custom_events.py", manifest=manifest)
            logger.info("Scaffolded new custom_events.py.")
        else:
            logger.info("Skipping custom_events.py (already exists).")
        generated_files.append("custom_events.py")
            
        # 7. Data Providers (Facade Pattern)
        data_providers_path = os.path.join(self.output_dir, "data_providers.py")
        if not os.path.exists(data_providers_path):
            self._render_template("data_providers.j2", "data_providers.py", manifest=manifest)
            logger.info("Scaffolded new data_providers.py.")
        else:
            logger.info("Skipping data_providers.py (already exists).")
        generated_files.append("data_providers.py")

        # 8. Dynamic XRM Form Renderer
        self._render_template("xrm_form_renderer.j2", "xrm_form_renderer.py", manifest=manifest)
        generated_files.append("xrm_form_renderer.py")
        
        # 9. View Parser (LayoutXML/FetchXML)
        self._render_template("view_parser.j2", "view_parser.py", manifest=manifest)
        generated_files.append("view_parser.py")

        bridge_source = os.path.join(self.base_dir, "verseoff_bridge.js")
        if not os.path.exists(bridge_source):
            raise FileNotFoundError(
                f"VerseOff bridge resource not found: {bridge_source}"
            )
        shutil.copyfile(
            bridge_source,
            os.path.join(self.output_dir, "verseoff_bridge.js"),
        )
        generated_files.append("verseoff_bridge.js")
        pcf_host_source = os.path.join(
            self.base_dir,
            "verseoff_pcf_host.js",
        )
        if not os.path.exists(pcf_host_source):
            raise FileNotFoundError(
                f"VerseOff PCF host not found: {pcf_host_source}"
            )
        shutil.copyfile(
            pcf_host_source,
            os.path.join(self.output_dir, "verseoff_pcf_host.js"),
        )
        generated_files.append("verseoff_pcf_host.js")
        
        # 9.5 Write Web Resources to Disk
        web_resources = manifest.get("web_resources", [])
        if web_resources:
            wr_base_dir = os.path.join(self.output_dir, "webresources", "webresources")
            os.makedirs(wr_base_dir, exist_ok=True)
            for wr in web_resources:
                if not isinstance(wr, dict):
                    continue
                name = wr.get("name")
                if not name:
                    continue
                # Normalize Windows paths and make directories
                safe_name = name.replace("/", os.sep)
                file_path = os.path.join(wr_base_dir, safe_name)
                # Apply \\?\ prefix to handle deep WebResource MAX_PATH limits
                if os.name == "nt" and not file_path.startswith("\\\\?\\"):
                    file_path = "\\\\?\\" + os.path.abspath(file_path)
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                content = wr.get("content")
                if content is not None:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                else:
                    b64 = wr.get("content_base64")
                    if b64:
                        import base64
                        with open(file_path, "wb") as f:
                            f.write(base64.b64decode(b64))
            logger.info(f"Wrote {len(web_resources)} web resources to disk.")
        
        
        # 10. VS Code files
        vscode_dir = os.path.join(self.output_dir, ".vscode")
        os.makedirs(vscode_dir, exist_ok=True)
        
        launch_json = {
            "version": "0.2.0",
            "configurations": [
                {
                    "name": "Run VerseOff App",
                    "type": "debugpy",
                    "request": "launch",
                    "program": "${workspaceFolder}/main.py",
                    "cwd": "${workspaceFolder}",
                    "console": "integratedTerminal"
                }
            ]
        }
        with open(
            os.path.join(vscode_dir, "launch.json"),
            "w",
            encoding="utf-8",
        ) as f:
            json.dump(launch_json, f, indent=4)
        generated_files.append(os.path.join(".vscode", "launch.json"))
            
        tasks_json = {
            "version": "2.0.0",
            "tasks": [
                {
                    "label": "Build EXE (PyInstaller)",
                    "type": "shell",
                    "command": "python",
                    "args": ["build_app.py"],
                    "group": {
                        "kind": "build",
                        "isDefault": True
                    },
                    "presentation": {
                        "reveal": "always",
                        "panel": "new"
                    }
                }
            ]
        }
        with open(
            os.path.join(vscode_dir, "tasks.json"),
            "w",
            encoding="utf-8",
        ) as f:
            json.dump(tasks_json, f, indent=4)
        generated_files.append(os.path.join(".vscode", "tasks.json"))
            
        executable_name = self._project_slug(manifest["app_name"])
        build_app_py = f"""import os
import PyInstaller.__main__


base_dir = os.path.dirname(os.path.abspath(__file__))
manifest_path = os.path.join(base_dir, "manifest.json")
bridge_path = os.path.join(base_dir, "verseoff_bridge.js")
pcf_host_path = os.path.join(base_dir, "verseoff_pcf_host.js")
chevron_path = os.path.join(base_dir, "fluent_chevron.svg")
webresources_path = os.path.join(base_dir, "webresources")
os.chdir(base_dir)

print("Building generated VerseOff application...")
PyInstaller.__main__.run([
   "main.py",
   "--name={executable_name}",
   "--onefile",
   "--windowed",
   "--clean",
   "--noconfirm",
   f"--add-data={{manifest_path}}{{os.pathsep}}.",
   f"--add-data={{bridge_path}}{{os.pathsep}}.",
   f"--add-data={{pcf_host_path}}{{os.pathsep}}.",
   f"--add-data={{chevron_path}}{{os.pathsep}}.",
   *(
       [f"--add-data={{webresources_path}}{{os.pathsep}}webresources"]
       if os.path.isdir(webresources_path)
       else []
   ),
])
print("Build complete. Check the dist folder for {executable_name}.")
"""
        self._write_text("build_app.py", build_app_py)
        generated_files.append("build_app.py")

        requirements = """PyQt6>=6.5,<7
PyQt6-WebEngine>=6.5,<7
msal>=1.24,<2
requests>=2.31,<3
pyinstaller>=6,<7
"""
        self._write_text("requirements.txt", requirements)
        generated_files.append("requirements.txt")

        gitignore = """__pycache__/
*.py[cod]
.venv/
venv/
build/
dist/
*.spec
verseoff_local.db
verseoff_token_cache.bin
"""
        self._write_text(".gitignore", gitignore)
        generated_files.append(".gitignore")

        run_app = """@echo off
setlocal
cd /d "%~dp0"
python main.py
"""
        self._write_text("run_app.bat", run_app)
        generated_files.append("run_app.bat")

        self._write_text("README.md", self._project_readme(manifest))
        generated_files.append("README.md")

        self._validate_generated_python(generated_files)
        logger.info("Generation complete.")
        return generated_files

    def _materialize_web_resources(self, manifest):
        generated_files = []
        paths_by_resource = {}
        for resource in manifest.get("web_resources", []):
            if isinstance(resource, str):
                continue
            name = resource.get("name")
            content = resource.pop("content", None)
            content_base64 = resource.pop("content_base64", None)
            if not name or (
                content is None
                and content_base64 is None
            ):
                continue
            relative_path = safe_web_resource_path(name)
            collision = paths_by_resource.get(
                relative_path.casefold()
            )
            if collision and collision != name:
                raise ValueError(
                    "Web resource path collision after sanitization: "
                    f"{collision!r} and {name!r}."
                )
            paths_by_resource[relative_path.casefold()] = name
            output_path = os.path.abspath(os.path.join(self.output_dir, relative_path))
            if os.name == "nt" and not output_path.startswith("\\\\?\\"):
                output_path = "\\\\?\\" + output_path
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            if content is not None:
                payload = content.encode("utf-8")
                with open(
                    output_path,
                    "w",
                    encoding="utf-8",
                    newline="\n",
                ) as resource_file:
                    resource_file.write(content)
            else:
                try:
                    payload = base64.b64decode(
                        content_base64,
                        validate=True,
                    )
                except ValueError as error:
                    raise ValueError(
                        f"Web resource {name!r} has invalid Base64."
                    ) from error
                with open(output_path, "wb") as resource_file:
                    resource_file.write(payload)
            if str(resource.get("type") or "") == "12":
                try:
                    root = ET.fromstring(payload)
                    resource["localized_strings"] = {
                        data.get("name"): data.findtext("value") or ""
                        for data in root.findall(".//data")
                        if data.get("name")
                    }
                except ET.ParseError as error:
                    raise ValueError(
                        f"RESX web resource {name!r} is invalid: {error}"
                    ) from error
            resource["relative_path"] = relative_path.replace("\\", "/")
            resource["sha256"] = hashlib.sha256(
                payload
            ).hexdigest()
            generated_files.append(relative_path)
        return generated_files

    @staticmethod
    def _validate_manifest(manifest: dict):
        if not isinstance(manifest, dict):
            raise TypeError("Manifest must be a dictionary.")
        if not str(manifest.get("app_name") or "").strip():
            raise ValueError("Manifest app_name is required.")
        entities = manifest.get("entities")
        if not isinstance(entities, list) or not entities:
            raise ValueError("Manifest must contain at least one entity definition.")

        logical_names = []
        for entity in entities:
            if not isinstance(entity, dict):
                raise TypeError("Each manifest entity must be a dictionary.")
            logical_name = str(entity.get("LogicalName") or "").strip()
            if not logical_name:
                raise ValueError("Every manifest entity requires LogicalName.")
            logical_names.append(logical_name)
        if len(logical_names) != len(set(logical_names)):
            raise ValueError("Manifest contains duplicate entity logical names.")

    @staticmethod
    def _project_slug(app_name: str) -> str:
        slug = re.sub(r"[^A-Za-z0-9._-]+", "", app_name)
        return slug or "VerseOffApp"

    def _project_readme(self, manifest: dict) -> str:
        app_name = manifest["app_name"]
        source_app = manifest.get("source_app") or {}
        unique_name = source_app.get("uniquename") or "Not recorded"
        entity_names = [
            entity["LogicalName"]
            for entity in manifest.get("entities", [])
        ]
        entity_list = "\n".join(f"- `{name}`" for name in entity_names)
        return f"""# {app_name} - VerseOff source project

This project was generated by VerseOff Maker from the Dataverse model-driven
app `{unique_name}`. It contains the selected app navigation, table metadata,
forms, views, business processes, offline SQLite storage, and Dataverse sync.

## Run from source

```powershell
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
python main.py
```

The first cloud sync opens Microsoft sign-in when no cached account is
available. Local changes remain in `verseoff_local.db` until a sync succeeds.

## Build a Windows executable

```powershell
python build_app.py
```

The executable is written to `dist\\{self._project_slug(app_name)}.exe`.

## Included Dataverse tables

{entity_list}

## Safe customization

Put offline event handlers in `custom_events.py`. VerseOff Maker preserves
that file when this source project is generated again.
"""

    def _write_text(self, output_rel_path: str, content: str):
        output_path = os.path.join(self.output_dir, output_rel_path)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)

    def _validate_generated_python(self, generated_files: list[str]):
        for relative_path in generated_files:
            if not relative_path.endswith(".py"):
                continue
            output_path = os.path.join(self.output_dir, relative_path)
            with open(output_path, "r", encoding="utf-8") as source_file:
                source = source_file.read()
            compile(source, output_path, "exec")

    def _render_template(self, template_name: str, output_rel_path: str, **kwargs):
        template = self.env.get_template(template_name)
        output_path = os.path.join(self.output_dir, output_rel_path)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(template.render(**kwargs))
