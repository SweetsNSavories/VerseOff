namespace VerseOff.Domain;

public sealed record HandlerOverrideDefinition(
    Guid RegistrationId,
    Guid AppModuleId,
    string? TableLogicalName,
    Guid? FormId,
    string? ControlOrColumnName,
    string EventName,
    HandlerOverrideMode Mode,
    string? TargetHandlerId,
    string LibraryOrNativeType,
    string FunctionName,
    bool PassExecutionContext,
    IReadOnlyList<HandlerParameterDefinition> Parameters,
    int Priority,
    ComponentProvenance Provenance)
{
    public string? Condition { get; init; }

    public IReadOnlySet<NativePlatform> Platforms { get; init; } =
        new HashSet<NativePlatform>();

    public bool IsEnabled { get; init; } = true;
}

public enum HandlerOverrideMode
{
    Prepend = 0,
    Append = 1,
    Replace = 2,
    Disable = 3,
    NativeCommandOverride = 4,
}

public enum NativePlatform
{
    Windows = 0,
    Android = 1,
    Ios = 2,
    MacCatalyst = 3,
}
