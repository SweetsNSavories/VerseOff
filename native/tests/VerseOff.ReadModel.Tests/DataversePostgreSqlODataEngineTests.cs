using System.Data.Common;
using System.Globalization;
using Npgsql;
using VerseOff.ReadModel;

namespace VerseOff.ReadModel.Tests;

[TestClass]
[DoNotParallelize]
public sealed class DataversePostgreSqlODataEngineTests
{
    private const string ConnectionString =
        "Host=localhost;Port=5432;Database=verseoff_read;Username=postgres;Pooling=true;";

    private static readonly Uri ServiceRoot = new("https://localhost:5001/api/data/v9.2");

    // Seeded Persona User IDs in PostgreSQL 17 (verseoff.systemuser)
    private static readonly Guid AdminGlobalUserId = new("a996ff15-b5d3-f111-a059-70a8a59ba8c8");
    private static readonly Guid PnwDirectorDeepUserId = new("d2000000-0000-0000-0000-000000000001");
    private static readonly Guid PnwManagerLocalUserId = new("d2000000-0000-0000-0000-000000000002");
    private static readonly Guid SeattleTechBasicUserId = new("d2000000-0000-0000-0000-000000000003");
    private static readonly Guid CaliforniaRepBasicUserId = new("d2000000-0000-0000-0000-000000000004");

    // Seeded Enterprise Sample Accounts across Business Units (VO-ACCT-1001 .. VO-ACCT-1005)
    private static readonly Guid Account01RootBuId = new("0a5e7ad6-53d6-f111-a05d-00224805ee15");
    private static readonly Guid Account03SeattleUserOwnedId = new("11111111-60d6-f111-a05d-00224805ee15");
    private static readonly Guid Account05CalifPoaSharedId = new("33333333-60d6-f111-a05d-00224805ee15");

    private sealed class LiveNpgsqlConnectionFactory : IPostgreSqlConnectionFactory
    {
        public DbConnection CreateConnection() => new NpgsqlConnection(ConnectionString);
    }

    private static DataversePostgreSqlODataEngine CreateEngine() =>
        new(new LiveNpgsqlConnectionFactory());

    private static async Task<bool> IsPostgreSqlSecuritySeededAsync()
    {
        try
        {
            await using var conn = new NpgsqlConnection(ConnectionString);
            await conn.OpenAsync();
            await using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT COUNT(*) FROM verseoff.systemuser WHERE systemuserid = @id;";
            cmd.Parameters.AddWithValue("@id", SeattleTechBasicUserId);
            var scalar = await cmd.ExecuteScalarAsync();
            var count = Convert.ToInt64(scalar, CultureInfo.InvariantCulture);
            return count > 0;
        }
        catch (DbException)
        {
            return false;
        }
    }

    [TestMethod]
    public async Task ExecuteWhoAmIReturnsDataverseWebApiV92Payload()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();
        var response = await engine.ExecuteWhoAmIAsync(SeattleTechBasicUserId, ServiceRoot);

