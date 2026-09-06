using System.Globalization;
using System.Text;
using System.Xml.Linq;
using VerseOff.Domain;

namespace VerseOff.Metadata;

public static class FormXmlParser
{
    private static readonly Dictionary<string, FormControlKind>
        ClassIdKinds = new Dictionary<string, FormControlKind>(
            StringComparer.OrdinalIgnoreCase)
        {
            ["{4273edbd-ac1d-40d3-9fb2-095c621b552d}"] =
                    FormControlKind.Text,
            ["{e0dba600-d4c9-4b3c-b907-80e10892ad0e}"] =
                    FormControlKind.MultilineText,
            ["{3ef39988-22bb-4f0b-bbbe-64b5a3748f10}"] =
                    FormControlKind.Choice,
            ["{4aa28ab7-9c13-482f-ac51-bb4439c27f32}"] =
                    FormControlKind.MultiSelectChoice,
            ["{b0c6723a-8503-4fd7-bb28-c8a06ac933c2}"] =
                    FormControlKind.Boolean,
            ["{670a3c20-b85f-4228-a461-8ff8536f987f}"] =
                    FormControlKind.Boolean,
            ["{5b773807-9fb2-42db-97c3-7a91d7e8b4b8}"] =
                    FormControlKind.DateTime,
            ["{270bd3db-d9af-4782-9025-509e298b0578}"] =
                    FormControlKind.Lookup,
            ["{cb624414-7551-420a-9694-b2a6058097d7}"] =
                    FormControlKind.Customer,
            ["{533b9e00-756b-4312-95a0-dc888637ac78}"] =
                    FormControlKind.Number,
            ["{c6d124ca-7eda-4a60-aea9-7fb8d318b68f}"] =
                    FormControlKind.Number,
            ["{c3efe0c3-0ec6-42be-8349-cbd9079e8bc6}"] =
                    FormControlKind.Number,
            ["{533b9e00-756b-4312-95a0-dc888637ac79}"] =
                    FormControlKind.Currency,
            ["{9fdf5f91-88b1-47f4-ad53-c11efc01a01d}"] =
                    FormControlKind.WebResource,
            ["{fd2a7985-3187-444e-908d-6624b21f69c0}"] =
                    FormControlKind.Iframe,
            ["{e7579c73-8549-467d-8713-2498322704f4}"] =
                    FormControlKind.Subgrid,
            ["{f9a8a302-114e-466a-b582-6771b2ae0d92}"] =
                    FormControlKind.QuickView,
            ["{06375649-c143-495e-a496-c962e5b4488e}"] =
                    FormControlKind.Timeline,
            ["{8c54228c-1b49-4130-97fb-37e197709334}"] =
                    FormControlKind.Timeline,
            ["{06397e06-6460-450f-901c-6636227c44e9}"] =
                    FormControlKind.Timeline,
            ["{f02ef9d0-a027-11e3-a5e2-0800200c9a66}"] =
                    FormControlKind.CustomControl,
        };

    public static FormDefinition Parse(
        XDocument document,
        Guid formId,
        string name,
        string tableLogicalName,
        int formType,
        ComponentProvenance provenance,
        IReadOnlyList<ColumnDefinition> columns)
    {
        ArgumentNullException.ThrowIfNull(document);
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        ArgumentNullException.ThrowIfNull(provenance);
        ArgumentNullException.ThrowIfNull(columns);

        var root = document.Root
            ?? throw new InvalidDataException("FormXml has no root element.");
        if (!string.Equals(
                root.Name.LocalName,
                "form",
                StringComparison.OrdinalIgnoreCase))
        {
            root = root.DescendantsNamed("form").FirstOrDefault()
                ?? throw new InvalidDataException(
                    "The metadata does not contain a FormXml form element.");
        }

        var columnMap = columns.ToDictionary(
            column => column.LogicalName,
            StringComparer.OrdinalIgnoreCase);
        var customControls = ParseCustomControlBindings(root);
        var events = ParseEvents(root, provenance, targetName: null);
        var tabs = ParseTabs(root, columnMap, customControls, provenance);

        return new(
            formId,
            name,
            tableLogicalName,
            formType,
            events,
            provenance)
        {
            Tabs = tabs,
            HeaderControls = ParseContainerControls(
                root.ElementNamed("header"),
                columnMap,
                customControls,
                provenance),
            FooterControls = ParseContainerControls(
                root.ElementNamed("footer"),
                columnMap,
                customControls,
                provenance),
            HiddenControls = ParseHiddenControls(
                root,
                columnMap,
                customControls,
                provenance),
            Parameters = ParseFormParameters(root),
        };
    }

