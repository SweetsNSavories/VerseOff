using System.Net.Http.Json;
using VerseOff.Domain;

namespace VerseOff.Sync;

public sealed class HttpBcdrChangeGateway : IDataverseChangeGateway
{
    private readonly HttpClient httpClient;

    public HttpBcdrChangeGateway(HttpClient httpClient)
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
                "The BCDR change gateway requires an HTTPS base address.",
                nameof(httpClient));
        }
    }

    public async ValueTask<DataverseChangePage> ReadChangesAsync(
        string tableLogicalName,
        string? pageOrDeltaLink,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        using var response = await httpClient.PostAsJsonAsync(
            "api/v1/sync/changes",
            new
            {
                tableLogicalName,
                pageOrDeltaLink,
            },
            cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var message = await response.Content.ReadAsStringAsync(
                cancellationToken);
            throw new InvalidOperationException(
                $"The BCDR gateway rejected change tracking with status {(int)response.StatusCode}: {message}");
        }

        return await response.Content
            .ReadFromJsonAsync<DataverseChangePage>(
                cancellationToken)
            ?? throw new InvalidDataException(
                "The BCDR gateway returned no Dataverse change page.");
    }
}
