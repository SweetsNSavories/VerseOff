#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for named placeholders
#pragma warning disable CA1305 // Use IFormatProvider
#pragma warning disable CA1873 // Evaluation of this argument may be expensive
#pragma warning disable ASP0019 // Use IHeaderDictionary methods

using Microsoft.AspNetCore.Mvc;
using VerseOff.Customization.Data;
using VerseOff.Customization.Metadata;

namespace VerseOff.Gateway.Api;

/// <summary>
/// REST API controller for reading Dataverse entity data
/// Supports filtering, sorting, pagination, and related record traversal
/// </summary>
[ApiController]
[Route("api/v1/data")]
[Produces("application/json")]
public class DataController : ControllerBase
{
    private readonly DataQueryService _queryService;
    private readonly ILogger<DataController> _logger;

    public DataController(DataQueryService queryService, ILogger<DataController> logger)
    {
        ArgumentNullException.ThrowIfNull(queryService);
        ArgumentNullException.ThrowIfNull(logger);

        _queryService = queryService;
        _logger = logger;
    }

    /// <summary>
    /// Get all records for an entity with filtering, sorting, and pagination
    /// 
    /// Query Parameters:
    /// - $filter: QueryFilter in JSON format (e.g., {"fieldName":"status","operator":"Equals","value":"active"})
    /// - $orderby: Comma-separated field names with optional :desc suffix (e.g., "name,:desc,createdon")
    /// - $top: Page size (default 50, max 5000)
    /// - $pageNumber: 1-based page number
    /// 
    /// Example: GET /api/v1/data/account?$filter={"fieldName":"status","operator":"Equals","value":"active"}&$orderby=name&$pageNumber=1&$top=50
    /// </summary>
    [HttpGet("{entity}")]
    public async Task<IActionResult> GetEntityRecords(
        string entity,
        [FromQuery(Name = "$filter")] string? filterJson = null,
        [FromQuery(Name = "$orderby")] string? orderBy = null,
        [FromQuery(Name = "$top")] int? pageSize = null,
        [FromQuery(Name = "$pageNumber")] int? pageNumber = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/data/{entity} - filter={filter}, orderBy={orderBy}, pageSize={pageSize}, pageNumber={pageNumber}",
                entity, filterJson ?? "null", orderBy ?? "null", pageSize, pageNumber);

            QueryFilter? filter = null;
            if (!string.IsNullOrEmpty(filterJson))
            {
                filter = QueryFilterFromJson(filterJson);
            }

            var orderByList = ParseOrderBy(orderBy);
            var page = pageNumber ?? 1;
            var size = pageSize ?? 50;

            var result = await _queryService.ExecuteQueryAsync(
                entity,
                filter: filter,
                orderBy: orderByList,
                pageNumber: page,
                pageSize: size,
                cancellationToken: cancellationToken
            );

            var dto = new QueryResultDto
            {
                EntityLogicalName = result.EntityLogicalName,
                Records = result.Records,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecordCount = result.TotalRecordCount,
                TotalPageCount = result.TotalPageCount,
                HasMoreRecords = result.HasMoreRecords
            };

            if (Response?.HttpContext != null)
            {
                Response.Headers["X-Total-Count"] = result.TotalRecordCount.ToString();
                Response.Headers["X-Page-Number"] = result.PageNumber.ToString();
                Response.Headers["X-Page-Size"] = result.PageSize.ToString();
            }

