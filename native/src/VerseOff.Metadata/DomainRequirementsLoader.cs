using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using YamlDotNet.RepresentationModel;
using YamlDotNet.Serialization;

namespace VerseOff.Metadata;

/// <summary>
/// Loads domain requirements from a YAML configuration file.
/// Example:
/// 
/// forceIncludeTables:
///   - quote
///   - quotedetail
///   - account
///   - contact
/// forceIncludeForms:
///   - 00000000-0000-0000-0000-000000000001
/// forceIncludeViews:
///   - 00000000-0000-0000-0000-000000000002
/// 
/// This ensures critical entities are always packaged, even if not used recently.
/// </summary>
public sealed class DomainRequirementsLoader
{
    private static readonly IDeserializer Deserializer = new DeserializerBuilder().Build();

    /// <summary>
    /// Loads domain requirements from a YAML file.
    /// </summary>
    public static DomainRequirementsConfig LoadFromYaml(string filePath)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(filePath);

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"Domain requirements file not found: {filePath}");
        }

        var yaml = File.ReadAllText(filePath);
        return ParseYaml(yaml, filePath);
    }

    /// <summary>
    /// Loads domain requirements from a YAML string.
    /// </summary>
    public static DomainRequirementsConfig LoadFromYamlString(string yamlContent, string? source = null)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(yamlContent);
        return ParseYaml(yamlContent, source);
    }

    private static DomainRequirementsConfig ParseYaml(string yaml, string? source = null)
    {
        try
        {
            var deserializer = new DeserializerBuilder()
                .IgnoreUnmatchedProperties()
                .Build();

            var config = deserializer.Deserialize<Dictionary<string, object>>(yaml);

            if (config == null)
            {
                return new DomainRequirementsConfig { Source = source };
            }

            var tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            var formIds = new HashSet<Guid>();
            var viewIds = new HashSet<Guid>();

            // Parse forceIncludeTables
            if (config.TryGetValue("forceIncludeTables", out var tablesObj))
            {
                if (tablesObj is List<object> tableList)
                {
                    foreach (var table in tableList)
                    {
                        if (table is string tableName && !string.IsNullOrEmpty(tableName))
                        {
                            tables.Add(tableName);
                        }
                    }
                }
            }

            // Parse forceIncludeForms
            if (config.TryGetValue("forceIncludeForms", out var formsObj))
            {
                if (formsObj is List<object> formList)
                {
                    foreach (var form in formList)
                    {
                        if (form is string formStr && Guid.TryParse(formStr, out var formId))
                        {
                            formIds.Add(formId);
                        }
                    }
                }
            }

            // Parse forceIncludeViews
            if (config.TryGetValue("forceIncludeViews", out var viewsObj))
            {
                if (viewsObj is List<object> viewList)
                {
                    foreach (var view in viewList)
                    {
                        if (view is string viewStr && Guid.TryParse(viewStr, out var viewId))
                        {
                            viewIds.Add(viewId);
                        }
                    }
                }
            }

            var hasRequirements = tables.Count > 0 || formIds.Count > 0 || viewIds.Count > 0;

            return new DomainRequirementsConfig
            {
                HasRequirements = hasRequirements,
                ForceIncludeTables = tables,
                ForceIncludeFormIds = formIds,
                ForceIncludeViewIds = viewIds,
                Source = source,
            };
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(
                $"Failed to parse domain requirements YAML: {ex.Message}");
            return new DomainRequirementsConfig { Source = source };
        }
    }
}

/// <summary>
/// Fetches usage data from App Insights.
/// Queries the last 30 days of telemetry to determine which forms/views users actually access.
/// </summary>
public sealed class AppInsightsUsageAnalyzer
{
    private readonly string? instrumentationKey;

    public AppInsightsUsageAnalyzer(string? instrumentationKey = null)
    {
        this.instrumentationKey = instrumentationKey;
    }

    /// <summary>
    /// Queries App Insights for usage data on the given app.
    /// Returns null if no telemetry is available.
    /// </summary>
    public AppInsightsUsageReport? AnalyzeAppUsage(
        Guid appId,
        DateTime? lookbackStart = null,
        DateTime? lookbackEnd = null)
    {
        if (string.IsNullOrEmpty(instrumentationKey))
        {
            return null; // No instrumentation configured
        }

        lookbackStart ??= DateTime.UtcNow.AddDays(-30);
        lookbackEnd ??= DateTime.UtcNow;

        try
        {
            // TODO: Implement App Insights KQL query
            // This is a placeholder showing the structure.
            // Actual implementation requires:
            // 1. Microsoft.ApplicationInsights.WorkspaceQuery SDK
            // 2. Authentication via AAD
            // 3. KQL query to extract form/view access patterns

            return null;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(
                $"Failed to query App Insights: {ex.Message}");
            return null;
        }
    }
}

/// <summary>
/// Represents a configuration of required components from domain/ProductEngineer.
/// Force-includes ensure critical OOTB components are always packaged.
/// </summary>
public sealed record DomainRequirementsConfig
{
    /// <summary>
    /// Whether this config has any requirements set.
    /// </summary>
    public bool HasRequirements { get; init; }

    /// <summary>
    /// Logical names of tables to always include.
    /// </summary>
    public ISet<string> ForceIncludeTables { get; init; } = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Form IDs to always include.
    /// </summary>
    public ISet<Guid> ForceIncludeFormIds { get; init; } = new HashSet<Guid>();

    /// <summary>
    /// View IDs to always include.
    /// </summary>
    public ISet<Guid> ForceIncludeViewIds { get; init; } = new HashSet<Guid>();

    /// <summary>
    /// Source file path or description for tracing.
    /// </summary>
    public string? Source { get; init; }
}

/// <summary>
/// Represents App Insights usage telemetry for a specific app.
/// Shows which forms, views, and tables were accessed by users.
/// </summary>
public sealed record AppInsightsUsageReport
{
    /// <summary>
    /// Whether the report has any data.
    /// </summary>
    public bool HasData { get; init; }

    /// <summary>
    /// Form IDs that were accessed.
    /// </summary>
    public ISet<Guid> AccessedFormIds { get; init; } = new HashSet<Guid>();

    /// <summary>
    /// View IDs that were accessed.
    /// </summary>
    public ISet<Guid> AccessedViewIds { get; init; } = new HashSet<Guid>();

    /// <summary>
    /// Table logical names that were accessed.
    /// </summary>
    public ISet<string> AccessedTables { get; init; } = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Time window of the report (lookback period).
    /// </summary>
    public DateTime? LookbackStart { get; init; }

    /// <summary>
    /// End of the lookback window.
    /// </summary>
    public DateTime? LookbackEnd { get; init; }
}
