using System.Security.Claims;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.Gateway;

public sealed record GatewayChangeRequest(
    string TableLogicalName,
    string? PageOrDeltaLink);

public interface IDataversePrimaryIdResolver
{
    string Resolve(string tableLogicalName);
}

public sealed class DictionaryPrimaryIdResolver(
    IReadOnlyDictionary<string, string> primaryIds)
    : IDataversePrimaryIdResolver
{
    private readonly Dictionary<string, string> primaryIds = new(
        primaryIds,
        StringComparer.OrdinalIgnoreCase);

    public string Resolve(string tableLogicalName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        if (!primaryIds.TryGetValue(tableLogicalName, out var primaryId))
        {
            throw new KeyNotFoundException(
                $"No Dataverse primary-ID mapping exists for table '{tableLogicalName}'.");
        }

        if (!primaryId.All(character =>
                char.IsAsciiLetterOrDigit(character)
                || character == '_'))
        {
            throw new InvalidOperationException(
                $"Dataverse primary-ID name '{primaryId}' is invalid.");
        }

        return primaryId;
    }
}

public interface IDataverseChangeExecutor
{
    bool IsAvailable { get; }

    string? UnavailableReason { get; }

    ValueTask<DataverseChangePage> ReadAsync(
        string tableLogicalName,
        Guid callerObjectId,
        string? pageOrDeltaLink,
        CancellationToken cancellationToken = default);
}

public sealed class UnavailableDataverseChangeExecutor(string reason)
    : IDataverseChangeExecutor
{
    public bool IsAvailable => false;

    public string? UnavailableReason { get; } = reason;

    public ValueTask<DataverseChangePage> ReadAsync(
        string tableLogicalName,
        Guid callerObjectId,
        string? pageOrDeltaLink,
        CancellationToken cancellationToken = default) =>
        ValueTask.FromException<DataverseChangePage>(
            new InvalidOperationException(UnavailableReason));
}

