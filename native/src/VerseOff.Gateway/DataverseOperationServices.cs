using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.Gateway;

public sealed record OperationAuthorizationDecision(
    bool IsAuthorized,
    string? FailureReason);

public interface IGatewayOperationAuthorizationService
{
    ValueTask<OperationAuthorizationDecision> AuthorizeAsync(
        ClaimsPrincipal principal,
        DataverseOperation operation,
        CancellationToken cancellationToken = default);
}

public sealed class ClaimsGatewayOperationAuthorizationService
    : IGatewayOperationAuthorizationService
{
    public ValueTask<OperationAuthorizationDecision> AuthorizeAsync(
        ClaimsPrincipal principal,
        DataverseOperation operation,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(principal);
        ArgumentNullException.ThrowIfNull(operation);
        cancellationToken.ThrowIfCancellationRequested();

        if (principal.Identity?.IsAuthenticated is not true)
        {
            return Denied("The caller is not authenticated.");
        }

        var userClaim = principal.FindFirst("oid")?.Value
            ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userClaim, out var userObjectId)
            || userObjectId != operation.UserObjectId)
        {
            return Denied(
                "The operation user does not match the authenticated Dataverse user mapping.");
        }

        var deviceId = principal.FindFirst("verseoff:device_id")?.Value;
        if (!string.Equals(
                deviceId,
                operation.DeviceId,
                StringComparison.Ordinal))
        {
            return Denied(
                "The operation device does not match the authenticated device.");
        }

        var capabilities = principal.FindAll("verseoff:capability")
            .Select(claim => claim.Value)
            .ToHashSet(StringComparer.Ordinal);
        return capabilities.Contains("write")
            ? ValueTask.FromResult(new OperationAuthorizationDecision(
                true,
                null))
            : Denied("The caller has no BCDR write capability.");
    }

    private static ValueTask<OperationAuthorizationDecision> Denied(
        string reason) =>
        ValueTask.FromResult(new OperationAuthorizationDecision(
            false,
            reason));
}

public interface IDataverseAccessTokenProvider
{
    ValueTask<string> GetAccessTokenAsync(
        CancellationToken cancellationToken = default);
}

public interface IDataverseEntitySetResolver
{
    string Resolve(string tableLogicalName);
}

public sealed class DictionaryEntitySetResolver(
    IReadOnlyDictionary<string, string> entitySets)
    : IDataverseEntitySetResolver
{
    private readonly Dictionary<string, string> entitySets = new(
        entitySets,
        StringComparer.OrdinalIgnoreCase);

    public string Resolve(string tableLogicalName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        return entitySets.TryGetValue(tableLogicalName, out var entitySet)
            ? ValidateEntitySet(entitySet)
            : throw new KeyNotFoundException(
                $"No Dataverse entity-set mapping exists for table '{tableLogicalName}'.");
    }

    private static string ValidateEntitySet(string entitySet)
    {
        if (string.IsNullOrWhiteSpace(entitySet)
            || !entitySet.All(character =>
                char.IsAsciiLetterOrDigit(character)
                || character == '_'))
        {
            throw new InvalidOperationException(
                $"Dataverse entity-set name '{entitySet}' is invalid.");
        }

        return entitySet;
    }
}

public interface IDataverseOperationExecutor
{
    bool IsAvailable { get; }

    string? UnavailableReason { get; }

    ValueTask<SyncResult> ExecuteAsync(
        DataverseOperation operation,
        CancellationToken cancellationToken = default);
}

public sealed class UnavailableDataverseOperationExecutor(string reason)
    : IDataverseOperationExecutor
{
    public bool IsAvailable => false;

    public string? UnavailableReason { get; } =
        string.IsNullOrWhiteSpace(reason)
            ? "Dataverse synchronization is not configured."
            : reason;

    public ValueTask<SyncResult> ExecuteAsync(
        DataverseOperation operation,
        CancellationToken cancellationToken = default) =>
        throw new InvalidOperationException(UnavailableReason);
}

