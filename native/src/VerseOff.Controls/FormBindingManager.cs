using System.Globalization;
using VerseOff.ClientApi;

namespace VerseOff.Controls;

public interface IFormEditor
{
    string AttributeName { get; }

    object? Value { get; set; }

    event EventHandler? ValueChanged;
}

public sealed class FormBindingManager
{
    private readonly Dictionary<string, (IFormEditor Editor, XrmAttribute Attribute)> bindings =
        new(StringComparer.OrdinalIgnoreCase);

    public event EventHandler? StateChanged;

    public event EventHandler<string>? AttributeChanged;

    public bool IsDirty => bindings.Values.Any(binding => binding.Attribute.IsDirty);

    public void Bind(
        string attributeName,
        IFormEditor editor,
        XrmAttribute attribute)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(attributeName);
        ArgumentNullException.ThrowIfNull(editor);
        ArgumentNullException.ThrowIfNull(attribute);

        bindings[attributeName] = (editor, attribute);
        editor.ValueChanged += (_, _) =>
        {
            attribute.SetValue(editor.Value);
            StateChanged?.Invoke(this, EventArgs.Empty);
            AttributeChanged?.Invoke(this, attributeName);
        };

        if (attribute.GetValue() is not null)
        {
            editor.Value = attribute.GetValue();
        }
    }

    public void Bind(
        string attributeName,
        View control,
        XrmAttribute attribute)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(attributeName);
        ArgumentNullException.ThrowIfNull(control);
        ArgumentNullException.ThrowIfNull(attribute);

        var adapter = new MauiFormEditorAdapter(
            attributeName,
            control,
            attribute.AttributeType);
        Bind(attributeName, adapter, attribute);
    }

    public void Populate(IReadOnlyDictionary<string, object?> values)
    {
        ArgumentNullException.ThrowIfNull(values);

        foreach (var (attributeName, (editor, attribute)) in bindings)
        {
            if (values.TryGetValue(attributeName, out var value))
            {
                attribute.SetValue(value);
                editor.Value = value;
            }
        }

        ResetDirty();
    }

    public object? GetValue(string attributeName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(attributeName);
        return bindings.TryGetValue(attributeName, out var binding)
            ? binding.Attribute.GetValue()
            : null;
    }

    public void SetValue(string attributeName, object? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(attributeName);

        if (bindings.TryGetValue(attributeName, out var binding))
        {
            binding.Attribute.SetValue(value);
            binding.Editor.Value = value;
            StateChanged?.Invoke(this, EventArgs.Empty);
            AttributeChanged?.Invoke(this, attributeName);
        }
    }

    public IReadOnlyDictionary<string, object?> ExtractValues(bool onlyDirty = false)
    {
        var result = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
        foreach (var (attributeName, (_, attribute)) in bindings)
        {
            if (!onlyDirty || attribute.IsDirty)
            {
                result[attributeName] = attribute.GetValue();
            }
        }

        return result;
    }

    public IReadOnlyDictionary<string, object?> GetValues(bool onlyDirty = false) =>
        ExtractValues(onlyDirty);

    public void SyncFromAttributes()
    {
        foreach (var (_, (editor, attribute)) in bindings)
        {
            editor.Value = attribute.GetValue();
        }
    }

    public void ResetDirty()
    {
        foreach (var (_, attribute) in bindings.Values)
        {
            attribute.ResetDirty();
        }

        StateChanged?.Invoke(this, EventArgs.Empty);
    }
}

public sealed class MauiFormEditorAdapter : IFormEditor
{
    private readonly View control;
    private readonly string attributeType;
    private bool isUpdating;

    public MauiFormEditorAdapter(
        string attributeName,
        View control,
        string attributeType)
    {
        AttributeName = attributeName ?? throw new ArgumentNullException(nameof(attributeName));
        this.control = control ?? throw new ArgumentNullException(nameof(control));
        this.attributeType = attributeType ?? string.Empty;

        AttachEvents();
    }

    public string AttributeName { get; }

