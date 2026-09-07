using System;
using System.Collections.Generic;
using System.Linq;

namespace VerseOff.Metadata;

/// <summary>
/// Performs 3-tier intelligent analysis of AppModule component requirements.
/// 
/// Three tiers of increasing accuracy (and cost):
/// 1. StaticOnly: What the AppModule metadata declares (fast, least accurate)
/// 2. WithRuntime: + real usage from App Insights (slower, good accuracy)
/// 3. WithDomainRequirements: + force-include config from domain/ProductEngineer (most control)
/// 4. Full: Combines all three (most accurate, slowest)
/// 
/// Use AnalyzeFull() for complete picture; use individual tiers for targeted analysis.
/// </summary>
public sealed class AppModuleRequirementsAnalyzer
{
    /// <summary>
    /// Analyzes only what the AppModule metadata explicitly declares.
    /// Fast, but may miss forms/views that exist but aren't referenced in metadata.
    /// </summary>
    public static AppModuleAnalysisResult AnalyzeStatic(ModelDrivenAppDescriptor appModule)
    {
        ArgumentNullException.ThrowIfNull(appModule);

        var components = AppModuleComponentAnalyzer.Analyze(appModule);

        return new AppModuleAnalysisResult
        {
            AppId = appModule.AppModuleId,
            AppName = appModule.DisplayName,
            AnalysisTier = AnalysisTier.StaticOnly,
            RequiredTables = new HashSet<string>(
                components.RequiredTableNames,
                StringComparer.OrdinalIgnoreCase),
            RequiredFormIds = new HashSet<Guid>(components.RequiredFormIds),
            RequiredViewIds = new HashSet<Guid>(components.RequiredViewIds),
            RequiredDashboardIds = new HashSet<Guid>(components.RequiredDashboardIds),
            EstimatedPayloadSize = EstimateSizeBytes(components),
            Components = components,
        };
    }

    /// <summary>
    /// Analyzes an AppModule combined with runtime usage data from App Insights.
    /// Filters to only components that were actually used by real users.
    /// </summary>
    public static AppModuleAnalysisResult AnalyzeWithRuntime(
        ModelDrivenAppDescriptor appModule,
        AppInsightsUsageReport? usageReport = null)
    {
        var staticResult = AnalyzeStatic(appModule);

        if (usageReport == null || !usageReport.HasData)
        {
            return staticResult;
        }

        // Filter to only components accessed in the usage window
        var usedForms = staticResult.RequiredFormIds
            .Where(formId => usageReport.AccessedFormIds.Contains(formId))
            .ToHashSet();

        var usedViews = staticResult.RequiredViewIds
            .Where(viewId => usageReport.AccessedViewIds.Contains(viewId))
            .ToHashSet();

        var usedTables = staticResult.RequiredTables
            .Where(tableName => usageReport.AccessedTables.Contains(tableName))
            .ToHashSet();

        return new AppModuleAnalysisResult
        {
            AppId = appModule.AppModuleId,
            AppName = appModule.DisplayName,
            AnalysisTier = AnalysisTier.WithRuntime,
            RequiredTables = usedTables,
            RequiredFormIds = usedForms,
            RequiredViewIds = usedViews,
            RequiredDashboardIds = new HashSet<Guid>(),
            EstimatedPayloadSize = EstimateSizeBytes(usedTables, usedForms, usedViews, new HashSet<Guid>()),
            Components = staticResult.Components,
            UsageDataSource = usageReport,
        };
    }

    /// <summary>
    /// Analyzes with domain-level force-includes from ProductEngineer requirements.
    /// Merges AppModule metadata + domain config to ensure critical components always packaged.
    /// </summary>
    public static AppModuleAnalysisResult AnalyzeWithDomainRequirements(
        ModelDrivenAppDescriptor appModule,
        DomainRequirementsConfig? domainConfig = null)
    {
        var staticResult = AnalyzeStatic(appModule);

        if (domainConfig == null || !domainConfig.HasRequirements)
        {
            return staticResult;
        }

        // Merge: static + domain force-includes
        var finalTables = new HashSet<string>(staticResult.RequiredTables, StringComparer.OrdinalIgnoreCase);
        finalTables.UnionWith(domainConfig.ForceIncludeTables);

        var finalForms = new HashSet<Guid>(staticResult.RequiredFormIds);
        finalForms.UnionWith(domainConfig.ForceIncludeFormIds);

        var finalViews = new HashSet<Guid>(staticResult.RequiredViewIds);
        finalViews.UnionWith(domainConfig.ForceIncludeViewIds);

        return new AppModuleAnalysisResult
        {
            AppId = appModule.AppModuleId,
            AppName = appModule.DisplayName,
            AnalysisTier = AnalysisTier.WithDomainRequirements,
            RequiredTables = finalTables,
            RequiredFormIds = finalForms,
            RequiredViewIds = finalViews,
            RequiredDashboardIds = staticResult.RequiredDashboardIds,
            EstimatedPayloadSize = EstimateSizeBytes(finalTables, finalForms, finalViews, (HashSet<Guid>)staticResult.RequiredDashboardIds),
            Components = staticResult.Components,
            DomainConfig = domainConfig,
        };
    }

