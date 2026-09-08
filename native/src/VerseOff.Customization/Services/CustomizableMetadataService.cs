using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Runtime;

namespace VerseOff.Customization.Services;

/// <summary>
/// Service that wraps baseline metadata and transparently applies customizations.
/// Integrates with RuntimeCustomizationApplication to fetch cached customizations
/// and applies them to any entity metadata on demand.
/// </summary>
public class CustomizableMetadataService
{
    private readonly Dictionary<string, EntityMetadata> _baselineMetadata;
    private readonly object _baselineLock = new();
    private readonly RuntimeCustomizationApplication _runtime;
    private readonly CustomizationApplier _applier;

    /// <summary>
    /// Initializes the service with baseline metadata and customization runtime.
    /// </summary>
    /// <param name="baselineMetadata">Dictionary of entity logical names to baseline metadata</param>
    /// <param name="runtime">Runtime customization application (provides cached customizations)</param>
    /// <param name="applier">Customization applier service</param>
    public CustomizableMetadataService(
        Dictionary<string, EntityMetadata> baselineMetadata,
        RuntimeCustomizationApplication runtime,
        CustomizationApplier applier)
    {
        _baselineMetadata = baselineMetadata ?? throw new ArgumentNullException(nameof(baselineMetadata));
        _runtime = runtime ?? throw new ArgumentNullException(nameof(runtime));
        _applier = applier ?? throw new ArgumentNullException(nameof(applier));
    }

    /// <summary>
    /// Get entity metadata with customizations applied.
    /// Returns baseline metadata if no customizations exist for the entity.
    /// </summary>
    /// <param name="entityLogicalName">The entity logical name (e.g., "account", "contact")</param>
    /// <returns>Customized entity metadata, or baseline if no customizations</returns>
    public EntityMetadata GetCustomizedMetadata(string entityLogicalName)
    {
        if (string.IsNullOrWhiteSpace(entityLogicalName))
            throw new ArgumentException("Entity logical name cannot be null or empty", nameof(entityLogicalName));

        // Get baseline metadata (case-insensitive)
        EntityMetadata? baselineMetadata;
        lock (_baselineLock)
        {
            baselineMetadata = _baselineMetadata
                .FirstOrDefault(x => x.Key.Equals(entityLogicalName, StringComparison.OrdinalIgnoreCase))
                .Value;
        }

        if (baselineMetadata == null)
        {
            throw new InvalidOperationException(
                $"Baseline metadata not found for entity '{entityLogicalName}'");
        }

        // Get customization (if any) and apply
        var customization = _runtime.GetCustomization(entityLogicalName);
        if (customization == null)
        {
            return baselineMetadata;
        }

        return _applier.ApplyCustomizations(baselineMetadata, customization);
    }

    /// <summary>
    /// Get all available entities (baseline) with their logical names.
    /// </summary>
    /// <returns>Dictionary of entity logical names to metadata</returns>
    public Dictionary<string, EntityMetadata> GetAllEntities()
    {
        lock (_baselineLock)
        {
            return new Dictionary<string, EntityMetadata>(_baselineMetadata, StringComparer.OrdinalIgnoreCase);
        }
    }

    /// <summary>
    /// Get all entities with customizations applied.
    /// </summary>
    /// <returns>Dictionary of entity logical names to customized metadata</returns>
    public Dictionary<string, EntityMetadata> GetAllCustomizedEntities()
    {
        var result = new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);

        foreach (var entityName in GetEntityNames())
        {
            var customizedMetadata = GetCustomizedMetadata(entityName);
            result[entityName] = customizedMetadata;
        }

        return result;
    }

    /// <summary>
    /// Register or update baseline metadata for one or more entities.
    /// Useful for loading metadata from offline packages after service initialization.
    /// Later entries override earlier ones if they have the same entity logical name.
    /// </summary>
    /// <param name="newMetadata">Dictionary of entity logical names to baseline metadata to register</param>
    public void RegisterBaselineMetadata(Dictionary<string, EntityMetadata> newMetadata)
    {
        ArgumentNullException.ThrowIfNull(newMetadata);

        lock (_baselineLock)
        {
            foreach (var kvp in newMetadata)
            {
                _baselineMetadata[kvp.Key] = kvp.Value;
            }
        }
    }

    /// <summary>
    /// Replace the active baseline atomically.
    /// Baseline metadata is immutable between package loads; loading a new package
    /// replaces the previous app rather than leaving stale entities available.
    /// </summary>
    public void ReplaceBaselineMetadata(Dictionary<string, EntityMetadata> newMetadata)
    {
        ArgumentNullException.ThrowIfNull(newMetadata);

        lock (_baselineLock)
        {
            _baselineMetadata.Clear();
            foreach (var kvp in newMetadata)
            {
                _baselineMetadata[kvp.Key] = kvp.Value;
            }
        }
    }

    /// <summary>
    /// Remove all active baseline metadata, returning the service to an unloaded state.
    /// </summary>
    public void ClearBaselineMetadata()
    {
        lock (_baselineLock)
        {
            _baselineMetadata.Clear();
        }
    }

    private string[] GetEntityNames()
    {
        lock (_baselineLock)
        {
            return _baselineMetadata.Keys.ToArray();
        }
    }
}
