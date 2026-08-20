import os
import jinja2
import logging
import json

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
        logger.info(f"Generating app in {self.output_dir}")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 1. Manifest / Config JSON
        # We now dump the entire manifest (including FormXML) so the XRM Form Renderer 
        # can dynamically parse it at runtime.
        config_path = os.path.join(self.output_dir, "manifest.json")
        with open(config_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)

        # 2. Main Entry Point
        self._render_template("generated_main.j2", "main.py", manifest=manifest)
        
        # 3. Database Layer
        self._render_template("generated_db.j2", "db.py", manifest=manifest)
        
        # 4. Sync Engine Layer
        self._render_template("generated_sync.j2", "sync_engine.py", manifest=manifest)
        
        # 5. Mock XRM Bridge
        self._render_template("mock_xrm.j2", "mock_xrm.py", manifest=manifest)
        
        # 6. Custom Events (Offline Extensibility)
        custom_events_path = os.path.join(self.output_dir, "custom_events.py")
        if not os.path.exists(custom_events_path):
            self._render_template("custom_events.j2", "custom_events.py", manifest=manifest)
            logger.info("Scaffolded new custom_events.py.")
        else:
            logger.info("Skipping custom_events.py (already exists).")
            
        # 7. Data Providers (Facade Pattern)
        data_providers_path = os.path.join(self.output_dir, "data_providers.py")
        if not os.path.exists(data_providers_path):
            self._render_template("data_providers.j2", "data_providers.py", manifest=manifest)
            logger.info("Scaffolded new data_providers.py.")
        else:
            logger.info("Skipping data_providers.py (already exists).")

        # 8. Dynamic XRM Form Renderer
        self._render_template("xrm_form_renderer.j2", "xrm_form_renderer.py", manifest=manifest)
        
        # 9. View Parser (LayoutXML/FetchXML)
        self._render_template("view_parser.j2", "view_parser.py", manifest=manifest)
        
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
                    "console": "integratedTerminal"
                }
            ]
        }
        with open(os.path.join(vscode_dir, "launch.json"), "w") as f:
            json.dump(launch_json, f, indent=4)
            
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
        with open(os.path.join(vscode_dir, "tasks.json"), "w") as f:
            json.dump(tasks_json, f, indent=4)
            
        build_app_py = """import PyInstaller.__main__
import os

print("Building Generated Offline App...")
PyInstaller.__main__.run([
    'main.py',
    '--name=VerseOffApp',
    '--onefile',
    '--windowed',
    '--clean'
])
print("Build complete. Check the 'dist' folder for VerseOffApp.exe.")
"""
        with open(os.path.join(self.output_dir, "build_app.py"), "w") as f:
            f.write(build_app_py)
            
        logger.info("Generation complete.")

    def _render_template(self, template_name: str, output_rel_path: str, **kwargs):
        template = self.env.get_template(template_name)
        output_path = os.path.join(self.output_dir, output_rel_path)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(template.render(**kwargs))
