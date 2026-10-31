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


try:
    from VerseOff.schema_manager import SchemaManager, KNOWN_CONTROL_CLASSIDS
except ImportError:
    try:
        from schema_manager import SchemaManager, KNOWN_CONTROL_CLASSIDS
    except ImportError:
        SchemaManager = None
        KNOWN_CONTROL_CLASSIDS = {}


def _parse_header_footer(container_node, attr_lookup, event_handlers=None, custom_control_bindings=None):
    """Parses <header> or <footer> nodes into a structured dict with rows, cells, and controls."""
    if container_node is None:
        return None

    rows_out = []
    controls_out = []
    for row in container_node.findall(".//rows/row") or container_node.findall("./row"):
        cells_out = []
        for cell in row.findall("./cell"):
            control = cell.find("control")
            if control is None:
                continue
            attribute = control.get("datafieldname") or control.get("id") or ""
            cell_label = _label(cell.find("labels"), default="")
            if not cell_label and attribute in attr_lookup:
                display = attr_lookup[attribute].get("DisplayName", {})
                cell_label = display.get("UserLocalizedLabel", {}).get("Label", attribute)

            std_control = StdET.fromstring(etree.tostring(control, encoding="unicode"))
            control_data = {
                "attribute": attribute,
                "label": cell_label or attribute,
                "type": _resolve_control_type(control, attribute, attr_lookup),
                "class_id": control.get("classid", ""),
                "required": False,
                "disabled": control.get("disabled", "false").lower() == "true",
                "options": [],
                "parameters": {
                    child.tag: (child.text or "").strip()
                    for child in std_control.findall("./parameters/*")
                },
                "raw_control_xml": etree.tostring(control, encoding="unicode"),
            }
            controls_out.append(control_data)
            cells_out.append({
                "id": cell.get("id", ""),
                "visible": cell.get("visible", "true").lower() != "false",
                "show_label": cell.get("showlabel", "true").lower() != "false",
                "column_span": int(cell.get("colspan", "1")),
                "row_span": int(cell.get("rowspan", "1")),
                "control": control_data,
            })
        if cells_out:
            rows_out.append({"cells": cells_out})

    return {
        "columns": container_node.get("columns", "1111"),
        "label_position": container_node.get("celllabelposition", "Top"),
        "status_code": container_node.get("statuscode", ""),
        "rows": rows_out,
        "controls": controls_out,
    }


def _parse_navigation(root):
    nav_node = root.find(".//Navigation")
    if nav_node is None:
        nav_node = root.find(".//navigation")
    if nav_node is None:
        return {"items": [], "areas": []}

    items_out = []
    for item in nav_node.findall(".//NavBarByRelationshipItem"):
        items_out.append({
            "relationship_name": item.get("RelationshipName", ""),
            "id": item.get("Id", ""),
            "title": _label(item.find("Titles"), default=item.get("Title", item.get("Id", ""))),
            "area": item.get("Area", "Info"),
            "sequence": int(item.get("Sequence", "100")),
            "icon": item.get("Icon", ""),
            "show": item.get("Show", "true").lower() != "false",
        })

    return {
        "show_navigation_bar": nav_node.get("shownavigationbar", "true").lower() != "false",
        "items": items_out,
    }


def _parse_hidden_controls(root):
    """Parses <hiddencontrols> nodes from FormXML."""
    hidden = []
    for hc in root.findall(".//hiddencontrols/hiddencontrol"):
        hidden.append({
            "id": hc.get("id", ""),
            "datafieldname": hc.get("datafieldname", ""),
            "class_id": hc.get("classid", ""),
        })
    return hidden


