using System.Security.Claims;
using System.Security.Cryptography;
using VerseOff.Domain;

namespace VerseOff.Gateway;

public sealed record EntitlementIssuanceRequest(
    Guid TenantId,
    string DeviceId,
    Guid EnvironmentId,
    Uri EnvironmentUri,
    Guid AppModuleId,
    Guid ProfileId,
    string ProfileHash,
    string SecuritySnapshotVersion,
    IReadOnlyList<string> Capabilities);

public sealed record EntitlementAuthorizationDecision(
    bool IsAuthorized,
    Guid UserObjectId,
    IReadOnlyList<string> Capabilities,
    string? FailureReason);

public interface IEntitlementAuthorizationService
{
    ValueTask<EntitlementAuthorizationDecision> AuthorizeAsync(
        ClaimsPrincipal principal,
        EntitlementIssuanceRequest request,
        CancellationToken cancellationToken = default);
}

public sealed class ClaimsEntitlementAuthorizationService
    : IEntitlementAuthorizationService
{
    public ValueTask<EntitlementAuthorizationDecision> AuthorizeAsync(
        ClaimsPrincipal principal,
        EntitlementIssuanceRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(principal);
        ArgumentNullException.ThrowIfNull(request);
        cancellationToken.ThrowIfCancellationRequested();

        if (principal.Identity?.IsAuthenticated is not true)
        {
            return Denied("The caller is not authenticated.");
        }

        if (!TryGuidClaim(
                principal,
                ["oid", ClaimTypes.NameIdentifier],
                out var userObjectId))
        {
            return Denied(
                "The authenticated identity has no mapped Dataverse user object ID.");
        }

        if (!TryGuidClaim(
                principal,
                ["tid", "tenantid"],
                out var tenantId)
            || tenantId != request.TenantId)
        {
            return Denied(
                "The authenticated tenant does not match the requested tenant.");
        }

        var entitled = principal.FindFirst("verseoff:entitled")?.Value;
        if (!string.Equals(
                entitled,
                "true",
                StringComparison.OrdinalIgnoreCase))
        {
            return Denied(
                "The customer entitlement policy did not approve this user.");
        }

        var deviceId = principal.FindFirst("verseoff:device_id")?.Value;
        if (!string.Equals(
                deviceId,
                request.DeviceId,
                StringComparison.Ordinal))
        {
            return Denied(
                "The authenticated device does not match the requested device.");
        }

        var allowedApps = principal.FindAll("verseoff:app")
            .Select(claim => claim.Value)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        if (!allowedApps.Contains("*")
            && !allowedApps.Contains(request.AppModuleId.ToString("D")))
        {
            return Denied(
                "The user is not entitled to the selected model-driven app.");
        }

        var allowedCapabilities = principal
            .FindAll("verseoff:capability")
            .Select(claim => claim.Value)
            .ToHashSet(StringComparer.Ordinal);
        var grantedCapabilities = request.Capabilities
            .Where(allowedCapabilities.Contains)
            .Distinct(StringComparer.Ordinal)
            .OrderBy(value => value, StringComparer.Ordinal)
            .ToArray();
        if (grantedCapabilities.Length == 0)
        {
            return Denied(
                "No requested BCDR capability is authorized.");
        }

        return ValueTask.FromResult(new EntitlementAuthorizationDecision(
            true,
            userObjectId,
            grantedCapabilities,
            null));
    }

    private static ValueTask<EntitlementAuthorizationDecision> Denied(
        string reason) =>
        ValueTask.FromResult(new EntitlementAuthorizationDecision(
            false,
            Guid.Empty,
            [],
            reason));

    private static bool TryGuidClaim(
        ClaimsPrincipal principal,
        IReadOnlyList<string> claimTypes,
        out Guid value)
    {
        foreach (var claimType in claimTypes)
        {
            var claim = principal.FindFirst(claimType)?.Value;
            if (Guid.TryParse(claim, out value))
            {
                return true;
            }
        }

        value = Guid.Empty;
        return false;
    }
}

