using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using VerseOff.ReadModel;

namespace VerseOff.Gateway;

/// <summary>
/// Maps Dataverse Web API v9.2–compatible OData v4 endpoints (/api/data/v9.2/...)
/// backed by the PostgreSQL security-trimmed OData engine (<see cref="IDataversePostgreSqlODataEngine"/>).
/// </summary>
public static partial class DataverseWebApiODataEndpoints
{
    public static IEndpointRouteBuilder MapDataverseWebApiOData(
        this IEndpointRouteBuilder endpoints)
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        var group = endpoints.MapGroup("/api/data/v9.2").AllowAnonymous();

        group.MapGet(
            "/$metadata",
            (HttpContext httpContext) =>
            {
                httpContext.Response.Headers["OData-Version"] = "4.0";
                const string csdl =
                    """
                    <?xml version="1.0" encoding="utf-8"?>
                    <edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
                      <edmx:DataServices>
                        <Schema Namespace="Microsoft.Dynamics.CRM" xmlns="http://docs.oasis-open.org/odata/ns/edm">
                          <ComplexType Name="WhoAmIResponse">
                            <Property Name="BusinessUnitId" Type="Edm.Guid" Nullable="false" />
                            <Property Name="UserId" Type="Edm.Guid" Nullable="false" />
                            <Property Name="OrganizationId" Type="Edm.Guid" Nullable="false" />
                          </ComplexType>
                          <ComplexType Name="RetrievePrincipalAccessResponse">
                            <Property Name="AccessRights" Type="Edm.String" Nullable="false" />
                          </ComplexType>
                          <EntityContainer Name="System">
                            <EntitySet Name="accounts" EntityType="Microsoft.Dynamics.CRM.account" />
                            <EntitySet Name="contacts" EntityType="Microsoft.Dynamics.CRM.contact" />
                            <EntitySet Name="tasks" EntityType="Microsoft.Dynamics.CRM.task" />
                            <EntitySet Name="phonecalls" EntityType="Microsoft.Dynamics.CRM.phonecall" />
                            <EntitySet Name="appointments" EntityType="Microsoft.Dynamics.CRM.appointment" />
                            <EntitySet Name="letters" EntityType="Microsoft.Dynamics.CRM.letter" />
                            <EntitySet Name="businessunits" EntityType="Microsoft.Dynamics.CRM.businessunit" />
                            <EntitySet Name="systemusers" EntityType="Microsoft.Dynamics.CRM.systemuser" />
                            <EntitySet Name="teams" EntityType="Microsoft.Dynamics.CRM.team" />
                            <EntitySet Name="roles" EntityType="Microsoft.Dynamics.CRM.role" />
                            <EntitySet Name="privileges" EntityType="Microsoft.Dynamics.CRM.privilege" />
                            <EntitySet Name="principalobjectaccessset" EntityType="Microsoft.Dynamics.CRM.principalobjectaccess" />
                          </EntityContainer>
                        </Schema>
                      </edmx:DataServices>
                    </edmx:Edmx>
                    """;
                return Results.Content(csdl, "application/xml; charset=utf-8");
            });

        group.MapGet(
            "/WhoAmI",
            (HttpContext httpContext,
             ClaimsPrincipal user,
             IDataversePostgreSqlODataEngine engine,
             CancellationToken cancellationToken) =>
                HandleWhoAmIAsync(httpContext, user, engine, cancellationToken));

        group.MapGet(
            "/WhoAmI()",
            (HttpContext httpContext,
             ClaimsPrincipal user,
             IDataversePostgreSqlODataEngine engine,
             CancellationToken cancellationToken) =>
                HandleWhoAmIAsync(httpContext, user, engine, cancellationToken));

