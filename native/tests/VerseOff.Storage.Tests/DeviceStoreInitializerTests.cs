using Microsoft.EntityFrameworkCore;

namespace VerseOff.Storage.Tests;

[TestClass]
public sealed class DeviceStoreInitializerTests
{
    [TestMethod]
    public async Task AppliesInitialMigrationToEmptyDeviceDatabase()
    {
        var databasePath = Path.Combine(
            Path.GetTempPath(),
            $"verseoff-storage-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<VerseOffDbContext>()
                .UseSqlite($"Data Source={databasePath}")
                .Options;
            var factory = new TestDbContextFactory(options);
            var initializer = new DeviceStoreInitializer(factory);

            await initializer.InitializeAsync();

            await using var context = new VerseOffDbContext(options);
            var migrations = await context.Database
                .GetAppliedMigrationsAsync();
            CollectionAssert.Contains(
                migrations.ToArray(),
                "20260906205536_InitialDeviceStore");
            CollectionAssert.Contains(
                migrations.ToArray(),
                "20260906210521_AddTimelineCache");
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(databasePath))
            {
                File.Delete(databasePath);
            }
        }
    }

    private sealed class TestDbContextFactory(
        DbContextOptions<VerseOffDbContext> options)
        : IDbContextFactory<VerseOffDbContext>
    {
        public VerseOffDbContext CreateDbContext() => new(options);
    }
}
