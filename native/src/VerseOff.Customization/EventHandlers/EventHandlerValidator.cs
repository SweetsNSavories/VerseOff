using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.EventHandlers;

/// <summary>
/// Validates event handler registrations for conflicts and consistency
/// </summary>
public class EventHandlerValidator
{
    private readonly Dictionary<string, EntityMetadata> _baselineMetadata;

    public EventHandlerValidator(Dictionary<string, EntityMetadata> baselineMetadata)
    {
        ArgumentNullException.ThrowIfNull(baselineMetadata);
        _baselineMetadata = baselineMetadata;
    }

    /// <summary>
    /// Validate a single event handler registration
    /// </summary>
    public EventHandlerValidationResult Validate(
        Customizations.EventHandlerRegistration handler,
        List<Customizations.EventHandlerRegistration> existingHandlers)
    {
        var issues = new List<string>();
        var warnings = new List<string>();

        // Validate entity exists
        if (!_baselineMetadata.TryGetValue(handler.EntityLogicalName, out var entity))
            issues.Add($"Entity '{handler.EntityLogicalName}' not found in baseline metadata");
        else
        {
            // Validate event hook is supported
            if (!entity.SupportsEventHandler(handler.EventHook))
                issues.Add($"Event hook '{handler.EventHook}' not supported on entity '{handler.EntityLogicalName}'");
        }

        // Validate execution order is positive
        if (handler.ExecutionOrder < 0)
            issues.Add($"Execution order must be non-negative (got {handler.ExecutionOrder})");

        // Check for duplicate handler names on same entity/event
        var duplicates = existingHandlers.Where(h =>
            h.EntityLogicalName == handler.EntityLogicalName &&
            h.EventHook == handler.EventHook &&
            h.HandlerName == handler.HandlerName &&
            h.HandlerType == handler.HandlerType).ToList();

        if (duplicates.Count > 0)
            issues.Add($"Handler '{handler.HandlerName}' already registered for {handler.EntityLogicalName}.{handler.EventHook}");

        // Check for execution order conflicts (warn if multiple handlers have same order)
        var sameOrder = existingHandlers.Where(h =>
            h.EntityLogicalName == handler.EntityLogicalName &&
            h.EventHook == handler.EventHook &&
            h.ExecutionOrder == handler.ExecutionOrder).ToList();

        if (sameOrder.Count > 0)
            warnings.Add($"Multiple handlers registered with same execution order ({handler.ExecutionOrder}) for {handler.EntityLogicalName}.{handler.EventHook}");

        return new EventHandlerValidationResult(
            issues.Count == 0,
            issues,
            warnings,
            duplicates.Count > 0 ? "Duplicate handler" : null);
    }

    /// <summary>
    /// Validate handler code
    /// </summary>
    public static ValidationResult ValidateHandlerCode(EventHandlerCode code, Customizations.EventHandlerType handlerType)
    {
        var codeValidation = code.Validate();
        if (!codeValidation.IsValid)
            return codeValidation;

        // Additional validation based on handler type
        if (handlerType == Customizations.EventHandlerType.JavaScript)
        {
            // Basic JavaScript validation (check for common patterns)
            var content = code.GetCode();
            if (!content.Contains("function") && !content.Contains("=>") && !content.Contains("class"))
                return new ValidationResult(false, new() { "JavaScript handler must contain function, arrow function, or class definition" });
        }

        return new ValidationResult(true, new());
    }

    /// <summary>
    /// Validate execution phases for handler chain
    /// </summary>
    public static EventHandlerValidationResult ValidateExecutionPhase(
        Customizations.EventHandlerRegistration handler,
        Customizations.EventExecutionPhase phase)
    {
        var issues = new List<string>();

        // Validate phase is appropriate for handler type
        if (handler.HandlerType == Customizations.EventHandlerType.Workflow && 
            phase != Customizations.EventExecutionPhase.PostOperation)
            issues.Add("Workflow handlers must run in PostOperation phase");

        return new EventHandlerValidationResult(
            issues.Count == 0,
            issues,
            new(),
            null);
    }
}

/// <summary>
/// Result of event handler validation
/// </summary>
public record EventHandlerValidationResult(
    bool IsValid,
    List<string> Issues,
    List<string> Warnings,
    string? ConflictType = null
);
