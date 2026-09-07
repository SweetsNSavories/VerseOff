using VerseOff.Customization.Metadata;
using System.Text.Json;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace VerseOff.Customization.Customizations;

/// <summary>
/// Fluent API for customizing an offline application.
/// Allows adding/removing fields, registering event handlers, and customizing forms.
/// </summary>
public class AppCustomizer
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };
    private static readonly ISerializer YamlSerializer = new SerializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .DisableAliases()
        .Build();
    private static readonly IDeserializer YamlDeserializer = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .Build();

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
        if (!_baselineMetadata.TryGetValue(entityLogicalName, out var entity))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found in baseline metadata");

        // Validate field doesn't already exist in baseline
        if (entity.GetField(fieldDefinition.LogicalName) != null)
            throw new InvalidOperationException($"Field '{fieldDefinition.LogicalName}' already exists in entity '{entityLogicalName}'. Use ModifyField instead.");

        // Check for duplicate additions
        if (_fieldModifications.Any(m => m.EntityLogicalName == entityLogicalName && 
                                         m.FieldLogicalName == fieldDefinition.LogicalName && 
                                         m.ModificationType == FieldModificationType.Add))
            throw new InvalidOperationException($"Field '{fieldDefinition.LogicalName}' is already queued for addition in entity '{entityLogicalName}'");

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
        if (!_baselineMetadata.TryGetValue(entityLogicalName, out var entity))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found in baseline metadata");

        // Validate field exists
        if (entity.GetField(fieldLogicalName) == null)
            throw new InvalidOperationException($"Field '{fieldLogicalName}' does not exist in entity '{entityLogicalName}'");

        // Check for duplicate removals
        if (_fieldModifications.Any(m => m.EntityLogicalName == entityLogicalName && 
                                         m.FieldLogicalName == fieldLogicalName && 
                                         m.ModificationType == FieldModificationType.Remove))
            throw new InvalidOperationException($"Field '{fieldLogicalName}' is already queued for removal in entity '{entityLogicalName}'");

        // Check if field is being added and removed (conflict)
        var addModification = _fieldModifications.FirstOrDefault(m => 
            m.EntityLogicalName == entityLogicalName && 
            m.FieldLogicalName == fieldLogicalName && 
            m.ModificationType == FieldModificationType.Add);
        
        if (addModification != null)
            throw new InvalidOperationException($"Cannot remove field '{fieldLogicalName}' that is queued for addition. Remove the add operation first.");

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
        return YamlSerializer.Serialize(layer);
    }

    /// <summary>
    /// Validate customizations for conflicts and issues
    /// </summary>
    public ValidationResult Validate()
    {
        var issues = new List<string>();

        // Check for field modifications on non-existent entities
        foreach (var mod in _fieldModifications)
        {
            if (!_baselineMetadata.ContainsKey(mod.EntityLogicalName))
            {
                issues.Add($"Field modification references unknown entity: {mod.EntityLogicalName}");
                continue;
            }

            var entity = _baselineMetadata[mod.EntityLogicalName];

            // Check add operations
            if (mod.ModificationType == FieldModificationType.Add)
            {
                if (entity.GetField(mod.FieldLogicalName) != null)
                    issues.Add($"Field '{mod.FieldLogicalName}' already exists in entity '{mod.EntityLogicalName}'");
            }

            // Check remove operations
            if (mod.ModificationType == FieldModificationType.Remove)
            {
                if (entity.GetField(mod.FieldLogicalName) == null)
                    issues.Add($"Field '{mod.FieldLogicalName}' does not exist in entity '{mod.EntityLogicalName}'");
            }
        }

        // Check for event handlers on non-existent entities
        foreach (var handler in _eventHandlers)
        {
            if (!_baselineMetadata.ContainsKey(handler.EntityLogicalName))
            {
                issues.Add($"Event handler references unknown entity: {handler.EntityLogicalName}");
                continue;
            }

            var entity = _baselineMetadata[handler.EntityLogicalName];
            if (!entity.SupportsEventHandler(handler.EventHook))
                issues.Add($"Event hook '{handler.EventHook}' not supported for entity '{handler.EntityLogicalName}'");
        }

        // Check for duplicate event handlers with same execution order/phase
        var handlerGroups = _eventHandlers.GroupBy(h => new { h.EntityLogicalName, h.EventHook, h.ExecutionPhase, h.ExecutionOrder });
        foreach (var group in handlerGroups.Where(g => g.Count() > 1))
        {
            issues.Add($"Multiple event handlers registered for {group.Key.EntityLogicalName}.{group.Key.EventHook} with same execution order {group.Key.ExecutionOrder} in phase {group.Key.ExecutionPhase}");
        }

        return new ValidationResult(issues.Count == 0, issues);
    }

    /// <summary>
    /// Import customizations from JSON string
    /// </summary>
    public static AppCustomizer FromJson(string json, Dictionary<string, EntityMetadata> baselineMetadata)
    {
        var layer = JsonSerializer.Deserialize<CustomizationLayer>(json, JsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialize customizations from JSON");

        var customizer = new AppCustomizer(baselineMetadata);

        // Re-apply all customizations
        if (layer.FieldModifications != null)
        {
            foreach (var mod in layer.FieldModifications)
            {
                if (mod.ModificationType == FieldModificationType.Add && mod.NewFieldDefinition != null)
                    customizer.AddField(mod.EntityLogicalName, mod.NewFieldDefinition);
                else if (mod.ModificationType == FieldModificationType.Remove)
                    customizer.RemoveField(mod.EntityLogicalName, mod.FieldLogicalName);
                else if (mod.ModificationType == FieldModificationType.Modify && mod.PropertyChanges != null)
                    customizer.ModifyField(mod.EntityLogicalName, mod.FieldLogicalName, mod.PropertyChanges);
            }
        }

        if (layer.EventHandlers != null)
        {
            foreach (var handler in layer.EventHandlers)
            {
                customizer.AddEventHandler(
                    handler.EntityLogicalName,
                    handler.EventHook,
                    handler.HandlerName,
                    handler.HandlerCode ?? string.Empty,
                    handler.HandlerType,
                    handler.ExecutionOrder
                );
            }
        }

        if (layer.Configuration != null)
        {
            foreach (var kvp in layer.Configuration)
                customizer.SetConfig(kvp.Key, kvp.Value);
        }

        return customizer;
    }

    /// <summary>
    /// Import customizations from YAML string
    /// </summary>
    public static AppCustomizer FromYaml(string yaml, Dictionary<string, EntityMetadata> baselineMetadata)
    {
        var layer = YamlDeserializer.Deserialize<CustomizationLayer>(yaml)
            ?? throw new InvalidOperationException("Failed to deserialize customizations from YAML");

        var customizer = new AppCustomizer(baselineMetadata);

        // Re-apply all customizations
        if (layer.FieldModifications != null)
        {
            foreach (var mod in layer.FieldModifications)
            {
                if (mod.ModificationType == FieldModificationType.Add && mod.NewFieldDefinition != null)
                    customizer.AddField(mod.EntityLogicalName, mod.NewFieldDefinition);
                else if (mod.ModificationType == FieldModificationType.Remove)
                    customizer.RemoveField(mod.EntityLogicalName, mod.FieldLogicalName);
                else if (mod.ModificationType == FieldModificationType.Modify && mod.PropertyChanges != null)
                    customizer.ModifyField(mod.EntityLogicalName, mod.FieldLogicalName, mod.PropertyChanges);
            }
        }

        if (layer.EventHandlers != null)
        {
            foreach (var handler in layer.EventHandlers)
            {
                customizer.AddEventHandler(
                    handler.EntityLogicalName,
                    handler.EventHook,
                    handler.HandlerName,
                    handler.HandlerCode ?? string.Empty,
                    handler.HandlerType,
                    handler.ExecutionOrder
                );
            }
        }

        if (layer.Configuration != null)
        {
            foreach (var kvp in layer.Configuration)
                customizer.SetConfig(kvp.Key, kvp.Value);
        }

        return customizer;
    }
}

/// <summary>
/// Result of customization validation
/// </summary>
public record ValidationResult(bool IsValid, List<string> Issues)
{
    public override string ToString() =>
        IsValid ? "✓ Customizations are valid" : $"✗ {Issues.Count} validation issue(s):\n  - " + string.Join("\n  - ", Issues);
}
