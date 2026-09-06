using VerseOff.Domain;

namespace VerseOff.Controls;

public sealed record FormRuntimeContext(
    ApplicationDefinition Application,
    Guid RecordId,
    string TableLogicalName,
    ITimelineRecordProvider? TimelineProvider);

public interface IVerseOffControlFactory
{
    bool CanCreate(FormControlDefinition definition);

    View Create(
        FormControlDefinition definition,
        FormRuntimeContext context);
}

public interface IVerseOffCustomerControlFactory
{
    string ComponentName { get; }

    bool IsVendorSupportedAdapter { get; }

    View Create(
        FormControlDefinition definition,
        FormRuntimeContext context);
}

public sealed class NativeControlFactory(
    IEnumerable<IVerseOffCustomerControlFactory> customFactories)
    : IVerseOffControlFactory
{
    private readonly Dictionary<string, IVerseOffCustomerControlFactory>
        customFactories = customFactories.ToDictionary(
            factory => factory.ComponentName,
            StringComparer.OrdinalIgnoreCase);

    public bool CanCreate(FormControlDefinition definition)
    {
        ArgumentNullException.ThrowIfNull(definition);
        return true;
    }

    public View Create(
        FormControlDefinition definition,
        FormRuntimeContext context)
    {
        ArgumentNullException.ThrowIfNull(definition);
        ArgumentNullException.ThrowIfNull(context);

        if (definition.Kind is FormControlKind.CustomControl)
        {
            var firstParty =
                FirstPartyNativeControlRegistry.TryCreate(definition);
            if (firstParty is not null)
            {
                return firstParty;
            }

            return CreateCustomControl(definition, context);
        }

        return definition.Kind switch
        {
            FormControlKind.MultilineText => new Editor
            {
                AutoSize = EditorAutoSizeOption.TextChanges,
                MinimumHeightRequest = 90,
            },
            FormControlKind.Boolean => new CheckBox(),
            FormControlKind.Choice
                or FormControlKind.MultiSelectChoice => new Picker(),
            FormControlKind.DateTime => new DatePicker(),
            FormControlKind.Number
                or FormControlKind.Currency => new Entry
                {
                    Keyboard = Keyboard.Numeric,
                },
            FormControlKind.Lookup
                or FormControlKind.Customer
                or FormControlKind.Owner => new Entry
                {
                    Placeholder = "Search offline lookup",
                },
            FormControlKind.Timeline => CreateTimeline(
                definition,
                context),
            FormControlKind.Subgrid => Unsupported(
                definition,
                "Native subgrid provider is not configured."),
            FormControlKind.WebResource
                or FormControlKind.Iframe => Unsupported(
                definition,
                "Browser-hosted resources require an approved native replacement."),
            FormControlKind.Unknown => Unsupported(
                definition,
                "The FormXml control type is unsupported."),
            _ => new Entry(),
        };
    }

    private View CreateCustomControl(
        FormControlDefinition definition,
        FormRuntimeContext context)
    {
        if (definition.CodeComponentName is null
            || !customFactories.TryGetValue(
                definition.CodeComponentName,
                out var factory))
        {
            return Unsupported(
                definition,
                "No approved native factory is registered for this code component.");
        }

        var component = context.Application.CodeComponents
            .FirstOrDefault(candidate => string.Equals(
                $"{candidate.Namespace}.{candidate.Name}",
                definition.CodeComponentName,
                StringComparison.OrdinalIgnoreCase));
        if (component is null)
        {
            return Unsupported(
                definition,
                "The code-component manifest is missing.");
        }

        var decision = CleanRoomComponentPolicy.Evaluate(
            component.Provenance);
        var allowed = decision.Disposition
                is ComponentDisposition.CustomerExecutable
            || decision.Disposition is ComponentDisposition.VendorAdapter
                && factory.IsVendorSupportedAdapter;
        return allowed
            ? factory.Create(definition, context)
            : Unsupported(definition, decision.Reason);
    }

    private static View CreateTimeline(
        FormControlDefinition definition,
        FormRuntimeContext context)
    {
        if (definition.Timeline is null
            || context.TimelineProvider is null)
        {
            return Unsupported(
                definition,
                "Timeline metadata or its offline provider is unavailable.");
        }

        return new TimelineView(
            definition.Timeline,
            context.TimelineProvider,
            context.RecordId,
            context.TableLogicalName);
    }

    private static Border Unsupported(
        FormControlDefinition definition,
        string reason) =>
        new()
        {
            Padding = 12,
            Stroke = Colors.DarkOrange,
            Content = new Label
            {
                Text = $"{definition.Label ?? definition.Id}: {reason}",
                LineBreakMode = LineBreakMode.WordWrap,
            },
        };
}
