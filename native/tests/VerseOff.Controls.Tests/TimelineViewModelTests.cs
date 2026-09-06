using VerseOff.Domain;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class TimelineViewModelTests
{
    [TestMethod]
    public async Task RefreshAndLoadMorePageWithoutDuplicateCards()
    {
        var firstId = Guid.NewGuid();
        var secondId = Guid.NewGuid();
        var provider = new StubTimelineProvider(
            new TimelinePage(
                [Record(firstId, "First")],
                "next"),
            new TimelinePage(
                [
                    Record(firstId, "First"),
                    Record(secondId, "Second"),
                ],
                null));
        var viewModel = new TimelineViewModel(
            Definition(),
            provider,
            Guid.NewGuid(),
            "account");

        await viewModel.RefreshAsync();
        await viewModel.LoadMoreAsync();

        Assert.HasCount(2, viewModel.Records);
        Assert.IsFalse(viewModel.CanLoadMore);
        Assert.IsNull(viewModel.ErrorMessage);
        Assert.HasCount(2, provider.Queries);
        Assert.AreEqual("next", provider.Queries[1].ContinuationToken);
    }

    [TestMethod]
    public async Task SearchIsPassedToProviderOnExplicitRefresh()
    {
        var provider = new StubTimelineProvider(
            new TimelinePage([], null));
        var viewModel = new TimelineViewModel(
            Definition(),
            provider,
            Guid.NewGuid(),
            "account")
        {
            SearchText = "renewal",
        };

        await viewModel.RefreshAsync();

        Assert.AreEqual("renewal", provider.Queries[0].SearchText);
    }

    private static TimelineDefinition Definition() => new(
        "notescontrol",
        "{06375649-C143-495E-A496-C962E5B4488E}",
        null,
        "<control />",
        new Dictionary<string, string?>(),
        new HashSet<TimelineModule>
        {
            TimelineModule.Activities,
            TimelineModule.Notes,
        },
        ["email", "task"],
        10,
        ShowFilterPane: true,
        ExpandFilterPane: false,
        SearchEnabled: true,
        ExpandAllByDefault: false,
        TimelineSortDirection.NewestToOldest,
        "sortdate",
        TimelineRollupType.None);

    private static TimelineRecord Record(Guid id, string subject) => new(
        id,
        "email",
        TimelineRecordKind.Activity,
        subject,
        "Body",
        DateTimeOffset.UtcNow,
        "Active",
        "Owner",
        IsPinned: false,
        [],
        [],
        "security-v1",
        "W/\"1\"");

    private sealed class StubTimelineProvider(
        params TimelinePage[] pages) : ITimelineRecordProvider
    {
        private int index;

        public List<TimelineQuery> Queries { get; } = [];

        public ValueTask<TimelinePage> QueryAsync(
            TimelineQuery query,
            CancellationToken cancellationToken = default)
        {
            Queries.Add(query);
            var page = pages[Math.Min(index, pages.Length - 1)];
            index++;
            return ValueTask.FromResult(page);
        }
    }
}
