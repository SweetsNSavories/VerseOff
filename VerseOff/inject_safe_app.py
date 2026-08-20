import os

def upgrade_to_safe_application(path):
    safe_app_code = """
class SafeApplication(QApplication):
    def notify(self, receiver, event):
        try:
            return super().notify(receiver, event)
        except Exception as e:
            import traceback
            from PyQt6.QtWidgets import QMessageBox
            import logging
            error_msg = "".join(traceback.format_exception(type(e), e, e.__traceback__))
            logging.error(f"CRASH PREVENTED: {error_msg}")
            try:
                msg_box = QMessageBox()
                msg_box.setIcon(QMessageBox.Icon.Critical)
                msg_box.setWindowTitle("Application Error")
                msg_box.setText("An unexpected error occurred, but the application was kept alive.")
                msg_box.setDetailedText(error_msg)
                msg_box.exec()
            except:
                pass
            return False
"""
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "class SafeApplication" not in content:
        # Insert SafeApplication class
        content = content.replace("def main():", safe_app_code + "\ndef main():", 1)
        # Replace app instantiation
        content = content.replace("app = QApplication(sys.argv)", "app = SafeApplication(sys.argv)")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    upgrade_to_safe_application("main.py")
    upgrade_to_safe_application("templates/generated_main.j2")
    # Also update the out/main.py if it exists
    if os.path.exists("out/main.py"):
        upgrade_to_safe_application("out/main.py")
    print("SafeApplication injected globally.")
