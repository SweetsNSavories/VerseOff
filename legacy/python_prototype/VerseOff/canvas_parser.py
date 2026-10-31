import json
import logging
from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QPushButton, QLineEdit

logger = logging.getLogger(__name__)

class CanvasParser:
    """
    Experimental Module: Unpacks .msapp / canvasapp JSON payloads
    and attempts to map standard Canvas controls to PyQt6 widgets.
    """
    
    @staticmethod
    def parse_canvas_layout(canvas_json_str: str) -> QWidget:
        """
        Parses a Canvas App JSON document and returns a rendered PyQt widget.
        NOTE: PowerFX logic is skipped/stubbed. Only structural layout is generated.
        """
        container = QWidget()
        layout = QVBoxLayout(container)
        
        try:
            data = json.loads(canvas_json_str)
            # The structure of .msapp YAML/JSON varies by version. 
            # We look for a basic Controls array.
            controls = data.get("Controls", [])
            
            for ctrl in controls:
                ctrl_type = ctrl.get("Template", {}).get("Name", "")
                ctrl_name = ctrl.get("Name", "Control")
                
                # Render label
                if ctrl_type == "Label":
                    text = ctrl.get("Properties", {}).get("Text", "Label")
                    layout.addWidget(QLabel(f"{ctrl_name}: {text}"))
                    
                # Render Input
                elif ctrl_type == "Text":
                    default = ctrl.get("Properties", {}).get("Default", "")
                    inp = QLineEdit(default)
                    layout.addWidget(inp)
                    
                # Render Button
                elif ctrl_type == "Button":
                    text = ctrl.get("Properties", {}).get("Text", "Button")
                    btn = QPushButton(text)
                    # PowerFX OnSelect logic is stubbed
                    btn.clicked.connect(lambda _, name=ctrl_name: logger.info(f"Button {name} clicked. PowerFX logic not executed offline."))
                    layout.addWidget(btn)
                    
                else:
                    # Unknown canvas control
                    layout.addWidget(QLabel(f"[{ctrl_type}] {ctrl_name} (Unsupported Offline)"))
                    
            layout.addStretch()
            
        except Exception as e:
            logger.error(f"Failed to parse Canvas JSON: {e}")
            layout.addWidget(QLabel(f"Canvas Parsing Error: {e}"))
            
        return container
