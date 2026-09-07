namespace VerseOff.Customization.EventHandlers;

/// <summary>
/// Represents the code or reference for an event handler
/// </summary>
public record EventHandlerCode(
    EventHandlerCodeType CodeType,
    string Content,
    string? ExternalReference = null,
    Dictionary<string, object>? Metadata = null
)
{
    public EventHandlerCode() : this(EventHandlerCodeType.Inline, "") { }

    /// <summary>
    /// Get the code content (resolves external references if needed)
    /// </summary>
    public string GetCode() => CodeType switch
    {
        EventHandlerCodeType.Inline => Content,
        EventHandlerCodeType.ExternalFile => ExternalReference ?? throw new InvalidOperationException("External reference not specified"),
        EventHandlerCodeType.PluginAssembly => ExternalReference ?? throw new InvalidOperationException("Plugin assembly not specified"),
        _ => throw new InvalidOperationException($"Unknown handler code type: {CodeType}")
    };

    /// <summary>
    /// Validate the handler code
    /// </summary>
    public ValidationResult Validate()
    {
        var issues = new List<string>();

        if (string.IsNullOrWhiteSpace(Content) && CodeType == EventHandlerCodeType.Inline)
            issues.Add("Inline handler code cannot be empty");

        if (CodeType == EventHandlerCodeType.ExternalFile && string.IsNullOrWhiteSpace(ExternalReference))
            issues.Add("External file reference required for ExternalFile handler");

        if (CodeType == EventHandlerCodeType.PluginAssembly && string.IsNullOrWhiteSpace(ExternalReference))
            issues.Add("Plugin assembly reference required for PluginAssembly handler");

        if (CodeType == EventHandlerCodeType.Inline && Content.Length > 50000)
            issues.Add("Inline handler code exceeds maximum size (50KB)");

        return new ValidationResult(issues.Count == 0, issues);
    }
}

/// <summary>
/// Type of event handler code
/// </summary>
public enum EventHandlerCodeType
{
    /// <summary>
    /// Inline code (JavaScript, C#, etc.)
    /// </summary>
    Inline,

    /// <summary>
    /// Reference to external file
    /// </summary>
    ExternalFile,

    /// <summary>
    /// Plugin assembly reference (type-name format: Assembly.Namespace.ClassName)
    /// </summary>
    PluginAssembly
}

/// <summary>
/// Validation result for event handler code
/// </summary>
public record ValidationResult(
    bool IsValid,
    List<string> Issues
);
