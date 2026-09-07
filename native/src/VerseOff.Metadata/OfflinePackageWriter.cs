using System.IO.Compression;
using VerseOff.Domain;

namespace VerseOff.Metadata;

/// <summary>
/// Compression metrics resulting from archiving an offline package.
/// </summary>
public sealed record PackageCompressionResult(
    string PackageDirectory,
    string ArchivePath,
    long UncompressedSizeBytes,
    long CompressedSizeBytes,
    double CompressionRatio);

/// <summary>
/// Packages and compresses VerseOff offline metadata into distributable archives.
/// </summary>
public sealed class OfflinePackageWriter
{
    private readonly ApplicationDefinitionSerializer serializer;

    public OfflinePackageWriter(ApplicationDefinitionSerializer? serializer = null)
    {
        this.serializer = serializer ?? ApplicationDefinitionSerializer.Instance;
    }

    public static OfflinePackageWriter Instance { get; } = new();

    /// <summary>
    /// Writes the application definition directly to a structured package directory.
    /// </summary>
    public static Task<OfflinePackageManifest> WritePackageDirectoryAsync(
        ApplicationDefinition app,
        string outputDirectory,
        CancellationToken cancellationToken = default)
    {
        return ApplicationDefinitionSerializer.SerializeToPackageAsync(app, outputDirectory, cancellationToken);
    }

    /// <summary>
    /// Serializes the application definition and compresses it into a distribution .zip archive.
    /// </summary>
    public static async Task<PackageCompressionResult> WriteCompressedPackageAsync(
        ApplicationDefinition app,
        string outputZipPath,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(app);
        ArgumentException.ThrowIfNullOrWhiteSpace(outputZipPath);

        var tempDir = Path.Combine(
            Path.GetTempPath(),
            $"verseoff-pkg-{Guid.NewGuid():N}");

        try
        {
            var manifest = await ApplicationDefinitionSerializer.SerializeToPackageAsync(app, tempDir, cancellationToken).ConfigureAwait(false);

            var parent = Path.GetDirectoryName(outputZipPath);
            if (!string.IsNullOrWhiteSpace(parent))
            {
                Directory.CreateDirectory(parent);
            }

            if (File.Exists(outputZipPath))
            {
                File.Delete(outputZipPath);
            }

            ZipFile.CreateFromDirectory(
                tempDir,
                outputZipPath,
                CompressionLevel.Optimal,
                includeBaseDirectory: false);

            var compressedSize = new FileInfo(outputZipPath).Length;
            var uncompressedSize = manifest.TotalSizeBytes;
            var ratio = uncompressedSize > 0
                ? (double)uncompressedSize / Math.Max(1, compressedSize)
                : 1.0;

            return new PackageCompressionResult(
                PackageDirectory: tempDir,
                ArchivePath: outputZipPath,
                UncompressedSizeBytes: uncompressedSize,
                CompressedSizeBytes: compressedSize,
                CompressionRatio: ratio);
        }
        finally
        {
            try
            {
                if (Directory.Exists(tempDir))
                {
                    Directory.Delete(tempDir, recursive: true);
                }
            }
            catch (IOException)
            {
                // Best-effort cleanup on Windows where newly compressed files may briefly be released
            }
        }
    }
}
