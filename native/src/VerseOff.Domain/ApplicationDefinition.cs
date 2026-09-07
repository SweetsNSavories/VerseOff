namespace VerseOff.Domain;

public sealed record ApplicationDefinition(
    Guid AppModuleId,
    string UniqueName,
    string DisplayName,
    IReadOnlyList<TableDefinition> Tables,
    IReadOnlyList<FormDefinition> Forms,
    IReadOnlyList<NavigationDefinition> Navigation,
    string SourceHash)
{
    public string SchemaVersion { get; init; } = "1.0";

    public string? Description { get; init; }

    public IReadOnlyList<ViewDefinition> Views { get; init; } = [];

    public IReadOnlyList<CommandDefinition> Commands { get; init; } = [];

    public IReadOnlyList<WebResourceDefinition> WebResources { get; init; } = [];

    public IReadOnlyList<CodeComponentDefinition> CodeComponents { get; init; } =
        [];

    public OfflineProfileDefinition? OfflineProfile { get; init; }

    public CompatibilityReport Compatibility { get; init; } =
        CompatibilityReport.Empty;

    public IReadOnlyList<BusinessProcessFlowDefinition> BusinessProcessFlows { get; init; } = [];
}

public sealed record TableDefinition(
    string LogicalName,
    string EntitySetName,
    string PrimaryIdAttribute,
    string? PrimaryNameAttribute,
    bool IsActivity,
    IReadOnlyList<ColumnDefinition> Columns)
{
    public string? DisplayName { get; init; }

    public string? DisplayCollectionName { get; init; }

    public int ObjectTypeCode { get; init; }

    public bool IsCustomizable { get; init; }

    public IReadOnlyList<RelationshipDefinition> Relationships { get; init; } =
        [];

    public IReadOnlyList<AlternateKeyDefinition> AlternateKeys { get; init; } =
        [];
}

public sealed record ColumnDefinition(
    string LogicalName,
    string AttributeType,
    bool CanRead,
    bool CanCreate,
    bool CanUpdate,
    bool IsSecured)
{
    public string? DisplayName { get; init; }

    public string? Description { get; init; }

    public ColumnRequiredLevel RequiredLevel { get; init; }

    public string? Format { get; init; }

    public int? MaxLength { get; init; }

    public int? Precision { get; init; }

    public decimal? MinimumValue { get; init; }

    public decimal? MaximumValue { get; init; }

    public object? DefaultValue { get; init; }

    public IReadOnlyList<OptionDefinition> Options { get; init; } = [];

    public IReadOnlyList<string> LookupTargets { get; init; } = [];
}

public sealed record FormDefinition(
    Guid FormId,
    string Name,
    string TableLogicalName,
    int FormType,
    IReadOnlyList<FormEventDefinition> Events,
    ComponentProvenance Provenance)
{
    public string? Description { get; init; }

    public bool IsActive { get; init; } = true;

    public IReadOnlyList<FormTabDefinition> Tabs { get; init; } = [];

    public IReadOnlyList<FormControlDefinition> HeaderControls { get; init; } =
        [];

    public IReadOnlyList<FormControlDefinition> FooterControls { get; init; } =
        [];

    public IReadOnlyList<FormControlDefinition> HiddenControls { get; init; } =
        [];

    public IReadOnlyList<FormParameterDefinition> Parameters { get; init; } =
        [];
}

public sealed record FormEventDefinition(
    string EventName,
    string HandlerId,
    string FunctionName,
    string? LibraryName,
    bool PassExecutionContext,
    int Order,
    ComponentProvenance Provenance)
{
    public string? TargetName { get; init; }

    public IReadOnlyList<HandlerParameterDefinition> Parameters { get; init; } =
        [];

    public bool IsEnabled { get; init; } = true;

    public HandlerRegistrationSource RegistrationSource { get; init; } =
        HandlerRegistrationSource.SourceMetadata;
}

