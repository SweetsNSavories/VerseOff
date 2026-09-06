using VerseOff.Domain;

namespace VerseOff.Generator;

public interface INativeSourceGenerator
{
    Task<SourceGenerationResult> GenerateAsync(
        ApplicationDefinition application,
        string outputDirectory,
        SourceGenerationOptions? options = null,
        ISourceAssetProvider? sourceAssets = null,
        CancellationToken cancellationToken = default);
}

public interface ISourceAssetProvider
{
    ValueTask<ReadOnlyMemory<byte>?> ReadAsync(
        string relativePath,
        CancellationToken cancellationToken = default);
}

public sealed record SourceGenerationOptions(
    string TargetFramework,
    string MauiVersion,
    string MicrosoftExtensionsVersion)
{
    public static SourceGenerationOptions Default { get; } = new(
        "net10.0-windows10.0.19041.0",
        "10.0.20",
        "10.0.11");
}

public sealed record GeneratedSourceFile(
    string RelativePath,
    long Length,
    string Sha256);

public sealed record SourceGenerationResult(
    string OutputDirectory,
    string ProjectFile,
    string ManifestFile,
    IReadOnlyList<GeneratedSourceFile> Files);

public sealed record SourceGenerationManifest(
    int ManifestVersion,
    Guid AppModuleId,
    string AppUniqueName,
    string AppDisplayName,
    string SourceHash,
    string TargetFramework,
    string MauiVersion,
    IReadOnlyList<GeneratedSourceFile> Files);