public sealed class HttpDataverseChangeExecutor(
    HttpClient httpClient,
    Uri environmentUri,
    IDataverseAccessTokenProvider tokenProvider,
    IDataverseEntitySetResolver entitySetResolver,
    IDataversePrimaryIdResolver primaryIdResolver)
    : IDataverseChangeExecutor
{
    private const int MaximumResponseBytes = 16 * 1024 * 1024;

    public bool IsAvailable => true;

    public string? UnavailableReason => null;

    public async ValueTask<DataverseChangePage> ReadAsync(
        string tableLogicalName,
        Guid callerObjectId,
        string? pageOrDeltaLink,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        ArgumentOutOfRangeException.ThrowIfEqual(callerObjectId, Guid.Empty);
        var entitySet = entitySetResolver.Resolve(tableLogicalName);
        var primaryId = primaryIdResolver.Resolve(tableLogicalName);
        var requestUri = string.IsNullOrWhiteSpace(pageOrDeltaLink)
            ? new Uri(
                environmentUri,
                $"api/data/v9.2/{entitySet}")
            : ValidateContinuationLink(pageOrDeltaLink);

        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            requestUri);
        request.Headers.Authorization = new(
            "Bearer",
            await tokenProvider.GetAccessTokenAsync(cancellationToken));
        request.Headers.TryAddWithoutValidation(
            "CallerObjectId",
            callerObjectId.ToString("D"));
        request.Headers.TryAddWithoutValidation(
            "Prefer",
            "odata.track-changes,odata.maxpagesize=100");
        request.Headers.Accept.ParseAdd("application/json");
        request.Headers.TryAddWithoutValidation("OData-MaxVersion", "4.0");
        request.Headers.TryAddWithoutValidation("OData-Version", "4.0");

        using var response = await httpClient.SendAsync(
            request,
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);
        response.EnsureSuccessStatusCode();
        var bytes = await ReadBoundedAsync(
            response,
            cancellationToken);
        using var document = JsonDocument.Parse(
            bytes,
            new JsonDocumentOptions
            {
                CommentHandling = JsonCommentHandling.Disallow,
                MaxDepth = 64,
            });
        if (!document.RootElement.TryGetProperty(
                "value",
                out var values)
            || values.ValueKind is not JsonValueKind.Array)
        {
            throw new InvalidDataException(
                "Dataverse change response has no value array.");
        }

        var changes = new List<DataverseChange>();
        foreach (var item in values.EnumerateArray())
        {
            if (!item.TryGetProperty(primaryId, out var idValue)
                || !Guid.TryParse(idValue.ToString(), out var recordId))
            {
                throw new InvalidDataException(
                    $"Dataverse change has no valid '{primaryId}' value.");
            }

            changes.Add(new(
                tableLogicalName,
                recordId,
                item.Clone(),
                item.TryGetProperty("@odata.etag", out var etag)
                    ? etag.GetString()
                    : null,
                item.TryGetProperty("@removed", out _)));
        }

        return new(
            changes,
            Link(document.RootElement, "@odata.nextLink"),
            Link(document.RootElement, "@odata.deltaLink"));
    }

    private Uri ValidateContinuationLink(string link)
    {
        if (!Uri.TryCreate(link, UriKind.Absolute, out var uri)
            || !string.Equals(
                uri.Scheme,
                Uri.UriSchemeHttps,
                StringComparison.OrdinalIgnoreCase)
            || !string.Equals(
                uri.Host,
                environmentUri.Host,
                StringComparison.OrdinalIgnoreCase)
            || uri.Port != environmentUri.Port
            || !uri.AbsolutePath.StartsWith(
                "/api/data/v9.2/",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidDataException(
                "Dataverse paging link is outside the configured environment.");
        }

        return uri;
    }

    private string? Link(JsonElement root, string name)
    {
        if (!root.TryGetProperty(name, out var link))
        {
            return null;
        }

        var value = link.GetString()
            ?? throw new InvalidDataException(
                $"Dataverse returned an empty {name}.");
        return ValidateContinuationLink(value).AbsoluteUri;
    }

    private static async Task<byte[]> ReadBoundedAsync(
        HttpResponseMessage response,
        CancellationToken cancellationToken)
    {
        if (response.Content.Headers.ContentLength
            is > MaximumResponseBytes)
        {
            throw new InvalidDataException(
                "Dataverse change response exceeds the configured size limit.");
        }

        await using var source = await response.Content.ReadAsStreamAsync(
            cancellationToken);
        using var destination = new MemoryStream();
        var buffer = new byte[81920];
        while (true)
        {
            var read = await source.ReadAsync(
                buffer,
                cancellationToken);
            if (read == 0)
            {
                return destination.ToArray();
            }

            if (destination.Length + read > MaximumResponseBytes)
            {
                throw new InvalidDataException(
                    "Dataverse change response exceeds the configured size limit.");
            }

            await destination.WriteAsync(
                buffer.AsMemory(0, read),
                cancellationToken);
        }
    }
}

public interface IGatewayReadAuthorizationService
{
    bool CanRead(ClaimsPrincipal principal, out Guid userObjectId);
}

public sealed class ClaimsGatewayReadAuthorizationService
    : IGatewayReadAuthorizationService
{
    public bool CanRead(
        ClaimsPrincipal principal,
        out Guid userObjectId)
    {
        ArgumentNullException.ThrowIfNull(principal);
        userObjectId = Guid.Empty;
        var userValue = principal.FindFirst("oid")?.Value
            ?? principal.FindFirst(
                System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var canRead = principal.Identity?.IsAuthenticated is true
            && Guid.TryParse(userValue, out userObjectId)
            && principal.FindAll("verseoff:capability")
                .Any(claim => string.Equals(
                    claim.Value,
                    "read",
                    StringComparison.Ordinal));
        if (!canRead)
        {
            userObjectId = Guid.Empty;
        }

        return canRead;
    }
}