    private static List<FormTabDefinition> ParseTabs(
        XElement root,
        Dictionary<string, ColumnDefinition> columns,
        Dictionary<string, XElement> customControls,
        ComponentProvenance provenance)
    {
        var tabNodes = root.ElementNamed("tabs")?.ElementsNamed("tab")
            ?? root.ElementNamed("body")
                ?.ElementNamed("tabs")
                ?.ElementsNamed("tab")
            ?? [];
        var tabs = new List<FormTabDefinition>();
        var tabOrder = 0;

        foreach (var tab in tabNodes)
        {
            var formColumns = new List<FormColumnDefinition>();
            var columnNodes = tab.ElementNamed("columns")
                ?.ElementsNamed("column")
                .ToArray()
                ?? [];

            if (columnNodes.Length == 0)
            {
                var directSections = tab.ElementNamed("sections")
                    ?.ElementsNamed("section")
                    .ToArray()
                    ?? [];
                if (directSections.Length > 0)
                {
                    formColumns.Add(new(
                        100,
                        ParseSections(
                            directSections,
                            columns,
                            customControls,
                            provenance)));
                }
            }
            else
            {
                foreach (var column in columnNodes)
                {
                    var sectionNodes = column.ElementNamed("sections")
                        ?.ElementsNamed("section")
                        .ToArray()
                        ?? [];
                    formColumns.Add(new(
                        ParsePercentage(column.AttributeValue("width")),
                        ParseSections(
                            sectionNodes,
                            columns,
                            customControls,
                            provenance)));
                }
            }

            tabs.Add(new(
                tab.AttributeValue("name") ?? $"tab-{tabOrder}",
                Label(tab, tab.AttributeValue("name") ?? "Tab"),
                tab.BooleanAttribute("visible", defaultValue: true),
                tab.BooleanAttribute("expanded", defaultValue: true),
                tabOrder++,
                formColumns));
        }

        return tabs;
    }

    private static List<FormSectionDefinition> ParseSections(
        IEnumerable<XElement> sectionNodes,
        Dictionary<string, ColumnDefinition> columns,
        Dictionary<string, XElement> customControls,
        ComponentProvenance provenance)
    {
        var sections = new List<FormSectionDefinition>();
        var sectionOrder = 0;

        foreach (var section in sectionNodes)
        {
            var rows = new List<FormRowDefinition>();
            var rowOrder = 0;
            foreach (var row in section.ElementNamed("rows")
                ?.ElementsNamed("row")
                ?? [])
            {
                var cells = new List<FormCellDefinition>();
                foreach (var cell in row.ElementsNamed("cell"))
                {
                    var controlNode = cell.ElementNamed("control");
                    var control = controlNode is null
                        ? null
                        : ParseControl(
                            controlNode,
                            Label(cell, string.Empty),
                            columns,
                            customControls,
                            provenance);
                    cells.Add(new(
                        cell.AttributeValue("id")
                            ?? control?.Id
                            ?? $"cell-{rowOrder}-{cells.Count}",
                        Label(cell, control?.Label),
                        cell.BooleanAttribute("visible", defaultValue: true),
                        cell.BooleanAttribute("showlabel", defaultValue: true),
                        Math.Max(1, cell.IntegerAttribute("rowspan", 1)),
                        Math.Max(1, cell.IntegerAttribute("colspan", 1)),
                        control));
                }

                rows.Add(new(rowOrder++, cells));
            }

            sections.Add(new(
                section.AttributeValue("name") ?? $"section-{sectionOrder}",
                Label(section, section.AttributeValue("name") ?? "Section"),
                section.BooleanAttribute("visible", defaultValue: true),
                section.BooleanAttribute("showlabel", defaultValue: true),
                sectionOrder++,
                rows));
        }

        return sections;
    }

    private static FormControlDefinition[] ParseContainerControls(
        XElement? container,
        Dictionary<string, ColumnDefinition> columns,
        Dictionary<string, XElement> customControls,
        ComponentProvenance provenance)
    {
        if (container is null)
        {
            return [];
        }

        return container.DescendantsNamed("control")
            .Select(control => ParseControl(
                control,
                label: null,
                columns,
                customControls,
                provenance))
            .ToArray();
    }

    private static FormControlDefinition[] ParseHiddenControls(
        XElement root,
        Dictionary<string, ColumnDefinition> columns,
        Dictionary<string, XElement> customControls,
        ComponentProvenance provenance) =>
        root.DescendantsNamed("hiddencontrol")
            .Select(control => ParseControl(
                control,
                label: null,
                columns,
                customControls,
                provenance))
            .ToArray();

