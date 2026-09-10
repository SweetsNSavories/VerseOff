namespace VerseOff.Domain;

public sealed record SecuritySnapshot(
    string Version,
    Guid TenantId,
    Guid UserObjectId,
    Guid EnvironmentId,
    DateTimeOffset IssuedAt,
    DateTimeOffset ExpiresAt,
    IReadOnlyList<TableAccessGrant> TablePermissions,
    Guid? BusinessUnitId = null,
    IReadOnlyList<Guid>? TeamIds = null,
    IReadOnlyList<string>? RoleNames = null,
    IReadOnlyList<SecurityPrivilegeGrant>? Privileges = null,
    IReadOnlyList<RecordAccessGrant>? RecordAccessGrants = null)
{
    public IReadOnlyList<Guid> EffectiveTeamIds => TeamIds ?? Array.Empty<Guid>();

    public IReadOnlyList<string> EffectiveRoleNames => RoleNames ?? Array.Empty<string>();

    public IReadOnlyList<SecurityPrivilegeGrant> EffectivePrivileges =>
        Privileges ?? Array.Empty<SecurityPrivilegeGrant>();

    // These are materialized effective grants, calculated from POA user and team shares.
    public IReadOnlyList<RecordAccessGrant> EffectiveRecordAccessGrants =>
        RecordAccessGrants ?? Array.Empty<RecordAccessGrant>();

    public bool IsValidAt(DateTimeOffset now) =>
        !string.IsNullOrWhiteSpace(Version)
        && TenantId != Guid.Empty
        && UserObjectId != Guid.Empty
        && EnvironmentId != Guid.Empty
        && ExpiresAt > IssuedAt
        && now >= IssuedAt
        && now < ExpiresAt;

    public bool IsMemberOfTeam(Guid teamId) =>
        teamId != Guid.Empty
        && EffectiveTeamIds.Contains(teamId);

    public bool HasRole(string roleName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(roleName);
        return EffectiveRoleNames.Any(candidate =>
            string.Equals(candidate, roleName, StringComparison.OrdinalIgnoreCase));
    }

    public bool HasPrivilege(string privilegeName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(privilegeName);
        return EffectivePrivileges.Any(candidate =>
            string.Equals(candidate.Name, privilegeName, StringComparison.OrdinalIgnoreCase));
    }

    public bool HasTableAccess(
        string logicalName,
        AccessOperation operation,
        AccessDepth requiredDepth = AccessDepth.User)
    {
        var grant = FindTable(logicalName);
        if (grant is null)
        {
            return false;
        }

        return operation switch
        {
            AccessOperation.Read => grant.AllowsRead(requiredDepth),
            AccessOperation.Create => grant.AllowsCreate(requiredDepth),
            AccessOperation.Update => grant.AllowsUpdate(requiredDepth),
            AccessOperation.Delete => grant.AllowsDelete(requiredDepth),
            _ => false,
        };
    }

    public bool HasRecordAccess(
        string logicalName,
        Guid recordId,
        AccessOperation operation,
        AccessDepth requiredDepth = AccessDepth.User)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(logicalName);
        if (recordId == Guid.Empty)
        {
            return false;
        }

        return HasTableAccess(logicalName, operation, requiredDepth)
            || EffectiveRecordAccessGrants.Any(grant =>
                grant.RecordId == recordId
                && string.Equals(
                    grant.TableLogicalName,
                    logicalName,
                    StringComparison.OrdinalIgnoreCase)
                && grant.Allows(operation));
    }

    public bool HasBusinessUnitAccess(Guid? businessUnitId, AccessDepth requiredDepth) =>
        businessUnitId is null
            ? requiredDepth is AccessDepth.None || requiredDepth is AccessDepth.User
            : BusinessUnitId == businessUnitId
                || (requiredDepth >= AccessDepth.BusinessUnit && BusinessUnitId != null);

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
    IReadOnlySet<string> WritableColumns)
{
    public bool AllowsRead(AccessDepth requiredDepth = AccessDepth.User) =>
        ReadDepth > AccessDepth.None && ReadDepth >= requiredDepth;

    public bool AllowsCreate(AccessDepth requiredDepth = AccessDepth.User) =>
        CreateDepth > AccessDepth.None && CreateDepth >= requiredDepth;

    public bool AllowsUpdate(AccessDepth requiredDepth = AccessDepth.User) =>
        UpdateDepth > AccessDepth.None && UpdateDepth >= requiredDepth;

    public bool AllowsDelete(AccessDepth requiredDepth = AccessDepth.User) =>
        DeleteDepth > AccessDepth.None && DeleteDepth >= requiredDepth;
}

public sealed record SecurityPrivilegeGrant(
    string Name,
    string TableLogicalName,
    AccessDepth Depth,
    string PrivilegeType)
{
    public bool Allows(string? privilegeType, AccessDepth requiredDepth = AccessDepth.User) =>
        Depth > AccessDepth.None
        && Depth >= requiredDepth
        && (string.IsNullOrWhiteSpace(privilegeType)
            || string.Equals(privilegeType, PrivilegeType, StringComparison.OrdinalIgnoreCase));
}

[Flags]
public enum RecordAccessRights
{
    None = 0,
    Read = 1 << 0,
    Create = 1 << 1,
    Update = 1 << 2,
    Delete = 1 << 3,
    Append = 1 << 4,
    AppendTo = 1 << 5,
    Assign = 1 << 6,
    Share = 1 << 7,
}

public sealed record RecordAccessGrant(
    string TableLogicalName,
    Guid RecordId,
    RecordAccessRights Rights)
{
    public bool Allows(AccessOperation operation) => operation switch
    {
        AccessOperation.Read => Rights.HasFlag(RecordAccessRights.Read),
        AccessOperation.Create => Rights.HasFlag(RecordAccessRights.Create),
        AccessOperation.Update => Rights.HasFlag(RecordAccessRights.Update),
        AccessOperation.Delete => Rights.HasFlag(RecordAccessRights.Delete),
        AccessOperation.Append => Rights.HasFlag(RecordAccessRights.Append),
        AccessOperation.AppendTo => Rights.HasFlag(RecordAccessRights.AppendTo),
        AccessOperation.Assign => Rights.HasFlag(RecordAccessRights.Assign),
        AccessOperation.Share => Rights.HasFlag(RecordAccessRights.Share),
        _ => false,
    };
}

public enum AccessDepth
{
    None = 0,
    User = 1,
    BusinessUnit = 2,
    ParentChildBusinessUnit = 3,
    Organization = 4,
}

public enum AccessOperation
{
    Read = 0,
    Create = 1,
    Update = 2,
    Delete = 3,
    Append = 4,
    AppendTo = 5,
    Assign = 6,
    Share = 7,
}
