using System.Collections.Generic;
using System.IO;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;

namespace VerseOff.Metadata;

/// <summary>
/// Loads and manages all available XSD schemas for Dataverse metadata validation.
/// Acts as the source of truth for allowed elements, attributes, and structures.
/// If XSD is missing, generates a skeleton based on Microsoft patterns.
/// </summary>
public sealed class SchemaRegistry
{
    private readonly Dictionary<string, XmlSchema> schemas = new();
    private readonly string schemaDirectory;

    public SchemaRegistry(string? schemaDirectory = null)
    {
        this.schemaDirectory = schemaDirectory 
            ?? Path.Combine(
                Path.GetDirectoryName(typeof(SchemaRegistry).Assembly.Location) ?? "",
                "schemas");
    }

    /// <summary>
    /// Loads all XSD files from the schema directory.
    /// </summary>
    public void LoadAllSchemas()
    {
        if (!Directory.Exists(schemaDirectory))
        {
            System.Diagnostics.Debug.WriteLine(
                $"Schema directory not found: {schemaDirectory}");
            return;
        }

        var xsdFiles = Directory.GetFiles(schemaDirectory, "*.xsd", SearchOption.AllDirectories);
        foreach (var xsdFile in xsdFiles)
        {
            try
            {
                LoadSchema(xsdFile);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(
                    $"Failed to load schema {xsdFile}: {ex.Message}");
            }
        }
    }

    /// <summary>
    /// Loads a specific XSD file and registers it.
    /// </summary>
    public void LoadSchema(string xsdFilePath)
    {
        var fileName = Path.GetFileName(xsdFilePath);
        
        // Use XmlReader with DTD processing disabled for security (CA5371)
        var settings = new XmlReaderSettings
        {
            DtdProcessing = DtdProcessing.Prohibit,
            XmlResolver = null,
        };
        
        using var fileStream = new FileStream(xsdFilePath, FileMode.Open, FileAccess.Read);
        using var xmlReader = XmlReader.Create(fileStream, settings);
        
        var schema = XmlSchema.Read(xmlReader, (sender, args) => { });
        
        if (schema != null)
        {
            schemas[fileName] = schema;
        }
    }

    /// <summary>
    /// Gets a schema by name (e.g., "SiteMapType.xsd", "FormXml.xsd").
    /// </summary>
    public XmlSchema? GetSchema(string schemaName)
    {
        return schemas.TryGetValue(schemaName, out var schema) ? schema : null;
    }

    /// <summary>
    /// Gets all registered schemas.
    /// </summary>
    public IReadOnlyDictionary<string, XmlSchema> AllSchemas => schemas;

    /// <summary>
    /// Validates an XML document against a schema.
    /// </summary>
    public ValidationResult ValidateXml(XDocument document, string schemaName)
    {
        var schema = GetSchema(schemaName);
        if (schema == null)
        {
            return new ValidationResult
            {
                IsValid = false,
                Errors = new[] { $"Schema not found: {schemaName}" },
            };
        }

        var schemaSet = new XmlSchemaSet();
        schemaSet.Add(schema);

        var errors = new List<string>();
        var warnings = new List<string>();

        document.Validate(schemaSet, (sender, args) =>
        {
            if (args.Severity == XmlSeverityType.Error)
            {
                errors.Add(args.Message);
            }
            else
            {
                warnings.Add(args.Message);
            }
        });

        return new ValidationResult
        {
            IsValid = errors.Count == 0,
            Errors = errors.ToArray(),
            Warnings = warnings.ToArray(),
        };
    }
}

/// <summary>
/// Result of XML schema validation.
/// </summary>
public sealed record ValidationResult
{
    public bool IsValid { get; init; }

    public string[] Errors { get; init; } = [];

    public string[] Warnings { get; init; } = [];
}

/// <summary>
/// Generates skeleton XSD schemas when they don't exist in the standard location.
/// Used as fallback for missing metadata schema definitions.
/// </summary>
public sealed class SchemaSkeleton
{
    /// <summary>
    /// Generates a skeleton SiteMap schema if one doesn't exist.
    /// </summary>
    public static XmlSchema GenerateSiteMapSchema()
    {
        var schema = new XmlSchema();
        schema.TargetNamespace = "http://schemas.microsoft.com/dynamics/2008/07/crm";

        // Define simple types for common attributes
        var lcidType = new XmlSchemaSimpleType();
        lcidType.Name = "LCIDType";
        var restriction = new XmlSchemaSimpleTypeRestriction();
        restriction.BaseTypeName = new XmlQualifiedName("decimal", "http://www.w3.org/2001/XMLSchema");
        lcidType.Content = restriction;
        schema.Items.Add(lcidType);

        // Define Title type
        var titleType = new XmlSchemaComplexType();
        titleType.Name = "TitleType";
        schema.Items.Add(titleType);

        // Define SubArea type
        var subAreaType = new XmlSchemaComplexType();
        subAreaType.Name = "SubAreaType";
        schema.Items.Add(subAreaType);

        // Define Group type
        var groupType = new XmlSchemaComplexType();
        groupType.Name = "GroupType";
        schema.Items.Add(groupType);

        // Define Area type
        var areaType = new XmlSchemaComplexType();
        areaType.Name = "AreaType";
        schema.Items.Add(areaType);

        // Define root SiteMap type
        var siteMapType = new XmlSchemaComplexType();
        siteMapType.Name = "SiteMapType";
        schema.Items.Add(siteMapType);

        return schema;
    }

    /// <summary>
    /// Generates a skeleton FormXml schema if one doesn't exist.
    /// </summary>
    public static XmlSchema GenerateFormXmlSchema()
    {
        var schema = new XmlSchema();
        schema.TargetNamespace = "http://schemas.microsoft.com/dynamics/2008/07/crm";

        // Define basic form structure
        var formType = new XmlSchemaComplexType();
        formType.Name = "FormType";
        schema.Items.Add(formType);

        var tabType = new XmlSchemaComplexType();
        tabType.Name = "TabType";
        schema.Items.Add(tabType);

        var sectionType = new XmlSchemaComplexType();
        sectionType.Name = "SectionType";
        schema.Items.Add(sectionType);

        return schema;
    }

    /// <summary>
    /// Generates a skeleton entity metadata schema.
    /// </summary>
    public static XmlSchema GenerateEntityMetadataSchema()
    {
        var schema = new XmlSchema();
        schema.TargetNamespace = "http://schemas.microsoft.com/dynamics/2008/07/crm";

        var entityType = new XmlSchemaComplexType();
        entityType.Name = "EntityType";
        schema.Items.Add(entityType);

        var attributeType = new XmlSchemaComplexType();
        attributeType.Name = "AttributeType";
        schema.Items.Add(attributeType);

        return schema;
    }
}
