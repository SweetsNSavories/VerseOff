namespace VerseOff.ClientApi;

public interface IXrmFormContext;

public interface IXrmEventArguments;

public sealed class XrmSaveEventArguments : IXrmEventArguments
{
    public XrmSaveEventArguments(int saveMode)
    {
        SaveMode = saveMode;
    }

    public int SaveMode { get; }

    public bool IsDefaultPrevented { get; private set; }

    public bool PreventDefaultOnError { get; private set; }

    public void PreventDefault() => IsDefaultPrevented = true;

    public void PreventDefaultWhenHandlerFails() =>
        PreventDefaultOnError = true;
}

public sealed class XrmExecutionContext(
    IXrmFormContext formContext,
    object? eventSource,
    IXrmEventArguments? eventArguments,
    int depth,
    IDictionary<string, object?> sharedVariables)
{
    public IXrmFormContext GetFormContext() => formContext;

    public object? GetEventSource() => eventSource;

    public IXrmEventArguments? GetEventArgs() => eventArguments;

    public int GetDepth() => depth;

    public object? GetSharedVariable(string key) =>
        sharedVariables.TryGetValue(key, out var value) ? value : null;

    public void SetSharedVariable(string key, object? value) =>
        sharedVariables[key] = value;

    internal IReadOnlyDictionary<string, object?> SnapshotSharedVariables() =>
        new Dictionary<string, object?>(
            sharedVariables,
            StringComparer.Ordinal);

    internal void ApplySharedVariables(
        IReadOnlyDictionary<string, object?> values)
    {
        sharedVariables.Clear();
        foreach (var value in values)
        {
            sharedVariables[value.Key] = value.Value;
        }
    }
}

public delegate ValueTask XrmEventCallback(
    XrmExecutionContext executionContext,
    CancellationToken cancellationToken);

public enum XrmEventHandlerSource
{
    Configured = 0,
    CodeAdded = 1,
}

public sealed record XrmEventRegistration(
    string EventName,
    string HandlerId,
    XrmEventCallback Handler,
    XrmEventHandlerSource Source,
    int Order);

public sealed record XrmHandlerFailure(
    string HandlerId,
    string Message,
    Exception Exception);

public sealed record XrmEventResult(
    bool DefaultPrevented,
    IReadOnlyList<XrmHandlerFailure> Failures);

public sealed class XrmEventPipeline
{
    private const int MaximumHandlers = 50;
    private readonly List<XrmEventRegistration> registrations = [];
    private readonly TimeSpan handlerTimeout;

    public XrmEventPipeline(TimeSpan handlerTimeout)
    {
        ArgumentOutOfRangeException.ThrowIfLessThanOrEqual(
            handlerTimeout,
            TimeSpan.Zero);

        this.handlerTimeout = handlerTimeout;
    }

    public void Register(XrmEventRegistration registration)
    {
        ArgumentNullException.ThrowIfNull(registration);
        ArgumentException.ThrowIfNullOrWhiteSpace(registration.EventName);
        ArgumentException.ThrowIfNullOrWhiteSpace(registration.HandlerId);
        if (registrations.Count >= MaximumHandlers)
        {
            throw new InvalidOperationException(
                $"An event pipeline cannot register more than {MaximumHandlers} handlers.");
        }

        if (registrations.Any(existing => string.Equals(
                existing.EventName,
                registration.EventName,
                StringComparison.OrdinalIgnoreCase)
            && string.Equals(
                existing.HandlerId,
                registration.HandlerId,
                StringComparison.Ordinal)))
        {
            throw new InvalidOperationException(
                $"Handler '{registration.HandlerId}' is already registered for '{registration.EventName}'.");
        }

        registrations.Add(registration);
    }

    public async ValueTask<XrmEventResult> ExecuteAsync(
        string eventName,
        IXrmFormContext formContext,
        object? eventSource,
        IXrmEventArguments? eventArguments,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventName);
        ArgumentNullException.ThrowIfNull(formContext);

        var handlers = registrations
            .Where(registration => string.Equals(
                registration.EventName,
                eventName,
                StringComparison.OrdinalIgnoreCase))
            .OrderBy(registration => registration.Source)
            .ThenBy(registration => registration.Order)
            .ToArray();

        var failures = new List<XrmHandlerFailure>();
        var sharedVariables = new Dictionary<string, object?>(
            StringComparer.Ordinal);

        for (var depth = 0; depth < handlers.Length; depth++)
        {
            var registration = handlers[depth];
            var executionContext = new XrmExecutionContext(
                formContext,
                eventSource,
                eventArguments,
                depth,
                sharedVariables);

            try
            {
                await registration.Handler(executionContext, cancellationToken)
                    .AsTask()
                    .WaitAsync(handlerTimeout, cancellationToken);
            }
            catch (Exception exception)
                when (exception is not OperationCanceledException
                    || !cancellationToken.IsCancellationRequested)
            {
                failures.Add(new(
                    registration.HandlerId,
                    exception.Message,
                    exception));

                if (eventArguments is XrmSaveEventArguments saveArguments
                    && saveArguments.PreventDefaultOnError)
                {
                    saveArguments.PreventDefault();
                }
            }
        }

        return new(
            eventArguments is XrmSaveEventArguments save
                && save.IsDefaultPrevented,
            failures);
    }
}
