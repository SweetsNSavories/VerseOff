using Azure.Core;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VerseOff.Integrations;

namespace VerseOff.Gateway;

public sealed record GraphMailDeltaRequest(string? DeltaLink);

public interface IGraphMailGateway
{
    bool IsAvailable { get; }

    string? UnavailableReason { get; }

    ValueTask<GraphMailDeltaResult> GetInboxDeltaAsync(
        Guid userObjectId,
        string? deltaLink,
        CancellationToken cancellationToken = default);
}

public sealed class GraphMailGateway(
    GraphMailDeltaClient client) : IGraphMailGateway
{
    public bool IsAvailable => true;

    public string? UnavailableReason => null;

    public ValueTask<GraphMailDeltaResult> GetInboxDeltaAsync(
        Guid userObjectId,
        string? deltaLink,
        CancellationToken cancellationToken = default)
    {
        if (userObjectId == Guid.Empty)
        {
            throw new ArgumentException(
                "A Microsoft Entra user object ID is required.",
                nameof(userObjectId));
        }

        return client.GetInboxDeltaAsync(
            userObjectId.ToString("D"),
            deltaLink,
            cancellationToken);
    }
}

public sealed class UnavailableGraphMailGateway(string reason)
    : IGraphMailGateway
{
    public bool IsAvailable => false;

    public string? UnavailableReason { get; } =
        string.IsNullOrWhiteSpace(reason)
            ? "Graph mail integration is not configured."
            : reason;

    public ValueTask<GraphMailDeltaResult> GetInboxDeltaAsync(
        Guid userObjectId,
        string? deltaLink,
        CancellationToken cancellationToken = default) =>
        ValueTask.FromException<GraphMailDeltaResult>(
            new InvalidOperationException(UnavailableReason));
}

public sealed class AzureCredentialGraphAccessTokenProvider(
    TokenCredential credential) : IGraphAccessTokenProvider
{
    private static readonly TokenRequestContext GraphContext = new(
        ["https://graph.microsoft.com/.default"]);

    public async ValueTask<string> GetAccessTokenAsync(
        CancellationToken cancellationToken = default)
    {
        var token = await credential.GetTokenAsync(
            GraphContext,
            cancellationToken);
        if (string.IsNullOrWhiteSpace(token.Token))
        {
            throw new InvalidOperationException(
                "Microsoft Entra returned an empty Microsoft Graph token.");
        }

        return token.Token;
    }
}

public static class GraphMailGatewayRegistration
{
    public static IServiceCollection AddGraphMailGateway(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);

        var section = configuration.GetSection("GraphMail");
        if (!bool.TryParse(section["Enabled"], out var enabled)
            || !enabled)
        {
            services.AddSingleton<IGraphMailGateway>(
                new UnavailableGraphMailGateway(
                    "Microsoft Graph mail delta is disabled."));
            return services;
        }

        TokenCredential credential = section["CredentialMode"]
            ?.ToUpperInvariant() switch
        {
            "MANAGEDIDENTITY" => ManagedIdentity(section),
            "DEFAULTAZURECREDENTIAL" => new DefaultAzureCredential(),
            _ => throw new InvalidOperationException(
                "GraphMail:CredentialMode must be ManagedIdentity or DefaultAzureCredential."),
        };
        services.AddSingleton<IGraphAccessTokenProvider>(
            new AzureCredentialGraphAccessTokenProvider(credential));
        services.AddHttpClient("MicrosoftGraph", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(100);
        });
        services.AddSingleton<IGraphMailGateway>(provider =>
            new GraphMailGateway(new(
                provider.GetRequiredService<IHttpClientFactory>()
                    .CreateClient("MicrosoftGraph"),
                provider.GetRequiredService<
                    IGraphAccessTokenProvider>())));
        return services;
    }

    private static ManagedIdentityCredential ManagedIdentity(
        IConfiguration section)
    {
        var clientId = section["ManagedIdentityClientId"];
        var identity = string.IsNullOrWhiteSpace(clientId)
            ? ManagedIdentityId.SystemAssigned
            : ManagedIdentityId.FromUserAssignedClientId(clientId);
        return new(identity);
    }
}
