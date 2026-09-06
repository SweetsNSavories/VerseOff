using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace VerseOff.Gateway.Tests;

[TestClass]
public sealed class GatewayEndpointTests
{
    private const string TestAuthenticationScheme = "Test";

    [TestMethod]
    public async Task HealthEndpointIsAnonymous()
    {
        await using var factory = new GatewayFactory();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/health/live");

        response.EnsureSuccessStatusCode();
    }

    [TestMethod]
    public async Task SessionEndpointRequiresAuthentication()
    {
        await using var factory = new GatewayFactory();
        using var client = factory.CreateClient(
            new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false,
            });

        using var response = await client.GetAsync("/api/v1/session");

        Assert.AreEqual(
            System.Net.HttpStatusCode.Unauthorized,
            response.StatusCode);
    }

    private sealed class GatewayFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services
                    .AddAuthentication(options =>
                    {
                        options.DefaultAuthenticateScheme =
                            TestAuthenticationScheme;
                        options.DefaultChallengeScheme =
                            TestAuthenticationScheme;
                    })
                    .AddScheme<
                        AuthenticationSchemeOptions,
                        TestAuthenticationHandler>(
                            TestAuthenticationScheme,
                            _ => { });
                services.PostConfigure<AuthenticationOptions>(options =>
                {
                    var negotiateScheme = options.Schemes.SingleOrDefault(
                        scheme => string.Equals(
                            scheme.Name,
                            NegotiateDefaults.AuthenticationScheme,
                            StringComparison.Ordinal));
                    if (negotiateScheme is not null)
                    {
                        negotiateScheme.HandlerType =
                            typeof(TestAuthenticationHandler);
                    }
                });
            });
        }
    }

    private sealed class TestAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : AuthenticationHandler<AuthenticationSchemeOptions>(
            options,
            logger,
            encoder)
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync() =>
            Task.FromResult(AuthenticateResult.NoResult());
    }
}
