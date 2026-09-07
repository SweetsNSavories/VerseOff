using VerseOff.Customization.Metadata;
using System.Text.Json;

namespace VerseOff.Customization.Customizations;

/// <summary>
/// Fluent API for customizing an offline application.
/// Allows adding/removing fields, registering event handlers, and customizing forms.
/// </summary>
public class AppCustomizer
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    private readonly List<FieldModification> _fieldModifications = new();
    private readonly List<EventHandlerRegistration> _eventHandlers = new();
    private readonly List<FormCustomization> _formCustomizations = new();
    private readonly Dictionary<string, object> _configuration = new();
    private readonly Dictionary<string, EntityMetadata> _baselineMetadata;

    public AppCustomizer(Dictionary<string, EntityMetadata> baselineMetadata)
    {
        _baselineMetadata = baselineMetadata ?? throw new ArgumentNullException(nameof(baselineMetadata));
    }

    /// <summary>
    /// Add a new field to an entity
    /// </summary>
    public AppCustomizer AddField(string entityLogicalName, FieldMetadata fieldDefinition)
    {
        if (!_baselineMetadata.ContainsKey(entityLogicalName))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found in baseline metadata");

        var modification = new FieldModification(
            entityLogicalName,
            fieldDefinition.LogicalName,
            FieldModificationType.Add,
            fieldDefinition
        );

        _fieldModifications.Add(modification);
        return this;
    }

    /// <summary>
    /// Remove a field from an entity
    /// </summary>
    public AppCustomizer RemoveField(string entityLogicalName, string fieldLogicalName)
    {
        if (!_baselineMetadata.ContainsKey(entityLogicalName))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found in baseline metadata");

        var modification = new FieldModification(
            entityLogicalName,
            fieldLogicalName,
            FieldModificationType.Remove
        );

        _fieldModifications.Add(modification);
        return this;
    }

    /// <summary>
    /// Modify a field in an entity
    /// </summary>
    public AppCustomizer ModifyField(string entityLogicalName, string fieldLogicalName, 
        Dictionary<string, object> propertyChanges)
    {
        if (!_baselineMetadata.ContainsKey(entityLogicalName))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found in baseline metadata");

        var modification = new FieldModification(
            entityLogicalName,
            fieldLogicalName,
            FieldModificationType.Modify,
            null,
            propertyChanges
        );

        _fieldModifications.Add(modification);
        return this;
    }

    /// <summary>
    /// Register a new event handler
    /// </summary>
    public AppCustomizer AddEventHandler(string entityLogicalName, string eventHook, 
        string handlerName, string handlerCode, 
        EventHandlerType handlerType = EventHandlerType.JavaScript,
        int executionOrder = 100)
    {
        if (!_baselineMetadata.TryGetValue(entityLogicalName, out var entity))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found in baseline metadata");

        if (!entity.SupportsEventHandler(eventHook))
            throw new InvalidOperationException($"Event hook '{eventHook}' not supported for entity '{entityLogicalName}'");

        var handler = new EventHandlerRegistration(
            entityLogicalName,
            eventHook,
            handlerName,
            handlerCode,
            executionOrder,
            handlerType,
            EventExecutionPhase.PostOperation
        );

        _eventHandlers.Add(handler);
        return this;
    }

    /// <summary>
    /// Override an existing event handler
    /// </summary>
    public AppCustomizer OverrideEventHandler(string entityLogicalName, string eventHook,
        string handlerName, string handlerCode)
    {
        // Implementation: Find and replace the existing handler
        var existing = _eventHandlers
            .FirstOrDefault(h => h.EntityLogicalName == entityLogicalName && 
                                 h.EventHook == eventHook && 
                                 h.HandlerName == handlerName);

        if (existing != null)
        {
            _eventHandlers.Remove(existing);
        }

        return AddEventHandler(entityLogicalName, eventHook, handlerName, handlerCode);
    }

    /// <summary>
    /// Add a section to a form
    /// </summary>
    public AppCustomizer AddFormSection(string formId, string entityLogicalName, 
        string sectionName, List<string> fields, int order = -1)
    {
        var form = _formCustomizations
            .FirstOrDefault(f => f.FormId == formId);

        if (form == null)
        {
            form = new FormCustomization(formId, entityLogicalName);
            _formCustomizations.Add(form);
        }

        var change = new FormSectionChange(
            sectionName,
            FormSectionChangeType.Add,
            order,
            fields
        );

        form.SectionChanges?.Add(change);
        return this;
    }

    /// <summary>
    /// Remove a section from a form
    /// </summary>
    public AppCustomizer RemoveFormSection(string formId, string sectionName)
    {
        var form = _formCustomizations.FirstOrDefault(f => f.FormId == formId);
        if (form != null)
        {
            var change = new FormSectionChange(
                sectionName,
                FormSectionChangeType.Remove
            );
            form.SectionChanges?.Add(change);
        }
        return this;
    }

    /// <summary>
    /// Set a configuration value
    /// </summary>
    public AppCustomizer SetConfig(string key, object value)
    {
        _configuration[key] = value;
        return this;
    }

    /// <summary>
    /// Generate the customization layer
    /// </summary>
    public CustomizationLayer Generate()
    {
        return new CustomizationLayer(
            Version: "1.0.0",
            FieldModifications: _fieldModifications.Count > 0 ? _fieldModifications : null,
            EventHandlers: _eventHandlers.Count > 0 ? _eventHandlers : null,
            FormCustomizations: _formCustomizations.Count > 0 ? _formCustomizations : null,
            Configuration: _configuration.Count > 0 ? _configuration : null,
            CreatedAt: DateTime.UtcNow,
            CreatedBy: "system"
        );
    }

    /// <summary>
    /// Export customization layer as JSON
    /// </summary>
    public string GenerateJson()
    {
        var layer = Generate();
        return JsonSerializer.Serialize(layer, JsonOptions);
    }

    /// <summary>
    /// Export customization layer as YAML
    /// </summary>
    public string GenerateYaml()
    {
        var layer = Generate();
        // TODO: Implement YAML serialization using YamlDotNet
        return "# YAML export not yet implemented";
    }
}
