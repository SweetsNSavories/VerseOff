using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Data;

/// <summary>
/// Service for querying and retrieving data from views and grids
/// </summary>
public class DataQueryService
{
    private readonly Dictionary<string, EntityMetadata> _metadata;
    private readonly IDataProvider _dataProvider;
    private readonly Dictionary<string, ViewDefinition> _viewCache;
    private readonly TimeSpan _cacheDuration;

    public DataQueryService(Dictionary<string, EntityMetadata> metadata, IDataProvider dataProvider)
    {
        ArgumentNullException.ThrowIfNull(metadata);
        ArgumentNullException.ThrowIfNull(dataProvider);

        _metadata = metadata;
        _dataProvider = dataProvider;
        _viewCache = new();
        _cacheDuration = TimeSpan.FromMinutes(15);
    }

    /// <summary>
    /// Execute a query with filtering, sorting, and pagination
    /// </summary>
    public async Task<QueryResult> ExecuteQueryAsync(
        string entityLogicalName,
        QueryFilter? filter = null,
        List<OrderByClause>? orderBy = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        if (!_metadata.TryGetValue(entityLogicalName, out var entity))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found");

        if (pageNumber < 1)
            throw new ArgumentException("Page number must be >= 1", nameof(pageNumber));
        if (pageSize < 1 || pageSize > 5000)
            throw new ArgumentException("Page size must be between 1 and 5000", nameof(pageSize));

        var data = await _dataProvider.GetRecordsAsync(entityLogicalName, cancellationToken);
        var filtered = ApplyFilter(data, filter, entity);
        var sorted = ApplySorting(filtered, orderBy);
        var paginated = ApplyPagination(sorted, pageNumber, pageSize);

        return new QueryResult(
            EntityLogicalName: entityLogicalName,
            Records: paginated.ToList(),
            PageNumber: pageNumber,
            PageSize: pageSize,
            TotalRecordCount: filtered.Count,
            TotalPageCount: (filtered.Count + pageSize - 1) / pageSize,
            HasMoreRecords: pageNumber < ((filtered.Count + pageSize - 1) / pageSize)
        );
    }

    /// <summary>
    /// Get a single record by ID
    /// </summary>
    public async Task<Dictionary<string, object>?> GetRecordAsync(
        string entityLogicalName,
        string recordId,
        List<string>? selectedFields = null,
        CancellationToken cancellationToken = default)
    {
        if (!_metadata.TryGetValue(entityLogicalName, out var entity))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found");

        var records = await _dataProvider.GetRecordsAsync(entityLogicalName, cancellationToken);
        var record = records.FirstOrDefault(r =>
        {
            if (r.TryGetValue("id", out var id) && id?.ToString() == recordId)
                return true;
            if (r.TryGetValue("Id", out var Id) && Id?.ToString() == recordId)
                return true;
            return false;
        });

        if (record == null)
            return null;

        if (selectedFields != null && selectedFields.Count > 0)
        {
            return record
                .Where(kvp => selectedFields.Contains(kvp.Key, StringComparer.OrdinalIgnoreCase))
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
        }

        return record;
    }

    /// <summary>
    /// Get related records for a parent record
    /// </summary>
    public async Task<List<Dictionary<string, object>>> GetRelatedRecordsAsync(
        string parentEntityLogicalName,
        string parentRecordId,
        string relationshipName,
        QueryFilter? filter = null,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(relationshipName);

        if (!_metadata.TryGetValue(parentEntityLogicalName, out var parentEntity))
            throw new InvalidOperationException($"Entity '{parentEntityLogicalName}' not found");

        // Fetch related records from provider
        var relatedRecords = await _dataProvider.GetRelatedRecordsAsync(
            parentEntityLogicalName,
            parentRecordId,
            relationshipName,
            cancellationToken
        );

        if (filter == null)
            return relatedRecords;

        // Filter results based on provided filter
        return relatedRecords.Where(record => filter.Evaluate(record)).ToList();
    }

    /// <summary>
    /// Get records in a view
    /// </summary>
    public async Task<QueryResult> GetViewRecordsAsync(
        string entityLogicalName,
        string viewId,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        if (!_metadata.TryGetValue(entityLogicalName, out var entity))
            throw new InvalidOperationException($"Entity '{entityLogicalName}' not found");

        var view = await GetViewDefinitionAsync(entityLogicalName, viewId, cancellationToken);
        if (view == null)
            throw new InvalidOperationException($"View '{viewId}' not found for entity '{entityLogicalName}'");

        var filter = QueryFilter.FromViewFilterXml(view.FilterXml);
        return await ExecuteQueryAsync(entityLogicalName, filter, null, pageNumber, pageSize, cancellationToken);
    }

