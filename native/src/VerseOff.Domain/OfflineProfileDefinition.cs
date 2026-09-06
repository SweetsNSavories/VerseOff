namespace VerseOff.Domain;

public sealed record OfflineProfileDefinition(
    Guid ProfileId,
    string Name,
    IReadOnlyList<OfflineProfileItemDefinition> Items,
    string SourceHash)
{
    public int Version { get; init; } = 1;

    public DateTimeOffset GeneratedAt { get; init; }

    public BcdrProfileOverlay Overlay { get; init; } = BcdrProfileOverlay.Empty;
}

public sealed record OfflineProfileItemDefinition(
    string TableLogicalName,
    string FetchXml,
    IReadOnlyList<string> RelationshipNames)
{
    public int? MaximumRecordCount { get; init; }

    public bool IncludeAttachments { get; init; }

    public long? MaximumAttachmentBytes { get; init; }

    public bool IsReadOnly { get; init; }

    public int SyncPriority { get; init; }

    public ConflictStrategy ConflictStrategy { get; init; } =
        ConflictStrategy.ServerWins;
}

public sealed record BcdrProfileOverlay(
    IReadOnlyList<string> EmergencyTableNames,
    TimeSpan MaximumSecuritySnapshotAge,
    TimeSpan RetentionPeriod,
    bool RequireWifi,
    bool RequireCharging)
{
    public static BcdrProfileOverlay Empty { get; } = new(
        [],
        TimeSpan.FromHours(24),
        TimeSpan.FromDays(30),
        RequireWifi: false,
        RequireCharging: false);
}

public enum ConflictStrategy
{
    ServerWins = 0,
    ClientWins = 1,
    ManualReview = 2,
    RejectLocalChange = 3,
}
