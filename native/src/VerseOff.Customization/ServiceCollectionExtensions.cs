#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Runtime;
using VerseOff.Customization.Services;
using VerseOff.Customization.Storage;

namespace VerseOff.Customization;

/// <summary>
/// Dependency injection extension methods for customization services.
/// Registers all customization-related services (storage, applier, runtime application).
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Register customization services including storage, applier, and runtime application.
    /// </summary>
    /// <param name="services">The service collection to register into</param>
    /// <param name="customizationStorePath">Path to the customization storage (JSON file directory or database connection)</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection AddVerseOffCustomization(
        this IServiceCollection services,
        string customizationStorePath)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentException.ThrowIfNullOrWhiteSpace(customizationStorePath);

        // Register storage layer
        services.AddScoped<ICustomizationStore>(sp =>
            new JsonFileCustomizationStore(
                customizationStorePath,
                sp.GetRequiredService<ILogger<JsonFileCustomizationStore>>()));

        // Register business logic services
        services.AddScoped<CustomizationApplier>();
        services.AddScoped<FormCustomizer>();
        services.AddScoped<AppCustomizer>();

        // Register runtime application service (in-memory caching)
        // This service loads and caches customizations for performance
        services.AddScoped<RuntimeCustomizationApplication>();

        // Register metadata extraction service
        services.AddScoped(sp => sp);

        return services;
    }
}
