using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace VerseOff.Storage.Tests;

[TestClass]
public sealed class SyncCursorStoreTests
{
    [TestMethod]
    public async Task StoresDeltaLinkEncryptedAndRetrievesByScope()
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

        var store = new SyncCursorStore(
            new TestDbContextFactory(options),
            new AesGcmLocalDataProtector(
                Enumerable.Range(1, 32)
                    .Select(value => (byte)value)
                    .ToArray()),
            TimeProvider.System);
        const string delta =
            "https://example.crm.dynamics.com/api/data/v9.2/accounts?$deltatoken=opaque";

        await store.SetAsync("app:user:profile", "account", delta);
        var loaded = await store.GetAsync(
            "app:user:profile",
            "account");

        Assert.AreEqual(delta, loaded);
        await using var verification = new VerseOffDbContext(options);
        var entity = await verification.SyncCursors.SingleAsync();
        Assert.IsFalse(entity.ProtectedDeltaLink.Contains(
            "deltatoken",
            StringComparison.Ordinal));
    }

    private sealed class TestDbContextFactory(
        DbContextOptions<VerseOffDbContext> options)
        : IDbContextFactory<VerseOffDbContext>
    {
        public VerseOffDbContext CreateDbContext() => new(options);
    }
}
