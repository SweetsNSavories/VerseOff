#pragma warning disable CA1707 // Remove underscores from member names

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using XunitAssert = Xunit.Assert;
using VerseOff.Customization.Data;
using VerseOff.Customization.Metadata;
using VerseOff.Domain;
using VerseOff.Gateway.Api;
using DataViewDefinition = VerseOff.Customization.Data.ViewDefinition;

namespace VerseOff.Gateway.Tests.Api;

/// <summary>
/// Fake implementation of IDataProvider for testing
/// </summary>
public class FakeDataProvider : IDataProvider
{
    private List<Dictionary<string, object>> _records = new();
    private List<Dictionary<string, object>> _relatedRecords = new();
    private DataViewDefinition? _viewDefinition;

    public void SetRecords(List<Dictionary<string, object>> records)
    {
        _records = records ?? new();
    }

    public void SetRelatedRecords(List<Dictionary<string, object>> records)
    {
        _relatedRecords = records ?? new();
    }

    public void SetViewDefinition(DataViewDefinition? view)
    {
        _viewDefinition = view;
    }

    public Task<List<Dictionary<string, object>>> GetRecordsAsync(
        string entityLogicalName,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_records);
    }

    public Task<List<Dictionary<string, object>>> GetRelatedRecordsAsync(
        string parentEntityLogicalName,
        string parentRecordId,
        string relationshipName,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_relatedRecords);
    }

    public Task<DataViewDefinition?> GetViewDefinitionAsync(
        string entityLogicalName,
        string viewId,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_viewDefinition);
    }
}

/// <summary>
/// Fake implementation of DataQueryService for testing without real database/provider
/// </summary>
public class FakeDataQueryService : DataQueryService
{
    private QueryResult? _queryResult;
    private Dictionary<string, object>? _record;
    private List<Dictionary<string, object>> _relatedRecords = new();
    private List<DataViewDefinition> _views = new();

    public FakeDataQueryService() : base(new Dictionary<string, EntityMetadata>(), new FakeDataProvider())
    {
    }

    public void SetQueryResult(QueryResult result)
    {
        _queryResult = result;
    }

    public void SetRecord(Dictionary<string, object>? record)
    {
        _record = record;
    }

    public void SetRelatedRecords(List<Dictionary<string, object>> records)
    {
        _relatedRecords = records ?? new();
    }

    public void SetViews(List<DataViewDefinition> views)
    {
        _views = views ?? new();
    }

    public override async Task<QueryResult> ExecuteQueryAsync(
        string entityLogicalName,
        QueryFilter? filter = null,
        List<OrderByClause>? orderBy = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        await Task.Yield(); // Simulate async work
        if (_queryResult == null)
            throw new InvalidOperationException($"No query result configured for entity {entityLogicalName}");
        return _queryResult;
    }

    public override async Task<Dictionary<string, object>?> GetRecordAsync(
        string entityLogicalName,
        string recordId,
        List<string>? selectedFields = null,
        CancellationToken cancellationToken = default)
    {
        await Task.Yield(); // Simulate async work
        return _record;
    }

    public override async Task<List<Dictionary<string, object>>> GetRelatedRecordsAsync(
        string parentEntityLogicalName,
        string parentRecordId,
        string relationshipName,
        QueryFilter? filter = null,
        CancellationToken cancellationToken = default)
    {
        await Task.Yield(); // Simulate async work
        return _relatedRecords;
    }

    public override async Task<QueryResult> GetViewRecordsAsync(
        string entityLogicalName,
        string viewId,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        await Task.Yield(); // Simulate async work
        if (_queryResult == null)
            throw new InvalidOperationException($"No query result configured for entity {entityLogicalName}");
        return _queryResult;
    }

    public override async Task<DataViewDefinition?> GetViewDefinitionAsync(
        string entityLogicalName,
        string viewId,
        CancellationToken cancellationToken = default)
    {
        await Task.Yield(); // Simulate async work
        return _views.FirstOrDefault(v => v.ViewId == viewId);
    }
}

public class DataControllerTests
{
    private readonly FakeDataQueryService _fakeQueryService;
    private readonly Mock<ILogger<DataController>> _mockLogger = new();
    private readonly DataController _controller;

