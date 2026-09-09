using System.Globalization;
using System.Security;
using System.Text;
using System.Text.Json;
using VerseOff.Domain;
using VerseOff.ReadModel;
using VerseOff.Storage;

namespace VerseOff.Controls;

public sealed class CachedTimelineRecordProvider(
    ITimelineCacheStore cacheStore,
    ISecuritySnapshotProvider securitySnapshotProvider,
    TimeProvider timeProvider) : ITimelineRecordProvider
{
    public async ValueTask<TimelinePage> QueryAsync(
        TimelineQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);
        if (query.RollupType is not TimelineRollupType.None)
        {
            throw new InvalidOperationException(
                "Timeline relationship rollup is unavailable until its exact security-trimmed relationship graph is provisioned.");
        }

        var snapshot = securitySnapshotProvider.GetCurrent()
            ?? throw new SecurityException(
                "No Timeline security snapshot is available.");
        if (!snapshot.IsValidAt(timeProvider.GetUtcNow()))
        {
            throw new SecurityException(
                "The Timeline security snapshot is expired.");
        }

        ArgumentOutOfRangeException.ThrowIfLessThan(query.PageSize, 1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(query.PageSize, 50);
        var offset = DecodeOffset(query.ContinuationToken);
        var cached = await cacheStore.QueryAsync(
            query.RegardingTable,
            query.RegardingId,
            snapshot.Version,
            query.SearchText,
            maximumRecords: 500,
            cancellationToken);
        var records = cached
            .Where(record => CanRead(snapshot, record.TableLogicalName))
            .Where(record => Included(query, record))
            .Select(ToTimelineRecord);
        records = query.SortDirection
            is TimelineSortDirection.NewestToOldest
                ? records.OrderByDescending(record => record.SortDate)
                : records.OrderBy(record => record.SortDate);
        var materialized = records.ToArray();
        var page = materialized
            .Skip(offset)
            .Take(query.PageSize)
            .ToArray();
        var nextOffset = offset + page.Length;
        return new(
            page,
            nextOffset < materialized.Length
                ? EncodeOffset(nextOffset)
                : null);
    }

    private static bool CanRead(
        SecuritySnapshot snapshot,
        string tableLogicalName) =>
        snapshot.FindTable(tableLogicalName)?.ReadDepth
            is not null and not AccessDepth.None;

    private static bool Included(
        TimelineQuery query,
        TimelineRecordWrite record)
    {
        var kind = (TimelineRecordKind)record.RecordKind;
        return kind switch
        {
            TimelineRecordKind.Activity =>
                query.Modules.Contains(TimelineModule.Activities)
                && (query.ActivityTypes.Count == 0
                    || query.ActivityTypes.Contains(
                        record.TableLogicalName,
                        StringComparer.OrdinalIgnoreCase)),
            TimelineRecordKind.Note =>
                query.Modules.Contains(TimelineModule.Notes),
            TimelineRecordKind.Post =>
                query.Modules.Contains(TimelineModule.Posts),
            _ => true,
        };
    }

    private static TimelineRecord ToTimelineRecord(
        TimelineRecordWrite record) =>
        new(
            record.RecordId,
            record.TableLogicalName,
            (TimelineRecordKind)record.RecordKind,
            Text(record.Payload, "subject")
                ?? Text(record.Payload, "title")
                ?? record.TableLogicalName,
            Text(record.Payload, "body")
                ?? Text(record.Payload, "description")
                ?? Text(record.Payload, "notetext"),
            record.SortDate,
            Text(record.Payload, "statusLabel")
                ?? Text(record.Payload, "statuscode"),
            Text(record.Payload, "ownerDisplayName"),
            record.IsPinned,
            record.Parties.Select(party => new TimelineParty(
                party.ParticipationTypeMask,
                party.PartyId,
                party.PartyLogicalName,
                party.UnresolvedPartyName,
                party.AddressUsed)).ToArray(),
            record.Attachments.Select(attachment => new TimelineAttachment(
                attachment.AttachmentId,
                attachment.FileName,
                attachment.MimeType,
                attachment.Size,
                attachment.Checksum,
                attachment.Etag,
                (TimelineAttachmentTransferState)
                    attachment.TransferState)).ToArray(),
            record.SecuritySnapshotVersion,
            record.Etag)
        {
            CardProjection = CardProjection(record.Payload),
        };

    private static TimelineCardProjection? CardProjection(JsonElement payload)
    {
        var projection = new TimelineCardProjection(
            Text(payload, "cardHeaderTitle")
                ?? Text(payload, "headerTitle"),
            Text(payload, "cardHeaderSecondary")
                ?? Text(payload, "headerSecondary"),
            Text(payload, "cardDetailsSubheading")
                ?? Text(payload, "detailsSubheading"),
            Text(payload, "cardDetailsSummary")
                ?? Text(payload, "detailsSummary"),
            Text(payload, "cardDetailsExpanded")
                ?? Text(payload, "detailsExpanded"));

        return projection.HeaderTitle is not null
            || projection.HeaderSecondary is not null
            || projection.DetailsSubheading is not null
            || projection.DetailsSummary is not null
            || projection.DetailsExpanded is not null
            ? projection
            : null;
    }

    private static string? Text(JsonElement payload, string name)
    {
        foreach (var property in payload.EnumerateObject())
        {
            if (string.Equals(
                    property.Name,
                    name,
                    StringComparison.OrdinalIgnoreCase))
            {
                return property.Value.ToString();
            }
        }

        return null;
    }

    private static string EncodeOffset(int offset) =>
        Convert.ToBase64String(
            Encoding.UTF8.GetBytes(
                offset.ToString(CultureInfo.InvariantCulture)));

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
            if (int.TryParse(
                    value,
                    NumberStyles.None,
                    CultureInfo.InvariantCulture,
                    out var offset)
                && offset is >= 0 and <= 500)
            {
                return offset;
            }
        }
        catch (FormatException exception)
        {
            throw new InvalidDataException(
                "The Timeline continuation token is invalid.",
                exception);
        }

        throw new InvalidDataException(
            "The Timeline continuation token is invalid.");
    }
}
