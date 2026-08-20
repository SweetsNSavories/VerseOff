"""
form_parser.py
Parses raw Dataverse FormXML into a clean, structured Python dict
that the code generator can use to build PyQt6 form classes.

FormXML structure:  form -> tabs -> columns -> sections -> rows -> cells -> control
"""
from lxml import etree
import logging

logger = logging.getLogger(__name__)


def _label(node, default="") -> str:
    """Extracts the first label text from a <labels> node."""
    if node is None:
        return default
    label_node = node.find(".//label[@description]")
    if label_node is not None:
        return label_node.get("description", default)
    return default


def parse_form_xml(xml_string: str, attribute_meta: list[dict] = None) -> dict:
    """
    Parses FormXML and returns a structured dict.

    Args:
        xml_string: Raw FormXML string from Dataverse SystemForm.formxml
        attribute_meta: Optional list of entity attribute dicts to enrich type info

    Returns:
        {
          "form_name": str,
      "tabs": [
        {
          "label": str,
          "sections": [
            {
              "label": str,
              "controls": [
                {
                  "attribute": str,
                  "label": str,
                  "type": str,   # text|memo|picklist|lookup|datetime|boolean|integer|decimal
                  "required": bool,
                  "options": [{"value": int, "label": str}],  # for picklists
                  "events": [{"event": "onchange", "function": str, "library": str, "pass_context": bool}]
                }
              ]
            }
          ]
        }
      ],
      "events": [{"event": "onload|onsave", "function": str, "library": str, "pass_context": bool}]
    }
"""
    # Build an attribute type lookup from entity metadata
    attr_lookup = {}
    if attribute_meta:
        for attr in attribute_meta:
            attr_lookup[attr["LogicalName"]] = attr

    try:
        root = etree.fromstring(xml_string.encode() if isinstance(xml_string, str) else xml_string)
    except etree.XMLSyntaxError as e:
        logger.error(f"FormXML parse error: {e}")
        return {"form_name": "Unknown", "tabs": [], "events": []}

    form_name = root.get("name", "Generated Form")
    tabs_out = []
    form_events_out = []

    # Extract form-level events (onload, onsave)
    for event_node in root.findall("./events/event"):
        evt_name = event_node.get("name", "").lower()
        for handler in event_node.findall(".//Handler"):
            form_events_out.append({
                "event": evt_name,
                "function": handler.get("functionName", ""),
                "library": handler.get("libraryName", ""),
                "pass_context": handler.get("passExecutionContext", "false").lower() == "true"
            })

    for tab in root.findall(".//tab"):
        tab_label = _label(tab.find("labels"), default=tab.get("name", "Tab"))
        sections_out = []

        for section in tab.findall(".//section"):
            sec_label = _label(section.find("labels"), default=section.get("name", "Section"))
            controls_out = []

            for cell in section.findall(".//cell"):
                control = cell.find("control")
                if control is None:
                    continue

                attribute = control.get("datafieldname", "")
                if not attribute:
                    continue  # Skip label-only / spacer cells

                # Determine label from cell or attribute meta
                cell_label = _label(cell.find("labels"), default="")
                if not cell_label and attribute in attr_lookup:
                    display = attr_lookup[attribute].get("DisplayName", {})
                    cell_label = display.get("UserLocalizedLabel", {}).get("Label", attribute)

                # Determine control type
                ctrl_type = _resolve_control_type(control, attribute, attr_lookup)

                # Check required
                is_required = False
                if attribute in attr_lookup:
                    req = attr_lookup[attribute].get("RequiredLevel", {}).get("Value", "None")
                    is_required = req in ("Required", "SystemRequired")

                # Extract control-level events (onchange)
                control_events = []
                for event_node in control.findall(".//events/event"):
                    evt_name = event_node.get("name", "").lower()
                    for handler in event_node.findall(".//Handler"):
                        control_events.append({
                            "event": evt_name,
                            "function": handler.get("functionName", ""),
                            "library": handler.get("libraryName", ""),
                            "pass_context": handler.get("passExecutionContext", "false").lower() == "true"
                        })

                controls_out.append({
                    "attribute": attribute,
                    "label": cell_label or attribute,
                    "type": ctrl_type,
                    "required": is_required,
                    "options": [],  # populated later by code_generator from option set metadata
                    "events": control_events
                })

            if controls_out:
                sections_out.append({"label": sec_label, "controls": controls_out})

        if sections_out:
            tabs_out.append({"label": tab_label, "sections": sections_out})

    return {
        "form_name": form_name, 
        "tabs": tabs_out,
        "events": form_events_out
    }


