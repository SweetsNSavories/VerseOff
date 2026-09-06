using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;

namespace VerseOff.Metadata;

public sealed record MetadataValidationIssue(
    XmlSeverityType Severity,
    string Message,
    int LineNumber,
    int LinePosition);

public sealed record MetadataValidationResult(
    bool IsValid,
    XDocument? Document,
    IReadOnlyList<MetadataValidationIssue> Issues);

public static class XmlMetadataValidator
{
    public static MetadataValidationResult Validate(
        Stream xml,
        IEnumerable<Stream> schemas)
    {
        ArgumentNullException.ThrowIfNull(xml);
        ArgumentNullException.ThrowIfNull(schemas);

        var schemaSet = new XmlSchemaSet();

        foreach (var schema in schemas)
        {
            schemaSet.Add(null, XmlReader.Create(
                schema,
                new XmlReaderSettings
                {
                    DtdProcessing = DtdProcessing.Prohibit,
                    XmlResolver = null,
                }));
        }

        return Validate(xml, schemaSet);
    }

    public static MetadataValidationResult Validate(
        Stream xml,
        XmlSchemaSet schemaSet,
        IEnumerable<MetadataValidationIssue>? initialIssues = null)
    {
        ArgumentNullException.ThrowIfNull(xml);
        ArgumentNullException.ThrowIfNull(schemaSet);

        var issues = initialIssues?.ToList()
            ?? [];
        var settings = new XmlReaderSettings
        {
            DtdProcessing = DtdProcessing.Prohibit,
            IgnoreComments = false,
            IgnoreWhitespace = false,
            Schemas = schemaSet,
            ValidationType = ValidationType.Schema,
            XmlResolver = null,
        };
        settings.ValidationFlags |= XmlSchemaValidationFlags.ReportValidationWarnings;
        settings.ValidationEventHandler += (_, args) =>
        {
            var exception = args.Exception;
            issues.Add(new(
                args.Severity,
                args.Message,
                exception?.LineNumber ?? 0,
                exception?.LinePosition ?? 0));
        };

        try
        {
            using var reader = XmlReader.Create(xml, settings);
            var document = XDocument.Load(
                reader,
                LoadOptions.PreserveWhitespace | LoadOptions.SetLineInfo);
            return new(
                issues.All(issue => issue.Severity != XmlSeverityType.Error),
                document,
                issues);
        }
        catch (XmlException exception)
        {
            issues.Add(new(
                XmlSeverityType.Error,
                exception.Message,
                exception.LineNumber,
                exception.LinePosition));
            return new(false, null, issues);
        }
        catch (XmlSchemaException exception)
        {
            issues.Add(new(
                XmlSeverityType.Error,
                exception.Message,
                exception.LineNumber,
                exception.LinePosition));
            return new(false, null, issues);
        }
    }
}
