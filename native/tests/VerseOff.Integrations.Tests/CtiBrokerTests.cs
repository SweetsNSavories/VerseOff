using System.Security.Cryptography;
using System.Text.Json;
using VerseOff.Domain;

namespace VerseOff.Integrations.Tests;

[TestClass]
public sealed class CtiBrokerTests
{
    [TestMethod]
    public async Task SignedVendorSignalDispatchesOnceAndRejectsReplay()
    {
        using var key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        var now = DateTimeOffset.UtcNow;
        var handler = new RecordingHandler();
        var registration = new CtiAdapterRegistration(
            "vendor-cti",
            new(
                "adapter",
                "vendor_cti",
                ComponentOrigin.ThirdParty,
                "vendor_solution",
                "vendor",
                new string('a', 64),
                IsManaged: true,
                OwnershipVerified: true),
            key.ExportSubjectPublicKeyInfoPem(),
            IsVendorSupportedAdapter: true);
        var broker = new CtiBroker(
            [registration],
            handler,
            new FixedTimeProvider(now));
        using var payload = JsonDocument.Parse(
            """{"phoneNumber":"+15555550100","recordId":"00000000-0000-0000-0000-000000000001"}""");
        var unsigned = new CtiSignalEnvelope(
            "vendor-cti",
            Guid.NewGuid(),
            now,
            "nonce-1",
            CtiSignalType.ScreenPop,
            payload.RootElement.Clone(),
            []);
        var signal = CtiSignalCryptography.Sign(unsigned, key);

        var first = await broker.DispatchAsync(signal);
        var replay = await broker.DispatchAsync(signal);

        Assert.IsTrue(first.Accepted);
        Assert.IsFalse(replay.Accepted);
        StringAssert.Contains(replay.FailureReason, "replay");
        Assert.AreEqual(1, handler.Count);
    }

    [TestMethod]
    public async Task TamperedSignalIsRejected()
    {
        using var key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        var now = DateTimeOffset.UtcNow;
        var registration = new CtiAdapterRegistration(
            "customer-cti",
            new(
                "adapter",
                "customer_cti",
                ComponentOrigin.CustomerOwned,
                "customer_solution",
                "customer",
                new string('a', 64),
                IsManaged: false,
                OwnershipVerified: true),
            key.ExportSubjectPublicKeyInfoPem(),
            IsVendorSupportedAdapter: false);
        var broker = new CtiBroker(
            [registration],
            new RecordingHandler(),
            new FixedTimeProvider(now));
        using var originalPayload = JsonDocument.Parse("""{"callId":"1"}""");
        using var tamperedPayload = JsonDocument.Parse("""{"callId":"2"}""");
        var signed = CtiSignalCryptography.Sign(
            new(
                "customer-cti",
                Guid.NewGuid(),
                now,
                "nonce",
                CtiSignalType.IncomingCall,
                originalPayload.RootElement.Clone(),
                []),
            key);

        var result = await broker.DispatchAsync(signed with
        {
            Payload = tamperedPayload.RootElement.Clone(),
        });

        Assert.IsFalse(result.Accepted);
        StringAssert.Contains(result.FailureReason, "signature");
    }

    private sealed class RecordingHandler : ICtiSignalHandler
    {
        public int Count { get; private set; }

        public ValueTask HandleAsync(
            CtiSignalEnvelope signal,
            CancellationToken cancellationToken = default)
        {
            Count++;
            return ValueTask.CompletedTask;
        }
    }

    private sealed class FixedTimeProvider(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }
}
