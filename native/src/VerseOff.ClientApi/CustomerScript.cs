using VerseOff.Domain;

namespace VerseOff.ClientApi;

public sealed record CustomerScript(
    string ScriptId,
    string Source,
    ComponentProvenance Provenance);

public interface ICustomerScriptRuntime
{
    ValueTask<object?> InvokeAsync(
        CustomerScript script,
        string functionName,
        XrmExecutionContext executionContext,
        IReadOnlyList<object?> arguments,
        CancellationToken cancellationToken = default);
}

public sealed class CustomerScriptRejectedException : InvalidOperationException
{
    public CustomerScriptRejectedException()
    {
    }

    public CustomerScriptRejectedException(string message)
        : base(message)
    {
    }

    public CustomerScriptRejectedException(
        string message,
        Exception innerException)
        : base(message, innerException)
    {
    }
}
