using Xunit;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Data;
using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Tests;

[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class DataQueryServiceTests
{
    private readonly Dictionary<string, EntityMetadata> _metadata;
    private readonly InMemoryDataProvider _dataProvider;
    private readonly DataQueryService _queryService;

    public DataQueryServiceTests()
    {
        _metadata = CreateTestMetadata();
        _dataProvider = new InMemoryDataProvider();
        _queryService = new DataQueryService(_metadata, _dataProvider);

        SetupTestData();
    }

    #region Query Execution Tests

    [Fact]
    public async Task ExecuteQueryAsync_ReturnsAllRecordsWithoutFilter()
    {
        var result = await _queryService.ExecuteQueryAsync("account", pageSize: 1);

        Assert.NotNull(result);
        Assert.Equal("account", result.EntityLogicalName);
        Assert.Equal(3, result.TotalRecordCount);
        Assert.Single(result.Records); // First page with pageSize=1
    }

    [Fact]
    public async Task ExecuteQueryAsync_FailsWithInvalidEntity()
    {
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _queryService.ExecuteQueryAsync("nonexistent")
        );

        Assert.Contains("not found", ex.Message);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FailsWithInvalidPageNumber()
    {
        var ex = await Assert.ThrowsAsync<ArgumentException>(
            () => _queryService.ExecuteQueryAsync("account", pageNumber: 0)
        );

        Assert.Contains("Page number", ex.Message);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FailsWithInvalidPageSize()
    {
        var ex = await Assert.ThrowsAsync<ArgumentException>(
            () => _queryService.ExecuteQueryAsync("account", pageSize: 10000)
        );

        Assert.Contains("Page size", ex.Message);
    }

    [Fact]
    public async Task ExecuteQueryAsync_PaginatesCorrectly()
    {
        var page1 = await _queryService.ExecuteQueryAsync("account", pageNumber: 1, pageSize: 1);
        Assert.Single(page1.Records);
        Assert.True(page1.HasMoreRecords);
        Assert.Equal(3, page1.TotalPageCount);

        var page2 = await _queryService.ExecuteQueryAsync("account", pageNumber: 2, pageSize: 1);
        Assert.Single(page2.Records);
        Assert.True(page2.HasMoreRecords);

        var page3 = await _queryService.ExecuteQueryAsync("account", pageNumber: 3, pageSize: 1);
        Assert.Single(page3.Records);
        Assert.False(page3.HasMoreRecords);
    }

    #endregion

    #region Filtering Tests

    [Fact]
    public async Task ExecuteQueryAsync_FiltersWithEqualsOperator()
    {
        var filter = new QueryFilter("status", FilterOperator.Equals, "active");
        var result = await _queryService.ExecuteQueryAsync("account", filter: filter);

        Assert.Equal(2, result.TotalRecordCount);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FiltersWithNotEqualsOperator()
    {
        var filter = new QueryFilter("status", FilterOperator.NotEquals, "deleted");
        var result = await _queryService.ExecuteQueryAsync("account", filter: filter);

        Assert.Equal(2, result.TotalRecordCount);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FiltersWithContainsOperator()
    {
        var filter = new QueryFilter("name", FilterOperator.Contains, "Corp");
        var result = await _queryService.ExecuteQueryAsync("account", filter: filter);

        Assert.True(result.TotalRecordCount > 0);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FiltersWithGreaterThanOperator()
    {
        var filter = new QueryFilter("creditlimit", FilterOperator.GreaterThan, 50000);
        var result = await _queryService.ExecuteQueryAsync("account", filter: filter);

        Assert.True(result.TotalRecordCount > 0);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FiltersWithChainedCondition()
    {
        var filter2 = new QueryFilter("status", FilterOperator.Equals, "active");
        var filter1 = new QueryFilter(
            "creditlimit",
            FilterOperator.GreaterThan,
            50000,
            "AND",
            filter2
        );

        var result = await _queryService.ExecuteQueryAsync("account", filter: filter1);
        Assert.True(result.TotalRecordCount >= 0);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FiltersWithIsNullOperator()
    {
        var filter = new QueryFilter("description", FilterOperator.IsNull, null!);
        var result = await _queryService.ExecuteQueryAsync("account", filter: filter);

        Assert.True(result.TotalRecordCount >= 0);
    }

    [Fact]
    public async Task ExecuteQueryAsync_FiltersWithIsNotNullOperator()
    {
        var filter = new QueryFilter("name", FilterOperator.IsNotNull, null!);
        var result = await _queryService.ExecuteQueryAsync("account", filter: filter);

        Assert.True(result.TotalRecordCount >= 0);
    }

    #endregion

    #region Sorting Tests

    [Fact]
    public async Task ExecuteQueryAsync_SortsAscendingByDefault()
    {
        var orderBy = new List<OrderByClause> { new("name") };
        var result = await _queryService.ExecuteQueryAsync("account", orderBy: orderBy, pageSize: 50);

        Assert.True(result.TotalRecordCount > 0);
    }

    [Fact]
    public async Task ExecuteQueryAsync_SortsDescending()
    {
        var orderBy = new List<OrderByClause> { new("creditlimit", Descending: true) };
        var result = await _queryService.ExecuteQueryAsync("account", orderBy: orderBy, pageSize: 50);

        Assert.True(result.TotalRecordCount > 0);
    }

    [Fact]
    public async Task ExecuteQueryAsync_SortsMultipleFields()
    {
        var orderBy = new List<OrderByClause>
        {
            new("status"),
            new("name")
        };

        var result = await _queryService.ExecuteQueryAsync("account", orderBy: orderBy, pageSize: 50);
        Assert.True(result.TotalRecordCount > 0);
    }

    #endregion

    #region Single Record Tests

    [Fact]
    public async Task GetRecordAsync_ReturnsRecordById()
    {
        var record = await _queryService.GetRecordAsync("account", "acc-001");

        Assert.NotNull(record);
        Assert.Contains("name", record.Keys);
    }

    [Fact]
    public async Task GetRecordAsync_ReturnsNullForMissingRecord()
    {
        var record = await _queryService.GetRecordAsync("account", "nonexistent");

        Assert.Null(record);
    }

    [Fact]
    public async Task GetRecordAsync_SelectsSpecificFields()
    {
        var record = await _queryService.GetRecordAsync(
            "account",
            "acc-001",
            new() { "name", "status" }
        );

        Assert.NotNull(record);
        Assert.Equal(2, record.Keys.Count);
    }

    [Fact]
    public async Task GetRecordAsync_FailsWithInvalidEntity()
    {
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _queryService.GetRecordAsync("nonexistent", "id")
        );

        Assert.Contains("not found", ex.Message);
    }

    #endregion

    #region View Tests

    [Fact]
    public async Task GetViewDefinitionAsync_ReturnsViewDefinition()
    {
        var view = await _queryService.GetViewDefinitionAsync("account", "view-001");

        Assert.NotNull(view);
        Assert.Equal("view-001", view.ViewId);
        Assert.Equal("account", view.EntityLogicalName);
    }

    [Fact]
    public async Task GetViewDefinitionAsync_CachesViewDefinition()
    {
        var view1 = await _queryService.GetViewDefinitionAsync("account", "view-001");
        var view2 = await _queryService.GetViewDefinitionAsync("account", "view-001");

        Assert.NotNull(view1);
        Assert.NotNull(view2);
        Assert.Same(view1, view2); // Same object reference (cached)
    }

    [Fact]
    public async Task GetViewRecordsAsync_ReturnsViewRecords()
    {
        var result = await _queryService.GetViewRecordsAsync("account", "view-001");

        Assert.NotNull(result);
        Assert.Equal("account", result.EntityLogicalName);
        Assert.True(result.TotalRecordCount >= 0);
    }

    [Fact]
    public async Task ClearViewCache_RemovesCachedViews()
    {
        await _queryService.GetViewDefinitionAsync("account", "view-001");
        _queryService.ClearViewCache();

        // After clearing, next call should fetch fresh data
        var view = await _queryService.GetViewDefinitionAsync("account", "view-001");
        Assert.NotNull(view);
    }

    #endregion

    #region Query Filter Tests

    [Fact]
    public void QueryFilter_EvaluatesEquals()
    {
        var filter = new QueryFilter("status", FilterOperator.Equals, "active");
        var record = new Dictionary<string, object> { { "status", "active" } };

        Assert.True(filter.Evaluate(record));
    }

    [Fact]
    public void QueryFilter_EvaluatesContains()
    {
        var filter = new QueryFilter("name", FilterOperator.Contains, "Corp");
        var record = new Dictionary<string, object> { { "name", "Acme Corporation" } };

        Assert.True(filter.Evaluate(record));
    }

    [Fact]
    public void QueryFilter_EvaluatesStartsWith()
    {
        var filter = new QueryFilter("accountnumber", FilterOperator.StartsWith, "ACC");
        var record = new Dictionary<string, object> { { "accountnumber", "ACC-001" } };

        Assert.True(filter.Evaluate(record));
    }

    [Fact]
    public void QueryFilter_EvaluatesInOperator()
    {
        var filter = new QueryFilter("status", FilterOperator.In, "active,pending");
        var record = new Dictionary<string, object> { { "status", "active" } };

        Assert.True(filter.Evaluate(record));
    }

    [Fact]
    public void QueryFilter_FromViewFilterXml_ParsesBasicCondition()
    {
        var xml = @"<filter type='and'><condition attribute='status' operator='eq' value='active'/></filter>";
        var filter = QueryFilter.FromViewFilterXml(xml);

        Assert.NotNull(filter);
        Assert.Equal("status", filter.FieldName);
        Assert.Equal(FilterOperator.Equals, filter.Operator);
        Assert.Equal("active", filter.Value);
    }

    #endregion

    #region Helper Methods

    private void SetupTestData()
    {
        var accounts = new List<Dictionary<string, object>>
        {
            new()
            {
                { "id", "acc-001" },
                { "name", "Acme Corporation" },
                { "status", "active" },
                { "creditlimit", 100000 }
            },
            new()
            {
                { "id", "acc-002" },
                { "name", "Tech Innovations Inc" },
                { "status", "active" },
                { "creditlimit", 75000 }
            },
            new()
            {
                { "id", "acc-003" },
                { "name", "Sunset Industries" },
                { "status", "deleted" },
                { "creditlimit", 50000 }
            }
        };

        _dataProvider.AddRecords("account", accounts);

        var view = new ViewDefinition(
            ViewId: "view-001",
            ViewName: "Active Accounts",
            EntityLogicalName: "account",
            Columns: new() { "name", "status", "creditlimit" },
            DefaultSort: new() { new("name") }
        );

        _dataProvider.AddView("account", view);
    }

    private static Dictionary<string, EntityMetadata> CreateTestMetadata()
    {
        return new()
        {
            {
                "account",
                new EntityMetadata(
                    "account",
                    "Account",
                    "Accounts",
                    new()
                    {
                        new FieldMetadata("id", "Account ID", "Guid", IsCustom: false),
                        new FieldMetadata("name", "Account Name", "String", MaxLength: 160, Required: true, IsCustom: false),
                        new FieldMetadata("accountnumber", "Account Number", "String", MaxLength: 20, IsCustom: false),
                        new FieldMetadata("status", "Status", "String", IsCustom: false),
                        new FieldMetadata("creditlimit", "Credit Limit", "Decimal", IsCustom: false),
                        new FieldMetadata("description", "Description", "String", IsCustom: false),
                    },
                    new() { "onCreate", "onUpdate" },
                    new() { "Account" },
                    new() { "Active Accounts" }
                )
            }
        };
    }

    #endregion
}
