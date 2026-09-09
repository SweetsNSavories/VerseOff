using System.Text.Json;
using VerseOff.Domain;
using VerseOff.Storage;

namespace VerseOff.Controls;

public sealed class LocalTimelineActionSink(
    ILocalRecordStore localRecordStore,
    ITimelineCacheStore timelineCacheStore,
    Guid userObjectId,
    string deviceId,
    string securitySnapshotVersion) : ITimelineActionSink
{
    public async ValueTask<TimelineActionResult> ExecuteAsync(
        TimelineAction action,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(action);
        ArgumentOutOfRangeException.ThrowIfEqual(userObjectId, Guid.Empty);
        ArgumentException.ThrowIfNullOrWhiteSpace(deviceId);
        ArgumentException.ThrowIfNullOrWhiteSpace(securitySnapshotVersion);

        return action.Kind switch
        {
            TimelineActionKind.CreateNote =>
                await CreateRecordAsync(
                    action,
                    "annotation",
                    TimelineRecordKind.Note,
                    cancellationToken),
            TimelineActionKind.CreatePost =>
                await CreateRecordAsync(
                    action,
                    "post",
                    TimelineRecordKind.Post,
                    cancellationToken),
            TimelineActionKind.SetPinned =>
                await SetPinnedAsync(action, cancellationToken),
            _ => new(false, "The Timeline action is not supported offline."),
        };
    }

    private async ValueTask<TimelineActionResult> CreateRecordAsync(
        TimelineAction action,
        string tableLogicalName,
        TimelineRecordKind kind,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(action.Body)
            || (kind == TimelineRecordKind.Note
                && string.IsNullOrWhiteSpace(action.Subject)))
        {
            return new(false, "Timeline record content is required.");
        }

        var recordId = Guid.NewGuid();
        var payload = JsonSerializer.SerializeToDocument(new
        {
            subject = action.Subject,
            body = action.Body,
            regardingobjectid = action.RegardingId,
            regardingobjecttypecode = action.RegardingTable,
        });
        var correlationId = Guid.NewGuid().ToString("D");
        await localRecordStore.SaveLocalAsync(
            tableLogicalName,
            recordId,
            payload,
            userObjectId,
            deviceId,
            securitySnapshotVersion,
            correlationId,
            cancellationToken);
        await timelineCacheStore.UpsertAsync(
            new(
                recordId,
                action.RegardingTable,
                action.RegardingId,
                tableLogicalName,
                (int)kind,
                payload.RootElement.Clone(),
                DateTimeOffset.UtcNow,
                false,
                securitySnapshotVersion,
                null,
                false,
                [],
                []),
            cancellationToken);
        return new(true, RecordId: recordId);
    }

    private async ValueTask<TimelineActionResult> SetPinnedAsync(
        TimelineAction action,
        CancellationToken cancellationToken)
    {
        if (!action.RecordId.HasValue || !action.IsPinned.HasValue)
        {
            return new(false, "A Timeline record and pin state are required.");
        }

        var updated = await timelineCacheStore.SetPinnedAsync(
            action.RecordId.Value,
            action.IsPinned.Value,
            securitySnapshotVersion,
            cancellationToken);
        return updated
            ? new(true, RecordId: action.RecordId)
            : new(false, "The Timeline record is unavailable or no longer readable.");
    }
}
