using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using VerseOff.Domain;

namespace VerseOff.Metadata;

/// <summary>
/// Deserializes distribution-ready offline packages back into canonical ApplicationDefinition models.
/// </summary>
public sealed class ApplicationDefinitionDeserializer
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters =
        {
            new JsonStringEnumConverter(),
        },
    };

    public static ApplicationDefinitionDeserializer Instance { get; } = new();

    /// <summary>
    /// Deserializes an ApplicationDefinition from an offline package directory, verifying all checksums.
    /// </summary>
    public static async Task<ApplicationDefinition> DeserializeFromPackageAsync(
        string packageDirectory,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(packageDirectory);

        if (!Directory.Exists(packageDirectory))
        {
            throw new DirectoryNotFoundException($"Package directory '{packageDirectory}' was not found.");
        }

        var manifestPath = Path.Combine(packageDirectory, "manifest.json");
        if (!File.Exists(manifestPath))
        {
            throw new FileNotFoundException("manifest.json was not found in the package root.", manifestPath);
        }

        var manifestJson = await File.ReadAllTextAsync(manifestPath, cancellationToken).ConfigureAwait(false);
        var manifest = JsonSerializer.Deserialize<OfflinePackageManifest>(manifestJson, JsonOptions)
            ?? throw new InvalidDataException("Failed to deserialize manifest.json.");

        // 1. Validate File Checksums
        foreach (var (relativePath, entry) in manifest.Files)
        {
            var fullPath = Path.Combine(packageDirectory, relativePath);
            if (!File.Exists(fullPath))
            {
                throw new FileNotFoundException($"Package file '{relativePath}' declared in manifest was not found on disk.", fullPath);
            }

            var fileBytes = await File.ReadAllBytesAsync(fullPath, cancellationToken).ConfigureAwait(false);
            var actualChecksum = ComputeSha256Hex(fileBytes);

            if (!string.Equals(actualChecksum, entry.Checksum, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidDataException($"Checksum mismatch for '{relativePath}'. Expected: {entry.Checksum}, Actual: {actualChecksum}");
            }
        }

        // 2. Read app.json
        var appJsonPath = Path.Combine(packageDirectory, manifest.ApplicationPath);
        var appJson = await File.ReadAllTextAsync(appJsonPath, cancellationToken).ConfigureAwait(false);
        var appModel = JsonSerializer.Deserialize<ApplicationJsonModel>(appJson, JsonOptions)
            ?? throw new InvalidDataException("Failed to deserialize app.json.");

        // 3. Load Forms from disk
        var forms = new List<FormDefinition>();
        foreach (var formRef in appModel.Forms)
        {
            var formXmlPath = Path.Combine(packageDirectory, formRef.RelativePath);
            var formXml = await File.ReadAllTextAsync(formXmlPath, cancellationToken).ConfigureAwait(false);
            var table = appModel.Tables.FirstOrDefault(t => string.Equals(t.LogicalName, formRef.TableLogicalName, StringComparison.OrdinalIgnoreCase));
            var columns = table?.Columns ?? [];
            var doc = SecureXml.Parse(formXml);
            var formDef = FormXmlParser.Parse(
                doc,
                formRef.FormId,
                formRef.Name,
                formRef.TableLogicalName,
                formRef.FormType,
                formRef.Provenance,
                columns);

            var enriched = formDef with
            {
                Name = formRef.Name,
                Description = formRef.Description,
                IsActive = formRef.IsDefault,
            };

            forms.Add(enriched);
        }

        // 4. Load Views from disk
        var views = new List<ViewDefinition>();
        foreach (var viewRef in appModel.Views)
        {
            var fetchXmlPath = Path.Combine(packageDirectory, viewRef.RelativePath);
            var fetchXml = await File.ReadAllTextAsync(fetchXmlPath, cancellationToken).ConfigureAwait(false);

            var viewDef = new ViewDefinition(
                viewRef.ViewId,
                viewRef.Name,
                viewRef.TableLogicalName,
                fetchXml,
                viewRef.LayoutXml,
                viewRef.IsDefault,
                viewRef.Provenance)
            {
                Columns = viewRef.Columns,
            };

            views.Add(viewDef);
        }

        // 5. Load Navigation (if present)
        IReadOnlyList<NavigationDefinition> navigation = [];
        if (!string.IsNullOrWhiteSpace(manifest.NavigationPath))
        {
            var navPath = Path.Combine(packageDirectory, manifest.NavigationPath);
            if (File.Exists(navPath))
            {
                var navJson = await File.ReadAllTextAsync(navPath, cancellationToken).ConfigureAwait(false);
                navigation = JsonSerializer.Deserialize<IReadOnlyList<NavigationDefinition>>(navJson, JsonOptions) ?? [];
            }
        }

        // 6. Load Offline Profile (if present)
        OfflineProfileDefinition? offlineProfile = null;
        if (!string.IsNullOrWhiteSpace(manifest.OfflineProfilePath))
        {
            var profilePath = Path.Combine(packageDirectory, manifest.OfflineProfilePath);
            if (File.Exists(profilePath))
            {
                var profileJson = await File.ReadAllTextAsync(profilePath, cancellationToken).ConfigureAwait(false);
                offlineProfile = JsonSerializer.Deserialize<OfflineProfileDefinition>(profileJson, JsonOptions);
            }
        }

        // 7. Reconstitute ApplicationDefinition
        return new ApplicationDefinition(
            appModel.AppModuleId,
            appModel.UniqueName,
            appModel.DisplayName,
            appModel.Tables,
            forms,
            navigation,
            appModel.SourceHash)
        {
            SchemaVersion = appModel.SchemaVersion,
            Description = appModel.Description,
            Views = views,
            Commands = appModel.Commands,
            WebResources = appModel.WebResources,
            CodeComponents = appModel.CodeComponents,
            OfflineProfile = offlineProfile,
            Compatibility = appModel.Compatibility,
            BusinessProcessFlows = appModel.BusinessProcessFlows,
        };
    }

    private static string ComputeSha256Hex(byte[] bytes)
    {
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
