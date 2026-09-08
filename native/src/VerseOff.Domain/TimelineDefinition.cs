namespace VerseOff.Domain;

public sealed record TimelineDefinition(
    string ControlId,
    string? ClassId,
    string? CustomControlName,
    string RawControlXml,
    IReadOnlyDictionary<string, string?> RawParameters,
    IReadOnlyList<TimelineModule> EnabledModules,
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

    /// <summary>
    /// Expands Timeline dependencies through the application relationship graph.
    /// Only relationships reachable from enabled activity tables are included,
    /// and traversal is bounded to keep offline packages predictable.
    /// </summary>
    public static IReadOnlySet<string> BuildRequiredTables(
        TimelineDefinition definition,
        IReadOnlyList<TableDefinition> applicationTables,
        int maximumRelationshipDepth = 2)
    {
        ArgumentNullException.ThrowIfNull(definition);
        ArgumentNullException.ThrowIfNull(applicationTables);
        ArgumentOutOfRangeException.ThrowIfNegative(maximumRelationshipDepth);

        var tables = new HashSet<string>(
            BuildRequiredTables(definition),
            StringComparer.OrdinalIgnoreCase);
        var tableMap = applicationTables.ToDictionary(
            table => table.LogicalName,
            StringComparer.OrdinalIgnoreCase);
        var queue = new Queue<(string TableName, int Depth)>();

        foreach (var tableName in tables.ToArray())
        {
            if (tableMap.ContainsKey(tableName))
            {
                queue.Enqueue((tableName, 0));
            }
        }

        while (queue.Count > 0)
        {
            var (tableName, depth) = queue.Dequeue();
            if (depth >= maximumRelationshipDepth
                || !tableMap.TryGetValue(tableName, out var table))
            {
                continue;
            }

            foreach (var relationship in table.Relationships)
            {
                var relatedTable = string.Equals(
                    relationship.ReferencingTable,
                    tableName,
                    StringComparison.OrdinalIgnoreCase)
                    ? relationship.ReferencedTable
                    : relationship.ReferencingTable;

                if (string.IsNullOrWhiteSpace(relatedTable)
                    || !tables.Add(relatedTable))
                {
                    continue;
                }

                if (tableMap.ContainsKey(relatedTable))
                {
                    queue.Enqueue((relatedTable, depth + 1));
                }

                if (tables.Count > MaximumDependencies)
                {
                    throw new InvalidOperationException(
                        $"Timeline dependencies exceed the bounded limit of {MaximumDependencies} tables.");
                }
            }
        }

        return tables;
    }

    /// <summary>
    /// Returns Card form IDs configured for enabled Timeline activities.
    /// </summary>
    public static IReadOnlySet<Guid> BuildRequiredCardForms(
        TimelineDefinition definition)
    {
        ArgumentNullException.ThrowIfNull(definition);
        var enabledActivities = definition.EnabledActivityTypes.ToHashSet(
            StringComparer.OrdinalIgnoreCase);

        return definition.CardForms
            .Where(binding => binding.CardFormId.HasValue
                && enabledActivities.Contains(binding.ActivityLogicalName))
            .Select(binding => binding.CardFormId!.Value)
            .ToHashSet();
    }
}
