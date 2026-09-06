using System.Text.Json;

namespace VerseOff.ClientApi;

public sealed record XrmHostRequest(
    string Operation,
    JsonElement Arguments);

public interface IXrmWebApiService
{
    bool IsAvailableOffline(string tableLogicalName);

    ValueTask<JsonElement> ExecuteAsync(
        XrmHostRequest request,
        CancellationToken cancellationToken = default);
}

public interface IXrmNavigationService
{
    ValueTask<JsonElement> ExecuteAsync(
        XrmHostRequest request,
        CancellationToken cancellationToken = default);
}

public sealed class UnavailableXrmWebApiService : IXrmWebApiService
{
    public bool IsAvailableOffline(string tableLogicalName) => false;

    public ValueTask<JsonElement> ExecuteAsync(
        XrmHostRequest request,
        CancellationToken cancellationToken = default) =>
        ValueTask.FromException<JsonElement>(
            new ClientApiOperationUnavailableException(
                request.Operation,
                "The local data service is not configured."));
}

public sealed class UnavailableXrmNavigationService : IXrmNavigationService
{
    public ValueTask<JsonElement> ExecuteAsync(
        XrmHostRequest request,
        CancellationToken cancellationToken = default) =>
        ValueTask.FromException<JsonElement>(
            new ClientApiOperationUnavailableException(
                request.Operation,
                "The native navigation service is not configured."));
}

public sealed class ClientApiOperationUnavailableException
    : InvalidOperationException
{
    public ClientApiOperationUnavailableException()
    {
    }

    public ClientApiOperationUnavailableException(
        string operation,
        string message)
        : base($"{operation}: {message}")
    {
        Operation = operation;
    }

    public ClientApiOperationUnavailableException(
        string operation,
        string message,
        Exception innerException)
        : base($"{operation}: {message}", innerException)
    {
        Operation = operation;
    }

    public string? Operation { get; }
}
