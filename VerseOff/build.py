from pathlib import Path

import PyInstaller.__main__


def main():
    project_dir = Path(__file__).resolve().parent
    spec_path = project_dir / "VerseOffMaker.spec"
    print("Building VerseOff Maker...")
    PyInstaller.__main__.run([
        str(spec_path),
        "--clean",
        "--noconfirm",
        f"--distpath={project_dir / 'dist'}",
        f"--workpath={project_dir / 'build'}",
    ])
    print(
        "Build complete: "
        f"{project_dir / 'dist' / 'VerseOffMaker.exe'}"
    )


if __name__ == "__main__":
    main()
