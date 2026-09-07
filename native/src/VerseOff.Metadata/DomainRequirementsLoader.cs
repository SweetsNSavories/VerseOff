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
        ArgumentNullException.ThrowIfNull(yamlContent);
        if (string.IsNullOrWhiteSpace(yamlContent))
        {
            return new DomainRequirementsConfig { Source = source };
        }

        return ParseYaml(yamlContent, source);
    }

    /// <summary>
    /// Loads domain requirements from a string (alias for LoadFromYamlString).
    /// </summary>
    public static DomainRequirementsConfig LoadFromString(string yamlContent, string? source = null) =>
        LoadFromYamlString(yamlContent, source);

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

            string? appName = null;
            if (config.TryGetValue("appName", out var appNameObj) && appNameObj is string appNameStr)
            {
                appName = appNameStr;
            }

            string? version = null;
            if (config.TryGetValue("version", out var versionObj) && versionObj is string versionStr)
            {
                version = versionStr;
            }

            string? offlineSyncFilterProfile = null;
            if (config.TryGetValue("offlineSyncFilterProfile", out var profileObj) && profileObj is string profileStr)
            {
                offlineSyncFilterProfile = profileStr;
            }

            string? conflictResolutionStrategy = null;
            if (config.TryGetValue("conflictResolutionStrategy", out var conflictObj) && conflictObj is string conflictStr)
            {
                conflictResolutionStrategy = conflictStr;
            }

            var partitionFilters = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            if (config.TryGetValue("offlineTablePartitionFilter", out var filterObj) &&
                filterObj is System.Collections.IDictionary filterDict)
            {
                foreach (System.Collections.DictionaryEntry entry in filterDict)
                {
                    var k = entry.Key?.ToString();
                    var v = entry.Value?.ToString();
                    if (!string.IsNullOrEmpty(k) && v is not null)
                    {
                        partitionFilters[k] = v;
                    }
                }
            }

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

            var hasRequirements = tables.Count > 0 || formIds.Count > 0 || viewIds.Count > 0 ||
                !string.IsNullOrEmpty(appName) || !string.IsNullOrEmpty(conflictResolutionStrategy);

            return new DomainRequirementsConfig
            {
                HasRequirements = hasRequirements,
                AppName = appName,
                Version = version,
                OfflineSyncFilterProfile = offlineSyncFilterProfile,
                ConflictResolutionStrategy = conflictResolutionStrategy,
                OfflineTablePartitionFilter = partitionFilters,
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
/// Queries telemetry to determine which forms/views users actually access.
/// </summary>
public sealed class AppInsightsUsageAnalyzer
{
    private readonly string? instrumentationKey;
    private readonly Func<string, Task<string>>? queryExecutor;

    public AppInsightsUsageAnalyzer(
        string? instrumentationKey = null,
        Func<string, Task<string>>? queryExecutor = null)
    {
        this.instrumentationKey = instrumentationKey;
        this.queryExecutor = queryExecutor;
    }

    /// <summary>
    /// Builds the standard KQL query to extract accessed tables, forms, and views for an AppModule.
    /// </summary>
    public static string BuildKqlQuery(
        Guid appId,
        DateTime lookbackStart,
        DateTime lookbackEnd)
    {
        var startIso = lookbackStart.ToString("o", System.Globalization.CultureInfo.InvariantCulture);
        var endIso = lookbackEnd.ToString("o", System.Globalization.CultureInfo.InvariantCulture);
        var appIdStr = appId.ToString("D", System.Globalization.CultureInfo.InvariantCulture);

        return $"""
        union isfuzzy=true
            (customEvents
            | where timestamp >= datetime({startIso}) and timestamp <= datetime({endIso})
            | where customDimensions["appId"] =~ "{appIdStr}" or customDimensions["AppModuleId"] =~ "{appIdStr}"
            | project timestamp,
                      Entity = tostring(coalesce(customDimensions["entityName"], customDimensions["entity"], customDimensions["tableName"])),
                      FormId = tostring(coalesce(customDimensions["formId"], customDimensions["formid"])),
                      ViewId = tostring(coalesce(customDimensions["viewId"], customDimensions["viewid"]))),
            (pageViews
            | where timestamp >= datetime({startIso}) and timestamp <= datetime({endIso})
            | where customDimensions["appId"] =~ "{appIdStr}" or customDimensions["AppModuleId"] =~ "{appIdStr}"
            | project timestamp,
                      Entity = tostring(coalesce(customDimensions["entityName"], customDimensions["entity"], customDimensions["tableName"])),
                      FormId = tostring(coalesce(customDimensions["formId"], customDimensions["formid"])),
                      ViewId = tostring(coalesce(customDimensions["viewId"], customDimensions["viewid"])))
        | where isnotempty(Entity) or isnotempty(FormId) or isnotempty(ViewId)
        | summarize EventCount = count() by Entity, FormId, ViewId
        """;
    }

    /// <summary>
    /// Parses JSON response returned by the Azure Monitor / Log Analytics REST API.
    /// Schema: { "tables": [ { "name": "PrimaryResult", "columns": [...], "rows": [ [...] ] } ] }
    /// </summary>
    public static AppInsightsUsageReport ParseQueryResult(
        string jsonResponse,
        DateTime lookbackStart,
        DateTime lookbackEnd)
    {
        if (string.IsNullOrWhiteSpace(jsonResponse))
        {
            return new AppInsightsUsageReport
            {
                HasData = false,
                LookbackStart = lookbackStart,
                LookbackEnd = lookbackEnd,
            };
        }

        using var doc = System.Text.Json.JsonDocument.Parse(jsonResponse);
        var root = doc.RootElement;

        var forms = new HashSet<Guid>();
        var views = new HashSet<Guid>();
        var tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (root.TryGetProperty("tables", out var tablesElement) &&
            tablesElement.ValueKind == System.Text.Json.JsonValueKind.Array &&
            tablesElement.GetArrayLength() > 0)
        {
            var table0 = tablesElement[0];
            if (table0.TryGetProperty("columns", out var columnsElement) &&
                table0.TryGetProperty("rows", out var rowsElement) &&
                rowsElement.ValueKind == System.Text.Json.JsonValueKind.Array)
            {
                var colIndex = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                var idx = 0;
                foreach (var col in columnsElement.EnumerateArray())
                {
                    if (col.TryGetProperty("name", out var nameProp))
                    {
                        var colName = nameProp.GetString();
                        if (!string.IsNullOrEmpty(colName))
                        {
                            colIndex[colName] = idx;
                        }
                    }
                    idx++;
                }

                colIndex.TryGetValue("Entity", out var entityIdx);
                colIndex.TryGetValue("FormId", out var formIdx);
                colIndex.TryGetValue("ViewId", out var viewIdx);

                foreach (var row in rowsElement.EnumerateArray())
                {
                    if (row.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        var rowItems = row.EnumerateArray().ToArray();

                        if (colIndex.ContainsKey("Entity") && entityIdx < rowItems.Length)
                        {
                            var val = rowItems[entityIdx].GetString();
                            if (!string.IsNullOrWhiteSpace(val))
                            {
                                tables.Add(val.Trim());
                            }
                        }

                        if (colIndex.ContainsKey("FormId") && formIdx < rowItems.Length)
                        {
                            var val = rowItems[formIdx].GetString();
                            if (Guid.TryParse(val, out var formGuid) && formGuid != Guid.Empty)
                            {
                                forms.Add(formGuid);
                            }
                        }

                        if (colIndex.ContainsKey("ViewId") && viewIdx < rowItems.Length)
                        {
                            var val = rowItems[viewIdx].GetString();
                            if (Guid.TryParse(val, out var viewGuid) && viewGuid != Guid.Empty)
                            {
                                views.Add(viewGuid);
                            }
                        }
                    }
                }
            }
        }

        var hasData = tables.Count > 0 || forms.Count > 0 || views.Count > 0;

        return new AppInsightsUsageReport
        {
            HasData = hasData,
            AccessedTables = tables,
            AccessedFormIds = forms,
            AccessedViewIds = views,
            LookbackStart = lookbackStart,
            LookbackEnd = lookbackEnd,
        };
    }

    /// <summary>
    /// Queries App Insights for usage data on the given app.
    /// Returns null if no telemetry or query executor is available.
    /// </summary>
    public async Task<AppInsightsUsageReport?> AnalyzeAppUsageAsync(
        Guid appId,
        DateTime? lookbackStart = null,
        DateTime? lookbackEnd = null)
    {
        if (string.IsNullOrEmpty(this.instrumentationKey) && this.queryExecutor is null)
        {
            return null; // No instrumentation or query executor configured
        }

        var start = lookbackStart ?? DateTime.UtcNow.AddDays(-30);
        var end = lookbackEnd ?? DateTime.UtcNow;

        try
        {
            var kql = BuildKqlQuery(appId, start, end);

            if (this.queryExecutor is not null)
            {
                var jsonResult = await this.queryExecutor(kql).ConfigureAwait(false);
                return ParseQueryResult(jsonResult, start, end);
            }

            return null;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(
                $"Failed to query App Insights: {ex.Message}");
            return null;
        }
    }

    /// <summary>
    /// Queries App Insights for usage data on the given app (synchronous wrapper).
    /// Returns null if no telemetry is available.
    /// </summary>
    public AppInsightsUsageReport? AnalyzeAppUsage(
        Guid appId,
        DateTime? lookbackStart = null,
        DateTime? lookbackEnd = null)
    {
        return AnalyzeAppUsageAsync(appId, lookbackStart, lookbackEnd).GetAwaiter().GetResult();
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
    /// Optional application name override.
    /// </summary>
    public string? AppName { get; init; }

    /// <summary>
    /// Optional application version.
    /// </summary>
    public string? Version { get; init; }

    /// <summary>
    /// Optional mobile offline profile name.
    /// </summary>
    public string? OfflineSyncFilterProfile { get; init; }

    /// <summary>
    /// Configurable conflict resolution strategy (e.g. "ServerWins", "ClientWins", "FieldLevelMerge").
    /// </summary>
    public string? ConflictResolutionStrategy { get; init; }

    /// <summary>
    /// Offline table partition filter expressions.
    /// </summary>
    public IReadOnlyDictionary<string, string> OfflineTablePartitionFilter { get; init; } =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

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
