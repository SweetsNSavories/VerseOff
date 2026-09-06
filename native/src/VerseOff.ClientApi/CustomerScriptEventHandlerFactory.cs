namespace VerseOff.ClientApi;

public sealed class CustomerScriptEventHandlerFactory(
    ICustomerScriptRuntime runtime)
{
    public XrmEventCallback Create(
        CustomerScript script,
        string functionName,
        IReadOnlyList<object?> arguments)
    {
        ArgumentNullException.ThrowIfNull(script);
        ArgumentException.ThrowIfNullOrWhiteSpace(functionName);
        ArgumentNullException.ThrowIfNull(arguments);

        return async (executionContext, cancellationToken) =>
        {
            await runtime.InvokeAsync(
                script,
                functionName,
                executionContext,
                arguments,
                cancellationToken);
        };
    }
}
