using System.Security.Cryptography;

namespace VerseOff.Storage.Tests;

[TestClass]
public sealed class LocalDataProtectionTests
{
    [TestMethod]
    public void RoundTripRequiresMatchingPurpose()
    {
        var protector = new AesGcmLocalDataProtector(
            Enumerable.Range(1, 32).Select(value => (byte)value).ToArray());
        var protectedValue = protector.Protect(
            """{"name":"Acme"}""",
            "record:account:1");

        var plaintext = protector.Unprotect(
            protectedValue,
            "record:account:1");

        Assert.AreEqual("""{"name":"Acme"}""", plaintext);
        Assert.IsFalse(protectedValue.Contains(
            "Acme",
            StringComparison.Ordinal));
        Assert.ThrowsExactly<AuthenticationTagMismatchException>(
            () => protector.Unprotect(
                protectedValue,
                "record:contact:1"));
    }

    [TestMethod]
    public void TamperedCiphertextFailsAuthentication()
    {
        var protector = new AesGcmLocalDataProtector(
            Enumerable.Range(1, 32).Select(value => (byte)value).ToArray());
        var protectedValue = protector.Protect("secret", "purpose");
        var envelope = Convert.FromBase64String(protectedValue[4..]);
        envelope[^1] ^= 1;
        var tampered = "vo1:" + Convert.ToBase64String(envelope);

        Assert.ThrowsExactly<AuthenticationTagMismatchException>(
            () => protector.Unprotect(tampered, "purpose"));
    }
}
