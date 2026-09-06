using System.Text;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class XmlMetadataValidatorTests
{
    private const string Schema = """
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
          <xs:element name="form">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="tabs" minOccurs="1" maxOccurs="1" />
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:schema>
        """;

    [TestMethod]
    public void ValidDocumentIsLoaded()
    {
        var result = Validate("<form><tabs /></form>");

        Assert.IsTrue(result.IsValid);
        Assert.IsNotNull(result.Document);
        Assert.IsEmpty(result.Issues);
    }

    [TestMethod]
    public void InvalidDocumentReportsSchemaError()
    {
        var result = Validate("<form><body /></form>");

        Assert.IsFalse(result.IsValid);
        Assert.IsNotEmpty(result.Issues);
    }

    [TestMethod]
    public void EmbeddedPublishedSchemasResolveLocalIncludes()
    {
        var catalog = PublishedSchemaCatalog.LoadEmbedded();
        using var document = Stream("<form />");

        var result = catalog.Validate(document, "FormXml.xsd");

        CollectionAssert.Contains(
            catalog.SchemaNames.ToArray(),
            "FormXml.xsd");
        Assert.IsNotNull(result.Document);
    }

    private static MetadataValidationResult Validate(string xml)
    {
        using var document = Stream(xml);
        using var schema = Stream(Schema);
        return XmlMetadataValidator.Validate(document, [schema]);
    }

    private static MemoryStream Stream(string value) =>
        new(Encoding.UTF8.GetBytes(value));
}