    public DataControllerTests()
    {
        _fakeQueryService = new FakeDataQueryService();
        _controller = new DataController(_fakeQueryService, _mockLogger.Object);
    }

    #region GetEntityRecords Tests

    [Fact]
    public async Task GetEntityRecords_WithoutFilterOrPaging_ReturnsAllRecordsWithDefaults()
    {
        var records = new List<Dictionary<string, object>>
        {
            new() { { "id", "acc-001" }, { "name", "ACME" }, { "status", "active" } },
            new() { { "id", "acc-002" }, { "name", "Contoso" }, { "status", "inactive" } }
        };

        var queryResult = new QueryResult(
            EntityLogicalName: "account",
            Records: records,
            PageNumber: 1,
            PageSize: 50,
            TotalRecordCount: 2,
            TotalPageCount: 1,
            HasMoreRecords: false
        );

        _fakeQueryService.SetQueryResult(queryResult);

        var result = await _controller.GetEntityRecords("account");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<QueryResultDto>(okResult.Value);
        XunitAssert.Equal("account", dto.EntityLogicalName);
        XunitAssert.Equal(2, dto.Records.Count);
        XunitAssert.False(dto.HasMoreRecords);
    }

    [Fact]
    public async Task GetEntityRecords_WithPagination_ReturnsCorrectPage()
    {
        var records = new List<Dictionary<string, object>>
        {
            new() { { "id", "acc-003" }, { "name", "Fabrikam" }, { "status", "active" } },
            new() { { "id", "acc-004" }, { "name", "Northwind" }, { "status", "inactive" } }
        };

        var queryResult = new QueryResult(
            EntityLogicalName: "account",
            Records: records,
            PageNumber: 2,
            PageSize: 2,
            TotalRecordCount: 100,
            TotalPageCount: 50,
            HasMoreRecords: true
        );

        _fakeQueryService.SetQueryResult(queryResult);

        var result = await _controller.GetEntityRecords("account", pageNumber: 2, pageSize: 2);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<QueryResultDto>(okResult.Value);
        XunitAssert.Equal(2, dto.PageNumber);
        XunitAssert.Equal(2, dto.PageSize);
        XunitAssert.Equal(100, dto.TotalRecordCount);
        XunitAssert.True(dto.HasMoreRecords);
    }

    [Fact]
    public async Task GetEntityRecords_WithFilter_ReturnsFilteredRecords()
    {
        var records = new List<Dictionary<string, object>>
        {
            new() { { "id", "acc-005" }, { "name", "Active Corp" }, { "status", "active" } }
        };

        var queryResult = new QueryResult(
            EntityLogicalName: "account",
            Records: records,
            PageNumber: 1,
            PageSize: 50,
            TotalRecordCount: 1,
            TotalPageCount: 1,
            HasMoreRecords: false
        );

        _fakeQueryService.SetQueryResult(queryResult);

        var filterJson = """{"fieldName":"status","operator":"Equals","value":"active"}""";
        var result = await _controller.GetEntityRecords("account", filterJson: filterJson);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<QueryResultDto>(okResult.Value);
        XunitAssert.Single(dto.Records);
        XunitAssert.Equal("Active Corp", dto.Records[0]["name"]);
    }

    [Fact]
    public async Task GetEntityRecords_WithOrderBy_ReturnsSortedRecords()
    {
        var records = new List<Dictionary<string, object>>
        {
            new() { { "id", "acc-001" }, { "name", "ACME" }, { "createdon", "2025-01-01" } },
            new() { { "id", "acc-002" }, { "name", "Zebra Corp" }, { "createdon", "2025-01-05" } }
        };

        var queryResult = new QueryResult(
            EntityLogicalName: "account",
            Records: records,
            PageNumber: 1,
            PageSize: 50,
            TotalRecordCount: 2,
            TotalPageCount: 1,
            HasMoreRecords: false
        );

        _fakeQueryService.SetQueryResult(queryResult);

        var result = await _controller.GetEntityRecords("account", orderBy: "name");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<QueryResultDto>(okResult.Value);
        XunitAssert.Equal(2, dto.Records.Count);
    }

    #endregion

    #region GetRecord Tests