def parse_form_xml(xml_string: str, attribute_meta: list[dict] = None) -> dict:
    """
    Parses FormXML into a rich structured dict conforming to Power Platform FormXml.xsd.
    Walks headers, footers, tabs, columns, sections, rows, cells, controls, navigation,
    hidden controls, and custom control descriptions.
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

    # Validate against FormXml.xsd if SchemaManager is available
    if SchemaManager:
        try:
            sm = SchemaManager()
            is_valid, validation_errors = sm.validate_form_xml(xml_string)
            if not is_valid:
                logger.debug(f"FormXML schema validation notices: {len(validation_errors)} notices found.")
        except Exception as sm_err:
            logger.debug(f"SchemaManager validation skipped: {sm_err}")

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

    # Header & Footer Parsing
    header_node = root.find("./header")
    if header_node is None:
        header_node = root.find("./body/header")
    footer_node = root.find("./footer")
    if footer_node is None:
        footer_node = root.find("./body/footer")
    header_data = _parse_header_footer(header_node, attr_lookup, form_events_out, custom_control_bindings)
    footer_data = _parse_header_footer(footer_node, attr_lookup, form_events_out, custom_control_bindings)
    navigation_data = _parse_navigation(root)
    hidden_controls = _parse_hidden_controls(root)

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
                "expanded": tab.get("expanded", "true").lower() != "false",
                "vertical_layout": tab.get("verticallayout", "false").lower() == "true",
                "show_label": tab.get("showlabel", "true").lower() != "false",
                "columns": columns_out,
                "sections": sections_out,
            })

    return {
        "form_name": form_name,
        "tabs": tabs_out,
        "events": form_events_out,
        "header": header_data,
        "footer": footer_data,
        "navigation": navigation_data,
        "hidden_controls": hidden_controls,
        "shownavigationbar": root.get("shownavigationbar", "true").lower() != "false",
        "showImage": root.get("showImage", "false").lower() == "true",
        "minwidth": root.get("minwidth", "1024"),
    }


def _resolve_control_type(control_node, attribute: str, attr_lookup: dict) -> str:
    """Maps a FormXML control + attribute metadata to a simple type string using schema catalog."""
    classid = (control_node.get("classid") or "").lower()

    # 1. Check known class IDs directly or via KNOWN_CONTROL_CLASSIDS
    for cid_key, cinfo in KNOWN_CONTROL_CLASSIDS.items():
        if cid_key.lower() in classid:
            return cinfo["type"]

    # Extended classid checks
    CLASSID_MAP = {
        "{4273edbd-ac1d-40d3-9fb2-095c621b552d}": "text",     # TextBox
        "{e0dba600-d4c9-4b3c-b907-80e10892ad0e}": "memo",     # TextArea
        "{3ef39988-22bb-4f0b-bbbe-64b5a3748f10}": "picklist", # OptionSet
        "{4aa28ab7-9c13-482f-ac51-bb4439c27f32}": "multiselect", # MultiSelectOptionSet
        "{b0c6723a-8503-4fd7-bb28-c8a06ac933c2}": "boolean",  # CheckBox
        "{670a3c20-b85f-4228-a461-8ff8536f987f}": "boolean",  # FlipSwitch
        "{5b773807-9fb2-42db-97c3-7a91d7e8b4b8}": "datetime", # DateTime
        "{270bd3db-d9af-4782-9025-509e298b0578}": "lookup",   # Lookup
        "{cb624414-7551-420a-9694-b2a6058097d7}": "lookup",   # CustomerLookup
        "{533b9e00-756b-4312-95a0-dc888637ac78}": "integer",  # Integer
        "{c6d124ca-7eda-4a60-aea9-7fb8d318b68f}": "integer",  # WholeNumber
        "{c3efe0c3-0ec6-42be-8349-cbd9079e8bc6}": "decimal",  # Decimal
        "{533b9e00-756b-4312-95a0-dc888637ac79}": "decimal",  # Money
        "{9fdf5f91-88b1-47f4-ad53-c11efc01a01d}": "webresource", # WebResource
        "{fd2a7985-3187-444e-908d-6624b21f69c0}": "iframe",      # IFrame
        "{e7579c73-8549-467d-8713-2498322704f4}": "subgrid",     # Subgrid
        "{f9a8a302-114e-466a-b582-6771b2ae0d92}": "quickview",   # QuickView
        "{9c563dcb-b617-4847-a7eb-6c1c385c5b4e}": "timer",       # Timer control
        "{8c54228c-1b49-4130-97fb-37e197709334}": "timeline",    # Timeline
        "{06397e06-6460-450f-901c-6636227c44e9}": "timeline",    # NotesTimeline
        "{f02ef9d0-a027-11e3-a5e2-0800200c9a66}": "pcf",         # PCF Control
    }

    for cid_key, ctype in CLASSID_MAP.items():
        if cid_key in classid:
            return ctype

    if control_node.get("indicationOfSubgrid", "false").lower() == "true":
        return "subgrid"

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
