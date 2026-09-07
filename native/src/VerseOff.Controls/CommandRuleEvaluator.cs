using System.Globalization;
using VerseOff.Domain;

namespace VerseOff.Controls;

public sealed record CommandRuleEvaluationContext(
    string TableLogicalName,
    Guid RecordId,
    IReadOnlyDictionary<string, object?> RecordValues,
    SecuritySnapshot? Security = null,
    DateTimeOffset? EvaluationTime = null,
    Func<string, string, bool>? CustomRuleHandler = null);

public interface ICommandRuleEvaluator
{
    bool EvaluateRule(
        CommandRuleDefinition rule,
        CommandRuleEvaluationContext context);

    bool CanDisplay(
        CommandDefinition command,
        CommandRuleEvaluationContext context);

    bool CanEnable(
        CommandDefinition command,
        CommandRuleEvaluationContext context);
}

public sealed class CommandRuleEvaluator : ICommandRuleEvaluator
{
    public bool EvaluateRule(
        CommandRuleDefinition rule,
        CommandRuleEvaluationContext context)
    {
        ArgumentNullException.ThrowIfNull(rule);
        ArgumentNullException.ThrowIfNull(context);

        var rawResult = EvaluateRawRule(rule, context);
        return rule.InvertResult ? !rawResult : rawResult;
    }

    public bool CanDisplay(
        CommandDefinition command,
        CommandRuleEvaluationContext context)
    {
        ArgumentNullException.ThrowIfNull(command);
        ArgumentNullException.ThrowIfNull(context);

        if (command.DisplayRules.Count == 0)
        {
            return true;
        }

        foreach (var rule in command.DisplayRules)
        {
            if (!EvaluateRule(rule, context))
            {
                return false;
            }
        }

        return true;
    }

    public bool CanEnable(
        CommandDefinition command,
        CommandRuleEvaluationContext context)
    {
        ArgumentNullException.ThrowIfNull(command);
        ArgumentNullException.ThrowIfNull(context);

        if (command.EnableRules.Count == 0)
        {
            return true;
        }

        foreach (var rule in command.EnableRules)
        {
            if (!EvaluateRule(rule, context))
            {
                return false;
            }
        }

        return true;
    }

    private static bool EvaluateRawRule(
        CommandRuleDefinition rule,
        CommandRuleEvaluationContext context)
    {
        if (string.Equals(rule.RuleType, "ValueRule", StringComparison.OrdinalIgnoreCase))
        {
            return EvaluateValueRule(rule, context);
        }

        if (string.Equals(rule.RuleType, "EntityPrivilegeRule", StringComparison.OrdinalIgnoreCase))
        {
            return EvaluateEntityPrivilegeRule(rule, context);
        }

        if (string.Equals(rule.RuleType, "RecordPrivilegeRule", StringComparison.OrdinalIgnoreCase))
        {
            return EvaluateRecordPrivilegeRule(rule, context);
        }

        if (string.Equals(rule.RuleType, "CustomRule", StringComparison.OrdinalIgnoreCase))
        {
            return EvaluateCustomRule(rule, context);
        }

        // Unknown or unsupported rules fail closed
        return false;
    }

    private static bool EvaluateValueRule(
        CommandRuleDefinition rule,
        CommandRuleEvaluationContext context)
    {
        var field = GetParameter(rule, "Field", "Attribute", "fieldName");
        if (string.IsNullOrWhiteSpace(field))
        {
            return false;
        }

        var expectedValue = GetParameter(rule, "Value", "expectedValue");

        if (!context.RecordValues.TryGetValue(field, out var actualValue))
        {
            var defaultStr = GetParameter(rule, "Default", "defaultValue");
            if (bool.TryParse(defaultStr, out var defaultValue))
            {
                return defaultValue;
            }

            return false;
        }

        if (actualValue is null)
        {
            return string.IsNullOrEmpty(expectedValue);
        }

        if (actualValue is bool boolVal)
        {
            if (bool.TryParse(expectedValue, out var expectedBool))
            {
                return boolVal == expectedBool;
            }

            if (int.TryParse(expectedValue, out var expectedInt))
            {
                return (boolVal ? 1 : 0) == expectedInt;
            }

            return false;
        }

        if (actualValue is int intVal)
        {
            if (int.TryParse(expectedValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out var expectedInt))
            {
                return intVal == expectedInt;
            }

            return false;
        }

        var actualStr = actualValue.ToString();
        return string.Equals(actualStr, expectedValue, StringComparison.OrdinalIgnoreCase);
    }

