namespace VerseOff.Metadata;

/// <summary>
/// Metadata for an individual file in an offline package.
/// </summary>
public sealed record PackageFileEntry(
    string Checksum,
    long SizeBytes);

/// <summary>
/// Top-level manifest for a distribution-ready VerseOff offline package.
/// </summary>
public sealed record OfflinePackageManifest(
    string ManifestVersion,
    string SchemaVersion,
    Guid AppId,
    string UniqueName,
    string DisplayName,
    string Version,
    string Checksum,
    long TotalSizeBytes,
    DateTimeOffset CreatedAt,
    IReadOnlyList<string> SupportedD365Versions,
    string ApplicationPath,
    string? NavigationPath,
    string? OfflineProfilePath,
    IReadOnlyDictionary<string, PackageFileEntry> Files);
