import os
import sys
import json
import logging

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "VerseOff")))

from auth import MsalAuth
from metadata_fetcher import MetadataFetcher
from code_generator import CodeGenerator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

ORG_URL = os.getenv("D365_ORG_URL", "https://your-org.crm.dynamics.com/")
CLIENT_ID = os.getenv("D365_CLIENT_ID", "your-client-id-here")

def main():
    logger.info(f"Connecting to Dataverse {ORG_URL}...")
    auth = MsalAuth(org_url=ORG_URL, client_id=CLIENT_ID)
    token = auth.get_token()
    if not token:
        logger.error("Could not obtain auth token.")
        return 1
        
    logger.info("Authenticated successfully. Initializing MetadataFetcher...")
    fetcher = MetadataFetcher(ORG_URL, token)
    
    # 1. Get App Modules
    apps = fetcher.get_app_modules()
    logger.info(f"Discovered {len(apps)} Model-Driven Apps.")
    
    target_app = None
    for app in apps:
        name = app.get("name", "")
        unique = app.get("uniquename", "")
        logger.info(f" - Found App: '{name}' ({unique}) [ID: {app.get('appmoduleid')}]")
        if "customer service" in name.lower() or "service" in name.lower() or "customerservice" in unique.lower():
            target_app = app
            break
            
    if not target_app and apps:
        target_app = apps[0]
        
    if not target_app:
        logger.error("No Model-Driven App found.")
        return 1
        
    app_id = target_app.get("appmoduleid")
    app_name = target_app.get("name", "Customer Service workspace")
    logger.info(f"Selected Target App: '{app_name}' (ID: {app_id})")
    
    # 2. Extract SiteMap & BPFs
    sitemap = fetcher.get_app_sitemap(app_id)
    bpfs = fetcher.get_bpf_definitions_for_app(app_id)
    logger.info(f"SiteMap extracted with {len(sitemap.get('areas', []))} areas.")
    logger.info(f"Extracted {len(bpfs)} Business Process Flows.")
    
    # 3. Extract Entities for App
    entities_in_app = fetcher.get_entities_for_app(app_id)
    logger.info(f"App contains {len(entities_in_app)} entities.")
    
    manifest_entities = []
    # Primary entities to extract full FormXml, Views, Ribbons
    for ent in entities_in_app:
        logical_name = ent.get("LogicalName")
        if not logical_name: continue
        logger.info(f"Extracting full metadata, FormXml, SavedQueries, & RibbonXml for: '{logical_name}'...")
        try:
            ent_def = fetcher.get_entity_definition(logical_name)
            manifest_entities.append(ent_def)
        except Exception as e:
            logger.warning(f"Error fetching {logical_name}: {e}")
            
    logger.info("Extracting WebResource dependencies...")
    import re
    import base64
    web_resources_dict = {}
    pending_resources = set()

    def add_resource(name):
        if not name: return
        name = name.replace("$webresource:", "").strip()
        if name and name not in web_resources_dict:
            pending_resources.add(name)

    for ent_def in manifest_entities:
        for form in ent_def.get("forms", []):
            formxml = form.get("formxml", "")
            for match in re.finditer(r'<Handler[^>]+library=["\']([^"\']+)["\']', formxml, re.IGNORECASE):
                add_resource(match.group(1))
            
        ribbon = ent_def.get("ribbon", {})
        for cmd in ribbon.get("commands", {}).values():
            for action in cmd.get("actions", []):
                if action.get("type") == "JavaScriptFunction":
                    add_resource(action.get("library"))
        
        for rule_list in (ribbon.get("enable_rules", {}).values(), ribbon.get("display_rules", {}).values()):
            for rules in rule_list:
                for rule in rules:
                    if rule.get("type") == "CustomRule":
                        add_resource(rule.get("library"))
        
        ribbon_json = json.dumps(ribbon)
        for match in re.finditer(r'\$webresource:([a-zA-Z0-9_\-\.]+)', ribbon_json):
            add_resource(match.group(1))

    logger.info(f"Identified {len(pending_resources)} root web resources to download.")
    
    while pending_resources:
        current_batch = list(pending_resources)
        pending_resources.clear()
        
        for name in current_batch:
            if name in web_resources_dict:
                continue
            logger.info(f"Downloading WebResource: {name}")
            try:
                wr = fetcher.get_web_resource(name)
                if wr:
                    web_resources_dict[name] = wr
                    if str(wr.get("type")) == "3" or name.endswith(".js"):
                        try:
                            # 1. Parse Dataverse declarative dependency XML (highly reliable)
                            dep_xml = wr.get("dependency_xml") or ""
                            for m in re.finditer(r'<Dependency[^>]*componentType=["\']WebResource["\'][^>]*>\s*([^<]+)\s*</Dependency>', dep_xml, re.IGNORECASE):
                                add_resource(m.group(1))
                                
                            # 2. Heuristic parsing for dynamic imports
                            if "content" in wr:
                                content = wr["content"]
                            else:
                                content = base64.b64decode(wr.get("content_base64", "")).decode("utf-8")
                                
                            for m in re.finditer(r'openWebResource\s*\(\s*["\']([^"\']+)["\']', content):
                                add_resource(m.group(1))
                            for m in re.finditer(r'require\s*\(\s*\[["\']([^"\']+)["\']', content):
                                add_resource(m.group(1))
                        except Exception as e:
                            logger.warning(f"Error extracting dependencies for {name}: {e}")
            except Exception as e:
                logger.warning(f"Failed to download web resource {name}: {e}")

    manifest = {
        "app_name": app_name,
        "org_url": ORG_URL,
        "client_id": CLIENT_ID,
        "sync_interval": 300,
        "sitemap": sitemap,
        "bpfs": bpfs,
        "entities": manifest_entities,
        "web_resources": list(web_resources_dict.values())
    }
    
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "VerseOff", "out"))
    os.makedirs(out_dir, exist_ok=True)
    manifest_path = os.path.join(out_dir, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    logger.info(f"Saved complete manifest ({len(manifest_entities)} entities) to {manifest_path}")
    
    # 4. Generate Target App
    logger.info(f"Generating target offline client into {out_dir}...")
    generator = CodeGenerator(out_dir)
    generator.generate(manifest)
    logger.info("Target application generation complete!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
