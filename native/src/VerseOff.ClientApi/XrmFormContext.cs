using System.Diagnostics.CodeAnalysis;

namespace VerseOff.ClientApi;

[SuppressMessage(
    "Naming",
    "CA1711",
    Justification = "XrmAttribute is the documented model-driven app Client API concept.")]
public sealed class XrmAttribute
{
    private object? value;

    public XrmAttribute(
        string name,
        string attributeType,
        object? value = null,
        string? format = null,
        int? maximumLength = null,
        string requiredLevel = "none",
        string submitMode = "dirty",
        bool isEntityAttribute = true,
        IReadOnlyList<XrmOption>? options = null,
        decimal? minimum = null,
        decimal? maximum = null,
        int? precision = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(attributeType);
        Name = name;
        AttributeType = attributeType;
        this.value = value;
        InitialValue = value;
        Format = format;
        MaximumLength = maximumLength;
        RequiredLevel = requiredLevel;
        SubmitMode = submitMode;
        IsEntityAttribute = isEntityAttribute;
        Options = options ?? [];
        Minimum = minimum;
        Maximum = maximum;
        Precision = precision;
    }

    public string Name { get; }

    public string AttributeType { get; }

    public string? Format { get; }

    public int? MaximumLength { get; }

    public object? InitialValue { get; }

    public string RequiredLevel { get; private set; }

    public string SubmitMode { get; private set; }

    public bool IsEntityAttribute { get; }

    public IReadOnlyList<XrmOption> Options { get; }

    public decimal? Minimum { get; }

    public decimal? Maximum { get; }

    public int? Precision { get; private set; }

    public bool IsValid { get; private set; } = true;

    public bool IsDirty { get; private set; }

    public object? GetValue() => value;

    public void SetValue(object? newValue)
    {
        value = newValue;
        IsDirty = true;
    }

    public void SetRequiredLevel(string level)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(level);
        RequiredLevel = level;
    }

    public void SetSubmitMode(string mode)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(mode);
        SubmitMode = mode;
    }

    public void SetPrecision(int precision)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(precision);
        Precision = precision;
    }

    public void SetIsValid(bool isValid) => IsValid = isValid;

    internal void ApplyScriptState(
        object? newValue,
        string requiredLevel,
        string submitMode,
        bool isDirty,
        bool isValid,
        int? precision)
    {
        value = newValue;
        RequiredLevel = requiredLevel;
        SubmitMode = submitMode;
        IsDirty = isDirty;
        IsValid = isValid;
        Precision = precision;
    }
}

public sealed record XrmOption(string Text, int Value);

public class XrmControl
{
    private readonly Dictionary<string, string> notifications =
        new(StringComparer.Ordinal);

    public XrmControl(
        string name,
        string controlType,
        string? attributeName = null,
        string? label = null,
        bool isVisible = true,
        bool isDisabled = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(controlType);
        Name = name;
        ControlType = controlType;
        AttributeName = attributeName;
        Label = label ?? name;
        IsVisible = isVisible;
        IsDisabled = isDisabled;
    }

    public string Name { get; }

    public string ControlType { get; }

    public string? AttributeName { get; }

    public string Label { get; private set; }

    public bool IsVisible { get; private set; }

    public bool IsDisabled { get; private set; }

    public IReadOnlyDictionary<string, string> Notifications => notifications;

    public void SetLabel(string label)
    {
        ArgumentNullException.ThrowIfNull(label);
        Label = label;
    }

    public void SetVisible(bool visible) => IsVisible = visible;

    public void SetDisabled(bool disabled) => IsDisabled = disabled;

    public void SetNotification(string message, string uniqueId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);
        ArgumentException.ThrowIfNullOrWhiteSpace(uniqueId);
        notifications[uniqueId] = message;
    }

    public bool ClearNotification(string uniqueId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(uniqueId);
        return notifications.Remove(uniqueId);
    }

    public virtual void Refresh()
    {
        throw new InvalidOperationException(
            $"Control '{Name}' does not support refresh.");
    }

    internal void ApplyScriptState(
        string label,
        bool visible,
        bool disabled,
        IReadOnlyDictionary<string, string> scriptNotifications,
        bool refreshRequested)
    {
        Label = label;
        IsVisible = visible;
        IsDisabled = disabled;
        notifications.Clear();
        foreach (var notification in scriptNotifications)
        {
            notifications[notification.Key] = notification.Value;
        }

        if (refreshRequested)
        {
            Refresh();
        }
    }
}

