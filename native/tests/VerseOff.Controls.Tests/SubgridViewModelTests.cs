using VerseOff.Domain;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class SubgridViewModelTests
{
    [TestMethod]
    public void SubgridUnavailableWhenProviderMissing()
    {
        var definition = CreateSubgridDefinition();
        var context = CreateRuntimeContext();
        var viewModel = new SubgridViewModel(
            definition,
            provider: null,
            context);

        Assert.IsFalse(viewModel.IsAvailable);
        StringAssert.Contains(viewModel.UnavailableReason, "no offline subgrid provider is registered");
    }

    [TestMethod]
    public async Task SubgridLoadsDataAndPopulatesColumnsAndRows()
    {
        var definition = CreateSubgridDefinition();
        var context = CreateRuntimeContext();
        var provider = new MockSubgridProvider();
        var viewModel = new SubgridViewModel(
            definition,
            provider,
            context);

        Assert.IsTrue(viewModel.IsAvailable);
        Assert.AreEqual("Contacts Subgrid", viewModel.Title);

        await viewModel.LoadDataAsync();

        Assert.HasCount(2, viewModel.Columns);
        Assert.HasCount(2, viewModel.Rows);
        Assert.AreEqual(2, viewModel.RowCount);
        Assert.AreEqual("fullname", viewModel.Columns[0].LogicalName);
        Assert.AreEqual("Alice Smith", viewModel.Rows[0].Values["fullname"]);
    }

    private static FormControlDefinition CreateSubgridDefinition() =>
        new(
            "subgrid_contacts",
            "contacts",
            FormControlKind.Subgrid,
            "{E7A81278-8635-4d9e-8D4D-59480B391C5B}",
            IsVisible: true,
            IsDisabled: false)
        {
            Label = "Contacts Subgrid",
            RelationshipName = "account_contacts",
            ViewId = "{00000000-0000-0000-0000-000000000001}",
        };

    private static FormRuntimeContext CreateRuntimeContext()
    {
        var app = new ApplicationDefinition(
            Guid.NewGuid(),
            "test_app",
            "Test App",
            [],
            [],
            [],
            new string('a', 64));

        return new FormRuntimeContext(
            app,
            Guid.NewGuid(),
            "account",
            TimelineProvider: null);
    }

    private sealed class MockSubgridProvider : ISubgridRecordProvider
    {
        public ValueTask<SubgridResult?> RetrieveSubgridDataAsync(
            string referencingTable,
            Guid recordId,
            string relationshipName,
            string? targetTable,
            string? viewId,
            CancellationToken cancellationToken = default)
        {
            var columns = new List<ViewColumnDefinition>
            {
                new("fullname", 150, 1, true),
                new("emailaddress1", 200, 2, false),
            };

            var rows = new List<SubgridRow>
            {
                new(
                    Guid.NewGuid(),
                    new Dictionary<string, object?>
                    {
                        ["fullname"] = "Alice Smith",
                        ["emailaddress1"] = "alice@example.com",
                    }),
                new(
                    Guid.NewGuid(),
                    new Dictionary<string, object?>
                    {
                        ["fullname"] = "Bob Jones",
                        ["emailaddress1"] = "bob@example.com",
                    }),
            };

            return ValueTask.FromResult<SubgridResult?>(
                new SubgridResult("contact", columns, rows));
        }
    }
}
