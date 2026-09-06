namespace VerseOff.ClientApi.Tests;

[TestClass]
public sealed class EventPipelineTests
{
    private static readonly string[] ExpectedHandlerOrder =
        ["configured:0", "dynamic:1"];

    [TestMethod]
    public async Task ConfiguredHandlersRunBeforeCodeAddedHandlers()
    {
        var trace = new List<string>();
        var pipeline = new XrmEventPipeline(TimeSpan.FromSeconds(1));
        pipeline.Register(new(
            "onload",
            "dynamic",
            (context, _) =>
            {
                trace.Add($"dynamic:{context.GetDepth()}");
                return ValueTask.CompletedTask;
            },
            XrmEventHandlerSource.CodeAdded,
            0));
        pipeline.Register(new(
            "onload",
            "configured",
            (context, _) =>
            {
                context.SetSharedVariable("value", "ready");
                trace.Add($"configured:{context.GetDepth()}");
                return ValueTask.CompletedTask;
            },
            XrmEventHandlerSource.Configured,
            0));

        var result = await pipeline.ExecuteAsync(
            "onload",
            new TestFormContext(),
            null,
            null);

        CollectionAssert.AreEqual(
            ExpectedHandlerOrder,
            trace);
        Assert.IsFalse(result.DefaultPrevented);
        Assert.IsEmpty(result.Failures);
    }

    [TestMethod]
    public async Task SaveHandlerCanPreventDefault()
    {
        var pipeline = new XrmEventPipeline(TimeSpan.FromSeconds(1));
        pipeline.Register(new(
            "onsave",
            "cancel",
            (context, _) =>
            {
                ((XrmSaveEventArguments)context.GetEventArgs()!)
                    .PreventDefault();
                return ValueTask.CompletedTask;
            },
            XrmEventHandlerSource.Configured,
            0));
        var eventArguments = new XrmSaveEventArguments(1);

        var result = await pipeline.ExecuteAsync(
            "onsave",
            new TestFormContext(),
            null,
            eventArguments);

        Assert.IsTrue(result.DefaultPrevented);
    }

    [TestMethod]
    public async Task HandlerFailureHonorsPreventDefaultOnError()
    {
        var pipeline = new XrmEventPipeline(TimeSpan.FromSeconds(1));
        pipeline.Register(new(
            "onsave",
            "failing",
            (context, _) =>
            {
                ((XrmSaveEventArguments)context.GetEventArgs()!)
                    .PreventDefaultWhenHandlerFails();
                throw new InvalidOperationException("Save validation failed.");
            },
            XrmEventHandlerSource.Configured,
            0));
        var eventArguments = new XrmSaveEventArguments(1);

        var result = await pipeline.ExecuteAsync(
            "onsave",
            new TestFormContext(),
            null,
            eventArguments);

        Assert.IsTrue(result.DefaultPrevented);
        Assert.HasCount(1, result.Failures);
    }

    [TestMethod]
    public void DuplicateHandlerRegistrationIsRejected()
    {
        var pipeline = new XrmEventPipeline(TimeSpan.FromSeconds(1));
        var registration = new XrmEventRegistration(
            "onload",
            "same",
            (_, _) => ValueTask.CompletedTask,
            XrmEventHandlerSource.Configured,
            0);
        pipeline.Register(registration);

        Assert.ThrowsExactly<InvalidOperationException>(
            () => pipeline.Register(registration));
    }

    private sealed class TestFormContext : IXrmFormContext;
}
