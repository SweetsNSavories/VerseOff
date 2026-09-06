using Azure.Core;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace VerseOff.Gateway;

public sealed class AzureCredentialDataverseAccessTokenProvider(
    TokenCredential credential,
    Uri environmentUri) : IDataverseAccessTokenProvider
{
    private readonly TokenRequestContext tokenRequestContext = new(
        [$"{environmentUri.GetLeftPart(UriPartial.Authority)}/.default"]);

    public async ValueTask<string> GetAccessTokenAsync(
        CancellationToken cancellationToken = default)
    {
        var token = await credential.GetTokenAsync(
            tokenRequestContext,
            cancellationToken);
        if (string.IsNullOrWhiteSpace(token.Token))
        {
            throw new InvalidOperationException(
                "Microsoft Entra returned an empty Dataverse access token.");
        }

        return token.Token;
    }
}

public static class DataverseGatewayRegistration
{
    public static IServiceCollection AddDataverseGateway(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);

        var section = configuration.GetSection("Dataverse");
        var environmentValue = section["EnvironmentUri"];
        if (string.IsNullOrWhiteSpace(environmentValue))
        {
            services.AddSingleton<IDataverseOperationExecutor>(
                new UnavailableDataverseOperationExecutor(
                    "Dataverse environment and workload identity are not configured."));
            services.AddSingleton<IDataverseChangeExecutor>(
                new UnavailableDataverseChangeExecutor(
                    "Dataverse change tracking is not configured."));
            return services;
        }

        if (!Uri.TryCreate(
                environmentValue,
                UriKind.Absolute,
                out var environmentUri)
            || !string.Equals(
                environmentUri.Scheme,
                Uri.UriSchemeHttps,
                StringComparison.OrdinalIgnoreCase)
            || !string.IsNullOrEmpty(environmentUri.Query)
            || !string.IsNullOrEmpty(environmentUri.Fragment))
        {
            throw new InvalidOperationException(
                "Dataverse:EnvironmentUri must be an absolute HTTPS origin.");
        }

        var credentialMode = section["CredentialMode"];
        TokenCredential credential = credentialMode?.ToUpperInvariant() switch
        {
            "MANAGEDIDENTITY" => CreateManagedIdentityCredential(section),
            "DEFAULTAZURECREDENTIAL" => new DefaultAzureCredential(),
            _ => throw new InvalidOperationException(
                "Dataverse:CredentialMode must be ManagedIdentity or DefaultAzureCredential."),
        };
        var entitySets = section.GetSection("EntitySets")
            .GetChildren()
            .ToDictionary(
                child => child.Key,
                child => child.Value
                    ?? throw new InvalidOperationException(
                        $"Dataverse entity-set mapping '{child.Key}' is empty."),
                StringComparer.OrdinalIgnoreCase);
        if (entitySets.Count == 0)
        {
            throw new InvalidOperationException(
                "At least one Dataverse entity-set mapping is required.");
        }
        var primaryIds = section.GetSection("PrimaryIds")
            .GetChildren()
            .ToDictionary(
                child => child.Key,
                child => child.Value
                    ?? throw new InvalidOperationException(
                        $"Dataverse primary-ID mapping '{child.Key}' is empty."),
                StringComparer.OrdinalIgnoreCase);
        foreach (var table in entitySets.Keys)
        {
            if (!primaryIds.ContainsKey(table))
            {
                throw new InvalidOperationException(
                    $"Dataverse primary-ID mapping is missing for table '{table}'.");
            }
        }

        services.AddSingleton<TokenCredential>(credential);
        services.AddSingleton<IDataverseAccessTokenProvider>(provider =>
            new AzureCredentialDataverseAccessTokenProvider(
                provider.GetRequiredService<TokenCredential>(),
                environmentUri));
        services.AddSingleton<IDataverseEntitySetResolver>(
            new DictionaryEntitySetResolver(entitySets));
        services.AddSingleton<IDataversePrimaryIdResolver>(
            new DictionaryPrimaryIdResolver(primaryIds));
        services.AddHttpClient("Dataverse", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(100);
        });
        services.AddSingleton<IDataverseOperationExecutor>(provider =>
            new HttpDataverseOperationExecutor(
                provider.GetRequiredService<IHttpClientFactory>()
                    .CreateClient("Dataverse"),
                environmentUri,
                provider.GetRequiredService<
                    IDataverseAccessTokenProvider>(),
                provider.GetRequiredService<
                    IDataverseEntitySetResolver>()));
        services.AddSingleton<IDataverseChangeExecutor>(provider =>
            new HttpDataverseChangeExecutor(
                provider.GetRequiredService<IHttpClientFactory>()
                    .CreateClient("Dataverse"),
                environmentUri,
                provider.GetRequiredService<
                    IDataverseAccessTokenProvider>(),
                provider.GetRequiredService<
                    IDataverseEntitySetResolver>(),
                provider.GetRequiredService<
                    IDataversePrimaryIdResolver>()));
        return services;
    }

    private static ManagedIdentityCredential CreateManagedIdentityCredential(
        IConfiguration section)
    {
        var clientId = section["ManagedIdentityClientId"];
        var identity = string.IsNullOrWhiteSpace(clientId)
            ? ManagedIdentityId.SystemAssigned
            : ManagedIdentityId.FromUserAssignedClientId(clientId);
        return new(identity);
    }
}
