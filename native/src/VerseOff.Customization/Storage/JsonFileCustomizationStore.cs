#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names in log messages
#pragma warning disable CA1873 // Expensive operations in logging
#pragma warning disable CA1510 // Use ArgumentNullException.ThrowIfNull

using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using VerseOff.Customization.Customizations;

namespace VerseOff.Customization.Storage;

/// <summary>
/// File-based customization store using JSON format.
/// Stores one customization file per entity in a configurable directory.
/// Thread-safe with async I/O.
/// </summary>
public class JsonFileCustomizationStore : ICustomizationStore
{
    private readonly string _basePath;
    private readonly ILogger<JsonFileCustomizationStore> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public JsonFileCustomizationStore(string basePath, ILogger<JsonFileCustomizationStore> logger)
    {
        _basePath = basePath ?? throw new ArgumentNullException(nameof(basePath));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
            _logger.LogInformation("Created customization store directory: {Path}", _basePath);
        }
    }

    public async Task SaveAsync(string entityLogicalName, CustomizationLayer customization, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(entityLogicalName))
            throw new ArgumentException("Entity logical name cannot be empty", nameof(entityLogicalName));

        if (customization == null)
            throw new ArgumentNullException(nameof(customization));

        var filePath = GetFilePath(entityLogicalName);
        try
        {
            var json = JsonSerializer.Serialize(customization, JsonOptions);
            await File.WriteAllTextAsync(filePath, json, cancellationToken);
            _logger.LogInformation("Saved customizations for entity: {Entity}", entityLogicalName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save customizations for entity: {Entity}", entityLogicalName);
            throw;
        }
    }

    public async Task<CustomizationLayer?> LoadAsync(string entityLogicalName, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(entityLogicalName))
            throw new ArgumentException("Entity logical name cannot be empty", nameof(entityLogicalName));

        var filePath = GetFilePath(entityLogicalName);

        if (!File.Exists(filePath))
        {
            _logger.LogDebug("No customizations found for entity: {Entity}", entityLogicalName);
            return null;
        }

        try
        {
            var json = await File.ReadAllTextAsync(filePath, cancellationToken);
            var customization = JsonSerializer.Deserialize<CustomizationLayer>(json, JsonOptions);
            _logger.LogInformation("Loaded customizations for entity: {Entity}", entityLogicalName);
            return customization;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load customizations for entity: {Entity}", entityLogicalName);
            throw;
        }
    }

    public async Task DeleteAsync(string entityLogicalName, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(entityLogicalName))
            throw new ArgumentException("Entity logical name cannot be empty", nameof(entityLogicalName));

        var filePath = GetFilePath(entityLogicalName);

        try
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                _logger.LogInformation("Deleted customizations for entity: {Entity}", entityLogicalName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete customizations for entity: {Entity}", entityLogicalName);
            throw;
        }

        await Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(string entityLogicalName, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(entityLogicalName))
            throw new ArgumentException("Entity logical name cannot be empty", nameof(entityLogicalName));

        var filePath = GetFilePath(entityLogicalName);
        return await Task.FromResult(File.Exists(filePath));
    }

    public async Task<List<string>> ListCustomizedEntitiesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var entities = Directory
                .GetFiles(_basePath, "*.json")
                .Select(f => Path.GetFileNameWithoutExtension(f))
                .ToList();

            _logger.LogInformation("Found {Count} customized entities", entities.Count);
            return await Task.FromResult(entities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list customized entities");
            throw;
        }
    }

    public async Task<string> ExportAsync(string format = "json", CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(format) || !format.Equals("json", StringComparison.OrdinalIgnoreCase))
            throw new NotSupportedException($"Format '{format}' is not supported. Only 'json' is currently supported.");

        try
        {
            var entities = await ListCustomizedEntitiesAsync(cancellationToken);
            var allCustomizations = new Dictionary<string, CustomizationLayer>();

            foreach (var entity in entities)
            {
                var customization = await LoadAsync(entity, cancellationToken);
                if (customization != null)
                {
                    allCustomizations[entity] = customization;
                }
            }

            var json = JsonSerializer.Serialize(allCustomizations, JsonOptions);
            _logger.LogInformation("Exported {Count} customizations", allCustomizations.Count);
            return json;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to export customizations");
            throw;
        }
    }

    public async Task ImportAsync(string source, string format = "json", CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(source))
            throw new ArgumentException("Import source cannot be empty", nameof(source));

        if (string.IsNullOrEmpty(format) || !format.Equals("json", StringComparison.OrdinalIgnoreCase))
            throw new NotSupportedException($"Format '{format}' is not supported. Only 'json' is currently supported.");

        try
        {
            var customizations = JsonSerializer.Deserialize<Dictionary<string, CustomizationLayer>>(source, JsonOptions);

            if (customizations == null)
            {
                _logger.LogWarning("Import source deserialized to null");
                return;
            }

            foreach (var (entity, customization) in customizations)
            {
                await SaveAsync(entity, customization, cancellationToken);
            }

            _logger.LogInformation("Imported {Count} customizations", customizations.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to import customizations");
            throw;
        }
    }

    private string GetFilePath(string entityLogicalName) =>
        Path.Combine(_basePath, $"{entityLogicalName}.json");
}
