using System.Text.Json;
using VerseOff.Domain;
using VerseOff.Storage;

namespace VerseOff.Sync.Tests;

[TestClass]
public sealed class PullCoordinatorTests
{
    [TestMethod]
    public async Task PullsPagedChangesAndReturnsFinalDeltaLink()
    {
        var firstId = Guid.NewGuid();
        var secondId = Guid.NewGuid();
        var gateway = new QueueChangeGateway(
            new(
                [Change(firstId, deleted: false)],
                NextLink: "next",
                DeltaLink: null),
            new(
                [Change(secondId, deleted: true)],
                NextLink: null,
                DeltaLink: "delta"));
        var store = new RecordingStore();
        var cursorStore = new RecordingCursorStore();
        var coordinator = new PullCoordinator(
            gateway,
            store,
            cursorStore);

        var summary = await coordinator.PullAsync(new(
            "account",
            "security-v2",
            DeltaLink: null));

        Assert.AreEqual(2, summary.Pages);
        Assert.AreEqual(1, summary.Upserts);
        Assert.AreEqual(1, summary.Deletes);
        Assert.AreEqual("delta", summary.DeltaLink);
        Assert.HasCount(2, store.Changes);
        Assert.AreEqual("security-v2", store.SecurityVersions[0]);
        Assert.AreEqual("delta", cursorStore.DeltaLink);
        CollectionAssert.AreEqual(
            new string?[] { null, "next" },
            gateway.Links.ToArray());
    }

    [TestMethod]
    public async Task MissingDeltaLinkFailsClosedAtPageLimit()
    {
        var gateway = new QueueChangeGateway(new DataverseChangePage(
            [],
            NextLink: "next",
            DeltaLink: null));
        var coordinator = new PullCoordinator(
            gateway,
            new RecordingStore());

        await Assert.ThrowsExactlyAsync<InvalidDataException>(
            () => coordinator.PullAsync(new(
                    "account",
                    "security-v1",
                    DeltaLink: null,
                    MaximumPages: 2))
                .AsTask());
    }

    private static DataverseChange Change(Guid id, bool deleted)
    {
        using var payload = JsonDocument.Parse(
            $$"""{"accountid":"{{id:D}}","name":"Acme"}""");
        return new(
            "account",
            id,
            payload.RootElement.Clone(),
            "W/\"1\"",
            deleted);
    }

    private sealed class QueueChangeGateway(
        params DataverseChangePage[] pages) : IDataverseChangeGateway
    {
        private int index;

        public List<string?> Links { get; } = [];

        public ValueTask<DataverseChangePage> ReadChangesAsync(
            string tableLogicalName,
            string? pageOrDeltaLink,
            CancellationToken cancellationToken = default)
        {
            Links.Add(pageOrDeltaLink);
            var page = pages[Math.Min(index, pages.Length - 1)];
            index++;
            return ValueTask.FromResult(page);
        }
    }

    private sealed class RecordingStore : ILocalRecordStore
    {
        public List<DataverseChange> Changes { get; } = [];

        public List<string> SecurityVersions { get; } = [];

        public Task ApplyServerChangeAsync(
            DataverseChange change,
            string securitySnapshotVersion,
            CancellationToken cancellationToken = default)
        {
            Changes.Add(change);
            SecurityVersions.Add(securitySnapshotVersion);
            return Task.CompletedTask;
        }

        public Task<CachedRecordEntity?> RetrieveAsync(
            string tableLogicalName,
            Guid recordId,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public Task<CachedRecordEntity> SaveLocalAsync(
            string tableLogicalName,
            Guid recordId,
            JsonDocument data,
            Guid userObjectId,
            string deviceId,
            string securitySnapshotVersion,
            string correlationId,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public Task<bool> DeleteLocalAsync(
            string tableLogicalName,
            Guid recordId,
            Guid userObjectId,
            string deviceId,
            string correlationId,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();
    }

    private sealed class RecordingCursorStore : ISyncCursorStore
    {
        public string? DeltaLink { get; private set; }

        public Task<string?> GetAsync(
            string scope,
            string tableLogicalName,
            CancellationToken cancellationToken = default) =>
            Task.FromResult<string?>(null);

        public Task SetAsync(
            string scope,
            string tableLogicalName,
            string deltaLink,
            CancellationToken cancellationToken = default)
        {
            DeltaLink = deltaLink;
            return Task.CompletedTask;
        }
    }
}
