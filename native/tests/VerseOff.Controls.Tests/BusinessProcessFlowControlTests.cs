using VerseOff.Domain;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class BusinessProcessFlowControlTests
{
    [TestMethod]
    public void BpfUnavailableWhenProviderMissing()
    {
        var definition = CreateSampleBpf();
        var viewModel = new BusinessProcessFlowViewModel(
            definition,
            provider: null,
            recordId: Guid.NewGuid(),
            security: null);

        Assert.IsFalse(viewModel.IsAvailable);
        StringAssert.Contains(viewModel.UnavailableReason, "no offline stage provider is registered");
    }

    [TestMethod]
    public void BpfUnavailableWhenSecuritySnapshotMissing()
    {
        var definition = CreateSampleBpf();
        var mockProvider = new MockBpfProvider(definition.Stages[0].StageId);
        var viewModel = new BusinessProcessFlowViewModel(
            definition,
            provider: mockProvider,
            recordId: Guid.NewGuid(),
            security: null);

        Assert.IsFalse(viewModel.IsAvailable);
        StringAssert.Contains(viewModel.UnavailableReason, "requires a verified offline security snapshot");
    }

    [TestMethod]
    public async Task BpfLoadsActiveStageAndTransitionsSuccessfully()
    {
        var definition = CreateSampleBpf();
        var mockProvider = new MockBpfProvider(definition.Stages[0].StageId);
        var security = new SecuritySnapshot(
            "1.0",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTimeOffset.UtcNow.AddHours(-1),
            DateTimeOffset.UtcNow.AddHours(1),
            []);

        var viewModel = new BusinessProcessFlowViewModel(
            definition,
            provider: mockProvider,
            recordId: Guid.NewGuid(),
            security: security);

        Assert.IsTrue(viewModel.IsAvailable);
        Assert.AreEqual("Lead to Opportunity Sales Process", viewModel.ProcessDisplayName);
        Assert.HasCount(2, viewModel.Stages);

        await viewModel.LoadStateAsync();

        Assert.AreEqual(definition.Stages[0].StageId, viewModel.ActiveStageId);
        Assert.AreEqual(ProcessStageVisualState.Active, viewModel.Stages[0].VisualState);
        Assert.AreEqual(ProcessStageVisualState.Future, viewModel.Stages[1].VisualState);
        Assert.HasCount(2, viewModel.ActiveSteps);
        Assert.AreEqual("Budget Amount", viewModel.ActiveSteps[0].DisplayName);
        Assert.AreEqual("$50,000", viewModel.ActiveSteps[0].DisplayValue);

        var transitionSuccess = await viewModel.SetActiveStageAsync(definition.Stages[1].StageId);
        Assert.IsTrue(transitionSuccess);
        Assert.AreEqual(definition.Stages[1].StageId, viewModel.ActiveStageId);
        Assert.AreEqual(ProcessStageVisualState.Completed, viewModel.Stages[0].VisualState);
        Assert.AreEqual(ProcessStageVisualState.Active, viewModel.Stages[1].VisualState);
    }

    private static BusinessProcessFlowDefinition CreateSampleBpf()
    {
        var provenance = new ComponentProvenance(
            "bpf",
            "lead_to_opportunity",
            ComponentOrigin.CustomerOwned,
            "solution",
            "prefix",
            new string('a', 64),
            false,
            true);

        var stage1 = new ProcessStageDefinition(
            Guid.Parse("11111111-1111-1111-1111-111111111111"),
            "Qualify",
            "lead",
            ProcessStageCategory.Qualify,
            1,
            [
                new(Guid.NewGuid(), "Budget Amount", "budgetamount", true, 1),
                new(Guid.NewGuid(), "Purchase Timeframe", "purchasetimeframe", false, 2),
            ]);

        var stage2 = new ProcessStageDefinition(
            Guid.Parse("22222222-2222-2222-2222-222222222222"),
            "Develop",
            "opportunity",
            ProcessStageCategory.Develop,
            2,
            [
                new(Guid.NewGuid(), "Customer Need", "customerneed", true, 1),
            ]);

        return new(
            Guid.Parse("33333333-3333-3333-3333-333333333333"),
            "bpf_lead_opportunity",
            "Lead to Opportunity Sales Process",
            "lead",
            [stage1, stage2],
            provenance);
    }

    private sealed class MockBpfProvider(Guid initialActiveStageId) : IBusinessProcessFlowProvider
    {
        public Guid ActiveStageId { get; private set; } = initialActiveStageId;
        public HashSet<Guid> CompletedStages { get; } = [];

        public ValueTask<BusinessProcessFlowState?> GetStateAsync(
            Guid processId,
            Guid recordId,
            CancellationToken cancellationToken = default)
        {
            var state = new BusinessProcessFlowState(
                processId,
                ActiveStageId,
                CompletedStages,
                new Dictionary<string, object?>
                {
                    ["budgetamount"] = "$50,000",
                });
            return ValueTask.FromResult<BusinessProcessFlowState?>(state);
        }

        public ValueTask<bool> SetActiveStageAsync(
            Guid processId,
            Guid recordId,
            Guid stageId,
            CancellationToken cancellationToken = default)
        {
            CompletedStages.Add(ActiveStageId);
            ActiveStageId = stageId;
            return ValueTask.FromResult(true);
        }
    }
}
