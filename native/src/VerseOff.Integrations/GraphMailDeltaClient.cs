using System.Net.Http.Headers;
using System.Text.Json;

namespace VerseOff.Integrations;

public interface IGraphAccessTokenProvider
{
    ValueTask<string> GetAccessTokenAsync(
        CancellationToken cancellationToken = default);
}

public sealed record GraphMailAddress(
    string? DisplayName,
    string? Address);

public sealed record GraphMailSignal(
    string MessageId,
    string? InternetMessageId,
    string? ConversationId,
    string? Subject,
    string? BodyPreview,
    GraphMailAddress? From,
    IReadOnlyList<GraphMailAddress> ToRecipients,
    DateTimeOffset? ReceivedAt,
    DateTimeOffset? ModifiedAt,
    bool IsRead,
    bool HasAttachments,
    bool IsDeleted);

public sealed record GraphMailDeltaResult(
    IReadOnlyList<GraphMailSignal> Changes,
    string DeltaLink);

public sealed class GraphMailDeltaClient
{
    private const int MaximumPages = 20;
    private const int MaximumChanges = 1000;
    private readonly HttpClient httpClient;
    private readonly IGraphAccessTokenProvider tokenProvider;

    public GraphMailDeltaClient(
        HttpClient httpClient,
        IGraphAccessTokenProvider tokenProvider)
    {
        this.httpClient = httpClient
            ?? throw new ArgumentNullException(nameof(httpClient));
        this.tokenProvider = tokenProvider
            ?? throw new ArgumentNullException(nameof(tokenProvider));
    }

    public async ValueTask<GraphMailDeltaResult> GetInboxDeltaAsync(
        string userId,
        string? deltaLink = null,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        var requestUri = deltaLink is null
            ? new Uri(
                "https://graph.microsoft.com/v1.0/users/"
                + Uri.EscapeDataString(userId)
                + "/mailFolders/inbox/messages/delta"
                + "?$select=id,subject,from,toRecipients,receivedDateTime,"
                + "lastModifiedDateTime,internetMessageId,conversationId,"
                + "isRead,hasAttachments,bodyPreview&$top=50")
            : ValidateGraphLink(deltaLink);
        var changes = new List<GraphMailSignal>();
        string? finalDeltaLink = null;

        for (var page = 0; page < MaximumPages; page++)
        {
            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            request.Headers.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                await tokenProvider.GetAccessTokenAsync(cancellationToken));
            request.Headers.Accept.Add(new("application/json"));
            using var response = await httpClient.SendAsync(
                request,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);
            response.EnsureSuccessStatusCode();
            await using var stream = await response.Content
                .ReadAsStreamAsync(cancellationToken);
            using var document = await JsonDocument.ParseAsync(
                stream,
                cancellationToken: cancellationToken);
            if (!document.RootElement.TryGetProperty(
                    "value",
                    out var values)
                || values.ValueKind is not JsonValueKind.Array)
            {
                throw new InvalidDataException(
                    "Microsoft Graph delta response has no value array.");
            }

            foreach (var message in values.EnumerateArray())
            {
                changes.Add(ParseMessage(message));
                if (changes.Count > MaximumChanges)
                {
                    throw new InvalidDataException(
                        $"Microsoft Graph delta exceeded the bounded limit of {MaximumChanges} changes.");
                }
            }

            if (document.RootElement.TryGetProperty(
                    "@odata.nextLink",
                    out var nextLink))
            {
                requestUri = ValidateGraphLink(
                    nextLink.GetString()
                    ?? throw new InvalidDataException(
                        "Microsoft Graph returned an empty nextLink."));
                continue;
            }

            if (document.RootElement.TryGetProperty(
                    "@odata.deltaLink",
                    out var delta))
            {
                finalDeltaLink = ValidateGraphLink(
                    delta.GetString()
                    ?? throw new InvalidDataException(
                        "Microsoft Graph returned an empty deltaLink."))
                    .AbsoluteUri;
                break;
            }

            throw new InvalidDataException(
                "Microsoft Graph delta response has neither nextLink nor deltaLink.");
        }

        return finalDeltaLink is null
            ? throw new InvalidDataException(
                $"Microsoft Graph delta exceeded the bounded limit of {MaximumPages} pages.")
            : new(changes, finalDeltaLink);
    }

    private static GraphMailSignal ParseMessage(JsonElement message)
    {
        var id = Text(message, "id")
            ?? throw new InvalidDataException(
                "Microsoft Graph returned a message change without an ID.");
        var deleted = message.TryGetProperty("@removed", out _);
        return new(
            id,
            Text(message, "internetMessageId"),
            Text(message, "conversationId"),
            Text(message, "subject"),
            Text(message, "bodyPreview"),
            Address(message, "from"),
            Addresses(message, "toRecipients"),
            Date(message, "receivedDateTime"),
            Date(message, "lastModifiedDateTime"),
            Boolean(message, "isRead"),
            Boolean(message, "hasAttachments"),
            deleted);
    }

    private static GraphMailAddress? Address(
        JsonElement element,
        string name)
    {
        if (!element.TryGetProperty(name, out var wrapper)
            || !wrapper.TryGetProperty("emailAddress", out var address))
        {
            return null;
        }

        return AddressValue(address);
    }

    private static GraphMailAddress[] Addresses(
        JsonElement element,
        string name)
    {
        if (!element.TryGetProperty(name, out var values)
            || values.ValueKind is not JsonValueKind.Array)
        {
            return [];
        }

        return values.EnumerateArray()
            .Select(value =>
                value.TryGetProperty("emailAddress", out var address)
                    ? AddressValue(address)
                    : null)
            .OfType<GraphMailAddress>()
            .ToArray();
    }

    private static GraphMailAddress AddressValue(JsonElement address) =>
        new(
            Text(address, "name"),
            Text(address, "address"));

    private static string? Text(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value)
            && value.ValueKind is JsonValueKind.String
                ? value.GetString()
                : null;

    private static bool Boolean(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value)
        && value.ValueKind is JsonValueKind.True;

    private static DateTimeOffset? Date(
        JsonElement element,
        string name) =>
        element.TryGetProperty(name, out var value)
            && value.TryGetDateTimeOffset(out var result)
                ? result
                : null;

    private static Uri ValidateGraphLink(string link)
    {
        if (!Uri.TryCreate(link, UriKind.Absolute, out var uri)
            || !string.Equals(
                uri.Scheme,
                Uri.UriSchemeHttps,
                StringComparison.OrdinalIgnoreCase)
            || !string.Equals(
                uri.Host,
                "graph.microsoft.com",
                StringComparison.OrdinalIgnoreCase)
            || !uri.AbsolutePath.StartsWith(
                "/v1.0/",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidDataException(
                "Microsoft Graph paging link is outside the allowed v1.0 endpoint.");
        }

        return uri;
    }

}
