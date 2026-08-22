"""
form_parser.py
Parses raw Dataverse FormXML into a clean, structured Python dict
that the code generator can use to build PyQt6 form classes.

FormXML structure:  form -> tabs -> columns -> sections -> rows -> cells -> control
"""
from lxml import etree
import logging
import xml.etree.ElementTree as StdET

try:
    from VerseOff.client_script_metadata import parse_form_event_handlers
except ImportError:
    from client_script_metadata import parse_form_event_handlers

try:
    from VerseOff.timeline_metadata import (
        is_timeline_control,
        parse_timeline_control,
    )
except ImportError:
    from timeline_metadata import (
        is_timeline_control,
        parse_timeline_control,
    )

logger = logging.getLogger(__name__)


def _label(node, default="") -> str:
    """Extracts the first label text from a <labels> node."""
    if node is None:
        return default
    label_node = node.find(".//label[@description]")
    if label_node is not None:
        return label_node.get("description", default)
    return default


def _tab_candidates(root):
    """Find the relevant form tabs regardless of whether FormXML wraps them in body/header elements."""
    candidates = []
    for xpath in (
        "./tabs/tab",
        "./body/tabs/tab",
        "./header/tabs/tab",
        "./footer/tabs/tab",
        ".//tabs/tab",
        ".//tab",
    ):
        candidates.extend(root.findall(xpath))
    deduped = []
    seen = set()
    for tab in candidates:
        ident = (
            tab.get("id")
            or tab.get("name")
            or etree.tostring(tab, encoding="unicode")
        )
        if ident not in seen:
            seen.add(ident)
            deduped.append(tab)
    return deduped


def _parse_section(
    section,
    attr_lookup,
    event_handlers=None,
    custom_control_bindings=None,
):
    sec_label = _label(section.find("labels"), default=section.get("name", "Section"))
    controls_out = []
    rows_out = []

    for row in section.findall("./rows/row"):
        cells_out = []
        for cell in row.findall("./cell"):
            control = cell.find("control")
            if control is None:
                continue

            attribute = control.get("datafieldname") or control.get("id") or ""
            if not attribute:
                continue

            cell_label = _label(cell.find("labels"), default="")
            if not cell_label and attribute in attr_lookup:
                display = attr_lookup[attribute].get("DisplayName", {})
                cell_label = display.get("UserLocalizedLabel", {}).get("Label", attribute)

            is_required = False
            if attribute in attr_lookup:
                required_level = attr_lookup[attribute].get("RequiredLevel", {}).get("Value", "None")
                is_required = required_level in ("Required", "SystemRequired")

            control_events = [
                dict(handler)
                for handler in (event_handlers or [])
                if handler.get("control") in {
                    attribute,
                    control.get("id"),
                }
            ]

            std_control = StdET.fromstring(etree.tostring(control, encoding="unicode"))
            custom_control = control.find(".//customControl")
            if custom_control is None:
                custom_control = (custom_control_bindings or {}).get(
                    control.get("id")
                )
            if custom_control is None:
                custom_control = (custom_control_bindings or {}).get(
                    attribute
                )
            timeline_definition = parse_timeline_control(std_control) if is_timeline_control(std_control) else None
            control_data = {
                "attribute": attribute,
                "label": cell_label or attribute,
                "type": _resolve_control_type(control, attribute, attr_lookup),
                "class_id": control.get("classid", ""),
                "required": is_required,
                "disabled": control.get("disabled", "false").lower() == "true",
                "options": [],
                "events": control_events,
                "parameters": {
                    child.tag: (child.text or "").strip()
                    for child in std_control.findall("./parameters/*")
                },
                "raw_control_xml": etree.tostring(control, encoding="unicode"),
                "pcf_name": (
                    custom_control.get("name", "")
                    if custom_control is not None
                    else ""
                ),
                "custom_control_xml": (
                    etree.tostring(
                        custom_control,
                        encoding="unicode",
                    )
                    if custom_control is not None
                    else ""
                ),
                "timeline_definition": timeline_definition,
            }
            controls_out.append(control_data)
            cells_out.append({
                "visible": cell.get("visible", "true").lower() != "false",
                "show_label": cell.get("showlabel", "true").lower() != "false",
                "column_span": int(cell.get("colspan", "1")),
                "row_span": int(cell.get("rowspan", "1")),
                "control": control_data,
            })
        if cells_out:
            rows_out.append({"height": row.get("height"), "cells": cells_out})

    return {
        "name": section.get("name", "Section"),
        "label": sec_label,
        "visible": section.get("visible", "true").lower() != "false",
        "show_label": section.get("showlabel", "true").lower() != "false",
        "show_bar": section.get("showbar", "true").lower() != "false",
        "label_width": int(section.get("labelwidth", "115")),
        "label_position": section.get("celllabelposition", "Left"),
        "rows": rows_out,
        "controls": controls_out,
    }


