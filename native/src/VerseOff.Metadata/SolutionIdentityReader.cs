using System.Xml;
using System.Xml.Linq;

namespace VerseOff.Metadata;

public static class SolutionIdentityReader
{
    public static SolutionIdentity? Read(SolutionPackage package)
    {
        ArgumentNullException.ThrowIfNull(package);
        XmlException? firstFailure = null;

        foreach (var entry in package.Entries
            .Where(entry => entry.Path.EndsWith(
                "solution.xml",
                StringComparison.OrdinalIgnoreCase)
                || entry.Path.EndsWith(
                    "customizations.xml",
                    StringComparison.OrdinalIgnoreCase))
            .OrderBy(entry => entry.Path, StringComparer.Ordinal))
        {
            try
            {
                using var stream = entry.OpenRead();
                var identity = Read(SecureXml.Load(stream));
                if (identity is not null)
                {
                    return identity;
                }
            }
            catch (XmlException exception)
            {
                firstFailure ??= exception;
            }
        }

        if (firstFailure is not null)
        {
            throw new InvalidDataException(
                "Solution identity XML is malformed.",
                firstFailure);
        }

        return null;
    }

    internal static SolutionIdentity? Read(XDocument document)
    {
        ArgumentNullException.ThrowIfNull(document);

        var manifest = document.Root is not null
            && string.Equals(
                document.Root.Name.LocalName,
                "SolutionManifest",
                StringComparison.OrdinalIgnoreCase)
                ? document.Root
                : document.DescendantsNamed("SolutionManifest")
                    .FirstOrDefault();
        if (manifest is null)
        {
            return null;
        }

        var uniqueName = SolutionDiscoveryService.FirstValue(
            manifest,
            "UniqueName");
        var version = SolutionDiscoveryService.FirstValue(
            manifest,
            "Version") ?? "0.0.0.0";
        var publisher = manifest.ElementNamed("Publisher");
        var publisherName = publisher is null
            ? null
            : SolutionDiscoveryService.FirstValue(
                publisher,
                "UniqueName");
        if (string.IsNullOrWhiteSpace(uniqueName)
            || string.IsNullOrWhiteSpace(publisherName))
        {
            return null;
        }

        return new(
            uniqueName,
            publisherName,
            version,
            ParseBoolean(
                SolutionDiscoveryService.FirstValue(manifest, "Managed")));
    }

    private static bool ParseBoolean(string? value) =>
        value?.Trim().ToUpperInvariant() is "1" or "TRUE" or "YES";
}
