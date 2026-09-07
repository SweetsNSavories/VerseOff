using VerseOff.Domain;
using VerseOff.Customization.Metadata;
using System.Text.Json;
using System.Diagnostics.CodeAnalysis;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace VerseOff.Customization.Services;

/// <summary>
/// Extracts baseline metadata from an ApplicationDefinition.
/// Used to populate the metadata catalog for customization.
/// </summary>
public class MetadataExtractor
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    /// <summary>
    /// Extract complete entity metadata from an application definition
    /// </summary>
    public static Dictionary<string, EntityMetadata> ExtractEntityMetadata(ApplicationDefinition app)
    {
        var entities = new Dictionary<string, EntityMetadata>();

        foreach (var table in app.Tables ?? Enumerable.Empty<object>())
        {
            var fields = new List<FieldMetadata>();

            // Extract fields from table
            if (table is { })
            {
                var tableType = table.GetType();
                var fieldsProperty = tableType.GetProperty("Fields");
                var logicalNameProperty = tableType.GetProperty("LogicalName");
                var displayNameProperty = tableType.GetProperty("DisplayName");

                if (logicalNameProperty?.GetValue(table) is string logicalName)
                {
                    var tableFields = fieldsProperty?.GetValue(table) as System.Collections.IEnumerable;
                    if (tableFields != null)
                    {
                        foreach (var field in tableFields)
                        {
                            var logicalNameValue = GetPropertyValueAsString(field, "LogicalName") ?? "unknown";
                            var displayNameValue = GetPropertyValueAsString(field, "DisplayName") ?? "Unknown";
                            var attributeTypeValue = GetPropertyValueAsString(field, "AttributeType") ?? "String";

                            var fieldMeta = new FieldMetadata(
                                LogicalName: logicalNameValue,
                                DisplayName: displayNameValue,
                                AttributeType: attributeTypeValue,
                                Format: GetPropertyValueAsString(field, "Format"),
                                MaxLength: GetPropertyValue(field, "MaxLength") is int len ? len : -1,
                                Required: GetPropertyValue(field, "Required") is bool req ? req : false,
                                IsCustom: GetPropertyValue(field, "IsCustom") is bool custom ? custom : false
                            );

                            fields.Add(fieldMeta);
                        }
                    }

                    var entityMeta = new EntityMetadata(
                        LogicalName: logicalName,
                        DisplayName: displayNameProperty?.GetValue(table) as string ?? logicalName,
                        PluralName: logicalName + "s",
                        Fields: fields,
                        AvailableEventHandlers: new List<string>(EventHookNames.AllHooks),
                        AssociatedForms: new List<string>(),
                        AssociatedViews: new List<string>()
                    );

                    entities[logicalName] = entityMeta;
                }
            }
        }

        return entities;
    }

    /// <summary>
    /// Helper to get property value from dynamic object as string
    /// </summary>
    private static string? GetPropertyValueAsString(object? obj, string propertyName)
    {
        return GetPropertyValue(obj, propertyName)?.ToString();
    }

    /// <summary>
    /// Helper to get property value from dynamic object
    /// </summary>
    private static object? GetPropertyValue(object? obj, string propertyName)
    {
        try
        {
            var property = obj?.GetType().GetProperty(propertyName);
            return property?.GetValue(obj);
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Generate metadata schema as JSON
    /// </summary>
    public static string ExportMetadataAsJson(Dictionary<string, EntityMetadata> metadata)
    {
        return JsonSerializer.Serialize(
            metadata,
            JsonOptions
        );
    }

    /// <summary>
    /// Load metadata from JSON schema
    /// </summary>
    public static Dictionary<string, EntityMetadata> ImportMetadataFromJson(string json)
    {
        return JsonSerializer.Deserialize<Dictionary<string, EntityMetadata>>(json, JsonOptions)
            ?? new Dictionary<string, EntityMetadata>();
    }

    /// <summary>
    /// Generate metadata schema as YAML
    /// </summary>
    public static string ExportMetadataAsYaml(Dictionary<string, EntityMetadata> metadata)
    {
        var serializer = new SerializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .DisableAliases()
            .Build();
        return serializer.Serialize(metadata);
    }

    /// <summary>
    /// Load metadata from YAML schema
    /// </summary>
    public static Dictionary<string, EntityMetadata> ImportMetadataFromYaml(string yaml)
    {
        var deserializer = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .Build();
        return deserializer.Deserialize<Dictionary<string, EntityMetadata>>(yaml)
            ?? new Dictionary<string, EntityMetadata>();
    }
}
