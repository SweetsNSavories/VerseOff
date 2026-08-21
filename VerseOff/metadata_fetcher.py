"""
metadata_fetcher.py
Connects to Dataverse Web API and fetches ALL metadata needed for offline app generation.
Covers: AppModules, SiteMap, Entities (with IsAvailableOffline), Attributes (all types),
        SystemForms (FormXML - merged including managed layers), OptionSets,
        Status/State option sets, and Business Rules (for reference).
"""
import json
import logging
import base64
import zipfile
import io
import xml.etree.ElementTree as ET
import os
import json
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class MetadataFetcher:
    def __init__(self, dataverse_url: str, auth_token: str, use_cache: bool = True):
        from urllib.parse import urlparse
        parsed = urlparse(dataverse_url.rstrip("/"))
        self.org_url = f"{parsed.scheme}://{parsed.netloc}"
        self.base_url = self.org_url + "/api/data/v9.2"
        self.headers = {
            "Authorization": f"Bearer {auth_token}",
            "Accept": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            "Prefer": "odata.include-annotations=OData.Community.Display.V1.FormattedValue",
        }
        
        self.use_cache = use_cache
        from urllib.parse import urlparse
        parsed = urlparse(self.base_url)
        org_domain = parsed.netloc.split('.')[0] if parsed.netloc else "default_org"
        self.cache_dir = os.path.join("metadata_cache", org_domain)
        
        if self.use_cache:
            os.makedirs(self.cache_dir, exist_ok=True)

    def _get_cache_path(self, endpoint: str, params: dict = None) -> str:
        import re
        import hashlib
        
        # Extract logical name for directory grouping
        entity_name = "global"
        
        # Check standard LogicalName/EntityName in endpoint
        match = re.search(r"(?:LogicalName|EntityName)='([^']+)'", endpoint)
        if match:
            entity_name = match.group(1)
            
        # Check filter params for forms and views
        elif params and "$filter" in params:
            f_match = re.search(r"(?:objecttypecode|returnedtypecode) eq '([^']+)'", params["$filter"])
            if f_match:
                entity_name = f_match.group(1)
        
        # Clean the endpoint for the filename
        clean_endpoint = re.sub(r"\((?:LogicalName|EntityName)='[^']+'\)", "", endpoint)
        clean_endpoint = re.sub(r'[^\w\-\.]', '_', clean_endpoint).strip("_")
        if len(clean_endpoint) > 50:
            clean_endpoint = clean_endpoint[:50]
        
        # Hash params to ensure unique filenames for different queries
        param_hash = ""
        if params:
            param_hash = "_" + hashlib.md5(json.dumps(params, sort_keys=True).encode()).hexdigest()[:8]
            
        filename = f"{clean_endpoint}{param_hash}.json"
        
        entity_dir = os.path.join(self.cache_dir, entity_name)
        os.makedirs(entity_dir, exist_ok=True)
        return os.path.join(entity_dir, filename)

    def _read_cache(self, endpoint: str, params: dict = None):
        if not self.use_cache:
            return None
        path = self._get_cache_path(endpoint, params)
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning(f"Failed to read cache {path}: {e}")
        return None

    def _write_cache(self, endpoint: str, params: dict, data):
        if not self.use_cache:
            return
        path = self._get_cache_path(endpoint, params)
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to write cache {path}: {e}")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _get(self, endpoint: str, params: dict = None, timeout: int = 30) -> dict:
        """GET request against the Dataverse Web API."""
        cached_data = self._read_cache(endpoint, params)
        if cached_data is not None:
            return cached_data
            
        url = f"{self.base_url}{endpoint}"
        resp = requests.get(url, headers=self.headers, params=params, timeout=timeout)
        try:
            resp.raise_for_status()
        except requests.exceptions.HTTPError as e:
            raise Exception(f"HTTP Error: {e}\nResponse: {resp.text}") from e
            
        data = resp.json()
        self._write_cache(endpoint, params, data)
        return data

    def _get_all_pages(self, endpoint: str, params: dict = None) -> list:
        """Follow OData @odata.nextLink pagination to get all results."""
        cache_endpoint = endpoint + "_all_pages"
        cached_data = self._read_cache(cache_endpoint, params)
        if cached_data is not None:
            return cached_data
            
        results = []
        url = f"{self.base_url}{endpoint}"
        current_params = params
        while url:
            resp = requests.get(url, headers=self.headers, params=current_params, timeout=30)
            try:
                resp.raise_for_status()
            except requests.exceptions.HTTPError as e:
                raise Exception(f"HTTP Error: {e}\nResponse: {resp.text}") from e
                
            data = resp.json()
            results.extend(data.get("value", []))
            
            # Next link is usually absolute
            url = data.get("@odata.nextLink")
            current_params = None  # Next link includes its own params
            
        self._write_cache(cache_endpoint, params, results)
        return results

    # ------------------------------------------------------------------
    # Identity / Connection validation
    # ------------------------------------------------------------------

    def who_am_i(self) -> dict:
        """Validates the connection and returns the current user's info."""
        return self._get("/WhoAmI")

    # ------------------------------------------------------------------
    # App Modules
    # ------------------------------------------------------------------

    def get_app_modules(self) -> list[dict]:
        """Returns all Model-Driven Apps in the environment."""
        return self._get_all_pages(
            "/appmodules",
            params={"$select": "name,uniquename,description,appmoduleid,appmoduleidunique,formfactor"}
        )

    # ------------------------------------------------------------------
    # SiteMap — navigation structure
    # ------------------------------------------------------------------

    def _get_sitemap_xml(self, app_module_id: str) -> str:
        try:
            app_data = self._get(
                f"/appmodules({app_module_id})",
                params={"$select": "appmoduleidunique"}
            )
            uid = app_data.get("appmoduleidunique")
            if not uid:
                return ""

            components = self._get_all_pages(
                "/appmodulecomponents",
                params={
                    "$filter": f"_appmoduleidunique_value eq {uid} and componenttype eq 62",
                    "$select": "objectid"
                }
            )
            if not components:
                return ""
                
            sitemap_id = components[0]["objectid"]
            sitemap = self._get(f"/sitemaps({sitemap_id})", params={"$select": "sitemapxml"})
            return sitemap.get("sitemapxml", "")
        except Exception as e:
            logger.warning(f"Could not fetch sitemap for app {app_module_id}: {e}")
            return ""

    def get_sitemap_entities(self, app_module_id: str) -> list[dict]:
        """
        Fetches the SiteMap XML for a given AppModule and extracts entity logical names
        along with their AvailableOffline attribute.

        Returns a list of dicts: [{"entity": "incident", "available_offline": True}, ...]
        """
        sitemap_xml = self._get_sitemap_xml(app_module_id)
        if not sitemap_xml:
            logger.warning(f"No sitemap found for app {app_module_id}")
            return []

        return _parse_sitemap_entities(sitemap_xml)
        
    def get_app_sitemap(self, app_module_id: str) -> dict:
        """
        Fetches the SiteMap XML for a given AppModule and returns the full hierarchical
        Area > Group > SubArea structure.
        """
        sitemap_xml = self._get_sitemap_xml(app_module_id)
        if not sitemap_xml:
            logger.warning(f"No sitemap found for app {app_module_id}")
            return {"areas": []}

        return _parse_sitemap_hierarchy(sitemap_xml)

    # ------------------------------------------------------------------
    # Entity Definitions
    # ------------------------------------------------------------------

    def get_entities_for_app(self, app_module_id: str) -> list[dict]:
        """
        Returns entity definitions for all entities in the app module.
        Includes IsAvailableOffline, EntitySetName, and display info.
        """
        # First, we must resolve the appmoduleid to its appmoduleidunique
        # because appmodulecomponents only link via the unique ID.
        app_data = self._get(
            f"/appmodules({app_module_id})",
            params={"$select": "appmoduleidunique"}
        )
        uid = app_data.get("appmoduleidunique")
        if not uid:
            raise Exception("Could not resolve appmoduleidunique for the selected app.")

        # Fetch AppModuleComponents of type 1 (Entity)
        components = self._get_all_pages(
            "/appmodulecomponents",
            params={
                "$filter": f"_appmoduleidunique_value eq {uid} and componenttype eq 1",
                "$select": "objectid"
            }
        )
        entity_ids = [c["objectid"] for c in components]

        entities = []
        for eid in entity_ids:
            try:
                meta = self._get(
                    f"/EntityDefinitions({eid})",
                    params={
                        "$select": (
                            "LogicalName,DisplayName,DisplayCollectionName,"
                            "EntitySetName,PrimaryIdAttribute,PrimaryNameAttribute,"
                            "IsAvailableOffline,IsActivity,ObjectTypeCode,DataProviderId"
                        )
                    }
                )
                # Skip virtual entities (DataProviderId is populated for virtual entities)
                if meta.get("DataProviderId") is not None:
                    logger.info(f"Skipping virtual entity: {meta.get('LogicalName')}")
                    continue
                entities.append(meta)
            except Exception as e:
                logger.warning(f"Could not fetch entity {eid}: {e}")

        return entities

    def download_organization_topology(self):
        """Downloads globally applicable configuration, security roles, and user topology."""
        logger.info("Downloading Global Option Sets...")
        self._get_all_pages("/GlobalOptionSetDefinitions")
        
        logger.info("Downloading Business Units...")
        self._get_all_pages("/businessunits", params={"$select": "businessunitid,name,_parentbusinessunitid_value"})
        
        logger.info("Downloading Teams...")
        self._get_all_pages("/teams", params={"$select": "teamid,name,_businessunitid_value,isdefault"})
        
        logger.info("Downloading Security Roles...")
        self._get_all_pages("/roles", params={"$select": "roleid,name,_businessunitid_value"})
        
        logger.info("Downloading Privileges...")
        self._get_all_pages("/privileges", params={"$select": "privilegeid,name,accessright"})
        
        logger.info("Downloading Role-Privilege Mappings...")
        self._get_all_pages("/roleprivilegescollection")
        
        logger.info("Downloading Active System Users...")
        self._get_all_pages("/systemusers", params={
            "$select": "systemuserid,fullname,domainname,_businessunitid_value",
            "$filter": "isdisabled eq false"
        })
        
        logger.info("Downloading Canvas Apps (Custom Pages)...")
        self._get_all_pages("/canvasapps")
        
        logger.info("Downloading PCF Custom Controls Metadata...")
        self._get_all_pages("/customcontrols")
        
        logger.info("Topology download complete!")

    def get_entity_definition(self, logical_name: str) -> dict:
        """Returns full entity definition for a single entity by logical name."""
        entity_def = self._get(
            f"/EntityDefinitions(LogicalName='{logical_name}')",
            params={
                "$select": (
                    "LogicalName,DisplayName,EntitySetName,PrimaryIdAttribute,"
                    "PrimaryNameAttribute,IsAvailableOffline,IsActivity,"
                    "ObjectTypeCode,OwnershipType,DataProviderId"
                )
            }
        )
        
        entity_def["attributes"] = self.get_entity_attributes(logical_name)
        entity_def["option_sets"] = self.get_entity_option_sets(logical_name)
        entity_def["forms"] = self.get_main_and_quick_forms(logical_name)
        entity_def["saved_queries"] = self.get_saved_queries_for_entity(logical_name)
        entity_def["ribbon_buttons"] = self._fetch_ribbon_buttons(logical_name)
        entity_def["relationships"] = self.get_all_relationships_for_entity(logical_name)
        entity_def["lookup_targets"] = self.get_lookup_targets(logical_name)
        
        return entity_def

    def _fetch_ribbon_buttons(self, logical_name: str) -> list[dict]:
        logger.info(f"Extracting Ribbon XML for {logical_name}...")
        buttons = []
        try:
            # RibbonLocationFilters.All = 1
            url = f"/RetrieveEntityRibbon(EntityName='{logical_name}',RibbonLocationFilter=Microsoft.Dynamics.CRM.RibbonLocationFilters'1')"
            data = self._get(url, timeout=6)
            
            base64_zip = data.get("CompressedEntityXml")
            if not base64_zip:
                logger.warning(f"No CompressedEntityXml returned for {logical_name}")
                return buttons
                
            # Unzip in memory
            zip_bytes = base64.b64decode(base64_zip)
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
                if "RibbonXml.xml" in z.namelist():
                    xml_content = z.read("RibbonXml.xml")
                    root = ET.fromstring(xml_content)
                    
                    # 0. Parse LocLabels
                    loc_labels_map = {}
                    loc_labels_elem = root.find(".//LocLabels")
                    if loc_labels_elem is not None:
                        for loc in loc_labels_elem.findall(".//LocLabel"):
                            loc_id = loc.get("Id")
                            if not loc_id: continue
                            title_elem = loc.find(".//Titles/Title")
                            if title_elem is not None:
                                loc_labels_map[loc_id] = title_elem.get("description") or title_elem.get("Title") or ""

                    # Helper to resolve raw token
                    def resolve_label(raw_lbl: str, btn_id_str: str) -> str:
                        if not raw_lbl:
                            return ""
                        if raw_lbl.startswith("$LocLabels:"):
                            key = raw_lbl.replace("$LocLabels:", "")
                            if key in loc_labels_map and loc_labels_map[key]:
                                return loc_labels_map[key]
                        
                        clean_tok = raw_lbl.replace("$Resources:", "").replace("$LocLabels:", "")
                        std_map = {
                            "Save.Save": "Save",
                            "Save.SaveAndClose": "Save & Close",
                            "Save.SaveAndNew": "Save & New",
                            "Save.SaveAsComplete": "Complete",
                            "HomepageGrid.MainTab.New": "New",
                            "Form.MainTab.New": "New",
                            "Actions.Delete": "Delete",
                            "Actions.Refresh": "Refresh",
                            "Actions.Deactivate": "Deactivate",
                            "Status.Activate": "Activate",
                            "Actions.Assign": "Assign",
                            "Actions.Share": "Share",
                            "OpenRecordOnWeb": "Open in Web",
                            "SetRegarding": "Set Regarding",
                            "QueueItemDetail": "Queue Details"
                        }
                        for k, v in std_map.items():
                            if k.lower() in clean_tok.lower():
                                return v
                        parts = clean_tok.split(".")
                        candidates = [p for p in parts if p not in ("Button", "Label", "Title", "MainTab", "Form", "Ribbon", "HomepageGrid", "Record", "Actions", "Status")]
                        if candidates:
                            import re
                            words = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|\d|\W|$)|\d+', candidates[-1])
                            if words:
                                return " ".join(words).title()
                            return candidates[-1].title()
                        return raw_lbl

                    # 1. Parse Rule Definitions
                    rules_map = {} # id -> list of rule conditions
                    rule_defs = root.find(".//RuleDefinitions")
                    if rule_defs is not None:
                        for rule_type in ['DisplayRules', 'EnableRules']:
                            container = rule_defs.find(f".//{rule_type}")
                            if container is not None:
                                for rule in container:
                                    rule_id = rule.get('Id')
                                    conditions = []
                                    # Extract FormStateRule
                                    for fs_rule in rule.findall(".//FormStateRule"):
                                        conditions.append({"type": "FormStateRule", "state": fs_rule.get("State")})
                                    # Extract ValueRule
                                    for v_rule in rule.findall(".//ValueRule"):
                                        conditions.append({
                                            "type": "ValueRule", 
                                            "field": v_rule.get("Field"), 
                                            "value": v_rule.get("Value")
                                        })
                                    if rule_id and conditions:
                                        rules_map[rule_id] = conditions

                    # 2. Parse Command Definitions
                    commands_map = {} # command_id -> { "display_rules": [], "enable_rules": [] }
                    cmd_defs = root.find(".//CommandDefinitions")
                    if cmd_defs is not None:
                        for cmd in cmd_defs.findall(".//CommandDefinition"):
                            cmd_id = cmd.get("Id")
                            if not cmd_id: continue
                            
                            c_data = {"display_rules": [], "enable_rules": []}
                            for d_ref in cmd.findall(".//DisplayRule"):
                                ref_id = d_ref.get("Id")
                                if ref_id in rules_map:
                                    c_data["display_rules"].extend(rules_map[ref_id])
                            for e_ref in cmd.findall(".//EnableRule"):
                                ref_id = e_ref.get("Id")
                                if ref_id in rules_map:
                                    c_data["enable_rules"].extend(rules_map[ref_id])
                            commands_map[cmd_id] = c_data
                    
                    # 3. Search for Buttons in the XML
                    for elem in root.iter():
                        if elem.tag.endswith('Button'):
                            btn_id = elem.get('Id', '')
                            raw_label = elem.get('LabelText', elem.get('ToolTipTitle', ''))
                            command_id = elem.get('Command', '')
                            
                            if btn_id and raw_label:
                                resolved_lbl = resolve_label(raw_label, btn_id)
                                
                                # Determine location type (homepage_grid vs form vs subgrid)
                                loc_type = "form"
                                if "HomepageGrid" in btn_id:
                                    loc_type = "homepage_grid"
                                elif "SubGrid" in btn_id:
                                    loc_type = "subgrid"
                                elif "Form" in btn_id:
                                    loc_type = "form"
                                
                                btn_data = {
                                    "id": btn_id,
                                    "raw_label": raw_label,
                                    "label": resolved_lbl,
                                    "command": command_id,
                                    "location_type": loc_type,
                                    "display_rules": [],
                                    "enable_rules": []
                                }
                                if command_id in commands_map:
                                    btn_data["display_rules"] = commands_map[command_id]["display_rules"]
                                    btn_data["enable_rules"] = commands_map[command_id]["enable_rules"]
                                    
                                buttons.append(btn_data)
            
            # Deduplicate by ID
            unique_buttons = {b["id"]: b for b in buttons}.values()
            return list(unique_buttons)
            
        except Exception as e:
            logger.error(f"Failed to extract ribbon for {logical_name}: {e}")
            return buttons

    # ------------------------------------------------------------------
    # Attribute Metadata
    # ------------------------------------------------------------------

    def get_entity_attributes(self, logical_name: str) -> list[dict]:
        """
        Returns ALL attributes for an entity — including those added by managed
        3rd-party solutions. Filters to attributes valid for create or update.
        """
        return self._get_all_pages(
            f"/EntityDefinitions(LogicalName='{logical_name}')/Attributes",
            params={
                "$select": (
                    "LogicalName,SchemaName,DisplayName,AttributeType,AttributeTypeName,"
                    "RequiredLevel,IsValidForCreate,IsValidForUpdate,IsValidForRead,"
                    "IsSecured,ColumnNumber,Description,"
                    "IsPrimaryId,IsPrimaryName"
                ),
                "$filter": "IsValidForCreate eq true or IsValidForUpdate eq true"
            }
        )

    def get_entity_option_sets(self, logical_name: str) -> dict[str, list]:
        """
        Returns all Picklist/Status/State option sets for an entity.
        Returns dict keyed by attribute logical name:
        { "prioritycode": [{"value": 1, "label": "High"}, ...], ... }
        """
        option_sets = {}

        # Picklists (Picklist, MultiSelectPicklist)
        for attr_type in [
            "PicklistAttributeMetadata",
            "MultiSelectPicklistAttributeMetadata",
        ]:
            try:
                attrs = self._get_all_pages(
                    f"/EntityDefinitions(LogicalName='{logical_name}')"
                    f"/Attributes/Microsoft.Dynamics.CRM.{attr_type}",
                    params={"$select": "LogicalName,OptionSet"}
                )
                for attr in attrs:
                    lname = attr["LogicalName"]
                    raw_options = attr.get("OptionSet", {}).get("Options", [])
                    option_sets[lname] = _extract_options(raw_options)
            except Exception as e:
                logger.warning(f"Could not fetch {attr_type} for {logical_name}: {e}")

        # StateCode
        try:
            state_attrs = self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')"
                f"/Attributes/Microsoft.Dynamics.CRM.StateAttributeMetadata",
                params={"$select": "LogicalName,OptionSet"}
            )
            for attr in state_attrs:
                option_sets[attr["LogicalName"]] = _extract_options(
                    attr.get("OptionSet", {}).get("Options", [])
                )
        except Exception as e:
            logger.debug(f"No state attribute for {logical_name}: {e}")

        # StatusCode
        try:
            status_attrs = self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')"
                f"/Attributes/Microsoft.Dynamics.CRM.StatusAttributeMetadata",
                params={"$select": "LogicalName,OptionSet"}
            )
            for attr in status_attrs:
                option_sets[attr["LogicalName"]] = _extract_options(
                    attr.get("OptionSet", {}).get("Options", [])
                )
        except Exception as e:
            logger.debug(f"No status attribute for {logical_name}: {e}")

        # Boolean
        try:
            bool_attrs = self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')"
                f"/Attributes/Microsoft.Dynamics.CRM.BooleanAttributeMetadata",
                params={"$select": "LogicalName,OptionSet"}
            )
            for attr in bool_attrs:
                os_data = attr.get("OptionSet", {})
                option_sets[attr["LogicalName"]] = [
                    {"value": 0, "label": _get_label(os_data.get("FalseOption", {}))},
                    {"value": 1, "label": _get_label(os_data.get("TrueOption", {}))},
                ]
        except Exception as e:
            logger.debug(f"No boolean attributes for {logical_name}: {e}")

        return option_sets

    # ------------------------------------------------------------------
    # Views (Saved Queries / FetchXML)
    # ------------------------------------------------------------------

    def get_saved_queries_for_entity(self, logical_name: str) -> list[dict]:
        """
        Returns System Views (SavedQueries) for a given entity.
        Includes querytype (0=Main/Homepage, 2=Associated, 4=QuickFind, 64=Lookup),
        fetchxml, and layoutxml.
        """
        return self._get_all_pages(
            "/savedqueries",
            params={
                "$filter": f"returnedtypecode eq '{logical_name}' and iscustomizable/Value eq true",
                "$select": "name,savedqueryid,querytype,fetchxml,layoutxml,isdefault,isquickfindquery,description,returnedtypecode"
            }
        )

    # ------------------------------------------------------------------
    # Forms (FormXML — MERGED, includes managed layer)
    # ------------------------------------------------------------------

    def get_main_forms(self, logical_name: str) -> list[dict]:
        """
        Returns all Main forms (type=2) for a given entity.
        The FormXML returned is the MERGED active form — includes all managed
        customization layers from 3rd party solutions.
        """
        return self._get_all_pages(
            "/systemforms",
            params={
                "$filter": f"objecttypecode eq '{logical_name}' and type eq 2 and iscustomizable/Value eq true",
                "$select": "name,formid,formxmlmanaged,formxml,description,isdefault"
            }
        )

    def get_main_and_quick_forms(self, logical_name: str) -> list[dict]:
        """Returns Main Forms (type 2) and Quick View Forms (type 6) for the entity."""
        forms = self._get_all_pages(
            "/systemforms",
            params={
                "$filter": f"objecttypecode eq '{logical_name}' and (type eq 2 or type eq 6)",
                "$select": "name,formid,formxmlmanaged,formxml,description,isdefault,type"
            }
        )
        return forms

    def get_mobile_forms(self, logical_name: str) -> list[dict]:
        """Returns mobile forms (type=11) as fallback for simpler layouts."""
        return self._get_all_pages(
            "/systemforms",
            params={
                "$filter": f"objecttypecode eq '{logical_name}' and type eq 11",
                "$select": "name,formid,formxml,isdefault"
            }
        )

    # ------------------------------------------------------------------
    # Business Rules (reference only — server enforces on sync)
    # ------------------------------------------------------------------

    def get_business_rules(self, logical_name: str) -> list[dict]:
        """
        Returns activated business rules for a given entity.
        category eq 2 = BusinessRule; statecode eq 1 = Activated.
        The XAML is stored but not parsed in MVP — server enforces on sync.
        """
        try:
            return self._get_all_pages(
                "/workflows",
                params={
                    "$filter": (
                        f"category eq 2 and primaryentity eq '{logical_name}' "
                        f"and statecode eq 1"
                    ),
                    "$select": "name,workflowid,primaryentity,description"
                    # Deliberately NOT fetching xaml — large payload, not parsed in MVP
                }
            )
        except Exception as e:
            logger.warning(f"Could not fetch business rules for {logical_name}: {e}")
            return []

    # ------------------------------------------------------------------
    # Business Process Flow (BPF) Dependency Resolution
    # ------------------------------------------------------------------

    def get_bpf_definitions_for_app(self, app_module_id: str) -> dict:
        """
        Resolves all Business Process Flows (BPFs) included in the app
        and extracts their stages to power the offline BPF chevron UI.
        Returns a dict: { "bpf_logical_name": { "name": "...", "stages": [...] } }
        """
        logger.info(f"Resolving BPF definitions for App {app_module_id}...")
        bpf_defs = {}
        try:
            # Resolve the appmoduleid to its appmoduleidunique
            app_data = self._get(
                f"/appmodules({app_module_id})",
                params={"$select": "appmoduleidunique"}
            )
            uid = app_data.get("appmoduleidunique")
            if not uid:
                raise Exception("Could not resolve appmoduleidunique for the selected app.")

            # 1. Fetch Workflow components included in the App
            components = self._get_all_pages(
                "/appmodulecomponents",
                params={
                    "$filter": f"_appmoduleidunique_value eq {uid} and componenttype eq 29",
                    "$select": "objectid"
                }
            )
            workflow_ids = [c["objectid"] for c in components]
            if not workflow_ids:
                return {}

            for wf_id in workflow_ids:
                wf = self._get(
                    f"/workflows({wf_id})",
                    params={"$select": "category,primaryentity,uniquename,name"}
                )
                if wf.get("category") == 4: # BPF
                    bpf_name = wf.get("uniquename")
                    if not bpf_name: continue
                    
                    # Fetch process stages
                    stages = self._get_all_pages(
                        "/processstages",
                        params={
                            "$filter": f"_processid_value eq {wf_id}",
                            "$select": "stagename,primaryentitytypecode,stagecategory"
                        }
                    )
                    
                    bpf_defs[bpf_name] = {
                        "name": wf.get("name", bpf_name),
                        "primary_entity": wf.get("primaryentity"),
                        "stages": [
                            {
                                "id": s.get("processstageid"),
                                "name": s.get("stagename"),
                                "entity": s.get("primaryentitytypecode")
                            } for s in stages
                        ]
                    }

            return bpf_defs

        except Exception as e:
            logger.error(f"Failed to resolve BPF dependencies: {e}")
            return {}

    # ------------------------------------------------------------------
    # Lookup targets (for generating lookup search widgets)
    # ------------------------------------------------------------------

    def get_lookup_targets(self, logical_name: str) -> dict[str, list[str]]:
        """
        Returns a mapping of lookup attribute → target entity names.
        e.g. {"customerid": ["account", "contact"], "ownerid": ["systemuser", "team"]}
        """
        try:
            attrs = self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')"
                f"/Attributes/Microsoft.Dynamics.CRM.LookupAttributeMetadata",
                params={"$select": "LogicalName,Targets"}
            )
            return {a["LogicalName"]: a.get("Targets", []) for a in attrs}
        except Exception as e:
            logger.warning(f"Could not fetch lookup targets for {logical_name}: {e}")
            return {}

    # ------------------------------------------------------------------
    # Entity Relationships (1:N and N:1)
    # ------------------------------------------------------------------

    def get_one_to_many_relationships(self, logical_name: str) -> list[dict]:
        """
        Returns all One-to-Many relationships where this entity is the 
        REFERENCED (parent/primary) entity.
        e.g. Account → Contact (account has many contacts)
        """
        try:
            return self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')/OneToManyRelationships",
                params={
                    "$select": (
                        "SchemaName,ReferencedEntity,ReferencedAttribute,"
                        "ReferencingEntity,ReferencingAttribute,"
                        "RelationshipType,CascadeConfiguration,"
                        "IsValidForAdvancedFind,IsCustomRelationship"
                    )
                }
            )
        except Exception as e:
            logger.warning(f"Could not fetch 1:N relationships for {logical_name}: {e}")
            return []

    def get_many_to_one_relationships(self, logical_name: str) -> list[dict]:
        """
        Returns all Many-to-One relationships where this entity is the
        REFERENCING (child/dependent) entity.
        e.g. Contact → Account (contact belongs to account)
        """
        try:
            return self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')/ManyToOneRelationships",
                params={
                    "$select": (
                        "SchemaName,ReferencedEntity,ReferencedAttribute,"
                        "ReferencingEntity,ReferencingAttribute,"
                        "RelationshipType,CascadeConfiguration,"
                        "IsValidForAdvancedFind,IsCustomRelationship"
                    )
                }
            )
        except Exception as e:
            logger.warning(f"Could not fetch N:1 relationships for {logical_name}: {e}")
            return []

    # ------------------------------------------------------------------
    # Entity Relationships (N:N)
    # ------------------------------------------------------------------

    def get_many_to_many_relationships(self, logical_name: str) -> list[dict]:
        """
        Returns all Many-to-Many relationships for an entity.
        These use an intersect (junction) table in Dataverse.
        """
        try:
            return self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')/ManyToManyRelationships",
                params={
                    "$select": (
                        "SchemaName,Entity1LogicalName,Entity2LogicalName,"
                        "Entity1IntersectAttribute,Entity2IntersectAttribute,"
                        "IntersectEntityName,IsCustomRelationship"
                    )
                }
            )
        except Exception as e:
            logger.warning(f"Could not fetch N:N relationships for {logical_name}: {e}")
            return []

    # ------------------------------------------------------------------
    # Entity Field Mappings (auto-populate on related record creation)
    # ------------------------------------------------------------------

    def get_entity_field_mappings(self, relationship_name: str) -> list[dict]:
        """
        Returns field mappings for a given relationship.
        Field mappings define which fields auto-populate when creating
        a related record (e.g. Account address → Contact address).

        Uses the RetrieveRelationshipMappings function.
        """
        try:
            # Fetch via entitymaps filtered by the relationship
            entity_maps = self._get_all_pages(
                "/entitymaps",
                params={
                    "$filter": f"sourceentityname ne null",
                    "$select": "entitymapid,sourceentityname,targetentityname"
                }
            )

            mappings = []
            for emap in entity_maps:
                emap_id = emap.get("entitymapid")
                if not emap_id:
                    continue

                try:
                    attr_maps = self._get_all_pages(
                        f"/entitymaps({emap_id})/attributemaps",
                        params={
                            "$select": "attributemapid,sourceattributename,targetattributename"
                        }
                    )
                    for am in attr_maps:
                        mappings.append({
                            "mapping_id": am.get("attributemapid", ""),
                            "source_entity": emap.get("sourceentityname", ""),
                            "target_entity": emap.get("targetentityname", ""),
                            "source_attribute": am.get("sourceattributename", ""),
                            "target_attribute": am.get("targetattributename", ""),
                        })
                except Exception as inner_e:
                    logger.debug(f"Could not fetch attribute maps for entitymap {emap_id}: {inner_e}")

            return mappings
        except Exception as e:
            logger.warning(f"Could not fetch field mappings: {e}")
            return []

    # ------------------------------------------------------------------
    # Combined relationship + mapping fetch for an entity
    # ------------------------------------------------------------------

    def get_all_relationships_for_entity(self, logical_name: str) -> dict:
        """
        Convenience method: fetches all relationship types and field mappings
        for a single entity and returns them in a structured dict.
        """
        one_to_many = self.get_one_to_many_relationships(logical_name)
        many_to_one = self.get_many_to_one_relationships(logical_name)
        many_to_many = self.get_many_to_many_relationships(logical_name)

        return {
            "one_to_many": one_to_many,
            "many_to_one": many_to_one,
            "many_to_many": many_to_many,
        }


