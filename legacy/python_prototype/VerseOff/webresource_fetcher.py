import requests
import base64
import logging
import os

logger = logging.getLogger(__name__)

class WebResourceFetcher:
    def __init__(self, dataverse_url: str, auth_token: str):
        self.org_url = dataverse_url.rstrip("/")
        self.base_url = self.org_url + "/api/data/v9.2"
        self.headers = {
            "Authorization": f"Bearer {auth_token}",
            "Accept": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0"
        }

    def _get(self, endpoint: str, params: dict = None) -> dict:
        url = f"{self.base_url}{endpoint}"
        resp = requests.get(url, headers=self.headers, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def fetch_webresource(self, name: str) -> str:
        """
        Fetches a web resource by name and decodes its Base64 content.
        Returns the decoded string (usually JS content).
        """
        try:
            data = self._get(
                "/webresourceset",
                params={
                    "$filter": f"name eq '{name}'",
                    "$select": "name,content"
                }
            )
            results = data.get("value", [])
            if not results:
                logger.warning(f"Web resource '{name}' not found.")
                return ""
                
            b64_content = results[0].get("content")
            if b64_content:
                return base64.b64decode(b64_content).decode("utf-8", errors="replace")
            return ""
        except Exception as e:
            logger.error(f"Failed to fetch web resource {name}: {e}")
            return ""

    def download_form_scripts(self, form_dict: dict, output_dir: str):
        """
        Extracts script references from a parsed Form dictionary and downloads them.
        Saves the JS files to the specified output directory.
        """
        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)
        
        # This assumes the form_parser adds an 'events' list to the form dict
        # e.g., form_dict['events'] = [{'library': 'new_myscript.js', 'function': 'OnLoad'}, ...]
        events = form_dict.get("events", [])
        libraries = {evt.get("library") for evt in events if evt.get("library")}
        
        for lib in libraries:
            logger.info(f"Downloading web resource: {lib}")
            content = self.fetch_webresource(lib)
            if content:
                # Replace invalid filename characters just in case
                safe_name = lib.replace("/", "_").replace("\\", "_")
                file_path = os.path.join(output_dir, safe_name)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                logger.info(f"Saved {lib} to {file_path}")

    def fetch_ribbon_metadata(self, entity_logical_name: str) -> dict:
        """
        Attempts to fetch RibbonClientMetadata for a given entity.
        Returns the raw ribbon definition.
        """
        try:
            data = self._get(
                "/ribbonclientmetadata",
                params={
                    "$filter": f"entity eq '{entity_logical_name}'"
                }
            )
            results = data.get("value", [])
            if results:
                return results[0]
            return {}
        except requests.exceptions.HTTPError as e:
            logger.warning(f"Failed to fetch ribbon metadata for {entity_logical_name}: {e}")
            return {}
