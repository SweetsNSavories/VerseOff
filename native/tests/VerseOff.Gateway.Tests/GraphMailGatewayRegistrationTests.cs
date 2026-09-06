using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace VerseOff.Gateway.Tests;

[TestClass]
public sealed class GraphMailGatewayRegistrationTests
{
    [TestMethod]
    public void DisabledGraphIntegrationIsExplicitlyUnavailable()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder().Build();

        services.AddGraphMailGateway(configuration);

        using var provider = services.BuildServiceProvider();
        var gateway = provider.GetRequiredService<IGraphMailGateway>();
        Assert.IsFalse(gateway.IsAvailable);
    }

    [TestMethod]
    public void EnabledManagedIdentityGraphIntegrationIsAvailable()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["GraphMail:Enabled"] = "true",
                    ["GraphMail:CredentialMode"] = "ManagedIdentity",
                })
            .Build();
        var services = new ServiceCollection();

        services.AddGraphMailGateway(configuration);

        using var provider = services.BuildServiceProvider();
        var gateway = provider.GetRequiredService<IGraphMailGateway>();
        Assert.IsTrue(gateway.IsAvailable);
    }
}
