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
import re
import requests
import tempfile
import time
from typing import Optional
from urllib.parse import urlparse

try:
    from VerseOff.client_script_metadata import (
        normalize_web_resource_name,
    )
    from VerseOff.pcf_metadata import (
        bind_pcf_resources,
        custom_control_names_from_form,
        parse_pcf_manifest,
    )
    from VerseOff.timeline_metadata import (
        extract_card_forms,
        extract_timeline_definitions,
    )
except ImportError:
    from client_script_metadata import normalize_web_resource_name
    from pcf_metadata import (
        bind_pcf_resources,
        custom_control_names_from_form,
        parse_pcf_manifest,
    )
    from timeline_metadata import (
        extract_card_forms,
        extract_timeline_definitions,
    )

logger = logging.getLogger(__name__)


class MetadataFetcher:
    def __init__(
        self,
        dataverse_url: str,
        auth_token: str,
        use_cache: bool = True,
        cache_ttl_seconds: int = 3600,
    ):
        parsed = urlparse(dataverse_url.rstrip("/"))
        if parsed.scheme != "https" or not parsed.netloc:
            raise ValueError(
                "Dataverse URL must be a complete HTTPS environment URL."
            )
        if not auth_token:
            raise ValueError("A Dataverse access token is required.")

        self.org_url = f"{parsed.scheme}://{parsed.netloc}"
        self.base_url = self.org_url + "/api/data/v9.2"
        self.headers = {
            "Authorization": f"Bearer {auth_token}",
            "Accept": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            "Prefer": "odata.include-annotations=OData.Community.Display.V1.FormattedValue",
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
        self.use_cache = use_cache
        self.cache_ttl_seconds = cache_ttl_seconds
        self._entity_set_name_cache = {}
        parsed = urlparse(self.base_url)
        org_domain = parsed.netloc.split('.')[0] if parsed.netloc else "default_org"
        cache_root = os.getenv("VERSEOFF_METADATA_CACHE_DIR")
        if not cache_root:
            local_app_data = os.getenv("LOCALAPPDATA")
            if local_app_data:
                cache_root = os.path.join(
                    local_app_data,
                    "VerseOff",
                    "metadata_cache",
                )
            else:
                cache_root = os.path.join(
                    os.path.expanduser("~"),
                    ".cache",
                    "verseoff",
                )
        self.cache_dir = os.path.join(cache_root, org_domain)
        
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
            endpoint_hash = hashlib.sha256(
                endpoint.encode("utf-8")
            ).hexdigest()[:8]
            clean_endpoint = f"{clean_endpoint[:41]}_{endpoint_hash}"
        
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
            age_seconds = time.time() - os.path.getmtime(path)
            if age_seconds > self.cache_ttl_seconds:
                return None
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
        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="w",
                encoding="utf-8",
                dir=os.path.dirname(path),
                prefix=".verseoff-",
                suffix=".tmp",
                delete=False,
            ) as cache_file:
                temp_path = cache_file.name
                json.dump(data, cache_file, indent=2)
            os.replace(temp_path, path)
        except (OSError, TypeError, ValueError) as exc:
            logger.warning("Failed to write cache %s: %s", path, exc)
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    pass

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _request_json(
        self,
        url,
        *,
        params=None,
        timeout=30,
        max_attempts=4,
    ):
        last_error = None
        for attempt in range(max_attempts):
            try:
                response = self.session.get(
                    url,
                    params=params,
                    timeout=timeout,
                )
            except (
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
            ) as exc:
                last_error = exc
                if attempt + 1 >= max_attempts:
                    break
                time.sleep(min(2 ** attempt, 8))
                continue

            if response.status_code in {429, 502, 503, 504}:
                if attempt + 1 >= max_attempts:
                    last_error = RuntimeError(
                        f"HTTP {response.status_code}: {response.text}"
                    )
                    break
                retry_after = response.headers.get("Retry-After")
                try:
                    delay = float(retry_after)
                except (TypeError, ValueError):
                    delay = 2 ** attempt
                logger.warning(
                    "Dataverse returned HTTP %s; retrying in %.1fs",
                    response.status_code,
                    min(delay, 30),
                )
                time.sleep(min(delay, 30))
                continue
            try:
                response.raise_for_status()
            except requests.exceptions.HTTPError as exc:
                raise RuntimeError(
                    f"HTTP Error: {exc}\nResponse: {response.text}"
                ) from exc
            try:
                return response.json()
            except requests.exceptions.JSONDecodeError as exc:
                raise RuntimeError(
                    f"Dataverse returned invalid JSON from {url}"
                ) from exc
        raise RuntimeError(
            f"Dataverse request failed after {max_attempts} attempts: "
            f"{last_error}"
        ) from last_error

    def _get(self, endpoint: str, params: dict = None, timeout: int = 30) -> dict:
        """GET request against the Dataverse Web API."""
        cached_data = self._read_cache(endpoint, params)
        if cached_data is not None:
            return cached_data
            
        url = f"{self.base_url}{endpoint}"
        data = self._request_json(
            url,
            params=params,
            timeout=timeout,
        )
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
            data = self._request_json(
                url,
                params=current_params,
                timeout=30,
            )
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

    def get_client_context(self) -> dict:
        """Fetches the source user and organization context for Client API."""
        identity = self.who_am_i()
        user_id = str(identity.get("UserId") or "").strip("{}")
        organization_id = str(
            identity.get("OrganizationId") or ""
        ).strip("{}")
        if not user_id or not organization_id:
            raise RuntimeError(
                "WhoAmI did not return both UserId and OrganizationId."
            )

        user = self._get(
            f"/systemusers({user_id})",
            params={
                "$select": (
                    "systemuserid,fullname,domainname,"
                    "internalemailaddress,_transactioncurrencyid_value"
                )
            },
        )
        organization = self._get(
            f"/organizations({organization_id})",
            params={
                "$select": (
                    "organizationid,name,languagecode,"
                    "_basecurrencyid_value,isautosaveenabled"
                )
            },
        )
        settings = self._get_all_pages(
            "/usersettingscollection",
            params={
                "$filter": f"systemuserid eq {user_id}",
                "$select": (
                    "uilanguageid,localeid,timezonecode,"
                    "isdefaultcountrycodecheckenabled"
                ),
                "$top": "1",
            },
        )
        if not settings:
            raise RuntimeError(
                f"User settings were not found for {user_id}."
            )
        roles = self._get_all_pages(
            f"/systemusers({user_id})/systemuserroles_association",
            params={"$select": "roleid,name"},
        )
        user_settings = settings[0]
        return {
            "version": "9.2.0.0",
            "user": {
                "id": user.get("systemuserid") or user_id,
                "name": user.get("fullname") or "",
                "domainName": user.get("domainname") or "",
                "email": user.get("internalemailaddress") or "",
                "languageId": int(
                    user_settings.get("uilanguageid")
                    or organization.get("languagecode")
                    or 1033
                ),
                "localeId": int(
                    user_settings.get("localeid") or 1033
                ),
                "timeZoneCode": user_settings.get("timezonecode"),
                "transactionCurrencyId": (
                    user.get("_transactioncurrencyid_value") or ""
                ),
                "roles": [
                    {
                        "id": role.get("roleid") or "",
                        "name": role.get("name") or "",
                    }
                    for role in roles
                ],
            },
            "organization": {
                "id": (
                    organization.get("organizationid")
                    or organization_id
                ),
                "uniqueName": organization.get("uniquename") or "",
                "name": organization.get("name") or "",
                "languageId": int(
                    organization.get("languagecode") or 1033
                ),
                "baseCurrencyId": (
                    organization.get("_basecurrencyid_value") or ""
                ),
                "isAutoSaveEnabled": bool(
                    organization.get("isautosaveenabled")
                ),
            },
        }

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
        app_data = self._get(
            f"/appmodules({app_module_id})",
            params={"$select": "appmoduleidunique"}
        )
        uid = app_data.get("appmoduleidunique")
        if not uid:
            raise RuntimeError(
                "Could not resolve appmoduleidunique for the selected app."
            )

        components = self._get_all_pages(
            "/appmodulecomponents",
            params={
                "$filter": f"_appmoduleidunique_value eq {uid} and componenttype eq 62",
                "$select": "objectid"
            }
        )
        if not components:
            return ""

        sitemap_id = components[0].get("objectid")
        if not sitemap_id:
            raise RuntimeError(
                "The selected app's SiteMap component has no object ID."
            )
        sitemap = self._get(
            f"/sitemaps({sitemap_id})",
            params={"$select": "sitemapxml"},
        )
        return sitemap.get("sitemapxml", "")

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
                raise RuntimeError(
                    f"Could not fetch metadata for app entity {eid}: {e}"
                ) from e

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
                    "ObjectTypeCode,OwnershipType,DataProviderId,"
                    "ChangeTrackingEnabled"
                )
            }
        )
        if entity_def.get("EntitySetName"):
            self._entity_set_name_cache[logical_name] = entity_def[
                "EntitySetName"
            ]
        
        entity_def["attributes"] = self.get_entity_attributes(logical_name)
        entity_def["option_sets"] = self.get_entity_option_sets(logical_name)
        entity_def["forms"] = self.get_main_and_quick_forms(logical_name)
        entity_def["pcf_controls"] = self.get_custom_controls_for_forms(
            entity_def["forms"]
        )
        entity_def["timelines"] = extract_timeline_definitions(
            entity_def["forms"],
            logical_name,
        )
        entity_def["card_forms"] = extract_card_forms(
            entity_def["forms"]
        )
        entity_def["saved_queries"] = self.get_saved_queries_for_entity(logical_name)
        ribbon = self._fetch_ribbon_metadata(logical_name)
        entity_def["ribbon"] = ribbon
        entity_def["ribbon_buttons"] = ribbon["buttons"]
        relationships = self.get_all_relationships_for_entity(logical_name)
        entity_def["relationships"] = relationships
        entity_def["lookup_targets"] = self.get_lookup_targets(logical_name)
        entity_def["lookup_bindings"] = self.get_lookup_bindings(
            relationships.get("many_to_one", [])
        )

        try:
            from VerseOff.schema_builder import persist_entity_metadata
            persist_entity_metadata(entity_def)
        except ImportError:
            from schema_builder import persist_entity_metadata
            persist_entity_metadata(entity_def)
        except Exception:
            logger.debug("Relationship metadata persistence skipped for %s.", logical_name, exc_info=True)

        return entity_def

    def _fetch_ribbon_metadata(self, logical_name: str) -> dict:
        logger.info("Extracting Ribbon XML for %s...", logical_name)
        try:
            url = (
                "/RetrieveEntityRibbon("
                f"EntityName='{logical_name}',"
                "RibbonLocationFilter="
                "Microsoft.Dynamics.CRM.RibbonLocationFilters'All')"
            )
            data = self._get(url, timeout=6)
            base64_zip = data.get("CompressedEntityXml")
            if not base64_zip:
                logger.warning(
                    "No CompressedEntityXml returned for %s",
                    logical_name,
                )
                return _empty_ribbon_metadata()

            zip_bytes = base64.b64decode(base64_zip)
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as archive:
                ribbon_name = next(
                    (
                        name
                        for name in archive.namelist()
                        if name.lower().endswith("ribbonxml.xml")
                    ),
                    None,
                )
                if not ribbon_name:
                    logger.warning(
                        "Ribbon archive for %s contains no RibbonXml.xml",
                        logical_name,
                    )
                    return _empty_ribbon_metadata()
                return _parse_ribbon_xml(archive.read(ribbon_name))
        except (
            ValueError,
            zipfile.BadZipFile,
            ET.ParseError,
            requests.RequestException,
            RuntimeError,
        ) as exc:
            logger.warning(
                "Failed to extract ribbon for %s: %s",
                logical_name,
                exc,
            )
            return _empty_ribbon_metadata()

    def _fetch_ribbon_buttons(self, logical_name: str) -> list[dict]:
        """Backward-compatible button-only Ribbon metadata accessor."""
        return self._fetch_ribbon_metadata(logical_name)["buttons"]

    # ------------------------------------------------------------------
    # Attribute Metadata
    # ------------------------------------------------------------------

    def get_entity_attributes(self, logical_name: str) -> list[dict]:
        """
        Returns every readable or writable attribute, including attributes
        added by managed third-party solutions.
        """
        attributes = self._get_all_pages(
            f"/EntityDefinitions(LogicalName='{logical_name}')/Attributes",
            params={
                "$select": (
                    "LogicalName,SchemaName,DisplayName,AttributeType,AttributeTypeName,"
                    "RequiredLevel,IsValidForCreate,IsValidForUpdate,IsValidForRead,"
                    "IsSecured,ColumnNumber,Description,"
                    "IsPrimaryId,IsPrimaryName"
                ),
                "$filter": (
                    "IsValidForRead eq true or IsValidForCreate eq true "
                    "or IsValidForUpdate eq true"
                )
            }
        )
        by_name = {
            attribute.get("LogicalName"): attribute
            for attribute in attributes
            if attribute.get("LogicalName")
        }
        type_requests = {
            "String": (
                "StringAttributeMetadata",
                "LogicalName,MaxLength,Format,FormatName",
            ),
            "Memo": (
                "MemoAttributeMetadata",
                "LogicalName,MaxLength,Format,FormatName",
            ),
            "Integer": (
                "IntegerAttributeMetadata",
                "LogicalName,MinValue,MaxValue,Format",
            ),
            "BigInt": (
                "BigIntAttributeMetadata",
                "LogicalName,MinValue,MaxValue",
            ),
            "Decimal": (
                "DecimalAttributeMetadata",
                "LogicalName,MinValue,MaxValue,Precision",
            ),
            "Double": (
                "DoubleAttributeMetadata",
                "LogicalName,MinValue,MaxValue,Precision",
            ),
            "Money": (
                "MoneyAttributeMetadata",
                "LogicalName,MinValue,MaxValue,Precision,"
                "PrecisionSource,CalculationOf",
            ),
            "DateTime": (
                "DateTimeAttributeMetadata",
                "LogicalName,Format,DateTimeBehavior",
            ),
            "Lookup": (
                "LookupAttributeMetadata",
                "LogicalName,Targets",
            ),
            "Customer": (
                "LookupAttributeMetadata",
                "LogicalName,Targets",
            ),
            "Owner": (
                "LookupAttributeMetadata",
                "LogicalName,Targets",
            ),
            "Boolean": (
                "BooleanAttributeMetadata",
                "LogicalName,DefaultValue,FormulaDefinition",
            ),
            "File": (
                "FileAttributeMetadata",
                "LogicalName,MaxSizeInKB",
            ),
            "Image": (
                "ImageAttributeMetadata",
                "LogicalName,MaxHeight,MaxWidth,CanStoreFullImage,"
                "IsPrimaryImage",
            ),
        }
        present_types = {
            attribute.get("AttributeType")
            for attribute in attributes
        }
        requested_casts = set()
        for attribute_type in present_types:
            request = type_requests.get(attribute_type)
            if request is None or request[0] in requested_casts:
                continue
            cast_name, select = request
            requested_casts.add(cast_name)
            typed_attributes = self._get_all_pages(
                f"/EntityDefinitions(LogicalName='{logical_name}')"
                f"/Attributes/Microsoft.Dynamics.CRM.{cast_name}",
                params={"$select": select},
            )
            for typed_attribute in typed_attributes:
                logical_name_key = typed_attribute.get("LogicalName")
                if logical_name_key in by_name:
                    by_name[logical_name_key].update(typed_attribute)
        return attributes

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
                "$filter": f"returnedtypecode eq '{logical_name}'",
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
        """Returns forms required by forms and Timeline.

        Types: Main=2, Quick View=6, Quick Create=7, Card=11.
        """
        forms = self._get_all_pages(
            "/systemforms",
            params={
                "$filter": (
                    f"objecttypecode eq '{logical_name}' and "
                    "(type eq 2 or type eq 6 or type eq 7 or type eq 11)"
                ),
                "$select": "name,formid,formxmlmanaged,formxml,description,isdefault,type"
            }
        )
        return forms

    def get_mobile_forms(self, logical_name: str) -> list[dict]:
        """Returns Card forms (type=11), retained for compatibility."""
        return self._get_all_pages(
            "/systemforms",
            params={
                "$filter": f"objecttypecode eq '{logical_name}' and type eq 11",
                "$select": "name,formid,formxml,isdefault"
            }
        )

    def get_timeline_organization_settings(self) -> dict:
        """Returns attachment limits used by generated Timeline controls."""
        try:
            organizations = self._get_all_pages(
                "/organizations",
                params={
                    "$select": (
                        "organizationid,maxuploadfilesize,"
                        "blockedattachments"
                    )
                },
            )
        except RuntimeError as exc:
            logger.warning(
                "Could not read Timeline organization settings: %s",
                exc,
            )
            return {
                "max_upload_file_size": 94371840,
                "blocked_extensions": [],
            }
        organization = organizations[0] if organizations else {}
        blocked = [
            extension.strip().lower().lstrip(".")
            for extension in str(
                organization.get("blockedattachments") or ""
            ).split(";")
            if extension.strip()
        ]
        return {
            "max_upload_file_size": int(
                organization.get("maxuploadfilesize") or 94371840
            ),
            "blocked_extensions": blocked,
        }

    def get_web_resource(self, name: str) -> dict | None:
        """Returns a web resource without corrupting binary content."""
        normalized = normalize_web_resource_name(name)
        if not normalized:
            return None
        escaped = normalized.replace("'", "''")
        resources = self._get_all_pages(
            "/webresourceset",
            params={
                "$filter": f"name eq '{escaped}'",
                "$select": (
                    "webresourceid,name,displayname,"
                    "webresourcetype,content,dependencyxml,"
                    "description,languagecode"
                ),
            },
        )
        if not resources:
            logger.warning("Web resource not found: %s", normalized)
            return None
        return self._web_resource_payload(resources[0], normalized)

    def _web_resource_payload(
        self,
        resource: dict,
        fallback_name: str = "",
    ) -> dict:
        normalized = normalize_web_resource_name(
            resource.get("name") or fallback_name
        )
        if not normalized:
            raise RuntimeError("Web resource metadata has no valid name.")
        content_base64 = resource.get("content") or ""
        resource_type = resource.get("webresourcetype")
        text_types = {1, 2, 3, 4, 9, 11, 12}
        try:
            numeric_type = int(resource_type)
        except (TypeError, ValueError):
            numeric_type = None
        if numeric_type is None and normalized.casefold().endswith(
            (
                ".htm",
                ".html",
                ".css",
                ".js",
                ".json",
                ".xml",
                ".xsl",
                ".svg",
                ".resx",
                ".txt",
            )
        ):
            numeric_type = 3
        result = {
            "id": resource.get("webresourceid"),
            "name": normalized,
            "display_name": resource.get("displayname") or normalized,
            "description": resource.get("description") or "",
            "language_code": resource.get("languagecode"),
            "type": resource_type,
            "dependency_xml": resource.get("dependencyxml") or "",
        }
        if numeric_type not in text_types:
            try:
                base64.b64decode(content_base64, validate=True)
            except ValueError as exc:
                raise RuntimeError(
                    f"Web resource {normalized} contains invalid Base64: "
                    f"{exc}"
                ) from exc
            result["content_base64"] = content_base64
            return result
        try:
            decoded = base64.b64decode(content_base64).decode("utf-8-sig")
        except (ValueError, UnicodeDecodeError) as exc:
            raise RuntimeError(
                f"Web resource {normalized} is not UTF-8 text: {exc}"
            ) from exc
        result["content"] = decoded
        return result

    def get_web_resource_by_id(self, web_resource_id: str) -> dict:
        resource_id = str(web_resource_id or "").strip().strip("{}")
        if not resource_id:
            raise ValueError("Web resource ID is required.")
        resource = self._get(
            f"/webresourceset({resource_id})",
            params={
                "$select": (
                    "webresourceid,name,displayname,"
                    "webresourcetype,content,dependencyxml,"
                    "description,languagecode"
                ),
            },
        )
        return self._web_resource_payload(resource)

    def get_custom_control(self, control_name: str) -> dict | None:
        name = str(control_name or "").strip()
        if not name:
            return None
        escaped = name.replace("'", "''")
        controls = self._get_all_pages(
            "/customcontrols",
            params={
                "$filter": f"name eq '{escaped}'",
                "$select": (
                    "customcontrolid,name,manifest,authoringmanifest,"
                    "clientjson,compatibledatatypes,supportedplatform,"
                    "version,introducedversion"
                ),
            },
        )
        if not controls:
            logger.warning("Custom control metadata not found: %s", name)
            return {
                "name": name,
                "metadata_available": False,
                "can_host": False,
                "missing_resources": [],
                "resources": [],
            }
        control = controls[0]
        control_id = str(
            control.get("customcontrolid") or ""
        ).strip().strip("{}")
        definition = parse_pcf_manifest(control.get("manifest") or "")
        common_metadata = {
            "id": control_id,
            "name": control.get("name") or definition["name"],
            "metadata_available": True,
            "manifest_xml": control.get("manifest") or "",
            "authoring_manifest_xml": (
                control.get("authoringmanifest") or ""
            ),
            "client_json": control.get("clientjson") or "",
            "compatible_data_types": [
                value.strip()
                for value in str(
                    control.get("compatibledatatypes") or ""
                ).replace(";", ",").split(",")
                if value.strip()
            ],
            "supported_platform": (
                control.get("supportedplatform") or ""
            ),
            "runtime_version": control.get("version") or "",
            "introduced_version": (
                control.get("introducedversion") or ""
            ),
        }
        if name.startswith("MscrmControls."):
            definition.update(common_metadata)
            definition["can_host"] = False
            definition["native_first_party"] = True
            definition["missing_resources"] = []
            definition["resource_links"] = []
            return definition
        resources = self._get_all_pages(
            "/customcontrolresources",
            params={
                "$filter": f"customcontrolid eq {control_id}",
                "$select": (
                    "customcontrolresourceid,customcontrolid,"
                    "webresourceid,name,version,versionrequirement"
                ),
            },
        )
        resource_rows = [
            {
                "id": resource.get("customcontrolresourceid"),
                "path": resource.get("name") or "",
                "name": resource.get("name") or "",
                "web_resource_id": (
                    resource.get("webresourceid")
                    or resource.get("_webresourceid_value")
                ),
                "version": resource.get("version") or "",
                "version_requirement": (
                    resource.get("versionrequirement") or ""
                ),
            }
            for resource in resources
        ]
        for resource in resource_rows:
            web_resource_id = resource.get("web_resource_id")
            if not web_resource_id:
                continue
            web_resource = self.get_web_resource_by_id(web_resource_id)
            resource["web_resource_name"] = web_resource["name"]
            resource["web_resource_type"] = web_resource["type"]
        definition = bind_pcf_resources(definition, resource_rows)
        definition.update({
            **common_metadata,
            "resource_links": resource_rows,
        })
        return definition

    def get_custom_controls_for_forms(self, forms: list[dict]) -> list[dict]:
        names = []
        for form in forms or []:
            for name in custom_control_names_from_form(
                form.get("formxml") or ""
            ):
                if name not in names:
                    names.append(name)
        definitions = []
        for name in names:
            definition = self.get_custom_control(name)
            if definition:
                definitions.append(definition)
        return definitions

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
                            "$select": (
                                "processstageid,stagename,"
                                "primaryentitytypecode,stagecategory"
                            )
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
            raise RuntimeError(
                f"Failed to resolve business process dependencies: {e}"
            ) from e

    def get_bpf_entities_for_app(self, app_module_id: str) -> list[str]:
        """Returns every table used by a business process in the app."""
        definitions = self.get_bpf_definitions_for_app(app_module_id)
        entity_names = []
        seen = set()
        for definition in definitions.values():
            candidates = [definition.get("primary_entity")]
            candidates.extend(
                stage.get("entity")
                for stage in definition.get("stages", [])
            )
            for candidate in candidates:
                logical_name = str(candidate or "").strip().lower()
                if logical_name and logical_name not in seen:
                    seen.add(logical_name)
                    entity_names.append(logical_name)
        return entity_names

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

    def get_entity_set_name(self, logical_name: str) -> str:
        """Returns and caches the Web API entity-set name for a table."""
        if logical_name not in self._entity_set_name_cache:
            metadata = self._get(
                f"/EntityDefinitions(LogicalName='{logical_name}')",
                params={"$select": "EntitySetName"},
            )
            entity_set_name = metadata.get("EntitySetName")
            if not entity_set_name:
                raise RuntimeError(
                    f"Dataverse returned no EntitySetName for {logical_name}."
                )
            self._entity_set_name_cache[logical_name] = entity_set_name
        return self._entity_set_name_cache[logical_name]

    def get_lookup_bindings(
        self,
        many_to_one_relationships: list[dict],
    ) -> dict[str, dict[str, dict[str, str]]]:
        """Maps lookup fields and targets to their Web API bind properties."""
        bindings = {}
        for relationship in many_to_one_relationships:
            attribute = relationship.get("ReferencingAttribute")
            target = relationship.get("ReferencedEntity")
            navigation_property = relationship.get(
                "ReferencingEntityNavigationPropertyName"
            )
            if not attribute or not target or not navigation_property:
                continue
            bindings.setdefault(attribute, {})[target] = {
                "navigation_property": navigation_property,
                "entity_set_name": self.get_entity_set_name(target),
            }
        return bindings

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
                        "ReferencedEntityNavigationPropertyName,"
                        "ReferencingEntityNavigationPropertyName,"
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
                        "ReferencedEntityNavigationPropertyName,"
                        "ReferencingEntityNavigationPropertyName,"
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


