using System.Buffers.Binary;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;

namespace VerseOff.Metadata;

public sealed record SolutionPackageLimits(
    int MaximumEntryCount,
    long MaximumEntryBytes,
    long MaximumTotalBytes)
{
    public static SolutionPackageLimits Default { get; } = new(
        MaximumEntryCount: 10_000,
        MaximumEntryBytes: 32L * 1024 * 1024,
        MaximumTotalBytes: 512L * 1024 * 1024);

    public void Validate()
    {
        if (MaximumEntryCount <= 0
            || MaximumEntryBytes <= 0
            || MaximumEntryBytes > int.MaxValue
            || MaximumTotalBytes < MaximumEntryBytes)
        {
            throw new ArgumentOutOfRangeException(
                nameof(MaximumEntryBytes),
                "Solution-package limits must be positive, internally consistent, and memory-safe.");
        }
    }
}

public sealed class SolutionPackageEntry
{
    private readonly byte[] content;

    internal SolutionPackageEntry(string path, byte[] content)
    {
        Path = path;
        this.content = content;
    }

    public string Path { get; }

    public int Length => content.Length;

    public Stream OpenRead() => new MemoryStream(
        content,
        index: 0,
        count: content.Length,
        writable: false,
        publiclyVisible: false);

    public string ReadText() => Encoding.UTF8.GetString(content);

    internal ReadOnlySpan<byte> Content => content;
}

public sealed class SolutionPackage
{
    private readonly Dictionary<string, SolutionPackageEntry> entries;

    private SolutionPackage(
        string sourcePath,
        Dictionary<string, SolutionPackageEntry> entries,
        string sha256)
    {
        SourcePath = sourcePath;
        this.entries = entries;
        Sha256 = sha256;
    }

    public string SourcePath { get; }

    public string Sha256 { get; }

    public IReadOnlyCollection<SolutionPackageEntry> Entries =>
        entries.Values;

