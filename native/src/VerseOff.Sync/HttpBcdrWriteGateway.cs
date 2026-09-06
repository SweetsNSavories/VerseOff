using System.Net.Http.Json;
using VerseOff.Domain;

namespace VerseOff.Sync;

public sealed class HttpBcdrWriteGateway : IDataverseWriteGateway
{
    private readonly HttpClient httpClient;

    public HttpBcdrWriteGateway(HttpClient httpClient)
    {
        this.httpClient = httpClient
            ?? throw new ArgumentNullException(nameof(httpClient));
        if (httpClient.BaseAddress is null
            || !string.Equals(
                httpClient.BaseAddress.Scheme,
                Uri.UriSchemeHttps,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "The BCDR gateway client requires an HTTPS base address.",
                nameof(httpClient));
        }
    }

    public async ValueTask<SyncResult> ExecuteAsync(
        DataverseOperation operation,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(operation);

        using var response = await httpClient.PostAsJsonAsync(
            "api/v1/sync/operations",
            operation,
            cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var message = await response.Content.ReadAsStringAsync(
                cancellationToken);
            return new(
                operation.OperationId,
                Succeeded: false,
                Etag: null,
                (int)response.StatusCode,
                ErrorCode: "GatewayTransportFailure",
                ErrorMessage: message);
        }

        return await response.Content.ReadFromJsonAsync<SyncResult>(
            cancellationToken)
            ?? throw new InvalidDataException(
                "The BCDR gateway returned no synchronization result.");
    }
}
