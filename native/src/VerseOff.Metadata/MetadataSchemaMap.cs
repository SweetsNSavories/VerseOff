namespace VerseOff.Metadata;

/// <summary>
/// Comprehensive registry of all Dataverse XML metadata schemas and their structures.
/// Acts as the canonical reference for what metadata types are available and their requirements.
/// If a schema is missing, generates a skeleton based on Microsoft Dataverse patterns.
/// </summary>
public sealed class MetadataSchemaMap
{
    /// <summary>
    /// All known Dataverse metadata schema files and their purposes.
    /// This is the complete inventory of what needs to be supported.
    /// </summary>
    public static readonly IReadOnlyDictionary<string, SchemaMetadata> KnownSchemas =
        new Dictionary<string, SchemaMetadata>(StringComparer.OrdinalIgnoreCase)
        {
            // Navigation & Structure
            {
                "SiteMap.xsd",
                new SchemaMetadata(
                    "SiteMap.xsd",
                    "SiteMapType.xsd",
                    "Navigation structure for model-driven apps",
                    "Area → Group → SubArea hierarchy with Titles/Descriptions",
                    true)
            },
            {
                "SiteMapType.xsd",
                new SchemaMetadata(
                    "SiteMapType.xsd",
                    "SiteMapType.xsd",
                    "SiteMap type definitions",
                    "Complex types for Area, Group, SubArea, Titles, Descriptions, Privileges",
                    true)
            },

            // Form & View Metadata
            {
                "FormXml.xsd",
                new SchemaMetadata(
                    "FormXml.xsd",
                    "FormXml.xsd",
                    "Form layout and control definitions",
                    "Form tabs, sections, controls, events, business rules",
                    true)
            },
            {
                "VisualizationDataDescription.xsd",
                new SchemaMetadata(
                    "VisualizationDataDescription.xsd",
                    "VisualizationDataDescription.xsd",
                    "View and chart definitions",
                    "Grid views, form views, charts, KPIs",
                    true)
            },

            // Customization & Solution
            {
                "CustomizationsSolution.xsd",
                new SchemaMetadata(
                    "CustomizationsSolution.xsd",
                    "CustomizationsSolution.xsd",
                    "Solution package structure",
                    "Root schema for solution.xml; defines RootComponent elements",
                    true)
            },

            // Ribbon & Commands
            {
                "RibbonCore.xsd",
                new SchemaMetadata(
                    "RibbonCore.xsd",
                    "RibbonCore.xsd",
                    "Ribbon control definitions (core)",
                    "Tab, group, control elements for ribbon UI",
                    false)
            },
            {
                "RibbonTypes.xsd",
                new SchemaMetadata(
                    "RibbonTypes.xsd",
                    "RibbonTypes.xsd",
                    "Ribbon type definitions",
                    "Button, toggle, dropdown, gallery, spinner types",
                    false)
            },
            {
                "RibbonWSS.xsd",
                new SchemaMetadata(
                    "RibbonWSS.xsd",
                    "RibbonWSS.xsd",
                    "Ribbon Web Service Standard",
                    "SharePoint compatibility layer",
                    false)
            },

            // Queries & Data
            {
                "Fetch.xsd",
                new SchemaMetadata(
                    "Fetch.xsd",
                    "Fetch.xsd",
                    "FetchXml query schema",
                    "Entity, link-entity, filter, order elements for data queries",
                    false)
            },

            // Business Logic
            {
                "isv.config.xsd",
                new SchemaMetadata(
                    "isv.config.xsd",
                    "isv.config.xsd",
                    "ISV configuration and plug-in definitions",
                    "Plug-ins, workflows, event handlers, custom business logic",
                    false)
            },

            // Reporting
            {
                "reports.config.xsd",
                new SchemaMetadata(
                    "reports.config.xsd",
                    "reports.config.xsd",
                    "Report definitions and parameters",
                    "SQL Server Reporting Services (SSRS) integration",
                    false)
            },
            {
                "ParameterXml.xsd",
                new SchemaMetadata(
                    "ParameterXml.xsd",
                    "ParameterXml.xsd",
                    "Report parameter definitions",
                    "Filter parameters, data types, default values",
                    false)
            },
        };

    /// <summary>
    /// Gets metadata about a specific schema by filename.
    /// </summary>
    public static SchemaMetadata? GetSchemaMetadata(string fileName)
    {
        return KnownSchemas.TryGetValue(fileName, out var meta) ? meta : null;
    }

    /// <summary>
    /// Gets all required (core) schemas.
    /// These must be present for a valid solution.
    /// </summary>
    public static IEnumerable<SchemaMetadata> RequiredSchemas =>
        KnownSchemas.Values.Where(s => s.IsRequired);

    /// <summary>
    /// Gets all optional schemas.
    /// These enhance functionality but are not strictly required.
    /// </summary>
    public static IEnumerable<SchemaMetadata> OptionalSchemas =>
        KnownSchemas.Values.Where(s => !s.IsRequired);
}

/// <summary>
/// Metadata about a specific Dataverse XML schema file.
/// </summary>
public sealed class SchemaMetadata
{
    public string FileName { get; }
    public string TypeName { get; }
    public string DisplayName { get; }
    public string Description { get; }
    public bool IsRequired { get; }

    /// <summary>
    /// Category: Navigation, FormLayout, ViewLayout, Ribbon, Query, etc.
    /// </summary>
    public string Category { get; }

    /// <summary>
    /// Whether this schema is part of the core model-driven app structure.
    /// </summary>
    public bool IsCoreMetadata { get; }

    public SchemaMetadata(
        string fileName,
        string typeName,
        string displayName,
        string description,
        bool isRequired)
    {
        FileName = fileName;
        TypeName = typeName;
        DisplayName = displayName;
        Description = description;
        IsRequired = isRequired;
        Category = ExtractCategory(fileName);
        IsCoreMetadata = isRequired;
    }

    private static string ExtractCategory(string fileName)
    {
        return fileName switch
        {
            _ when fileName.Contains("SiteMap") => "Navigation",
            _ when fileName.Contains("Form") => "FormLayout",
            _ when fileName.Contains("Visualization") || fileName.Contains("Fetch") => "DataLayout",
            _ when fileName.Contains("Ribbon") => "Commands",
            _ when fileName.Contains("Customization") || fileName.Contains("Solution") => "Package",
            _ when fileName.Contains("Report") || fileName.Contains("Parameter") => "Reporting",
            _ when fileName.Contains("isv") => "ExtensionPoints",
            _ => "Other",
        };
    }
}
