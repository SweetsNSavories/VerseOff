using System.Security.Claims;
using System.Security.Cryptography;
using VerseOff.Domain;

namespace VerseOff.Gateway.Tests;

[TestClass]
public sealed class EntitlementServiceTests
{
    private static readonly string[] ReadCapability = ["read"];

    [TestMethod]
    public async Task ClaimsPolicyBindsUserTenantDeviceAppAndCapabilities()
    {
        var request = Request();
        var userId = Guid.NewGuid();
        var principal = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new("oid", userId.ToString("D")),
                new("tid", request.TenantId.ToString("D")),
                new("verseoff:entitled", "true"),
                new("verseoff:device_id", request.DeviceId),
                new("verseoff:app", request.AppModuleId.ToString("D")),
                new("verseoff:capability", "read"),
            ],
            authenticationType: "Test"));
        var authorizer = new ClaimsEntitlementAuthorizationService();

        var decision = await authorizer.AuthorizeAsync(
            principal,
            request);

        Assert.IsTrue(decision.IsAuthorized);
        Assert.AreEqual(userId, decision.UserObjectId);
        CollectionAssert.AreEqual(
            ReadCapability,
            decision.Capabilities.ToArray());
    }

    [TestMethod]
    public async Task ClaimsPolicyRejectsMismatchedDevice()
    {
        var request = Request();
        var principal = new ClaimsPrincipal(new ClaimsIdentity(
            [
                new("oid", Guid.NewGuid().ToString("D")),
                new("tid", request.TenantId.ToString("D")),
                new("verseoff:entitled", "true"),
                new("verseoff:device_id", "another-device"),
                new("verseoff:app", "*"),
                new("verseoff:capability", "read"),
            ],
            authenticationType: "Test"));
        var authorizer = new ClaimsEntitlementAuthorizationService();

        var decision = await authorizer.AuthorizeAsync(
            principal,
            request);

        Assert.IsFalse(decision.IsAuthorized);
        StringAssert.Contains(decision.FailureReason, "device");
    }

    [TestMethod]
    public void IssuerCreatesVerifiableBoundedLease()
    {
        using var key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        var now = new DateTimeOffset(
            2026,
            9,
            6,
            12,
            0,
            0,
            TimeSpan.Zero);
        using var issuer = new EcdsaEntitlementLeaseIssuer(
            key,
            new(
                "https://gateway.example.test",
                "key-1",
                TimeSpan.FromDays(7)),
            new FixedTimeProvider(now));
        var request = Request();
        var userId = Guid.NewGuid();
        var authorization = new EntitlementAuthorizationDecision(
            true,
            userId,
            ["read"],
            null);

        var lease = issuer.Issue(request, authorization);
        var validation = EntitlementLeaseCryptography.Verify(
            lease,
            key,
            now);

        Assert.IsTrue(validation.IsValid);
        Assert.AreEqual(userId, lease.UserObjectId);
        Assert.AreEqual(now.AddDays(7), lease.ExpiresAt);
        CollectionAssert.AreEqual(
            ReadCapability,
            lease.Capabilities.ToArray());
    }

    private static EntitlementIssuanceRequest Request() => new(
        Guid.NewGuid(),
        "managed-device",
        Guid.NewGuid(),
        new Uri("https://example.crm.dynamics.com"),
        Guid.NewGuid(),
        Guid.NewGuid(),
        new string('a', 64),
        "security-v1",
        ["read", "write"]);

    private sealed class FixedTimeProvider(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }
}
