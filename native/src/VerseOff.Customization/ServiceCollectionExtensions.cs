#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names
#pragma warning disable CA1873 // Suppress logging checks (acceptable for startup path)

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using VerseOff.Customization.Baseline;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
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
    /// Optionally load baseline metadata from a JSON file (app.json or dedicated baseline metadata file).
    /// </summary>
    /// <param name="services">The service collection to register into</param>
    /// <param name="customizationStorePath">Path to the customization storage (JSON file directory or database connection)</param>
    /// <param name="baselineMetadataPath">Optional path to baseline metadata JSON file (e.g., from offline app package)</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection AddVerseOffCustomization(
        this IServiceCollection services,
        string customizationStorePath,
        string? baselineMetadataPath = null)
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

        // Register runtime application service (in-memory caching)
        // This service loads and caches customizations for performance
        services.AddScoped<RuntimeCustomizationApplication>();

        // Register baseline metadata loader
        services.AddSingleton<BaselineMetadataLoader>();

        // Register customizable metadata service
        // This wraps baseline metadata and transparently applies customizations on-demand
        services.AddScoped<CustomizableMetadataService>(sp =>
        {
            var loggerFactory = sp.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger("VerseOff.Customization.Setup");
            var loader = sp.GetRequiredService<BaselineMetadataLoader>();

            var baselineMetadata = new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);

            // If baseline metadata path is provided, attempt to load it
            if (!string.IsNullOrWhiteSpace(baselineMetadataPath) && File.Exists(baselineMetadataPath))
            {
                try
                {
                    // Load baseline metadata synchronously from file
                    // Note: In a real application, this should ideally be async during host startup
                    // For now, we load synchronously within the factory to avoid breaking the sync factory pattern
                    var loadTask = loader.LoadFromFileAsync(baselineMetadataPath);
                    loadTask.Wait(); // Synchronous block - not ideal but necessary for sync factory
                    var loaded = loadTask.Result;
                    
                    foreach (var kvp in loaded)
                    {
                        baselineMetadata[kvp.Key] = kvp.Value;
                    }

                    logger.LogInformation(
                        "Successfully loaded baseline metadata from {FilePath}, {Count} entities loaded",
                        baselineMetadataPath,
                        baselineMetadata.Count);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex,
                        "Failed to load baseline metadata from {FilePath}, proceeding with empty baseline",
                        baselineMetadataPath);
                    // Continue with empty baseline rather than failing startup
                }
            }
            else if (!string.IsNullOrWhiteSpace(baselineMetadataPath))
            {
                logger.LogWarning(
                    "Baseline metadata path provided but file not found: {FilePath}",
                    baselineMetadataPath);
            }

            var runtime = sp.GetRequiredService<RuntimeCustomizationApplication>();
            var applier = sp.GetRequiredService<CustomizationApplier>();

            return new CustomizableMetadataService(baselineMetadata, runtime, applier);
        });

        return services;
    }
}

