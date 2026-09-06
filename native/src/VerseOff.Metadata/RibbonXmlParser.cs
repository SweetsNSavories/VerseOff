using System.Globalization;
using System.Xml.Linq;
using VerseOff.Domain;

namespace VerseOff.Metadata;

public static class RibbonXmlParser
{
    public static IReadOnlyList<CommandDefinition> Parse(
        XDocument document,
        ComponentProvenance provenance)
    {
        ArgumentNullException.ThrowIfNull(document);
        ArgumentNullException.ThrowIfNull(provenance);

        var root = document.Root
            ?? throw new InvalidDataException(
                "Ribbon XML has no root element.");
        var presentations = ParsePresentations(root);
        var commands = new List<CommandDefinition>();

        foreach (var definition in root
            .DescendantsNamed("CommandDefinition"))
        {
            var commandId = definition.AttributeValue("Id");
            if (string.IsNullOrWhiteSpace(commandId))
            {
                continue;
            }

            presentations.TryGetValue(
                commandId,
                out var presentation);
            var action = ParseAction(
                definition.ElementNamed("Actions"),
                commandId,
                provenance);
            commands.Add(new(
                commandId,
                presentation?.Label ?? commandId,
                presentation?.Location ?? string.Empty,
                presentation?.Order ?? 0,
                action,
                provenance)
            {
                DisplayRules = ParseRules(
                    definition.ElementNamed("DisplayRules"),
                    "DisplayRule"),
                EnableRules = ParseRules(
                    definition.ElementNamed("EnableRules"),
                    "EnableRule"),
            });
        }

        return commands
            .OrderBy(command => command.Location, StringComparer.Ordinal)
            .ThenBy(command => command.Order)
            .ThenBy(command => command.CommandId, StringComparer.Ordinal)
            .ToArray();
    }

    private static Dictionary<string, CommandPresentation>
        ParsePresentations(XElement root)
    {
        var result = new Dictionary<string, CommandPresentation>(
            StringComparer.OrdinalIgnoreCase);
        foreach (var customAction in root
            .DescendantsNamed("CustomAction"))
        {
            var location = customAction.AttributeValue("Location")
                ?? string.Empty;
            var order = int.TryParse(
                customAction.AttributeValue("Sequence"),
                NumberStyles.Integer,
                CultureInfo.InvariantCulture,
                out var sequence)
                    ? sequence
                    : 0;
            foreach (var control in customAction
                .Descendants()
                .Where(element => element.AttributeValue("Command") is not null))
            {
                var commandId = control.AttributeValue("Command")!;
                result[commandId] = new(
                    control.AttributeValue("LabelText")
                        ?? control.AttributeValue("ToolTipTitle")
                        ?? commandId,
                    location,
                    order);
            }
        }

        return result;
    }

    private static CommandActionDefinition ParseAction(
        XElement? actions,
        string commandId,
        ComponentProvenance provenance)
    {
        var action = actions?.Elements().FirstOrDefault();
        if (action is null)
        {
            return new(
                CommandActionKind.Unsupported,
                commandId,
                []);
        }

        var actionName = action.Name.LocalName;
        if (string.Equals(
                actionName,
                "JavaScriptFunction",
                StringComparison.OrdinalIgnoreCase))
        {
            var functionName = action.AttributeValue("FunctionName")
                ?? string.Empty;
            var library = NormalizeWebResourceName(
                action.AttributeValue("Library"));
            var kind = provenance.Origin is ComponentOrigin.MicrosoftSystem
                ? CommandActionKind.Native
                : CommandActionKind.CustomerJavaScript;
            return new(
                kind,
                $"{library}::{functionName}",
                action.Elements()
                    .Select(ParseParameter)
                    .OfType<HandlerParameterDefinition>()
                    .ToArray());
        }

        if (string.Equals(
                actionName,
                "Url",
                StringComparison.OrdinalIgnoreCase))
        {
            return new(
                CommandActionKind.OpenUrl,
                action.AttributeValue("Address")
                    ?? action.AttributeValue("Url")
                    ?? string.Empty,
                action.Elements()
                    .Select(ParseParameter)
                    .OfType<HandlerParameterDefinition>()
                    .ToArray());
        }

        return new(
            CommandActionKind.Unsupported,
            actionName,
            []);
    }

    private static HandlerParameterDefinition? ParseParameter(
        XElement parameter)
    {
        var value = parameter.AttributeValue("Value");
        if (value is null)
        {
            return null;
        }

        var kind = parameter.Name.LocalName.ToUpperInvariant() switch
        {
            "CRMPARAMETER" => value.ToUpperInvariant() switch
            {
                "PRIMARYCONTROL" =>
                    HandlerParameterKind.PrimaryControl,
                "SELECTEDCONTROL" =>
                    HandlerParameterKind.SelectedControl,
                "SELECTEDCONTROLSELECTEDITEMIDS" =>
                    HandlerParameterKind.SelectedControlSelectedItemIds,
                "SELECTEDCONTROLSELECTEDITEMREFERENCES" =>
                    HandlerParameterKind
                        .SelectedControlSelectedItemReferences,
                "COMMANDPROPERTIES" =>
                    HandlerParameterKind.CommandProperties,
                _ => HandlerParameterKind.CrmParameter,
            },
            _ => HandlerParameterKind.Literal,
        };
        return new(value, kind);
    }

    private static CommandRuleDefinition[] ParseRules(
        XElement? container,
        string referenceName)
    {
        if (container is null)
        {
            return [];
        }

        return container.ElementsNamed(referenceName)
            .Select(reference =>
            {
                var ruleId = reference.AttributeValue("Id")
                    ?? string.Empty;
                return new CommandRuleDefinition(
                    referenceName,
                    new Dictionary<string, string?>(
                        StringComparer.OrdinalIgnoreCase)
                    {
                        ["Id"] = ruleId,
                    },
                    InvertResult: false);
            })
            .ToArray();
    }

    private static string NormalizeWebResourceName(string? value)
    {
        const string prefix = "$webresource:";
        var normalized = value?.Trim() ?? string.Empty;
        return normalized.StartsWith(
            prefix,
            StringComparison.OrdinalIgnoreCase)
                ? normalized[prefix.Length..]
                : normalized.TrimStart('/');
    }

    private sealed record CommandPresentation(
        string Label,
        string Location,
        int Order);
}
