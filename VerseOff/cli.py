import argparse
import json
import logging
import sys
import os

from code_generator import CodeGenerator
# In a full flow, you'd also import metadata_fetcher, form_parser, etc. 
# to build the manifest if it's not provided. For the VS Code extension
# we assume the extension sends a fully formed manifest.

logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description="VerseOff Code Generator CLI")
    parser.add_argument("--manifest", type=str, required=True, help="Path to the JSON manifest file")
    parser.add_argument("--output", type=str, default="./generated_app", help="Output directory for the generated app")
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging")

    args = parser.parse_args()

    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    if not os.path.exists(args.manifest):
        logger.error(f"Manifest file not found: {args.manifest}")
        sys.exit(1)

    try:
        with open(args.manifest, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse manifest JSON: {e}")
        sys.exit(1)

    logger.info(f"Loaded manifest for app: {manifest.get('app_name')}")
    
    # Initialize and run code generator
    generator = CodeGenerator(args.output)
    generator.generate(manifest)
    
    logger.info(f"Generation complete! Output at: {args.output}")

if __name__ == "__main__":
    main()
