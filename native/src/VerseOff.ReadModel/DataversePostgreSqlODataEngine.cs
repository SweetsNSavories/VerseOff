using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace VerseOff.ReadModel;

public sealed record DataverseODataQueryRequest(
    string EntitySetName,
    Guid CallerId,
    Uri ServiceRootUri,
    IReadOnlyList<string>? Select = null,
    string? Filter = null,
    string? OrderBy = null,
    int? Top = null,
    int? Skip = null,
    int? MaxPageSize = null,
    bool IncludeCount = false,
    bool IncludeAnnotations = false,
    bool TrackChanges = false,
    long? DeltaToken = null);

public sealed record DataverseODataResponse(
    int StatusCode,
    JsonElement Payload,
    IReadOnlyDictionary<string, string>? Headers = null);

public interface IDataversePostgreSqlODataEngine
{
    ValueTask<DataverseODataResponse> ExecuteWhoAmIAsync(
        Guid callerId,
        Uri serviceRootUri,
        CancellationToken cancellationToken = default);

    ValueTask<DataverseODataResponse> QueryEntitySetAsync(
        DataverseODataQueryRequest request,
        CancellationToken cancellationToken = default);

    ValueTask<DataverseODataResponse> RetrieveRecordAsync(
        string entitySetName,
        Guid recordId,
        Guid callerId,
        IReadOnlyList<string>? selectColumns,
        bool includeAnnotations,
        Uri serviceRootUri,
        CancellationToken cancellationToken = default);

