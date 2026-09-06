using System.Security.Cryptography;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;

namespace VerseOff.Storage.Tests;

[TestClass]
public sealed class EntitlementLeaseStoreTests
{
    [TestMethod]
    public async Task StoresEncryptedLeaseAndReturnsOnlyVerifiedScope()
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

        using var key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        var now = DateTimeOffset.UtcNow;
        var lease = SignedLease(key, now);
        var store = new EntitlementLeaseStore(
            new TestDbContextFactory(options),
            Protector(),
            new EcdsaEntitlementLeaseVerifier(
                new Dictionary<string, string>
                {
                    [lease.SigningKeyId] =
                        key.ExportSubjectPublicKeyInfoPem(),
                }),
            new FixedTimeProvider(now));

        await store.StoreAsync(lease);
        var loaded = await store.GetValidAsync(
            lease.TenantId,
            lease.UserObjectId,
            lease.DeviceId,
            lease.AppModuleId,
            now);

        Assert.IsNotNull(loaded);
        Assert.AreEqual(lease.LeaseId, loaded.LeaseId);
        await using var verification = new VerseOffDbContext(options);
        var entity = await verification.EntitlementLeases.SingleAsync();
        Assert.IsFalse(entity.PayloadJson.Contains(
            lease.DeviceId,
            StringComparison.Ordinal));
    }

    [TestMethod]
    public async Task TamperedStoredLeaseFailsClosed()
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

        using var key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        var now = DateTimeOffset.UtcNow;
        var lease = SignedLease(key, now);
        var store = new EntitlementLeaseStore(
            new TestDbContextFactory(options),
            Protector(),
            new EcdsaEntitlementLeaseVerifier(
                new Dictionary<string, string>
                {
                    [lease.SigningKeyId] =
                        key.ExportSubjectPublicKeyInfoPem(),
                }),
            new FixedTimeProvider(now));
        await store.StoreAsync(lease);
        await using (var tamper = new VerseOffDbContext(options))
        {
            var entity = await tamper.EntitlementLeases.SingleAsync();
            var envelope = Convert.FromBase64String(entity.PayloadJson[4..]);
            envelope[^1] ^= 1;
            entity.PayloadJson = "vo1:" + Convert.ToBase64String(envelope);
            await tamper.SaveChangesAsync();
        }

        await Assert.ThrowsExactlyAsync<
            AuthenticationTagMismatchException>(
            () => store.GetValidAsync(
                lease.TenantId,
                lease.UserObjectId,
                lease.DeviceId,
                lease.AppModuleId,
                now));
    }

    private static OfflineEntitlementLease SignedLease(
        ECDsa key,
        DateTimeOffset now) =>
        EntitlementLeaseCryptography.Sign(
            new(
                Guid.NewGuid(),
                Guid.NewGuid(),
                Guid.NewGuid(),
                "managed-device",
                Guid.NewGuid(),
                new Uri("https://example.crm.dynamics.com"),
                Guid.NewGuid(),
                Guid.NewGuid(),
                new string('a', 64),
                "security-v1",
                now,
                now.AddDays(7),
                ["read", "write"],
                "https://gateway.example.test",
                "key-1",
                []),
            key);

    private static AesGcmLocalDataProtector Protector() =>
        new(Enumerable.Range(1, 32)
            .Select(value => (byte)value)
            .ToArray());

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
}