def _resolve_control_type(control_node, attribute: str, attr_lookup: dict) -> str:
    """Maps a FormXML control + attribute metadata to a simple type string."""
    # Check the classid attribute on the control for known control types
    classid = (control_node.get("classid") or "").lower()

    # Known Dynamics classids → type mapping
    CLASSID_MAP = {
        "{4273edbd-ac1d-40d3-9fb2-095c621b552d}": "text",     # TextBox
        "{e0dba600-d4c9-4b3c-b907-80e10892ad0e}": "memo",     # TextArea
        "{3ef39988-22bb-4f0b-bbbe-64b5a3748f10}": "picklist", # OptionSet
        "{b0c6723a-8503-4fd7-bb28-c8a06ac933c2}": "boolean",  # CheckBox
        "{5b773807-9fb2-42db-97c3-7a91d7e8b4b8}": "datetime", # DateTime
        "{270bd3db-d9af-4782-9025-509e298b0578}": "lookup",   # Lookup
        "{533b9e00-756b-4312-95a0-dc888637ac78}": "integer",  # Integer
        "{c3efe0c3-0ec6-42be-8349-cbd9079e8bc6}": "decimal",  # Decimal
    }

    for cid_key, ctype in CLASSID_MAP.items():
        if cid_key in classid:
            return ctype

    # Fallback: infer from attribute metadata
    if attribute in attr_lookup:
        attr_type = attr_lookup[attribute].get("AttributeType", "String")
        return _attribute_type_to_control(attr_type)

    return "text"


def _attribute_type_to_control(attribute_type: str) -> str:
    TYPE_MAP = {
        "String": "text",
        "Memo": "memo",
        "Picklist": "picklist",
        "Boolean": "boolean",
        "DateTime": "datetime",
        "Lookup": "lookup",
        "Customer": "lookup",
        "Owner": "lookup",
        "Integer": "integer",
        "Decimal": "decimal",
        "Double": "decimal",
        "Money": "decimal",
        "BigInt": "integer",
        "UniqueIdentifier": "text",
        "Virtual": "text",
    }
    return TYPE_MAP.get(attribute_type, "text")


def build_form_from_attributes(entity_logical_name: str, attributes: list[dict]) -> dict:
    """
    Fallback: Builds a simple form structure directly from entity attribute
    metadata when no FormXML is available (e.g. custom entities without forms).
    """
    controls = []
    for attr in attributes:
        logical = attr.get("LogicalName", "")
        if logical.endswith("id") and logical != attr.get("PrimaryIdAttribute", "???"):
            continue  # skip system ID lookups
        display = attr.get("DisplayName", {}).get("UserLocalizedLabel", {}).get("Label", logical)
        ctrl_type = _attribute_type_to_control(attr.get("AttributeType", "String"))
        req = attr.get("RequiredLevel", {}).get("Value", "None")
        controls.append({
            "attribute": logical,
            "label": display,
            "type": ctrl_type,
            "required": req in ("Required", "SystemRequired"),
            "options": [],
        })

    return {
        "form_name": entity_logical_name.capitalize(),
        "tabs": [{
            "label": "General",
            "sections": [{"label": "Details", "controls": controls}]
        }]
    }
