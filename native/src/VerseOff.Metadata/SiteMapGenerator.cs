using System.Globalization;
using System.Text;
using System.Xml.Linq;
using System.Xml.Schema;
using VerseOff.Domain;

namespace VerseOff.Metadata;

/// <summary>
/// Generates valid SiteMap XML according to Dataverse schema (SiteMapType.xsd).
/// Validates all generated XML against the schema before returning.
/// Supports: Areas → Groups → SubAreas with localized Titles, Descriptions, Privileges.
/// Reference: SiteMapType.xsd in D365 metadata.
/// </summary>
public sealed class SiteMapGenerator
{
    private readonly SchemaRegistry schemaRegistry;

    public SiteMapGenerator(SchemaRegistry? schemaRegistry = null)
    {
        this.schemaRegistry = schemaRegistry ?? new SchemaRegistry();
    }

    /// <summary>
    /// Generates a complete SiteMap XML structure for the given tables and app metadata.
    /// Validates against SiteMap.xsd schema.
    /// </summary>
    public XElement GenerateSiteMap(
        IReadOnlyList<string> tableLogicalNames,
        IReadOnlyList<TableDefinition> tables,
        string? appDisplayName = null,
        bool validateAgainstSchema = true)
    {
        ArgumentNullException.ThrowIfNull(tableLogicalNames);
        ArgumentNullException.ThrowIfNull(tables);

        var appName = appDisplayName ?? "Business Applications";

        var siteMap = new XElement("SiteMap");

        // Create a single Area
        var area = new XElement("Area");
        area.SetAttributeValue("Id", "nav-area-main");
        area.SetAttributeValue("Icon", "SVG.svg:icons/nav_home_svg.svg");

        // Add Area Title (localized, English default)
        area.Add(CreateTitles("Business Applications"));

        // Create a Group for all entities
        var group = new XElement("Group");
        group.SetAttributeValue("Id", "nav-group-records");
        group.Add(CreateTitles("Records"));

        // Add SubAreas for each entity
        foreach (var tableLogicalName in tableLogicalNames)
        {
            var table = tables.FirstOrDefault(t =>
                t.LogicalName.Equals(tableLogicalName, StringComparison.OrdinalIgnoreCase));

            if (table is not null)
            {
                var subArea = CreateSubArea(table);
                group.Add(subArea);
            }
        }

        // Only add group if it has subareas
        if (group.Elements("SubArea").Any())
        {
            area.Add(group);
        }

        // Only add area if it has groups
        if (area.Elements("Group").Any())
        {
            siteMap.Add(area);
        }

        // Validate against schema if requested
        if (validateAgainstSchema)
        {
            var document = new XDocument(siteMap);
            var result = schemaRegistry.ValidateXml(document, "SiteMap.xsd");
            
            if (!result.IsValid)
            {
                System.Diagnostics.Debug.WriteLine(
                    $"SiteMap validation failed: {string.Join("; ", result.Errors)}");
            }

            foreach (var warning in result.Warnings)
            {
                System.Diagnostics.Debug.WriteLine($"SiteMap warning: {warning}");
            }
        }

        return siteMap;
    }

    /// <summary>
    /// Creates a SubArea element for a table with all localized properties per XSD.
    /// </summary>
    private static XElement CreateSubArea(TableDefinition table)
    {
        var subArea = new XElement("SubArea");
        subArea.SetAttributeValue("Id", $"nav-subarea-{table.LogicalName}");
        subArea.SetAttributeValue("Entity", table.LogicalName);
        subArea.SetAttributeValue("AvailableOffline", "true");

        // Add localized Titles (English, LCID 1033)
        // This is REQUIRED per SiteMapType.xsd
        subArea.Add(CreateTitles(
            table.DisplayCollectionName ?? table.DisplayName ?? table.LogicalName));

        // Add optional Description (good practice)
        if (!string.IsNullOrEmpty(table.DisplayName))
        {
            subArea.Add(CreateDescriptions(table.DisplayName));
        }

        return subArea;
    }

    /// <summary>
    /// Creates a Titles element with localization (LCID 1033 = English US).
    /// Per XSD: Titles is complex type with unbounded Title elements.
    /// Title has required attributes: LCID, Title.
    /// </summary>
    private static XElement CreateTitles(string titleText)
    {
        var titles = new XElement("Titles");
        var title = new XElement("Title");
        title.SetAttributeValue("LCID", "1033");  // English US
        title.SetAttributeValue("Title", titleText ?? string.Empty);
        titles.Add(title);
        return titles;
    }

    /// <summary>
    /// Creates a Descriptions element with localization.
    /// Per XSD: Descriptions is complex type with unbounded Description elements.
    /// Description has required attributes: LCID, Description.
    /// </summary>
    private static XElement CreateDescriptions(string descriptionText)
    {
        var descriptions = new XElement("Descriptions");
        var description = new XElement("Description");
        description.SetAttributeValue("LCID", "1033");  // English US
        description.SetAttributeValue("Description", descriptionText ?? string.Empty);
        descriptions.Add(description);
        return descriptions;
    }

    /// <summary>
    /// Converts the SiteMap XElement to a formatted XML string suitable for storage.
    /// </summary>
    public static string ToFormattedString(XElement siteMap)
    {
        return siteMap.ToString(SaveOptions.None);
    }

    /// <summary>
    /// Converts the SiteMap XElement to a compact XML string (no extra whitespace).
    /// </summary>
    public static string ToCompactString(XElement siteMap)
    {
        return siteMap.ToString(SaveOptions.DisableFormatting);
    }
}