    public bool TryGetEntry(
        string path,
        out SolutionPackageEntry? entry)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        return entries.TryGetValue(NormalizeEntryPath(path), out entry);
    }

    public SolutionPackageEntry GetRequiredEntry(string path) =>
        TryGetEntry(path, out var entry)
            ? entry!
            : throw new FileNotFoundException(
                $"The solution package does not contain '{path}'.",
                path);

    public static async Task<SolutionPackage> LoadAsync(
        string path,
        SolutionPackageLimits? limits = null,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        limits ??= SolutionPackageLimits.Default;
        limits.Validate();

        var fullPath = Path.GetFullPath(path);
        var entries = Directory.Exists(fullPath)
            ? await LoadDirectoryAsync(fullPath, limits, cancellationToken)
            : File.Exists(fullPath)
                ? await LoadArchiveAsync(fullPath, limits, cancellationToken)
                : throw new FileNotFoundException(
                    "The solution directory or ZIP package was not found.",
                    fullPath);

        return new(
            fullPath,
            entries,
            CalculatePackageHash(entries.Values));
    }

    internal static string NormalizeEntryPath(string path)
    {
        var normalized = path.Replace('\\', '/').Trim();
        if (normalized.Length == 0
            || normalized[0] == '/'
            || Path.IsPathRooted(normalized))
        {
            throw new InvalidDataException(
                $"Unsafe solution-package path '{path}'.");
        }

        var segments = normalized.Split(
            '/',
            StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0
            || segments.Any(segment => segment is "." or ".."))
        {
            throw new InvalidDataException(
                $"Unsafe solution-package path '{path}'.");
        }

        return string.Join('/', segments);
    }

    private static async Task<Dictionary<string, SolutionPackageEntry>>
        LoadDirectoryAsync(
            string directoryPath,
            SolutionPackageLimits limits,
            CancellationToken cancellationToken)
    {
        var entries = NewEntryDictionary();
        var options = new EnumerationOptions
        {
            AttributesToSkip = FileAttributes.ReparsePoint,
            IgnoreInaccessible = false,
            RecurseSubdirectories = true,
            ReturnSpecialDirectories = false,
        };
        long totalBytes = 0;

        foreach (var filePath in Directory.EnumerateFiles(
            directoryPath,
            "*",
            options))
        {
            cancellationToken.ThrowIfCancellationRequested();
            EnforceEntryCount(entries.Count + 1, limits);

            var relativePath = NormalizeEntryPath(
                Path.GetRelativePath(directoryPath, filePath));
            var length = new FileInfo(filePath).Length;
            EnforceLength(relativePath, length, totalBytes, limits);

            await using var stream = new FileStream(
                filePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read,
                bufferSize: 81920,
                FileOptions.Asynchronous | FileOptions.SequentialScan);
            var content = await ReadBoundedAsync(
                stream,
                relativePath,
                limits.MaximumEntryBytes,
                cancellationToken);
            AddEntry(entries, relativePath, content);
            totalBytes += content.LongLength;
            EnforceTotal(totalBytes, limits);
        }

        return entries;
    }

    private static async Task<Dictionary<string, SolutionPackageEntry>>
        LoadArchiveAsync(
            string archivePath,
            SolutionPackageLimits limits,
            CancellationToken cancellationToken)
    {
        if (!string.Equals(
                Path.GetExtension(archivePath),
                ".zip",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidDataException(
                "Only an unpacked solution directory or a .zip solution package is supported.");
        }

        var entries = NewEntryDictionary();
        long totalBytes = 0;
        await using var file = new FileStream(
            archivePath,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            bufferSize: 81920,
            FileOptions.Asynchronous | FileOptions.SequentialScan);
        using var archive = new ZipArchive(
            file,
            ZipArchiveMode.Read,
            leaveOpen: false);

        foreach (var archiveEntry in archive.Entries)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (string.IsNullOrEmpty(archiveEntry.Name))
            {
                continue;
            }

            EnforceEntryCount(entries.Count + 1, limits);
            var relativePath = NormalizeEntryPath(archiveEntry.FullName);
            EnforceLength(
                relativePath,
                archiveEntry.Length,
                totalBytes,
                limits);

            await using var stream = archiveEntry.Open();
            var content = await ReadBoundedAsync(
                stream,
                relativePath,
                limits.MaximumEntryBytes,
                cancellationToken);
            AddEntry(entries, relativePath, content);
            totalBytes += content.LongLength;
            EnforceTotal(totalBytes, limits);
        }

        return entries;
    }

    private static Dictionary<string, SolutionPackageEntry>
        NewEntryDictionary() =>
        new(StringComparer.OrdinalIgnoreCase);

    private static void AddEntry(
        Dictionary<string, SolutionPackageEntry> entries,
        string path,
        byte[] content)
    {
        if (!entries.TryAdd(path, new(path, content)))
        {
            throw new InvalidDataException(
                $"The solution package contains duplicate path '{path}'.");
        }
    }

    private static async Task<byte[]> ReadBoundedAsync(
        Stream source,
        string path,
        long maximumBytes,
        CancellationToken cancellationToken)
    {
        using var destination = new MemoryStream();
        var buffer = new byte[81920];
        while (true)
        {
            var read = await source.ReadAsync(buffer, cancellationToken);
            if (read == 0)
            {
                return destination.ToArray();
            }

            if (destination.Length + read > maximumBytes)
            {
                throw new InvalidDataException(
                    $"Solution-package entry '{path}' exceeds the configured size limit.");
            }

            await destination.WriteAsync(
                buffer.AsMemory(0, read),
                cancellationToken);
        }
    }

    private static void EnforceEntryCount(
        int count,
        SolutionPackageLimits limits)
    {
        if (count > limits.MaximumEntryCount)
        {
            throw new InvalidDataException(
                "The solution package exceeds the configured entry-count limit.");
        }
    }

    private static void EnforceLength(
        string path,
        long entryBytes,
        long currentTotal,
        SolutionPackageLimits limits)
    {
        if (entryBytes < 0 || entryBytes > limits.MaximumEntryBytes)
        {
            throw new InvalidDataException(
                $"Solution-package entry '{path}' exceeds the configured size limit.");
        }

        if (entryBytes > limits.MaximumTotalBytes - currentTotal)
        {
            throw new InvalidDataException(
                "The solution package exceeds the configured total-size limit.");
        }
    }

    private static void EnforceTotal(
        long totalBytes,
        SolutionPackageLimits limits)
    {
        if (totalBytes > limits.MaximumTotalBytes)
        {
            throw new InvalidDataException(
                "The solution package exceeds the configured total-size limit.");
        }
    }

    private static string CalculatePackageHash(
        IEnumerable<SolutionPackageEntry> entries)
    {
        using var hash = IncrementalHash.CreateHash(HashAlgorithmName.SHA256);
        Span<byte> lengthBytes = stackalloc byte[sizeof(int)];

        foreach (var entry in entries.OrderBy(
            entry => entry.Path,
            StringComparer.Ordinal))
        {
            var pathBytes = Encoding.UTF8.GetBytes(entry.Path);
            BinaryPrimitives.WriteInt32BigEndian(lengthBytes, pathBytes.Length);
            hash.AppendData(lengthBytes);
            hash.AppendData(pathBytes);
            BinaryPrimitives.WriteInt32BigEndian(
                lengthBytes,
                entry.Content.Length);
            hash.AppendData(lengthBytes);
            hash.AppendData(entry.Content);
        }

        return Convert.ToHexString(hash.GetHashAndReset())
            .ToLowerInvariant();
    }
}
