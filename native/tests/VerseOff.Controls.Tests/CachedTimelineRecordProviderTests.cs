using System.Text.Json;
using VerseOff.Domain;
using VerseOff.ReadModel;
using VerseOff.Storage;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class CachedTimelineRecordProviderTests
{
    [TestMethod]
    public async Task QueryMapsCardProjectionAndFiltersUnreadableRecords()
    {
        var regardingId = Guid.NewGuid();
        var readableId = Guid.NewGuid();
        var unreadableId = Guid.NewGuid();
        var store = new StubTimelineCacheStore(
        [
            Record(
                readableId,
                regardingId,
                "email",
                """
                {
                  "subject": "Fallback subject",
                  "body": "Fallback body",
                  "cardHeaderTitle": "Projected title",
                  "cardHeaderSecondary": "Projected date",
                  "cardDetailsSubheading": "Customer",
                  "cardDetailsSummary": "Collapsed summary",
                  "cardDetailsExpanded": "Expanded details"
                }
                """),
            Record(unreadableId, regardingId, "task", """{"subject":"Hidden"}"""),
        ]);
        var provider = new CachedTimelineRecordProvider(
            store,
            new StubSecuritySnapshotProvider(
                Snapshot(
                    new TableAccessGrant(
                        "email",
                        AccessDepth.Organization,
                        AccessDepth.None,
                        AccessDepth.None,
                        AccessDepth.None,
                        new HashSet<string>(),
                        new HashSet<string>()))),
            TimeProvider.System);

        var page = await provider.QueryAsync(
            new(
                regardingId,
                "account",
                [TimelineModule.Activities],
                ["email"],
                null,
                TimelineSortDirection.NewestToOldest,
                TimelineRollupType.None,
                10,
                null));

        Assert.HasCount(1, page.Records);
        var record = page.Records[0];
        Assert.AreEqual("Projected title", record.CardProjection?.HeaderTitle);
        Assert.AreEqual("Projected date", record.CardProjection?.HeaderSecondary);
        Assert.AreEqual("Customer", record.CardProjection?.DetailsSubheading);
        Assert.AreEqual("Collapsed summary", record.CardProjection?.DetailsSummary);
        Assert.AreEqual("Expanded details", record.CardProjection?.DetailsExpanded);
    }

    [TestMethod]
    public async Task QueryFailsClosedWhenRelationshipRollupIsNotProvisioned()
    {
        var provider = new CachedTimelineRecordProvider(
            new StubTimelineCacheStore([]),
            new StubSecuritySnapshotProvider(Snapshot()),
            TimeProvider.System);

        await Assert.ThrowsExactlyAsync<InvalidOperationException>(
            () => provider.QueryAsync(
                new(
                    Guid.NewGuid(),
                    "account",
                    [TimelineModule.Activities],
                    [],
                    null,
                    TimelineSortDirection.NewestToOldest,
                    TimelineRollupType.Related,
                    10,
                    null)).AsTask());
    }

    private static TimelineRecordWrite Record(
        Guid recordId,
        Guid regardingId,
        string tableName,
        string payload) =>
        new(
            recordId,
            "account",
            regardingId,
            tableName,
            (int)TimelineRecordKind.Activity,
            JsonSerializer.Deserialize<JsonElement>(payload),
            DateTimeOffset.UtcNow,
            false,
            "security-v1",
            null,
            false,
            [],
            []);

    private static SecuritySnapshot Snapshot(
        params TableAccessGrant[] grants) =>
        new(
            "security-v1",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTimeOffset.UtcNow.AddMinutes(-1),
            DateTimeOffset.UtcNow.AddHours(1),
            grants);

    private sealed class StubTimelineCacheStore(
        IReadOnlyList<TimelineRecordWrite> records) : ITimelineCacheStore
    {
        public Task UpsertAsync(
            TimelineRecordWrite record,
            CancellationToken cancellationToken = default) =>
            Task.CompletedTask;

        public Task<IReadOnlyList<TimelineRecordWrite>> QueryAsync(
            string regardingTable,
            Guid regardingId,
            string securitySnapshotVersion,
            string? searchText,
            int maximumRecords,
            CancellationToken cancellationToken = default) =>
            Task.FromResult<IReadOnlyList<TimelineRecordWrite>>(
                records
                    .Where(record =>
                        record.RegardingId == regardingId
                        && !record.IsDeleted)
                    .ToArray());

        public Task<bool> SetPinnedAsync(
            Guid recordId,
            bool isPinned,
            string securitySnapshotVersion,
            CancellationToken cancellationToken = default) =>
            Task.FromResult(false);
    }

    private sealed class StubSecuritySnapshotProvider(
        SecuritySnapshot snapshot) : ISecuritySnapshotProvider
    {
        public SecuritySnapshot? GetCurrent() => snapshot;
    }
}
