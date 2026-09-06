using System.Security;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;
using VerseOff.Storage;

namespace VerseOff.ReadModel;

public interface ISecuritySnapshotProvider
{
    SecuritySnapshot? GetCurrent();
}

public sealed class EfLocalReadModelProvider(
    IDbContextFactory<VerseOffDbContext> contextFactory,
    ISecuritySnapshotProvider securitySnapshotProvider,
    TimeProvider timeProvider,
    ILocalDataProtector dataProtector)
    : IReadModelProvider
{
    private const int MaximumScanRecords = 5000;

    public async ValueTask<ReadRecord?> RetrieveAsync(
        string tableLogicalName,
        Guid recordId,
        CancellationToken cancellationToken = default)
    {
        ValidateTableName(tableLogicalName);
        var security = RequireTableAccess(tableLogicalName);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var record = await context.CachedRecords
            .AsNoTracking()
            .SingleOrDefaultAsync(
                candidate =>
                    candidate.TableLogicalName == tableLogicalName
                    && candidate.RecordId == recordId,
                cancellationToken);
        return record is null
            ? null
            : ToReadRecord(record, security, dataProtector);
    }

    public async ValueTask<ReadPage> QueryAsync(
        ReadQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);
        ValidateTableName(query.TableLogicalName);
        ArgumentOutOfRangeException.ThrowIfLessThan(
            query.PageSize,
            1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(
            query.PageSize,
            500);
        var security = RequireTableAccess(query.TableLogicalName);
        var offset = DecodeOffset(query.ContinuationToken);

        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var candidates = await context.CachedRecords
            .AsNoTracking()
            .Where(record =>
                record.TableLogicalName == query.TableLogicalName)
            .OrderByDescending(record => record.ModifiedAt)
            .ThenBy(record => record.RecordId)
            .Take(MaximumScanRecords)
            .ToListAsync(cancellationToken);
        var filtered = candidates
            .Select(record => ToReadRecord(
                record,
                security,
                dataProtector))
            .Where(record => Matches(record, query))
            .ToArray();
        var page = filtered
            .Skip(offset)
            .Take(query.PageSize)
            .ToArray();
        var nextOffset = offset + page.Length;

        return new(
            page,
            nextOffset < filtered.Length
                ? EncodeOffset(nextOffset)
                : null,
            filtered.LongLength);
    }

    private AccessContext RequireTableAccess(string tableLogicalName)
    {
        var snapshot = securitySnapshotProvider.GetCurrent()
            ?? throw new SecurityException(
                "No Dataverse security snapshot is available.");
        if (!snapshot.IsValidAt(timeProvider.GetUtcNow()))
        {
            throw new SecurityException(
                "The Dataverse security snapshot is missing or expired.");
        }

        var permission = snapshot.FindTable(tableLogicalName);
        if (permission is null
            || permission.ReadDepth is AccessDepth.None)
        {
            throw new SecurityException(
                $"The current user cannot read table '{tableLogicalName}'.");
        }

        return new(snapshot.Version, permission);
    }

    private static ReadRecord ToReadRecord(
        CachedRecordEntity entity,
        AccessContext security,
        ILocalDataProtector dataProtector)
    {
        if (!string.Equals(
                entity.SecuritySnapshotVersion,
                security.SnapshotVersion,
                StringComparison.Ordinal))
        {
            throw new SecurityException(
                "The cached record was admitted under a different security snapshot.");
        }

        using var document = JsonDocument.Parse(
            dataProtector.Unprotect(
                entity.DataJson,
                LocalProtectionPurpose.Record(
                    entity.TableLogicalName,
                    entity.RecordId)));
        var projected = ProjectReadableColumns(
            document.RootElement,
            security.Permission.ReadableColumns);
        return new(
            entity.TableLogicalName,
            entity.RecordId,
            projected,
            entity.SecuritySnapshotVersion,
            entity.ModifiedAt,
            entity.SyncState,
            entity.SyncState is LocalSyncState.PendingDelete);
    }

    private static JsonElement ProjectReadableColumns(
        JsonElement source,
        IReadOnlySet<string> readableColumns)
    {
        if (source.ValueKind is not JsonValueKind.Object)
        {
            throw new InvalidDataException(
                "Cached Dataverse records must be JSON objects.");
        }

        using var buffer = new MemoryStream();
        using (var writer = new Utf8JsonWriter(buffer))
        {
            writer.WriteStartObject();
            foreach (var property in source.EnumerateObject())
            {
                if (readableColumns.Contains(property.Name))
                {
                    property.WriteTo(writer);
                }
            }

            writer.WriteEndObject();
        }

        using var projected = JsonDocument.Parse(buffer.ToArray());
        return projected.RootElement.Clone();
    }

    private static bool Matches(ReadRecord record, ReadQuery query)
    {
        if (!string.IsNullOrWhiteSpace(query.SearchText)
            && !record.Data.GetRawText().Contains(
                query.SearchText,
                StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        foreach (var filter in query.Filters)
        {
            if (!record.Data.TryGetProperty(filter.Key, out var value)
                || !string.Equals(
                    value.ToString(),
                    Convert.ToString(
                        filter.Value,
                        System.Globalization.CultureInfo.InvariantCulture),
                    StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }
        }

        return true;
    }

    private static string EncodeOffset(int offset) =>
        Convert.ToBase64String(
            Encoding.UTF8.GetBytes(
                offset.ToString(
                    System.Globalization.CultureInfo.InvariantCulture)));

    private static int DecodeOffset(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return 0;
        }

        try
        {
            var value = Encoding.UTF8.GetString(
                Convert.FromBase64String(token));
            return int.TryParse(
                value,
                System.Globalization.NumberStyles.None,
                System.Globalization.CultureInfo.InvariantCulture,
                out var offset)
                && offset is >= 0 and <= MaximumScanRecords
                    ? offset
                    : throw new InvalidDataException(
                        "The local continuation token is invalid.");
        }
        catch (FormatException exception)
        {
            throw new InvalidDataException(
                "The local continuation token is invalid.",
                exception);
        }
    }

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

    private sealed record AccessContext(
        string SnapshotVersion,
        TableAccessGrant Permission);
}
