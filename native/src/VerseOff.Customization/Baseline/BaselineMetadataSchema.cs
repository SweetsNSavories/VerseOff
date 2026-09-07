#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names

using System.Text.Json.Serialization;

namespace VerseOff.Customization.Baseline;

/// <summary>
/// Serializable schema for baseline Dataverse metadata.
/// Designed to be embedded in app.json or stored separately for efficient loading.
/// Maps entities, fields, forms, views, and event handlers.
/// </summary>
public record BaselineMetadataSchema(
    [property: JsonPropertyName("version")] string Version,
    [property: JsonPropertyName("entities")] List<BaselineEntitySchema> Entities
)
{
    /// <summary>
    /// Current schema version for compatibility checking.
    /// </summary>
    public const string CurrentVersion = "1.0";
}

/// <summary>
/// Serializable entity metadata schema.
/// </summary>
public record BaselineEntitySchema(
    [property: JsonPropertyName("logicalName")] string LogicalName,
    [property: JsonPropertyName("displayName")] string DisplayName,
    [property: JsonPropertyName("pluralName")] string PluralName,
    [property: JsonPropertyName("fields")] List<BaselineFieldSchema> Fields,
    [property: JsonPropertyName("availableEventHandlers")] List<string> AvailableEventHandlers,
    [property: JsonPropertyName("associatedForms")] List<string> AssociatedForms,
    [property: JsonPropertyName("associatedViews")] List<string> AssociatedViews,
    [property: JsonPropertyName("extendedMetadata")] Dictionary<string, string>? ExtendedMetadata = null
);

/// <summary>
/// Serializable field metadata schema.
/// </summary>
public record BaselineFieldSchema(
    [property: JsonPropertyName("logicalName")] string LogicalName,
    [property: JsonPropertyName("displayName")] string DisplayName,
    [property: JsonPropertyName("attributeType")] string AttributeType,
    [property: JsonPropertyName("format")] string? Format = null,
    [property: JsonPropertyName("maxLength")] int MaxLength = -1,
    [property: JsonPropertyName("required")] bool Required = false,
    [property: JsonPropertyName("isCustom")] bool IsCustom = false,
    [property: JsonPropertyName("extendedProperties")] Dictionary<string, object>? ExtendedProperties = null
);
