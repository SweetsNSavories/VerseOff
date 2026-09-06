using System.Text.Json;
using VerseOff.ClientApi;
using VerseOff.Domain;
using VerseOff.ReadModel;
using VerseOff.Storage;

namespace VerseOff.Sync.Tests;

[TestClass]
public sealed class LocalXrmWebApiServiceTests
{
    [TestMethod]
    public async Task CreateWritesEncryptedStoreBoundaryContext()
    {
        var store = new RecordingRecordStore();
        var context = new XrmOperationContext(
            Guid.NewGuid(),
            "device-1",
            "security-v1");
        var service = new LocalXrmWebApiService(
            store,
            new StubReadModelProvider(),
            new FixedOperationContextProvider(context),
            new HashSet<string>(["account"]));
        var request = Request(
            "createRecord",
            new
            {
                entityLogicalName = "account",
                data = new
                {
                    name = "Acme",
                },
            });

        var result = await service.ExecuteAsync(request);

        Assert.AreEqual("account", result.GetProperty("entityType").GetString());
        Assert.AreEqual(context.UserObjectId, store.UserObjectId);
        Assert.AreEqual(context.DeviceId, store.DeviceId);
        Assert.AreEqual(
            context.SecuritySnapshotVersion,
            store.SecuritySnapshotVersion);
        Assert.AreEqual("Acme", store.Data?.RootElement
            .GetProperty("name")
            .GetString());
    }

    [TestMethod]
    public async Task UnsupportedODataOptionFailsExplicitly()
    {
        var service = new LocalXrmWebApiService(
            new RecordingRecordStore(),
            new StubReadModelProvider(),
            new FixedOperationContextProvider(new(
                Guid.NewGuid(),
                "device",
                "security-v1")),
            new HashSet<string>(["account"]));
        var request = Request(
            "retrieveMultipleRecords",
            new
            {
                entityLogicalName = "account",
                options = "?$expand=primarycontactid",
            });

        await Assert.ThrowsExactlyAsync<
            ClientApiOperationUnavailableException>(
            () => service.ExecuteAsync(request).AsTask());
    }

    private static XrmHostRequest Request(
        string operation,
        object arguments) =>
        new(
            operation,
            JsonSerializer.SerializeToElement(arguments));

    private sealed class FixedOperationContextProvider(
        XrmOperationContext context) : IXrmOperationContextProvider
    {
        public XrmOperationContext GetCurrent() => context;
    }

    private sealed class RecordingRecordStore : ILocalRecordStore
    {
        public JsonDocument? Data { get; private set; }

        public Guid UserObjectId { get; private set; }

        public string? DeviceId { get; private set; }

        public string? SecuritySnapshotVersion { get; private set; }

        public Task<CachedRecordEntity?> RetrieveAsync(
            string tableLogicalName,
            Guid recordId,
            CancellationToken cancellationToken = default) =>
            Task.FromResult<CachedRecordEntity?>(null);

        public Task<CachedRecordEntity> SaveLocalAsync(
            string tableLogicalName,
            Guid recordId,
            JsonDocument data,
            Guid userObjectId,
            string deviceId,
            string securitySnapshotVersion,
            string correlationId,
            CancellationToken cancellationToken = default)
        {
            Data?.Dispose();
            Data = JsonDocument.Parse(data.RootElement.GetRawText());
            UserObjectId = userObjectId;
            DeviceId = deviceId;
            SecuritySnapshotVersion = securitySnapshotVersion;
            return Task.FromResult(new CachedRecordEntity
            {
                TableLogicalName = tableLogicalName,
                RecordId = recordId,
                DataJson = data.RootElement.GetRawText(),
                SecuritySnapshotVersion = securitySnapshotVersion,
            });
        }

        public Task<bool> DeleteLocalAsync(
            string tableLogicalName,
            Guid recordId,
            Guid userObjectId,
            string deviceId,
            string correlationId,
            CancellationToken cancellationToken = default) =>
            Task.FromResult(true);

        public Task ApplyServerChangeAsync(
            DataverseChange change,
            string securitySnapshotVersion,
            CancellationToken cancellationToken = default) =>
            Task.CompletedTask;
    }

    private sealed class StubReadModelProvider : IReadModelProvider
    {
        public ValueTask<ReadRecord?> RetrieveAsync(
            string tableLogicalName,
            Guid recordId,
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult<ReadRecord?>(null);

        public ValueTask<ReadPage> QueryAsync(
            ReadQuery query,
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult(new ReadPage([], null, 0));
    }
}
