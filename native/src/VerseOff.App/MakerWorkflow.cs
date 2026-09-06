using VerseOff.Domain;
using VerseOff.Generator;
using VerseOff.Metadata;

namespace VerseOff.App;

public sealed record LoadedMakerSolution(
    string SourcePath,
    string SourceHash,
    SolutionIdentity Identity,
    IReadOnlyList<ModelDrivenAppDescriptor> Applications,
    IReadOnlyList<SolutionDiscoveryIssue> DiscoveryIssues);

public sealed record MakerGenerationOutcome(
    SourceGenerationResult? Generation,
    IReadOnlyList<CompatibilityIssue> CompatibilityIssues)
{
    public bool Succeeded => Generation is not null;
}

public interface IMakerWorkflow
{
    Task<LoadedMakerSolution> LoadAsync(
        string sourcePath,
        CancellationToken cancellationToken = default);

    Task<MakerGenerationOutcome> GenerateAsync(
        ModelDrivenAppDescriptor application,
        string outputRoot,
        bool customerOwnershipConfirmed,
        CancellationToken cancellationToken = default);
}

public sealed class MakerWorkflow(
    INativeSourceGenerator sourceGenerator) : IMakerWorkflow
{
    private SolutionPackage? package;
    private LoadedMakerSolution? loadedSolution;

    public async Task<LoadedMakerSolution> LoadAsync(
        string sourcePath,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sourcePath);

        var loadedPackage = await SolutionPackage.LoadAsync(
            sourcePath,
            cancellationToken: cancellationToken);
        var discovery = SolutionDiscoveryService.Discover(loadedPackage);
        var identity = discovery.Identity
            ?? throw new InvalidDataException(
                "The solution has no complete SolutionManifest publisher identity.");
        if (discovery.Applications.Count == 0)
        {
            throw new InvalidDataException(
                "The solution contains no discoverable model-driven apps.");
        }

        package = loadedPackage;
        loadedSolution = new(
            loadedPackage.SourcePath,
            loadedPackage.Sha256,
            identity,
            discovery.Applications,
            discovery.Issues);
        return loadedSolution;
    }

    public async Task<MakerGenerationOutcome> GenerateAsync(
        ModelDrivenAppDescriptor application,
        string outputRoot,
        bool customerOwnershipConfirmed,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(application);
        ArgumentException.ThrowIfNullOrWhiteSpace(outputRoot);
        if (package is null || loadedSolution is null)
        {
            throw new InvalidOperationException(
                "Load a solution before generating a target app.");
        }

        if (!loadedSolution.Applications.Any(candidate =>
                candidate.AppModuleId == application.AppModuleId))
        {
            throw new InvalidOperationException(
                "The selected app does not belong to the loaded solution.");
        }

        if (!customerOwnershipConfirmed)
        {
            throw new InvalidOperationException(
                "Explicit customer ownership verification is required before source generation.");
        }

        var publisherOrigins = new Dictionary<string, ComponentOrigin>(
            StringComparer.OrdinalIgnoreCase)
        {
            [loadedSolution.Identity.PublisherUniqueName] =
                ComponentOrigin.CustomerOwned,
        };
        var policy = new SolutionImportPolicy(
            [loadedSolution.Identity.UniqueName],
            publisherOrigins);
        var importer = new DataverseSolutionImporter(
            policy,
            SchemaValidationBehavior.ReportOnly);
        var import = importer.Import(package, application.AppModuleId);
        if (import.Application is null || !import.Succeeded)
        {
            return new(null, import.Issues);
        }

        var folderName = SafeFolderName(application.UniqueName)
            + "-"
            + package.Sha256[..12];
        var generation = await sourceGenerator.GenerateAsync(
            import.Application,
            Path.Combine(Path.GetFullPath(outputRoot), folderName),
            sourceAssets: new PackageSourceAssetProvider(package),
            cancellationToken: cancellationToken);
        return new(generation, import.Issues);
    }

    private static string SafeFolderName(string value)
    {
        var invalid = Path.GetInvalidFileNameChars().ToHashSet();
        var characters = value
            .Select(character => invalid.Contains(character)
                || char.IsWhiteSpace(character)
                    ? '-'
                    : character)
            .ToArray();
        var result = new string(characters).Trim('-', '.');
        return result.Length == 0 ? "generated-app" : result;
    }

    private sealed class PackageSourceAssetProvider(
        SolutionPackage package) : ISourceAssetProvider
    {
        public async ValueTask<ReadOnlyMemory<byte>?> ReadAsync(
            string relativePath,
            CancellationToken cancellationToken = default)
        {
            if (!package.TryGetEntry(relativePath, out var entry)
                || entry is null)
            {
                return null;
            }

            await using var stream = entry.OpenRead();
            using var buffer = new MemoryStream(entry.Length);
            await stream.CopyToAsync(buffer, cancellationToken);
            return buffer.ToArray();
        }
    }
}
