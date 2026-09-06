using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;
using VerseOff.Storage;

namespace VerseOff.Sync.Tests;

[TestClass]
public sealed class EfPendingOperationSourceTests
{
    [TestMethod]
    public async Task SuccessfulPushClearsOutboxAndAppliesEtag()
    {
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<VerseOffDbContext>()
            .UseSqlite(connection)
            .Options;
        await using (var setup = new VerseOffDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync();
        }

        var factory = new TestDbContextFactory(options);
        var protector = Protector();
        var store = new LocalRecordStore(
            factory,
            TimeProvider.System,
            protector);
        var recordId = Guid.NewGuid();
        using var data = JsonDocument.Parse("""{"name":"Acme"}""");
        await store.SaveLocalAsync(
            "account",
            recordId,
            data,
            Guid.NewGuid(),
            "device",
            "security-v1",
            "correlation");
        var source = new EfPendingOperationSource(factory, protector);
        var coordinator = new SyncCoordinator(
            source,
            new SuccessfulGateway());

        var summary = await coordinator.PushAsync();

        Assert.AreEqual(1, summary.Attempted);
        Assert.AreEqual(1, summary.Succeeded);
        await using var verification = new VerseOffDbContext(options);
        Assert.IsEmpty(await verification.OutboxEntries.ToArrayAsync());
        var record = await verification.CachedRecords.SingleAsync();
        Assert.AreEqual(LocalSyncState.Synced, record.SyncState);
        Assert.AreEqual("W/\"version-1\"", record.Etag);
    }

    [TestMethod]
    public async Task ConcurrencyFailureMarksRecordAndOperationAsConflict()
    {
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<VerseOffDbContext>()
            .UseSqlite(connection)
            .Options;
        await using (var setup = new VerseOffDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync();
        }

        var factory = new TestDbContextFactory(options);
        var protector = Protector();
        var store = new LocalRecordStore(
            factory,
            TimeProvider.System,
            protector);
        using var data = JsonDocument.Parse("""{"name":"Acme"}""");
        await store.SaveLocalAsync(
            "account",
            Guid.NewGuid(),
            data,
            Guid.NewGuid(),
            "device",
            "security-v1",
            "correlation");
        var source = new EfPendingOperationSource(factory, protector);
        var operation = await FirstAsync(source.ReadPendingAsync());

        await source.ApplyResultAsync(new(
            operation.OperationId,
            Succeeded: false,
            Etag: null,
            StatusCode: 412,
            ErrorCode: "PreconditionFailed",
            ErrorMessage: "The Dataverse row has changed."));

        await using var verification = new VerseOffDbContext(options);
        var entry = await verification.OutboxEntries.SingleAsync();
        var record = await verification.CachedRecords.SingleAsync();
        Assert.AreEqual(LocalSyncState.Conflict, entry.State);
        Assert.AreEqual(LocalSyncState.Conflict, record.SyncState);
        Assert.AreEqual(1, entry.AttemptCount);
    }

    private static async Task<DataverseOperation> FirstAsync(
        IAsyncEnumerable<DataverseOperation> operations)
    {
        await foreach (var operation in operations)
        {
            return operation;
        }

        throw new InvalidOperationException("No pending operation was found.");
    }

    private sealed class SuccessfulGateway : IDataverseWriteGateway
    {
        public ValueTask<SyncResult> ExecuteAsync(
            DataverseOperation operation,
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult(new SyncResult(
                operation.OperationId,
                Succeeded: true,
                "W/\"version-1\"",
                StatusCode: 204,
                ErrorCode: null,
                ErrorMessage: null));
    }

    private sealed class TestDbContextFactory(
        DbContextOptions<VerseOffDbContext> options)
        : IDbContextFactory<VerseOffDbContext>
    {
        public VerseOffDbContext CreateDbContext() => new(options);
    }

    private static AesGcmLocalDataProtector Protector() =>
        new AesGcmLocalDataProtector(new byte[32]);
}
