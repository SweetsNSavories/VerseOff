using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.ReadModel;

public sealed record ReadRecord(
    string TableLogicalName,
    Guid RecordId,
    JsonElement Data,
    string SecuritySnapshotVersion,
    DateTimeOffset ProjectedAt,
    LocalSyncState SyncState,
    bool IsDeleted);

public sealed record ReadQuery(
    string TableLogicalName,
    string? SearchText,
    IReadOnlyDictionary<string, object?> Filters,
    int PageSize,
    string? ContinuationToken);

public sealed record ReadPage(
    IReadOnlyList<ReadRecord> Records,
    string? ContinuationToken,
    long? TotalCount);

public interface IReadModelProvider
{
    ValueTask<ReadRecord?> RetrieveAsync(
        string tableLogicalName,
        Guid recordId,
        CancellationToken cancellationToken = default);

    ValueTask<ReadPage> QueryAsync(
        ReadQuery query,
        CancellationToken cancellationToken = default);
}

public sealed class CompositeReadModelProvider(
    IReadModelProvider local,
    IReadModelProvider? enterprise = null) : IReadModelProvider
{
    public async ValueTask<ReadRecord?> RetrieveAsync(
        string tableLogicalName,
        Guid recordId,
        CancellationToken cancellationToken = default)
    {
        var record = await local.RetrieveAsync(
            tableLogicalName,
            recordId,
            cancellationToken);
        if (record?.IsDeleted is true)
        {
            return null;
        }

        if (record is not null)
        {
            return record;
        }

        if (enterprise is null)
        {
            return null;
        }

        var projected = await enterprise.RetrieveAsync(
            tableLogicalName,
            recordId,
            cancellationToken);
        return projected?.IsDeleted is true ? null : projected;
    }

    public async ValueTask<ReadPage> QueryAsync(
        ReadQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        if (enterprise is null)
        {
            return await local.QueryAsync(query, cancellationToken);
        }

        var localPage = await local.QueryAsync(
            query with
            {
                PageSize = 500,
                ContinuationToken = null,
            },
            cancellationToken);
        var enterprisePage = await enterprise.QueryAsync(
            query,
            cancellationToken);
        var records = enterprisePage.Records.ToDictionary(
            record => record.RecordId);
        foreach (var localRecord in localPage.Records)
        {
            if (localRecord.IsDeleted)
            {
                records.Remove(localRecord.RecordId);
            }
            else
            {
                records[localRecord.RecordId] = localRecord;
            }
        }

        var merged = records.Values
            .OrderByDescending(record => record.ProjectedAt)
            .ThenBy(record => record.RecordId)
            .Take(query.PageSize)
            .ToArray();
        return new(
            merged,
            enterprisePage.ContinuationToken,
            enterprisePage.TotalCount);
    }
}