    ValueTask<DataverseODataResponse> RetrievePrincipalAccessAsync(
        Guid principalUserId,
        string targetEntitySetName,
        Guid targetRecordId,
        Uri serviceRootUri,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Implements a Dataverse Web API v9.2–compatible OData v4 query and security engine over PostgreSQL.
/// Enforces Dataverse role privileges (Basic/User=1, Local/BU=2, Deep/ParentChildBU=4, Global/Org=8),
/// recursive Business Unit hierarchies, Owner/Access Team memberships, PrincipalObjectAccess (POA)
/// record sharing, and Field-Level Security (FLS) column masking directly inside PostgreSQL queries.
/// </summary>
public sealed class DataversePostgreSqlODataEngine(
    IPostgreSqlConnectionFactory connectionFactory) : IDataversePostgreSqlODataEngine
{
    private static readonly Dictionary<string, (string LogicalName, string PrimaryKey)> EntitySetMap =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["accounts"] = ("account", "accountid"),
            ["contacts"] = ("contact", "contactid"),
            ["tasks"] = ("task", "activityid"),
            ["phonecalls"] = ("phonecall", "activityid"),
            ["appointments"] = ("appointment", "activityid"),
            ["letters"] = ("letter", "activityid"),
            ["incidents"] = ("incident", "incidentid"),
            ["opportunities"] = ("opportunity", "opportunityid"),
            ["leads"] = ("lead", "leadid"),
            ["businessunits"] = ("businessunit", "businessunitid"),
            ["systemusers"] = ("systemuser", "systemuserid"),
            ["teams"] = ("team", "teamid"),
            ["roles"] = ("role", "roleid"),
            ["privileges"] = ("privilege", "privilegeid"),
            ["principalobjectaccessset"] = ("principalobjectaccess", "principalobjectaccessid"),
        };

    public static bool TryResolveEntitySet(
        string entitySetName,
        out string tableLogicalName,
        out string primaryKeyName)
    {
        if (!string.IsNullOrWhiteSpace(entitySetName)
            && EntitySetMap.TryGetValue(entitySetName.Trim(), out var mapped))
        {
            tableLogicalName = mapped.LogicalName;
            primaryKeyName = mapped.PrimaryKey;
            return true;
        }

        tableLogicalName = string.Empty;
        primaryKeyName = string.Empty;
        return false;
    }

    public async ValueTask<DataverseODataResponse> ExecuteWhoAmIAsync(
        Guid callerId,
        Uri serviceRootUri,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(connectionFactory);
        ArgumentNullException.ThrowIfNull(serviceRootUri);
        if (callerId == Guid.Empty)
        {
            return CreateDataverseErrorResponse(
                401,
                "0x80040216",
                "Caller identity is required for WhoAmI.");
        }

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            SELECT u.systemuserid,
                   u.businessunitid,
                   b.organizationid
            FROM verseoff.systemuser u
            JOIN verseoff.businessunit b ON b.businessunitid = u.businessunitid
            WHERE (u.systemuserid = @callerId OR u.azureactivedirectoryobjectid = @callerId)
              AND u.isdisabled = FALSE
            LIMIT 1;
            """;
        AddParameter(command, "@callerId", DbType.Guid, callerId);

        await using var reader = await command.ExecuteReaderAsync(
            CommandBehavior.SingleRow,
            cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return CreateDataverseErrorResponse(
                403,
                "0x80040220",
                $"Principal user (Id={callerId}) is disabled or not provisioned in verseoff.systemuser.");
        }

        var userId = ReadGuid(reader, 0);
        var businessUnitId = ReadGuid(reader, 1);
        var organizationId = ReadGuid(reader, 2);

        var root = TrimTrailingSlash(serviceRootUri);
        var body = new JsonObject
        {
            ["@odata.context"] = $"{root}/$metadata#Microsoft.Dynamics.CRM.WhoAmIResponse",
            ["BusinessUnitId"] = businessUnitId.ToString("D"),
            ["UserId"] = userId.ToString("D"),
            ["OrganizationId"] = organizationId.ToString("D"),
        };

        return new DataverseODataResponse(200, JsonSerializer.SerializeToElement(body));
    }

    public async ValueTask<DataverseODataResponse> QueryEntitySetAsync(
        DataverseODataQueryRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(connectionFactory);
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.ServiceRootUri);

        if (request.CallerId == Guid.Empty)
        {
            return CreateDataverseErrorResponse(
                401,
                "0x80040216",
                "Caller identity is required.");
        }

        if (!TryResolveEntitySet(
                request.EntitySetName,
                out var tableLogicalName,
                out var primaryKeyName))
        {
            return CreateDataverseErrorResponse(
                404,
                "0x8006088a",
                $"Resource not found for the segment '{request.EntitySetName}'.");
        }

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);

        // 1. Check that caller exists and has at least Basic Read privilege on the entity
        var callerCheck = await EvaluateCallerTablePrivilegeAsync(
            connection,
            request.CallerId,
            tableLogicalName,
            "read",
            cancellationToken);
        if (!callerCheck.UserExists)
        {
            return CreateDataverseErrorResponse(
                403,
                "0x80040220",
                $"Principal user (Id={request.CallerId}) is not an enabled Dataverse systemuser.");
        }

        if (callerCheck.DepthMask == 0)
        {
            return CreateDataverseErrorResponse(
                403,
                "0x80040220",
                $"SecLib::AccessCheckEx2 failed. Principal user (Id={callerCheck.SystemUserId}, businessUnitId={callerCheck.BusinessUnitId}) is missing prvRead{tableLogicalName} privilege on entity '{tableLogicalName}'.");
        }

        var maskedColumns = await GetMaskedFieldSecurityColumnsAsync(
            connection,
            request.CallerId,
            tableLogicalName,
            cancellationToken);

        // 2. Build parameterized security + OData SQL command
        await using var command = connection.CreateCommand();
        var pageSize = ResolveEffectivePageSize(request.Top, request.MaxPageSize);
        var skip = Math.Max(0, request.Skip ?? 0);

        string filterSql;
        try
        {
            filterSql = ODataFilterSqlCompiler.Compile(
                request.Filter,
                command,
                AddParameter);
        }
        catch (FormatException ex)
        {
            return CreateDataverseErrorResponse(
                400,
                "0x80060888",
                $"Invalid $filter expression: {ex.Message}");
        }

        string orderBySql;
        try
        {
            orderBySql = ODataOrderBySqlCompiler.Compile(request.OrderBy);
        }
        catch (FormatException ex)
        {
            return CreateDataverseErrorResponse(
                400,
                "0x80060888",
                $"Invalid $orderby expression: {ex.Message}");
        }

        var sql = new StringBuilder(
            """
            WITH RECURSIVE caller AS (
                SELECT u.systemuserid, u.businessunitid
                FROM verseoff.systemuser u
                WHERE (u.systemuserid = @callerId OR u.azureactivedirectoryobjectid = @callerId)
                  AND u.isdisabled = FALSE
                LIMIT 1
            ),
            caller_principals AS (
                SELECT c.systemuserid AS principal_id, c.businessunitid AS bu_id FROM caller c
                UNION
                SELECT tm.teamid AS principal_id, t.businessunitid AS bu_id
                FROM verseoff.teammembership tm
                JOIN verseoff.team t ON t.teamid = tm.teamid
                JOIN caller c ON c.systemuserid = tm.systemuserid
            ),
            caller_roles AS (
                SELECT sur.roleid
                FROM verseoff.systemuserroles sur
                JOIN caller c ON c.systemuserid = sur.systemuserid
                UNION
                SELECT tr.roleid
                FROM verseoff.teamroles tr
                JOIN caller_principals cp ON cp.principal_id = tr.teamid
            ),
            effective_privilege AS (
                SELECT COALESCE(BIT_OR(rp.privilegedepthmask), 0) AS depth_mask
                FROM caller_roles cr
                JOIN verseoff.role r ON r.roleid = cr.roleid
                JOIN verseoff.roleprivileges rp ON rp.roleid = r.roleid OR rp.roleid = r.parentrootroleid
                JOIN verseoff.privilege p ON p.privilegeid = rp.privilegeid
                WHERE LOWER(p.table_logical_name) = LOWER(@tableLogicalName)
                  AND LOWER(p.privilege_type) = 'read'
            ),
            bu_subtree AS (
                SELECT c.businessunitid
                FROM caller c
                UNION ALL
                SELECT child.businessunitid
                FROM verseoff.businessunit child
                JOIN bu_subtree parent ON child.parentbusinessunitid = parent.businessunitid
            ),
            poa_shared AS (
                SELECT DISTINCT poa.objectid AS record_id
                FROM verseoff.principalobjectaccess poa
                JOIN caller_principals cp ON cp.principal_id = poa.principalid
                WHERE LOWER(poa.objecttypecode) = LOWER(@tableLogicalName)
                  AND ((poa.accessrightsmask | poa.inheritedaccessrightsmask) & 1) <> 0
            ),
            authorized_records AS (
                SELECT e.record_id,
                       e.owner_id,
                       e.owner_type,
                       e.owning_business_unit_id,
                       e.statecode,
                       e.statuscode,
                       e.version_number,
                       e.etag,
                       e.modified_on,
                       e.data_json
                FROM verseoff.dataverse_entity e
                CROSS JOIN effective_privilege ep
                WHERE LOWER(e.table_logical_name) = LOWER(@tableLogicalName)
                  AND e.is_deleted = FALSE
                  AND (
                      (ep.depth_mask & 8) <> 0
                      OR ((ep.depth_mask & 4) <> 0 AND e.owning_business_unit_id IN (SELECT businessunitid FROM bu_subtree))
                      OR ((ep.depth_mask & 2) <> 0 AND e.owning_business_unit_id IN (SELECT bu_id FROM caller_principals))
                      OR ((ep.depth_mask & 1) <> 0 AND e.owner_id IN (SELECT principal_id FROM caller_principals))
                      OR (ep.depth_mask <> 0 AND e.record_id IN (SELECT record_id FROM poa_shared))
                  )
            """);

        if (request.DeltaToken.HasValue)
        {
            sql.AppendLine();
            sql.Append("      AND e.version_number > @deltaToken");
            AddParameter(command, "@deltaToken", DbType.Int64, request.DeltaToken.Value);
        }

        if (!string.IsNullOrWhiteSpace(filterSql))
        {
            sql.AppendLine();
            sql.Append("      AND (").Append(filterSql).Append(')');
        }

        sql.AppendLine();
        sql.AppendLine(")");
        sql.Append(
            CultureInfo.InvariantCulture,
            $"""
            SELECT record_id,
                   owner_id,
                   owner_type,
                   owning_business_unit_id,
                   statecode,
                   statuscode,
                   version_number,
                   etag,
                   modified_on,
                   data_json,
                   COUNT(*) OVER() AS total_count
            FROM authorized_records
            ORDER BY {orderBySql}
            LIMIT @limitCount
            OFFSET @offsetCount;
            """);

        AddParameter(command, "@callerId", DbType.Guid, request.CallerId);
        AddParameter(command, "@tableLogicalName", DbType.String, tableLogicalName);
        AddParameter(command, "@limitCount", DbType.Int32, pageSize + 1);
        AddParameter(command, "@offsetCount", DbType.Int32, skip);
        command.CommandText = sql.ToString();

        var items = new JsonArray();
        long totalCount = 0;
        long maxVersion = request.DeltaToken ?? 0;
        var rowIndex = 0;
        var hasMore = false;

        await using (var reader = await command.ExecuteReaderAsync(cancellationToken))
        {
            while (await reader.ReadAsync(cancellationToken))
            {
                totalCount = Convert.ToInt64(reader.GetValue(10), CultureInfo.InvariantCulture);
                if (rowIndex >= pageSize)
                {
                    hasMore = true;
                    break;
                }

                var versionNumber = Convert.ToInt64(reader.GetValue(6), CultureInfo.InvariantCulture);
                if (versionNumber > maxVersion)
                {
                    maxVersion = versionNumber;
                }

                var projectedRow = ProjectEntityRow(
                    reader,
                    primaryKeyName,
                    request.Select,
                    request.IncludeAnnotations,
                    maskedColumns);
                items.Add(projectedRow);
                rowIndex++;
            }
        }

        var root = TrimTrailingSlash(request.ServiceRootUri);
        var selectClause = request.Select is { Count: > 0 }
            ? $"({string.Join(',', request.Select)})"
            : string.Empty;
        var responseObj = new JsonObject
        {
            ["@odata.context"] = $"{root}/$metadata#{request.EntitySetName}{selectClause}",
        };

        if (request.IncludeCount)
        {
            responseObj["@odata.count"] = totalCount;
        }

        responseObj["value"] = items;

        if (hasMore && request.MaxPageSize.HasValue && !request.Top.HasValue)
        {
            var nextSkip = skip + pageSize;
            responseObj["@odata.nextLink"] =
                $"{root}/{request.EntitySetName}?$skip={nextSkip}";
        }
        else if (request.TrackChanges)
        {
            responseObj["@odata.deltaLink"] =
                $"{root}/{request.EntitySetName}?$deltatoken={maxVersion}";
        }

        return new DataverseODataResponse(
            200,
            JsonSerializer.SerializeToElement(responseObj));
    }

    public async ValueTask<DataverseODataResponse> RetrieveRecordAsync(
        string entitySetName,
        Guid recordId,
        Guid callerId,
        IReadOnlyList<string>? selectColumns,
        bool includeAnnotations,
        Uri serviceRootUri,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(connectionFactory);
        ArgumentNullException.ThrowIfNull(serviceRootUri);

        if (callerId == Guid.Empty)
        {
            return CreateDataverseErrorResponse(
                401,
                "0x80040216",
                "Caller identity is required.");
        }

        if (!TryResolveEntitySet(entitySetName, out var tableLogicalName, out var primaryKeyName))
        {
            return CreateDataverseErrorResponse(
                404,
                "0x8006088a",
                $"Resource not found for the segment '{entitySetName}'.");
        }

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);

        // First check if the record exists at all in verseoff.dataverse_entity
        await using (var existsCmd = connection.CreateCommand())
        {
            existsCmd.CommandText =
                """
                SELECT 1
                FROM verseoff.dataverse_entity
                WHERE LOWER(table_logical_name) = LOWER(@tableLogicalName)
                  AND record_id = @recordId
                  AND is_deleted = FALSE
                LIMIT 1;
                """;
            AddParameter(existsCmd, "@tableLogicalName", DbType.String, tableLogicalName);
            AddParameter(existsCmd, "@recordId", DbType.Guid, recordId);
            var exists = await existsCmd.ExecuteScalarAsync(cancellationToken);
            if (exists is null or DBNull)
            {
                return CreateDataverseErrorResponse(
                    404,
                    "0x80040217",
                    $"{tableLogicalName} With Id = {recordId:D} Does Not Exist");
            }
        }

        // Now run the full BU + RolePrivilege + Team + POA security check for this record
        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            WITH RECURSIVE caller AS (
                SELECT u.systemuserid, u.businessunitid
                FROM verseoff.systemuser u
                WHERE (u.systemuserid = @callerId OR u.azureactivedirectoryobjectid = @callerId)
                  AND u.isdisabled = FALSE
                LIMIT 1
            ),
            caller_principals AS (
                SELECT c.systemuserid AS principal_id, c.businessunitid AS bu_id FROM caller c
                UNION
                SELECT tm.teamid AS principal_id, t.businessunitid AS bu_id
                FROM verseoff.teammembership tm
                JOIN verseoff.team t ON t.teamid = tm.teamid
                JOIN caller c ON c.systemuserid = tm.systemuserid
            ),
            caller_roles AS (
                SELECT sur.roleid
                FROM verseoff.systemuserroles sur
                JOIN caller c ON c.systemuserid = sur.systemuserid
                UNION
                SELECT tr.roleid
                FROM verseoff.teamroles tr
                JOIN caller_principals cp ON cp.principal_id = tr.teamid
            ),
            effective_privilege AS (
                SELECT COALESCE(BIT_OR(rp.privilegedepthmask), 0) AS depth_mask
                FROM caller_roles cr
                JOIN verseoff.role r ON r.roleid = cr.roleid
                JOIN verseoff.roleprivileges rp ON rp.roleid = r.roleid OR rp.roleid = r.parentrootroleid
                JOIN verseoff.privilege p ON p.privilegeid = rp.privilegeid
                WHERE LOWER(p.table_logical_name) = LOWER(@tableLogicalName)
                  AND LOWER(p.privilege_type) = 'read'
            ),
            bu_subtree AS (
                SELECT c.businessunitid
                FROM caller c
                UNION ALL
                SELECT child.businessunitid
                FROM verseoff.businessunit child
                JOIN bu_subtree parent ON child.parentbusinessunitid = parent.businessunitid
            ),
            poa_shared AS (
                SELECT DISTINCT poa.objectid AS record_id
                FROM verseoff.principalobjectaccess poa
                JOIN caller_principals cp ON cp.principal_id = poa.principalid
                WHERE LOWER(poa.objecttypecode) = LOWER(@tableLogicalName)
                  AND poa.objectid = @recordId
                  AND ((poa.accessrightsmask | poa.inheritedaccessrightsmask) & 1) <> 0
            )
            SELECT e.record_id,
                   e.owner_id,
                   e.owner_type,
                   e.owning_business_unit_id,
                   e.statecode,
                   e.statuscode,
                   e.version_number,
                   e.etag,
                   e.modified_on,
                   e.data_json
            FROM verseoff.dataverse_entity e
            CROSS JOIN effective_privilege ep
            WHERE LOWER(e.table_logical_name) = LOWER(@tableLogicalName)
              AND e.record_id = @recordId
              AND e.is_deleted = FALSE
              AND (
                  (ep.depth_mask & 8) <> 0
                  OR ((ep.depth_mask & 4) <> 0 AND e.owning_business_unit_id IN (SELECT businessunitid FROM bu_subtree))
                  OR ((ep.depth_mask & 2) <> 0 AND e.owning_business_unit_id IN (SELECT bu_id FROM caller_principals))
                  OR ((ep.depth_mask & 1) <> 0 AND e.owner_id IN (SELECT principal_id FROM caller_principals))
                  OR (ep.depth_mask <> 0 AND e.record_id IN (SELECT record_id FROM poa_shared))
              )
            LIMIT 1;
            """;
        AddParameter(command, "@callerId", DbType.Guid, callerId);
        AddParameter(command, "@tableLogicalName", DbType.String, tableLogicalName);
        AddParameter(command, "@recordId", DbType.Guid, recordId);

        await using var reader = await command.ExecuteReaderAsync(
            CommandBehavior.SingleRow,
            cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return CreateDataverseErrorResponse(
                403,
                "0x80040220",
                $"SecLib::AccessCheckEx2 failed. Principal user (Id={callerId}) lacks Read privilege or BU/Owner/POA access on {tableLogicalName} ({recordId:D}).");
        }

        var row = ProjectEntityRow(reader, primaryKeyName, selectColumns, includeAnnotations, null);
        await reader.CloseAsync();
        var maskedColumns = await GetMaskedFieldSecurityColumnsAsync(
            connection,
            callerId,
            tableLogicalName,
            cancellationToken);
        foreach (var masked in maskedColumns)
        {
            if (row.ContainsKey(masked))
            {
                row[masked] = null;
            }
        }

        var root = TrimTrailingSlash(serviceRootUri);
        var selectClause = selectColumns is { Count: > 0 }
            ? $"({string.Join(',', selectColumns)})"
            : string.Empty;
        row["@odata.context"] = $"{root}/$metadata#{entitySetName}{selectClause}/$entity";

        return new DataverseODataResponse(200, JsonSerializer.SerializeToElement(row));
    }

    public async ValueTask<DataverseODataResponse> RetrievePrincipalAccessAsync(
        Guid principalUserId,
        string targetEntitySetName,
        Guid targetRecordId,
        Uri serviceRootUri,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(connectionFactory);
        ArgumentNullException.ThrowIfNull(serviceRootUri);

        if (!TryResolveEntitySet(targetEntitySetName, out var tableLogicalName, out _))
        {
            return CreateDataverseErrorResponse(
                404,
                "0x8006088a",
                $"Unknown target entity set '{targetEntitySetName}'.");
        }

        await using var connection = connectionFactory.CreateConnection();
        await connection.OpenAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            WITH RECURSIVE caller AS (
                SELECT u.systemuserid, u.businessunitid
                FROM verseoff.systemuser u
                WHERE (u.systemuserid = @principalId OR u.azureactivedirectoryobjectid = @principalId)
                  AND u.isdisabled = FALSE
                LIMIT 1
            ),
            caller_principals AS (
                SELECT c.systemuserid AS principal_id, c.businessunitid AS bu_id FROM caller c
                UNION
                SELECT tm.teamid AS principal_id, t.businessunitid AS bu_id
                FROM verseoff.teammembership tm
                JOIN verseoff.team t ON t.teamid = tm.teamid
                JOIN caller c ON c.systemuserid = tm.systemuserid
            ),
            caller_roles AS (
                SELECT sur.roleid
                FROM verseoff.systemuserroles sur
                JOIN caller c ON c.systemuserid = sur.systemuserid
                UNION
                SELECT tr.roleid
                FROM verseoff.teamroles tr
                JOIN caller_principals cp ON cp.principal_id = tr.teamid
            ),
            bu_subtree AS (
                SELECT c.businessunitid
                FROM caller c
                UNION ALL
                SELECT child.businessunitid
                FROM verseoff.businessunit child
                JOIN bu_subtree parent ON child.parentbusinessunitid = parent.businessunitid
            ),
            target_rec AS (
                SELECT e.record_id, e.owner_id, e.owning_business_unit_id
                FROM verseoff.dataverse_entity e
                WHERE LOWER(e.table_logical_name) = LOWER(@tableLogicalName)
                  AND e.record_id = @recordId
                  AND e.is_deleted = FALSE
                LIMIT 1
            ),
            role_grants AS (
                SELECT p.accessright,
                       COALESCE(BIT_OR(rp.privilegedepthmask), 0) AS depth_mask
                FROM caller_roles cr
                JOIN verseoff.role r ON r.roleid = cr.roleid
                JOIN verseoff.roleprivileges rp ON rp.roleid = r.roleid OR rp.roleid = r.parentrootroleid
                JOIN verseoff.privilege p ON p.privilegeid = rp.privilegeid
                WHERE LOWER(p.table_logical_name) = LOWER(@tableLogicalName)
                GROUP BY p.accessright
            ),
            satisfied_role_rights AS (
                SELECT COALESCE(BIT_OR(rg.accessright), 0) AS mask
                FROM role_grants rg
                CROSS JOIN target_rec tr
                WHERE (rg.depth_mask & 8) <> 0
                   OR ((rg.depth_mask & 4) <> 0 AND tr.owning_business_unit_id IN (SELECT businessunitid FROM bu_subtree))
                   OR ((rg.depth_mask & 2) <> 0 AND tr.owning_business_unit_id IN (SELECT bu_id FROM caller_principals))
                   OR ((rg.depth_mask & 1) <> 0 AND tr.owner_id IN (SELECT principal_id FROM caller_principals))
            ),
            poa_rights AS (
                SELECT COALESCE(BIT_OR(poa.accessrightsmask | poa.inheritedaccessrightsmask), 0) AS mask
                FROM verseoff.principalobjectaccess poa
                JOIN caller_principals cp ON cp.principal_id = poa.principalid
                WHERE LOWER(poa.objecttypecode) = LOWER(@tableLogicalName)
                  AND poa.objectid = @recordId
            )
            SELECT (SELECT mask FROM satisfied_role_rights) | (SELECT mask FROM poa_rights) AS effective_mask;
            """;
        AddParameter(command, "@principalId", DbType.Guid, principalUserId);
        AddParameter(command, "@tableLogicalName", DbType.String, tableLogicalName);
        AddParameter(command, "@recordId", DbType.Guid, targetRecordId);

        var maskObj = await command.ExecuteScalarAsync(cancellationToken);
        var mask = maskObj is null or DBNull
            ? 0
            : Convert.ToInt32(maskObj, CultureInfo.InvariantCulture);

        var formattedRights = FormatDataverseAccessRightsMask(mask);
        var root = TrimTrailingSlash(serviceRootUri);
        var responseObj = new JsonObject
        {
            ["@odata.context"] = $"{root}/$metadata#Microsoft.Dynamics.CRM.RetrievePrincipalAccessResponse",
            ["AccessRights"] = formattedRights,
        };

        return new DataverseODataResponse(200, JsonSerializer.SerializeToElement(responseObj));
    }

    private static async ValueTask<(bool UserExists, Guid SystemUserId, Guid BusinessUnitId, int DepthMask)>
        EvaluateCallerTablePrivilegeAsync(
            DbConnection connection,
            Guid callerId,
            string tableLogicalName,
            string privilegeType,
            CancellationToken cancellationToken)
    {
        await using var command = connection.CreateCommand();
        command.CommandText =
            """
            WITH caller AS (
                SELECT u.systemuserid, u.businessunitid
                FROM verseoff.systemuser u
                WHERE (u.systemuserid = @callerId OR u.azureactivedirectoryobjectid = @callerId)
                  AND u.isdisabled = FALSE
                LIMIT 1
            ),
            caller_principals AS (
                SELECT c.systemuserid AS principal_id FROM caller c
                UNION
                SELECT tm.teamid AS principal_id
                FROM verseoff.teammembership tm
                JOIN caller c ON c.systemuserid = tm.systemuserid
            ),
            caller_roles AS (
                SELECT sur.roleid
                FROM verseoff.systemuserroles sur
                JOIN caller c ON c.systemuserid = sur.systemuserid
                UNION
                SELECT tr.roleid
                FROM verseoff.teamroles tr
                JOIN caller_principals cp ON cp.principal_id = tr.teamid
            )
            SELECT c.systemuserid,
                   c.businessunitid,
                   COALESCE((
                       SELECT BIT_OR(rp.privilegedepthmask)
                       FROM caller_roles cr
                       JOIN verseoff.role r ON r.roleid = cr.roleid
                       JOIN verseoff.roleprivileges rp ON rp.roleid = r.roleid OR rp.roleid = r.parentrootroleid
                       JOIN verseoff.privilege p ON p.privilegeid = rp.privilegeid
                       WHERE LOWER(p.table_logical_name) = LOWER(@tableLogicalName)
                         AND LOWER(p.privilege_type) = LOWER(@privilegeType)
                   ), 0) AS depth_mask
            FROM caller c;
            """;
        AddParameter(command, "@callerId", DbType.Guid, callerId);
        AddParameter(command, "@tableLogicalName", DbType.String, tableLogicalName);
        AddParameter(command, "@privilegeType", DbType.String, privilegeType);

        await using var reader = await command.ExecuteReaderAsync(
            CommandBehavior.SingleRow,
            cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return (false, Guid.Empty, Guid.Empty, 0);
        }

        return (
            true,
            ReadGuid(reader, 0),
            ReadGuid(reader, 1),
            Convert.ToInt32(reader.GetValue(2), CultureInfo.InvariantCulture));
    }

    private static async ValueTask<IReadOnlySet<string>> GetMaskedFieldSecurityColumnsAsync(
        DbConnection connection,
        Guid callerId,
        string tableLogicalName,
        CancellationToken cancellationToken)
    {
        var masked = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText =
                """
                WITH caller AS (
                    SELECT u.systemuserid
                    FROM verseoff.systemuser u
                    WHERE (u.systemuserid = @callerId OR u.azureactivedirectoryobjectid = @callerId)
                      AND u.isdisabled = FALSE
                    LIMIT 1
                ),
                caller_principals AS (
                    SELECT c.systemuserid AS principal_id FROM caller c
                    UNION
                    SELECT tm.teamid AS principal_id
                    FROM verseoff.teammembership tm
                    JOIN caller c ON c.systemuserid = tm.systemuserid
                )
                SELECT DISTINCT LOWER(fp.attributelogicalname)
                FROM verseoff.fieldpermission fp
                WHERE LOWER(fp.entityname) = LOWER(@tableLogicalName)
                  AND NOT EXISTS (
                      SELECT 1
                      FROM verseoff.fieldpermission allowed
                      WHERE LOWER(allowed.entityname) = LOWER(@tableLogicalName)
                        AND LOWER(allowed.attributelogicalname) = LOWER(fp.attributelogicalname)
                        AND allowed.canread <> 0
                        AND (
                            allowed.fieldsecurityprofileid IN (
                                SELECT sup.fieldsecurityprofileid
                                FROM verseoff.systemuserprofiles sup
                                JOIN caller c ON c.systemuserid = sup.systemuserid
                            )
                            OR allowed.fieldsecurityprofileid IN (
                                SELECT tp.fieldsecurityprofileid
                                FROM verseoff.teamprofiles tp
                                JOIN caller_principals cp ON cp.principal_id = tp.teamid
                            )
                        )
                  );
                """;
            AddParameter(command, "@callerId", DbType.Guid, callerId);
            AddParameter(command, "@tableLogicalName", DbType.String, tableLogicalName);

            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                if (!reader.IsDBNull(0))
                {
                    masked.Add(reader.GetString(0));
                }
            }
        }
        catch (DbException)
        {
            // Optional FLS tables may not be present in minimal test schemas
        }

        return masked;
    }

    private static JsonObject ProjectEntityRow(
        DbDataReader reader,
        string primaryKeyName,
        IReadOnlyList<string>? selectColumns,
        bool includeAnnotations,
        IReadOnlySet<string>? maskedColumns = null)
    {
        var recordId = ReadGuid(reader, 0);
        var ownerId = ReadGuid(reader, 1);
        var ownerType = reader.GetString(2);
        var owningBuId = ReadGuid(reader, 3);
        var stateCode = Convert.ToInt32(reader.GetValue(4), CultureInfo.InvariantCulture);
        var statusCode = Convert.ToInt32(reader.GetValue(5), CultureInfo.InvariantCulture);
        var versionNumber = Convert.ToInt64(reader.GetValue(6), CultureInfo.InvariantCulture);
        var etag = reader.GetString(7);
        var rawJson = reader.GetString(9);

        using var doc = JsonDocument.Parse(rawJson);
        var selectedSet = selectColumns is { Count: > 0 }
            ? new HashSet<string>(
                selectColumns.Select(c => c.Trim()).Where(c => c.Length > 0),
                StringComparer.OrdinalIgnoreCase)
            : null;

        var result = new JsonObject
        {
            ["@odata.etag"] = etag,
        };

        foreach (var prop in doc.RootElement.EnumerateObject())
        {
            if (prop.Name.StartsWith("@odata.", StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            var isAnnotation = prop.Name.Contains('@', StringComparison.Ordinal);
            if (isAnnotation && !includeAnnotations)
            {
                continue;
            }

            var baseName = isAnnotation
                ? prop.Name[..prop.Name.IndexOf('@', StringComparison.Ordinal)]
                : prop.Name;

            if (selectedSet is not null
                && !selectedSet.Contains(baseName)
                && !string.Equals(baseName, primaryKeyName, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            if (maskedColumns is not null && maskedColumns.Contains(baseName))
            {
                if (!isAnnotation)
                {
                    result[prop.Name] = null;
                }

                continue;
            }

            result[prop.Name] = JsonNode.Parse(prop.Value.GetRawText());
        }

        result[primaryKeyName] = recordId.ToString("D");
        if (selectedSet is null || selectedSet.Contains("_ownerid_value"))
        {
            result["_ownerid_value"] = ownerId.ToString("D");
            if (includeAnnotations)
            {
                result["_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"] = ownerType;
            }
        }

        if (selectedSet is null || selectedSet.Contains("_owningbusinessunit_value"))
        {
            result["_owningbusinessunit_value"] = owningBuId.ToString("D");
        }

        if (selectedSet is null || selectedSet.Contains("statecode"))
        {
            result["statecode"] = stateCode;
        }

        if (selectedSet is null || selectedSet.Contains("statuscode"))
        {
            result["statuscode"] = statusCode;
        }

        if (selectedSet is null || selectedSet.Contains("versionnumber"))
        {
            result["versionnumber"] = versionNumber;
        }

        return result;
    }

    private static string FormatDataverseAccessRightsMask(int mask)
    {
        if (mask == 0)
        {
            return "None";
        }

        var parts = new List<string>(8);
        if ((mask & 1) != 0) parts.Add("ReadAccess");
        if ((mask & 2) != 0) parts.Add("WriteAccess");
        if ((mask & 4) != 0) parts.Add("AppendAccess");
        if ((mask & 16) != 0) parts.Add("AppendToAccess");
        if ((mask & 32) != 0) parts.Add("CreateAccess");
        if ((mask & 65536) != 0) parts.Add("DeleteAccess");
        if ((mask & 262144) != 0) parts.Add("ShareAccess");
        if ((mask & 524288) != 0) parts.Add("AssignAccess");

        return parts.Count == 0 ? "None" : string.Join(", ", parts);
    }

    private static int ResolveEffectivePageSize(int? top, int? maxPageSize)
    {
        var effective = top ?? maxPageSize ?? 50;
        return Math.Clamp(effective, 1, 5000);
    }

    private static string TrimTrailingSlash(Uri uri) =>
        uri.ToString().TrimEnd('/');

    private static Guid ReadGuid(DbDataReader reader, int ordinal)
    {
        var val = reader.GetValue(ordinal);
        return val switch
        {
            Guid g => g,
            string s => Guid.Parse(s),
            _ => reader.GetGuid(ordinal),
        };
    }

    private static void AddParameter(
        DbCommand command,
        string name,
        DbType dbType,
        object value)
    {
        var parameter = command.CreateParameter();
        parameter.ParameterName = name;
        parameter.DbType = dbType;
        parameter.Value = value;
        command.Parameters.Add(parameter);
    }

    public static DataverseODataResponse CreateDataverseErrorResponse(
        int statusCode,
        string errorCode,
        string message)
    {
        var errorPayload = new JsonObject
        {
            ["error"] = new JsonObject
            {
                ["code"] = errorCode,
                ["message"] = message,
            },
        };
        return new DataverseODataResponse(
            statusCode,
            JsonSerializer.SerializeToElement(errorPayload));
    }
}

internal static class ODataFilterSqlCompiler
{
    public static string Compile(
        string? filter,
        DbCommand command,
        Action<DbCommand, string, DbType, object> addParameter)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return string.Empty;
        }

        var paramIndex = 0;
        return CompileDisjunction(filter.Trim(), command, addParameter, ref paramIndex);
    }

    private static string CompileDisjunction(
        string expr,
        DbCommand command,
        Action<DbCommand, string, DbType, object> addParameter,
        ref int paramIndex)
    {
        var parts = SplitTopLevelLogical(expr, " or ");
        if (parts.Count > 1)
        {
            var compiled = new List<string>(parts.Count);
            foreach (var part in parts)
            {
                compiled.Add($"({CompileConjunction(part, command, addParameter, ref paramIndex)})");
            }

            return string.Join(" OR ", compiled);
        }

        return CompileConjunction(expr, command, addParameter, ref paramIndex);
    }

    private static string CompileConjunction(
        string expr,
        DbCommand command,
        Action<DbCommand, string, DbType, object> addParameter,
        ref int paramIndex)
    {
        var parts = SplitTopLevelLogical(expr, " and ");
        if (parts.Count > 1)
        {
            var compiled = new List<string>(parts.Count);
            foreach (var part in parts)
            {
                compiled.Add($"({CompilePredicate(part, command, addParameter, ref paramIndex)})");
            }

            return string.Join(" AND ", compiled);
        }

        return CompilePredicate(expr, command, addParameter, ref paramIndex);
    }

    private static string CompilePredicate(
        string raw,
        DbCommand command,
        Action<DbCommand, string, DbType, object> addParameter,
        ref int paramIndex)
    {
        var expr = StripOuterParentheses(raw.Trim());

        if (expr.StartsWith("contains(", StringComparison.OrdinalIgnoreCase)
            || expr.StartsWith("startswith(", StringComparison.OrdinalIgnoreCase)
            || expr.StartsWith("endswith(", StringComparison.OrdinalIgnoreCase))
        {
            return CompileStringFunction(expr, command, addParameter, ref paramIndex);
        }

        var operators = new (string Token, string SqlOp)[]
        {
            (" eq ", "="),
            (" ne ", "<>"),
            (" ge ", ">="),
            (" le ", "<="),
            (" gt ", ">"),
            (" lt ", "<"),
        };

        foreach (var (token, sqlOp) in operators)
        {
            var idx = FindTopLevelToken(expr, token);
            if (idx > 0)
            {
                var field = expr[..idx].Trim();
                var rhs = expr[(idx + token.Length)..].Trim();
                ValidateIdentifier(field);

                var fieldKeyParam = $"@fKey{paramIndex}";
                var valParam = $"@fVal{paramIndex}";
                paramIndex++;
                addParameter(command, fieldKeyParam, DbType.String, field);

                if (string.Equals(rhs, "null", StringComparison.OrdinalIgnoreCase))
                {
                    return sqlOp == "="
                        ? $"jsonb_extract_path_text(e.data_json, {fieldKeyParam}) IS NULL"
                        : $"jsonb_extract_path_text(e.data_json, {fieldKeyParam}) IS NOT NULL";
                }

                if (rhs.StartsWith('\'') && rhs.EndsWith('\'') && rhs.Length >= 2)
                {
                    var unescaped = rhs[1..^1].Replace("''", "'", StringComparison.Ordinal);
                    addParameter(command, valParam, DbType.String, unescaped);
                    return $"jsonb_extract_path_text(e.data_json, {fieldKeyParam}) {sqlOp} {valParam}";
                }

                if (bool.TryParse(rhs, out var boolVal))
                {
                    addParameter(
                        command,
                        valParam,
                        DbType.String,
                        boolVal ? "true" : "false");
                    return $"LOWER(jsonb_extract_path_text(e.data_json, {fieldKeyParam})) {sqlOp} {valParam}";
                }

                if (decimal.TryParse(
                        rhs,
                        NumberStyles.Float,
                        CultureInfo.InvariantCulture,
                        out var decVal))
                {
                    addParameter(command, valParam, DbType.Decimal, decVal);
                    return $"(jsonb_extract_path_text(e.data_json, {fieldKeyParam}))::numeric {sqlOp} {valParam}";
                }

                if (Guid.TryParse(rhs, out var guidVal))
                {
                    addParameter(command, valParam, DbType.String, guidVal.ToString("D"));
                    return $"LOWER(jsonb_extract_path_text(e.data_json, {fieldKeyParam})) {sqlOp} LOWER({valParam})";
                }

                throw new FormatException($"Unsupported literal '{rhs}' in $filter.");
            }
        }

        throw new FormatException($"Unsupported predicate '{expr}' in $filter.");
    }

    private static string CompileStringFunction(
        string expr,
        DbCommand command,
        Action<DbCommand, string, DbType, object> addParameter,
        ref int paramIndex)
    {
        var openIdx = expr.IndexOf('(', StringComparison.Ordinal);
        var closeIdx = expr.LastIndexOf(')');
        if (openIdx <= 0 || closeIdx <= openIdx)
        {
            throw new FormatException($"Malformed string function '{expr}'.");
        }

        var fnName = expr[..openIdx].Trim().ToLowerInvariant();
        var args = expr[(openIdx + 1)..closeIdx];
        var commaIdx = args.IndexOf(',', StringComparison.Ordinal);
        if (commaIdx <= 0)
        {
            throw new FormatException($"Function '{fnName}' requires two arguments.");
        }

        var field = args[..commaIdx].Trim();
        var literal = args[(commaIdx + 1)..].Trim();
        ValidateIdentifier(field);
        if (!literal.StartsWith('\'') || !literal.EndsWith('\'') || literal.Length < 2)
        {
            throw new FormatException($"Function '{fnName}' second argument must be a string literal.");
        }

        var rawVal = literal[1..^1].Replace("''", "'", StringComparison.Ordinal)
            .Replace("~", "~~", StringComparison.Ordinal)
            .Replace("%", "~%", StringComparison.Ordinal)
            .Replace("_", "~_", StringComparison.Ordinal);

        var pattern = fnName switch
        {
            "contains" => $"%{rawVal}%",
            "startswith" => $"{rawVal}%",
            "endswith" => $"%{rawVal}",
            _ => throw new FormatException($"Unsupported function '{fnName}'."),
        };

        var fieldKeyParam = $"@fKey{paramIndex}";
        var valParam = $"@fVal{paramIndex}";
        paramIndex++;
        addParameter(command, fieldKeyParam, DbType.String, field);
        addParameter(command, valParam, DbType.String, pattern);

        return $"jsonb_extract_path_text(e.data_json, {fieldKeyParam}) ILIKE {valParam} ESCAPE '~'";
    }

    private static List<string> SplitTopLevelLogical(string expr, string token)
    {
        var results = new List<string>();
        var depth = 0;
        var inQuotes = false;
        var lastStart = 0;

        for (var i = 0; i < expr.Length; i++)
        {
            var ch = expr[i];
            if (ch == '\'')
            {
                inQuotes = !inQuotes;
                continue;
            }

            if (inQuotes)
            {
                continue;
            }

            if (ch == '(')
            {
                depth++;
            }
            else if (ch == ')')
            {
                depth = Math.Max(0, depth - 1);
            }
            else if (depth == 0
                     && i + token.Length <= expr.Length
                     && string.Compare(expr, i, token, 0, token.Length, StringComparison.OrdinalIgnoreCase) == 0)
            {
                results.Add(expr[lastStart..i].Trim());
                i += token.Length - 1;
                lastStart = i + 1;
            }
        }

        if (results.Count > 0)
        {
            results.Add(expr[lastStart..].Trim());
        }

        return results;
    }

    private static int FindTopLevelToken(string expr, string token)
    {
        var depth = 0;
        var inQuotes = false;
        for (var i = 0; i <= expr.Length - token.Length; i++)
        {
            var ch = expr[i];
            if (ch == '\'')
            {
                inQuotes = !inQuotes;
                continue;
            }

            if (inQuotes)
            {
                continue;
            }

            if (ch == '(') depth++;
            else if (ch == ')') depth = Math.Max(0, depth - 1);
            else if (depth == 0
                     && string.Compare(expr, i, token, 0, token.Length, StringComparison.OrdinalIgnoreCase) == 0)
            {
                return i;
            }
        }

        return -1;
    }

    private static string StripOuterParentheses(string expr)
    {
        while (expr.Length >= 2 && expr[0] == '(' && expr[^1] == ')')
        {
            var depth = 0;
            var inQuotes = false;
            var wrapsAll = true;
            for (var i = 0; i < expr.Length - 1; i++)
            {
                if (expr[i] == '\'') inQuotes = !inQuotes;
                if (inQuotes) continue;
                if (expr[i] == '(') depth++;
                else if (expr[i] == ')') depth--;
                if (depth == 0)
                {
                    wrapsAll = false;
                    break;
                }
            }

            if (!wrapsAll)
            {
                break;
            }

            expr = expr[1..^1].Trim();
        }

        return expr;
    }

    internal static void ValidateIdentifier(string identifier)
    {
        if (string.IsNullOrWhiteSpace(identifier)
            || !identifier.All(ch => char.IsAsciiLetterOrDigit(ch) || ch == '_'))
        {
            throw new FormatException($"Invalid Dataverse attribute identifier '{identifier}'.");
        }
    }
}

internal static class ODataOrderBySqlCompiler
{
    private static readonly HashSet<string> NumericAttributes = new(StringComparer.OrdinalIgnoreCase)
    {
        "revenue",
        "numberofemployees",
        "statecode",
        "statuscode",
        "versionnumber",
        "accessrightsmask",
        "inheritedaccessrightsmask",
    };

    public static string Compile(string? orderBy)
    {
        if (string.IsNullOrWhiteSpace(orderBy))
        {
            return "modified_on DESC, record_id ASC";
        }

        var clauses = new List<string>();
        foreach (var rawSegment in orderBy.Split(',', StringSplitOptions.RemoveEmptyEntries))
        {
            var tokens = rawSegment.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (tokens.Length is 0 or > 2)
            {
                throw new FormatException($"Malformed $orderby segment '{rawSegment}'.");
            }

            var field = tokens[0];
            ODataFilterSqlCompiler.ValidateIdentifier(field);
            var direction = tokens.Length == 2
                ? tokens[1].ToUpperInvariant() switch
                {
                    "ASC" => "ASC",
                    "DESC" => "DESC",
                    _ => throw new FormatException($"Invalid sort direction '{tokens[1]}'."),
                }
                : "ASC";

            if (NumericAttributes.Contains(field))
            {
                clauses.Add($"(jsonb_extract_path_text(data_json, '{field}'))::numeric {direction} NULLS LAST");
            }
            else
            {
                clauses.Add($"jsonb_extract_path_text(data_json, '{field}') {direction} NULLS LAST");
            }
        }

        clauses.Add("record_id ASC");
        return string.Join(", ", clauses);
    }
}
