namespace VerseOff.Domain;

public sealed record TimelineDefinition(
    string ControlId,
    string? ClassId,
    string? CustomControlName,
    string RawControlXml,
    IReadOnlyDictionary<string, string?> RawParameters,
    IReadOnlySet<TimelineModule> EnabledModules,
    IReadOnlyList<string> EnabledActivityTypes,
    int RecordsPerPage,
    bool ShowFilterPane,
    bool ExpandFilterPane,
    bool SearchEnabled,
    bool ExpandAllByDefault,
    TimelineSortDirection SortDirection,
    string? SortColumn,
    TimelineRollupType RollupType)
{
    public string? DefaultCreateModule { get; init; }

    public string? DefaultCreateMode { get; init; }

    public IReadOnlyList<TimelineActivityConfiguration>
        ActivityConfigurations
    { get; init; } = [];

    public IReadOnlyList<TimelineCardFormBinding> CardForms { get; init; } = [];

    public IReadOnlyList<TimelineRecordSourceDefinition> RecordSources
    {
        get;
        init;
    } = [];

    public string? ActivitiesConfigurationJson { get; init; }

    public string? RecordSourcesJson { get; init; }
}

public enum TimelineModule
{
    Activities = 0,
    Notes = 1,
    Posts = 2,
}

public enum TimelineSortDirection
{
    NewestToOldest = 0,
    OldestToNewest = 1,
}

public enum TimelineRollupType
{
    None = 0,
    Related = 1,
    Extended = 2,
}

public sealed record TimelineActivityConfiguration(
    string ActivityLogicalName,
    bool IsEnabled,
    bool CanCreate,
    string CreateUsing,
    string OpenUsing,
    bool ShowStatus)
{
    public bool ShowPersona { get; init; } = true;

    public bool ShowTopDate { get; init; }

    public string? SortColumn { get; init; }

    public Guid? CardFormId { get; init; }
}

public sealed record TimelineCardFormBinding(
    string ActivityLogicalName,
    int? ObjectTypeCode,
    Guid? CardFormId);

public sealed record TimelineRecordSourceDefinition(
    string Name,
    string WebResourceName,
    string? ConstructorName);

public static class TimelineDependencyPlanner
{
    private const int MaximumDependencies = 64;

    public static IReadOnlySet<string> BuildRequiredTables(
        TimelineDefinition definition)
    {
        ArgumentNullException.ThrowIfNull(definition);

        var tables = new HashSet<string>(
            StringComparer.OrdinalIgnoreCase)
        {
            "activitypointer",
            "activityparty",
            "annotation",
            "activitymimeattachment",
            "activityfileattachment",
            "systemuser",
            "team",
            "queue",
        };
        foreach (var activity in definition.EnabledActivityTypes)
        {
            tables.Add(activity);
        }

        if (definition.EnabledModules.Contains(TimelineModule.Posts))
        {
            tables.UnionWith(
                ["post", "postcomment", "postlike", "postregarding"]);
        }

        if (tables.Count > MaximumDependencies)
        {
            throw new InvalidOperationException(
                $"Timeline dependencies exceed the bounded limit of {MaximumDependencies} tables.");
        }

        return tables;
    }
}