        group.MapGet(
            "/systemusers({principalId:guid})/Microsoft.Dynamics.CRM.RetrievePrincipalAccess(Target={targetAlias})",
            async (
                Guid principalId,
                string targetAlias,
                HttpContext httpContext,
                IDataversePostgreSqlODataEngine engine,
                CancellationToken cancellationToken) =>
            {
                var rawTarget = httpContext.Request.Query[targetAlias].FirstOrDefault()
                    ?? targetAlias;
                if (!TryParseODataTargetReference(rawTarget, out var entitySet, out var recordId))
                {
                    return WriteODataResponse(
                        httpContext,
                        DataversePostgreSqlODataEngine.CreateDataverseErrorResponse(
                            400,
                            "0x80060888",
                            $"Invalid Target reference '{rawTarget}' for RetrievePrincipalAccess."));
                }

                var serviceRoot = BuildServiceRootUri(httpContext);
                var response = await engine.RetrievePrincipalAccessAsync(
                    principalId,
                    entitySet,
                    recordId,
                    serviceRoot,
                    cancellationToken);
                return WriteODataResponse(httpContext, response);
            });

        group.MapGet(
            "/{segment}",
            async (
                string segment,
                HttpContext httpContext,
                ClaimsPrincipal user,
                IDataversePostgreSqlODataEngine engine,
                CancellationToken cancellationToken) =>
            {
                var callerId = ResolveCallerId(httpContext, user);
                var serviceRoot = BuildServiceRootUri(httpContext);
                var select = ParseSelectQuery(httpContext.Request.Query["$select"].FirstOrDefault());
                var preferHeader = string.Join(
                    ",",
                    httpContext.Request.Headers["Prefer"].Where(v => v is not null));
                var includeAnnotations = preferHeader.Contains(
                    "odata.include-annotations",
                    StringComparison.OrdinalIgnoreCase);

                // Check if segment is single-record key syntax: e.g. accounts(0a5e7ad6-53d6-f111-a05d-00224805ee15)
                var keyMatch = EntityKeySegmentRegex().Match(segment);
                if (keyMatch.Success
                    && Guid.TryParse(keyMatch.Groups["id"].Value, out var recordId))
                {
                    var entitySetName = keyMatch.Groups["set"].Value;
                    var singleResponse = await engine.RetrieveRecordAsync(
                        entitySetName,
                        recordId,
                        callerId,
                        select,
                        includeAnnotations,
                        serviceRoot,
                        cancellationToken);
                    return WriteODataResponse(httpContext, singleResponse);
                }

                // Otherwise treat segment as an EntitySet collection query
                var filter = httpContext.Request.Query["$filter"].FirstOrDefault();
                var orderBy = httpContext.Request.Query["$orderby"].FirstOrDefault();
                var top = TryParseInt(httpContext.Request.Query["$top"].FirstOrDefault());
                var skip = TryParseInt(httpContext.Request.Query["$skip"].FirstOrDefault());
                var includeCount = bool.TryParse(
                    httpContext.Request.Query["$count"].FirstOrDefault(),
                    out var countFlag) && countFlag;
                var deltaToken = TryParseLong(httpContext.Request.Query["$deltatoken"].FirstOrDefault());
                var trackChanges = preferHeader.Contains(
                    "odata.track-changes",
                    StringComparison.OrdinalIgnoreCase);
                var maxPageSize = ParseMaxPageSize(preferHeader);

                var queryRequest = new DataverseODataQueryRequest(
                    segment,
                    callerId,
                    serviceRoot,
                    select,
                    filter,
                    orderBy,
                    top,
                    skip,
                    maxPageSize,
                    includeCount,
                    includeAnnotations,
                    trackChanges,
                    deltaToken);

                var collectionResponse = await engine.QueryEntitySetAsync(
                    queryRequest,
                    cancellationToken);
                return WriteODataResponse(httpContext, collectionResponse);
            });