# ------------------------------------------------------------------
# Module-level helpers
# ------------------------------------------------------------------

def _get_label(option_node: dict) -> str:
    """Safely extracts UserLocalizedLabel from an option metadata node."""
    return (
        option_node.get("Label", {})
        .get("UserLocalizedLabel", {})
        .get("Label", str(option_node.get("Value", "")))
    )


def _extract_options(raw_options: list) -> list[dict]:
    """Converts raw OptionSet.Options array to clean [{value, label}] list."""
    return [
        {"value": opt.get("Value"), "label": _get_label(opt)}
        for opt in raw_options
        if opt.get("Value") is not None
    ]


def _parse_sitemap_entities(sitemap_xml: str) -> list[dict]:
    """
    Parses SiteMap XML and extracts SubArea entity references with
    AvailableOffline flags.
    Returns: [{"entity": "incident", "title": "Cases", "available_offline": True}, ...]
    """
    if not sitemap_xml:
        return []
    try:
        from lxml import etree
        root = etree.fromstring(sitemap_xml.encode())
        results = []
        for subarea in root.findall(".//SubArea"):
            entity = subarea.get("Entity", "").lower()
            if not entity:
                continue
            available_offline = subarea.get("AvailableOffline", "false").lower() == "true"
            title = subarea.get("Title", entity)
            results.append({
                "entity": entity,
                "title": title,
                "available_offline": available_offline,
            })
        return results
    except Exception as e:
        logger.warning(f"SiteMap XML parse error: {e}")
        return []
        