public sealed record NavigationDefinition(
    string Id,
    string Title,
    string? TableLogicalName,
    string? Url,
    int Order)
{
    public NavigationNodeKind Kind { get; init; } = NavigationNodeKind.SubArea;

    public string? ParentId { get; init; }

    public string? IconResource { get; init; }

    public string? Client { get; init; }

    public IReadOnlyList<string> PrivilegeNames { get; init; } = [];
}

public enum ColumnRequiredLevel
{
    None = 0,
    Recommended = 1,
    Required = 2,
    SystemRequired = 3,
}

public enum NavigationNodeKind
{
    Area = 0,
    Group = 1,
    SubArea = 2,
}

public enum HandlerRegistrationSource
{
    PlatformSafety = 0,
    CleanRoomNative = 1,
    SourceMetadata = 2,
    VerseOffPrepend = 3,
    VerseOffAppend = 4,
}

public sealed record OptionDefinition(
    int Value,
    string Label,
    string? Color);

public sealed record RelationshipDefinition(
    string SchemaName,
    string ReferencingTable,
    string ReferencingColumn,
    string ReferencedTable,
    string ReferencedColumn,
    RelationshipKind Kind,
    bool IsCustomizable);

public enum RelationshipKind
{
    OneToMany = 0,
    ManyToOne = 1,
    ManyToMany = 2,
}

public sealed record AlternateKeyDefinition(
    string SchemaName,
    IReadOnlyList<string> Columns);

public sealed record FormTabDefinition(
    string Name,
    string Label,
    bool IsVisible,
    bool IsExpanded,
    int Order,
    IReadOnlyList<FormColumnDefinition> Columns);

public sealed record FormColumnDefinition(
    int WidthPercentage,
    IReadOnlyList<FormSectionDefinition> Sections);

public sealed record FormSectionDefinition(
    string Name,
    string Label,
    bool IsVisible,
    bool ShowLabel,
    int Order,
    IReadOnlyList<FormRowDefinition> Rows);

public sealed record FormRowDefinition(
    int Order,
    IReadOnlyList<FormCellDefinition> Cells);

public sealed record FormCellDefinition(
    string Id,
    string? Label,
    bool IsVisible,
    bool ShowLabel,
    int RowSpan,
    int ColumnSpan,
    FormControlDefinition? Control);

public sealed record FormControlDefinition(
    string Id,
    string? DataFieldName,
    FormControlKind Kind,
    string? ClassId,
    bool IsVisible,
    bool IsDisabled)
{
    public string? RawControlXml { get; init; }

    public string? Label { get; init; }

    public string? Description { get; init; }

    public string? ViewId { get; init; }

    public string? RelationshipName { get; init; }

    public string? WebResourceName { get; init; }

    public string? CodeComponentName { get; init; }

    public TimelineDefinition? Timeline { get; init; }

    public IReadOnlyDictionary<string, string?> Parameters { get; init; } =
        new Dictionary<string, string?>(StringComparer.Ordinal);

    public IReadOnlyList<FormEventDefinition> Events { get; init; } = [];
}

public enum FormControlKind
{
    Unknown = 0,
    Text = 1,
    MultilineText = 2,
    Number = 3,
    Currency = 4,
    DateTime = 5,
    Boolean = 6,
    Choice = 7,
    MultiSelectChoice = 8,
    Lookup = 9,
    Customer = 10,
    Owner = 11,
    Subgrid = 12,
    Timeline = 13,
    Notes = 14,
    QuickView = 15,
    WebResource = 16,
    Iframe = 17,
    CustomControl = 18,
    Spacer = 19,
}

public sealed record FormParameterDefinition(
    string Name,
    string DataType,
    string? DefaultValue);

public sealed record HandlerParameterDefinition(
    string Value,
    HandlerParameterKind Kind);

public enum HandlerParameterKind
{
    Literal = 0,
    PrimaryControl = 1,
    SelectedControl = 2,
    SelectedControlSelectedItemIds = 3,
    SelectedControlSelectedItemReferences = 4,
    CommandProperties = 5,
    CrmParameter = 6,
}

