using System.Security.Cryptography;
using System.Text.Json;

namespace VerseOff.Domain;

public static class EntitlementLeaseCryptography
{
    public const string Algorithm = "ES256";

    public static OfflineEntitlementLease Sign(
        OfflineEntitlementLease lease,
        ECDsa privateKey)
    {
        ArgumentNullException.ThrowIfNull(lease);
        ArgumentNullException.ThrowIfNull(privateKey);
        EnsureP256(privateKey);

        var unsigned = lease with
        {
            Signature = [],
        };
        var signature = privateKey.SignData(
            CreateSigningPayload(unsigned),
            HashAlgorithmName.SHA256,
            DSASignatureFormat.IeeeP1363FixedFieldConcatenation);
        return unsigned with
        {
            Signature = signature,
        };
    }

    public static EntitlementValidationResult Verify(
        OfflineEntitlementLease lease,
        ECDsa publicKey,
        DateTimeOffset now)
    {
        ArgumentNullException.ThrowIfNull(lease);
        ArgumentNullException.ThrowIfNull(publicKey);
        EnsureP256(publicKey);

        var structural = lease.ValidateAt(now);
        if (!structural.IsValid)
        {
            return structural;
        }

        var unsigned = lease with
        {
            Signature = [],
        };
        var valid = publicKey.VerifyData(
            CreateSigningPayload(unsigned),
            lease.Signature,
            HashAlgorithmName.SHA256,
            DSASignatureFormat.IeeeP1363FixedFieldConcatenation);
        return valid
            ? new(true, null)
            : new(false, "The entitlement lease signature is invalid.");
    }

    public static byte[] CreateSigningPayload(
        OfflineEntitlementLease lease)
    {
        ArgumentNullException.ThrowIfNull(lease);

        using var buffer = new MemoryStream();
        using (var writer = new Utf8JsonWriter(
            buffer,
            new JsonWriterOptions
            {
                Indented = false,
            }))
        {
            writer.WriteStartObject();
            writer.WriteNumber("version", 1);
            writer.WriteString("leaseId", lease.LeaseId);
            writer.WriteString("tenantId", lease.TenantId);
            writer.WriteString("userObjectId", lease.UserObjectId);
            writer.WriteString("deviceId", lease.DeviceId);
            writer.WriteString("environmentId", lease.EnvironmentId);
            writer.WriteString(
                "environmentUri",
                lease.EnvironmentUri.AbsoluteUri);
            writer.WriteString("appModuleId", lease.AppModuleId);
            writer.WriteString("profileId", lease.ProfileId);
            writer.WriteString("profileHash", lease.ProfileHash);
            writer.WriteString(
                "securitySnapshotVersion",
                lease.SecuritySnapshotVersion);
            writer.WriteString(
                "issuedAt",
                lease.IssuedAt.ToUniversalTime());
            writer.WriteString(
                "expiresAt",
                lease.ExpiresAt.ToUniversalTime());
            writer.WritePropertyName("capabilities");
            writer.WriteStartArray();
            foreach (var capability in lease.Capabilities.OrderBy(
                capability => capability,
                StringComparer.Ordinal))
            {
                writer.WriteStringValue(capability);
            }

            writer.WriteEndArray();
            writer.WriteString("issuer", lease.Issuer);
            writer.WriteString("signingKeyId", lease.SigningKeyId);
            writer.WriteString("algorithm", Algorithm);
            writer.WriteEndObject();
        }

        return buffer.ToArray();
    }

    public static string ExportPublicKeyPem(ECDsa key)
    {
        ArgumentNullException.ThrowIfNull(key);
        EnsureP256(key);
        return key.ExportSubjectPublicKeyInfoPem();
    }

    private static void EnsureP256(ECDsa key)
    {
        if (key.KeySize != 256)
        {
            throw new CryptographicException(
                "Entitlement keys must use the NIST P-256 curve.");
        }
    }
}
