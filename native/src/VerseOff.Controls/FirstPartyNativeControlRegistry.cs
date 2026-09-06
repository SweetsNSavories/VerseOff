using System.Globalization;
using VerseOff.Domain;

namespace VerseOff.Controls;

public enum FirstPartyNativeControlKind
{
    NotFirstParty = 0,
    Toggle = 1,
    Slider = 2,
    Rating = 3,
    OptionSet = 4,
    NumberInput = 5,
    Gauge = 6,
    MaskedInput = 7,
    RichText = 8,
    AutoComplete = 9,
    Unsupported = 10,
}

public static class FirstPartyNativeControlRegistry
{
    private static readonly HashSet<string> ToggleControls = new(
        [
            "MscrmControls.FieldControls.ToggleControl",
            "MscrmControls.Toggle.ToggleControl",
        ],
        StringComparer.OrdinalIgnoreCase);

    private static readonly HashSet<string> SliderControls = new(
        [
            "MscrmControls.Slider.SliderControl",
            "MscrmControls.Slider.LinearSliderControl",
            "MscrmControls.Slider.RadialSliderControl",
        ],
        StringComparer.OrdinalIgnoreCase);

    private static readonly HashSet<string> RatingControls = new(
        [
            "MscrmControls.FieldControls.RatingControl",
            "MscrmControls.Rating.RatingControl",
        ],
        StringComparer.OrdinalIgnoreCase);

    private static readonly HashSet<string> OptionControls = new(
        [
            "MscrmControls.OptionSet.OptionSetControl",
            "MscrmControls.OptionSet.RadioGroupControl",
        ],
        StringComparer.OrdinalIgnoreCase);

    private static readonly HashSet<string> NumberControls = new(
        [
            "MscrmControls.NumberInput.NumberInputControl",
            "MscrmControls.FieldControls.NumberInputControl",
        ],
        StringComparer.OrdinalIgnoreCase);

    private static readonly HashSet<string> GaugeControls = new(
        [
            "MscrmControls.Knob.LinearGaugeControl",
            "MscrmControls.Knob.KnobControl",
        ],
        StringComparer.OrdinalIgnoreCase);

    public static View? TryCreate(FormControlDefinition definition)
    {
        ArgumentNullException.ThrowIfNull(definition);
        var name = definition.CodeComponentName;
        var kind = Resolve(name);
        if (kind is FirstPartyNativeControlKind.NotFirstParty)
        {
            return null;
        }

        return kind switch
        {
            FirstPartyNativeControlKind.Toggle => new Switch(),
            FirstPartyNativeControlKind.Slider => new Slider
            {
                Minimum = Number(definition, "min", 0),
                Maximum = Number(definition, "max", 100),
            },
            FirstPartyNativeControlKind.Rating => new Slider
            {
                Minimum = 0,
                Maximum = Number(definition, "max", 5),
            },
            FirstPartyNativeControlKind.OptionSet => new Picker(),
            FirstPartyNativeControlKind.NumberInput => new Entry
            {
                Keyboard = Keyboard.Numeric,
            },
            FirstPartyNativeControlKind.Gauge => new ProgressBar(),
            FirstPartyNativeControlKind.MaskedInput => new Entry(),
            FirstPartyNativeControlKind.RichText => new Editor
            {
                AutoSize = EditorAutoSizeOption.TextChanges,
                MinimumHeightRequest = 120,
            },
            FirstPartyNativeControlKind.AutoComplete => new SearchBar(),
            _ => new Border
            {
                Padding = 12,
                Stroke = Colors.DarkOrange,
                Content = new Label
                {
                    Text =
                        $"The first-party control '{name}' has no activated clean-room native mapping.",
                },
            },
        };
    }

    public static FirstPartyNativeControlKind Resolve(string? name)
    {
        if (string.IsNullOrWhiteSpace(name)
            || !name.StartsWith(
                "MscrmControls.",
                StringComparison.OrdinalIgnoreCase))
        {
            return FirstPartyNativeControlKind.NotFirstParty;
        }

        if (ToggleControls.Contains(name))
        {
            return FirstPartyNativeControlKind.Toggle;
        }

        if (SliderControls.Contains(name))
        {
            return FirstPartyNativeControlKind.Slider;
        }

        if (RatingControls.Contains(name))
        {
            return FirstPartyNativeControlKind.Rating;
        }

        if (OptionControls.Contains(name))
        {
            return FirstPartyNativeControlKind.OptionSet;
        }

        if (NumberControls.Contains(name))
        {
            return FirstPartyNativeControlKind.NumberInput;
        }

        if (GaugeControls.Contains(name))
        {
            return FirstPartyNativeControlKind.Gauge;
        }

        return name switch
        {
            "MscrmControls.MaskedInput.MaskedInputControl" =>
                FirstPartyNativeControlKind.MaskedInput,
            "MscrmControls.RichTextEditor.RichTextEditorControl" =>
                FirstPartyNativeControlKind.RichText,
            "MscrmControls.AutoComplete.AutoCompleteControl" =>
                FirstPartyNativeControlKind.AutoComplete,
            _ => FirstPartyNativeControlKind.Unsupported,
        };
    }

    private static double Number(
        FormControlDefinition definition,
        string parameter,
        double defaultValue) =>
        definition.Parameters.TryGetValue(parameter, out var value)
        && double.TryParse(
            value,
            NumberStyles.Float,
            CultureInfo.InvariantCulture,
            out var parsed)
                ? parsed
                : defaultValue;
}
