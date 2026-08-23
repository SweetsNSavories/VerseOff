import os
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
   "--name=CustomerServiceHub",
   "--onefile",
   "--windowed",
   "--clean",
   "--noconfirm",
   f"--add-data={manifest_path}{os.pathsep}.",
   f"--add-data={bridge_path}{os.pathsep}.",
   f"--add-data={pcf_host_path}{os.pathsep}.",
   f"--add-data={chevron_path}{os.pathsep}.",
   *(
       [f"--add-data={webresources_path}{os.pathsep}webresources"]
       if os.path.isdir(webresources_path)
       else []
   ),
])
print("Build complete. Check the dist folder for CustomerServiceHub.")