public sealed record ViewDefinition(
    Guid ViewId,
    string Name,
    string TableLogicalName,
    string FetchXml,
    string LayoutXml,
    bool IsDefault,
    ComponentProvenance Provenance)
{
    public IReadOnlyList<ViewColumnDefinition> Columns { get; init; } = [];
}

public sealed record ViewColumnDefinition(
    string LogicalName,
    int Width,
    int Order,
    bool IsPrimary);

public sealed record CommandDefinition(
    string CommandId,
    string Label,
    string Location,
    int Order,
    CommandActionDefinition Action,
    ComponentProvenance Provenance)
{
    public IReadOnlyList<CommandRuleDefinition> DisplayRules { get; init; } = [];

    public IReadOnlyList<CommandRuleDefinition> EnableRules { get; init; } = [];
}

public sealed record CommandActionDefinition(
    CommandActionKind Kind,
    string Target,
    IReadOnlyList<HandlerParameterDefinition> Parameters);

public enum CommandActionKind
{
    Unsupported = 0,
    Native = 1,
    CustomerJavaScript = 2,
    OpenUrl = 3,
}

public sealed record CommandRuleDefinition(
    string RuleType,
    IReadOnlyDictionary<string, string?> Parameters,
    bool InvertResult);

public sealed record WebResourceDefinition(
    Guid WebResourceId,
    string Name,
    WebResourceKind Kind,
    string RelativePath,
    string Sha256,
    ComponentProvenance Provenance)
{
    public IReadOnlyList<string> Dependencies { get; init; } = [];

    public CompatibilityDisposition Compatibility { get; init; } =
        CompatibilityDisposition.Blocked;
}

public enum WebResourceKind
{
    Unknown = 0,
    Html = 1,
    Css = 2,
    JavaScript = 3,
    Xml = 4,
    Png = 5,
    Jpeg = 6,
    Gif = 7,
    Xap = 8,
    Xsl = 9,
    Ico = 10,
    Svg = 11,
    Resx = 12,
}

public sealed record CodeComponentDefinition(
    string Name,
    string Namespace,
    CodeComponentKind Kind,
    string Version,
    ComponentProvenance Provenance)
{
    public string? SourceManifestPath { get; init; }

    public IReadOnlyList<CodeComponentPropertyDefinition> Properties
    {
        get;
        init;
    } = [];

    public IReadOnlyList<string> ResourceNames { get; init; } = [];

    public IReadOnlyList<string> RequiredFeatures { get; init; } = [];

    public CompatibilityDisposition Compatibility { get; init; } =
        CompatibilityDisposition.Blocked;
}

public enum CodeComponentKind
{
    Field = 0,
    Dataset = 1,
    Virtual = 2,
}

public sealed record CodeComponentPropertyDefinition(
    string Name,
    string Usage,
    string DataType,
    bool IsRequired,
    string? DefaultValue);

public sealed record BusinessProcessFlowDefinition(
    Guid ProcessId,
    string UniqueName,
    string DisplayName,
    string PrimaryTableLogicalName,
    IReadOnlyList<ProcessStageDefinition> Stages,
    ComponentProvenance Provenance)
{
    public string? Description { get; init; }

    public bool IsActive { get; init; } = true;

    public int Order { get; init; }
}

public sealed record ProcessStageDefinition(
    Guid StageId,
    string StageName,
    string TableLogicalName,
    ProcessStageCategory Category,
    int Order,
    IReadOnlyList<ProcessStepDefinition> Steps);

public enum ProcessStageCategory
{
    Qualify = 0,
    Develop = 1,
    Propose = 2,
    Close = 3,
    Identify = 4,
    Research = 5,
    Resolve = 6,
    Approval = 7,
    Custom = 8,
}

public sealed record ProcessStepDefinition(
    Guid StepId,
    string DisplayName,
    string AttributeLogicalName,
    bool IsRequired,
    int Order);
