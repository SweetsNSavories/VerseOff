namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class NativeControlFactoryTests
{
    [TestMethod]
    public void MicrosoftToggleMapsToCleanRoomNativeSwitch()
    {
        var kind = FirstPartyNativeControlRegistry.Resolve(
            "MscrmControls.FieldControls.ToggleControl");

        Assert.AreEqual(FirstPartyNativeControlKind.Toggle, kind);
    }

    [TestMethod]
    public void UnknownFirstPartyControlFailsVisibly()
    {
        var kind = FirstPartyNativeControlRegistry.Resolve(
            "MscrmControls.Unknown.FutureControl");

        Assert.AreEqual(FirstPartyNativeControlKind.Unsupported, kind);
    }
}
