#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names
#pragma warning disable CA1510 // Use ArgumentNullException.ThrowIfNull
#pragma warning disable CA1873 // Suppress logging checks (acceptable for non-hot-path)

using System.Text.Json;
using Microsoft.Extensions.Logging;
using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Baseline;

/// <summary>
/// Loads baseline Dataverse metadata from serialized sources (app.json, offline packages, etc).
/// Converts JSON schema to EntityMetadata records for use in DI and customization pipeline.
/// </summary>
public class BaselineMetadataLoader
{
    private readonly ILogger<BaselineMetadataLoader> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new() 
    { 
        PropertyNameCaseInsensitive = true 
    };

    public BaselineMetadataLoader(ILogger<BaselineMetadataLoader> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Load baseline metadata from a JSON file path.
    /// Reads the file, parses it, and converts to EntityMetadata dictionary.
    /// </summary>
    /// <param name="filePath">Path to the baseline metadata JSON file</param>
    /// <returns>Dictionary of entity logical names to EntityMetadata</returns>
    /// <exception cref="FileNotFoundException">If the file does not exist</exception>
    /// <exception cref="JsonException">If the JSON is invalid</exception>
    public async Task<Dictionary<string, EntityMetadata>> LoadFromFileAsync(
        string filePath,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            throw new ArgumentException("File path cannot be empty", nameof(filePath));

        if (!File.Exists(filePath))
        {
            _logger.LogWarning("Baseline metadata file not found: {FilePath}", filePath);
            throw new FileNotFoundException($"Baseline metadata file not found: {filePath}", filePath);
        }

        try
        {
            _logger.LogInformation("Loading baseline metadata from: {FilePath}", filePath);
            var json = await File.ReadAllTextAsync(filePath, cancellationToken);
            return ParseMetadataJson(json);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to parse baseline metadata JSON from: {FilePath}", filePath);
            throw new JsonException($"Invalid JSON in baseline metadata file: {filePath}", ex);
        }
        catch (IOException ex)
        {
            _logger.LogError(ex, "I/O error reading baseline metadata file: {FilePath}", filePath);
            throw;
        }
    }

    /// <summary>
    /// Load baseline metadata from JSON content string.
    /// Useful for testing or when metadata is embedded as a resource.
    /// </summary>
    /// <param name="jsonContent">JSON string containing baseline metadata schema</param>
    /// <returns>Dictionary of entity logical names to EntityMetadata</returns>
    public Dictionary<string, EntityMetadata> ParseMetadataJson(string jsonContent)
    {
        if (string.IsNullOrWhiteSpace(jsonContent))
        {
            _logger.LogWarning("Baseline metadata JSON content is empty, returning empty dictionary");
            return new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);
        }

        try
        {
            var schema = JsonSerializer.Deserialize<BaselineMetadataSchema>(jsonContent, JsonOptions);

            if (schema == null || schema.Entities.Count == 0)
            {
                _logger.LogWarning("Baseline metadata schema is empty or null");
                return new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);
            }

            // Validate schema version
            if (schema.Version != BaselineMetadataSchema.CurrentVersion)
            {
                _logger.LogWarning("Baseline metadata schema version {SchemaVersion} does not match current {CurrentVersion}",
                    schema.Version, BaselineMetadataSchema.CurrentVersion);
            }

            var result = new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);

            foreach (var entitySchema in schema.Entities)
            {
                try
                {
                    var entity = ConvertSchemaToEntityMetadata(entitySchema);
                    result[entity.LogicalName] = entity;
                    _logger.LogDebug("Loaded baseline metadata for entity: {Entity}", entity.LogicalName);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to convert entity schema {Entity}, skipping", entitySchema.LogicalName);
                }
            }

            _logger.LogInformation("Successfully loaded baseline metadata for {Count} entities", result.Count);
            return result;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize baseline metadata JSON");
            throw;
        }
    }

    /// <summary>
    /// Convert a BaselineEntitySchema to an EntityMetadata record.
    /// </summary>
    private static EntityMetadata ConvertSchemaToEntityMetadata(BaselineEntitySchema schema)
    {
        if (schema == null)
            throw new ArgumentNullException(nameof(schema));

        var fields = schema.Fields?
            .Select(f => ConvertSchemaToFieldMetadata(f))
            .ToList() ?? new List<FieldMetadata>();

        return new EntityMetadata(
            LogicalName: schema.LogicalName,
            DisplayName: schema.DisplayName,
            PluralName: schema.PluralName,
            Fields: fields,
            AvailableEventHandlers: schema.AvailableEventHandlers ?? new List<string>(),
            AssociatedForms: schema.AssociatedForms ?? new List<string>(),
            AssociatedViews: schema.AssociatedViews ?? new List<string>(),
            ExtendedMetadata: schema.ExtendedMetadata
        );
    }

    /// <summary>
    /// Convert a BaselineFieldSchema to a FieldMetadata record.
    /// </summary>
    private static FieldMetadata ConvertSchemaToFieldMetadata(BaselineFieldSchema schema)
    {
        if (schema == null)
            throw new ArgumentNullException(nameof(schema));

        return new FieldMetadata(
            LogicalName: schema.LogicalName,
            DisplayName: schema.DisplayName,
            AttributeType: schema.AttributeType,
            Format: schema.Format,
            MaxLength: schema.MaxLength,
            Required: schema.Required,
            IsCustom: schema.IsCustom,
            ExtendedProperties: schema.ExtendedProperties
        );
    }

    /// <summary>
    /// Merge baseline metadata from multiple sources (e.g., different offline packages).
    /// Later entries override earlier ones if they have the same entity logical name.
    /// </summary>
    /// <param name="sources">List of baseline metadata dictionaries to merge</param>
    /// <returns>Merged metadata dictionary</returns>
    public Dictionary<string, EntityMetadata> MergeMetadata(
        params Dictionary<string, EntityMetadata>[] sources)
    {
        var result = new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);

        foreach (var source in sources)
        {
            if (source == null)
                continue;

            foreach (var kvp in source)
            {
                result[kvp.Key] = kvp.Value;
                _logger.LogDebug("Merged entity metadata: {Entity}", kvp.Key);
            }
        }

        _logger.LogInformation("Merged baseline metadata from {SourceCount} sources, total {EntityCount} entities",
            sources.Length, result.Count);
        return result;
    }
}

