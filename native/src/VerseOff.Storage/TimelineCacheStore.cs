using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace VerseOff.Storage;

public sealed record TimelinePartyWrite(
    int ParticipationTypeMask,
    Guid? PartyId,
    string? PartyLogicalName,
    string? UnresolvedPartyName,
    string? AddressUsed);

public sealed record TimelineAttachmentWrite(
    Guid AttachmentId,
    string FileName,
    string MimeType,
    long Size,
    string? Checksum,
    string? Etag,
    int TransferState,
    string? StorageReference);

public sealed record TimelineRecordWrite(
    Guid RecordId,
    string RegardingTable,
    Guid RegardingId,
    string TableLogicalName,
    int RecordKind,
    JsonElement Payload,
    DateTimeOffset SortDate,
    bool IsPinned,
    string SecuritySnapshotVersion,
    string? Etag,
    bool IsDeleted,
    IReadOnlyList<TimelinePartyWrite> Parties,
    IReadOnlyList<TimelineAttachmentWrite> Attachments);

public sealed record TimelineCacheItem(
    TimelineRecordWrite Record);

public interface ITimelineCacheStore
{
    Task UpsertAsync(
        TimelineRecordWrite record,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TimelineRecordWrite>> QueryAsync(
        string regardingTable,
        Guid regardingId,
        string securitySnapshotVersion,
        string? searchText,
        int maximumRecords,
        CancellationToken cancellationToken = default);
}

public sealed class TimelineCacheStore(
    IDbContextFactory<VerseOffDbContext> contextFactory,
    ILocalDataProtector dataProtector) : ITimelineCacheStore
{
    private const int MaximumScanRecords = 5000;

    public async Task UpsertAsync(
        TimelineRecordWrite record,
        CancellationToken cancellationToken = default)
    {
        Validate(record);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        await using var transaction =
            await context.Database.BeginTransactionAsync(cancellationToken);

        var entity = await context.TimelineRecords.SingleOrDefaultAsync(
            candidate => candidate.RecordId == record.RecordId,
            cancellationToken);
        if (entity is null)
        {
            entity = new()
            {
                RecordId = record.RecordId,
                RegardingTable = record.RegardingTable,
                RegardingId = record.RegardingId,
                TableLogicalName = record.TableLogicalName,
                RecordKind = record.RecordKind,
                ProtectedPayloadJson = string.Empty,
                SortDate = record.SortDate,
                SecuritySnapshotVersion = record.SecuritySnapshotVersion,
            };
            context.TimelineRecords.Add(entity);
        }

        entity.RegardingTable = record.RegardingTable;
        entity.RegardingId = record.RegardingId;
        entity.TableLogicalName = record.TableLogicalName;
        entity.RecordKind = record.RecordKind;
        entity.ProtectedPayloadJson = dataProtector.Protect(
            record.Payload.GetRawText(),
            LocalProtectionPurpose.TimelineRecord(record.RecordId));
        entity.SortDate = record.SortDate;
        entity.IsPinned = record.IsPinned;
        entity.SecuritySnapshotVersion = record.SecuritySnapshotVersion;
        entity.Etag = record.Etag;
        entity.IsDeleted = record.IsDeleted;

        var existingParties = await context.TimelineParties
            .Where(party => party.TimelineRecordId == record.RecordId)
            .ToListAsync(cancellationToken);
        context.TimelineParties.RemoveRange(existingParties);
        for (var index = 0; index < record.Parties.Count; index++)
        {
            var party = record.Parties[index];
            context.TimelineParties.Add(new()
            {
                TimelineRecordId = record.RecordId,
                PartyIndex = index,
                ParticipationTypeMask = party.ParticipationTypeMask,
                PartyId = party.PartyId,
                PartyLogicalName = party.PartyLogicalName,
                ProtectedDetailsJson = dataProtector.Protect(
                    JsonSerializer.Serialize(new
                    {
                        party.UnresolvedPartyName,
                        party.AddressUsed,
                    }),
                    LocalProtectionPurpose.TimelineParty(
                        record.RecordId,
                        index)),
            });
        }

        var existingAttachments = await context.TimelineAttachments
            .Where(attachment =>
                attachment.TimelineRecordId == record.RecordId)
            .ToListAsync(cancellationToken);
        context.TimelineAttachments.RemoveRange(existingAttachments);
        foreach (var attachment in record.Attachments)
        {
            context.TimelineAttachments.Add(new()
            {
                AttachmentId = attachment.AttachmentId,
                TimelineRecordId = record.RecordId,
                FileName = attachment.FileName,
                MimeType = attachment.MimeType,
                Size = attachment.Size,
                Checksum = attachment.Checksum,
                Etag = attachment.Etag,
                TransferState = attachment.TransferState,
                ProtectedStorageReference = dataProtector.Protect(
                    attachment.StorageReference ?? string.Empty,
                    LocalProtectionPurpose.TimelineAttachment(
                        attachment.AttachmentId)),
            });
        }

        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<TimelineRecordWrite>> QueryAsync(
        string regardingTable,
        Guid regardingId,
        string securitySnapshotVersion,
        string? searchText,
        int maximumRecords,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(regardingTable);
        ArgumentException.ThrowIfNullOrWhiteSpace(
            securitySnapshotVersion);
        ArgumentOutOfRangeException.ThrowIfLessThan(maximumRecords, 1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(
            maximumRecords,
            500);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var entities = await context.TimelineRecords
            .AsNoTracking()
            .Where(record =>
                record.RegardingTable == regardingTable
                && record.RegardingId == regardingId
                && record.SecuritySnapshotVersion
                    == securitySnapshotVersion
                && !record.IsDeleted)
            .OrderByDescending(record => record.SortDate)
            .Take(MaximumScanRecords)
            .ToListAsync(cancellationToken);
        var recordIds = entities
            .Select(entity => entity.RecordId)
            .ToArray();
        var parties = await context.TimelineParties
            .AsNoTracking()
            .Where(party => recordIds.Contains(party.TimelineRecordId))
            .ToListAsync(cancellationToken);
        var attachments = await context.TimelineAttachments
            .AsNoTracking()
            .Where(attachment =>
                recordIds.Contains(attachment.TimelineRecordId))
            .ToListAsync(cancellationToken);
        var results = new List<TimelineRecordWrite>();

        foreach (var entity in entities)
        {
            var payloadJson = dataProtector.Unprotect(
                entity.ProtectedPayloadJson,
                LocalProtectionPurpose.TimelineRecord(entity.RecordId));
            if (!string.IsNullOrWhiteSpace(searchText)
                && !payloadJson.Contains(
                    searchText,
                    StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            using var payload = JsonDocument.Parse(payloadJson);
            results.Add(new(
                entity.RecordId,
                entity.RegardingTable,
                entity.RegardingId,
                entity.TableLogicalName,
                entity.RecordKind,
                payload.RootElement.Clone(),
                entity.SortDate,
                entity.IsPinned,
                entity.SecuritySnapshotVersion,
                entity.Etag,
                entity.IsDeleted,
                parties
                    .Where(party =>
                        party.TimelineRecordId == entity.RecordId)
                    .OrderBy(party => party.PartyIndex)
                    .Select(ToParty)
                    .ToArray(),
                attachments
                    .Where(attachment =>
                        attachment.TimelineRecordId == entity.RecordId)
                    .Select(ToAttachment)
                    .ToArray()));
            if (results.Count >= maximumRecords)
            {
                break;
            }
        }

        return results;
    }

    private TimelinePartyWrite ToParty(TimelinePartyEntity entity)
    {
        var json = dataProtector.Unprotect(
            entity.ProtectedDetailsJson,
            LocalProtectionPurpose.TimelineParty(
                entity.TimelineRecordId,
                entity.PartyIndex));
        using var details = JsonDocument.Parse(json);
        return new(
            entity.ParticipationTypeMask,
            entity.PartyId,
            entity.PartyLogicalName,
            details.RootElement.TryGetProperty(
                "UnresolvedPartyName",
                out var name)
                    ? name.GetString()
                    : null,
            details.RootElement.TryGetProperty(
                "AddressUsed",
                out var address)
                    ? address.GetString()
                    : null);
    }

    private TimelineAttachmentWrite ToAttachment(
        TimelineAttachmentEntity entity) =>
        new(
            entity.AttachmentId,
            entity.FileName,
            entity.MimeType,
            entity.Size,
            entity.Checksum,
            entity.Etag,
            entity.TransferState,
            dataProtector.Unprotect(
                entity.ProtectedStorageReference,
                LocalProtectionPurpose.TimelineAttachment(
                    entity.AttachmentId)));

    private static void Validate(TimelineRecordWrite record)
    {
        ArgumentNullException.ThrowIfNull(record);
        if (record.RecordId == Guid.Empty
            || record.RegardingId == Guid.Empty
            || string.IsNullOrWhiteSpace(record.RegardingTable)
            || string.IsNullOrWhiteSpace(record.TableLogicalName)
            || string.IsNullOrWhiteSpace(
                record.SecuritySnapshotVersion)
            || record.Payload.ValueKind is not JsonValueKind.Object)
        {
            throw new ArgumentException(
                "Timeline record identity, security version, and object payload are required.",
                nameof(record));
        }
    }
}
