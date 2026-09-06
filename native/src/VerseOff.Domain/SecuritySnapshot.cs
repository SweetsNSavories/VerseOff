namespace VerseOff.Domain;

public sealed record SecuritySnapshot(
    string Version,
    Guid TenantId,
    Guid UserObjectId,
    Guid EnvironmentId,
    DateTimeOffset IssuedAt,
    DateTimeOffset ExpiresAt,
    IReadOnlyList<TableAccessGrant> TablePermissions)
{
    public bool IsValidAt(DateTimeOffset now) =>
        !string.IsNullOrWhiteSpace(Version)
        && TenantId != Guid.Empty
        && UserObjectId != Guid.Empty
        && EnvironmentId != Guid.Empty
        && ExpiresAt > IssuedAt
        && now >= IssuedAt
        && now < ExpiresAt;

    public TableAccessGrant? FindTable(string logicalName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(logicalName);
        return TablePermissions.FirstOrDefault(permission =>
            string.Equals(
                permission.TableLogicalName,
                logicalName,
                StringComparison.OrdinalIgnoreCase));
    }
}

public sealed record TableAccessGrant(
    string TableLogicalName,
    AccessDepth ReadDepth,
    AccessDepth CreateDepth,
    AccessDepth UpdateDepth,
    AccessDepth DeleteDepth,
    IReadOnlySet<string> ReadableColumns,
    IReadOnlySet<string> WritableColumns);

public enum AccessDepth
{
    None = 0,
    User = 1,
    BusinessUnit = 2,
    ParentChildBusinessUnit = 3,
    Organization = 4,
}