        return endpoints;
    }

    private static async Task<IResult> HandleWhoAmIAsync(
        HttpContext httpContext,
        ClaimsPrincipal user,
        IDataversePostgreSqlODataEngine engine,
        CancellationToken cancellationToken)
    {
        var callerId = ResolveCallerId(httpContext, user);
        var serviceRoot = BuildServiceRootUri(httpContext);
        var response = await engine.ExecuteWhoAmIAsync(
            callerId,
            serviceRoot,
            cancellationToken);
        return WriteODataResponse(httpContext, response);
    }

    private static Guid ResolveCallerId(HttpContext httpContext, ClaimsPrincipal user)
    {
        var callerHeader = httpContext.Request.Headers["MSCRMCallerID"].FirstOrDefault()
            ?? httpContext.Request.Headers["CallerObjectId"].FirstOrDefault()
            ?? httpContext.Request.Headers["x-ms-caller-id"].FirstOrDefault()
            ?? httpContext.Request.Query["MSCRMCallerID"].FirstOrDefault();
        if (Guid.TryParse(callerHeader, out var headerGuid) && headerGuid != Guid.Empty)
        {
            return headerGuid;
        }

        var claimVal = user.FindFirst("oid")?.Value
            ?? user.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value
            ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claimVal, out var claimGuid) ? claimGuid : Guid.Empty;
    }

    private static Uri BuildServiceRootUri(HttpContext httpContext)
    {
        var req = httpContext.Request;
        var host = req.Host.HasValue ? req.Host.Value : "localhost";
        var scheme = string.IsNullOrWhiteSpace(req.Scheme) ? "https" : req.Scheme;
        return new Uri($"{scheme}://{host}/api/data/v9.2");
    }

    private static string[]? ParseSelectQuery(string? rawSelect)
    {
        if (string.IsNullOrWhiteSpace(rawSelect))
        {
            return null;
        }

        return rawSelect
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(s => s.Length > 0)
            .ToArray();
    }

    private static int? ParseMaxPageSize(string preferHeader)
    {
        if (string.IsNullOrWhiteSpace(preferHeader))
        {
            return null;
        }

        var match = MaxPageSizeRegex().Match(preferHeader);
        return match.Success && int.TryParse(
            match.Groups["size"].Value,
            NumberStyles.None,
            CultureInfo.InvariantCulture,
            out var size)
            ? size
            : null;
    }

    private static bool TryParseODataTargetReference(
        string? rawTarget,
        out string entitySetName,
        out Guid recordId)
    {
        entitySetName = string.Empty;
        recordId = Guid.Empty;
        if (string.IsNullOrWhiteSpace(rawTarget))
        {
            return false;
        }

        var match = TargetReferenceRegex().Match(rawTarget);
        if (!match.Success || !Guid.TryParse(match.Groups["id"].Value, out recordId))
        {
            return false;
        }

        entitySetName = match.Groups["set"].Value;
        return true;
    }

    private static int? TryParseInt(string? val) =>
        int.TryParse(val, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed)
            ? parsed
            : null;

    private static long? TryParseLong(string? val) =>
        long.TryParse(val, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed)
            ? parsed
            : null;

    private static IResult WriteODataResponse(
        HttpContext httpContext,
        DataverseODataResponse response)
    {
        httpContext.Response.Headers["OData-Version"] = "4.0";
        if (response.Headers is not null)
        {
            foreach (var kvp in response.Headers)
            {
                httpContext.Response.Headers[kvp.Key] = kvp.Value;
            }
        }

        return Results.Json(
            response.Payload,
            statusCode: response.StatusCode,
            contentType: "application/json; odata.metadata=minimal; odata.streaming=true; charset=utf-8");
    }

    [GeneratedRegex(@"^(?<set>[A-Za-z0-9_]+)\((?<id>[0-9a-fA-F\-]{36})\)$", RegexOptions.CultureInvariant)]
    private static partial Regex EntityKeySegmentRegex();

    [GeneratedRegex(@"(?<set>[A-Za-z0-9_]+)\((?<id>[0-9a-fA-F\-]{36})\)", RegexOptions.CultureInvariant)]
    private static partial Regex TargetReferenceRegex();

    [GeneratedRegex(@"odata\.maxpagesize=(?<size>\d+)", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex MaxPageSizeRegex();
}

internal sealed class GatewayNpgsqlConnectionFactory(string connectionString) : IPostgreSqlConnectionFactory
{
    public System.Data.Common.DbConnection CreateConnection() =>
        new Npgsql.NpgsqlConnection(connectionString);
}
