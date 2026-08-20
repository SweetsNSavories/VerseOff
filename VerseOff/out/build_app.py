import PyInstaller.__main__
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