def _parse_sitemap_hierarchy(sitemap_xml: str) -> dict:
    if not sitemap_xml:
        return {"areas": []}
        
    try:
        from lxml import etree
        root = etree.fromstring(sitemap_xml.encode())
        
        sitemap = {"areas": []}
        for area in root.findall(".//Area"):
            area_data = {
                "id": area.get("Id", ""),
                "title": area.get("Title", ""),
                "icon": area.get("Icon", ""),
                "groups": []
            }
            
            for group in area.findall(".//Group"):
                group_data = {
                    "id": group.get("Id", ""),
                    "title": group.get("Title", ""),
                    "icon": group.get("Icon", ""),
                    "subareas": []
                }
                
                for subarea in group.findall(".//SubArea"):
                    entity = subarea.get("Entity", "").lower()
                    if not entity:
                        continue
                    group_data["subareas"].append({
                        "id": subarea.get("Id", ""),
                        "entity": entity,
                        "title": subarea.get("Title", entity)
                    })
                    
                if group_data["subareas"]:
                    area_data["groups"].append(group_data)
                    
            if area_data["groups"]:
                sitemap["areas"].append(area_data)
                
        return sitemap
    except Exception as e:
        logger.warning(f"SiteMap XML parse error: {e}")
        return {"areas": []}