    public object? Value
    {
        get => ReadValue();
        set => WriteValue(value);
    }

    public event EventHandler? ValueChanged;

    private void AttachEvents()
    {
        if (control is Entry entry)
        {
            entry.TextChanged += (_, _) => OnControlChanged();
        }
        else if (control is Editor editor)
        {
            editor.TextChanged += (_, _) => OnControlChanged();
        }
        else if (control is CheckBox checkBox)
        {
            checkBox.CheckedChanged += (_, _) => OnControlChanged();
        }
        else if (control is Switch switchControl)
        {
            switchControl.Toggled += (_, _) => OnControlChanged();
        }
        else if (control is Picker picker)
        {
            picker.SelectedIndexChanged += (_, _) => OnControlChanged();
        }
        else if (control is DatePicker datePicker)
        {
            datePicker.DateSelected += (_, _) => OnControlChanged();
        }
    }

    private void OnControlChanged()
    {
        if (!isUpdating)
        {
            ValueChanged?.Invoke(this, EventArgs.Empty);
        }
    }

    private object? ReadValue()
    {
        if (control is Entry entry)
        {
            return ParseValue(entry.Text, attributeType);
        }

        if (control is Editor editor)
        {
            return editor.Text;
        }

        if (control is CheckBox checkBox)
        {
            return checkBox.IsChecked;
        }

        if (control is Switch switchControl)
        {
            return switchControl.IsToggled;
        }

        if (control is Picker picker)
        {
            if (picker.SelectedItem is XrmOption option)
            {
                return option.Value;
            }

            if (picker.SelectedItem is int intVal)
            {
                return intVal;
            }

            return picker.SelectedIndex >= 0 ? picker.SelectedIndex : null;
        }

        if (control is DatePicker datePicker)
        {
            return datePicker.Date;
        }

        return null;
    }

    private void WriteValue(object? value)
    {
        isUpdating = true;
        try
        {
            if (control is Entry entry)
            {
                entry.Text = value is null
                    ? string.Empty
                    : string.Format(CultureInfo.InvariantCulture, "{0}", value);
            }
            else if (control is Editor editor)
            {
                editor.Text = value?.ToString() ?? string.Empty;
            }
            else if (control is CheckBox checkBox)
            {
                checkBox.IsChecked = value is bool b && b;
            }
            else if (control is Switch switchControl)
            {
                switchControl.IsToggled = value is bool b && b;
            }
            else if (control is Picker picker)
            {
                if (value is int intVal && picker.ItemsSource is IEnumerable<XrmOption> options)
                {
                    picker.SelectedItem = options.FirstOrDefault(opt => opt.Value == intVal);
                }
                else if (value is int idx && idx >= 0 && idx < picker.ItemsSource?.Count)
                {
                    picker.SelectedIndex = idx;
                }
            }
            else if (control is DatePicker datePicker)
            {
                if (value is DateTime dt)
                {
                    datePicker.Date = dt;
                }
                else if (value is DateTimeOffset dto)
                {
                    datePicker.Date = dto.DateTime;
                }
                else if (value is string dateStr && DateTime.TryParse(dateStr, CultureInfo.InvariantCulture, out var parsedDt))
                {
                    datePicker.Date = parsedDt;
                }
            }
        }
        finally
        {
            isUpdating = false;
        }
    }

    private static object? ParseValue(string? text, string attributeType)
    {
        if (string.IsNullOrEmpty(text))
        {
            return null;
        }

        return attributeType.ToLowerInvariant() switch
        {
            "integer" or "wholenumber" => int.TryParse(text, NumberStyles.Integer, CultureInfo.InvariantCulture, out var i)
                ? i
                : null,
            "money" or "currency" or "decimal" => decimal.TryParse(text, NumberStyles.Number, CultureInfo.InvariantCulture, out var d)
                ? d
                : null,
            "double" or "float" => double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture, out var f)
                ? f
                : null,
            "boolean" => bool.TryParse(text, out var b) ? b : null,
            _ => text,
        };
    }
}
