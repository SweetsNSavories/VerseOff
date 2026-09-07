#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names in log messages

using Microsoft.Extensions.Logging;
using VerseOff.Customization.Customizations;

namespace VerseOff.Customization.Storage;

/// <summary>
/// Abstraction for persisting and loading customizations.
/// Supports multiple backends (file system, database, cloud storage).
/// </summary>
public interface ICustomizationStore
{
    /// <summary>
    /// Save a customization layer for a specific entity.
    /// </summary>
    /// <param name="entityLogicalName">Entity to customize (e.g., "account")</param>
    /// <param name="customization">Customization layer to save</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task SaveAsync(string entityLogicalName, CustomizationLayer customization, CancellationToken cancellationToken = default);

    /// <summary>
    /// Load customizations for an entity.
    /// Returns null if no customizations exist.
    /// </summary>
    /// <param name="entityLogicalName">Entity to load customizations for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Customization layer or null</returns>
    Task<CustomizationLayer?> LoadAsync(string entityLogicalName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete customizations for an entity.
    /// </summary>
    /// <param name="entityLogicalName">Entity whose customizations should be deleted</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteAsync(string entityLogicalName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if customizations exist for an entity.
    /// </summary>
    /// <param name="entityLogicalName">Entity to check</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if customizations exist</returns>
    Task<bool> ExistsAsync(string entityLogicalName, CancellationToken cancellationToken = default);

    /// <summary>
    /// List all entities that have customizations.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of entity logical names with customizations</returns>
    Task<List<string>> ListCustomizedEntitiesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Export all customizations in a specified format.
    /// </summary>
    /// <param name="format">Export format (json, yaml, etc.)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Serialized customizations as string</returns>
    Task<string> ExportAsync(string format = "json", CancellationToken cancellationToken = default);

    /// <summary>
    /// Import customizations from serialized format.
    /// </summary>
    /// <param name="source">Serialized customizations</param>
    /// <param name="format">Source format (json, yaml, etc.)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task ImportAsync(string source, string format = "json", CancellationToken cancellationToken = default);
}
