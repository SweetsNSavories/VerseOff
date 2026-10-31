namespace VerseOff.Domain.Tests;

[TestClass]
public sealed class SecuritySnapshotProjectorTests
{
    [TestMethod]
    public void ProjectUnionsUserAndTeamRolesWithPoaGrants()
    {
        var userId = Guid.NewGuid();
        var teamId = Guid.NewGuid();
        var userRoleId = Guid.NewGuid();
        var teamRoleId = Guid.NewGuid();
        var recordId = Guid.NewGuid();
        var now = DateTimeOffset.UtcNow;
        var input = new SecurityProjectionInput(
            "security-v3",
            Guid.NewGuid(),
            userId,
            Guid.NewGuid(),
            Guid.NewGuid(),
            now.AddMinutes(-1),
            now.AddMinutes(15),
            [new TeamMembershipProjection(userId, teamId)],
            [
                new SecurityRoleProjection(userRoleId, "Seller"),
                new SecurityRoleProjection(teamRoleId, "Sales Team"),
            ],
            [
                new PrincipalRoleAssignment(userId, userRoleId),
                new PrincipalRoleAssignment(teamId, teamRoleId),
            ],
            [
                new RolePrivilegeProjection(userRoleId, "Read Account", "account", "Read", AccessDepth.User),
                new RolePrivilegeProjection(teamRoleId, "Write Account", "account", "Write", AccessDepth.BusinessUnit),
                new RolePrivilegeProjection(Guid.NewGuid(), "Ignored", "contact", "Read", AccessDepth.Organization),
            ],
            [
                new PrincipalObjectAccessProjection(userId, "account", recordId, RecordAccessRights.Read),
                new PrincipalObjectAccessProjection(teamId, "account", recordId, RecordAccessRights.Update),
                new PrincipalObjectAccessProjection(Guid.NewGuid(), "account", recordId, RecordAccessRights.Delete),
            ],
            [
                new TableColumnSecurityPolicy(
                    "account",
                    new HashSet<string>(["name"], StringComparer.OrdinalIgnoreCase),
                    new HashSet<string>(["name"], StringComparer.OrdinalIgnoreCase)),
            ]);

        var snapshot = SecuritySnapshotProjector.Project(input);

        Assert.IsTrue(snapshot.IsMemberOfTeam(teamId));
        Assert.IsTrue(snapshot.HasRole("seller"));
        Assert.IsTrue(snapshot.HasRole("sales team"));
        Assert.IsTrue(snapshot.HasTableAccess("account", AccessOperation.Read));
        Assert.IsTrue(snapshot.HasTableAccess("account", AccessOperation.Update, AccessDepth.BusinessUnit));
        Assert.IsFalse(snapshot.HasTableAccess("contact", AccessOperation.Read));
        Assert.IsTrue(snapshot.HasRecordAccess("account", recordId, AccessOperation.Update));
        Assert.IsFalse(snapshot.HasRecordAccess("account", recordId, AccessOperation.Delete));
        Assert.AreEqual(
            RecordAccessRights.Read | RecordAccessRights.Update,
            snapshot.EffectiveRecordAccessGrants.Single().Rights);
    }

    [TestMethod]
    public void ProjectRejectsAnInvalidSnapshotLifetime()
    {
        var now = DateTimeOffset.UtcNow;
        var input = new SecurityProjectionInput(
            "security-v3",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            null,
            now,
            now,
            [],
            [],
            [],
            [],
            [],
            []);

        Assert.ThrowsExactly<ArgumentException>(
            () => SecuritySnapshotProjector.Project(input));
    }
}