    private static bool EvaluateEntityPrivilegeRule(
        CommandRuleDefinition rule,
        CommandRuleEvaluationContext context)
    {
        if (context.Security is null)
        {
            return false;
        }

        var now = context.EvaluationTime ?? DateTimeOffset.UtcNow;
        if (!context.Security.IsValidAt(now))
        {
            return false;
        }

        var entityName = GetParameter(rule, "EntityName", "entityLogicalName");
        if (string.IsNullOrWhiteSpace(entityName))
        {
            entityName = context.TableLogicalName;
        }

        var grant = context.Security.FindTable(entityName);
        if (grant is null)
        {
            return false;
        }

        var privilegeType = GetParameter(rule, "PrivilegeType", "privilege");
        var requiredDepth = ParseDepth(GetParameter(rule, "PrivilegeDepth", "depth"));

        return privilegeType?.ToLowerInvariant() switch
        {
            "read" => grant.ReadDepth >= requiredDepth && grant.ReadDepth > AccessDepth.None,
            "create" => grant.CreateDepth >= requiredDepth && grant.CreateDepth > AccessDepth.None,
            "write" or "update" => grant.UpdateDepth >= requiredDepth && grant.UpdateDepth > AccessDepth.None,
            "delete" => grant.DeleteDepth >= requiredDepth && grant.DeleteDepth > AccessDepth.None,
            _ => false,
        };
    }

    private static bool EvaluateRecordPrivilegeRule(
        CommandRuleDefinition rule,
        CommandRuleEvaluationContext context)
    {
        if (context.RecordId == Guid.Empty)
        {
            return false;
        }

        return EvaluateEntityPrivilegeRule(rule, context);
    }

    private static bool EvaluateCustomRule(
        CommandRuleDefinition rule,
        CommandRuleEvaluationContext context)
    {
        if (context.CustomRuleHandler is null)
        {
            // Custom rules must fail closed unless an approved customer handler exists
            return false;
        }

        var library = GetParameter(rule, "Library", "libraryName") ?? string.Empty;
        var functionName = GetParameter(rule, "FunctionName", "function") ?? string.Empty;

        if (string.IsNullOrWhiteSpace(functionName))
        {
            return false;
        }

        try
        {
            return context.CustomRuleHandler(library, functionName);
        }
        catch
        {
            // Any handler exceptions fail closed
            return false;
        }
    }

    private static string? GetParameter(
        CommandRuleDefinition rule,
        params string[] candidateNames)
    {
        foreach (var candidate in candidateNames)
        {
            foreach (var kvp in rule.Parameters)
            {
                if (string.Equals(kvp.Key, candidate, StringComparison.OrdinalIgnoreCase))
                {
                    return kvp.Value;
                }
            }
        }

        return null;
    }

    private static AccessDepth ParseDepth(string? depthStr)
    {
        if (string.IsNullOrWhiteSpace(depthStr))
        {
            return AccessDepth.User;
        }

        return depthStr.ToLowerInvariant() switch
        {
            "basic" or "user" => AccessDepth.User,
            "local" or "businessunit" => AccessDepth.BusinessUnit,
            "deep" or "parentchildbusinessunit" => AccessDepth.ParentChildBusinessUnit,
            "global" or "organization" => AccessDepth.Organization,
            _ => AccessDepth.User,
        };
    }
}