    private static FormControlDefinition ParseControl(
        XElement control,
        string? label,
        Dictionary<string, ColumnDefinition> columns,
        Dictionary<string, XElement> customControls,
        ComponentProvenance provenance)
    {
        var id = control.AttributeValue("id")
            ?? control.AttributeValue("datafieldname")
            ?? throw new InvalidDataException(
                "Every FormXml control requires an ID or data-field name.");
        var dataFieldName = control.AttributeValue("datafieldname");
        var classId = control.AttributeValue("classid");
        var customControl = FindCustomControl(
            control,
            id,
            dataFieldName,
            customControls);
        var parameters = control.ElementNamed("parameters")
            ?.Elements()
            .GroupBy(
                child => child.Name.LocalName,
                StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => (string?)group.Last().Value.Trim(),
                StringComparer.OrdinalIgnoreCase)
            ?? new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

        parameters.TryGetValue("ViewId", out var viewId);
        parameters.TryGetValue("RelationshipName", out var relationshipName);
        parameters.TryGetValue("Url", out var webResourceName);
        webResourceName ??= control.AttributeValue("name");

        var kind = ResolveControlKind(
            control,
            classId,
            dataFieldName,
            columns,
            customControl);
        if (TimelineXmlParser.IsTimeline(
                control,
                customControl,
                parameters))
        {
            kind = FormControlKind.Timeline;
        }

        return new(
            id,
            dataFieldName,
            kind,
            classId,
            control.BooleanAttribute("visible", defaultValue: true),
            control.BooleanAttribute("disabled", defaultValue: false))
        {
            RawControlXml = control.ToString(
                SaveOptions.DisableFormatting),
            Label = string.IsNullOrWhiteSpace(label)
                ? dataFieldName ?? id
                : label,
            ViewId = viewId,
            RelationshipName = relationshipName,
            WebResourceName = webResourceName,
            CodeComponentName = customControl?.AttributeValue("name"),
            Timeline = kind is FormControlKind.Timeline
                ? TimelineXmlParser.Parse(
                    control,
                    customControl,
                    parameters)
                : null,
            Parameters = parameters,
            Events = ParseEvents(control, provenance, id),
        };
    }

    private static FormControlKind ResolveControlKind(
        XElement control,
        string? classId,
        string? dataFieldName,
        Dictionary<string, ColumnDefinition> columns,
        XElement? customControl)
    {
        if (customControl is not null)
        {
            return FormControlKind.CustomControl;
        }

        if (classId is not null
            && ClassIdKinds.TryGetValue(classId, out var kind))
        {
            return kind;
        }

        if (control.BooleanAttribute(
                "indicationOfSubgrid",
                defaultValue: false))
        {
            return FormControlKind.Subgrid;
        }

        if (dataFieldName is null
            || !columns.TryGetValue(dataFieldName, out var column))
        {
            return FormControlKind.Unknown;
        }

        return column.AttributeType.ToUpperInvariant() switch
        {
            "MEMO" => FormControlKind.MultilineText,
            "PICKLIST" => FormControlKind.Choice,
            "MULTISELECTPICKLIST" => FormControlKind.MultiSelectChoice,
            "BOOLEAN" => FormControlKind.Boolean,
            "DATETIME" => FormControlKind.DateTime,
            "LOOKUP" => FormControlKind.Lookup,
            "CUSTOMER" => FormControlKind.Customer,
            "OWNER" => FormControlKind.Owner,
            "INTEGER" or "BIGINT" or "DECIMAL" or "DOUBLE" =>
                FormControlKind.Number,
            "MONEY" => FormControlKind.Currency,
            _ => FormControlKind.Text,
        };
    }

    private static Dictionary<string, XElement>
        ParseCustomControlBindings(XElement root)
    {
        var result = new Dictionary<string, XElement>(
            StringComparer.OrdinalIgnoreCase);
        foreach (var description in root
            .DescendantsNamed("controlDescription"))
        {
            var target = description.AttributeValue("forControl");
            if (string.IsNullOrWhiteSpace(target))
            {
                continue;
            }

            var candidates = description.ElementsNamed("customControl")
                .ToArray();
            var selected = candidates.FirstOrDefault(candidate =>
                    candidate.AttributeValue("formFactor") is null or "0" or "1")
                ?? candidates.FirstOrDefault();
            if (selected is not null)
            {
                result[target] = selected;
            }
        }

        return result;
    }

