using System.Xml;
using System.Xml.Linq;

namespace VerseOff.Metadata;

public sealed record ModelDrivenAppDescriptor(
    Guid AppModuleId,
    string UniqueName,
    string DisplayName,
    string SourcePath,
    IReadOnlySet<string> TableLogicalNames,
    IReadOnlySet<Guid> FormIds);

public sealed record SolutionDiscoveryIssue(
    string SourcePath,
    string Message);

public sealed record SolutionDiscoveryResult(
    IReadOnlyList<ModelDrivenAppDescriptor> Applications,
    IReadOnlyList<SolutionDiscoveryIssue> Issues)
{
    public SolutionIdentity? Identity { get; init; }
}

public static class SolutionDiscoveryService
{
    public static SolutionDiscoveryResult Discover(SolutionPackage package)
    {
        ArgumentNullException.ThrowIfNull(package);

        var applications = new Dictionary<
            Guid,
            ModelDrivenAppDescriptor>();
        var issues = new List<SolutionDiscoveryIssue>();

        foreach (var entry in package.Entries
            .Where(IsApplicationMetadataCandidate)
            .OrderBy(entry => entry.Path, StringComparer.Ordinal))
        {
            XDocument document;
            try
            {
                using var stream = entry.OpenRead();
                document = SecureXml.Load(stream);
            }
            catch (XmlException exception)
            {
                issues.Add(new(entry.Path, exception.Message));
                continue;
            }

            foreach (var appModule in AppModuleElements(document))
            {
                if (!TryReadAppModule(
                        appModule,
                        entry.Path,
                        out var descriptor,
                        out var issue))
                {
                    issues.Add(new(entry.Path, issue));
                    continue;
                }

                applications[descriptor.AppModuleId] = descriptor;
            }
        }

        if (applications.Count == 0)
        {
            issues.Add(new(
                package.SourcePath,
                "No model-driven AppModule metadata was found."));
        }

        return new(
            applications.Values
                .OrderBy(
                    app => app.DisplayName,
                    StringComparer.OrdinalIgnoreCase)
                .ThenBy(app => app.AppModuleId)
                .ToArray(),
            issues)
        {
            Identity = SolutionIdentityReader.Read(package),
        };
    }

    internal static IEnumerable<XElement> AppModuleElements(
        XDocument document)
    {
        if (document.Root is not null
            && string.Equals(
                document.Root.Name.LocalName,
                "AppModule",
                StringComparison.OrdinalIgnoreCase))
        {
            yield return document.Root;
        }

        foreach (var element in document.DescendantsNamed("AppModule"))
        {
            yield return element;
        }
    }

    private static bool IsApplicationMetadataCandidate(
        SolutionPackageEntry entry)
    {
        if (!entry.Path.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        return entry.Path.EndsWith(
                "customizations.xml",
                StringComparison.OrdinalIgnoreCase)
            || entry.Path.Contains(
                "AppModule",
                StringComparison.OrdinalIgnoreCase);
    }

    private static bool TryReadAppModule(
        XElement appModule,
        string sourcePath,
        out ModelDrivenAppDescriptor descriptor,
        out string issue)
    {
        var idValue = FirstValue(
            appModule,
            "AppModuleId",
            "AppId",
            "id");
        if (!TryParseGuid(idValue, out var appModuleId))
        {
            appModuleId = GuidFromPath(sourcePath);
        }

        var uniqueName = FirstValue(
            appModule,
            "UniqueName",
            "uniquename",
            "Name");
        if (appModuleId == Guid.Empty || string.IsNullOrWhiteSpace(uniqueName))
        {
            descriptor = null!;
            issue =
                "An AppModule requires a valid app ID and unique name.";
            return false;
        }

        var displayName = LocalizedLabel(appModule)
            ?? FirstValue(appModule, "DisplayName", "LocalizedName")
            ?? uniqueName;
        var tableNames = new HashSet<string>(
            StringComparer.OrdinalIgnoreCase);
        var formIds = new HashSet<Guid>();

        foreach (var component in appModule
            .DescendantsNamed("AppModuleComponent"))
        {
            var componentType = FirstValue(component, "type", "ComponentType");
            var schemaName = FirstValue(
                component,
                "schemaName",
                "SchemaName",
                "LogicalName");
            if (componentType is "1"
                && !string.IsNullOrWhiteSpace(schemaName))
            {
                tableNames.Add(schemaName.ToLowerInvariant());
            }

            if (componentType is "60"
                && TryParseGuid(
                    FirstValue(component, "id", "ObjectId"),
                    out var formId))
            {
                formIds.Add(formId);
            }
        }

        descriptor = new(
            appModuleId,
            uniqueName,
            displayName,
            sourcePath,
            tableNames,
            formIds);
        issue = string.Empty;
        return true;
    }

    internal static string? FirstValue(
        XElement element,
        params string[] names)
    {
        foreach (var name in names)
        {
            var value = element.AttributeValue(name)
                ?? element.ChildValue(name);
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value.Trim();
            }
        }

        return null;
    }

    internal static string? LocalizedLabel(XElement element)
    {
        var label = element.DescendantsNamed("LocalizedName")
            .Select(node => node.AttributeValue("description")
                ?? node.AttributeValue("Description")
                ?? node.Value)
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));
        if (!string.IsNullOrWhiteSpace(label))
        {
            return label.Trim();
        }

        return element.DescendantsNamed("label")
            .Select(node => node.AttributeValue("description"))
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));
    }

    internal static bool TryParseGuid(string? value, out Guid result) =>
        Guid.TryParse(value?.Trim().Trim('{', '}'), out result);

    private static Guid GuidFromPath(string path)
    {
        foreach (var segment in path.Split(
            ['/', '\\', '.', '_'],
            StringSplitOptions.RemoveEmptyEntries))
        {
            if (TryParseGuid(segment, out var result))
            {
                return result;
            }
        }

        return Guid.Empty;
    }
}
