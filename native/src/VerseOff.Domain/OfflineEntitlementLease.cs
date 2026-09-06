namespace VerseOff.Domain;

public sealed record OfflineEntitlementLease(
    Guid LeaseId,
    Guid TenantId,
    Guid UserObjectId,
    string DeviceId,
    Guid EnvironmentId,
    Uri EnvironmentUri,
    Guid AppModuleId,
    Guid ProfileId,
    string ProfileHash,
    string SecuritySnapshotVersion,
    DateTimeOffset IssuedAt,
    DateTimeOffset ExpiresAt,
    IReadOnlyCollection<string> Capabilities,
    string Issuer,
    string SigningKeyId,
    byte[] Signature)
{
    public EntitlementValidationResult ValidateAt(DateTimeOffset now)
    {
        if (LeaseId == Guid.Empty
            || TenantId == Guid.Empty
            || UserObjectId == Guid.Empty
            || EnvironmentId == Guid.Empty
            || AppModuleId == Guid.Empty
            || ProfileId == Guid.Empty
            || string.IsNullOrWhiteSpace(DeviceId)
            || !IntegrityHash.IsSha256(ProfileHash)
            || string.IsNullOrWhiteSpace(SecuritySnapshotVersion)
            || string.IsNullOrWhiteSpace(Issuer)
            || string.IsNullOrWhiteSpace(SigningKeyId)
            || Capabilities.Count == 0
            || Capabilities.Any(string.IsNullOrWhiteSpace)
            || Capabilities.Distinct(StringComparer.Ordinal).Count()
                != Capabilities.Count
            || !EnvironmentUri.IsAbsoluteUri
            || !string.Equals(
                EnvironmentUri.Scheme,
                Uri.UriSchemeHttps,
                StringComparison.OrdinalIgnoreCase)
            || Signature.Length == 0)
        {
            return new(false, "The entitlement lease is incomplete.");
        }

        if (ExpiresAt <= IssuedAt)
        {
            return new(false, "The entitlement expiration must follow its issue time.");
        }

        if (IssuedAt > now.AddMinutes(5))
        {
            return new(false, "The entitlement issue time is in the future.");
        }

        if (now >= ExpiresAt)
        {
            return new(false, "The offline entitlement lease has expired.");
        }

        return new(true, null);
    }
}

public sealed record EntitlementValidationResult(
    bool IsValid,
    string? FailureReason);
