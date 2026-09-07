using VerseOff.Maker;

if (args.Length == 0 || args.Contains("--help") || args.Contains("-h"))
{
    ShowHelp();
    return 0;
}

try
{
    var options = ParseArguments(args);
    var console = new ConsoleFormatter(options.Verbose);
    var command = new MakerCommand(options, console);
    
    return await command.ExecuteAsync();
}
catch (Exception ex)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine($"Error: {ex.Message}");
    Console.ResetColor();
    return 1;
}

static MakerOptions ParseArguments(string[] args)
{
    var options = new MakerOptions();

    for (int i = 0; i < args.Length; i++)
    {
        switch (args[i])
        {
            case "--input" or "-i":
                options.InputPath = args[++i];
                break;
            case "--output" or "-o":
                options.OutputPath = args[++i];
                break;
            case "--format" or "-f":
                if (Enum.TryParse<OutputFormat>(args[++i], ignoreCase: true, out var fmt))
                    options.Format = fmt;
                break;
            case "--compression" or "-c":
                if (Enum.TryParse<CompressionLevel>(args[++i], ignoreCase: true, out var comp))
                    options.Compression = comp;
                break;
            case "--ootb-strategy":
                if (Enum.TryParse<OOTBStrategy>(args[++i], ignoreCase: true, out var strategy))
                    options.OOTBStrategy = strategy;
                break;
            case "--config":
                options.ConfigPath = args[++i];
                break;
            case "--customizations":
                options.CustomizationPath = args[++i];
                break;
            case "--include-metadata":
                options.IncludeMetadata = true;
                break;
            case "--no-metadata":
                options.IncludeMetadata = false;
                break;
            case "--apply-customizations":
                options.ApplyCustomizations = true;
                break;
            case "--skip-customizations":
                options.ApplyCustomizations = false;
                break;
            case "--validate-only":
                options.ValidateOnly = true;
                break;
            case "--verbose" or "-v":
                options.Verbose = true;
                break;
        }
    }

    return options;
}

static void ShowHelp()
{
    Console.WriteLine("""
    VerseOff Maker - Model-Driven App to Offline Bundle Generator
    Version 1.0.0
    
    USAGE:
        verseoff-maker [OPTIONS]
    
    OPTIONS:
        --input <path>, -i              Path to solution.zip (required)
        --output <path>, -o             Output directory (default: ./dist)
        --format <format>, -f           Output format: json|csharp|msix (default: json)
        --compression <level>, -c       Compression: none|fast|optimal (default: optimal)
        --ootb-strategy <strategy>      OOTB selection: static|runtime|domain|all (default: static)
        --config <path>                 Domain requirements YAML file
        --customizations <path>         App customizations YAML file (add/remove fields, handlers)
        --include-metadata              Include baseline metadata schema (default: true)
        --no-metadata                   Exclude metadata schema (smaller bundle)
        --apply-customizations          Apply customizations if present (default: true)
        --skip-customizations           Skip customization application
        --validate-only                 Validate only, don't generate
        --verbose, -v                   Show detailed output
        --help, -h                      Show this help message
    
    CUSTOMIZATION FEATURES:
        - Add/remove/modify entity fields
        - Register new event handlers (pre/post events)
        - Override existing event handlers
        - Customize form sections and tabs
        - Domain-specific configuration
    
    EXAMPLES:
        # Basic: Generate JSON package from solution
        verseoff-maker --input myapp.zip --output ./dist
        
        # With domain configuration
        verseoff-maker --input myapp.zip --config requirements.yaml --format json
        
        # With customizations
        verseoff-maker --input myapp.zip --customizations myapp-customizations.yaml
        
        # With metadata for runtime customization support
        verseoff-maker --input myapp.zip --include-metadata --apply-customizations
        
        # Validation only
        verseoff-maker --input myapp.zip --validate-only --verbose
        
        # Full options
        verseoff-maker \
          --input myapp.zip \
          --output ./packages \
          --format json \
          --compression optimal \
          --ootb-strategy domain \
          --config domain-config.yaml \
          --customizations customizations.yaml \
          --include-metadata \
          --verbose
    """);
}