    /// <summary>
    /// Get or retrieve view definition (with caching)
    /// </summary>
    public async Task<ViewDefinition?> GetViewDefinitionAsync(
        string entityLogicalName,
        string viewId,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"{entityLogicalName}:{viewId}";

        if (_viewCache.TryGetValue(cacheKey, out var cachedView))
        {
            if (DateTime.UtcNow - cachedView.CachedAt < _cacheDuration)
                return cachedView;

            _viewCache.Remove(cacheKey);
        }

        var view = await _dataProvider.GetViewDefinitionAsync(entityLogicalName, viewId, cancellationToken);
        if (view != null)
        {
            view.CachedAt = DateTime.UtcNow;
            _viewCache[cacheKey] = view;
        }

        return view;
    }

    /// <summary>
    /// Clear view cache
    /// </summary>
    public void ClearViewCache()
    {
        _viewCache.Clear();
    }

    private static List<Dictionary<string, object>> ApplyFilter(
        IEnumerable<Dictionary<string, object>> records,
        QueryFilter? filter,
        EntityMetadata entity)
    {
        if (filter == null)
            return records.ToList();

        return records.Where(record => filter.Evaluate(record)).ToList();
    }

    private static List<Dictionary<string, object>> ApplySorting(
        IEnumerable<Dictionary<string, object>> records,
        List<OrderByClause>? orderBy)
    {
        if (orderBy == null || orderBy.Count == 0)
            return records.ToList();

        var sorted = records.AsEnumerable();
        foreach (var clause in orderBy)
        {
            sorted = clause.Descending
                ? sorted.OrderByDescending(r => GetFieldValue(r, clause.FieldName))
                : sorted.OrderBy(r => GetFieldValue(r, clause.FieldName));
        }

        return sorted.ToList();
    }

    private static List<Dictionary<string, object>> ApplyPagination(
        IEnumerable<Dictionary<string, object>> records,
        int pageNumber,
        int pageSize)
    {
        var skip = (pageNumber - 1) * pageSize;
        return records.Skip(skip).Take(pageSize).ToList();
    }

    private static object? GetFieldValue(Dictionary<string, object> record, string fieldName)
    {
        if (record.TryGetValue(fieldName, out var value))
            return value;

        // Try case-insensitive lookup
        var key = record.Keys.FirstOrDefault(k => k.Equals(fieldName, StringComparison.OrdinalIgnoreCase));
        return key != null ? record[key] : null;
    }
}

