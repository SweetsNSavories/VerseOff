using System.Xml.Linq;
using VerseOff.Domain;

namespace VerseOff.Metadata;

/// <summary>
/// Provides OOTB (Out-of-the-Box) Dataverse components that are not included in solution ZIPs.
/// For now: returns null (Phase 1 placeholder). Later: can be implemented with bundled catalog or live Dataverse.
/// </summary>
public interface IOOTBComponentResolver
{
    /// <summary>
    /// Attempts to resolve an OOTB form by its ID and table name.
    /// </summary>
    /// <returns>
    /// The form definition if found, or null if not available in this resolver.
    /// Multiple resolvers can be chained; first non-null result is used.
    /// </returns>
    FormDefinition? TryGetForm(Guid formId, string tableLogicalName);

    /// <summary>
    /// Attempts to resolve an OOTB view by its ID.
    /// </summary>
    ViewDefinition? TryGetView(Guid viewId, string tableLogicalName);

    /// <summary>
    /// Generates a default navigation structure (SiteMap) for the given tables.
    /// Used when solution ZIP doesn't include SiteMap metadata.
    /// </summary>
    IReadOnlyList<NavigationDefinition> GenerateDefaultNavigation(
        IReadOnlyList<string> tableLogicalNames,
        IReadOnlyList<TableDefinition> tables);
}

/// <summary>
/// Phase 1 placeholder: returns null for all OOTB component requests.
/// This allows the importer to work without OOTB data initially.
/// Later implementations (Phase 2+) can add bundled or live Dataverse fetching.
/// </summary>
public sealed class NullOOTBComponentResolver : IOOTBComponentResolver
{
    private readonly SiteMapGenerator siteMapGenerator;

    public static readonly IOOTBComponentResolver Instance = 
        new NullOOTBComponentResolver();

    private NullOOTBComponentResolver()
    {
        var schemaRegistry = new SchemaRegistry();
        schemaRegistry.LoadAllSchemas();
        this.siteMapGenerator = new SiteMapGenerator(schemaRegistry);
    }

    public FormDefinition? TryGetForm(Guid formId, string tableLogicalName) => null;

    public ViewDefinition? TryGetView(Guid viewId, string tableLogicalName) => null;

    public IReadOnlyList<NavigationDefinition> GenerateDefaultNavigation(
        IReadOnlyList<string> tableLogicalNames,
        IReadOnlyList<TableDefinition> tables)
    {
        if (tableLogicalNames.Count == 0)
        {
            return [];
        }

        // Generate SiteMap XML using proper Dataverse schema
        // This validates against SiteMap.xsd automatically
        var siteMapXml = this.siteMapGenerator.GenerateSiteMap(
            tableLogicalNames,
            tables,
            validateAgainstSchema: true);

        // Parse SiteMap into NavigationDefinitions
        return ParseSiteMapToNavigation(siteMapXml);
    }

    /// <summary>
    /// Converts SiteMap XML structure to NavigationDefinition records.
    /// Preserves hierarchy: Area → Group → SubArea.
    /// </summary>
#pragma warning disable CA1859 // Use concrete type when possible for performance
    private static IReadOnlyList<NavigationDefinition> ParseSiteMapToNavigation(XElement siteMap)
    {
        var result = new List<NavigationDefinition>();
        var order = 0;

        foreach (var area in siteMap.Elements("Area"))
        {
            var areaId = area.Attribute("Id")?.Value ?? $"area-{order}";
            var areaTitle = ExtractTitle(area);

            result.Add(new(areaId, areaTitle, null, null, order++)
            {
                Kind = NavigationNodeKind.Area,
                IconResource = area.Attribute("Icon")?.Value,
            });

            // Process Groups
            foreach (var group in area.Elements("Group"))
            {
                var groupId = group.Attribute("Id")?.Value ?? $"group-{order}";
                var groupTitle = ExtractTitle(group);

                result.Add(new(groupId, groupTitle, null, null, order++)
                {
                    Kind = NavigationNodeKind.Group,
                    ParentId = areaId,
                });

                // Process SubAreas
                foreach (var subArea in group.Elements("SubArea"))
                {
                    var subAreaId = subArea.Attribute("Id")?.Value ?? $"subarea-{order}";
                    var subAreaTitle = ExtractTitle(subArea);
                    var entity = subArea.Attribute("Entity")?.Value;

                    result.Add(new(subAreaId, subAreaTitle, entity, subArea.Attribute("Url")?.Value, order++)
                    {
                        Kind = NavigationNodeKind.SubArea,
                        ParentId = groupId,
                        IconResource = subArea.Attribute("Icon")?.Value,
                        Client = subArea.Attribute("Client")?.Value,
                    });
                }
            }
        }

        return result;
    }
#pragma warning restore CA1859

    /// <summary>
    /// Extracts the Title text from an element's Titles/Title child.
    /// Falls back to attribute-based Title if element not found (legacy format).
    /// </summary>
    private static string ExtractTitle(XElement element)
    {
        // Try Titles/Title element first (preferred format per schema)
        var titleElement = element
            .Element("Titles")
            ?.Element("Title");

        if (titleElement is not null)
        {
            return titleElement.Attribute("Title")?.Value ?? string.Empty;
        }

        // Fall back to Title attribute (deprecated but supported)
        return element.Attribute("Title")?.Value ?? string.Empty;
    }
}
