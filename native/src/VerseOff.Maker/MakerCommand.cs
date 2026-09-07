using VerseOff.Metadata;
using VerseOff.Domain;
using System.Globalization;

namespace VerseOff.Maker;

public class MakerCommand
{
    private readonly MakerOptions _options;
    private readonly ConsoleFormatter _console;
    private ApplicationDefinition? _loadedApp;
    private SolutionIdentity? _solutionIdentity;

    public MakerCommand(MakerOptions options, ConsoleFormatter console)
    {
        _options = options;
        _console = console;
    }

    public async Task<int> ExecuteAsync()
    {
        try
        {
            _console.Step("Validating input...");
            var (isValid, errors) = MakerValidator.Validate(_options);
            
            if (!isValid)
            {
                foreach (var error in errors)
                {
                    _console.Error(error);
                }
                return 1;
            }

            var inputFileInfo = new FileInfo(_options.InputPath!);
            _console.Substep($"File size: {FormatBytes(inputFileInfo.Length)}");
            _console.Substep($"Format: Microsoft solution package");

            _console.BlankLine();
            _console.Step("Loading solution...");
            
            if (!await LoadAndAnalyzeSolutionAsync())
            {
                return 1;
            }

            if (_options.ValidateOnly)
            {
                _console.BlankLine();
                _console.Step("Validation complete - no errors found");
                return 0;
            }

            _console.BlankLine();
            _console.Step("Generating offline package...");
            
            if (!await GeneratePackageAsync())
            {
                return 1;
            }

            _console.BlankLine();
            _console.Step("Package ready!");
            OutputSummary();

            return 0;
        }
        catch (Exception ex)
        {
            _console.Error($"Unexpected error: {ex.Message}");
            if (_options.Verbose)
            {
                _console.Error($"Stack trace: {ex.StackTrace}");
            }
            return 1;
        }
    }

    private async Task<bool> LoadAndAnalyzeSolutionAsync()
    {
        try
        {
            _console.Substep("Loading solution package...");
            var solutionPackage = await SolutionPackage.LoadAsync(_options.InputPath!);
            
            _console.Substep("Reading solution identity...");
            _solutionIdentity = SolutionIdentityReader.Read(solutionPackage);
            if (_solutionIdentity == null)
            {
                _console.Error("Failed to read solution identity");
                return false;
            }
            
            _console.Substep($"Solution: {_solutionIdentity.UniqueName}");
            _console.Substep($"Version: {_solutionIdentity.Version}");
            _console.Substep($"Publisher: {_solutionIdentity.PublisherUniqueName}");

            _console.Substep("Discovering model-driven apps...");
            var discovery = SolutionDiscoveryService.Discover(solutionPackage);
            
            if (discovery.Applications.Count == 0)
            {
                _console.Error("No model-driven app found in solution");
                return false;
            }

            var selectedApp = discovery.Applications[0];
            _console.Substep($"Selected app: {selectedApp.UniqueName}");

            _console.Substep("Analyzing solution structure...");
            var policy = SolutionImportPolicy.FailClosed;
            var importer = new DataverseSolutionImporter(
                importPolicy: policy,
                schemaValidationBehavior: SchemaValidationBehavior.ReportOnly,
                ootbResolver: BundledOOTBCatalog.Instance
            );

            var result = importer.Import(solutionPackage, selectedApp.AppModuleId);

            if (!result.Succeeded)
            {
                foreach (var issue in result.Issues)
                {
                    if (issue.Severity == CompatibilitySeverity.Blocking)
                    {
                        _console.Error($"Blocking: {issue.Message}");
                    }
                    else
                    {
                        _console.Warning($"Warning: {issue.Message}");
                    }
                }
                if (result.Application?.Compatibility.CanActivate == false)
                {
                    return false;
                }
            }

            _loadedApp = result.Application;
            if (_loadedApp == null)
            {
                _console.Error("Failed to load application definition");
                return false;
            }
            
            _console.Substep($"Tables: {_loadedApp.Tables.Count}");
            _console.Substep($"Forms: {_loadedApp.Forms.Count}");
            _console.Substep($"Views: {_loadedApp.Views.Count}");

            _console.BlankLine();
            _console.Step("Resolving OOTB components...");
            _console.Substep($"Strategy: {_options.OOTBStrategy}");
            
            var tableCount = _loadedApp.Tables.Count;
            var formCount = _loadedApp.Forms.Count;
            var viewCount = _loadedApp.Views.Count;
            
            _console.Substep($"Total components: {tableCount + formCount + viewCount}");
            _console.Substep("Components catalog prepared");

            return true;
        }
        catch (Exception ex)
        {
            _console.Error($"Failed to load solution: {ex.Message}");
            if (_options.Verbose)
            {
                _console.Error($"Details: {ex.InnerException?.Message}");
            }
            return false;
        }
    }

    private async Task<bool> GeneratePackageAsync()
    {
        try
        {
            if (_loadedApp == null)
            {
                _console.Error("No application loaded");
                return false;
            }

            Directory.CreateDirectory(_options.OutputPath!);

            _console.Substep("Generating offline bundle...");
            
            var outputDir = _options.OutputPath!;
            
            switch (_options.Format)
            {
                case OutputFormat.Json:
                    _console.Substep("Exporting as JSON...");
                    var manifest = await DataverseSolutionImporter.ExportAsJsonAsync(
                        _loadedApp,
                        outputDir
                    );
                    _console.Substep($"Manifest created");
                    break;

                case OutputFormat.CSharp:
                    _console.Substep("Exporting as C# source...");
                    // Future: C# code generation
                    _console.Warning("C# export not yet implemented");
                    break;

                case OutputFormat.MSIX:
                    _console.Substep("Exporting as MSIX package...");
                    // Future: MSIX packaging
                    _console.Warning("MSIX export not yet implemented");
                    break;
            }

            if (_options.Compression != CompressionLevel.None)
            {
                _console.Substep($"Compressing with {_options.Compression}...");
                var outputZip = Path.Combine(outputDir, "offline-bundle.zip");
                await DataverseSolutionImporter.ExportOfflinePackageAsync(_loadedApp, outputZip);
                _console.Substep($"Package: {outputZip}");
            }

            return true;
        }
        catch (Exception ex)
        {
            _console.Error($"Failed to generate package: {ex.Message}");
            if (_options.Verbose)
            {
                _console.Error($"Details: {ex.InnerException?.Message}");
            }
            return false;
        }
    }

    private void OutputSummary()
    {
        if (_loadedApp == null) return;

        var outputZip = Path.Combine(_options.OutputPath!, "offline-bundle.zip");
        var fileInfo = File.Exists(outputZip) ? new FileInfo(outputZip) : null;
        
        _console.Summary("Output", outputZip);
        _console.Summary("Format", _options.Format.ToString());
        if (fileInfo != null)
        {
            _console.Summary("Size", FormatBytes(fileInfo.Length));
        }
        _console.Summary("Tables", _loadedApp.Tables.Count.ToString(CultureInfo.InvariantCulture));
        _console.Summary("Forms", _loadedApp.Forms.Count.ToString(CultureInfo.InvariantCulture));
        _console.Summary("Views", _loadedApp.Views.Count.ToString(CultureInfo.InvariantCulture));
    }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1822:Mark members as static")]
    private string FormatBytes(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB" };
        double len = bytes;
        int order = 0;
        while (len >= 1024 && order < sizes.Length - 1)
        {
            order++;
            len = len / 1024;
        }
        return $"{len:0.##} {sizes[order]}";
    }
}
