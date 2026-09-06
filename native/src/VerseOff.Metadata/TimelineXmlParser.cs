using System.Globalization;
using System.Text.Json;
using System.Xml.Linq;
using VerseOff.Domain;

namespace VerseOff.Metadata;

internal static class TimelineXmlParser
{
    private static readonly HashSet<string> TimelineClassIds = new(
        [
            "{06375649-c143-495e-a496-c962e5b4488e}",
            "{8c54228c-1b49-4130-97fb-37e197709334}",
            "{06397e06-6460-450f-901c-6636227c44e9}",
        ],
        StringComparer.OrdinalIgnoreCase);

    public static bool IsTimeline(
        XElement control,
        XElement? customControl,
        IReadOnlyDictionary<string, string?> parameters)
    {
        var classId = control.AttributeValue("classid");
        var id = control.AttributeValue("id");
        var customName = customControl?.AttributeValue("name");
        parameters.TryGetValue("UClientUniqueName", out var uniqueName);

        return classId is not null && TimelineClassIds.Contains(classId)
            || string.Equals(
                id,
                "notescontrol",
                StringComparison.OrdinalIgnoreCase)
            || id?.Contains(
                "timeline",
                StringComparison.OrdinalIgnoreCase) is true
            || string.Equals(
                uniqueName,
                "Timeline",
                StringComparison.OrdinalIgnoreCase)
            || customName?.Contains(
                "Timeline",
                StringComparison.OrdinalIgnoreCase) is true
            || parameters.Keys.Any(key => key.StartsWith(
                "UClientActivit",
                StringComparison.OrdinalIgnoreCase));
    }

    public static TimelineDefinition Parse(
        XElement control,
        XElement? customControl,
        IReadOnlyDictionary<string, string?> parameters)
    {
        ArgumentNullException.ThrowIfNull(control);
        ArgumentNullException.ThrowIfNull(parameters);
        var controlId = control.AttributeValue("id")
            ?? throw new InvalidDataException(
                "A Timeline control requires an ID.");
        var activitiesJson = Value(
            parameters,
            "UClientActivitiesConfigurationJSON");
        var recordSourcesJson = Value(
            parameters,
            "UClientRecordSourcesJSON");
        var modules = Split(Value(parameters, "UClientModules"))
            .Select(ParseModule)
            .OfType<TimelineModule>()
            .ToHashSet();
        var enabledActivities = Split(
                Value(parameters, "UClientActivities"))
            .Select(value => value.ToLowerInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return new(
            controlId,
            control.AttributeValue("classid"),
            customControl?.AttributeValue("name"),
            control.ToString(SaveOptions.DisableFormatting),
            new Dictionary<string, string?>(
                parameters,
                StringComparer.OrdinalIgnoreCase),
            modules,
            enabledActivities,
            Math.Clamp(
                ParseInteger(
                    Value(parameters, "UClientRecordPerPage"),
                    10),
                1,
                50),
            ParseBoolean(
                Value(parameters, "UClientShowFilterPane"),
                defaultValue: true),
            ParseBoolean(
                Value(parameters, "UClientExpandFilterPane"),
                defaultValue: false),
            ParseBoolean(
                Value(parameters, "UClientShowSearch"),
                defaultValue: true),
            ParseBoolean(
                Value(parameters, "UClientExpandAll"),
                defaultValue: false),
            ParseSortDirection(parameters),
            Value(parameters, "UClientOrderBy")
                ?? Value(parameters, "OrderByActivityWall"),
            ParseRollupType(Value(parameters, "RollupType")))
        {
            DefaultCreateModule = Value(
                parameters,
                "UClientDefaultModuleForCreateExperience"),
            DefaultCreateMode = Value(
                parameters,
                "UClientCreateActivityUsing"),
            ActivityConfigurations = ParseActivityConfigurations(
                activitiesJson),
            CardForms = ParseCardMap(
                Value(parameters, "UClientActivityCardMap")),
            RecordSources = ParseRecordSources(recordSourcesJson),
            ActivitiesConfigurationJson = activitiesJson,
            RecordSourcesJson = recordSourcesJson,
        };
    }

    private static TimelineActivityConfiguration[]
        ParseActivityConfigurations(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }

        try
        {
            using var document = JsonDocument.Parse(json);
            if (document.RootElement.ValueKind
                is not JsonValueKind.Object)
            {
                throw new InvalidDataException(
                    "Timeline activity configuration must be a JSON object.");
            }

            return document.RootElement.EnumerateObject()
                .Select(activity =>
                {
                    var config = activity.Value;
                    return new TimelineActivityConfiguration(
                        activity.Name.ToLowerInvariant(),
                        IsEnabled: GetBoolean(
                            config,
                            "enabled",
                            defaultValue: true),
                        CanCreate: GetBoolean(
                            config,
                            "canCreate",
                            defaultValue: false),
                        CreateUsing: GetString(config, "createUsing")
                            ?? "default",
                        OpenUsing: GetString(config, "openUsing")
                            ?? "default",
                        ShowStatus: GetBoolean(
                            config,
                            "showStatus",
                            defaultValue: true))
                    {
                        ShowPersona = GetBoolean(
                            config,
                            "showPersona",
                            defaultValue: true),
                        ShowTopDate = GetBoolean(
                            config,
                            "showTopDate",
                            defaultValue: false),
                        SortColumn = GetString(config, "sortColumn"),
                        CardFormId = TryGuid(
                            GetString(config, "cardFormId")),
                    };
                })
                .ToArray();
        }
        catch (JsonException exception)
        {
            throw new InvalidDataException(
                "Timeline activity configuration JSON is malformed.",
                exception);
        }
    }

