namespace VerseOff.Customization.Metadata;

/// <summary>
/// Represents metadata for a single entity (table) in the offline app.
/// This is the baseline schema extracted from Dataverse.
/// </summary>
public record EntityMetadata(
    string LogicalName,
    string DisplayName,
    string PluralName,
    List<FieldMetadata> Fields,
    List<string> AvailableEventHandlers,
    List<string> AssociatedForms,
    List<string> AssociatedViews,
    Dictionary<string, string>? ExtendedMetadata = null
)
{
    public EntityMetadata() : this(
        string.Empty,
        string.Empty,
        string.Empty,
        new List<FieldMetadata>(),
        new List<string>(),
        new List<string>(),
        new List<string>(),
        new Dictionary<string, string>()
    ) { }

    /// <summary>
    /// Get a field by logical name
    /// </summary>
    public FieldMetadata? GetField(string logicalName) =>
        Fields.FirstOrDefault(f => f.LogicalName == logicalName);

    /// <summary>
    /// Check if entity has a particular event hook available
    /// </summary>
    public bool SupportsEventHandler(string eventName) =>
        AvailableEventHandlers.Contains(eventName, StringComparer.OrdinalIgnoreCase);
}

/// <summary>
/// Represents metadata for a single field (attribute) in an entity.
/// </summary>
public record FieldMetadata(
    string LogicalName,
    string DisplayName,
    string AttributeType,
    string? Format = null,
    int MaxLength = -1,
    bool Required = false,
    bool IsCustom = false,
    Dictionary<string, object>? ExtendedProperties = null
)
{
    public FieldMetadata() : this(
        string.Empty,
        string.Empty,
        "String"
    ) { }

    /// <summary>
    /// Deep clone for customization
    /// </summary>
    public FieldMetadata DeepClone() =>
        new(
            LogicalName,
            DisplayName,
            AttributeType,
            Format,
            MaxLength,
            Required,
            IsCustom,
            ExtendedProperties?.ToDictionary(x => x.Key, x => x.Value)
        );
}

/// <summary>
/// Available event hooks for Dataverse entities
/// </summary>
public static class EventHookNames
{
    public const string OnCreate = "onCreate";
    public const string OnUpdate = "onUpdate";
    public const string OnSave = "onSave";
    public const string OnDelete = "onDelete";
    public const string OnChange = "onChange";
    public const string OnLoad = "onLoad";
    public const string OnPreValidate = "onPreValidate";

    public static readonly string[] AllHooks = 
    {
        OnCreate, OnUpdate, OnSave, OnDelete, OnChange, OnLoad, OnPreValidate
    };
}
