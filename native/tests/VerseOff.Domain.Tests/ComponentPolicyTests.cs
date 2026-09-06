using VerseOff.Domain;

namespace VerseOff.Domain.Tests;

[TestClass]
public sealed class ComponentPolicyTests
{
    [TestMethod]
    public void MicrosoftComponentRequiresCleanRoomNativeBehavior()
    {
        var decision = CleanRoomComponentPolicy.Evaluate(
            Provenance(ComponentOrigin.MicrosoftSystem));

        Assert.AreEqual(
            ComponentDisposition.CleanRoomNative,
            decision.Disposition);
        Assert.IsFalse(decision.CanExecuteCustomerCode);
    }

    [TestMethod]
    public void ThirdPartyComponentRequiresVendorAdapter()
    {
        var decision = CleanRoomComponentPolicy.Evaluate(
            Provenance(ComponentOrigin.ThirdParty));

        Assert.AreEqual(
            ComponentDisposition.VendorAdapter,
            decision.Disposition);
        Assert.IsFalse(decision.CanExecuteCustomerCode);
    }

    [TestMethod]
    public void VerifiedCustomerComponentCanExecute()
    {
        var decision = CleanRoomComponentPolicy.Evaluate(
            Provenance(ComponentOrigin.CustomerOwned));

        Assert.AreEqual(
            ComponentDisposition.CustomerExecutable,
            decision.Disposition);
        Assert.IsTrue(decision.CanExecuteCustomerCode);
    }

    [TestMethod]
    public void UnverifiedCustomerComponentFailsClosed()
    {
        var provenance = Provenance(ComponentOrigin.CustomerOwned) with
        {
            OwnershipVerified = false,
        };

        var decision = CleanRoomComponentPolicy.Evaluate(provenance);

        Assert.AreEqual(ComponentDisposition.Blocked, decision.Disposition);
    }

    [TestMethod]
    public void CustomerComponentWithMalformedHashFailsClosed()
    {
        var provenance = Provenance(ComponentOrigin.CustomerOwned) with
        {
            Sha256 = "not-a-sha256",
        };

        var decision = CleanRoomComponentPolicy.Evaluate(provenance);

        Assert.AreEqual(ComponentDisposition.Blocked, decision.Disposition);
    }

    [TestMethod]
    public void EntitlementExpiresAtBoundary()
    {
        var now = DateTimeOffset.UtcNow;
        var lease = new OfflineEntitlementLease(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "device",
            Guid.NewGuid(),
            new Uri("https://example.crm.dynamics.com"),
            Guid.NewGuid(),
            Guid.NewGuid(),
            new string('a', 64),
            "security-v1",
            now.AddHours(-1),
            now,
            ["read", "write"],
            "https://gateway.example.test",
            "key-1",
            [1, 2, 3]);

        var result = lease.ValidateAt(now);

        Assert.IsFalse(result.IsValid);
        StringAssert.Contains(result.FailureReason, "expired");
    }

    [TestMethod]
    public void EntitlementSignatureDetectsTampering()
    {
        using var key = System.Security.Cryptography.ECDsa.Create(
            System.Security.Cryptography.ECCurve.NamedCurves.nistP256);
        var now = DateTimeOffset.UtcNow;
        var unsigned = new OfflineEntitlementLease(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            "device",
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
            []);
        var signed = EntitlementLeaseCryptography.Sign(unsigned, key);

        var valid = EntitlementLeaseCryptography.Verify(
            signed,
            key,
            now);
        var tampered = EntitlementLeaseCryptography.Verify(
            signed with
            {
                DeviceId = "other-device",
            },
            key,
            now);

        Assert.IsTrue(valid.IsValid);
        Assert.IsFalse(tampered.IsValid);
        StringAssert.Contains(tampered.FailureReason, "signature");
    }

    private static ComponentProvenance Provenance(ComponentOrigin origin) =>
        new(
            "component-id",
            "publisher_component",
            origin,
            "solution-id",
            "publisher-id",
            new string('a', 64),
            IsManaged: true,
            OwnershipVerified: true);
}
