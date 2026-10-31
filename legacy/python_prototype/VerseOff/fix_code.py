import os

def fix_xrm_renderer():
    path = "templates/xrm_form_renderer.j2"
    with open(path, "r") as f:
        content = f.read()
    content = content.replace("from db import get_db_connection", "from db import LocalDatabase")
    content = content.replace("get_db_connection()", "LocalDatabase().get_connection()")
    with open(path, "w") as f:
        f.write(content)

def add_exception_hook(path):
    hook_code = """
import traceback
def global_exception_handler(exc_type, exc_value, exc_traceback):
    from PyQt6.QtWidgets import QMessageBox
    error_msg = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))
    print(f"CRASH: {error_msg}")
    msg_box = QMessageBox()
    msg_box.setIcon(QMessageBox.Icon.Critical)
    msg_box.setWindowTitle("Critical Application Error")
    msg_box.setText("An unexpected error occurred!")
    msg_box.setDetailedText(error_msg)
    msg_box.exec()
sys.excepthook = global_exception_handler
"""
    with open(path, "r") as f:
        content = f.read()
    
    # inject after import sys
    if "global_exception_handler" not in content:
        content = content.replace("import sys", "import sys" + hook_code, 1)
        with open(path, "w") as f:
            f.write(content)

if __name__ == "__main__":
    fix_xrm_renderer()
    add_exception_hook("main.py")
    add_exception_hook("templates/generated_main.j2")
    print("Fixes applied.")
