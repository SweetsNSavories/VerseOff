using System.Net;
using System.Reflection;
using System.Xml;
using System.Xml.Schema;

namespace VerseOff.Metadata;

public sealed class PublishedSchemaCatalog
{
    private const string ResourcePrefix = "VerseOff.Metadata.Schemas.";
    private const string SchemaBaseUri = "https://schemas.verseoff.local/";
    private readonly Dictionary<string, byte[]> schemas;
    private static readonly Lazy<PublishedSchemaCatalog> EmbeddedCatalog =
        new(LoadEmbedded);

    private PublishedSchemaCatalog(Dictionary<string, byte[]> schemas)
    {
        this.schemas = schemas;
    }

    public static PublishedSchemaCatalog LoadEmbedded()
    {
        var assembly = typeof(PublishedSchemaCatalog).Assembly;
        var schemas = new Dictionary<string, byte[]>(
            StringComparer.OrdinalIgnoreCase);

        foreach (var resourceName in assembly
            .GetManifestResourceNames()
            .Where(name => name.StartsWith(
                ResourcePrefix,
                StringComparison.Ordinal)
                && name.EndsWith(".xsd", StringComparison.OrdinalIgnoreCase)))
        {
            var fileName = resourceName[ResourcePrefix.Length..];
            using var stream = assembly.GetManifestResourceStream(resourceName)
                ?? throw new InvalidOperationException(
                    $"Embedded schema '{resourceName}' cannot be opened.");
            using var buffer = new MemoryStream();
            stream.CopyTo(buffer);
            schemas.Add(fileName, buffer.ToArray());
        }

        if (schemas.Count == 0)
        {
            throw new InvalidOperationException(
                "No published Dataverse XSD resources are embedded.");
        }

        return new(schemas);
    }

    public static PublishedSchemaCatalog Default => EmbeddedCatalog.Value;

    public IReadOnlyCollection<string> SchemaNames => schemas.Keys;

    public MetadataValidationResult Validate(
        Stream xml,
        string rootSchemaFile)
    {
        ArgumentNullException.ThrowIfNull(xml);
        ArgumentException.ThrowIfNullOrWhiteSpace(rootSchemaFile);

        if (!schemas.TryGetValue(rootSchemaFile, out var rootSchema))
        {
            throw new KeyNotFoundException(
                $"Published schema '{rootSchemaFile}' is not available.");
        }

        var issues = new List<MetadataValidationIssue>();
        var resolver = new EmbeddedSchemaResolver(schemas);
        var schemaSet = new XmlSchemaSet
        {
            XmlResolver = resolver,
        };
        schemaSet.ValidationEventHandler += (_, args) =>
        {
            var exception = args.Exception;
            issues.Add(new(
                args.Severity,
                args.Message,
                exception?.LineNumber ?? 0,
                exception?.LinePosition ?? 0));
        };

        using (var stream = new MemoryStream(rootSchema, writable: false))
        using (var reader = XmlReader.Create(
            stream,
            new XmlReaderSettings
            {
                DtdProcessing = DtdProcessing.Prohibit,
                XmlResolver = resolver,
            },
            new Uri(SchemaBaseUri, UriKind.Absolute)
                .Combine(rootSchemaFile)
                .AbsoluteUri))
        {
            schemaSet.Add(null, reader);
            schemaSet.Compile();
        }

        return XmlMetadataValidator.Validate(xml, schemaSet, issues);
    }

    private sealed class EmbeddedSchemaResolver(
        IReadOnlyDictionary<string, byte[]> schemas) : XmlResolver
    {
        public override ICredentials Credentials
        {
            set => throw new NotSupportedException(
                "Credentials are not supported by the embedded schema resolver.");
        }

        public override object GetEntity(
            Uri absoluteUri,
            string? role,
            Type? ofObjectToReturn)
        {
            ArgumentNullException.ThrowIfNull(absoluteUri);
            if (ofObjectToReturn is not null
                && ofObjectToReturn != typeof(Stream))
            {
                throw new XmlException(
                    "Only embedded schema streams can be resolved.");
            }

            var fileName = Uri.UnescapeDataString(
                absoluteUri.Segments[^1]);
            return schemas.TryGetValue(fileName, out var content)
                ? new MemoryStream(content, writable: false)
                : throw new XmlException(
                    $"Schema include '{fileName}' is not allowlisted.");
        }
    }
}

internal static class UriExtensions
{
    public static Uri Combine(this Uri baseUri, string relativePath) =>
        new(baseUri, relativePath);
}