    /// <summary>
    /// Full 3-tier analysis: static + runtime + domain requirements.
    /// Most expensive but most accurate.
    /// </summary>
    public static AppModuleAnalysisResult AnalyzeFull(
        ModelDrivenAppDescriptor appModule,
        AppInsightsUsageReport? usageReport = null,
        DomainRequirementsConfig? domainConfig = null)
    {
        var staticResult = AnalyzeStatic(appModule);

        // Start with static
        var componentSet = new HashSet<Guid>(staticResult.RequiredFormIds);
        var viewSet = new HashSet<Guid>(staticResult.RequiredViewIds);
        var tableSet = new HashSet<string>(staticResult.RequiredTables, StringComparer.OrdinalIgnoreCase);

        // Apply runtime filter if available
        if (usageReport != null && usageReport.HasData)
        {
            componentSet = componentSet
                .Where(fid => usageReport.AccessedFormIds.Contains(fid))
                .ToHashSet();
            viewSet = viewSet
                .Where(vid => usageReport.AccessedViewIds.Contains(vid))
                .ToHashSet();
            tableSet = tableSet
                .Where(tn => usageReport.AccessedTables.Contains(tn))
                .ToHashSet();
        }

        // Apply domain force-includes if available
        if (domainConfig != null && domainConfig.HasRequirements)
        {
            componentSet.UnionWith(domainConfig.ForceIncludeFormIds);
            viewSet.UnionWith(domainConfig.ForceIncludeViewIds);
            tableSet.UnionWith(domainConfig.ForceIncludeTables);
        }

        return new AppModuleAnalysisResult
        {
            AppId = appModule.AppModuleId,
            AppName = appModule.DisplayName,
            AnalysisTier = AnalysisTier.Full,
            RequiredTables = tableSet,
            RequiredFormIds = componentSet,
            RequiredViewIds = viewSet,
            RequiredDashboardIds = staticResult.RequiredDashboardIds,
            EstimatedPayloadSize = EstimateSizeBytes(tableSet, componentSet, viewSet, (HashSet<Guid>)staticResult.RequiredDashboardIds),
            Components = staticResult.Components,
            UsageDataSource = usageReport,
            DomainConfig = domainConfig,
        };
    }

    /// <summary>
    /// Estimates metadata payload size based on component counts.
    /// Rules of thumb: table ~200B, form ~15KB, view ~3KB, dashboard ~10KB
    /// </summary>
    private static long EstimateSizeBytes(AppModuleRequirements components)
    {
        return components.RequiredTableNames.Count * 200
            + components.RequiredFormIds.Count * 15000
            + components.RequiredViewIds.Count * 3000
            + components.RequiredDashboardIds.Count * 10000;
    }

    private static long EstimateSizeBytes(
        HashSet<string> tables,
        HashSet<Guid> forms,
        HashSet<Guid> views,
        HashSet<Guid> dashboards)
    {
        return tables.Count * 200
            + forms.Count * 15000
            + views.Count * 3000
            + dashboards.Count * 10000;
    }
}

/// <summary>
/// Represents analysis results for a single AppModule across one or more tiers.
/// </summary>
public sealed record AppModuleAnalysisResult
{
    /// <summary>
    /// The AppModuleId being analyzed.
    /// </summary>
    public required Guid AppId { get; init; }

    /// <summary>
    /// Display name of the app (for reporting).
    /// </summary>
    public required string AppName { get; init; }

    /// <summary>
    /// Which analysis tier(s) were used to produce this result.
    /// </summary>
    public required AnalysisTier AnalysisTier { get; init; }

    /// <summary>
    /// Logical names of all tables to include.
    /// </summary>
    public required ISet<string> RequiredTables { get; init; }

    /// <summary>
    /// IDs of all forms to include.
    /// </summary>
    public required ISet<Guid> RequiredFormIds { get; init; }

    /// <summary>
    /// IDs of all views to include.
    /// </summary>
    public required ISet<Guid> RequiredViewIds { get; init; }

    /// <summary>
    /// IDs of all dashboards to include.
    /// </summary>
    public required ISet<Guid> RequiredDashboardIds { get; init; }

    /// <summary>
    /// Estimated size in bytes of the OOTB metadata payload if packaged with these components.
    /// </summary>
    public required long EstimatedPayloadSize { get; init; }

    /// <summary>
    /// Reference to the original component analysis for debugging/tracing.
    /// </summary>
    public required AppModuleRequirements Components { get; init; }

    /// <summary>
    /// The App Insights usage report used (if AnalysisTier includes runtime).
    /// </summary>
    public AppInsightsUsageReport? UsageDataSource { get; init; }

    /// <summary>
    /// The domain config used (if AnalysisTier includes domain requirements).
    /// </summary>
    public DomainRequirementsConfig? DomainConfig { get; init; }
}

/// <summary>
/// Describes which tier(s) of analysis were applied.
/// </summary>
[Flags]
public enum AnalysisTier
{
    /// <summary>
    /// AppModule metadata references only.
    /// </summary>
    StaticOnly = 1,

    /// <summary>
    /// Static + App Insights usage data.
    /// </summary>
    WithRuntime = 2,

    /// <summary>
    /// Static + domain/ProductEngineer force-includes.
    /// </summary>
    WithDomainRequirements = 4,

    /// <summary>
    /// All three tiers combined.
    /// </summary>
    Full = StaticOnly | WithRuntime | WithDomainRequirements,
}