    private static TimelineCardFormBinding[] ParseCardMap(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return [];
        }

        var trimmed = value.TrimStart();
        if (trimmed.StartsWith('[')
            || trimmed.StartsWith('{'))
        {
            return ParseCardMapJson(value);
        }

        return value.Split(
                ';',
                StringSplitOptions.RemoveEmptyEntries
                    | StringSplitOptions.TrimEntries)
            .Select(entry => entry.Split(
                ',',
                StringSplitOptions.TrimEntries))
            .Where(parts => parts.Length > 0
                && !string.IsNullOrWhiteSpace(parts[0]))
            .Select(parts => new TimelineCardFormBinding(
                parts[0].ToLowerInvariant(),
                parts.Length > 1
                    && int.TryParse(
                        parts[1],
                        NumberStyles.Integer,
                        CultureInfo.InvariantCulture,
                        out var objectTypeCode)
                            ? objectTypeCode
                            : null,
                parts.Length > 2 ? TryGuid(parts[2]) : null))
            .ToArray();
    }

    private static TimelineCardFormBinding[] ParseCardMapJson(string json)
    {
        try
        {
            using var document = JsonDocument.Parse(json);
            var entries = document.RootElement.ValueKind switch
            {
                JsonValueKind.Array => document.RootElement
                    .EnumerateArray()
                    .Select(item => (
                        Name: GetString(item, "name")
                            ?? GetString(item, "logicalName"),
                        Value: item)),
                JsonValueKind.Object => document.RootElement
                    .EnumerateObject()
                    .Select(property => (
                        Name: (string?)property.Name,
                        Value: property.Value)),
                _ => throw new InvalidDataException(
                    "Timeline card map must be a JSON object or array."),
            };
            return entries
                .Where(entry => !string.IsNullOrWhiteSpace(entry.Name))
                .Select(entry => new TimelineCardFormBinding(
                    entry.Name!.ToLowerInvariant(),
                    GetInteger(entry.Value, "objectTypeCode"),
                    TryGuid(GetString(entry.Value, "cardFormId")
                        ?? GetString(entry.Value, "formId"))))
                .ToArray();
        }
        catch (JsonException exception)
        {
            throw new InvalidDataException(
                "Timeline activity card map JSON is malformed.",
                exception);
        }
    }

    private static TimelineRecordSourceDefinition[] ParseRecordSources(
        string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }

        try
        {
            using var document = JsonDocument.Parse(json);
            var elements = document.RootElement.ValueKind switch
            {
                JsonValueKind.Array => document.RootElement
                    .EnumerateArray()
                    .Select(item => (
                        Name: GetString(item, "name"),
                        Value: item)),
                JsonValueKind.Object => document.RootElement
                    .EnumerateObject()
                    .Select(property => (
                        Name: (string?)property.Name,
                        Value: property.Value)),
                _ => throw new InvalidDataException(
                    "Timeline record sources must be a JSON object or array."),
            };

            return elements.Select(entry =>
                {
                    var resource = GetString(
                            entry.Value,
                            "webResourceName")
                        ?? GetString(entry.Value, "webResource")
                        ?? GetString(entry.Value, "library");
                    return string.IsNullOrWhiteSpace(resource)
                        ? null
                        : new TimelineRecordSourceDefinition(
                            entry.Name ?? resource,
                            NormalizeWebResourceName(resource),
                            GetString(
                                entry.Value,
                                "constructorName")
                            ?? GetString(entry.Value, "constructor"));
                })
                .OfType<TimelineRecordSourceDefinition>()
                .ToArray();
        }
        catch (JsonException exception)
        {
            throw new InvalidDataException(
                "Timeline record-source JSON is malformed.",
                exception);
        }
    }

    private static string? Value(
        IReadOnlyDictionary<string, string?> parameters,
        string key) =>
        parameters.TryGetValue(key, out var value)
            ? value?.Trim()
            : null;

    private static string[] Split(string? value) =>
        string.IsNullOrWhiteSpace(value)
            ? []
            : value.Split(
                [',', ';'],
                StringSplitOptions.RemoveEmptyEntries
                    | StringSplitOptions.TrimEntries);

    private static TimelineModule? ParseModule(string value) =>
        value.ToUpperInvariant() switch
        {
            "ACTIVITIES" => TimelineModule.Activities,
            "NOTES" => TimelineModule.Notes,
            "POSTS" => TimelineModule.Posts,
            _ => null,
        };

    private static TimelineSortDirection ParseSortDirection(
        IReadOnlyDictionary<string, string?> parameters)
    {
        var value = Value(parameters, "UClientSortActivitiesByValue")
            ?? Value(parameters, "SortActivityWall");
        return value?.ToUpperInvariant() is "ASC" or "ASCENDING" or "0"
            ? TimelineSortDirection.OldestToNewest
            : TimelineSortDirection.NewestToOldest;
    }

    private static TimelineRollupType ParseRollupType(string? value) =>
        value?.ToUpperInvariant() switch
        {
            "RELATED" or "1" => TimelineRollupType.Related,
            "EXTENDED" or "2" => TimelineRollupType.Extended,
            _ => TimelineRollupType.None,
        };

    private static bool ParseBoolean(string? value, bool defaultValue) =>
        value?.ToUpperInvariant() switch
        {
            "TRUE" or "1" or "YES" => true,
            "FALSE" or "0" or "NO" => false,
            _ => defaultValue,
        };

    private static int ParseInteger(string? value, int defaultValue) =>
        int.TryParse(
            value,
            NumberStyles.Integer,
            CultureInfo.InvariantCulture,
            out var parsed)
                ? parsed
                : defaultValue;

    private static string? GetString(JsonElement element, string name) =>
        TryGetProperty(element, name, out var value)
            && value.ValueKind is JsonValueKind.String
                ? value.GetString()
                : null;

    private static bool GetBoolean(
        JsonElement element,
        string name,
        bool defaultValue) =>
        TryGetProperty(element, name, out var value)
            && value.ValueKind is JsonValueKind.True or JsonValueKind.False
                ? value.GetBoolean()
                : defaultValue;

    private static int? GetInteger(JsonElement element, string name) =>
        TryGetProperty(element, name, out var value)
            && value.TryGetInt32(out var result)
                ? result
                : null;

    private static bool TryGetProperty(
        JsonElement element,
        string name,
        out JsonElement value)
    {
        if (element.ValueKind is JsonValueKind.Object)
        {
            foreach (var property in element.EnumerateObject())
            {
                if (string.Equals(
                        property.Name,
                        name,
                        StringComparison.OrdinalIgnoreCase))
                {
                    value = property.Value;
                    return true;
                }
            }
        }

        value = default;
        return false;
    }

    private static Guid? TryGuid(string? value) =>
        Guid.TryParse(value?.Trim().Trim('{', '}'), out var result)
            ? result
            : null;

    private static string NormalizeWebResourceName(string value)
    {
        const string prefix = "$webresource:";
        var normalized = value.Trim();
        return normalized.StartsWith(
            prefix,
            StringComparison.OrdinalIgnoreCase)
                ? normalized[prefix.Length..]
                : normalized.TrimStart('/');
    }
}
