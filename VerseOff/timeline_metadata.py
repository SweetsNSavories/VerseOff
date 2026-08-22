import json
import re
import xml.etree.ElementTree as ET


TIMELINE_CLASS_ID = "{06375649-c143-495e-a496-c962e5b4488e}"
DEFAULT_ACTIVITY_TYPES = (
    "appointment",
    "email",
    "phonecall",
    "task",
)
ACTIVITY_SUPPORT_TABLES = (
    "activitypointer",
    "activityparty",
    "activitymimeattachment",
    "activityfileattachment",
    "attachment",
    "systemuser",
    "team",
    "queue",
    "queueitem",
)
NOTE_SUPPORT_TABLES = ("annotation", "systemuser")
POST_SUPPORT_TABLES = (
    "post",
    "postcomment",
    "postlike",
    "postregarding",
    "systemuser",
)


def _bool(value, default=False):
    if value is None or str(value).strip() == "":
        return default
    return str(value).strip().lower() in {"true", "1", "yes"}


def _int(value, default, minimum=None, maximum=None):
    try:
        parsed = int(str(value).strip())
    except (TypeError, ValueError):
        parsed = default
    if minimum is not None:
        parsed = max(minimum, parsed)
    if maximum is not None:
        parsed = min(maximum, parsed)
    return parsed


def _csv(value):
    return [
        item.strip()
        for item in str(value or "").split(",")
        if item.strip()
    ]


def _json(value, default):
    if not value:
        return default
    try:
        parsed = json.loads(value)
    except (TypeError, ValueError):
        return default
    return parsed if isinstance(parsed, type(default)) else default


def _normalize_id(value):
    return str(value or "").strip().strip("{}").lower()


def _label(node, fallback=""):
    if node is None:
        return fallback
    labels = node.findall("./labels/label")
    preferred = next(
        (
            item
            for item in labels
            if item.get("languagecode") == "1033"
        ),
        labels[0] if labels else None,
    )
    return (
        preferred.get("description")
        if preferred is not None
        else fallback
    )


def is_timeline_control(control):
    if control is None:
        return False
    control_id = str(control.get("id") or "").strip().lower()
    class_id = str(control.get("classid") or "").strip().lower()
    parameters = control.find("./parameters")
    parameter_children = (
        list(parameters)
        if parameters is not None
        else []
    )
    parameter_names = {
        child.tag
        for child in parameter_children
    }
    custom_names = {
        str(item.get("name") or "").lower()
        for item in control.findall(".//customControl")
    }
    return any((
        class_id == TIMELINE_CLASS_ID,
        control_id in {"notescontrol", "timeline", "timelinewall"},
        "UClientUniqueName" in parameter_names
        and (
            parameters.findtext("UClientUniqueName", "").strip().lower()
            == "timeline"
        ),
        any("timeline" in name for name in custom_names),
        bool({
            "UClientModules",
            "UClientActivities",
            "UClientActivityCardMap",
            "UClientActivitiesConfigurationJSON",
        } & parameter_names),
    ))


def parse_activity_card_map(value):
    result = {}
    for entry in _csv(value):
        parts = entry.split(":", 2)
        logical_name = parts[0].strip().lower()
        if not logical_name:
            continue
        result[logical_name] = {
            "logical_name": logical_name,
            "object_type_code": (
                parts[1].strip()
                if len(parts) > 1
                else ""
            ),
            "form_id": (
                _normalize_id(parts[2])
                if len(parts) > 2
                else ""
            ),
        }
    return result


