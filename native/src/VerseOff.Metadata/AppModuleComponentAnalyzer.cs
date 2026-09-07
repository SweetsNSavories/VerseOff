namespace VerseOff.Metadata;

/// <summary>
/// Analyzes AppModule definitions to identify all component requirements.
/// For now: includes ALL referenced components (tables, forms, views, dashboards).
/// Later: can be filtered by config switch for smart OOTB selection.
/// </summary>
public sealed class AppModuleComponentAnalyzer
{
    /// <summary>
    /// Analyzes the selected app descriptor to identify all required components.
    /// </summary>
    public static AppModuleRequirements Analyze(ModelDrivenAppDescriptor app)
    {
        ArgumentNullException.ThrowIfNull(app);

        return new()
        {
            AppModuleId = app.AppModuleId,
            UniqueName = app.UniqueName,
            DisplayName = app.DisplayName,
            // For now, include ALL referenced components
            RequiredTableNames = app.TableLogicalNames.ToHashSet(),
            RequiredFormIds = app.FormIds.ToHashSet(),
            RequiredViewIds = new(),
            RequiredDashboardIds = new(),
            ReferencedEntityIds = app.TableLogicalNames.ToHashSet(),
        };
    }
}

/// <summary>
/// Represents the set of components required by a specific app module.
/// </summary>
public sealed record AppModuleRequirements
{
    public Guid AppModuleId { get; init; }

    public string UniqueName { get; init; } = string.Empty;

    public string DisplayName { get; init; } = string.Empty;

    /// <summary>
    /// All tables referenced by this app.
    /// </summary>
    public required HashSet<string> RequiredTableNames { get; init; }

    /// <summary>
    /// All form IDs that this app needs (declared in app metadata).
    /// </summary>
    public required HashSet<Guid> RequiredFormIds { get; init; }

    /// <summary>
    /// All view IDs that this app needs (declared in app metadata).
    /// </summary>
    public required HashSet<Guid> RequiredViewIds { get; init; }

    /// <summary>
    /// All dashboard IDs that this app needs (declared in app metadata).
    /// </summary>
    public required HashSet<Guid> RequiredDashboardIds { get; init; }

    /// <summary>
    /// All entity logical names extracted from app definition.
    /// For now: same as RequiredTableNames. Later: can be extended with usage analysis.
    /// </summary>
    public required HashSet<string> ReferencedEntityIds { get; init; }

    /// <summary>
    /// Whether to load ALL OOTB components for required entities.
    /// When true: includes all forms, views, dashboards for each entity.
    /// When false: loads only explicitly referenced components (Phase 2 optimization).
    /// </summary>
    public bool LoadAllOOTBForEntity { get; init; } = true;

    /// <summary>
    /// Optional configuration to filter components by usage pattern.
    /// If null: loads all OOTB components (default, Phase 1).
    /// If provided: only loads components matching criteria (Phase 2+).
    /// </summary>
    public ComponentFilterConfig? FilterConfig { get; init; }
}

/// <summary>
/// Configuration for filtering OOTB components by usage pattern.
/// Used in Phase 2+ to trim unnecessary metadata.
/// </summary>
public sealed record ComponentFilterConfig
{
    /// <summary>
    /// When true: only load forms/views with confirmed App Insights usage.
    /// When false: load all declared components.
    /// </summary>
    public bool UseAppInsightsFiltering { get; init; }

    /// <summary>
    /// Minimum usage count threshold (e.g., form must be opened >= MinimumUsageCount times).
    /// Ignored if UseAppInsightsFiltering is false.
    /// </summary>
    public int MinimumUsageCount { get; init; } = 1;

    /// <summary>
    /// Lookback period for telemetry (days). Default: 30 days.
    /// </summary>
    public int TelemetryLookbackDays { get; init; } = 30;

    /// <summary>
    /// Force-include critical components regardless of usage.
    /// Example: "Account lookup form for Quote app (business requirement)".
    /// </summary>
    public IReadOnlyList<CriticalComponentRequirement> CriticalComponents { get; init; } =
        new List<CriticalComponentRequirement>();
}

/// <summary>
/// Specifies a component that must be included regardless of usage metrics.
/// Used for business-critical components identified by domain experts.
/// </summary>
public sealed record CriticalComponentRequirement
{
    public required Guid ComponentId { get; init; }

    public required string ComponentType { get; init; } // "Form", "View", "Dashboard"

    public required string EntityLogicalName { get; init; }

    public required string Justification { get; init; } // "Every quote has customer; Account lookup needed"
}
