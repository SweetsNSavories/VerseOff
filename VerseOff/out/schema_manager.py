"""
schema_manager.py
Manages, indexes, introspects, and validates against all official Microsoft Power Platform
XML Schema Definitions (XSDs) published for Dataverse and Model-Driven Apps:
  - CustomizationsSolution.xsd (Master Solution Schema)
  - FormXml.xsd (Forms, Headers, Footers, Tabs, Sections, Cells, Controls)
  - SiteMap.xsd & SiteMapType.xsd (Navigation SiteMap)
  - RibbonCore.xsd, RibbonTypes.xsd, RibbonWSS.xsd (Commands, Rules, Ribbon Controls)
  - Fetch.xsd (FetchXML Query Schema)
  - ParameterXml.xsd (Solution Parameters)
  - VisualizationDataDescription.xsd (Charts & Metrics)
  - isv.config.xsd & reports.config.xsd (ISV Toolbars & Reports)
"""

import os
import re
import sys
import logging
from typing import Dict, List, Optional, Tuple, Any
from lxml import etree

logger = logging.getLogger(__name__)

# Standard namespace for W3C XML Schema
XSD_NS = {"xs": "http://www.w3.org/2001/XMLSchema"}

# Official Dynamics 365 / Power Platform Control Class IDs
KNOWN_CONTROL_CLASSIDS = {
    # Text controls
    "{4273edbd-ac1d-40d3-9fb2-095c621b552d}": {"name": "TextBox", "type": "text"},
    "{e0dba600-d4c9-4b3c-b907-80e10892ad0e}": {"name": "TextArea", "type": "memo"},
    # Selection controls
    "{3ef39988-22bb-4f0b-bbbe-64b5a3748f10}": {"name": "OptionSet", "type": "picklist"},
    "{4aa28ab7-9c13-482f-ac51-bb4439c27f32}": {"name": "MultiSelectOptionSet", "type": "multiselect"},
    "{b0c6723a-8503-4fd7-bb28-c8a06ac933c2}": {"name": "CheckBox", "type": "boolean"},
    "{670a3c20-b85f-4228-a461-8ff8536f987f}": {"name": "FlipSwitch", "type": "boolean"},
    # Date and time
    "{5b773807-9fb2-42db-97c3-7a91d7e8b4b8}": {"name": "DateTime", "type": "datetime"},
    # Lookups
    "{270bd3db-d9af-4782-9025-509e298b0578}": {"name": "Lookup", "type": "lookup"},
    "{cb624414-7551-420a-9694-b2a6058097d7}": {"name": "CustomerLookup", "type": "lookup"},
    # Numbers
    "{c6d124ca-7eda-4a60-aea9-7fb8d318b68f}": {"name": "WholeNumber", "type": "integer"},
    "{533b9e00-756b-4312-95a0-dc888637ac78}": {"name": "Integer", "type": "integer"},
    "{c3efe0c3-0ec6-42be-8349-cbd9079e8bc6}": {"name": "Decimal", "type": "decimal"},
    "{533b9e00-756b-4312-95a0-dc888637ac79}": {"name": "Money", "type": "decimal"},
    # Advanced Controls
    "{e7579c73-8549-467d-8713-2498322704f4}": {"name": "Subgrid", "type": "subgrid"},
    "{f9a8a302-114e-466a-b582-6771b2ae0d92}": {"name": "QuickView", "type": "quickview"},
    "{9fdf5f91-88b1-47f4-ad53-c11efc01a01d}": {"name": "WebResource", "type": "webresource"},
    "{fd2a7985-3187-444e-908d-6624b21f69c0}": {"name": "IFrame", "type": "iframe"},
    "{9c563dcb-b617-4847-a7eb-6c1c385c5b4e}": {"name": "TimerControl", "type": "timer"},
    "{06397e06-6460-450f-901c-6636227c44e9}": {"name": "NotesTimeline", "type": "timeline"},
    "{8c54228c-1b49-4130-97fb-37e197709334}": {"name": "Timeline", "type": "timeline"},
    "{f02ef9d0-a027-11e3-a5e2-0800200c9a66}": {"name": "PcfControl", "type": "pcf"},
}