def _xml_local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def _snake_case(value: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", value).lower()


def _empty_ribbon_metadata() -> dict:
    return {
        "buttons": [],
        "commands": {},
        "display_rules": {},
        "enable_rules": {},
        "hidden_actions": [],
    }


def _serialize_ribbon_node(node) -> dict:
    data = {
        "type": _xml_local_name(node.tag),
        **{
            _snake_case(name): value
            for name, value in node.attrib.items()
        },
    }
    children = [
        _serialize_ribbon_node(child)
        for child in list(node)
    ]
    if children:
        data["children"] = children
    text = (node.text or "").strip()
    if text:
        data["text"] = text
    return data


def _ribbon_location_type(value: str) -> str:
    lowered = str(value or "").lower()
    if "homepagegrid" in lowered:
        return "homepage_grid"
    if "subgrid" in lowered:
        return "subgrid"
    return "form"


def _parse_ribbon_xml(xml_content) -> dict:
    root = ET.fromstring(xml_content)
    metadata = _empty_ribbon_metadata()

    localized_labels = {}
    for label in root.findall(".//LocLabels/LocLabel"):
        label_id = label.get("Id")
        titles = label.findall("./Titles/Title")
        preferred = next(
            (
                title
                for title in titles
                if title.get("languagecode") == "1033"
            ),
            titles[0] if titles else None,
        )
        if label_id and preferred is not None:
            localized_labels[label_id] = (
                preferred.get("description")
                or preferred.get("Title")
                or (preferred.text or "").strip()
            )

    resource_labels = {
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
    }

    def resolve_label(token, fallback):
        token = str(token or "")
        if token.startswith("$LocLabels:"):
            resolved = localized_labels.get(
                token.removeprefix("$LocLabels:")
            )
            if resolved:
                return resolved
        clean_token = (
            token.removeprefix("$Resources:")
            .removeprefix("$LocLabels:")
        )
        for resource_name, label in resource_labels.items():
            if resource_name.casefold() in clean_token.casefold():
                return label
        words = re.findall(
            r"[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|\d|\W|$)|\d+",
            clean_token.split(".")[-1],
        )
        return " ".join(words) if words else fallback

    rule_definitions = root.find(".//RuleDefinitions")
    if rule_definitions is not None:
        for container_name, destination in (
            ("DisplayRules", metadata["display_rules"]),
            ("EnableRules", metadata["enable_rules"]),
        ):
            container = rule_definitions.find(f"./{container_name}")
            if container is None:
                continue
            for rule in list(container):
                rule_id = rule.get("Id")
                if rule_id:
                    destination[rule_id] = [
                        _serialize_ribbon_node(condition)
                        for condition in list(rule)
                    ]

    command_definitions = root.find(".//CommandDefinitions")
    if command_definitions is not None:
        for command in command_definitions.findall(
            "./CommandDefinition"
        ):
            command_id = command.get("Id")
            if not command_id:
                continue
            display_rule_ids = [
                reference.get("Id")
                for reference in command.findall(
                    "./DisplayRules/DisplayRule"
                )
                if reference.get("Id")
            ]
            enable_rule_ids = [
                reference.get("Id")
                for reference in command.findall(
                    "./EnableRules/EnableRule"
                )
                if reference.get("Id")
            ]
            metadata["commands"][command_id] = {
                "id": command_id,
                "display_rule_ids": display_rule_ids,
                "enable_rule_ids": enable_rule_ids,
                "display_rules": [
                    condition
                    for rule_id in display_rule_ids
                    for condition in metadata["display_rules"].get(
                        rule_id,
                        [],
                    )
                ],
                "enable_rules": [
                    condition
                    for rule_id in enable_rule_ids
                    for condition in metadata["enable_rules"].get(
                        rule_id,
                        [],
                    )
                ],
                "actions": [
                    _serialize_ribbon_node(action)
                    for action in command.findall("./Actions/*")
                ],
            }

    metadata["hidden_actions"] = [
        {
            "id": (
                action.get("HideActionId")
                or action.get("Id")
                or ""
            ),
            "location": action.get("Location", ""),
        }
        for action in root.findall(".//HideCustomAction")
    ]

    buttons = []
    control_names = {
        "Button",
        "ToggleButton",
        "SplitButton",
        "FlyoutAnchor",
    }

    def walk(element, location="", inherited_sequence=0, parent_id=""):
        element_name = _xml_local_name(element.tag)
        next_location = location
        next_sequence = inherited_sequence
        next_parent = parent_id
        if element_name == "CustomAction":
            next_location = element.get("Location", location)
            try:
                next_sequence = int(
                    element.get("Sequence", inherited_sequence or 0)
                )
            except ValueError:
                next_sequence = inherited_sequence

        if element_name in control_names:
            button_id = element.get("Id", "")
            command_id = element.get("Command", "")
            
            if element_name in ("FlyoutAnchor", "SplitButton") and button_id:
                next_parent = button_id
                
            command = metadata["commands"].get(command_id, {})
            raw_label = (
                element.get("LabelText")
                or element.get("ToolTipTitle")
                or element.get("Alt")
                or ""
            )
            try:
                sequence = int(
                    element.get("Sequence", next_sequence or 0)
                )
            except ValueError:
                sequence = next_sequence or 0
            if button_id and command_id:
                buttons.append({
                    "id": button_id,
                    "parent_id": parent_id,
                    "control_type": element_name,
                    "raw_label": raw_label,
                    "label": resolve_label(raw_label, button_id),
                    "tooltip": resolve_label(
                        element.get("ToolTipDescription")
                        or element.get("ToolTipTitle"),
                        "",
                    ),
                    "command": command_id,
                    "location": next_location,
                    "location_type": _ribbon_location_type(
                        f"{next_location}.{button_id}"
                    ),
                    "sequence": sequence,
                    "template_alias": element.get(
                        "TemplateAlias",
                        "",
                    ),
                    "image_16": element.get("Image16by16", ""),
                    "image_32": element.get("Image32by32", ""),
                    "display_rules": command.get(
                        "display_rules",
                        [],
                    ),
                    "enable_rules": command.get("enable_rules", []),
                    "actions": command.get("actions", []),
                })
        for child in list(element):
            walk(child, next_location, next_sequence, next_parent)

    walk(root)
    unique_buttons = {}
    hidden_locations = {
        action["location"]
        for action in metadata["hidden_actions"]
        if action["location"]
    }
    for button in buttons:
        if (
            button["id"] in hidden_locations
            or button["location"] in hidden_locations
        ):
            continue
        unique_buttons.setdefault(button["id"], button)
    metadata["buttons"] = sorted(
        unique_buttons.values(),
        key=lambda button: (
            button["location_type"],
            button["sequence"],
            button["label"],
        ),
    )
    return metadata


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
            title = _sitemap_label(subarea, entity)
            results.append({
                "entity": entity,
                "title": title,
                "available_offline": available_offline,
            })
        return results
    except Exception as e:
        logger.warning(f"SiteMap XML parse error: {e}")
        return []


def _sitemap_localized_values(node, container_name, child_name):
    values = []
    for child in node.findall(f"./{container_name}/{child_name}"):
        text = (
            child.get("Title")
            or child.get("Description")
            or child.get("description")
            or (child.text or "").strip()
        )
        if text:
            values.append({
                "language_code": (
                    child.get("LCID")
                    or child.get("languagecode")
                    or ""
                ),
                "text": text,
            })
    return values


def _sitemap_label(node, fallback):
    explicit = node.get("Title")
    if explicit:
        return explicit
    titles = _sitemap_localized_values(node, "Titles", "Title")
    english = next(
        (
            title["text"]
            for title in titles
            if title["language_code"] == "1033"
        ),
        None,
    )
    return english or (titles[0]["text"] if titles else fallback)


def _parse_sitemap_hierarchy(sitemap_xml: str) -> dict:
    if not sitemap_xml:
        return {"areas": []}
        
    try:
        from lxml import etree
        root = etree.fromstring(sitemap_xml.encode())
        
        sitemap = {"areas": []}
        for area in root.findall("./Area"):
            area_id = area.get("Id", "")
            area_data = {
                "id": area_id,
                "title": _sitemap_label(area, area_id),
                "icon": area.get("Icon", ""),
                "resource_id": area.get("ResourceId", ""),
                "description_resource_id": area.get(
                    "DescriptionResourceId",
                    "",
                ),
                "show_groups": area.get("ShowGroups", "true").lower()
                != "false",
                "titles": _sitemap_localized_values(
                    area,
                    "Titles",
                    "Title",
                ),
                "descriptions": _sitemap_localized_values(
                    area,
                    "Descriptions",
                    "Description",
                ),
                "groups": []
            }

            for group in area.findall("./Group"):
                group_id = group.get("Id", "")
                group_data = {
                    "id": group_id,
                    "title": _sitemap_label(group, group_id),
                    "icon": group.get("Icon", ""),
                    "resource_id": group.get("ResourceId", ""),
                    "description_resource_id": group.get(
                        "DescriptionResourceId",
                        "",
                    ),
                    "titles": _sitemap_localized_values(
                        group,
                        "Titles",
                        "Title",
                    ),
                    "descriptions": _sitemap_localized_values(
                        group,
                        "Descriptions",
                        "Description",
                    ),
                    "subareas": []
                }

                for subarea in group.findall("./SubArea"):
                    entity = subarea.get("Entity", "").lower()
                    subarea_id = subarea.get("Id", "")
                    url = subarea.get("Url", "")
                    dashboard_id = subarea.get("DefaultDashboard", "")
                    if entity:
                        destination_type = "entity"
                    elif dashboard_id:
                        destination_type = "dashboard"
                    elif url:
                        destination_type = "url"
                    else:
                        destination_type = "unsupported"
                    group_data["subareas"].append({
                        "id": subarea_id,
                        "entity": entity,
                        "title": _sitemap_label(
                            subarea,
                            entity or subarea_id,
                        ),
                        "destination_type": destination_type,
                        "url": url,
                        "default_dashboard": dashboard_id,
                        "icon": subarea.get("Icon", ""),
                        "vector_icon": subarea.get("VectorIcon", ""),
                        "resource_id": subarea.get("ResourceId", ""),
                        "description_resource_id": subarea.get(
                            "DescriptionResourceId",
                            "",
                        ),
                        "available_offline": subarea.get(
                            "AvailableOffline",
                            "false",
                        ).lower()
                        == "true",
                        "pass_params": subarea.get(
                            "PassParams",
                            "false",
                        ).lower()
                        == "true",
                        "client": subarea.get("Client", ""),
                        "sku": subarea.get("Sku", ""),
                        "titles": _sitemap_localized_values(
                            subarea,
                            "Titles",
                            "Title",
                        ),
                        "descriptions": _sitemap_localized_values(
                            subarea,
                            "Descriptions",
                            "Description",
                        ),
                        "privileges": [
                            dict(privilege.attrib)
                            for privilege in subarea.findall("./Privilege")
                        ],
                    })

                if group_data["subareas"]:
                    area_data["groups"].append(group_data)
                    
            if area_data["groups"]:
                sitemap["areas"].append(area_data)
                
        return sitemap
    except Exception as e:
        logger.warning(f"SiteMap XML parse error: {e}")
        return {"areas": []}
