#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names
#pragma warning disable CA1873 // Expensive operations in logging
#pragma warning disable CA1510 // Use ArgumentNullException.ThrowIfNull

using Microsoft.Extensions.Logging;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Storage;

namespace VerseOff.Customization.Runtime;

/// <summary>
/// Runtime service that applies stored customizations to baseline metadata.
/// Loaded at startup and provides a method to apply all customizations to an entity.
/// Integrates the storage layer (ICustomizationStore) with the application logic (CustomizationApplier).
/// </summary>
public class RuntimeCustomizationApplication
{
    private readonly ICustomizationStore _store;
    private readonly CustomizationApplier _applier;
    private readonly ILogger<RuntimeCustomizationApplication> _logger;
    private readonly Dictionary<string, CustomizationLayer> _cache = new();
    private bool _isInitialized;

    public RuntimeCustomizationApplication(
        ICustomizationStore store,
        CustomizationApplier applier,
        ILogger<RuntimeCustomizationApplication> logger)
    {
        _store = store ?? throw new ArgumentNullException(nameof(store));
        _applier = applier ?? throw new ArgumentNullException(nameof(applier));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Initialize the runtime by loading all stored customizations into memory cache.
    /// Should be called once at application startup.
    /// </summary>
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Initializing runtime customization application");

            var customizedEntities = await _store.ListCustomizedEntitiesAsync(cancellationToken);
            _logger.LogDebug("Found {Count} customized entities", customizedEntities.Count);

            foreach (var entityName in customizedEntities)
            {
                try
                {
                    var customization = await _store.LoadAsync(entityName, cancellationToken);
                    if (customization != null)
                    {
                        _cache[entityName] = customization;
                        _logger.LogDebug("Loaded customization for entity: {Entity}", entityName);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to load customization for entity {Entity}, skipping", entityName);
                }
            }

            _isInitialized = true;
            _logger.LogInformation("Runtime customization application initialized with {Count} cached customizations", _cache.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize runtime customization application");
            throw;
        }
    }

    /// <summary>
    /// Apply customizations to baseline entity metadata.
    /// Returns a new EntityMetadata instance with all customizations merged.
    /// </summary>
    /// <param name="entityName">Logical name of the entity</param>
    /// <param name="baselineEntity">Baseline entity metadata from Dataverse</param>
    /// <param name="loadFromStore">If true, load customization from store if not in cache (lazy load)</param>
    /// <returns>Customized entity metadata, or baseline if no customizations exist</returns>
    public async Task<EntityMetadata> ApplyCustomizationsAsync(
        string entityName,
        EntityMetadata baselineEntity,
        bool loadFromStore = true,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(entityName))
            throw new ArgumentException("Entity name cannot be empty", nameof(entityName));

        if (baselineEntity == null)
            throw new ArgumentNullException(nameof(baselineEntity));

        // Try to get from cache first
        if (_cache.TryGetValue(entityName, out var customization))
        {
            _logger.LogDebug("Applying cached customization for entity: {Entity}", entityName);
            return _applier.ApplyCustomizations(baselineEntity, customization);
        }

        // If not in cache and lazy loading is enabled, try to load from store
        if (loadFromStore && !_isInitialized)
        {
            try
            {
                customization = await _store.LoadAsync(entityName, cancellationToken);
                if (customization != null)
                {
                    _cache[entityName] = customization;
                    _logger.LogDebug("Lazy-loaded customization for entity: {Entity}", entityName);
                    return _applier.ApplyCustomizations(baselineEntity, customization);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to lazy-load customization for entity {Entity}", entityName);
                // Fall through to return baseline
            }
        }

        // No customization found, return baseline
        _logger.LogDebug("No customization found for entity {Entity}, returning baseline", entityName);
        return baselineEntity;
    }

    /// <summary>
    /// Check if an entity has customizations.
    /// </summary>
    public bool HasCustomizations(string entityName)
    {
        if (string.IsNullOrEmpty(entityName))
            throw new ArgumentException("Entity name cannot be empty", nameof(entityName));

        return _cache.ContainsKey(entityName);
    }

    /// <summary>
    /// Get the cached customization for an entity without applying it.
    /// </summary>
    public CustomizationLayer? GetCustomization(string entityName)
    {
        if (string.IsNullOrEmpty(entityName))
            throw new ArgumentException("Entity name cannot be empty", nameof(entityName));

        _cache.TryGetValue(entityName, out var customization);
        return customization;
    }

    /// <summary>
    /// Refresh customization for a specific entity (reload from store).
    /// </summary>
    public async Task RefreshCustomizationAsync(
        string entityName,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(entityName))
            throw new ArgumentException("Entity name cannot be empty", nameof(entityName));

        try
        {
            _logger.LogInformation("Refreshing customization for entity: {Entity}", entityName);
            var customization = await _store.LoadAsync(entityName, cancellationToken);

            if (customization != null)
            {
                _cache[entityName] = customization;
                _logger.LogDebug("Refreshed customization for entity: {Entity}", entityName);
            }
            else
            {
                _cache.Remove(entityName);
                _logger.LogDebug("Customization removed for entity: {Entity}", entityName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to refresh customization for entity {Entity}", entityName);
            throw;
        }
    }

    /// <summary>
    /// Clear all cached customizations (useful for testing or manual cache invalidation).
    /// </summary>
    public void ClearCache()
    {
        _logger.LogInformation("Clearing runtime customization cache");
        _cache.Clear();
        _isInitialized = false;
    }

    /// <summary>
    /// Get count of cached customizations.
    /// </summary>
    public int CachedCustomizationCount => _cache.Count;
}
