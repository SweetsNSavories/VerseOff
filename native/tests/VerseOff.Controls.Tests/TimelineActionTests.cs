using VerseOff.Domain;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class TimelineActionTests
{
    [TestMethod]
    public async Task CreateNoteQueuesActionAndClearsErrorOnSuccess()
    {
        var sink = new StubActionSink();
        var viewModel = CreateViewModel(sink);

        var result = await viewModel.CreateNoteAsync("Call", "Discuss renewal.");

        Assert.IsTrue(result.Succeeded);
        Assert.HasCount(1, sink.Actions);
        var action = sink.Actions[0];
        Assert.AreEqual(TimelineActionKind.CreateNote, action.Kind);
        Assert.AreEqual("Call", action.Subject);
        Assert.AreEqual("Discuss renewal.", action.Body);
        Assert.IsNull(viewModel.ErrorMessage);
    }

    [TestMethod]
    public async Task FailedPinDoesNotChangeRecordAndSurfacesError()
    {
        var sink = new StubActionSink(
            new(false, "Pinning is not authorized."));
        var record = Record();
        var viewModel = CreateViewModel(sink);
        viewModel.Records.Add(record);

        var result = await viewModel.SetPinnedAsync(record, true);

        Assert.IsFalse(result.Succeeded);
        Assert.IsFalse(viewModel.Records[0].IsPinned);
        Assert.AreEqual("Pinning is not authorized.", viewModel.ErrorMessage);
    }

    [TestMethod]
    public async Task MissingActionSinkFailsClosedWithoutFakeSuccess()
    {
        var viewModel = CreateViewModel(null);

        var result = await viewModel.CreatePostAsync("Offline update");

        Assert.IsFalse(result.Succeeded);
        StringAssert.Contains(
            viewModel.ErrorMessage!,
            "actions are unavailable");
    }

    private static TimelineViewModel CreateViewModel(
        ITimelineActionSink? sink) =>
        new(
            new TimelineDefinition(
                "timeline",
                null,
                null,
                "<control />",
                new Dictionary<string, string?>(),
                [TimelineModule.Activities, TimelineModule.Notes, TimelineModule.Posts],
                ["email"],
                10,
                true,
                false,
                true,
                false,
                TimelineSortDirection.NewestToOldest,
                "sortdate",
                TimelineRollupType.None),
            new EmptyProvider(),
            Guid.NewGuid(),
            "account",
            sink);

    private static TimelineRecord Record() => new(
        Guid.NewGuid(),
        "email",
        TimelineRecordKind.Activity,
        "Subject",
        "Body",
        DateTimeOffset.UtcNow,
        "Active",
        "Owner",
        false,
        [],
        [],
        "security-v1",
        null);

    private sealed class EmptyProvider : ITimelineRecordProvider
    {
        public ValueTask<TimelinePage> QueryAsync(
            TimelineQuery query,
            CancellationToken cancellationToken = default) =>
            ValueTask.FromResult(new TimelinePage([], null));
    }

    private sealed class StubActionSink(
        TimelineActionResult? result = null) : ITimelineActionSink
    {
        public List<TimelineAction> Actions { get; } = [];

        public ValueTask<TimelineActionResult> ExecuteAsync(
            TimelineAction action,
            CancellationToken cancellationToken = default)
        {
            Actions.Add(action);
            return ValueTask.FromResult(
                result ?? new TimelineActionResult(true, RecordId: Guid.NewGuid()));
        }
    }
}
