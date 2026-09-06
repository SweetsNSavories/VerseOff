using System.Security;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;

namespace VerseOff.Storage;

public interface IEntitlementLeaseVerifier
{
    EntitlementValidationResult Verify(
        OfflineEntitlementLease lease,
        DateTimeOffset now);
}

public sealed class EcdsaEntitlementLeaseVerifier
    : IEntitlementLeaseVerifier
{
    private readonly Dictionary<string, string> publicKeys;

    public EcdsaEntitlementLeaseVerifier(
        IReadOnlyDictionary<string, string> publicKeys)
    {
        ArgumentNullException.ThrowIfNull(publicKeys);
        this.publicKeys = new(
            publicKeys,
            StringComparer.Ordinal);
        if (this.publicKeys.Count == 0)
        {
            throw new ArgumentException(
                "At least one entitlement public key is required.",
                nameof(publicKeys));
        }
    }

    public EntitlementValidationResult Verify(
        OfflineEntitlementLease lease,
        DateTimeOffset now)
    {
        ArgumentNullException.ThrowIfNull(lease);
        if (!publicKeys.TryGetValue(
                lease.SigningKeyId,
                out var publicKeyPem))
        {
            return new(
                false,
                $"Entitlement signing key '{lease.SigningKeyId}' is not trusted.");
        }

        using var key = ECDsa.Create();
        key.ImportFromPem(publicKeyPem);
        return EntitlementLeaseCryptography.Verify(lease, key, now);
    }
}

public interface IEntitlementLeaseStore
{
    Task StoreAsync(
        OfflineEntitlementLease lease,
        CancellationToken cancellationToken = default);

    Task<OfflineEntitlementLease?> GetValidAsync(
        Guid tenantId,
        Guid userObjectId,
        string deviceId,
        Guid appModuleId,
        DateTimeOffset now,
        CancellationToken cancellationToken = default);
}

public sealed class EntitlementLeaseStore(
    IDbContextFactory<VerseOffDbContext> contextFactory,
    ILocalDataProtector dataProtector,
    IEntitlementLeaseVerifier leaseVerifier,
    TimeProvider timeProvider) : IEntitlementLeaseStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public async Task StoreAsync(
        OfflineEntitlementLease lease,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(lease);
        var validation = leaseVerifier.Verify(
            lease,
            timeProvider.GetUtcNow());
        if (!validation.IsValid)
        {
            throw new SecurityException(validation.FailureReason);
        }

        var payload = JsonSerializer.Serialize(lease, JsonOptions);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var existing = await context.EntitlementLeases
            .SingleOrDefaultAsync(
                candidate => candidate.LeaseId == lease.LeaseId,
                cancellationToken);
        if (existing is null)
        {
            existing = new()
            {
                LeaseId = lease.LeaseId,
                TenantId = lease.TenantId,
                UserObjectId = lease.UserObjectId,
                DeviceId = lease.DeviceId,
                AppModuleId = lease.AppModuleId,
                ProfileId = lease.ProfileId,
                ExpiresAt = lease.ExpiresAt,
                PayloadJson = string.Empty,
            };
            context.EntitlementLeases.Add(existing);
        }

        existing.TenantId = lease.TenantId;
        existing.UserObjectId = lease.UserObjectId;
        existing.DeviceId = lease.DeviceId;
        existing.AppModuleId = lease.AppModuleId;
        existing.ProfileId = lease.ProfileId;
        existing.ExpiresAt = lease.ExpiresAt;
        existing.PayloadJson = dataProtector.Protect(
            payload,
            LocalProtectionPurpose.Entitlement(lease.LeaseId));
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<OfflineEntitlementLease?> GetValidAsync(
        Guid tenantId,
        Guid userObjectId,
        string deviceId,
        Guid appModuleId,
        DateTimeOffset now,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(deviceId);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var candidates = await context.EntitlementLeases
            .AsNoTracking()
            .Where(lease =>
                lease.TenantId == tenantId
                && lease.UserObjectId == userObjectId
                && lease.DeviceId == deviceId
                && lease.AppModuleId == appModuleId
                && lease.ExpiresAt > now)
            .OrderByDescending(lease => lease.ExpiresAt)
            .Take(10)
            .ToListAsync(cancellationToken);

        foreach (var candidate in candidates)
        {
            var payload = dataProtector.Unprotect(
                candidate.PayloadJson,
                LocalProtectionPurpose.Entitlement(candidate.LeaseId));
            var lease = JsonSerializer.Deserialize<OfflineEntitlementLease>(
                payload,
                JsonOptions)
                ?? throw new CryptographicException(
                    "The stored entitlement payload is invalid.");
            var validation = leaseVerifier.Verify(lease, now);
            if (validation.IsValid)
            {
                return lease;
            }

            if (lease.ExpiresAt > now)
            {
                throw new SecurityException(validation.FailureReason);
            }
        }

        return null;
    }
}
