namespace VerseOff.Maker;

public class MakerOptions
{
    public string? InputPath { get; set; }
    public string? OutputPath { get; set; }
    public string? ConfigPath { get; set; }
    public string? CustomizationPath { get; set; }
    public OutputFormat Format { get; set; } = OutputFormat.Json;
    public CompressionLevel Compression { get; set; } = CompressionLevel.Optimal;
    public OOTBStrategy OOTBStrategy { get; set; } = OOTBStrategy.Static;
    public bool ValidateOnly { get; set; }
    public bool Verbose { get; set; }
    public bool IncludeMetadata { get; set; } = true;
    public bool ApplyCustomizations { get; set; } = true;
}

public enum OutputFormat
{
    Json,
    CSharp,
    MSIX
}

public enum CompressionLevel
{
    None,
    Fast,
    Optimal
}

public enum OOTBStrategy
{
    /// <summary>What AppModule declares (O(1), least accurate)</summary>
    Static,
    
    /// <summary>Filtered by App Insights usage (O(n), medium cost)</summary>
    Runtime,
    
    /// <summary>Merged with ProductEngineer YAML config (O(1), high control)</summary>
    Domain,
    
    /// <summary>Union of all three (O(n), most accurate)</summary>
    All
}