            return Ok(dto);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation for entity {entity}", entity);
            return NotFound(new ErrorDto { Message = ex.Message, Code = "ENTITY_NOT_FOUND" });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument for entity {entity}", entity);
            return BadRequest(new ErrorDto { Message = ex.Message, Code = "INVALID_ARGUMENT" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error getting records for entity {entity}", entity);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Get a single record by ID
    /// 
    /// Query Parameters:
    /// - $select: Comma-separated field names to retrieve (default: all fields)
    /// 
    /// Example: GET /api/v1/data/account/acc-001?$select=name,creditlimit,status
    /// </summary>
    [HttpGet("{entity}/{id}")]
    public async Task<IActionResult> GetRecord(
        string entity,
        string id,
        [FromQuery(Name = "$select")] string? selectFields = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/data/{entity}/{id} - select={select}", entity, id, selectFields ?? "null");

            var fields = string.IsNullOrEmpty(selectFields)
                ? null
                : selectFields.Split(',').Select(f => f.Trim()).ToList();

            var record = await _queryService.GetRecordAsync(entity, id, fields, cancellationToken);

            if (record == null)
            {
                return NotFound(new ErrorDto { Message = $"Record '{id}' not found in entity '{entity}'", Code = "RECORD_NOT_FOUND" });
            }

            return Ok(record);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation for entity {entity}", entity);
            return NotFound(new ErrorDto { Message = ex.Message, Code = "ENTITY_NOT_FOUND" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error getting record {id} for entity {entity}", id, entity);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Get related records for a parent record via a relationship
    /// </summary>
    [HttpGet("{entity}/{id}/{relationship}")]
    public async Task<IActionResult> GetRelatedRecords(
        string entity,
        string id,
        string relationship,
        [FromQuery(Name = "$filter")] string? filterJson = null,
        [FromQuery(Name = "$orderby")] string? orderBy = null,
        [FromQuery(Name = "$top")] int? pageSize = null,
        [FromQuery(Name = "$pageNumber")] int? pageNumber = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/data/{entity}/{id}/{relationship} - filter={filter}, orderBy={orderBy}",
                entity, id, relationship, filterJson ?? "null", orderBy ?? "null");

            QueryFilter? filter = null;
            if (!string.IsNullOrEmpty(filterJson))
            {
                filter = QueryFilterFromJson(filterJson);
            }

            var orderByList = ParseOrderBy(orderBy);
            var page = pageNumber ?? 1;
            var size = pageSize ?? 50;

            var result = await _queryService.GetRelatedRecordsAsync(
                entity,
                id,
                relationship,
                filter: filter,
                cancellationToken: cancellationToken
            );

            // Apply sorting and pagination manually
            var sorted = orderByList != null && orderByList.Count > 0
                ? ApplySorting(result, orderByList)
                : result;

            var total = sorted.Count;
            var paginated = sorted
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            var dto = new QueryResultDto
            {
                EntityLogicalName = entity,
                Records = paginated,
                PageNumber = page,
                PageSize = size,
                TotalRecordCount = total,
                TotalPageCount = (total + size - 1) / size,
                HasMoreRecords = page < ((total + size - 1) / size)
            };

            if (Response?.HttpContext != null)
            {
                Response.Headers["X-Total-Count"] = total.ToString();
                Response.Headers["X-Page-Number"] = page.ToString();
                Response.Headers["X-Page-Size"] = size.ToString();
            }

            return Ok(dto);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation for entity {entity}", entity);
            return NotFound(new ErrorDto { Message = ex.Message, Code = "ENTITY_NOT_FOUND" });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument for entity {entity}", entity);
            return BadRequest(new ErrorDto { Message = ex.Message, Code = "INVALID_ARGUMENT" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error getting related records for {entity}/{id}/{relationship}", entity, id, relationship);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Get view definition with column metadata
    /// </summary>
    [HttpGet("{entity}/views/{viewId}")]
    public async Task<IActionResult> GetViewDefinition(
        string entity,
        string viewId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/data/{entity}/views/{viewId}", entity, viewId);

            var viewDef = await _queryService.GetViewDefinitionAsync(entity, viewId, cancellationToken);

            if (viewDef == null)
            {
                return NotFound(new ErrorDto { Message = $"View '{viewId}' not found", Code = "VIEW_NOT_FOUND" });
            }

            var dto = new ViewDefinitionDto
            {
                ViewId = viewDef.ViewId,
                ViewName = viewDef.ViewName,
                EntityLogicalName = viewDef.EntityLogicalName,
                Columns = viewDef.Columns,
                DefaultPageSize = viewDef.DefaultPageSize,
                DefaultSort = viewDef.DefaultSort?.Select(s => new OrderByClauseDto { FieldName = s.FieldName, Descending = s.Descending }).ToList(),
                FilterXml = viewDef.FilterXml
            };

            return Ok(dto);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation for view {viewId}", viewId);
            return NotFound(new ErrorDto { Message = ex.Message, Code = "ENTITY_NOT_FOUND" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error getting view definition for {entity}/{viewId}", entity, viewId);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    #region Helpers

    private static QueryFilter? QueryFilterFromJson(string json)
    {
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<QueryFilter>(json);
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Invalid filter JSON: {ex.Message}", nameof(json), ex);
        }
    }

    private static List<OrderByClause> ParseOrderBy(string? orderBy)
    {
        if (string.IsNullOrEmpty(orderBy))
            return new();

        var clauses = new List<OrderByClause>();
        var parts = orderBy.Split(',');

        foreach (var part in parts)
        {
            var trimmed = part.Trim();
            if (string.IsNullOrEmpty(trimmed))
                continue;

            var descending = trimmed.EndsWith(":desc", StringComparison.OrdinalIgnoreCase);
            var fieldName = descending
                ? trimmed[..^5] // Remove ":desc" suffix
                : trimmed;

            clauses.Add(new OrderByClause(fieldName, descending));
        }

        return clauses;
    }

    private static List<Dictionary<string, object>> ApplySorting(
        List<Dictionary<string, object>> records,
        List<OrderByClause> orderBy)
    {
        if (orderBy == null || orderBy.Count == 0)
            return records;

        var sorted = records.AsEnumerable();

        foreach (var clause in orderBy)
        {
            sorted = clause.Descending
                ? sorted.OrderByDescending(r => r.TryGetValue(clause.FieldName, out var v) ? v : null)
                : sorted.OrderBy(r => r.TryGetValue(clause.FieldName, out var v) ? v : null);
        }

        return sorted.ToList();
    }

    #endregion
}

/// <summary>
/// DTO for query results (serializable JSON response)
/// </summary>
public record QueryResultDto
{
    public string EntityLogicalName { get; set; } = string.Empty;
    public List<Dictionary<string, object>> Records { get; set; } = new();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalRecordCount { get; set; }
    public int TotalPageCount { get; set; }
    public bool HasMoreRecords { get; set; }
}

/// <summary>
/// DTO for view definitions
/// </summary>
public record ViewDefinitionDto
{
    public string ViewId { get; set; } = string.Empty;
    public string ViewName { get; set; } = string.Empty;
    public string EntityLogicalName { get; set; } = string.Empty;
    public List<string> Columns { get; set; } = new();
    public int DefaultPageSize { get; set; } = 50;
    public List<OrderByClauseDto>? DefaultSort { get; set; }
    public string? FilterXml { get; set; }
}

/// <summary>
/// DTO for order by clause
/// </summary>
public record OrderByClauseDto
{
    public string FieldName { get; set; } = string.Empty;
    public bool Descending { get; set; }
}

/// <summary>
/// DTO for error responses
/// </summary>
public record ErrorDto
{
    public string Message { get; set; } = string.Empty;
    public string Code { get; set; } = "ERROR";
}
