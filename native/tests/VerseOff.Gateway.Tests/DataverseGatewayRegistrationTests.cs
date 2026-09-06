using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace VerseOff.Gateway.Tests;

[TestClass]
public sealed class DataverseGatewayRegistrationTests
{
    [TestMethod]
    public void EmptyConfigurationRegistersExplicitUnavailableExecutor()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder().Build();

        services.AddDataverseGateway(configuration);

        using var provider = services.BuildServiceProvider();
        var executor =
            provider.GetRequiredService<IDataverseOperationExecutor>();
        Assert.IsFalse(executor.IsAvailable);
        StringAssert.Contains(executor.UnavailableReason, "not configured");
    }

    [TestMethod]
    public void ManagedIdentityConfigurationRegistersAvailableExecutor()
    {
        var values = new Dictionary<string, string?>
        {
            ["Dataverse:EnvironmentUri"] =
                "https://example.crm.dynamics.com",
            ["Dataverse:CredentialMode"] = "ManagedIdentity",
            ["Dataverse:EntitySets:account"] = "accounts",
            ["Dataverse:PrimaryIds:account"] = "accountid",
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(values)
            .Build();
        var services = new ServiceCollection();

        services.AddDataverseGateway(configuration);

        using var provider = services.BuildServiceProvider();
        var executor =
            provider.GetRequiredService<IDataverseOperationExecutor>();
        Assert.IsTrue(executor.IsAvailable);
    }

    [TestMethod]
    public void InvalidEnvironmentConfigurationFailsStartup()
    {
        var values = new Dictionary<string, string?>
        {
            ["Dataverse:EnvironmentUri"] = "http://insecure.example.test",
            ["Dataverse:CredentialMode"] = "ManagedIdentity",
            ["Dataverse:EntitySets:account"] = "accounts",
            ["Dataverse:PrimaryIds:account"] = "accountid",
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(values)
            .Build();
        var services = new ServiceCollection();

        Assert.ThrowsExactly<InvalidOperationException>(
            () => services.AddDataverseGateway(configuration));
    }
}