    private static XElement? FindCustomControl(
        XElement control,
        string id,
        string? dataFieldName,
        Dictionary<string, XElement> customControls)
    {
        var inline = control.DescendantsNamed("customControl").FirstOrDefault();
        if (inline is not null)
        {
            return inline;
        }

        if (customControls.TryGetValue(id, out var byId))
        {
            return byId;
        }

        return dataFieldName is not null
            && customControls.TryGetValue(dataFieldName, out var byField)
                ? byField
                : null;
    }

    private static List<FormEventDefinition> ParseEvents(
        XElement scope,
        ComponentProvenance provenance,
        string? targetName)
    {
        var eventsNode = scope.ElementNamed("events");
        if (eventsNode is null)
        {
            return [];
        }

        var result = new List<FormEventDefinition>();
        foreach (var eventNode in eventsNode.ElementsNamed("event"))
        {
            var eventName = eventNode.AttributeValue("name");
            if (string.IsNullOrWhiteSpace(eventName))
            {
                continue;
            }

            var eventTarget = eventNode.AttributeValue("attribute")
                ?? targetName;
            var order = 0;
            foreach (var handler in eventNode
                .ElementNamed("Handlers")
                ?.ElementsNamed("Handler")
                ?? [])
            {
                var functionName = handler.AttributeValue("functionName");
                if (string.IsNullOrWhiteSpace(functionName))
                {
                    continue;
                }

                var handlerId = handler.AttributeValue("handlerUniqueId")
                    ?? handler.AttributeValue("id")
                    ?? $"{eventName}:{functionName}:{order}";
                result.Add(new(
                    eventName,
                    handlerId,
                    functionName,
                    NormalizeWebResourceName(
                        handler.AttributeValue("libraryName")),
                    handler.BooleanAttribute(
                        "passExecutionContext",
                        defaultValue: false),
                    order++,
                    provenance)
                {
                    TargetName = eventTarget,
                    Parameters = ParseHandlerParameters(
                        handler.AttributeValue("parameters")),
                    IsEnabled = eventNode.BooleanAttribute(
                        "active",
                        defaultValue: true)
                        && handler.BooleanAttribute(
                            "enabled",
                            defaultValue: true),
                });
            }
        }

        return result;
    }

    private static List<HandlerParameterDefinition>
        ParseHandlerParameters(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return [];
        }

        var values = new List<HandlerParameterDefinition>();
        var token = new StringBuilder();
        var quoted = false;

        for (var index = 0; index < value.Length; index++)
        {
            var character = value[index];
            if (character == '"')
            {
                if (quoted
                    && index + 1 < value.Length
                    && value[index + 1] == '"')
                {
                    token.Append('"');
                    index++;
                }
                else
                {
                    quoted = !quoted;
                }

                continue;
            }

            if (character == ',' && !quoted)
            {
                AddParameter(values, token);
                continue;
            }

            token.Append(character);
        }

        AddParameter(values, token);
        return values;
    }

    private static void AddParameter(
        List<HandlerParameterDefinition> values,
        StringBuilder token)
    {
        var value = token.ToString().Trim();
        token.Clear();
        if (value.Length > 0)
        {
            values.Add(new(value, HandlerParameterKind.Literal));
        }
    }

    private static FormParameterDefinition[] ParseFormParameters(
        XElement root) =>
        root.DescendantsNamed("querystringparameter")
            .Select(parameter => new FormParameterDefinition(
                parameter.AttributeValue("name") ?? string.Empty,
                parameter.AttributeValue("type") ?? "SafeString",
                parameter.AttributeValue("defaultvalue")))
            .Where(parameter => !string.IsNullOrWhiteSpace(parameter.Name))
            .ToArray();

    private static string Label(XElement node, string? fallback) =>
        node.ElementNamed("labels")
            ?.DescendantsNamed("label")
            .Select(label => label.AttributeValue("description"))
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value))
        ?? fallback
        ?? string.Empty;

    private static int ParsePercentage(string? value)
    {
        var normalized = value?.Trim().TrimEnd('%');
        return int.TryParse(
            normalized,
            NumberStyles.Integer,
            CultureInfo.InvariantCulture,
            out var width)
            ? Math.Clamp(width, 1, 100)
            : 100;
    }

    private static string? NormalizeWebResourceName(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        const string prefix = "$webresource:";
        var trimmed = value.Trim();
        return trimmed.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)
            ? trimmed[prefix.Length..]
            : trimmed.TrimStart('/');
    }
}