public sealed class XrmTimelineControl : XrmControl
{
    public XrmTimelineControl(
        string name,
        string? label = null,
        bool isVisible = true,
        bool isDisabled = false)
        : base(
            name,
            "timelinewall",
            attributeName: null,
            label,
            isVisible,
            isDisabled)
    {
    }

    public event EventHandler? RefreshRequested;

    public override void Refresh() =>
        RefreshRequested?.Invoke(this, EventArgs.Empty);
}

public sealed class XrmFormContext : IXrmFormContext
{
    private readonly Dictionary<string, XrmAttribute> attributes;
    private readonly Dictionary<string, XrmControl> controls;
    private readonly Dictionary<string, XrmTab> tabs;

    public XrmFormContext(
        string entityName,
        Guid entityId,
        int formType,
        IEnumerable<XrmAttribute> attributes,
        IEnumerable<XrmControl> controls,
        Uri? clientUrl = null,
        IEnumerable<XrmTab>? tabs = null,
        XrmProcess? process = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(entityName);
        ArgumentNullException.ThrowIfNull(attributes);
        ArgumentNullException.ThrowIfNull(controls);

        EntityName = entityName;
        EntityId = entityId;
        FormType = formType;
        ClientUrl = clientUrl;
        this.attributes = attributes.ToDictionary(
            attribute => attribute.Name,
            StringComparer.OrdinalIgnoreCase);
        this.controls = controls.ToDictionary(
            control => control.Name,
            StringComparer.OrdinalIgnoreCase);
        this.tabs = (tabs ?? []).ToDictionary(
            tab => tab.Name,
            StringComparer.OrdinalIgnoreCase);
        Process = process;
    }

    public string EntityName { get; }

    public Guid EntityId { get; }

    public int FormType { get; }

    public Uri? ClientUrl { get; }

    public IReadOnlyCollection<XrmAttribute> Attributes => attributes.Values;

    public IReadOnlyCollection<XrmControl> Controls => controls.Values;

    public IReadOnlyCollection<XrmTab> Tabs => tabs.Values;

    public XrmProcess? Process { get; }

    public XrmAttribute? GetAttribute(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return attributes.GetValueOrDefault(name);
    }

    public XrmControl? GetControl(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return controls.GetValueOrDefault(name);
    }

    public XrmTab? GetTab(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        return tabs.GetValueOrDefault(name);
    }

    public bool IsDirty => attributes.Values.Any(attribute => attribute.IsDirty);
}

public sealed class XrmSection
{
    public XrmSection(
        string name,
        string label,
        bool isVisible = true,
        IEnumerable<string>? controlNames = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentNullException.ThrowIfNull(label);
        Name = name;
        Label = label;
        IsVisible = isVisible;
        ControlNames = (controlNames ?? []).ToArray();
    }

    public string Name { get; }

    public string Label { get; private set; }

    public bool IsVisible { get; private set; }

    public IReadOnlyList<string> ControlNames { get; }

    public void SetLabel(string label)
    {
        ArgumentNullException.ThrowIfNull(label);
        Label = label;
    }

    public void SetVisible(bool visible) => IsVisible = visible;

    internal void ApplyScriptState(string label, bool visible)
    {
        Label = label;
        IsVisible = visible;
    }
}

public sealed class XrmTab
{
    private readonly Dictionary<string, XrmSection> sections;

    public XrmTab(
        string name,
        string label,
        IEnumerable<XrmSection>? sections = null,
        bool isVisible = true,
        string displayState = "expanded")
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentNullException.ThrowIfNull(label);
        Name = name;
        Label = label;
        IsVisible = isVisible;
        DisplayState = displayState;
        this.sections = (sections ?? []).ToDictionary(
            section => section.Name,
            StringComparer.OrdinalIgnoreCase);
    }

    public string Name { get; }

    public string Label { get; private set; }

    public bool IsVisible { get; private set; }

    public string DisplayState { get; private set; }

    public IReadOnlyCollection<XrmSection> Sections => sections.Values;

    public void SetLabel(string label)
    {
        ArgumentNullException.ThrowIfNull(label);
        Label = label;
    }

    public void SetVisible(bool visible) => IsVisible = visible;

    public void SetDisplayState(string state)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(state);
        if (state is not "expanded" and not "collapsed")
        {
            throw new ArgumentOutOfRangeException(nameof(state));
        }

        DisplayState = state;
    }

    internal void ApplyScriptState(
        string label,
        bool visible,
        string displayState,
        IReadOnlyDictionary<string, ScriptSectionState> scriptSections)
    {
        Label = label;
        IsVisible = visible;
        DisplayState = displayState;
        foreach (var section in scriptSections)
        {
            sections.GetValueOrDefault(section.Key)?.ApplyScriptState(
                section.Value.Label,
                section.Value.IsVisible);
        }
    }
}

