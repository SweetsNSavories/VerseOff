using System.Globalization;
using System.Text.Json;
using VerseOff.ClientApi;
using VerseOff.ReadModel;
using VerseOff.Storage;

namespace VerseOff.Sync;

public sealed record XrmOperationContext(
    Guid UserObjectId,
    string DeviceId,
    string SecuritySnapshotVersion);

public interface IXrmOperationContextProvider
{
    XrmOperationContext GetCurrent();
}

public sealed class LocalXrmWebApiService(
    ILocalRecordStore localRecordStore,
    IReadModelProvider readModelProvider,
    IXrmOperationContextProvider operationContextProvider,
    IReadOnlySet<string> offlineTables) : IXrmWebApiService
{
    private static readonly HashSet<string> SupportedOperations = new(
        [
            "createRecord",
            "updateRecord",
            "deleteRecord",
            "retrieveRecord",
            "retrieveMultipleRecords",
        ],
        StringComparer.Ordinal);
    private readonly HashSet<string> offlineTables = new(
        offlineTables,
        StringComparer.OrdinalIgnoreCase);

    public bool IsAvailableOffline(string tableLogicalName)
    {
        ValidateTableName(tableLogicalName);
        return offlineTables.Contains(tableLogicalName);
    }

    public async ValueTask<JsonElement> ExecuteAsync(
        XrmHostRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        if (!SupportedOperations.Contains(request.Operation))
        {
            throw new ClientApiOperationUnavailableException(
                request.Operation,
                "Only local CRUD and retrieve operations are supported offline.");
        }

        var table = RequiredString(
            request.Arguments,
            "entityLogicalName");
        ValidateTableName(table);
        if (!offlineTables.Contains(table))
        {
            throw new ClientApiOperationUnavailableException(
                request.Operation,
                $"Table '{table}' is not in the effective offline profile.");
        }

        return request.Operation switch
        {
            "createRecord" => await CreateAsync(
                table,
                RequiredObject(request.Arguments, "data"),
                cancellationToken),
            "updateRecord" => await UpdateAsync(
                table,
                RequiredGuid(request.Arguments, "id"),
                RequiredObject(request.Arguments, "data"),
                cancellationToken),
            "deleteRecord" => await DeleteAsync(
                table,
                RequiredGuid(request.Arguments, "id"),
                cancellationToken),
            "retrieveRecord" => await RetrieveAsync(
                table,
                RequiredGuid(request.Arguments, "id"),
                cancellationToken),
            "retrieveMultipleRecords" => await RetrieveMultipleAsync(
                table,
                request.Arguments,
                cancellationToken),
            _ => throw new ClientApiOperationUnavailableException(
                request.Operation,
                "The operation is not supported."),
        };
    }

    private async ValueTask<JsonElement> CreateAsync(
        string table,
        JsonElement data,
        CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();
        await SaveAsync(table, id, data, cancellationToken);
        return JsonSerializer.SerializeToElement(new
        {
            entityType = table,
            id,
        });
    }

    private async ValueTask<JsonElement> UpdateAsync(
        string table,
        Guid id,
        JsonElement data,
        CancellationToken cancellationToken)
    {
        await SaveAsync(table, id, data, cancellationToken);
        return JsonSerializer.SerializeToElement(new
        {
            entityType = table,
            id,
        });
    }

    private async ValueTask<JsonElement> DeleteAsync(
        string table,
        Guid id,
        CancellationToken cancellationToken)
    {
        var context = operationContextProvider.GetCurrent();
        var deleted = await localRecordStore.DeleteLocalAsync(
            table,
            id,
            context.UserObjectId,
            context.DeviceId,
            Guid.NewGuid().ToString("D"),
            cancellationToken);
        if (!deleted)
        {
            throw new KeyNotFoundException(
                $"Offline record '{table}({id:D})' was not found.");
        }

        return JsonSerializer.SerializeToElement(new
        {
            entityType = table,
            id,
        });
    }

    private async ValueTask<JsonElement> RetrieveAsync(
        string table,
        Guid id,
        CancellationToken cancellationToken)
    {
        var record = await readModelProvider.RetrieveAsync(
            table,
            id,
            cancellationToken)
            ?? throw new KeyNotFoundException(
                $"Offline record '{table}({id:D})' was not found.");
        return record.Data.Clone();
    }

    private async ValueTask<JsonElement> RetrieveMultipleAsync(
        string table,
        JsonElement arguments,
        CancellationToken cancellationToken)
    {
        var options = OptionalString(arguments, "options");
        var maximumPageSize = OptionalInteger(
                arguments,
                "maxPageSize")
            ?? 50;
        maximumPageSize = Math.Clamp(maximumPageSize, 1, 500);
        var parsed = ParseQueryOptions(options);
        var page = await readModelProvider.QueryAsync(
            new(
                table,
                parsed.SearchText,
                parsed.Filters,
                Math.Min(parsed.Top ?? maximumPageSize, maximumPageSize),
                parsed.ContinuationToken),
            cancellationToken);
        return JsonSerializer.SerializeToElement(new
        {
            entities = page.Records.Select(record => record.Data).ToArray(),
            nextLink = page.ContinuationToken,
            fetchXmlPagingCookie = page.ContinuationToken,
            totalRecordCount = page.TotalCount ?? -1,
            totalRecordCountLimitExceeded = false,
        });
    }

    private async Task SaveAsync(
        string table,
        Guid id,
        JsonElement data,
        CancellationToken cancellationToken)
    {
        if (data.ValueKind is not JsonValueKind.Object)
        {
            throw new ArgumentException(
                "Xrm.WebApi data must be a JSON object.",
                nameof(data));
        }

        var context = operationContextProvider.GetCurrent();
        using var document = JsonDocument.Parse(data.GetRawText());
        await localRecordStore.SaveLocalAsync(
            table,
            id,
            document,
            context.UserObjectId,
            context.DeviceId,
            context.SecuritySnapshotVersion,
            Guid.NewGuid().ToString("D"),
            cancellationToken);
    }

    private static ParsedQuery ParseQueryOptions(string? options)
    {
        if (string.IsNullOrWhiteSpace(options))
        {
            return ParsedQuery.Empty;
        }

        var query = options.TrimStart('?');
        var filters = new Dictionary<string, object?>(
            StringComparer.OrdinalIgnoreCase);
        string? search = null;
        string? continuation = null;
        int? top = null;
        foreach (var pair in query.Split(
            '&',
            StringSplitOptions.RemoveEmptyEntries))
        {
            var parts = pair.Split('=', 2);
            var name = Uri.UnescapeDataString(parts[0]);
            var value = parts.Length > 1
                ? Uri.UnescapeDataString(parts[1])
                : string.Empty;
            switch (name)
            {
                case "$select":
                    ValidateSelect(value);
                    break;
                case "$top":
                    if (!int.TryParse(
                            value,
                            NumberStyles.None,
                            CultureInfo.InvariantCulture,
                            out var parsedTop)
                        || parsedTop is < 1 or > 500)
                    {
                        throw new ClientApiOperationUnavailableException(
                            "retrieveMultipleRecords",
                            "$top must be between 1 and 500.");
                    }

                    top = parsedTop;
                    break;
                case "$search":
                    search = value.Trim('"');
                    break;
                case "$skiptoken":
                    continuation = value;
                    break;
                default:
                    throw new ClientApiOperationUnavailableException(
                        "retrieveMultipleRecords",
                        $"Query option '{name}' is not supported by the local read model.");
            }
        }

        return new(search, filters, top, continuation);
    }

    private static void ValidateSelect(string value)
    {
        foreach (var column in value.Split(
            ',',
            StringSplitOptions.RemoveEmptyEntries
                | StringSplitOptions.TrimEntries))
        {
            ValidateTableName(column);
        }
    }

    private static JsonElement RequiredObject(
        JsonElement arguments,
        string name) =>
        arguments.TryGetProperty(name, out var value)
        && value.ValueKind is JsonValueKind.Object
            ? value.Clone()
            : throw new ArgumentException(
                $"Host argument '{name}' must be a JSON object.",
                nameof(arguments));

    private static string RequiredString(
        JsonElement arguments,
        string name) =>
        OptionalString(arguments, name)
        is { Length: > 0 } value
            ? value
            : throw new ArgumentException(
                $"Host argument '{name}' is required.",
                nameof(arguments));

    private static string? OptionalString(
        JsonElement arguments,
        string name) =>
        arguments.TryGetProperty(name, out var value)
        && value.ValueKind is JsonValueKind.String
            ? value.GetString()
            : null;

    private static int? OptionalInteger(
        JsonElement arguments,
        string name) =>
        arguments.TryGetProperty(name, out var value)
        && value.TryGetInt32(out var result)
            ? result
            : null;

    private static Guid RequiredGuid(
        JsonElement arguments,
        string name) =>
        Guid.TryParse(OptionalString(arguments, name), out var value)
            ? value
            : throw new ArgumentException(
                $"Host argument '{name}' must be a GUID.",
                nameof(arguments));

    private static void ValidateTableName(string tableLogicalName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        if (!tableLogicalName.All(character =>
                char.IsAsciiLetterOrDigit(character) || character == '_'))
        {
            throw new ArgumentException(
                "Dataverse logical names may contain ASCII letters, digits, and underscores only.",
                nameof(tableLogicalName));
        }
    }

    private sealed record ParsedQuery(
        string? SearchText,
        IReadOnlyDictionary<string, object?> Filters,
        int? Top,
        string? ContinuationToken)
    {
        public static ParsedQuery Empty { get; } = new(
            null,
            new Dictionary<string, object?>(),
            null,
            null);
    }
}