    [Fact]
    public async Task GetRecord_WithValidId_ReturnsRecord()
    {
        var record = new Dictionary<string, object>
        {
            { "id", "acc-001" },
            { "name", "ACME" },
            { "status", "active" }
        };

        _fakeQueryService.SetRecord(record);

        var result = await _controller.GetRecord("account", "acc-001");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<Dictionary<string, object>>(okResult.Value);
        XunitAssert.Equal("ACME", dto["name"]);
    }

    [Fact]
    public async Task GetRecord_WithNonexistentId_ReturnsNotFound()
    {
        _fakeQueryService.SetRecord(null);

        var result = await _controller.GetRecord("account", "nonexistent");

        XunitAssert.IsType<NotFoundObjectResult>(result);
    }

    #endregion

    #region GetRelatedRecords Tests

    [Fact]
    public async Task GetRelatedRecords_WithValidRelationship_ReturnsRelatedRecords()
    {
        var records = new List<Dictionary<string, object>>
        {
            new() { { "id", "opp-001" }, { "name", "Big Deal" }, { "amount", 50000m } },
            new() { { "id", "opp-002" }, { "name", "Potential Deal" }, { "amount", 25000m } }
        };

        _fakeQueryService.SetRelatedRecords(records);

        var result = await _controller.GetRelatedRecords("account", "acc-001", "account_opportunity");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<QueryResultDto>(okResult.Value);
        XunitAssert.Equal("account", dto.EntityLogicalName);
        XunitAssert.Equal(2, dto.Records.Count);
    }

    [Fact]
    public async Task GetRelatedRecords_WithPagination_ReturnsPagedRelatedRecords()
    {
        var records = new List<Dictionary<string, object>>
        {
            new() { { "id", "contact-005" }, { "name", "John Doe" }, { "email", "john@acme.com" } }
        };

        _fakeQueryService.SetRelatedRecords(records);

        var result = await _controller.GetRelatedRecords("account", "acc-001", "account_contact", pageNumber: 2, pageSize: 10);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<QueryResultDto>(okResult.Value);
        XunitAssert.Equal(2, dto.PageNumber);
        XunitAssert.Equal(10, dto.PageSize);
    }

    #endregion

    #region GetViewDefinition Tests

    [Fact]
    public async Task GetViewDefinition_WithValidViewId_ReturnsViewDefinition()
    {
        var views = new List<DataViewDefinition>
        {
            new(
                ViewId: "view-001",
                ViewName: "Active Accounts",
                EntityLogicalName: "account",
                Columns: new() { "id", "name", "status" },
                FilterXml: "<filter><condition attribute='status' operator='eq' value='active'/></filter>",
                DefaultSort: new() { new(FieldName: "name", Descending: false) },
                DefaultPageSize: 50
            )
        };

        _fakeQueryService.SetViews(views);

        var result = await _controller.GetViewDefinition("account", "view-001");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<ViewDefinitionDto>(okResult.Value);
        XunitAssert.Equal("view-001", dto.ViewId);
        XunitAssert.Equal("Active Accounts", dto.ViewName);
        XunitAssert.Contains("status", dto.Columns);
    }

    [Fact]
    public async Task GetViewDefinition_WithNonexistentViewId_ReturnsNotFound()
    {
        _fakeQueryService.SetViews(new());

        var result = await _controller.GetViewDefinition("account", "nonexistent-view");

        XunitAssert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetViewDefinition_WithFilter_ReturnsViewWithFilterXml()
    {
        var filterXml = "<filter><condition attribute='status' operator='eq' value='inactive'/></filter>";
        var views = new List<DataViewDefinition>
        {
            new(
                ViewId: "view-002",
                ViewName: "Inactive Accounts",
                EntityLogicalName: "account",
                Columns: new() { "id", "name", "status" },
                FilterXml: filterXml,
                DefaultSort: null,
                DefaultPageSize: 25
            )
        };

        _fakeQueryService.SetViews(views);

        var result = await _controller.GetViewDefinition("account", "view-002");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var dto = XunitAssert.IsType<ViewDefinitionDto>(okResult.Value);
        XunitAssert.NotNull(dto.FilterXml);
        XunitAssert.Contains("inactive", dto.FilterXml);
    }

    #endregion
}
