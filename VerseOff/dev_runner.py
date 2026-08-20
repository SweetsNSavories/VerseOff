import os
import sys
import time
import subprocess
import logging
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
except ImportError:
    print("Error: 'watchdog' is not installed. Run 'pip install watchdog' for Live Reloading.")
    sys.exit(1)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

class AppReloader(FileSystemEventHandler):
    def __init__(self, target_dir, app_script):
        self.target_dir = target_dir
        self.app_script = app_script
        self.process = None
        self.restart_app()

    def restart_app(self):
        if self.process:
            logger.info("Changes detected. Restarting PyQt application...")
            self.process.terminate()
            self.process.wait()
        else:
            logger.info("Starting PyQt application for Live Preview...")
            
        # Launch the generated app in the target directory
        env = os.environ.copy()
        env["PYTHONPATH"] = self.target_dir
        
        try:
            self.process = subprocess.Popen(
                [sys.executable, self.app_script],
                cwd=self.target_dir,
                env=env
            )
        except Exception as e:
            logger.error(f"Failed to start app: {e}")

    def on_modified(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith('.py') or event.src_path.endswith('.json') or event.src_path.endswith('.js'):
            # Basic debounce
            time.sleep(0.5)
            self.restart_app()

    def on_created(self, event):
        self.on_modified(event)

def main():
    import argparse
    parser = argparse.ArgumentParser(description="VerseOff Live Reloader")
    parser.add_argument("--dir", default="./generated_app", help="Directory of the generated app")
    parser.add_argument("--entry", default="main.py", help="Entry script of the app")
    args = parser.parse_args()

    app_dir = os.path.abspath(args.dir)
    app_script = args.entry

    if not os.path.exists(app_dir):
        logger.warning(f"Directory {app_dir} does not exist yet. Waiting...")
        os.makedirs(app_dir, exist_ok=True)

    event_handler = AppReloader(app_dir, app_script)
    observer = Observer()
    observer.schedule(event_handler, app_dir, recursive=True)
    observer.start()

    logger.info(f"Watching {app_dir} for changes...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        if event_handler.process:
            event_handler.process.terminate()
    observer.join()

if __name__ == "__main__":
    main()
