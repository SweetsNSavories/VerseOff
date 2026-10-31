namespace VerseOff.Domain;

/// <summary>
/// Produces a user-specific offline security snapshot from a protected Dataverse
/// security projection. Raw POA rows remain in the read plane and are never sent
/// to the device.
/// </summary>
public static class SecuritySnapshotProjector
{
    public static SecuritySnapshot Project(SecurityProjectionInput input)
    {
        ArgumentNullException.ThrowIfNull(input);
        ValidateInput(input);

        var effectiveTeamIds = input.TeamMemberships
            .Where(membership => membership.UserObjectId == input.UserObjectId)
            .Select(membership => membership.TeamId)
            .Where(teamId => teamId != Guid.Empty)
            .Distinct()
            .Order()
            .ToArray();
        var effectivePrincipalIds = new HashSet<Guid>(effectiveTeamIds)
        {
            input.UserObjectId,
        };
        var effectiveRoleIds = input.RoleAssignments
            .Where(assignment => effectivePrincipalIds.Contains(assignment.PrincipalId))
            .Select(assignment => assignment.RoleId)
            .Where(roleId => roleId != Guid.Empty)
            .Distinct()
            .ToHashSet();
        var effectiveRoles = input.Roles
            .Where(role => effectiveRoleIds.Contains(role.RoleId))
            .OrderBy(role => role.Name, StringComparer.OrdinalIgnoreCase)
            .ToArray();
        var tablePolicies = input.TableColumnPolicies
            .GroupBy(policy => policy.TableLogicalName, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.Single(), StringComparer.OrdinalIgnoreCase);
        var privileges = input.RolePrivileges
            .Where(grant => effectiveRoleIds.Contains(grant.RoleId))
            .GroupBy(
                grant => (grant.TableLogicalName, grant.PrivilegeType),
                new TablePrivilegeKeyComparer())
            .Select(group => group.OrderByDescending(grant => grant.Depth).First())
            .Select(grant => new SecurityPrivilegeGrant(
                grant.Name,
                grant.TableLogicalName,
                grant.Depth,
                grant.PrivilegeType))
            .OrderBy(grant => grant.TableLogicalName, StringComparer.OrdinalIgnoreCase)
            .ThenBy(grant => grant.PrivilegeType, StringComparer.OrdinalIgnoreCase)
            .ToArray();
        var tablePermissions = privileges
            .GroupBy(grant => grant.TableLogicalName, StringComparer.OrdinalIgnoreCase)
            .Select(group =>
            {
                tablePolicies.TryGetValue(group.Key, out var policy);
                return new TableAccessGrant(
                    group.Key,
                    MaximumDepth(group, "read"),
                    MaximumDepth(group, "create"),
                    MaximumDepth(group, "update", "write"),
                    MaximumDepth(group, "delete"),
                    policy?.ReadableColumns
                        ?? EmptyColumns,
                    policy?.WritableColumns
                        ?? EmptyColumns);
            })
            .OrderBy(grant => grant.TableLogicalName, StringComparer.OrdinalIgnoreCase)
            .ToArray();
        var recordAccessGrants = input.PrincipalObjectAccess
            .Where(grant => effectivePrincipalIds.Contains(grant.PrincipalId))
            .Where(grant => grant.RecordId != Guid.Empty
                && !string.IsNullOrWhiteSpace(grant.TableLogicalName))
            .GroupBy(
                grant => (grant.TableLogicalName, grant.RecordId),
                new TableRecordKeyComparer())
            .Select(group => new RecordAccessGrant(
                group.Key.TableLogicalName,
                group.Key.RecordId,
                group.Aggregate(
                    RecordAccessRights.None,
                    (rights, grant) => rights | grant.Rights)))
            .Where(grant => grant.Rights != RecordAccessRights.None)
            .OrderBy(grant => grant.TableLogicalName, StringComparer.OrdinalIgnoreCase)
            .ThenBy(grant => grant.RecordId)
            .ToArray();

        return new SecuritySnapshot(
            input.Version,
            input.TenantId,
            input.UserObjectId,
            input.EnvironmentId,
            input.IssuedAt,
            input.ExpiresAt,
            tablePermissions,
            input.BusinessUnitId,
            effectiveTeamIds,
            effectiveRoles.Select(role => role.Name).ToArray(),
            privileges,
            recordAccessGrants);
    }