def parse_form_xml(xml_string: str, attribute_meta: list[dict] = None) -> dict:
   """
   Parses FormXML and returns a structured dict.

   This version is generic across Dataverse forms by walking both direct tab layouts and
   nested body/header/footer layouts, while preserving column widths, row span metadata,
   visibility flags, and raw control XML.
   """
   attr_lookup = {}
   if attribute_meta:
       for attr in attribute_meta:
           attr_lookup[attr["LogicalName"]] = attr

   try:
       root = etree.fromstring(
           xml_string.encode() if isinstance(xml_string, str) else xml_string
       )
   except etree.XMLSyntaxError as e:
       logger.error(f"FormXML parse error: {e}")
       return {"form_name": "Unknown", "tabs": [], "events": []}

   form_name = root.get("name", "Generated Form")
   tabs_out = []
   form_events_out = parse_form_event_handlers(xml_string)
   custom_control_bindings = {}
   for description in root.findall(
       ".//controlDescriptions/controlDescription"
   ):
       control_name = description.get("forControl")
       custom_controls = description.findall("./customControl")
       selected = next(
           (
               node
               for node in custom_controls
               if str(node.get("formFactor") or "") in {"", "0", "1"}
           ),
           custom_controls[0] if custom_controls else None,
       )
       if control_name and selected is not None:
           custom_control_bindings[control_name] = selected

   for tab in _tab_candidates(root):
       tab_label = _label(tab.find("labels"), default=tab.get("name", "Tab"))
       sections_out = []
       columns_out = []

       column_nodes = tab.findall("./columns/column")
       if not column_nodes:
           section_nodes = tab.findall("./sections/section")
           if section_nodes:
               for section in section_nodes:
                   section_data = _parse_section(
                       section,
                       attr_lookup,
                       form_events_out,
                       custom_control_bindings,
                   )
                   sections_out.append(section_data)
               columns_out.append({"width": "100%", "sections": sections_out})
       else:
           for column in column_nodes:
               column_sections = []
               section_nodes = column.findall("./sections/section")
               for section in section_nodes:
                   section_data = _parse_section(
                       section,
                       attr_lookup,
                       form_events_out,
                       custom_control_bindings,
                   )
                   column_sections.append(section_data)
                   sections_out.append(section_data)
               columns_out.append({
                   "width": column.get("width", ""),
                   "sections": column_sections,
               })

       if sections_out:
           tabs_out.append({
               "name": tab.get("name", "Tab"),
               "label": tab_label,
               "visible": tab.get("visible", "true").lower() != "false",
               "columns": columns_out,
               "sections": sections_out,
           })

   return {
       "form_name": form_name,
       "tabs": tabs_out,
       "events": form_events_out,
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
        "{9fdf5f91-88b1-47f4-ad53-c11efc01a01d}": "webresource", # WebResource
        "{fd2a7985-3187-444e-908d-6624b21f69c0}": "iframe",      # IFrame
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
        "MultiSelectPicklist": "multiselect",
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
        "Uniqueidentifier": "readonly",
        "EntityName": "readonly",
        "ManagedProperty": "readonly",
        "PartyList": "partylist",
        "Virtual": "readonly",
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
