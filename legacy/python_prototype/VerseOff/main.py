import sys
import logging

try:
    from PyQt6.QtWidgets import QApplication
except ImportError:
    print("Error: PyQt6 is not installed. Please run: pip install PyQt6")
    sys.exit(1)

from maker_ui import MakerWizard

def global_exception_handler(exc_type, exc_value, exc_traceback):
    import traceback
    from PyQt6.QtWidgets import QMessageBox
    error_msg = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))
    logging.error(f"CRASH: {error_msg}")
    try:
        msg_box = QMessageBox()
        msg_box.setIcon(QMessageBox.Icon.Critical)
        msg_box.setWindowTitle("Critical Application Error")
        msg_box.setText("An unexpected error occurred!")
        msg_box.setDetailedText(error_msg)
        msg_box.exec()
    except Exception:
        pass


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

def main():
    sys.excepthook = global_exception_handler
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s - %(message)s")
    
    app = SafeApplication(sys.argv)
    
    # Set global stylesheet for a more modern look
    app.setStyleSheet("""
        QWizard {
            background-color: #f5f5f5;
        }
        QPushButton {
            background-color: #0078d4;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
        }
        QPushButton:hover {
            background-color: #106ebe;
        }
        QPushButton:disabled {
            background-color: #c8c8c8;
            color: #505050;
        }
        QLineEdit, QListWidget {
            padding: 8px;
            border: 1px solid #d2d2d2;
            border-radius: 4px;
            background-color: white;
        }
    """)
    
    wizard = MakerWizard()
    wizard.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
