import PyInstaller.__main__
import os
import shutil

# Ensure we are in the right directory
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# We need to explicitly bundle the 'templates' folder.
# PyInstaller syntax: --add-data "source_path;destination_folder_in_exe"
templates_path = os.path.join(script_dir, "templates")
add_data_arg = f"{templates_path};templates"

print(f"Building VerseOff Maker CLI...")
print(f"Bundling templates from: {templates_path}")

PyInstaller.__main__.run([
    'main.py',
    '--name=VerseOffMaker',
    '--onefile',
    '--windowed', # GUI application, hide console
    f'--add-data={add_data_arg}',
    '--clean'
])

print("Build complete. Check the 'dist' folder for VerseOffMaker.exe.")