        Assert.AreEqual(200, response.StatusCode);
        Assert.AreEqual(
            "https://localhost:5001/api/data/v9.2/$metadata#Microsoft.Dynamics.CRM.WhoAmIResponse",
            response.Payload.GetProperty("@odata.context").GetString());
        Assert.AreEqual(
            SeattleTechBasicUserId.ToString("D"),
            response.Payload.GetProperty("UserId").GetString());
        Assert.AreEqual(
            "b1000000-0000-0000-0000-000000000002",
            response.Payload.GetProperty("BusinessUnitId").GetString());
        Assert.AreEqual(
            "2adf6659-62d5-f111-84db-6045bd003100",
            response.Payload.GetProperty("OrganizationId").GetString());
    }

    [TestMethod]
    public async Task QueryEntitySetGlobalDepth8ReturnsAllEnterpriseAccountsAndUnmaskedFls()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();
        var request = new DataverseODataQueryRequest(
            EntitySetName: "accounts",
            CallerId: AdminGlobalUserId,
            Select: ["accountid", "name", "accountnumber", "government_contract_code"],
            Filter: "startswith(accountnumber,'VO-ACCT-')",
            OrderBy: "accountnumber asc",
            Top: null,
            Skip: null,
            IncludeCount: true,
            MaxPageSize: null,
            IncludeAnnotations: true,
            TrackChanges: true,
            DeltaToken: null,
            ServiceRootUri: ServiceRoot);

        var response = await engine.QueryEntitySetAsync(request);
        Assert.AreEqual(200, response.StatusCode);
        Assert.AreEqual(5L, response.Payload.GetProperty("@odata.count").GetInt64());

        var values = response.Payload.GetProperty("value");
        Assert.AreEqual(5, values.GetArrayLength());
        Assert.AreEqual("VO-ACCT-1001", values[0].GetProperty("accountnumber").GetString());
        Assert.AreEqual("GOV-TOP-SECRET-9901", values[0].GetProperty("government_contract_code").GetString());
        Assert.IsTrue(response.Payload.TryGetProperty("@odata.deltaLink", out _));
    }

    [TestMethod]
    public async Task QueryEntitySetDeepParentChildBuDepth4ReturnsParentAndChildBuRecordsAndMasksFls()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();
        var request = new DataverseODataQueryRequest(
            EntitySetName: "accounts",
            CallerId: PnwDirectorDeepUserId,
            Select: ["accountid", "name", "accountnumber", "government_contract_code"],
            Filter: "startswith(accountnumber,'VO-ACCT-')",
            OrderBy: "accountnumber asc",
            Top: null,
            Skip: null,
            IncludeCount: true,
            MaxPageSize: null,
            IncludeAnnotations: false,
            TrackChanges: false,
            DeltaToken: null,
            ServiceRootUri: ServiceRoot);

        var response = await engine.QueryEntitySetAsync(request);
        Assert.AreEqual(200, response.StatusCode);

        // PNW Director (Deep=4) in Pacific NW BU sees:
        // - VO-ACCT-1002 (Pacific NW Division BU)
        // - VO-ACCT-1003 (Seattle Autonomous Depot child BU)
        // - VO-ACCT-1004 (Seattle Autonomous Depot child BU)
        // Excludes VO-ACCT-1001 (Root BU) and VO-ACCT-1005 (California BU)
        var values = response.Payload.GetProperty("value");
        Assert.AreEqual(3, values.GetArrayLength());
        Assert.AreEqual("VO-ACCT-1002", values[0].GetProperty("accountnumber").GetString());
        Assert.AreEqual("VO-ACCT-1003", values[1].GetProperty("accountnumber").GetString());
        Assert.AreEqual("VO-ACCT-1004", values[2].GetProperty("accountnumber").GetString());

        // Field-Level Security (FLS): PNW Director does not hold 'VerseOff Classified Contract Clearance'
        Assert.AreEqual(
            System.Text.Json.JsonValueKind.Null,
            values[0].GetProperty("government_contract_code").ValueKind);
    }

    [TestMethod]
    public async Task QueryEntitySetLocalBuDepth2ReturnsOnlyCallerBuRecords()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();
        var request = new DataverseODataQueryRequest(
            EntitySetName: "accounts",
            CallerId: PnwManagerLocalUserId,
            Select: ["accountid", "name", "accountnumber"],
            Filter: "startswith(accountnumber,'VO-ACCT-')",
            OrderBy: "accountnumber asc",
            Top: null,
            Skip: null,
            IncludeCount: true,
            MaxPageSize: null,
            IncludeAnnotations: false,
            TrackChanges: false,
            DeltaToken: null,
            ServiceRootUri: ServiceRoot);

        var response = await engine.QueryEntitySetAsync(request);
        Assert.AreEqual(200, response.StatusCode);

        // Local BU Manager (Local=2) in Pacific NW Division sees ONLY VO-ACCT-1002 (not child Seattle BU)
        var values = response.Payload.GetProperty("value");
        Assert.AreEqual(1, values.GetArrayLength());
        Assert.AreEqual("VO-ACCT-1002", values[0].GetProperty("accountnumber").GetString());
    }

    [TestMethod]
    public async Task QueryEntitySetBasicDepth1IncludesDirectOwnedTeamOwnedAndPoaSharedRecords()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();
        var request = new DataverseODataQueryRequest(
            EntitySetName: "accounts",
            CallerId: SeattleTechBasicUserId,
            Select: ["accountid", "name", "accountnumber"],
            Filter: "startswith(accountnumber,'VO-ACCT-')",
            OrderBy: "accountnumber asc",
            Top: null,
            Skip: null,
            IncludeCount: true,
            MaxPageSize: null,
            IncludeAnnotations: false,
            TrackChanges: false,
            DeltaToken: null,
            ServiceRootUri: ServiceRoot);

        var response = await engine.QueryEntitySetAsync(request);
        Assert.AreEqual(200, response.StatusCode);

        // Liam O'Connor (Basic=1) sees:
        // - VO-ACCT-1003 (Directly owned by Liam O'Connor)
        // - VO-ACCT-1004 (Owned by Redmond Fleet Response Team, of which Liam is a member)
        // - VO-ACCT-1005 (Owned by Sofia Chen in California BU, shared with Liam via POA table!)
        var values = response.Payload.GetProperty("value");
        Assert.AreEqual(3, values.GetArrayLength());
        Assert.AreEqual("VO-ACCT-1003", values[0].GetProperty("accountnumber").GetString());
        Assert.AreEqual("VO-ACCT-1004", values[1].GetProperty("accountnumber").GetString());
        Assert.AreEqual("VO-ACCT-1005", values[2].GetProperty("accountnumber").GetString());
    }

    [TestMethod]
    public async Task RetrieveRecordEnforcesSecurityAndPoaReturning403WhenUnauthorized()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();

        // 1. Liam O'Connor can retrieve California Account VO-ACCT-1005 via POA record share
        var allowed = await engine.RetrieveRecordAsync(
            "accounts",
            Account05CalifPoaSharedId,
            SeattleTechBasicUserId,
            ["accountid", "name", "accountnumber"],
            includeAnnotations: true,
            ServiceRoot);
        Assert.AreEqual(200, allowed.StatusCode);
        Assert.AreEqual("VO-ACCT-1005", allowed.Payload.GetProperty("accountnumber").GetString());

        // 2. Liam O'Connor is denied access (403 Forbidden / 0x80040220) to Root BU Account VO-ACCT-1001
        var denied = await engine.RetrieveRecordAsync(
            "accounts",
            Account01RootBuId,
            SeattleTechBasicUserId,
            ["accountid", "name"],
            includeAnnotations: false,
            ServiceRoot);
        Assert.AreEqual(403, denied.StatusCode);
        Assert.AreEqual(
            "0x80040220",
            denied.Payload.GetProperty("error").GetProperty("code").GetString());

        // 3. Sofia Chen (California Rep) is denied access to Seattle Account VO-ACCT-1003
        var deniedSeattle = await engine.RetrieveRecordAsync(
            "accounts",
            Account03SeattleUserOwnedId,
            CaliforniaRepBasicUserId,
            ["accountid", "name"],
            includeAnnotations: false,
            ServiceRoot);
        Assert.AreEqual(403, deniedSeattle.StatusCode);
    }

    [TestMethod]
    public async Task RetrievePrincipalAccessEvaluatesRoleDepthAndPoaBitmask()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();

        // Liam O'Connor on POA-shared California Account VO-ACCT-1005 (POA mask = 3 => ReadAccess, WriteAccess)
        var poaAccess = await engine.RetrievePrincipalAccessAsync(
            SeattleTechBasicUserId,
            "accounts",
            Account05CalifPoaSharedId,
            ServiceRoot);
        Assert.AreEqual(200, poaAccess.StatusCode);
        var rights = poaAccess.Payload.GetProperty("AccessRights").GetString()!;
        StringAssert.Contains(rights, "ReadAccess");
        StringAssert.Contains(rights, "WriteAccess");

        // Liam O'Connor on Root BU Account VO-ACCT-1001 => None
        var noAccess = await engine.RetrievePrincipalAccessAsync(
            SeattleTechBasicUserId,
            "accounts",
            Account01RootBuId,
            ServiceRoot);
        Assert.AreEqual(200, noAccess.StatusCode);
        Assert.AreEqual("None", noAccess.Payload.GetProperty("AccessRights").GetString());
    }

    [TestMethod]
    public async Task ManagerHierarchySecurityGrantsCrossBuReadAndWriteAccessOnDirectReportRecords()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        await using var conn = new NpgsqlConnection(ConnectionString);
        await conn.OpenAsync();

        try
        {
            // Temporarily set Marcus Sterling (PNW Local Manager) as direct manager of Sofia Chen (California Rep)
            await using (var setCmd = conn.CreateCommand())
            {
                setCmd.CommandText = "UPDATE verseoff.systemuser SET parentsystemuserid = @mgr WHERE systemuserid = @sub;";
                setCmd.Parameters.AddWithValue("@mgr", PnwManagerLocalUserId);
                setCmd.Parameters.AddWithValue("@sub", CaliforniaRepBasicUserId);
                await setCmd.ExecuteNonQueryAsync();
            }

            var engine = CreateEngine();
            var retrieveResp = await engine.RetrieveRecordAsync(
                "accounts",
                Account05CalifPoaSharedId,
                PnwManagerLocalUserId,
                ["accountid", "name", "accountnumber"],
                includeAnnotations: false,
                ServiceRoot);
            Assert.AreEqual(200, retrieveResp.StatusCode);
            Assert.AreEqual("VO-ACCT-1005", retrieveResp.Payload.GetProperty("accountnumber").GetString());

            var accessResp = await engine.RetrievePrincipalAccessAsync(
                PnwManagerLocalUserId,
                "accounts",
                Account05CalifPoaSharedId,
                ServiceRoot);
            var rights = accessResp.Payload.GetProperty("AccessRights").GetString()!;
            StringAssert.Contains(rights, "ReadAccess");
            StringAssert.Contains(rights, "WriteAccess");
        }
        finally
        {
            await using var clearCmd = conn.CreateCommand();
            clearCmd.CommandText = "UPDATE verseoff.systemuser SET parentsystemuserid = NULL WHERE systemuserid = @sub;";
            clearCmd.Parameters.AddWithValue("@sub", CaliforniaRepBasicUserId);
            await clearCmd.ExecuteNonQueryAsync();
        }
    }

    [TestMethod]
    public async Task ODataExpandNavigationAppliesNestedSecurityTrimmingAndFlsMasking()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();

        // Expand contact_customer_accounts on VO-ACCT-1001 as Global Admin
        var expandResp = await engine.RetrieveRecordAsync(
            "accounts",
            Account01RootBuId,
            AdminGlobalUserId,
            ["accountid", "name", "accountnumber"],
            includeAnnotations: false,
            ServiceRoot,
            expand: "contact_customer_accounts($select=fullname,jobtitle)");

        Assert.AreEqual(200, expandResp.StatusCode);
        var childContacts = expandResp.Payload.GetProperty("contact_customer_accounts");
        Assert.IsGreaterThanOrEqualTo(1, childContacts.GetArrayLength());
        Assert.AreEqual("Avery Vance", childContacts[0].GetProperty("fullname").GetString());
    }

    [TestMethod]
    public async Task ValidateImpersonationPrivilegeEnforcesPrvActOnBehalfOfAnotherUser()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var engine = CreateEngine();

        // 1. System Administrator (Global=8) can impersonate Seattle Tech
        var adminCanImpersonate = await engine.ValidateImpersonationPrivilegeAsync(
            AdminGlobalUserId,
            SeattleTechBasicUserId);
        Assert.IsTrue(adminCanImpersonate);

        // 2. Basic User (Seattle Tech) CANNOT impersonate System Administrator
        var basicCanImpersonate = await engine.ValidateImpersonationPrivilegeAsync(
            SeattleTechBasicUserId,
            AdminGlobalUserId);
        Assert.IsFalse(basicCanImpersonate);
    }

    [TestMethod]
    public async Task BulkBinaryCopyIngestionEngineStagesAndMergesWithWatermarkTelemetry()
    {
        if (!await IsPostgreSqlSecuritySeededAsync())
        {
            Assert.Inconclusive("PostgreSQL 17 security schema not reachable on localhost:5432.");
        }

        var bulkEngine = new DataversePostgreSqlBulkIngestionEngine(ConnectionString);
        var rows = new List<DataverseBulkEntityRow>
        {
            new(
                TableLogicalName: "account",
                RecordId: Account01RootBuId,
                OwnerId: AdminGlobalUserId,
                OwnerType: "systemuser",
                OwningBusinessUnitId: new Guid("b08fff15-b5d3-f111-a059-70a8a59ba8c8"),
                StateCode: 0,
                StatusCode: 1,
                VersionNumber: 3000001L,
                ETag: "W/\"3000001\"",
                ModifiedOn: DateTimeOffset.UtcNow,
                IsDeleted: false,
                DataJson: """{"accountid":"0a5e7ad6-53d6-f111-a05d-00224805ee15","name":"Contoso Mobility Fleet","accountnumber":"VO-ACCT-1001","revenue":54900000,"government_contract_code":"GOV-TOP-SECRET-9901"}"""),
        };

        var result = await bulkEngine.IngestBatchBinaryCopyAsync(
            "account",
            "partition-00",
            rows,
            "deltatoken-3000001");

        Assert.AreEqual(1, result.RowsIngested);
        Assert.AreEqual(3000001L, result.MaxVersionNumber);
        Assert.IsGreaterThan(0, result.ThroughputRowsPerSecond);
    }
}
