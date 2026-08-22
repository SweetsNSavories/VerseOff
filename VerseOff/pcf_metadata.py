import xml.etree.ElementTree as ET


SUPPORTED_PROPERTY_TYPES = {
    "Currency",
    "DateAndTime.DateAndTime",
    "DateAndTime.DateOnly",
    "Decimal",
    "Enum",
    "FP",
    "Lookup.Simple",
    "Multiple",
    "MultiSelectOptionSet",
    "Object",
    "OptionSet",
    "SingleLine.Email",
    "SingleLine.Phone",
    "SingleLine.Text",
    "SingleLine.TextArea",
    "SingleLine.Ticker",
    "SingleLine.URL",
    "TwoOptions",
    "Whole.None",
}

VERSEOFF_PCF_FEATURES = {
    "Device.pickFile",
    "Utility",
    "WebAPI",
}


def _local_name(tag):
    return str(tag or "").rsplit("}", 1)[-1]


def _xml_bool(value, default=False):
    if value is None:
        return default
    return str(value).strip().casefold() in {"true", "1", "yes"}


def _child_elements(node, name):
    wanted = name.casefold()
    return [
        child
        for child in list(node)
        if _local_name(child.tag).casefold() == wanted
    ]


def custom_control_names_from_form(form_xml):
    if not form_xml:
        return []
    try:
        root = ET.fromstring(form_xml)
    except ET.ParseError:
        return []
    names = []
    for node in root.iter():
        if _local_name(node.tag).casefold() != "customcontrol":
            continue
        name = str(node.get("name") or "").strip()
        if name and name not in names:
            names.append(name)
    return names


