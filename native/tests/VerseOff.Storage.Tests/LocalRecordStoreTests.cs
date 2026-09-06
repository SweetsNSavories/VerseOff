using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;

namespace VerseOff.Storage.Tests;

[TestClass]
public sealed class LocalRecordStoreTests
{
    [TestMethod]
    public async Task EditingUnsyncedCreatePreservesPendingCreate()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
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
        using var first = JsonDocument.Parse("""{"name":"First"}""");
        using var second = JsonDocument.Parse("""{"name":"Second"}""");

        await store.SaveLocalAsync(
            "account",
            recordId,
            first,
            Guid.NewGuid(),
            "device",
            "security-v1",
            "correlation-1");
        await store.SaveLocalAsync(
            "account",
            recordId,
            second,
            Guid.NewGuid(),
            "device",
            "security-v1",
            "correlation-2");

        var stored = await store.RetrieveAsync("account", recordId);
        Assert.IsNotNull(stored);
        Assert.AreEqual(LocalSyncState.PendingCreate, stored.SyncState);
        StringAssert.Contains(stored.DataJson, "Second");
        await using var verification = new VerseOffDbContext(options);
        var outbox = await verification.OutboxEntries
            .AsNoTracking()
            .ToArrayAsync();
        Assert.HasCount(1, outbox);
        Assert.AreEqual(
            DataverseOperationType.Create,
            outbox[0].OperationType);
        Assert.IsFalse(outbox[0].PayloadJson.Contains(
            "Second",
            StringComparison.Ordinal));
        StringAssert.Contains(
            protector.Unprotect(
                outbox[0].PayloadJson,
                LocalProtectionPurpose.Outbox(outbox[0].OperationId)),
            "Second");
    }

    [TestMethod]
    public async Task DeletingUnsyncedCreateRemovesRecordAndOutbox()
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

        var store = new LocalRecordStore(
            new TestDbContextFactory(options),
            TimeProvider.System,
            Protector());
        var recordId = Guid.NewGuid();
        using var data = JsonDocument.Parse("""{"name":"Draft"}""");
        await store.SaveLocalAsync(
            "account",
            recordId,
            data,
            Guid.NewGuid(),
            "device",
            "security-v1",
            "correlation");

        var deleted = await store.DeleteLocalAsync(
            "account",
            recordId,
            Guid.NewGuid(),
            "device",
            "delete-correlation");

        Assert.IsTrue(deleted);
        Assert.IsNull(await store.RetrieveAsync("account", recordId));
        await using var verification = new VerseOffDbContext(options);
        Assert.IsEmpty(await verification.OutboxEntries.ToArrayAsync());
    }

    [TestMethod]
    public async Task ServerChangeUpdatesSyncedRecordWithoutOutbox()
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

        var store = new LocalRecordStore(
            new TestDbContextFactory(options),
            TimeProvider.System,
            Protector());
        var recordId = Guid.NewGuid();
        using var payload = JsonDocument.Parse("""{"name":"Server"}""");

        await store.ApplyServerChangeAsync(
            new(
                "account",
                recordId,
                payload.RootElement.Clone(),
                "W/\"server-1\"",
                IsDeleted: false),
            "security-v2");

        var record = await store.RetrieveAsync("account", recordId);
        Assert.IsNotNull(record);
        Assert.AreEqual(LocalSyncState.Synced, record.SyncState);
        Assert.AreEqual("W/\"server-1\"", record.Etag);
        StringAssert.Contains(record.DataJson, "Server");
        await using var verification = new VerseOffDbContext(options);
        Assert.IsEmpty(await verification.OutboxEntries.ToArrayAsync());
    }

    [TestMethod]
    public async Task ServerChangeDoesNotOverwritePendingLocalWrite()
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

        var store = new LocalRecordStore(
            new TestDbContextFactory(options),
            TimeProvider.System,
            Protector());
        var recordId = Guid.NewGuid();
        using var local = JsonDocument.Parse("""{"name":"Local"}""");
        using var server = JsonDocument.Parse("""{"name":"Server"}""");
        await store.SaveLocalAsync(
            "account",
            recordId,
            local,
            Guid.NewGuid(),
            "device",
            "security-v1",
            "correlation");

        await store.ApplyServerChangeAsync(
            new(
                "account",
                recordId,
                server.RootElement.Clone(),
                "W/\"server-1\"",
                IsDeleted: false),
            "security-v2");

        var record = await store.RetrieveAsync("account", recordId);
        Assert.IsNotNull(record);
        Assert.AreEqual(LocalSyncState.Conflict, record.SyncState);
        StringAssert.Contains(record.DataJson, "Local");
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