    private static readonly IReadOnlySet<string> EmptyColumns =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    private static AccessDepth MaximumDepth(
        IEnumerable<SecurityPrivilegeGrant> grants,
        params string[] privilegeTypes) =>
        grants
            .Where(grant => privilegeTypes.Any(type =>
                string.Equals(type, grant.PrivilegeType, StringComparison.OrdinalIgnoreCase)))
            .Select(grant => grant.Depth)
            .DefaultIfEmpty(AccessDepth.None)
            .Max();

    private static void ValidateInput(SecurityProjectionInput input)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(input.Version);
        ArgumentOutOfRangeException.ThrowIfEqual(input.TenantId, Guid.Empty);
        ArgumentOutOfRangeException.ThrowIfEqual(input.UserObjectId, Guid.Empty);
        ArgumentOutOfRangeException.ThrowIfEqual(input.EnvironmentId, Guid.Empty);
        if (input.ExpiresAt <= input.IssuedAt)
        {
            throw new ArgumentException(
                "A security snapshot must expire after it is issued.",
                nameof(input));
        }
    }

    private sealed class TablePrivilegeKeyComparer
        : IEqualityComparer<(string TableLogicalName, string PrivilegeType)>
    {
        public bool Equals(
            (string TableLogicalName, string PrivilegeType) x,
            (string TableLogicalName, string PrivilegeType) y) =>
            string.Equals(x.TableLogicalName, y.TableLogicalName, StringComparison.OrdinalIgnoreCase)
            && string.Equals(x.PrivilegeType, y.PrivilegeType, StringComparison.OrdinalIgnoreCase);

        public int GetHashCode((string TableLogicalName, string PrivilegeType) value) =>
            HashCode.Combine(
                StringComparer.OrdinalIgnoreCase.GetHashCode(value.TableLogicalName),
                StringComparer.OrdinalIgnoreCase.GetHashCode(value.PrivilegeType));
    }

    private sealed class TableRecordKeyComparer
        : IEqualityComparer<(string TableLogicalName, Guid RecordId)>
    {
        public bool Equals(
            (string TableLogicalName, Guid RecordId) x,
            (string TableLogicalName, Guid RecordId) y) =>
            x.RecordId == y.RecordId
            && string.Equals(x.TableLogicalName, y.TableLogicalName, StringComparison.OrdinalIgnoreCase);

        public int GetHashCode((string TableLogicalName, Guid RecordId) value) =>
            HashCode.Combine(
                StringComparer.OrdinalIgnoreCase.GetHashCode(value.TableLogicalName),
                value.RecordId);
    }
}

public sealed record SecurityProjectionInput(
    string Version,
    Guid TenantId,
    Guid UserObjectId,
    Guid EnvironmentId,
    Guid? BusinessUnitId,
    DateTimeOffset IssuedAt,
    DateTimeOffset ExpiresAt,
    IReadOnlyList<TeamMembershipProjection> TeamMemberships,
    IReadOnlyList<SecurityRoleProjection> Roles,
    IReadOnlyList<PrincipalRoleAssignment> RoleAssignments,
    IReadOnlyList<RolePrivilegeProjection> RolePrivileges,
    IReadOnlyList<PrincipalObjectAccessProjection> PrincipalObjectAccess,
    IReadOnlyList<TableColumnSecurityPolicy> TableColumnPolicies);

public sealed record TeamMembershipProjection(Guid UserObjectId, Guid TeamId);

public sealed record SecurityRoleProjection(Guid RoleId, string Name);

public sealed record PrincipalRoleAssignment(Guid PrincipalId, Guid RoleId);

public sealed record RolePrivilegeProjection(
    Guid RoleId,
    string Name,
    string TableLogicalName,
    string PrivilegeType,
    AccessDepth Depth);

public sealed record PrincipalObjectAccessProjection(
    Guid PrincipalId,
    string TableLogicalName,
    Guid RecordId,
    RecordAccessRights Rights);

public sealed record TableColumnSecurityPolicy(
    string TableLogicalName,
    IReadOnlySet<string> ReadableColumns,
    IReadOnlySet<string> WritableColumns);