def parse_timeline_control(
    control,
    *,
    form_id="",
    form_name="",
    entity_name="",
):
    if not is_timeline_control(control):
        return None
    parameters = control.find("./parameters")
    raw_parameters = {
        child.tag: (child.text or "").strip()
        for child in (
            list(parameters)
            if parameters is not None
            else []
        )
    }
    modules = _csv(raw_parameters.get("UClientModules"))
    if not modules:
        modules = ["Activities", "Notes", "Posts"]
    modules = [
        module.title()
        for module in modules
        if module.title() in {"Activities", "Notes", "Posts"}
    ]

    activity_configuration = _json(
        raw_parameters.get("UClientActivitiesConfigurationJSON"),
        {},
    )
    card_map = parse_activity_card_map(
        raw_parameters.get("UClientActivityCardMap")
    )
    activities = []
    for candidate in (
        _csv(raw_parameters.get("UClientActivities"))
        + list(activity_configuration)
        + list(card_map)
    ):
        normalized = candidate.strip().lower()
        if normalized and normalized not in activities:
            activities.append(normalized)
    if "Activities" in modules and not activities:
        activities.extend(DEFAULT_ACTIVITY_TYPES)

    custom_sources = _json(
        raw_parameters.get("UClientRecordSourcesJSON"),
        {},
    ).get("recordSources", [])
    if not isinstance(custom_sources, list):
        custom_sources = []

    control_id = control.get("id") or "Timeline"
    record_per_page = _int(
        raw_parameters.get("UClientRecordPerPage"),
        10,
        minimum=1,
        maximum=50,
    )
    return {
        "id": (
            f"{_normalize_id(form_id) or form_name}:{control_id}"
        ),
        "control_id": control_id,
        "class_id": control.get("classid", ""),
        "form_id": _normalize_id(form_id),
        "form_name": form_name,
        "entity_name": entity_name,
        "modules": modules,
        "default_create_module": raw_parameters.get(
            "UClientDefaultModuleForCreateExperience",
            "Notes",
        ).title(),
        "show_filter_pane": _bool(
            raw_parameters.get("UClientShowFilterPane"),
            True,
        ),
        "expand_filter_pane": _bool(
            raw_parameters.get("UClientExpandFilterPane"),
            False,
        ),
        "show_search": _bool(
            raw_parameters.get("UClientShowSearchBar"),
            True,
        ),
        "expand_all": _bool(
            raw_parameters.get("UClientExpandAllRecords"),
            False,
        ),
        "show_whats_new": _bool(
            raw_parameters.get("UClientEnableWhatsNewFilter"),
            False,
        ),
        "record_per_page": record_per_page,
        "order": raw_parameters.get(
            "UClientOrderBy",
            raw_parameters.get("OrderByActivityWall", "descending"),
        ).lower(),
        "activity_sort_field": raw_parameters.get(
            "UClientSortActivitiesByValue",
            raw_parameters.get("SortActivityWall", "modifiedon"),
        ),
        "create_activity_using": raw_parameters.get(
            "UClientCreateActivityUsing",
            "default",
        ),
        "display_activity_using": raw_parameters.get(
            "UClientDisplayActivityUsing",
            "default",
        ),
        "display_activity_header_using": raw_parameters.get(
            "UClientDisplayActivityHeaderUsing",
            "defaultformat",
        ),
        "email_conversation_view": _bool(
            raw_parameters.get("EmailConversationView"),
            False,
        ),
        "default_tab_id": raw_parameters.get(
            "DefaultTabId",
            "ActivitiesTab",
        ),
        "activities": activities,
        "activity_configuration": activity_configuration,
        "activity_card_map": card_map,
        "custom_record_sources": custom_sources,
        "raw_parameters": raw_parameters,
        "raw_control_xml": ET.tostring(
            control,
            encoding="unicode",
        ),
    }


def extract_timeline_definitions(forms, entity_name=""):
    definitions = []
    for form in forms or []:
        if str(form.get("type") or "") not in {"2", ""}:
            continue
        form_xml = form.get("formxml") or ""
        if not form_xml:
            continue
        try:
            root = ET.fromstring(form_xml)
        except ET.ParseError:
            continue
        for control in root.findall(".//control"):
            definition = parse_timeline_control(
                control,
                form_id=(
                    form.get("formid")
                    or form.get("formidunique")
                    or ""
                ),
                form_name=form.get("name") or "",
                entity_name=entity_name,
            )
            if definition:
                definitions.append(definition)
    return definitions


def timeline_dependency_names(timeline_definitions):
    dependencies = []

    def include(*names):
        for name in names:
            normalized = str(name or "").strip().lower()
            if normalized and normalized not in dependencies:
                dependencies.append(normalized)

    for definition in timeline_definitions or []:
        modules = set(definition.get("modules", []))
        if "Activities" in modules:
            include(*ACTIVITY_SUPPORT_TABLES)
            include(*definition.get("activities", []))
        if "Notes" in modules:
            include(*NOTE_SUPPORT_TABLES)
        if "Posts" in modules:
            include(*POST_SUPPORT_TABLES)
    return dependencies


def _card_field(cell):
    control = cell.find("./control")
    if control is None:
        return None
    field_name = control.get("datafieldname")
    if not field_name:
        return None
    return {
        "attribute": field_name,
        "label": _label(
            cell,
            field_name.replace("_", " ").title(),
        ),
        "show_label": str(
            cell.get("showlabel", "true")
        ).lower() != "false",
    }


def parse_card_form(form):
    form_xml = form.get("formxml") or ""
    if str(form.get("type") or "") != "11" or not form_xml:
        return None
    try:
        root = ET.fromstring(form_xml)
    except ET.ParseError:
        return None
    result = {
        "form_id": _normalize_id(
            form.get("formid")
            or form.get("formidunique")
        ),
        "name": form.get("name") or "Card",
        "header": [],
        "details": [],
    }
    for section in root.findall(".//section"):
        section_name = str(
            section.get("name")
            or _label(section)
            or ""
        ).lower()
        fields = [
            field
            for field in (
                _card_field(cell)
                for cell in section.findall("./rows/row/cell")
            )
            if field
        ]
        if "header" in section_name:
            result["header"].extend(fields)
        elif "detail" in section_name or "body" in section_name:
            result["details"].extend(fields)
    if not result["header"] and not result["details"]:
        fields = [
            field
            for field in (
                _card_field(cell)
                for cell in root.findall(".//cell")
            )
            if field
        ]
        result["header"] = fields[:2]
        result["details"] = fields[2:5]
    result["header"] = result["header"][:2]
    result["details"] = result["details"][:3]
    return result


def extract_card_forms(forms):
    return [
        definition
        for definition in (
            parse_card_form(form)
            for form in forms or []
        )
        if definition
    ]
