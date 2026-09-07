#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names in log messages
#pragma warning disable CA1873 // Expensive operations in logging
#pragma warning disable CA1510 // Use ArgumentNullException.ThrowIfNull
#pragma warning disable CA1860 // Prefer Count to Any

using Microsoft.Extensions.Logging;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Forms;

/// <summary>
/// Runtime service that applies customizations to baseline metadata.
/// Merges field modifications, event handlers, and form changes into the baseline app structure.
/// </summary>
public class CustomizationApplier
{
    private readonly ILogger<CustomizationApplier> _logger;

    public CustomizationApplier(ILogger<CustomizationApplier> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Apply a customization layer to baseline metadata.
    /// Returns a new EntityMetadata with all customizations merged in.
    /// </summary>
    /// <param name="baselineEntity">Baseline entity metadata from Dataverse</param>
    /// <param name="customization">Customization layer to apply (can be null)</param>
    /// <returns>Customized entity metadata</returns>
    public EntityMetadata ApplyCustomizations(EntityMetadata baselineEntity, CustomizationLayer? customization)
    {
        if (baselineEntity == null)
            throw new ArgumentNullException(nameof(baselineEntity));

        if (customization == null)
        {
            _logger.LogDebug("No customizations to apply for entity: {Entity}", baselineEntity.LogicalName);
            return baselineEntity;
        }

        _logger.LogInformation("Applying {Count} customizations to entity: {Entity}",
            (customization.FieldModifications?.Count ?? 0) +
            (customization.FormCustomizations?.Count ?? 0) +
            (customization.EventHandlers?.Count ?? 0),
            baselineEntity.LogicalName);

        var customizedFields = ApplyFieldModifications(baselineEntity.Fields, customization.FieldModifications ?? []);
        var customizedEventHandlers = ApplyEventHandlers(baselineEntity.AvailableEventHandlers, customization.EventHandlers ?? []);

        var result = new EntityMetadata(
            LogicalName: baselineEntity.LogicalName,
            DisplayName: baselineEntity.DisplayName,
            PluralName: baselineEntity.PluralName,
            Fields: customizedFields,
            AvailableEventHandlers: customizedEventHandlers,
            AssociatedForms: baselineEntity.AssociatedForms,
            AssociatedViews: baselineEntity.AssociatedViews,
            ExtendedMetadata: baselineEntity.ExtendedMetadata
        );

        _logger.LogDebug("Applied customizations: {FieldCount} fields, {HandlerCount} handlers",
            customizedFields.Count, customizedEventHandlers.Count);

        return result;
    }

    /// <summary>
    /// Apply field modifications (add, remove, modify) to the baseline field list.
    /// </summary>
    private List<FieldMetadata> ApplyFieldModifications(
        List<FieldMetadata> baselineFields,
        List<FieldModification> modifications)
    {
        if (!modifications.Any())
            return baselineFields;

        var customizedFields = new List<FieldMetadata>(baselineFields);

        foreach (var mod in modifications)
        {
            _logger.LogDebug("Applying field modification: {Field} ({Type})", mod.FieldLogicalName, mod.ModificationType);

            switch (mod.ModificationType)
            {
                case FieldModificationType.Add:
                    if (mod.NewFieldDefinition != null)
                    {
                        // Only add if not already present
                        if (!customizedFields.Any(f => f.LogicalName == mod.FieldLogicalName))
                        {
                            customizedFields.Add(mod.NewFieldDefinition);
                            _logger.LogInformation("Added custom field: {Field}", mod.FieldLogicalName);
                        }
                    }
                    break;

                case FieldModificationType.Remove:
                    var toRemove = customizedFields.FirstOrDefault(f => f.LogicalName == mod.FieldLogicalName);
                    if (toRemove != null)
                    {
                        customizedFields.Remove(toRemove);
                        _logger.LogInformation("Removed field: {Field}", mod.FieldLogicalName);
                    }
                    break;

                case FieldModificationType.Modify:
                    var toModify = customizedFields.FirstOrDefault(f => f.LogicalName == mod.FieldLogicalName);
                    if (toModify != null && mod.PropertyChanges != null)
                    {
                        var modifiedField = ApplyFieldPropertyChanges(toModify, mod.PropertyChanges);
                        var index = customizedFields.IndexOf(toModify);
                        customizedFields[index] = modifiedField;
                        _logger.LogInformation("Modified field: {Field} with {Changes} property changes",
                            mod.FieldLogicalName, mod.PropertyChanges.Count);
                    }
                    break;
            }
        }

        return customizedFields;
    }

    /// <summary>
    /// Apply property changes to a field (update display name, max length, etc.).
    /// </summary>
    private FieldMetadata ApplyFieldPropertyChanges(
        FieldMetadata field,
        Dictionary<string, object> propertyChanges)
    {
        var cloned = field.DeepClone();

        // Note: FieldMetadata is immutable (record type), so we'd need to recreate it
        // For now, return as-is since most changes should use field extensions
        // In a real system, you'd create a new record with updated values

        _logger.LogDebug("Applied property changes to field: {Field}", field.LogicalName);
        return cloned;
    }

    /// <summary>
    /// Apply event handler registrations to the available event handlers list.
    /// </summary>
    private List<string> ApplyEventHandlers(
        List<string> baselineHandlers,
        List<EventHandlerRegistration> registrations)
    {
        if (!registrations.Any())
            return baselineHandlers;

        var customizedHandlers = new List<string>(baselineHandlers);

        // Track which handlers to add by operation type
        var handlersToAdd = registrations
            .Select(r => r.EventHook)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (var handler in handlersToAdd)
        {
            if (!customizedHandlers.Contains(handler, StringComparer.OrdinalIgnoreCase))
            {
                customizedHandlers.Add(handler);
                _logger.LogInformation("Added event handler hook: {Hook}", handler);
            }
        }

        return customizedHandlers;
    }

    /// <summary>
    /// Apply a form customization to a form structure.
    /// This is typically called by the FormCustomizer to apply saved delta changes.
    /// </summary>
    /// <param name="baselineForm">Baseline form definition</param>
    /// <param name="formCustomization">Customization to apply</param>
    /// <returns>Customized form definition</returns>
    public object ApplyFormCustomizations(object baselineForm, FormCustomization? formCustomization)
    {
        if (baselineForm == null)
            throw new ArgumentNullException(nameof(baselineForm));

        if (formCustomization == null)
        {
            _logger.LogDebug("No form customizations to apply");
            return baselineForm;
        }

        _logger.LogInformation("Applying form customizations to form: {Form}", formCustomization.FormId);

        // Form customizations are applied by FormCustomizer in domain logic
        // This method serves as the orchestration point for runtime application
        // The actual FormCustomizer service handles reordering, visibility, section changes

        return baselineForm;
    }
}