public sealed record EntitlementLeaseIssuerOptions(
    string Issuer,
    string SigningKeyId,
    TimeSpan LeaseLifetime);

public interface IEntitlementLeaseIssuer
{
    bool IsAvailable { get; }

    string? UnavailableReason { get; }

    OfflineEntitlementLease Issue(
        EntitlementIssuanceRequest request,
        EntitlementAuthorizationDecision authorization);
}

public sealed class EcdsaEntitlementLeaseIssuer : IEntitlementLeaseIssuer,
    IDisposable
{
    private readonly ECDsa signingKey;
    private readonly EntitlementLeaseIssuerOptions options;
    private readonly TimeProvider timeProvider;

    public EcdsaEntitlementLeaseIssuer(
        ECDsa signingKey,
        EntitlementLeaseIssuerOptions options,
        TimeProvider timeProvider)
    {
        this.signingKey = signingKey
            ?? throw new ArgumentNullException(nameof(signingKey));
        this.options = options
            ?? throw new ArgumentNullException(nameof(options));
        this.timeProvider = timeProvider
            ?? throw new ArgumentNullException(nameof(timeProvider));
        ArgumentException.ThrowIfNullOrWhiteSpace(options.Issuer);
        ArgumentException.ThrowIfNullOrWhiteSpace(options.SigningKeyId);
        if (options.LeaseLifetime <= TimeSpan.Zero
            || options.LeaseLifetime > TimeSpan.FromDays(30))
        {
            throw new ArgumentOutOfRangeException(
                nameof(options),
                "Entitlement lifetime must be between zero and 30 days.");
        }

        if (signingKey.KeySize != 256)
        {
            throw new CryptographicException(
                "Entitlement signing requires an ECDSA P-256 key.");
        }
    }

    public bool IsAvailable => true;

    public string? UnavailableReason => null;

    public OfflineEntitlementLease Issue(
        EntitlementIssuanceRequest request,
        EntitlementAuthorizationDecision authorization)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(authorization);
        if (!authorization.IsAuthorized
            || authorization.UserObjectId == Guid.Empty)
        {
            throw new InvalidOperationException(
                "An entitlement cannot be issued without an authorized user.");
        }

        var now = timeProvider.GetUtcNow();
        var unsigned = new OfflineEntitlementLease(
            Guid.NewGuid(),
            request.TenantId,
            authorization.UserObjectId,
            request.DeviceId,
            request.EnvironmentId,
            request.EnvironmentUri,
            request.AppModuleId,
            request.ProfileId,
            request.ProfileHash,
            request.SecuritySnapshotVersion,
            now,
            now.Add(options.LeaseLifetime),
            authorization.Capabilities,
            options.Issuer,
            options.SigningKeyId,
            []);
        return EntitlementLeaseCryptography.Sign(unsigned, signingKey);
    }

    public void Dispose() => signingKey.Dispose();

    public static EcdsaEntitlementLeaseIssuer FromPemFile(
        string privateKeyPemPath,
        EntitlementLeaseIssuerOptions options,
        TimeProvider timeProvider)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(privateKeyPemPath);
        var pem = File.ReadAllText(privateKeyPemPath);
        var key = ECDsa.Create();
        try
        {
            key.ImportFromPem(pem);
            return new(key, options, timeProvider);
        }
        catch
        {
            key.Dispose();
            throw;
        }
    }
}

public sealed class UnavailableEntitlementLeaseIssuer(string reason)
    : IEntitlementLeaseIssuer
{
    public bool IsAvailable => false;

    public string? UnavailableReason { get; } =
        string.IsNullOrWhiteSpace(reason)
            ? "Entitlement signing is not configured."
            : reason;

    public OfflineEntitlementLease Issue(
        EntitlementIssuanceRequest request,
        EntitlementAuthorizationDecision authorization) =>
        throw new InvalidOperationException(UnavailableReason);
}