public sealed class HttpDataverseOperationExecutor(
    HttpClient httpClient,
    Uri environmentUri,
    IDataverseAccessTokenProvider tokenProvider,
    IDataverseEntitySetResolver entitySetResolver)
    : IDataverseOperationExecutor
{
    public bool IsAvailable => true;

    public string? UnavailableReason => null;

    public async ValueTask<SyncResult> ExecuteAsync(
        DataverseOperation operation,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(operation);
        ValidateEnvironmentUri(environmentUri);

        string entitySet;
        try
        {
            entitySet = entitySetResolver.Resolve(
                operation.TableLogicalName);
        }
        catch (KeyNotFoundException exception)
        {
            return new(
                operation.OperationId,
                Succeeded: false,
                Etag: null,
                StatusCode: 400,
                ErrorCode: "EntitySetNotConfigured",
                ErrorMessage: exception.Message);
        }

        var relativePath = operation.OperationType
            is DataverseOperationType.Create
                ? $"api/data/v9.2/{entitySet}"
                : $"api/data/v9.2/{entitySet}({operation.RecordId:D})";
        using var request = new HttpRequestMessage(
            Method(operation.OperationType),
            new Uri(environmentUri, relativePath));
        request.Headers.Authorization = new(
            "Bearer",
            await tokenProvider.GetAccessTokenAsync(cancellationToken));
        request.Headers.TryAddWithoutValidation(
            "CallerObjectId",
            operation.UserObjectId.ToString("D"));
        request.Headers.TryAddWithoutValidation(
            "x-ms-client-request-id",
            operation.CorrelationId);
        request.Headers.Accept.Add(new(
            "application/json"));
        request.Headers.TryAddWithoutValidation(
            "OData-MaxVersion",
            "4.0");
        request.Headers.TryAddWithoutValidation(
            "OData-Version",
            "4.0");

        if (operation.OperationType is not DataverseOperationType.Create
            && !string.IsNullOrWhiteSpace(operation.BaseEtag))
        {
            request.Headers.TryAddWithoutValidation(
                "If-Match",
                operation.BaseEtag);
        }

        if (operation.OperationType is DataverseOperationType.Create
            or DataverseOperationType.Update)
        {
            request.Content = new StringContent(
                operation.Payload.GetRawText(),
                Encoding.UTF8,
                "application/json");
        }

        using var response = await httpClient.SendAsync(
            request,
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);
        if (response.IsSuccessStatusCode)
        {
            return new(
                operation.OperationId,
                Succeeded: true,
                response.Headers.ETag?.ToString(),
                (int)response.StatusCode,
                null,
                null);
        }

        var error = await ReadErrorAsync(response, cancellationToken);
        return new(
            operation.OperationId,
            Succeeded: false,
            response.Headers.ETag?.ToString(),
            (int)response.StatusCode,
            error.Code,
            error.Message);
    }

    private static HttpMethod Method(DataverseOperationType operationType) =>
        operationType switch
        {
            DataverseOperationType.Create => HttpMethod.Post,
            DataverseOperationType.Update => HttpMethod.Patch,
            DataverseOperationType.Delete => HttpMethod.Delete,
            _ => throw new ArgumentOutOfRangeException(
                nameof(operationType),
                operationType,
                "Unsupported Dataverse operation type."),
        };

    private static async Task<DataverseError> ReadErrorAsync(
        HttpResponseMessage response,
        CancellationToken cancellationToken)
    {
        const int maximumErrorBytes = 64 * 1024;
        await using var stream = await response.Content.ReadAsStreamAsync(
            cancellationToken);
        using var buffer = new MemoryStream();
        var bytes = new byte[8192];
        while (buffer.Length < maximumErrorBytes)
        {
            var allowed = (int)Math.Min(
                bytes.Length,
                maximumErrorBytes - buffer.Length);
            var read = await stream.ReadAsync(
                bytes.AsMemory(0, allowed),
                cancellationToken);
            if (read == 0)
            {
                break;
            }

            await buffer.WriteAsync(
                bytes.AsMemory(0, read),
                cancellationToken);
        }

        try
        {
            using var json = JsonDocument.Parse(buffer.ToArray());
            if (json.RootElement.TryGetProperty("error", out var error))
            {
                return new(
                    error.TryGetProperty("code", out var code)
                        ? code.GetString()
                        : null,
                    error.TryGetProperty("message", out var message)
                        ? message.GetString()
                        : response.ReasonPhrase);
            }
        }
        catch (JsonException)
        {
            // The bounded raw response below remains an explicit failure.
        }

        return new(
            null,
            Encoding.UTF8.GetString(buffer.ToArray()));
    }

    private static void ValidateEnvironmentUri(Uri uri)
    {
        ArgumentNullException.ThrowIfNull(uri);
        if (!uri.IsAbsoluteUri
            || !string.Equals(
                uri.Scheme,
                Uri.UriSchemeHttps,
                StringComparison.OrdinalIgnoreCase)
            || !string.IsNullOrEmpty(uri.Query)
            || !string.IsNullOrEmpty(uri.Fragment))
        {
            throw new InvalidOperationException(
                "The Dataverse environment URI must be an absolute HTTPS origin.");
        }
    }

    private sealed record DataverseError(string? Code, string? Message);
}