def parse_pcf_manifest(manifest_xml):
    if not manifest_xml:
        raise ValueError("PCF manifest XML is required.")
    root = ET.fromstring(manifest_xml)
    control = next(
        (
            node
            for node in root.iter()
            if _local_name(node.tag).casefold() == "control"
        ),
        None,
    )
    if control is None:
        raise ValueError("PCF manifest has no control element.")

    namespace = str(control.get("namespace") or "").strip()
    constructor = str(control.get("constructor") or "").strip()
    if not namespace or not constructor:
        raise ValueError(
            "PCF manifest control requires namespace and constructor."
        )

    type_groups = {}
    for group in [
        node
        for node in control.iter()
        if _local_name(node.tag).casefold() == "type-group"
    ]:
        group_name = str(group.get("name") or "").strip()
        if not group_name:
            continue
        type_groups[group_name] = [
            str(type_node.text or "").strip()
            for type_node in group.iter()
            if (
                _local_name(type_node.tag).casefold() == "type"
                and str(type_node.text or "").strip()
            )
        ]

    properties = []
    for node in control.iter():
        if _local_name(node.tag).casefold() != "property":
            continue
        property_type = str(node.get("of-type") or "").strip()
        group_name = str(node.get("of-type-group") or "").strip()
        property_types = (
            [property_type]
            if property_type
            else list(type_groups.get(group_name, []))
        )
        unknown_types = [
            value
            for value in property_types
            if value not in SUPPORTED_PROPERTY_TYPES
        ]
        properties.append({
            "name": str(node.get("name") or "").strip(),
            "usage": str(node.get("usage") or "").strip(),
            "required": _xml_bool(node.get("required")),
            "default_value": node.get("default-value"),
            "of_type": property_type,
            "of_type_group": group_name,
            "accepted_types": property_types,
            "unsupported_types": unknown_types,
            "display_name_key": node.get("display-name-key") or "",
            "description_key": node.get("description-key") or "",
        })

    datasets = []
    for node in control.iter():
        if _local_name(node.tag).casefold() != "data-set":
            continue
        options = {}
        raw_options = str(node.get("cds-data-set-options") or "")
        for item in raw_options.split(";"):
            key, separator, value = item.partition(":")
            if separator and key:
                options[key] = _xml_bool(value)
        datasets.append({
            "name": str(node.get("name") or "").strip(),
            "display_name_key": node.get("display-name-key") or "",
            "description_key": node.get("description-key") or "",
            "options": options,
        })

    resources = []
    resource_parent = next(
        (
            node
            for node in control.iter()
            if _local_name(node.tag).casefold() == "resources"
        ),
        None,
    )
    if resource_parent is not None:
        for node in list(resource_parent):
            resource_type = _local_name(node.tag)
            if resource_type.casefold() not in {
                "code",
                "css",
                "img",
                "resx",
                "platform-library",
                "dependency",
            }:
                continue
            try:
                order = (
                    int(node.get("order"))
                    if node.get("order") is not None
                    else None
                )
            except ValueError as error:
                raise ValueError(
                    f"PCF resource order is invalid: {node.get('order')!r}"
                ) from error
            resources.append({
                "type": resource_type,
                "path": str(node.get("path") or "").strip(),
                "order": order,
                "name": str(node.get("name") or "").strip(),
                "version": str(node.get("version") or "").strip(),
            })

    features = []
    for node in control.iter():
        if _local_name(node.tag).casefold() != "uses-feature":
            continue
        name = str(node.get("name") or "").strip()
        required = _xml_bool(node.get("required"))
        features.append({
            "name": name,
            "required": required,
            "supported": (
                name in VERSEOFF_PCF_FEATURES
            ),
        })

    events = []
    for node in control.iter():
        if _local_name(node.tag).casefold() != "event":
            continue
        event_name = str(node.get("name") or "").strip()
        if event_name:
            events.append({
                "name": event_name,
                "display_name_key": (
                    node.get("display-name-key") or ""
                ),
                "description_key": (
                    node.get("description-key") or ""
                ),
            })

    platform_libraries = [
        resource
        for resource in resources
        if resource["type"].casefold() == "platform-library"
    ]
    control_type = str(
        control.get("control-type") or "standard"
    ).strip().casefold()
    required_unsupported_features = [
        feature["name"]
        for feature in features
        if feature["required"] and not feature["supported"]
    ]
    unsupported_property_types = sorted({
        property_type
        for property_definition in properties
        for property_type in property_definition["unsupported_types"]
    })
    return {
        "name": f"{namespace}.{constructor}",
        "namespace": namespace,
        "constructor": constructor,
        "version": str(control.get("version") or ""),
        "control_type": control_type,
        "display_name_key": control.get("display-name-key") or "",
        "description_key": control.get("description-key") or "",
        "preview_image": control.get("preview-image") or "",
        "properties": properties,
        "datasets": datasets,
        "resources": resources,
        "features": features,
        "events": events,
        "platform_libraries": platform_libraries,
        "is_dataset": bool(datasets),
        "is_virtual": (
            control_type == "virtual"
            or bool(platform_libraries)
        ),
        "unsupported_required_features": required_unsupported_features,
        "unsupported_property_types": unsupported_property_types,
        "can_host": (
            control_type == "standard"
            and not platform_libraries
            and not required_unsupported_features
            and not unsupported_property_types
        ),
    }


def bind_pcf_resources(definition, resource_rows):
    """Match manifest resource paths to customcontrolresource rows."""
    by_path = {}
    for resource in resource_rows or []:
        for key in (
            resource.get("path"),
            resource.get("name"),
            resource.get("web_resource_name"),
        ):
            normalized = str(key or "").replace("\\", "/").casefold()
            if normalized:
                by_path[normalized] = resource
                by_path[normalized.rsplit("/", 1)[-1]] = resource

    bound = []
    missing = []
    for manifest_resource in definition.get("resources", []):
        if manifest_resource.get("type", "").casefold() in {
            "platform-library",
            "dependency",
        }:
            bound.append(dict(manifest_resource))
            continue
        path = str(manifest_resource.get("path") or "").replace("\\", "/")
        resource = (
            by_path.get(path.casefold())
            or by_path.get(path.casefold().rsplit("/", 1)[-1])
        )
        item = dict(manifest_resource)
        if (
            resource
            and resource.get("web_resource_id")
            and resource.get("web_resource_name")
        ):
            item["web_resource_id"] = resource.get("web_resource_id")
            item["web_resource_name"] = resource.get(
                "web_resource_name"
            )
            item["custom_control_resource_id"] = resource.get("id")
        else:
            missing.append(path)
        bound.append(item)
    result = dict(definition)
    result["resources"] = bound
    result["missing_resources"] = missing
    result["can_host"] = bool(result.get("can_host")) and not missing
    return result
