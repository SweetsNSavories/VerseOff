import os
import json
from code_generator import CodeGenerator

def main():
    print("Loading mock manifest...")
    with open("mock_manifest.json", "r") as f:
        manifest = json.load(f)

    for e in manifest.get("entities", []):
        if "logical_name" in e:
            e["LogicalName"] = e.pop("logical_name")
        if "display_name" in e:
            e["DisplayName"] = e.pop("display_name")
        if "primary_id" in e:
            e["PrimaryIdAttribute"] = e.pop("primary_id")
        if "primary_name" in e:
            e["PrimaryNameAttribute"] = e.pop("primary_name")
        
    out_dir = os.path.join(os.getcwd(), "out")
    print(f"Generating app to {out_dir}...")
    
    generator = CodeGenerator(out_dir)
    generator.generate(manifest)
    
    print("Generation complete! Now building EXE from out directory...")
    
    os.chdir(out_dir)
    import subprocess
    subprocess.run(["python", "build_app.py"], check=True)
    
    print("All done! The generated offline CRM app is at: out/dist/VerseOffApp.exe")

if __name__ == "__main__":
    main()
