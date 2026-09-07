using YamlDotNet.Serialization;

namespace VerseOff.Customization.Customizations;

/// <summary>
/// Represents a modification to an entity field (add, remove, or modify).
/// </summary>
public record FieldModification(
    string EntityLogicalName,
    string FieldLogicalName,
    FieldModificationType ModificationType,
    Metadata.FieldMetadata? NewFieldDefinition = null,
    Dictionary<string, object>? PropertyChanges = null
)
{
    [YamlIgnore]
    public string Id { get; } = $"{EntityLogicalName}.{FieldLogicalName}.{ModificationType}";

    public FieldModification() : this("", "", FieldModificationType.Add) { }
}

/// <summary>
/// Type of field modification
/// </summary>
public enum FieldModificationType
{
    Add,
    Remove,
    Modify
}

/// <summary>
/// Represents an event handler registration (new or override).
/// </summary>
public record EventHandlerRegistration(
    string EntityLogicalName,
    string EventHook,
    string HandlerName,
    string? HandlerCode = null,
    int ExecutionOrder = 100,
    EventHandlerType HandlerType = EventHandlerType.JavaScript,
    EventExecutionPhase ExecutionPhase = EventExecutionPhase.PostOperation,
    bool IsActive = true,
    Dictionary<string, object>? Parameters = null,
    bool SuppressInvalidPluginStepRegistration = false
)
{
    [YamlIgnore]
    public string Id { get; } = $"{EntityLogicalName}.{EventHook}.{HandlerName}";

    public EventHandlerRegistration() : this("", "", "") { }
}

/// <summary>
/// Type of event handler
/// </summary>
public enum EventHandlerType
{
    JavaScript,
    Plugin,
    Workflow
}

/// <summary>
/// Execution phase for plugins and handlers
/// </summary>
public enum EventExecutionPhase
{
    PreValidation = 10,
    PreOperation = 20,
    PostOperation = 40
}

/// <summary>
/// Represents a customization to a form (add/remove sections, reorder, etc.).
/// </summary>
public record FormCustomization(
    string FormId,
    string EntityLogicalName,
    List<FormSectionChange>? SectionChanges = null,
    List<FormTabChange>? TabChanges = null,
    Dictionary<string, object>? Metadata = null
)
{
    public FormCustomization() : this(
        string.Empty,
        string.Empty,
        new List<FormSectionChange>(),
        new List<FormTabChange>(),
        new Dictionary<string, object>()
    ) { }
}

/// <summary>
/// Change to a form section (add, remove, reorder)
/// </summary>
public record FormSectionChange(
    string SectionName,
    FormSectionChangeType ChangeType,
    int Order = -1,
    List<string>? FieldsToAdd = null,
    List<string>? FieldsToRemove = null
)
{
    public FormSectionChange() : this("", FormSectionChangeType.Add) { }
}

public enum FormSectionChangeType
{
    Add,
    Remove,
    Modify,
    Reorder
}

/// <summary>
/// Change to a form tab
/// </summary>
public record FormTabChange(
    string TabName,
    FormTabChangeType ChangeType,
    int Order = -1,
    List<string>? SectionsToAdd = null,
    List<string>? SectionsToRemove = null
)
{
    public FormTabChange() : this("", FormTabChangeType.Add) { }
}

public enum FormTabChangeType
{
    Add,
    Remove,
    Modify
}

/// <summary>
/// Complete customization layer - describes all modifications to an application.
/// </summary>
public record CustomizationLayer(
    string Version = "1.0.0",
    List<FieldModification>? FieldModifications = null,
    List<EventHandlerRegistration>? EventHandlers = null,
    List<FormCustomization>? FormCustomizations = null,
    Dictionary<string, object>? Configuration = null,
    DateTime CreatedAt = default,
    string CreatedBy = "system"
)
{
    public CustomizationLayer() : this(
        "1.0.0",
        new List<FieldModification>(),
        new List<EventHandlerRegistration>(),
        new List<FormCustomization>(),
        new Dictionary<string, object>(),
        DateTime.UtcNow,
        "system"
    ) { }

    /// <summary>
    /// Get all field modifications for an entity
    /// </summary>
    public IEnumerable<FieldModification> GetFieldModificationsForEntity(string entityLogicalName) =>
        FieldModifications?.Where(f => f.EntityLogicalName == entityLogicalName) ?? Enumerable.Empty<FieldModification>();

    /// <summary>
    /// Get all event handlers for an entity
    /// </summary>
    public IEnumerable<EventHandlerRegistration> GetEventHandlersForEntity(string entityLogicalName) =>
        EventHandlers?.Where(e => e.EntityLogicalName == entityLogicalName) ?? Enumerable.Empty<EventHandlerRegistration>();

    /// <summary>
    /// Get event handlers for a specific event hook
    /// </summary>
    public IEnumerable<EventHandlerRegistration> GetEventHandlers(string entityLogicalName, string eventHook) =>
        GetEventHandlersForEntity(entityLogicalName)
            .Where(e => e.EventHook == eventHook)
            .OrderBy(e => e.ExecutionOrder);

    /// <summary>
    /// Check if layer has any customizations
    /// </summary>
    [YamlIgnore]
    public bool HasCustomizations =>
        (FieldModifications?.Count > 0) ||
        (EventHandlers?.Count > 0) ||
        (FormCustomizations?.Count > 0) ||
        (Configuration?.Count > 0);
}