class SchemaManager:
    """
    Central catalog and validation authority for Microsoft Power Platform schemas.
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(SchemaManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, schema_dir: Optional[str] = None):
        if getattr(self, "_initialized", False):
            return

        self.schema_dir = self._resolve_schema_dir(schema_dir)
        self._sanitized_dir: Optional[str] = None
        self._compiled_schemas: Dict[str, etree.XMLSchema] = {}
        self._element_catalog: Dict[str, Dict[str, Any]] = {}
        self._complex_types: Dict[str, Dict[str, Any]] = {}
        self._simple_types: Dict[str, Dict[str, Any]] = {}

        self._load_catalog()
        self._initialized = True

    @staticmethod
    def _resolve_schema_dir(explicit_dir: Optional[str] = None) -> str:
        """Finds the directory containing the XSD schemas."""
        candidates = []
        if explicit_dir:
            candidates.append(explicit_dir)

        base_dir = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
        candidates.extend([
            os.path.join(base_dir, "schemas", "Schemas", "9.0.0.2090"),
            os.path.join(base_dir, "schemas", "9.0.0.2090"),
            os.path.join(base_dir, "schemas"),
            os.path.join(os.getcwd(), "schemas", "Schemas", "9.0.0.2090"),
            os.path.join(os.getcwd(), "VerseOff", "schemas", "Schemas", "9.0.0.2090"),
        ])

        for path in candidates:
            if os.path.isdir(path) and any(f.endswith(".xsd") for f in os.listdir(path)):
                return os.path.abspath(path)

        raise FileNotFoundError(
            f"Power Platform XSD schemas directory not found in candidate locations: {candidates}"
        )

    def _sanitize_xsd_for_w3c(self, content: str) -> str:
        """
        Normalizes Microsoft .NET specific regex extensions in XSDs so that strict W3C
        XML Schema validators (e.g. libxml2) can compile them without syntax errors.
        """
        # 1. Replace negative lookaheads like (?![cC][rR][mM]_) in pattern facets
        content = re.sub(
            r'<xs:pattern\s+value="(?:\(\?!\[cC\]\[rR\]\[mM\]_\)|[^\"]*\(\?!)[^\"]*"\s*/>',
            '<xs:pattern value="[A-Za-z0-9_]+" />',
            content,
        )
        # 2. Strip ^ and $ anchors which are implicit in W3C XML Schema regexes
        content = re.sub(
            r'<xs:pattern\s+value="\^(.*?)\$"\s*/>',
            r'<xs:pattern value="\1" />',
            content,
        )
        return content

    def _prepare_sanitized_schemas(self) -> str:
        """Copies sanitized XSDs into a local cache directory for lxml compilation."""
        if self._sanitized_dir and os.path.isdir(self._sanitized_dir):
            return self._sanitized_dir

        import tempfile
        target_dir = os.path.join(tempfile.gettempdir(), "verseoff_w3c_schemas")
        os.makedirs(target_dir, exist_ok=True)

        for fn in os.listdir(self.schema_dir):
            if not fn.endswith(".xsd"):
                continue
            src_fp = os.path.join(self.schema_dir, fn)
            dst_fp = os.path.join(target_dir, fn)
            with open(src_fp, "r", encoding="utf-8") as sf:
                cleaned = self._sanitize_xsd_for_w3c(sf.read())
            with open(dst_fp, "w", encoding="utf-8") as df:
                df.write(cleaned)

        self._sanitized_dir = target_dir
        return target_dir

    def _load_catalog(self):
        """Indexes all elements, complex types, and simple types across all XSD files."""
        for fn in sorted(os.listdir(self.schema_dir)):
            if not fn.endswith(".xsd"):
                continue
            fp = os.path.join(self.schema_dir, fn)
            try:
                tree = etree.parse(fp)
            except Exception as e:
                logger.warning("Failed to parse XSD %s: %s", fn, e)
                continue

            root = tree.getroot()

            # Index named elements
            for el in root.findall(".//xs:element", XSD_NS):
                name = el.get("name")
                if not name:
                    continue
                attrs = [a.get("name") for a in el.findall(".//xs:attribute", XSD_NS) if a.get("name")]
                children = [
                    c.get("name") or c.get("ref")
                    for c in el.findall(".//xs:element", XSD_NS)
                    if (c.get("name") or c.get("ref"))
                ]
                self._element_catalog[name] = {
                    "schema": fn,
                    "type": el.get("type") or "inline",
                    "attributes": attrs,
                    "children": list(set(children)),
                    "minOccurs": el.get("minOccurs", "1"),
                    "maxOccurs": el.get("maxOccurs", "1"),
                }

            # Index complex types
            for ct in root.findall(".//xs:complexType", XSD_NS):
                name = ct.get("name")
                if not name:
                    continue
                attrs = [a.get("name") for a in ct.findall(".//xs:attribute", XSD_NS) if a.get("name")]
                children = [
                    c.get("name") or c.get("ref")
                    for c in ct.findall(".//xs:element", XSD_NS)
                    if (c.get("name") or c.get("ref"))
                ]
                self._complex_types[name] = {
                    "schema": fn,
                    "attributes": attrs,
                    "children": list(set(children)),
                }

            # Index simple types
            for st in root.findall(".//xs:simpleType", XSD_NS):
                name = st.get("name")
                if not name:
                    continue
                enums = [en.get("value") for en in st.findall(".//xs:enumeration", XSD_NS)]
                self._simple_types[name] = {
                    "schema": fn,
                    "enums": enums,
                }

    def get_compiled_schema(self, schema_name: str) -> etree.XMLSchema:
        """Compiles and caches an XMLSchema for the requested XSD."""
        if schema_name in self._compiled_schemas:
            return self._compiled_schemas[schema_name]

        clean_dir = self._prepare_sanitized_schemas()
        schema_file = os.path.join(clean_dir, schema_name)
        if not os.path.exists(schema_file):
            raise FileNotFoundError(f"Schema file not found: {schema_file}")

        try:
            doc = etree.parse(schema_file)
            compiled = etree.XMLSchema(doc)
            self._compiled_schemas[schema_name] = compiled
            return compiled
        except Exception as e:
            logger.error("Error compiling schema %s: %s", schema_name, e)
            raise

    def validate_xml(
        self, xml_content: str, schema_name: str
    ) -> Tuple[bool, List[str]]:
        """
        Validates an XML string against a specific Power Platform XSD schema.
        Returns (is_valid, list_of_error_messages).
        """
        try:
            schema = self.get_compiled_schema(schema_name)
        except Exception as e:
            return False, [f"Schema compilation failed: {e}"]

        try:
            if isinstance(xml_content, str):
                doc = etree.fromstring(xml_content.encode("utf-8"))
            else:
                doc = xml_content
        except etree.XMLSyntaxError as e:
            return False, [f"XML syntax error: {e}"]

        if schema.validate(doc):
            return True, []
        else:
            errors = [f"Line {err.line}: {err.message}" for err in schema.error_log]
            return False, errors

    # Specialized validation helpers
    def validate_form_xml(self, xml_content: str) -> Tuple[bool, List[str]]:
        """Validates FormXML against FormXml.xsd."""
        return self.validate_xml(xml_content, "FormXml.xsd")

    def validate_sitemap_xml(self, xml_content: str) -> Tuple[bool, List[str]]:
        """Validates SiteMap XML against SiteMap.xsd."""
        return self.validate_xml(xml_content, "SiteMap.xsd")

    def validate_fetch_xml(self, xml_content: str) -> Tuple[bool, List[str]]:
        """Validates FetchXML against Fetch.xsd."""
        return self.validate_xml(xml_content, "Fetch.xsd")

    def validate_ribbon_xml(self, xml_content: str) -> Tuple[bool, List[str]]:
        """Validates RibbonDiffXml against RibbonCore.xsd."""
        return self.validate_xml(xml_content, "RibbonCore.xsd")

    def validate_customizations_xml(self, xml_content: str) -> Tuple[bool, List[str]]:
        """Validates customizations.xml against CustomizationsSolution.xsd."""
        return self.validate_xml(xml_content, "CustomizationsSolution.xsd")

    # Schema Introspection
    def get_element_def(self, element_name: str) -> Optional[Dict[str, Any]]:
        """Returns the schema definition for an XML element."""
        return self._element_catalog.get(element_name)

    def get_control_type_for_classid(self, classid: str) -> Dict[str, str]:
        """Resolves a Power Platform control class ID to its name and widget type."""
        normalized = (classid or "").strip().lower()
        for cid, info in KNOWN_CONTROL_CLASSIDS.items():
            if cid.lower() in normalized:
                return info
        return {"name": "GenericControl", "type": "text"}

    def get_allowed_children(self, element_or_type_name: str) -> List[str]:
        """Returns the list of valid child elements for an element or complex type."""
        if element_or_type_name in self._element_catalog:
            return self._element_catalog[element_or_type_name].get("children", [])
        if element_or_type_name in self._complex_types:
            return self._complex_types[element_or_type_name].get("children", [])
        return []

    def get_supported_parameters_for_control(self) -> List[str]:
        """
        Returns all parameter tags supported under <control><parameters> according to FormXmlControlType.
        """
        control_type = self._complex_types.get("FormXmlControlType", {})
        return control_type.get("children", [])

    def summary(self) -> Dict[str, int]:
        """Returns summary counts of the loaded schema catalog."""
        return {
            "schemas_dir": self.schema_dir,
            "elements_count": len(self._element_catalog),
            "complex_types_count": len(self._complex_types),
            "simple_types_count": len(self._simple_types),
        }
