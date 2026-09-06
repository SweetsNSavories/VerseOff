using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using VerseOff.Domain;

namespace VerseOff.Generator;

public sealed class NativeSourceGenerator : INativeSourceGenerator
{
    private static readonly JsonSerializerOptions DefinitionJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
        Converters =
        {
            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase),
        },
    };

    private static readonly JsonSerializerOptions ManifestJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
    };

    public async Task<SourceGenerationResult> GenerateAsync(
        ApplicationDefinition application,
        string outputDirectory,
        SourceGenerationOptions? options = null,
        ISourceAssetProvider? sourceAssets = null,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(application);
        ArgumentException.ThrowIfNullOrWhiteSpace(outputDirectory);
        options ??= SourceGenerationOptions.Default;
        ValidateOptions(options);

        var validation = ApplicationDefinitionValidator.Validate(application);
        if (!validation.IsValid)
        {
            throw new InvalidOperationException(
                "The target source cannot be generated because the canonical app model is invalid: "
                + string.Join(
                    "; ",
                    validation.Issues.Select(issue => issue.Message)));
        }

        if (!application.Compatibility.CanActivate)
        {
            throw new InvalidOperationException(
                "The target source cannot be generated while compatibility contains blocking issues.");
        }

        var outputPath = Path.GetFullPath(outputDirectory);
        ValidateOutputPath(outputPath);
        if (Directory.Exists(outputPath)
            || File.Exists(outputPath))
        {
            throw new IOException(
                $"Generation output '{outputPath}' already exists. VerseOff does not overwrite source trees.");
        }

        var parent = Directory.GetParent(outputPath)
            ?? throw new InvalidOperationException(
                "The generation output must have a parent directory.");
        Directory.CreateDirectory(parent.FullName);
        var stagingPath = Path.Combine(
            parent.FullName,
            $".verseoff-staging-{Guid.NewGuid():N}");
        Directory.CreateDirectory(stagingPath);

        try
        {
            var projectName = ProjectIdentifier(application.UniqueName);
            var namespaceName = $"{projectName}.Generated";
            var definitionJson = JsonSerializer.Serialize(
                application,
                DefinitionJsonOptions);
            var files = TargetSourceTemplates.Create(
                application,
                projectName,
                namespaceName,
                options,
                definitionJson);
            var generatedFiles = new List<GeneratedSourceFile>();

            foreach (var file in files.OrderBy(
                file => file.RelativePath,
                StringComparer.Ordinal))
            {
                cancellationToken.ThrowIfCancellationRequested();
                var generated = await WriteFileAsync(
                    stagingPath,
                    file,
                    cancellationToken);
                generatedFiles.Add(generated);
            }

            foreach (var asset in await LoadApprovedAssetsAsync(
                application,
                sourceAssets,
                cancellationToken))
            {
                generatedFiles.Add(await WriteFileAsync(
                    stagingPath,
                    asset,
                    cancellationToken));
            }

            var manifest = new SourceGenerationManifest(
                ManifestVersion: 1,
                application.AppModuleId,
                application.UniqueName,
                application.DisplayName,
                application.SourceHash,
                options.TargetFramework,
                options.MauiVersion,
                generatedFiles);
            var manifestJson = JsonSerializer.Serialize(
                manifest,
                ManifestJsonOptions);
            var manifestFile = await WriteFileAsync(
                stagingPath,
                new(
                    "generation-manifest.json",
                    manifestJson + Environment.NewLine),
                cancellationToken);
            generatedFiles.Add(manifestFile);

            Directory.Move(stagingPath, outputPath);
            return new(
                outputPath,
                Path.Combine(outputPath, $"{projectName}.csproj"),
                Path.Combine(outputPath, manifestFile.RelativePath),
                generatedFiles);
        }
        catch
        {
            if (Directory.Exists(stagingPath))
            {
                Directory.Delete(stagingPath, recursive: true);
            }

            throw;
        }
    }

    private static async Task<GeneratedSourceFile> WriteFileAsync(
        string stagingPath,
        TargetSourceFile file,
        CancellationToken cancellationToken)
    {
        var relativePath = NormalizeRelativePath(file.RelativePath);
        var destination = Path.GetFullPath(
            Path.Combine(stagingPath, relativePath));
        var root = Path.GetFullPath(stagingPath)
            .TrimEnd(Path.DirectorySeparatorChar)
            + Path.DirectorySeparatorChar;
        if (!destination.StartsWith(root, StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidDataException(
                $"Generated path '{relativePath}' escapes the staging directory.");
        }

        var directory = Path.GetDirectoryName(destination);
        if (directory is not null)
        {
            Directory.CreateDirectory(directory);
        }

        var content = file.BinaryContent
            ?? Encoding.UTF8.GetBytes(
                file.Content!.ReplaceLineEndings("\n"));
        await File.WriteAllBytesAsync(
            destination,
            content,
            cancellationToken);
        return new(
            relativePath.Replace('\\', '/'),
            content.LongLength,
            Convert.ToHexString(SHA256.HashData(content)).ToLowerInvariant());
    }

    private static async Task<IReadOnlyList<TargetSourceFile>>
        LoadApprovedAssetsAsync(
            ApplicationDefinition application,
            ISourceAssetProvider? sourceAssets,
            CancellationToken cancellationToken)
    {
        var requested = new List<ApprovedAsset>();
        foreach (var resource in application.WebResources)
        {
            var decision = CleanRoomComponentPolicy.Evaluate(
                resource.Provenance);
            if (decision.Disposition
                is not ComponentDisposition.CustomerExecutable)
            {
                continue;
            }

            requested.Add(new(
                resource.RelativePath,
                $"CustomerAssets/WebResources/{SafeAssetPath(resource.Name)}",
                resource.Sha256));
        }

        foreach (var component in application.CodeComponents)
        {
            var decision = CleanRoomComponentPolicy.Evaluate(
                component.Provenance);
            if (decision.Disposition
                    is not ComponentDisposition.CustomerExecutable
                || component.SourceManifestPath is null)
            {
                continue;
            }

            var componentFolder = "CustomerAssets/CodeComponents/"
                + SafeAssetPath($"{component.Namespace}.{component.Name}");
            requested.Add(new(
                component.SourceManifestPath,
                $"{componentFolder}/ControlManifest.Input.xml",
                component.Provenance.Sha256));
            var sourceDirectory = Path.GetDirectoryName(
                    component.SourceManifestPath.Replace('/', '\\'))
                ?.Replace('\\', '/')
                ?? string.Empty;
            foreach (var resourceName in component.ResourceNames)
            {
                var sourcePath = sourceDirectory.Length == 0
                    ? resourceName
                    : $"{sourceDirectory}/{resourceName}";
                requested.Add(new(
                    sourcePath,
                    $"{componentFolder}/{SafeAssetPath(resourceName)}",
                    ExpectedHash: null));
            }
        }

        if (requested.Count == 0)
        {
            return [];
        }

        if (sourceAssets is null)
        {
            throw new InvalidOperationException(
                "Approved customer assets are required, but no source-asset provider was supplied.");
        }

        var files = new List<TargetSourceFile>();
        foreach (var asset in requested
            .DistinctBy(asset => asset.OutputPath)
            .OrderBy(asset => asset.OutputPath, StringComparer.Ordinal))
        {
            var content = await sourceAssets.ReadAsync(
                asset.SourcePath,
                cancellationToken);
            if (content is null)
            {
                throw new FileNotFoundException(
                    $"Approved customer asset '{asset.SourcePath}' is missing.",
                    asset.SourcePath);
            }

            if (asset.ExpectedHash is not null)
            {
                var actualHash = Convert.ToHexString(
                        SHA256.HashData(content.Value.Span))
                    .ToLowerInvariant();
                if (!string.Equals(
                        actualHash,
                        asset.ExpectedHash,
                        StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidDataException(
                        $"Approved customer asset '{asset.SourcePath}' failed SHA-256 verification.");
                }
            }

            files.Add(new(
                asset.OutputPath,
                content.Value.ToArray()));
        }

        return files;
    }

    private static string SafeAssetPath(string path)
    {
        var segments = path
            .Replace('\\', '/')
            .Split(
                '/',
                StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0
            || segments.Any(segment => segment is "." or ".."))
        {
            throw new InvalidDataException(
                $"Customer asset path '{path}' is unsafe.");
        }

        return string.Join(
            '/',
            segments.Select(segment => string.Concat(
                segment.Select(character =>
                    char.IsAsciiLetterOrDigit(character)
                    || character is '.' or '_' or '-'
                        ? character
                        : '_'))));
    }

    private static string NormalizeRelativePath(string path)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        if (Path.IsPathRooted(path))
        {
            throw new InvalidDataException(
                $"Generated path '{path}' must be relative.");
        }

        var segments = path
            .Replace('\\', '/')
            .Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length == 0
            || segments.Any(segment => segment is "." or ".."))
        {
            throw new InvalidDataException(
                $"Generated path '{path}' is unsafe.");
        }

        return Path.Combine(segments);
    }

    private static void ValidateOutputPath(string path)
    {
        var root = Path.GetPathRoot(path);
        if (string.Equals(
                path.TrimEnd(Path.DirectorySeparatorChar),
                root?.TrimEnd(Path.DirectorySeparatorChar),
                StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "The generated source cannot target a filesystem root.",
                nameof(path));
        }
    }

    private static void ValidateOptions(SourceGenerationOptions options)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(options.TargetFramework);
        ArgumentException.ThrowIfNullOrWhiteSpace(options.MauiVersion);
        ArgumentException.ThrowIfNullOrWhiteSpace(
            options.MicrosoftExtensionsVersion);
    }

    private static string Identifier(string value)
    {
        var builder = new StringBuilder(value.Length);
        foreach (var character in value)
        {
            builder.Append(char.IsAsciiLetterOrDigit(character)
                || character == '_'
                    ? character
                    : '_');
        }

        if (builder.Length == 0
            || !char.IsAsciiLetter(builder[0])
            && builder[0] != '_')
        {
            builder.Insert(0, "App_");
        }

        return builder.ToString();
    }

    private static string ProjectIdentifier(string value)
    {
        var identifier = Identifier(value);
        var result = string.Concat(
            identifier.Split(
                    '_',
                    StringSplitOptions.RemoveEmptyEntries)
                .Select(segment => char.ToUpperInvariant(segment[0])
                    + segment[1..]));
        return result.Length == 0 ? "GeneratedApp" : result;
    }

    private sealed record ApprovedAsset(
        string SourcePath,
        string OutputPath,
        string? ExpectedHash);
}
