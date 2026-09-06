using System.Security.Cryptography;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.Integrations;

public enum CtiSignalType
{
    IncomingCall = 0,
    CallConnected = 1,
    CallEnded = 2,
    ScreenPop = 3,
    CreateActivity = 4,
}

public sealed record CtiSignalEnvelope(
    string AdapterId,
    Guid EventId,
    DateTimeOffset IssuedAt,
    string Nonce,
    CtiSignalType SignalType,
    JsonElement Payload,
    byte[] Signature);

public sealed record CtiAdapterRegistration(
    string AdapterId,
    ComponentProvenance Provenance,
    string PublicKeyPem,
    bool IsVendorSupportedAdapter);

public sealed record CtiDispatchResult(
    bool Accepted,
    string? FailureReason);

public interface ICtiSignalHandler
{
    ValueTask HandleAsync(
        CtiSignalEnvelope signal,
        CancellationToken cancellationToken = default);
}

public sealed class CtiBroker
{
    private const int MaximumPayloadBytes = 64 * 1024;
    private const int MaximumRememberedEvents = 10_000;
    private readonly Dictionary<string, CtiAdapterRegistration> adapters;
    private readonly HashSet<Guid> processedEvents = [];
    private readonly Queue<Guid> processedEventOrder = [];
    private readonly object replayGate = new();
    private readonly ICtiSignalHandler handler;
    private readonly TimeProvider timeProvider;

    public CtiBroker(
        IEnumerable<CtiAdapterRegistration> adapters,
        ICtiSignalHandler handler,
        TimeProvider timeProvider)
    {
        ArgumentNullException.ThrowIfNull(adapters);
        this.adapters = adapters.ToDictionary(
            adapter => adapter.AdapterId,
            StringComparer.Ordinal);
        this.handler = handler
            ?? throw new ArgumentNullException(nameof(handler));
        this.timeProvider = timeProvider
            ?? throw new ArgumentNullException(nameof(timeProvider));
    }

    public async ValueTask<CtiDispatchResult> DispatchAsync(
        CtiSignalEnvelope signal,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(signal);
        if (!adapters.TryGetValue(signal.AdapterId, out var adapter))
        {
            return new(false, "The CTI adapter is not registered.");
        }

        var decision = CleanRoomComponentPolicy.Evaluate(
            adapter.Provenance);
        var allowed = decision.Disposition
                is ComponentDisposition.CustomerExecutable
            || decision.Disposition is ComponentDisposition.VendorAdapter
                && adapter.IsVendorSupportedAdapter;
        if (!allowed)
        {
            return new(false, decision.Reason);
        }

        if (signal.EventId == Guid.Empty
            || string.IsNullOrWhiteSpace(signal.Nonce)
            || signal.Nonce.Length > 128
            || signal.Payload.ValueKind is not JsonValueKind.Object)
        {
            return new(false, "The CTI signal envelope is invalid.");
        }

        if (JsonSerializer.SerializeToUtf8Bytes(signal.Payload).Length
            > MaximumPayloadBytes)
        {
            return new(false, "The CTI signal payload is too large.");
        }

        var now = timeProvider.GetUtcNow();
        if (signal.IssuedAt < now.AddMinutes(-5)
            || signal.IssuedAt > now.AddMinutes(1))
        {
            return new(false, "The CTI signal timestamp is outside the allowed window.");
        }

        using var publicKey = ECDsa.Create();
        publicKey.ImportFromPem(adapter.PublicKeyPem);
        if (publicKey.KeySize != 256
            || !publicKey.VerifyData(
                CtiSignalCryptography.CreateSigningPayload(signal),
                signal.Signature,
                HashAlgorithmName.SHA256,
                DSASignatureFormat.IeeeP1363FixedFieldConcatenation))
        {
            return new(false, "The CTI signal signature is invalid.");
        }

        if (!TryRemember(signal.EventId))
        {
            return new(false, "The CTI signal is a replay.");
        }

        await handler.HandleAsync(signal, cancellationToken);
        return new(true, null);
    }

    private bool TryRemember(Guid eventId)
    {
        lock (replayGate)
        {
            if (!processedEvents.Add(eventId))
            {
                return false;
            }

            processedEventOrder.Enqueue(eventId);
            while (processedEventOrder.Count > MaximumRememberedEvents)
            {
                processedEvents.Remove(processedEventOrder.Dequeue());
            }

            return true;
        }
    }
}

public static class CtiSignalCryptography
{
    public static CtiSignalEnvelope Sign(
        CtiSignalEnvelope signal,
        ECDsa privateKey)
    {
        ArgumentNullException.ThrowIfNull(signal);
        ArgumentNullException.ThrowIfNull(privateKey);
        if (privateKey.KeySize != 256)
        {
            throw new CryptographicException(
                "CTI signal signing requires ECDSA P-256.");
        }

        return signal with
        {
            Signature = privateKey.SignData(
                CreateSigningPayload(signal),
                HashAlgorithmName.SHA256,
                DSASignatureFormat.IeeeP1363FixedFieldConcatenation),
        };
    }

    public static byte[] CreateSigningPayload(CtiSignalEnvelope signal)
    {
        ArgumentNullException.ThrowIfNull(signal);
        using var buffer = new MemoryStream();
        using (var writer = new Utf8JsonWriter(buffer))
        {
            writer.WriteStartObject();
            writer.WriteNumber("version", 1);
            writer.WriteString("adapterId", signal.AdapterId);
            writer.WriteString("eventId", signal.EventId);
            writer.WriteString(
                "issuedAt",
                signal.IssuedAt.ToUniversalTime());
            writer.WriteString("nonce", signal.Nonce);
            writer.WriteString("signalType", signal.SignalType.ToString());
            writer.WritePropertyName("payload");
            signal.Payload.WriteTo(writer);
            writer.WriteEndObject();
        }

        return buffer.ToArray();
    }
}
