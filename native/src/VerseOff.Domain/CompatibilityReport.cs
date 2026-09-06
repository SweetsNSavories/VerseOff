namespace VerseOff.Domain;

public sealed record CompatibilityReport(
    CompatibilityDisposition Disposition,
    IReadOnlyList<CompatibilityIssue> Issues)
{
    public static CompatibilityReport Empty { get; } = new(
        CompatibilityDisposition.Native,
        []);

    public bool CanActivate =>
        Disposition is not CompatibilityDisposition.Blocked
        && Issues.All(issue =>
            issue.Severity is not CompatibilitySeverity.Blocking);
}

public sealed record CompatibilityIssue(
    string Code,
    CompatibilitySeverity Severity,
    string ComponentId,
    string Message,
    string? Remediation);

public enum CompatibilityDisposition
{
    Native = 0,
    Transpilable = 1,
    Fallback = 2,
    OnlineOnly = 3,
    Blocked = 4,
}

public enum CompatibilitySeverity
{
    Information = 0,
    Warning = 1,
    Error = 2,
    Blocking = 3,
}
