namespace VerseOff.Customization.EventHandlers;

/// <summary>
/// Runtime executor for event handlers
/// </summary>
public class EventHandlerExecutor
{
    private readonly Dictionary<string, List<Customizations.EventHandlerRegistration>> _handlersByEntity;

    public EventHandlerExecutor()
    {
        _handlersByEntity = new();
    }

    /// <summary>
    /// Register an event handler
    /// </summary>
    public void Register(Customizations.EventHandlerRegistration handler)
    {
        ArgumentNullException.ThrowIfNull(handler);

        var key = handler.EntityLogicalName;
        if (!_handlersByEntity.TryGetValue(key, out var handlers))
        {
            handlers = new List<Customizations.EventHandlerRegistration>();
            _handlersByEntity[key] = handlers;
        }

        handlers.Add(handler);
    }

    /// <summary>
    /// Get all handlers for an entity event, sorted by execution order
    /// </summary>
    public IEnumerable<Customizations.EventHandlerRegistration> GetHandlers(
        string entityLogicalName,
        string eventHook)
    {
        if (!_handlersByEntity.TryGetValue(entityLogicalName, out var handlers))
            return Enumerable.Empty<Customizations.EventHandlerRegistration>();

        return handlers
            .Where(h => h.EventHook == eventHook && h.IsActive)
            .OrderBy(h => h.ExecutionOrder)
            .ToList();
    }

    /// <summary>
    /// Get all handlers for an entity, organized by event
    /// </summary>
    public Dictionary<string, List<Customizations.EventHandlerRegistration>> GetHandlersByEvent(
        string entityLogicalName)
    {
        if (!_handlersByEntity.TryGetValue(entityLogicalName, out var handlers))
            return new Dictionary<string, List<Customizations.EventHandlerRegistration>>();

        return handlers
            .Where(h => h.IsActive)
            .GroupBy(h => h.EventHook)
            .ToDictionary(
                g => g.Key,
                g => g.OrderBy(h => h.ExecutionOrder).ToList());
    }

    /// <summary>
    /// Check if entity has any registered handlers
    /// </summary>
    public bool HasHandlers(string entityLogicalName)
    {
        return _handlersByEntity.TryGetValue(entityLogicalName, out var handlers) &&
               handlers.Any(h => h.IsActive);
    }

    /// <summary>
    /// Clear all registered handlers
    /// </summary>
    public void Clear()
    {
        _handlersByEntity.Clear();
    }

    /// <summary>
    /// Get total number of registered handlers
    /// </summary>
    public int GetTotalHandlerCount()
    {
        return _handlersByEntity.Values.SelectMany(h => h).Count();
    }
}

/// <summary>
/// Context passed to event handlers during execution
/// </summary>
public record EventExecutionContext(
    string EntityLogicalName,
    string EventHook,
    Customizations.EventExecutionPhase Phase,
    Dictionary<string, object> EventData,
    DateTime ExecutedAt = default,
    string? ExecutedBy = null,
    Dictionary<string, object>? ExecutionMetadata = null
)
{
    public EventExecutionContext() : this("", "", Customizations.EventExecutionPhase.PostOperation, new()) { }
};
