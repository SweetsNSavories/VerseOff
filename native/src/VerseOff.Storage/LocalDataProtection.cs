using System.Security.Cryptography;
using System.Text;

namespace VerseOff.Storage;

public interface ILocalDataProtector
{
    string Protect(string plaintext, string purpose);

    string Unprotect(string protectedValue, string purpose);
}

public sealed class AesGcmLocalDataProtector : ILocalDataProtector
{
    private const string Prefix = "vo1:";
    private const int NonceSize = 12;
    private const int TagSize = 16;
    private readonly byte[] key;

    public AesGcmLocalDataProtector(ReadOnlySpan<byte> key)
    {
        if (key.Length != 32)
        {
            throw new ArgumentException(
                "Local data protection requires a 256-bit key.",
                nameof(key));
        }

        this.key = key.ToArray();
    }

    public string Protect(string plaintext, string purpose)
    {
        ArgumentNullException.ThrowIfNull(plaintext);
        ArgumentException.ThrowIfNullOrWhiteSpace(purpose);

        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);
        var nonce = RandomNumberGenerator.GetBytes(NonceSize);
        var ciphertext = new byte[plaintextBytes.Length];
        var tag = new byte[TagSize];
        using (var aes = new AesGcm(key, TagSize))
        {
            aes.Encrypt(
                nonce,
                plaintextBytes,
                ciphertext,
                tag,
                Encoding.UTF8.GetBytes(purpose));
        }

        var envelope = new byte[NonceSize + TagSize + ciphertext.Length];
        nonce.CopyTo(envelope, 0);
        tag.CopyTo(envelope, NonceSize);
        ciphertext.CopyTo(envelope, NonceSize + TagSize);
        CryptographicOperations.ZeroMemory(plaintextBytes);
        return Prefix + Convert.ToBase64String(envelope);
    }

    public string Unprotect(string protectedValue, string purpose)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(protectedValue);
        ArgumentException.ThrowIfNullOrWhiteSpace(purpose);
        if (!protectedValue.StartsWith(Prefix, StringComparison.Ordinal))
        {
            throw new CryptographicException(
                "The local data envelope version is missing or unsupported.");
        }

        byte[] envelope;
        try
        {
            envelope = Convert.FromBase64String(
                protectedValue[Prefix.Length..]);
        }
        catch (FormatException exception)
        {
            throw new CryptographicException(
                "The local data envelope is malformed.",
                exception);
        }

        if (envelope.Length < NonceSize + TagSize)
        {
            throw new CryptographicException(
                "The local data envelope is truncated.");
        }

        var nonce = envelope.AsSpan(0, NonceSize);
        var tag = envelope.AsSpan(NonceSize, TagSize);
        var ciphertext = envelope.AsSpan(NonceSize + TagSize);
        var plaintext = new byte[ciphertext.Length];
        using (var aes = new AesGcm(key, TagSize))
        {
            aes.Decrypt(
                nonce,
                ciphertext,
                tag,
                plaintext,
                Encoding.UTF8.GetBytes(purpose));
        }

        var result = Encoding.UTF8.GetString(plaintext);
        CryptographicOperations.ZeroMemory(plaintext);
        return result;
    }
}

public static class LocalProtectionPurpose
{
    public static string Record(string tableLogicalName, Guid recordId) =>
        $"record:{tableLogicalName}:{recordId:D}";

    public static string Outbox(Guid operationId) =>
        $"outbox:{operationId:D}";

    public static string Entitlement(Guid leaseId) =>
        $"entitlement:{leaseId:D}";

    public static string TimelineRecord(Guid recordId) =>
        $"timeline-record:{recordId:D}";

    public static string TimelineParty(Guid recordId, int partyIndex) =>
        $"timeline-party:{recordId:D}:{partyIndex}";

    public static string TimelineAttachment(Guid attachmentId) =>
        $"timeline-attachment:{attachmentId:D}";

    public static string SyncCursor(
        string scope,
        string tableLogicalName) =>
        $"sync-cursor:{scope}:{tableLogicalName}";
}