/// <summary>
/// Provides access to data from a specific source (on-premise, cloud, database)
/// </summary>
public interface IDataProvider
{
    /// <summary>
    /// Get all records for an entity
    /// </summary>
    Task<List<Dictionary<string, object>>> GetRecordsAsync(
        string entityLogicalName,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get related records for a parent record
    /// </summary>
    Task<List<Dictionary<string, object>>> GetRelatedRecordsAsync(
        string parentEntityLogicalName,
        string parentRecordId,
        string relationshipName,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get view definition (columns, filters, sorts)
    /// </summary>
    Task<ViewDefinition?> GetViewDefinitionAsync(
        string entityLogicalName,
        string viewId,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Query filter with support for multiple operators and logical grouping
/// </summary>
public record QueryFilter(
    string FieldName,
    FilterOperator Operator,
    object Value,
    string LogicalOperator = "AND",
    QueryFilter? ChainedFilter = null
)
{
    /// <summary>
    /// Evaluate filter against a record
    /// </summary>
    public bool Evaluate(Dictionary<string, object> record)
    {
        if (!record.TryGetValue(FieldName, out var fieldValue))
        {
            // Try case-insensitive lookup
            var key = record.Keys.FirstOrDefault(k => k.Equals(FieldName, StringComparison.OrdinalIgnoreCase));
            if (key == null)
                return false;
            fieldValue = record[key];
        }

        var conditionMet = Operator switch
        {
            FilterOperator.Equals => Equals(fieldValue, Value),
            FilterOperator.NotEquals => !Equals(fieldValue, Value),
            FilterOperator.GreaterThan => Compare(fieldValue, Value) > 0,
            FilterOperator.GreaterThanOrEqual => Compare(fieldValue, Value) >= 0,
            FilterOperator.LessThan => Compare(fieldValue, Value) < 0,
            FilterOperator.LessThanOrEqual => Compare(fieldValue, Value) <= 0,
            FilterOperator.Contains => fieldValue?.ToString()?.Contains(Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase) ?? false,
            FilterOperator.StartsWith => fieldValue?.ToString()?.StartsWith(Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase) ?? false,
            FilterOperator.EndsWith => fieldValue?.ToString()?.EndsWith(Value?.ToString() ?? "", StringComparison.OrdinalIgnoreCase) ?? false,
            FilterOperator.In => ParseInOperator(fieldValue, Value),
            FilterOperator.NotIn => !ParseInOperator(fieldValue, Value),
            FilterOperator.IsNull => fieldValue == null || string.IsNullOrWhiteSpace(fieldValue?.ToString()),
            FilterOperator.IsNotNull => fieldValue != null && !string.IsNullOrWhiteSpace(fieldValue?.ToString()),
            _ => false
        };

        if (ChainedFilter == null)
            return conditionMet;

        return LogicalOperator switch
        {
            "AND" => conditionMet && ChainedFilter.Evaluate(record),
            "OR" => conditionMet || ChainedFilter.Evaluate(record),
            _ => conditionMet
        };
    }

    public static QueryFilter? FromViewFilterXml(string? filterXml)
    {
        if (string.IsNullOrEmpty(filterXml))
            return null;

        // Simple XML parsing - extract first condition as a basic filter
        // Handles both single and double quotes
        var conditionMatch = System.Text.RegularExpressions.Regex.Match(
            filterXml,
            @"<condition\s+attribute=[""']([^""']+)[""']\s+operator=[""']([^""']+)[""']\s+value=[""']([^""']*)[""']",
            System.Text.RegularExpressions.RegexOptions.IgnoreCase
        );

        if (!conditionMatch.Success)
            return null;

        var attribute = conditionMatch.Groups[1].Value;
        var op = conditionMatch.Groups[2].Value;
        var value = conditionMatch.Groups[3].Value;

        var filterOp = op.ToLowerInvariant() switch
        {
            "eq" => FilterOperator.Equals,
            "ne" => FilterOperator.NotEquals,
            "gt" => FilterOperator.GreaterThan,
            "ge" => FilterOperator.GreaterThanOrEqual,
            "lt" => FilterOperator.LessThan,
            "le" => FilterOperator.LessThanOrEqual,
            "like" => FilterOperator.Contains,
            "in" => FilterOperator.In,
            _ => FilterOperator.Equals
        };

        return new QueryFilter(attribute, filterOp, value);
    }

    private static int Compare(object? a, object? b)
    {
        if (a == null || b == null)
            return 0;

        if (a is IComparable aComparable)
            return aComparable.CompareTo(b);

        return 0;
    }

    private static bool ParseInOperator(object? fieldValue, object? values)
    {
        if (fieldValue == null || values == null)
            return false;

        var valueList = values is string strValues
            ? strValues.Split(',').Select(s => s.Trim()).ToList()
            : values is List<object> objList
                ? objList.Select(o => o?.ToString() ?? "").ToList()
                : new() { values.ToString() ?? "" };

        return valueList.Contains(fieldValue.ToString() ?? "", StringComparer.OrdinalIgnoreCase);
    }
}

public enum FilterOperator
{
    Equals,
    NotEquals,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    Contains,
    StartsWith,
    EndsWith,
    In,
    NotIn,
    IsNull,
    IsNotNull
}

/// <summary>
/// Sort order for query results
/// </summary>
public record OrderByClause(
    string FieldName,
    bool Descending = false
);

/// <summary>
/// Query result with pagination info
/// </summary>
public record QueryResult(
    string EntityLogicalName,
    List<Dictionary<string, object>> Records,
    int PageNumber,
    int PageSize,
    int TotalRecordCount,
    int TotalPageCount,
    bool HasMoreRecords
);

/// <summary>
/// View definition with columns, filters, and sorts
/// </summary>
public record ViewDefinition(
    string ViewId,
    string ViewName,
    string EntityLogicalName,
    List<string> Columns,
    string? FilterXml = null,
    List<OrderByClause>? DefaultSort = null,
    int DefaultPageSize = 50
)
{
    [System.Text.Json.Serialization.JsonIgnore]
    public DateTime CachedAt { get; set; }
};
