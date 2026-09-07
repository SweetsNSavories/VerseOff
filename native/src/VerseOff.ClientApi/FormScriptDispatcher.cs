using VerseOff.Domain;

namespace VerseOff.ClientApi;

public interface ICustomerScriptResolver
{
    ValueTask<CustomerScript?> ResolveAsync(
        string libraryName,
        CancellationToken cancellationToken = default);
}

public sealed class InMemoryCustomerScriptResolver : ICustomerScriptResolver
{
    private readonly Dictionary<string, CustomerScript> scripts;

    public InMemoryCustomerScriptResolver(
        IReadOnlyDictionary<string, CustomerScript>? scripts = null)
    {
        this.scripts = scripts is not null
            ? new Dictionary<string, CustomerScript>(scripts, StringComparer.OrdinalIgnoreCase)
            : new Dictionary<string, CustomerScript>(StringComparer.OrdinalIgnoreCase);
    }

    public void AddOrUpdate(string libraryName, CustomerScript script)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(libraryName);
        ArgumentNullException.ThrowIfNull(script);
        scripts[libraryName] = script;
    }

    public ValueTask<CustomerScript?> ResolveAsync(
        string libraryName,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(libraryName);
        scripts.TryGetValue(libraryName, out var script);
        return ValueTask.FromResult(script);
    }
}

public sealed class FormScriptDispatcher
{
    private readonly ICustomerScriptRuntime runtime;
    private readonly ICustomerScriptResolver scriptResolver;
    private readonly XrmEventPipeline pipeline;
    private readonly CustomerScriptEventHandlerFactory handlerFactory;

    public FormScriptDispatcher(
        ICustomerScriptRuntime runtime,
        ICustomerScriptResolver scriptResolver,
        TimeSpan? handlerTimeout = null)
    {
        this.runtime = runtime ?? throw new ArgumentNullException(nameof(runtime));
        this.scriptResolver = scriptResolver ?? throw new ArgumentNullException(nameof(scriptResolver));
        pipeline = new XrmEventPipeline(handlerTimeout ?? TimeSpan.FromSeconds(2));
        handlerFactory = new CustomerScriptEventHandlerFactory(runtime);
    }

    public async ValueTask RegisterEventsAsync(
        IEnumerable<FormEventDefinition> events,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(events);

        foreach (var eventDef in events.Where(e => e.IsEnabled))
        {
            if (string.IsNullOrWhiteSpace(eventDef.LibraryName)
                || string.IsNullOrWhiteSpace(eventDef.FunctionName))
            {
                continue;
            }

            var script = await scriptResolver.ResolveAsync(
                eventDef.LibraryName,
                cancellationToken);

            if (script is null)
            {
                // Unresolved or unverified script is rejected (fail-closed)
                continue;
            }

            var arguments = eventDef.Parameters
                .Select(p => ResolveParameter(p))
                .ToArray();

            var callback = handlerFactory.Create(
                script,
                eventDef.FunctionName,
                arguments);

            var eventKey = BuildEventKey(eventDef.EventName, eventDef.TargetName);

            try
            {
                pipeline.Register(new XrmEventRegistration(
                    eventKey,
                    eventDef.HandlerId,
                    callback,
                    XrmEventHandlerSource.Configured,
                    eventDef.Order));
            }
            catch (InvalidOperationException)
            {
                // Duplicate handler ID for event is safely ignored
            }
        }
    }

    public async ValueTask<XrmEventResult> TriggerOnLoadAsync(
        XrmFormContext formContext,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(formContext);
        return await pipeline.ExecuteAsync(
            "onload",
            formContext,
            formContext,
            null,
            cancellationToken);
    }

    public async ValueTask<XrmEventResult> TriggerOnChangeAsync(
        XrmFormContext formContext,
        string attributeName,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(formContext);
        ArgumentException.ThrowIfNullOrWhiteSpace(attributeName);

        var attribute = formContext.GetAttribute(attributeName);
        var eventKey = BuildEventKey("onchange", attributeName);

        return await pipeline.ExecuteAsync(
            eventKey,
            formContext,
            attribute,
            null,
            cancellationToken);
    }

    public async ValueTask<XrmEventResult> TriggerOnSaveAsync(
        XrmFormContext formContext,
        int saveMode = 1,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(formContext);

        var eventArgs = new XrmSaveEventArguments(saveMode);
        return await pipeline.ExecuteAsync(
            "onsave",
            formContext,
            formContext,
            eventArgs,
            cancellationToken);
    }

    public async ValueTask<object?> ExecuteRibbonActionAsync(
        string libraryName,
        string functionName,
        XrmFormContext formContext,
        IReadOnlyList<object?>? parameters = null,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(libraryName);
        ArgumentException.ThrowIfNullOrWhiteSpace(functionName);
        ArgumentNullException.ThrowIfNull(formContext);

        var script = await scriptResolver.ResolveAsync(libraryName, cancellationToken);
        if (script is null)
        {
            throw new InvalidOperationException(
                $"Customer script '{libraryName}' for ribbon action could not be resolved.");
        }

        var executionContext = new XrmExecutionContext(
            formContext,
            formContext,
            null,
            0,
            new Dictionary<string, object?>(StringComparer.Ordinal));

        return await runtime.InvokeAsync(
            script,
            functionName,
            executionContext,
            parameters ?? [],
            cancellationToken);
    }

    private static string BuildEventKey(string eventName, string? targetName)
    {
        var normalized = eventName.Trim().ToLowerInvariant();
        return string.IsNullOrWhiteSpace(targetName)
            ? normalized
            : $"{normalized}:{targetName.Trim().ToLowerInvariant()}";
    }

    private static object? ResolveParameter(HandlerParameterDefinition parameter)
    {
        if (parameter.Kind is HandlerParameterKind.Literal)
        {
            if (bool.TryParse(parameter.Value, out var boolVal))
            {
                return boolVal;
            }

            if (int.TryParse(parameter.Value, out var intVal))
            {
                return intVal;
            }

            if (decimal.TryParse(parameter.Value, out var decVal))
            {
                return decVal;
            }

            return parameter.Value;
        }

        return parameter.Value;
    }
}