public sealed record XrmProcessStage(
    Guid StageId,
    string Name,
    string EntityName,
    string Status,
    int Category);

public sealed class XrmProcess
{
    private readonly XrmProcessStage[] stages;

    public XrmProcess(
        Guid processId,
        string name,
        IEnumerable<XrmProcessStage> stages,
        int activeStageIndex = 0,
        string status = "active")
    {
        ArgumentNullException.ThrowIfNull(stages);
        ProcessId = processId;
        Name = name;
        this.stages = stages.ToArray();
        if (this.stages.Length == 0)
        {
            throw new ArgumentException(
                "A business process requires at least one stage.",
                nameof(stages));
        }

        ArgumentOutOfRangeException.ThrowIfNegative(activeStageIndex);
        ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(
            activeStageIndex,
            this.stages.Length);
        ActiveStageIndex = activeStageIndex;
        Status = status;
    }

    public Guid ProcessId { get; }

    public string Name { get; }

    public IReadOnlyList<XrmProcessStage> Stages => stages;

    public int ActiveStageIndex { get; private set; }

    public string Status { get; private set; }

    internal void ApplyScriptState(int activeStageIndex, string status)
    {
        if (activeStageIndex >= 0 && activeStageIndex < stages.Length)
        {
            ActiveStageIndex = activeStageIndex;
        }

        Status = status;
    }
}

public sealed class XrmGridRow
{
    private readonly Dictionary<string, object?> values;

    public XrmGridRow(
        Guid recordId,
        string entityName,
        string? primaryName,
        IReadOnlyDictionary<string, object?> values)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(entityName);
        ArgumentNullException.ThrowIfNull(values);
        RecordId = recordId;
        EntityName = entityName;
        PrimaryName = primaryName;
        this.values = new(values, StringComparer.OrdinalIgnoreCase);
    }

    public Guid RecordId { get; }

    public string EntityName { get; }

    public string? PrimaryName { get; }

    public IReadOnlyDictionary<string, object?> Values => values;

    internal void ApplyScriptValues(
        IReadOnlyDictionary<string, object?> scriptValues)
    {
        values.Clear();
        foreach (var value in scriptValues)
        {
            values[value.Key] = value.Value;
        }
    }
}

public sealed class XrmGridControl : XrmControl
{
    private readonly List<XrmGridRow> rows;
    private readonly HashSet<Guid> selectedRecordIds;

    public XrmGridControl(
        string name,
        string entityName,
        IEnumerable<XrmGridRow> rows,
        IEnumerable<Guid>? selectedRecordIds = null,
        string controlType = "subgrid",
        string? label = null)
        : base(name, controlType, label: label)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(entityName);
        ArgumentNullException.ThrowIfNull(rows);
        EntityName = entityName;
        this.rows = rows.ToList();
        this.selectedRecordIds = (selectedRecordIds ?? []).ToHashSet();
    }

    public string EntityName { get; }

    public IReadOnlyList<XrmGridRow> Rows => rows;

    public IReadOnlySet<Guid> SelectedRecordIds => selectedRecordIds;

    public event EventHandler? RefreshRequested;

    public override void Refresh() =>
        RefreshRequested?.Invoke(this, EventArgs.Empty);

    internal void ApplyGridState(
        IReadOnlyList<ScriptGridRowState> scriptRows,
        IReadOnlySet<Guid> selectedIds)
    {
        foreach (var scriptRow in scriptRows)
        {
            rows.FirstOrDefault(row =>
                    row.RecordId == scriptRow.RecordId)
                ?.ApplyScriptValues(scriptRow.Values.ToDictionary(
                    item => item.Key,
                    item => ScriptValue.FromJsonElement(item.Value),
                    StringComparer.OrdinalIgnoreCase));
        }

        selectedRecordIds.Clear();
        selectedRecordIds.UnionWith(selectedIds);
    }
}
