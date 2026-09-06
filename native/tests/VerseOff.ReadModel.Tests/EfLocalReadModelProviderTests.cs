using System.Security;
using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;
using VerseOff.Storage;

namespace VerseOff.ReadModel.Tests;

[TestClass]
public sealed class EfLocalReadModelProviderTests
{
    [TestMethod]
    public async Task LocalReadProjectsOnlySecurityAllowedColumns()
    {
        var now = DateTimeOffset.UtcNow;
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<VerseOffDbContext>()
            .UseSqlite(connection)
            .Options;
        var protector = Protector();
        var recordId = Guid.NewGuid();
        await using (var setup = new VerseOffDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync();
            setup.CachedRecords.Add(new()
            {
                TableLogicalName = "account",
                RecordId = recordId,
                DataJson = protector.Protect(
                    """{"name":"Acme","secret":"hidden"}""",
                    LocalProtectionPurpose.Record("account", recordId)),
                SecuritySnapshotVersion = "security-v1",
                SyncState = LocalSyncState.Synced,
                ModifiedAt = now,
            });
            await setup.SaveChangesAsync();
        }

        var provider = new EfLocalReadModelProvider(
            new TestDbContextFactory(options),
            new TestSecuritySnapshotProvider(Snapshot(now)),
            new FixedTimeProvider(now),
            protector);

        var page = await provider.QueryAsync(new(
            "account",
            SearchText: null,
            new Dictionary<string, object?>(),
            PageSize: 25,
            ContinuationToken: null));

        Assert.HasCount(1, page.Records);
        Assert.AreEqual(
            "Acme",
            page.Records[0].Data.GetProperty("name").GetString());
        Assert.IsFalse(page.Records[0].Data.TryGetProperty(
            "secret",
            out _));
    }

    [TestMethod]
    public async Task RecordFromDifferentSecuritySnapshotFailsClosed()
    {
        var now = DateTimeOffset.UtcNow;
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<VerseOffDbContext>()
            .UseSqlite(connection)
            .Options;
        var recordId = Guid.NewGuid();
        var protector = Protector();
        await using (var setup = new VerseOffDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync();
            setup.CachedRecords.Add(new()
            {
                TableLogicalName = "account",
                RecordId = recordId,
                DataJson = protector.Protect(
                    """{"name":"Acme"}""",
                    LocalProtectionPurpose.Record("account", recordId)),
                SecuritySnapshotVersion = "old-security",
                SyncState = LocalSyncState.Synced,
                ModifiedAt = now,
            });
            await setup.SaveChangesAsync();
        }

        var provider = new EfLocalReadModelProvider(
            new TestDbContextFactory(options),
            new TestSecuritySnapshotProvider(Snapshot(now)),
            new FixedTimeProvider(now),
            protector);

        await Assert.ThrowsExactlyAsync<SecurityException>(
            () => provider.RetrieveAsync("account", recordId).AsTask());
    }

    [TestMethod]
    public async Task PendingDeleteSuppressesStaleEnterpriseRecord()
    {
        var recordId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        var tombstone = Record(
            recordId,
            now,
            LocalSyncState.PendingDelete,
            isDeleted: true);
        var stale = Record(
            recordId,
            now.AddMinutes(-1),
            LocalSyncState.Synced,
            isDeleted: false);
        var provider = new CompositeReadModelProvider(
            new StubProvider(tombstone),
            new StubProvider(stale));

        var retrieved = await provider.RetrieveAsync(
            "account",
            recordId);
        var page = await provider.QueryAsync(new(
            "account",
            null,
            new Dictionary<string, object?>(),
            25,
            null));

        Assert.IsNull(retrieved);
        Assert.IsEmpty(page.Records);
    }

    [TestMethod]
    public void SqlConnectionFactoryRejectsUnencryptedOrUntrustedTls()
    {
        Assert.ThrowsExactly<ArgumentException>(
            () => new MicrosoftSqlConnectionFactory(
                "Server=sql.example.test;Database=VerseOff;Integrated Security=true;Encrypt=false"));
        Assert.ThrowsExactly<ArgumentException>(
            () => new MicrosoftSqlConnectionFactory(
                "Server=sql.example.test;Database=VerseOff;Integrated Security=true;Encrypt=true;TrustServerCertificate=true"));
    }

    [TestMethod]
    public void SqlConnectionFactoryAcceptsEncryptedTrustedConfiguration()
    {
        var factory = new MicrosoftSqlConnectionFactory(
            "Server=sql.example.test;Database=VerseOff;Integrated Security=true;Encrypt=true;TrustServerCertificate=false");

        using var connection = factory.CreateConnection();

        Assert.IsFalse(string.IsNullOrWhiteSpace(connection.ConnectionString));
    }

    private static SecuritySnapshot Snapshot(DateTimeOffset now) => new(
        "security-v1",
        Guid.NewGuid(),
        Guid.NewGuid(),
        Guid.NewGuid(),
        now.AddMinutes(-1),
        now.AddHours(1),
        [
            new(
                "account",
                AccessDepth.Organization,
                AccessDepth.Organization,
                AccessDepth.Organization,
                AccessDepth.Organization,
                new HashSet<string>(
                    ["name"],
                    StringComparer.OrdinalIgnoreCase),
                new HashSet<string>(
                    ["name"],
                    StringComparer.OrdinalIgnoreCase)),
        ]);

    private static ReadRecord Record(
        Guid recordId,
        DateTimeOffset projectedAt,
        LocalSyncState syncState,
        bool isDeleted)
    {
        using var document = JsonDocument.Parse("""{"name":"Acme"}""");
        return new(
            "account",
            recordId,
            document.RootElement.Clone(),
            "security-v1",
            projectedAt,
            syncState,
            isDeleted);
    }

    private sealed class StubProvider(ReadRecord record) : IReadModelProvider
    {
        public ValueTask<ReadRecord?> RetrieveAsync(
            string tableLogicalName,
            Guid recordId,
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult<ReadRecord?>(
                record.RecordId == recordId ? record : null);

        public ValueTask<ReadPage> QueryAsync(
            ReadQuery query,
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult(new ReadPage([record], null, 1));
    }

    private sealed class TestSecuritySnapshotProvider(
        SecuritySnapshot snapshot) : ISecuritySnapshotProvider
    {
        public SecuritySnapshot? GetCurrent() => snapshot;
    }

    private sealed class FixedTimeProvider(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
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
