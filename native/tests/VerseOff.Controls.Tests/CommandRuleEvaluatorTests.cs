using VerseOff.Domain;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class CommandRuleEvaluatorTests
{
    private readonly CommandRuleEvaluator evaluator = new();

    [TestMethod]
    public void ValueRuleMatchesTargetValue()
    {
        var rule = new CommandRuleDefinition(
            "ValueRule",
            new Dictionary<string, string?>
            {
                ["Field"] = "statuscode",
                ["Value"] = "1",
            },
            InvertResult: false);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>
            {
                ["statuscode"] = 1,
            });

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsTrue(result);
    }

    [TestMethod]
    public void ValueRuleInvertsResult()
    {
        var rule = new CommandRuleDefinition(
            "ValueRule",
            new Dictionary<string, string?>
            {
                ["Field"] = "statuscode",
                ["Value"] = "1",
            },
            InvertResult: true);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>
            {
                ["statuscode"] = 1,
            });

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void ValueRuleReturnsFalseWhenFieldMissingAndNoDefault()
    {
        var rule = new CommandRuleDefinition(
            "ValueRule",
            new Dictionary<string, string?>
            {
                ["Field"] = "missing_field",
                ["Value"] = "true",
            },
            InvertResult: false);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>());

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void EntityPrivilegeRuleFailsWithoutSecuritySnapshot()
    {
        var rule = new CommandRuleDefinition(
            "EntityPrivilegeRule",
            new Dictionary<string, string?>
            {
                ["EntityName"] = "account",
                ["PrivilegeType"] = "Read",
            },
            InvertResult: false);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>(),
            Security: null);

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void EntityPrivilegeRuleSucceedsWithValidSnapshotAndGrant()
    {
        var now = DateTimeOffset.UtcNow;
        var grant = new TableAccessGrant(
            "account",
            AccessDepth.User,
            AccessDepth.User,
            AccessDepth.User,
            AccessDepth.None,
            new HashSet<string>(),
            new HashSet<string>());

        var security = new SecuritySnapshot(
            "1.0",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            now.AddHours(-1),
            now.AddHours(1),
            [grant]);

        var rule = new CommandRuleDefinition(
            "EntityPrivilegeRule",
            new Dictionary<string, string?>
            {
                ["EntityName"] = "account",
                ["PrivilegeType"] = "Read",
            },
            InvertResult: false);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>(),
            Security: security,
            EvaluationTime: now);

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsTrue(result);
    }

    [TestMethod]
    public void RecordPrivilegeRuleHonorsExplicitPoaGrantWithoutTableAccess()
    {
        var now = DateTimeOffset.UtcNow;
        var recordId = Guid.NewGuid();
        var security = new SecuritySnapshot(
            "security-v2",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            now.AddMinutes(-1),
            now.AddMinutes(5),
            [],
            RecordAccessGrants:
            [
                new RecordAccessGrant(
                    "account",
                    recordId,
                    RecordAccessRights.Read | RecordAccessRights.Update),
            ]);
        var rule = new CommandRuleDefinition(
            "RecordPrivilegeRule",
            new Dictionary<string, string?>
            {
                ["EntityName"] = "account",
                ["PrivilegeType"] = "Write",
            },
            InvertResult: false);
        var context = new CommandRuleEvaluationContext(
            "account",
            recordId,
            new Dictionary<string, object?>(),
            security,
            now);

        Assert.IsTrue(evaluator.EvaluateRule(rule, context));
    }

    [TestMethod]
    public void RecordPrivilegeRuleRejectsPoaGrantMissingRequestedOperation()
    {
        var now = DateTimeOffset.UtcNow;
        var recordId = Guid.NewGuid();
        var security = new SecuritySnapshot(
            "security-v2",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            now.AddMinutes(-1),
            now.AddMinutes(5),
            [],
            RecordAccessGrants:
            [
                new RecordAccessGrant(
                    "account",
                    recordId,
                    RecordAccessRights.Read),
            ]);
        var rule = new CommandRuleDefinition(
            "RecordPrivilegeRule",
            new Dictionary<string, string?>
            {
                ["EntityName"] = "account",
                ["PrivilegeType"] = "Delete",
            },
            InvertResult: false);
        var context = new CommandRuleEvaluationContext(
            "account",
            recordId,
            new Dictionary<string, object?>(),
            security,
            now);

        Assert.IsFalse(evaluator.EvaluateRule(rule, context));
    }

    [TestMethod]
    public void CustomRuleFailsClosedWhenNoHandlerProvided()
    {
        var rule = new CommandRuleDefinition(
            "CustomRule",
            new Dictionary<string, string?>
            {
                ["Library"] = "contoso.js",
                ["FunctionName"] = "Contoso.canSave",
            },
            InvertResult: false);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>(),
            CustomRuleHandler: null);

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void CustomRuleExecutesRegisteredHandler()
    {
        var rule = new CommandRuleDefinition(
            "CustomRule",
            new Dictionary<string, string?>
            {
                ["Library"] = "contoso.js",
                ["FunctionName"] = "Contoso.canSave",
            },
            InvertResult: false);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>(),
            CustomRuleHandler: (lib, fn) => lib == "contoso.js" && fn == "Contoso.canSave");

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsTrue(result);
    }

    [TestMethod]
    public void UnknownRuleFailsClosed()
    {
        var rule = new CommandRuleDefinition(
            "FutureUnknownRule",
            new Dictionary<string, string?>(),
            InvertResult: false);

        var context = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>());

        var result = evaluator.EvaluateRule(rule, context);
        Assert.IsFalse(result);
    }

    [TestMethod]
    public void CanDisplayAndCanEnableRespectAllRules()
    {
        var provenance = new ComponentProvenance(
            "command",
            "save",
            ComponentOrigin.CustomerOwned,
            "solution",
            "prefix",
            new string('a', 64),
            false,
            true);

        var command = new CommandDefinition(
            "cmd.save",
            "Save",
            "account",
            1,
            new CommandActionDefinition(CommandActionKind.Native, "save", []),
            provenance)
        {
            DisplayRules =
            [
                new(
                    "ValueRule",
                    new Dictionary<string, string?> { ["Field"] = "visible", ["Value"] = "true" },
                    false),
            ],
            EnableRules =
            [
                new(
                    "ValueRule",
                    new Dictionary<string, string?> { ["Field"] = "enabled", ["Value"] = "true" },
                    false),
            ],
        };

        var visibleAndEnabledContext = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>
            {
                ["visible"] = true,
                ["enabled"] = true,
            });

        Assert.IsTrue(evaluator.CanDisplay(command, visibleAndEnabledContext));
        Assert.IsTrue(evaluator.CanEnable(command, visibleAndEnabledContext));

        var visibleDisabledContext = new CommandRuleEvaluationContext(
            "account",
            Guid.NewGuid(),
            new Dictionary<string, object?>
            {
                ["visible"] = true,
                ["enabled"] = false,
            });

        Assert.IsTrue(evaluator.CanDisplay(command, visibleDisabledContext));
        Assert.IsFalse(evaluator.CanEnable(command, visibleDisabledContext));
    }
}
