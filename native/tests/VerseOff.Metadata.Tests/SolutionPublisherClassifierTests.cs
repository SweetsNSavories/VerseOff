using VerseOff.Domain;
using VerseOff.Metadata;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class SolutionPublisherClassifierTests
{
    [TestMethod]
    public void AutomotiveAcceleratorPublisherIsMicrosoftOwned()
    {
        Assert.AreEqual(
            ComponentOrigin.MicrosoftSystem,
            SolutionPublisherClassifier.Classify(
                "microsoftdynamics365automotiveaccelerator"));
    }

    [TestMethod]
    public void DynamicsPublisherIsMicrosoftOwned()
    {
        Assert.AreEqual(
            ComponentOrigin.MicrosoftSystem,
            SolutionPublisherClassifier.Classify("dynamics365automotive"));
    }

    [TestMethod]
    public void MsPublisherIsMicrosoftOwned()
    {
        Assert.AreEqual(
            ComponentOrigin.MicrosoftSystem,
            SolutionPublisherClassifier.Classify("msdyn"));
    }

    [TestMethod]
    public void UnknownPublisherRequiresExplicitCustomerOwnership()
    {
        Assert.AreEqual(
            ComponentOrigin.Unknown,
            SolutionPublisherClassifier.Classify("contosohealthcare"));
    }
}
