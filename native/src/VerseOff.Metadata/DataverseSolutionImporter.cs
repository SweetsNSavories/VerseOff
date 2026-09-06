using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;
using VerseOff.Domain;

namespace VerseOff.Metadata;

public sealed record SolutionImportResult(
    ApplicationDefinition? Application,
    IReadOnlyList<CompatibilityIssue> Issues)
{
    public bool Succeeded =>
        Application is not null
        && Application.Compatibility.CanActivate;
}

public enum SchemaValidationBehavior
{
    Strict = 0,
    ReportOnly = 1,
}

public sealed partial class DataverseSolutionImporter
{
    private readonly SolutionImportPolicy importPolicy;
    private readonly PublishedSchemaCatalog schemaCatalog;
    private readonly SchemaValidationBehavior schemaValidationBehavior;

    public DataverseSolutionImporter(
        SolutionImportPolicy importPolicy,
        SchemaValidationBehavior schemaValidationBehavior =
            SchemaValidationBehavior.Strict,
        PublishedSchemaCatalog? schemaCatalog = null)
    {
        this.importPolicy = importPolicy
            ?? throw new ArgumentNullException(nameof(importPolicy));
        this.schemaValidationBehavior = schemaValidationBehavior;
        this.schemaCatalog = schemaCatalog ?? PublishedSchemaCatalog.Default;
    }

    public SolutionImportResult Import(
        SolutionPackage package,
        Guid appModuleId)
    {
        ArgumentNullException.ThrowIfNull(package);
        if (appModuleId == Guid.Empty)
        {
            throw new ArgumentException(
                "A model-driven app ID is required.",
                nameof(appModuleId));
        }

        var compatibilityIssues = new List<CompatibilityIssue>();
        var discovery = SolutionDiscoveryService.Discover(package);
        var selectedApp = discovery.Applications.SingleOrDefault(
            app => app.AppModuleId == appModuleId);
        if (selectedApp is null)
        {
            compatibilityIssues.Add(new(
                "app-not-found",
                CompatibilitySeverity.Blocking,
                appModuleId.ToString("D", CultureInfo.InvariantCulture),
                "The selected model-driven app was not found in the solution package.",
                "Select an app discovered from the same package."));
            return new(null, compatibilityIssues);
        }

        var documents = LoadXmlDocuments(package, compatibilityIssues);
        var identity = SolutionIdentityReader.Read(package);
        if (identity is null)
        {
            compatibilityIssues.Add(new(
                "solution-identity-missing",
                CompatibilitySeverity.Blocking,
                selectedApp.UniqueName,
                "The package has no complete solution/publisher identity, so component ownership cannot be verified.",
                "Export the app in a solution containing SolutionManifest publisher metadata."));
            return new(null, compatibilityIssues);
        }

        var tables = ParseTables(
            documents,
            selectedApp,
            identity,
            compatibilityIssues);
        var tableNames = tables
            .Select(table => table.LogicalName)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        var forms = ParseForms(
            documents,
            selectedApp,
            identity,
            tables,
            compatibilityIssues);
        var views = ParseViews(
            documents,
            selectedApp,
            identity,
            tableNames,
            compatibilityIssues);
        var navigation = ParseNavigation(
            documents,
            selectedApp,
            compatibilityIssues);
        var commands = ParseCommands(
            documents,
            identity,
            compatibilityIssues);
        var webResources = ParseWebResources(
            package,
            documents,
            identity,
            compatibilityIssues);
        var offlineProfile = ParseOfflineProfile(
            documents,
            tableNames,
            compatibilityIssues);
        var codeComponents = ParseCodeComponents(
            package,
            identity,
            compatibilityIssues);

        var disposition = compatibilityIssues.Count == 0
            ? CompatibilityDisposition.Native
            : compatibilityIssues.Max(issue =>
                issue.Severity switch
                {
                    CompatibilitySeverity.Blocking =>
                        CompatibilityDisposition.Blocked,
                    CompatibilitySeverity.Error =>
                        CompatibilityDisposition.OnlineOnly,
                    CompatibilitySeverity.Warning =>
                        CompatibilityDisposition.Fallback,
                    _ => CompatibilityDisposition.Native,
                });
        var compatibility = new CompatibilityReport(
            disposition,
            compatibilityIssues);
        var application = new ApplicationDefinition(
            selectedApp.AppModuleId,
            selectedApp.UniqueName,
            selectedApp.DisplayName,
            tables,
            forms,
            navigation,
            package.Sha256)
        {
            Views = views,
            Commands = commands,
            WebResources = webResources,
            CodeComponents = codeComponents,
            OfflineProfile = offlineProfile,
            Compatibility = compatibility,
        };

        var modelValidation = ApplicationDefinitionValidator.Validate(
            application);
        foreach (var issue in modelValidation.Issues)
        {
            compatibilityIssues.Add(new(
                issue.Code,
                CompatibilitySeverity.Blocking,
                issue.Path,
                issue.Message,
                "Correct or include the referenced source metadata."));
        }

        if (!modelValidation.IsValid)
        {
            application = application with
            {
                Compatibility = new(
                    CompatibilityDisposition.Blocked,
                    compatibilityIssues),
            };
        }

        return new(application, compatibilityIssues);
    }

    private List<PackageXmlDocument> LoadXmlDocuments(
        SolutionPackage package,
        List<CompatibilityIssue> issues)
    {
        var documents = new List<PackageXmlDocument>();
        foreach (var entry in package.Entries
            .Where(entry => entry.Path.EndsWith(
                ".xml",
                StringComparison.OrdinalIgnoreCase))
            .OrderBy(entry => entry.Path, StringComparer.Ordinal))
        {
            try
            {
                using var stream = entry.OpenRead();
                var schemaFile = SchemaFor(entry.Path);
                if (schemaFile is null)
                {
                    documents.Add(new(
                        entry.Path,
                        SecureXml.Load(stream),
                        Hash(entry.Content)));
                    continue;
                }

                var validation = schemaCatalog.Validate(stream, schemaFile);
                foreach (var issue in validation.Issues.Take(100))
                {
                    issues.Add(new(
                        "xsd-validation",
                        schemaValidationBehavior
                            is SchemaValidationBehavior.Strict
                            && issue.Severity is XmlSeverityType.Error
                                ? CompatibilitySeverity.Blocking
                                : CompatibilitySeverity.Warning,
                        entry.Path,
                        issue.Message,
                        $"Validate this file against {schemaFile}."));
                }

                if (validation.Document is not null
                    && (validation.IsValid
                        || schemaValidationBehavior
                            is SchemaValidationBehavior.ReportOnly))
                {
                    documents.Add(new(
                        entry.Path,
                        validation.Document,
                        Hash(entry.Content)));
                }
            }
            catch (XmlException exception)
            {
                issues.Add(new(
                    "invalid-xml",
                    CompatibilitySeverity.Error,
                    entry.Path,
                    exception.Message,
                    "Correct the malformed XML resource before activation."));
            }
        }

        return documents;
    }

    private static string? SchemaFor(string path)
    {
        var fileName = Path.GetFileName(path);
        if (string.Equals(
                fileName,
                "customizations.xml",
                StringComparison.OrdinalIgnoreCase))
        {
            return "CustomizationsSolution.xsd";
        }

        if (path.Contains("FormXml", StringComparison.OrdinalIgnoreCase)
            || path.Contains("/Forms/", StringComparison.OrdinalIgnoreCase))
        {
            return "FormXml.xsd";
        }

        if (path.Contains("SiteMap", StringComparison.OrdinalIgnoreCase))
        {
            return "SiteMap.xsd";
        }

        if (path.Contains("Ribbon", StringComparison.OrdinalIgnoreCase))
        {
            return "RibbonCore.xsd";
        }

        if (path.Contains("FetchXml", StringComparison.OrdinalIgnoreCase))
        {
            return "Fetch.xsd";
        }

        return null;
    }

    private static TableDefinition[] ParseTables(
        List<PackageXmlDocument> documents,
        ModelDrivenAppDescriptor selectedApp,
        SolutionIdentity identity,
        List<CompatibilityIssue> issues)
    {
        var tables = new Dictionary<string, TableDefinition>(
            StringComparer.OrdinalIgnoreCase);

        foreach (var document in documents)
        {
            foreach (var entityNode in EntityElements(document))
            {
                var table = ParseTable(entityNode);
                if (table is null)
                {
                    continue;
                }

                if (selectedApp.TableLogicalNames.Count > 0
                    && !selectedApp.TableLogicalNames.Contains(
                        table.LogicalName))
                {
                    continue;
                }

                if (!tables.TryAdd(table.LogicalName, table))
                {
                    issues.Add(new(
                        "duplicate-table-metadata",
                        CompatibilitySeverity.Error,
                        table.LogicalName,
                        $"Multiple metadata definitions were found for table '{table.LogicalName}'.",
                        "Remove duplicate solution layers from the source package."));
                }
            }
        }

        foreach (var expected in selectedApp.TableLogicalNames)
        {
            if (!tables.ContainsKey(expected))
            {
                issues.Add(new(
                    "app-table-missing",
                    CompatibilitySeverity.Blocking,
                    expected,
                    $"The selected app declares table '{expected}', but its metadata is missing.",
                    "Add the table and required columns to the exported solution."));
            }
        }

        _ = identity;
        return tables.Values
            .OrderBy(table => table.LogicalName, StringComparer.Ordinal)
            .ToArray();
    }

    private static IEnumerable<XElement> EntityElements(
        PackageXmlDocument document)
    {
        foreach (var container in document.Document
            .DescendantsNamed("Entities"))
        {
            foreach (var entity in container.ElementsNamed("Entity"))
            {
                yield return entity;
            }
        }

        if (document.Document.Root is not null
            && string.Equals(
                document.Document.Root.Name.LocalName,
                "Entity",
                StringComparison.OrdinalIgnoreCase))
        {
            yield return document.Document.Root;
        }
    }

    private static TableDefinition? ParseTable(XElement source)
    {
        var nameNode = source.ElementNamed("Name");
        var inner = source.ElementNamed("EntityInfo")
                ?.DescendantsNamed("entity")
                .FirstOrDefault()
            ?? source.ElementsNamed("entity").FirstOrDefault()
            ?? source;
        var logicalName = FirstNonBlank(
            source.AttributeValue("LogicalName"),
            inner.AttributeValue("LogicalName"),
            inner.AttributeValue("Name"),
            nameNode?.Value);
        if (string.IsNullOrWhiteSpace(logicalName))
        {
            return null;
        }

        logicalName = logicalName.ToLowerInvariant();
        var primaryId = FirstNonBlank(
            inner.AttributeValue("PrimaryIdAttribute"),
            inner.ChildValue("PrimaryIdAttribute"),
            source.ChildValue("PrimaryIdAttribute"),
            $"{logicalName}id")!;
        var attributeContainer = inner.ElementNamed("attributes")
            ?? source.DescendantsNamed("attributes").FirstOrDefault();
        var columns = attributeContainer is null
            ? []
            : attributeContainer.ElementsNamed("attribute")
                .Select(ParseColumn)
                .OfType<ColumnDefinition>()
                .GroupBy(
                    column => column.LogicalName,
                    StringComparer.OrdinalIgnoreCase)
                .Select(group => group.First())
                .OrderBy(
                    column => column.LogicalName,
                    StringComparer.Ordinal)
                .ToArray();

        return new(
            logicalName,
            FirstNonBlank(
                inner.AttributeValue("EntitySetName"),
                inner.ChildValue("EntitySetName"),
                source.ChildValue("EntitySetName"),
                $"{logicalName}s")!,
            primaryId.ToLowerInvariant(),
            FirstNonBlank(
                inner.AttributeValue("PrimaryNameAttribute"),
                inner.ChildValue("PrimaryNameAttribute"),
                source.ChildValue("PrimaryNameAttribute"))
                ?.ToLowerInvariant(),
            ParseBoolean(
                FirstNonBlank(
                    inner.AttributeValue("IsActivity"),
                    inner.ChildValue("IsActivity")),
                defaultValue: false),
            columns)
        {
            DisplayName = nameNode?.AttributeValue("LocalizedName")
                ?? SolutionDiscoveryService.LocalizedLabel(source)
                ?? logicalName,
            DisplayCollectionName =
                source.ChildValue("LocalizedCollectionName"),
            ObjectTypeCode = ParseInteger(
                FirstNonBlank(
                    inner.AttributeValue("ObjectTypeCode"),
                    inner.ChildValue("ObjectTypeCode"))),
            IsCustomizable = ParseBoolean(
                FirstNonBlank(
                    inner.AttributeValue("IsCustomizable"),
                    inner.ChildValue("IsCustomizable")),
                defaultValue: true),
            Relationships = ParseRelationships(source, logicalName),
            AlternateKeys = ParseAlternateKeys(source),
        };
    }

    private static ColumnDefinition? ParseColumn(XElement source)
    {
        var logicalName = FirstNonBlank(
            source.AttributeValue("LogicalName"),
            source.ChildValue("LogicalName"),
            source.AttributeValue("PhysicalName"),
            source.ChildValue("PhysicalName"));
        if (string.IsNullOrWhiteSpace(logicalName))
        {
            return null;
        }

        var options = source.DescendantsNamed("option")
            .Select(option =>
            {
                var value = ParseInteger(
                    FirstNonBlank(
                        option.AttributeValue("value"),
                        option.ChildValue("Value")));
                var label = SolutionDiscoveryService.LocalizedLabel(option)
                    ?? option.AttributeValue("label")
                    ?? value.ToString(CultureInfo.InvariantCulture);
                return new OptionDefinition(
                    value,
                    label,
                    option.AttributeValue("color"));
            })
            .ToArray();
        var lookupTargets = source.DescendantsNamed("Target")
            .Select(target => target.Value.Trim().ToLowerInvariant())
            .Where(target => target.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return new(
            logicalName.ToLowerInvariant(),
            FirstNonBlank(
                source.AttributeValue("AttributeType"),
                source.ChildValue("AttributeType"),
                source.ChildValue("Type"),
                "String")!,
            ParseBoolean(
                source.ChildValue("IsValidForReadApi"),
                defaultValue: true),
            ParseBoolean(
                source.ChildValue("IsValidForCreateApi"),
                defaultValue: true),
            ParseBoolean(
                source.ChildValue("IsValidForUpdateApi"),
                defaultValue: true),
            ParseBoolean(
                source.ChildValue("IsSecured"),
                defaultValue: false))
        {
            DisplayName = SolutionDiscoveryService.LocalizedLabel(source)
                ?? logicalName,
            Description = source.DescendantsNamed("Description")
                .Select(SolutionDiscoveryService.LocalizedLabel)
                .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value)),
            RequiredLevel = ParseRequiredLevel(
                source.ChildValue("RequiredLevel")),
            Format = source.ChildValue("Format"),
            MaxLength = ParseNullableInteger(source.ChildValue("MaxLength")),
            Precision = ParseNullableInteger(source.ChildValue("Precision")),
            MinimumValue = ParseNullableDecimal(
                source.ChildValue("MinValue")),
            MaximumValue = ParseNullableDecimal(
                source.ChildValue("MaxValue")),
            DefaultValue = source.ChildValue("DefaultValue"),
            Options = options,
            LookupTargets = lookupTargets,
        };
    }

    private FormDefinition[] ParseForms(
        List<PackageXmlDocument> documents,
        ModelDrivenAppDescriptor selectedApp,
        SolutionIdentity identity,
        IReadOnlyList<TableDefinition> tables,
        List<CompatibilityIssue> issues)
    {
        var tableMap = tables.ToDictionary(
            table => table.LogicalName,
            StringComparer.OrdinalIgnoreCase);
        var forms = new Dictionary<Guid, FormDefinition>();

        foreach (var document in documents)
        {
            foreach (var entityNode in EntityElements(document))
            {
                var logicalName = ParseTableLogicalName(entityNode);
                if (logicalName is null
                    || !tableMap.TryGetValue(logicalName, out var table))
                {
                    continue;
                }

                foreach (var systemForm in entityNode
                    .DescendantsNamed("systemform"))
                {
                    if (!SolutionDiscoveryService.TryParseGuid(
                            FirstNonBlank(
                                systemForm.ChildValue("formid"),
                                systemForm.AttributeValue("formid"),
                                systemForm.AttributeValue("id")),
                            out var formId))
                    {
                        issues.Add(new(
                            "form-id-missing",
                            CompatibilitySeverity.Error,
                            logicalName,
                            "A form has no valid form ID.",
                            "Include the complete system-form metadata."));
                        continue;
                    }

                    if (selectedApp.FormIds.Count > 0
                        && !selectedApp.FormIds.Contains(formId))
                    {
                        continue;
                    }

                    var formXml = systemForm.ElementsNamed("form")
                        .FirstOrDefault();
                    if (formXml is null)
                    {
                        issues.Add(new(
                            "form-xml-missing",
                            CompatibilitySeverity.Error,
                            formId.ToString(
                                "D",
                                CultureInfo.InvariantCulture),
                            "A selected form has no FormXml payload.",
                            "Include the form definition in the solution export."));
                        continue;
                    }

                    var formName = SolutionDiscoveryService.LocalizedLabel(
                            systemForm)
                        ?? FirstNonBlank(
                            systemForm.ChildValue("name"),
                            systemForm.AttributeValue("name"),
                            formId.ToString(
                                "D",
                                CultureInfo.InvariantCulture))!;
                    var formHash = Hash(
                        Encoding.UTF8.GetBytes(
                            formXml.ToString(SaveOptions.DisableFormatting)));
                    var provenance = importPolicy.CreateProvenance(
                        identity,
                        formId.ToString("D", CultureInfo.InvariantCulture),
                        formName,
                        formHash);
                    AddProvenanceIssue(
                        provenance,
                        formId.ToString("D", CultureInfo.InvariantCulture),
                        issues);
                    var formDocument = new XDocument(new XElement(formXml));
                    var form = FormXmlParser.Parse(
                        formDocument,
                        formId,
                        formName,
                        logicalName,
                        ParseFormType(systemForm),
                        provenance,
                        table.Columns);
                    if (!forms.TryAdd(formId, form))
                    {
                        issues.Add(new(
                            "duplicate-form-metadata",
                            CompatibilitySeverity.Error,
                            formId.ToString(
                                "D",
                                CultureInfo.InvariantCulture),
                            "The package contains multiple definitions for the same form.",
                            "Resolve duplicate form solution layers."));
                    }
                }
            }
        }

        foreach (var expectedFormId in selectedApp.FormIds)
        {
            if (!forms.ContainsKey(expectedFormId))
            {
                issues.Add(new(
                    "app-form-missing",
                    CompatibilitySeverity.Blocking,
                    expectedFormId.ToString(
                        "D",
                        CultureInfo.InvariantCulture),
                    "The selected app declares a form whose metadata is missing.",
                    "Add the form to the exported solution."));
            }
        }

        return forms.Values
            .OrderBy(form => form.TableLogicalName, StringComparer.Ordinal)
            .ThenBy(form => form.Name, StringComparer.Ordinal)
            .ToArray();
    }

    private ViewDefinition[] ParseViews(
        List<PackageXmlDocument> documents,
        ModelDrivenAppDescriptor selectedApp,
        SolutionIdentity identity,
        HashSet<string> tableNames,
        List<CompatibilityIssue> issues)
    {
        var views = new Dictionary<Guid, ViewDefinition>();
        foreach (var document in documents)
        {
            foreach (var source in document.Document
                .DescendantsNamed("savedquery"))
            {
                if (!SolutionDiscoveryService.TryParseGuid(
                        FirstNonBlank(
                            source.ChildValue("savedqueryid"),
                            source.AttributeValue("savedqueryid"),
                            source.AttributeValue("id")),
                        out var viewId))
                {
                    continue;
                }

                var tableName = FirstNonBlank(
                    source.ChildValue("returnedtypecode"),
                    source.AttributeValue("returnedtypecode"),
                    source.ChildValue("entity"));
                if (string.IsNullOrWhiteSpace(tableName)
                    || int.TryParse(
                        tableName,
                        NumberStyles.Integer,
                        CultureInfo.InvariantCulture,
                        out _)
                    || !tableNames.Contains(tableName))
                {
                    continue;
                }

                var fetchXml = InnerOrText(source.ElementNamed("fetchxml"));
                var layoutXml = InnerOrText(source.ElementNamed("layoutxml"));
                if (string.IsNullOrWhiteSpace(fetchXml)
                    || string.IsNullOrWhiteSpace(layoutXml))
                {
                    issues.Add(new(
                        "view-layout-missing",
                        CompatibilitySeverity.Warning,
                        viewId.ToString("D", CultureInfo.InvariantCulture),
                        "A view is missing FetchXML or layout XML.",
                        "Include complete saved-query metadata."));
                    continue;
                }

                if (!ValidateFragment(
                        fetchXml,
                        "Fetch.xsd",
                        viewId.ToString(
                            "D",
                            CultureInfo.InvariantCulture),
                        issues))
                {
                    continue;
                }

                var name = SolutionDiscoveryService.LocalizedLabel(source)
                    ?? FirstNonBlank(
                        source.ChildValue("name"),
                        viewId.ToString(
                            "D",
                            CultureInfo.InvariantCulture))!;
                var provenance = importPolicy.CreateProvenance(
                    identity,
                    viewId.ToString("D", CultureInfo.InvariantCulture),
                    name,
                    Hash(Encoding.UTF8.GetBytes(
                        source.ToString(SaveOptions.DisableFormatting))));
                AddProvenanceIssue(
                    provenance,
                    viewId.ToString("D", CultureInfo.InvariantCulture),
                    issues);
                views.TryAdd(
                    viewId,
                    new(
                        viewId,
                        name,
                        tableName.ToLowerInvariant(),
                        fetchXml,
                        layoutXml,
                        ParseBoolean(
                            source.ChildValue("isdefault"),
                            defaultValue: false),
                        provenance)
                    {
                        Columns = ParseViewColumns(layoutXml),
                    });
            }
        }

        _ = selectedApp;
        return views.Values
            .OrderBy(view => view.TableLogicalName, StringComparer.Ordinal)
            .ThenBy(view => view.Name, StringComparer.Ordinal)
            .ToArray();
    }

    private static ViewColumnDefinition[] ParseViewColumns(string layoutXml)
    {
        try
        {
            var layout = SecureXml.Parse(layoutXml);
            var result = new List<ViewColumnDefinition>();
            var order = 0;
            foreach (var cell in layout.DescendantsNamed("cell"))
            {
                var name = cell.AttributeValue("name");
                if (string.IsNullOrWhiteSpace(name))
                {
                    continue;
                }

                result.Add(new(
                    name.ToLowerInvariant(),
                    cell.IntegerAttribute("width", 100),
                    order++,
                    result.Count == 0));
            }

            return result.ToArray();
        }
        catch (XmlException)
        {
            return [];
        }
    }

    private NavigationDefinition[] ParseNavigation(
        List<PackageXmlDocument> documents,
        ModelDrivenAppDescriptor selectedApp,
        List<CompatibilityIssue> issues)
    {
        var siteMap = FindSiteMap(documents, selectedApp);
        if (siteMap is null)
        {
            issues.Add(new(
                "sitemap-missing",
                CompatibilitySeverity.Warning,
                selectedApp.UniqueName,
                "No SiteMap was found for the selected app.",
                "Include the app SiteMap in the solution export."));
            return [];
        }

        if (!ValidateFragment(
                siteMap.ToString(SaveOptions.DisableFormatting),
                "SiteMap.xsd",
                selectedApp.UniqueName,
                issues))
        {
            return [];
        }

        var result = new List<NavigationDefinition>();
        var order = 0;
        foreach (var area in siteMap.ElementsNamed("Area"))
        {
            var areaId = area.AttributeValue("Id") ?? $"area-{order}";
            result.Add(new(
                areaId,
                NavigationLabel(area, areaId),
                null,
                null,
                order++)
            {
                Kind = NavigationNodeKind.Area,
                IconResource = area.AttributeValue("Icon"),
            });

            foreach (var group in area.ElementsNamed("Group"))
            {
                var groupId = group.AttributeValue("Id") ?? $"group-{order}";
                result.Add(new(
                    groupId,
                    NavigationLabel(group, groupId),
                    null,
                    null,
                    order++)
                {
                    Kind = NavigationNodeKind.Group,
                    ParentId = areaId,
                });

                foreach (var subArea in group.ElementsNamed("SubArea"))
                {
                    var subAreaId = subArea.AttributeValue("Id")
                        ?? $"subarea-{order}";
                    result.Add(new(
                        subAreaId,
                        NavigationLabel(subArea, subAreaId),
                        subArea.AttributeValue("Entity")
                            ?.ToLowerInvariant(),
                        subArea.AttributeValue("Url"),
                        order++)
                    {
                        Kind = NavigationNodeKind.SubArea,
                        ParentId = groupId,
                        IconResource = subArea.AttributeValue("Icon"),
                        Client = subArea.AttributeValue("Client"),
                        PrivilegeNames = subArea
                            .DescendantsNamed("Privilege")
                            .Select(privilege => string.Join(
                                ':',
                                privilege.AttributeValue("Entity")
                                    ?? string.Empty,
                                privilege.AttributeValue("Privilege")
                                    ?? string.Empty))
                            .ToArray(),
                    });
                }
            }
        }

        return result.ToArray();
    }

    private CommandDefinition[] ParseCommands(
        List<PackageXmlDocument> documents,
        SolutionIdentity identity,
        List<CompatibilityIssue> issues)
    {
        var commands = new Dictionary<string, CommandDefinition>(
            StringComparer.OrdinalIgnoreCase);
        foreach (var document in documents)
        {
            foreach (var ribbon in document.Document
                .DescendantsNamed("RibbonDiffXml"))
            {
                var xml = ribbon.ToString(SaveOptions.DisableFormatting);
                var isStandalone = ReferenceEquals(
                    document.Document.Root,
                    ribbon);
                if (isStandalone && !ValidateFragment(
                        xml,
                        "RibbonCore.xsd",
                        document.Path,
                        issues))
                {
                    continue;
                }

                var hash = Hash(Encoding.UTF8.GetBytes(xml));
                var provenance = importPolicy.CreateProvenance(
                    identity,
                    $"ribbon:{document.Path}",
                    "RibbonDiffXml",
                    hash);
                AddProvenanceIssue(
                    provenance,
                    $"ribbon:{document.Path}",
                    issues);
                foreach (var command in RibbonXmlParser.Parse(
                    new XDocument(new XElement(ribbon)),
                    provenance))
                {
                    if (!commands.TryAdd(command.CommandId, command))
                    {
                        issues.Add(new(
                            "duplicate-command",
                            CompatibilitySeverity.Error,
                            command.CommandId,
                            "Multiple effective command definitions have the same ID.",
                            "Resolve command solution layers before generation."));
                    }
                }
            }
        }

        return commands.Values
            .OrderBy(command => command.Location, StringComparer.Ordinal)
            .ThenBy(command => command.Order)
            .ToArray();
    }

    private OfflineProfileDefinition? ParseOfflineProfile(
        List<PackageXmlDocument> documents,
        HashSet<string> tableNames,
        List<CompatibilityIssue> issues)
    {
        var profiles = documents
            .SelectMany(document => document.Document
                .DescendantsNamed("MobileOfflineProfile")
                .Select(profile => (document, profile)))
            .ToArray();
        if (profiles.Length == 0)
        {
            return null;
        }

        if (profiles.Length > 1)
        {
            issues.Add(new(
                "multiple-offline-profiles",
                CompatibilitySeverity.Warning,
                "offline-profile",
                "Multiple offline profiles were found; the first deterministic profile is used.",
                "Bind the selected app to one explicit mobile offline profile."));
        }

        var selected = profiles
            .OrderBy(item => item.document.Path, StringComparer.Ordinal)
            .First();
        if (!SolutionDiscoveryService.TryParseGuid(
                FirstNonBlank(
                    selected.profile.ChildValue("MobileOfflineProfileId"),
                    selected.profile.AttributeValue("id")),
                out var profileId))
        {
            issues.Add(new(
                "offline-profile-id-missing",
                CompatibilitySeverity.Error,
                selected.document.Path,
                "An offline profile has no valid profile ID.",
                "Include the complete mobile offline profile metadata."));
            return null;
        }

        var items = new List<OfflineProfileItemDefinition>();
        foreach (var item in selected.profile
            .DescendantsNamed("MobileOfflineProfileItem"))
        {
            var tableName = FirstNonBlank(
                item.ChildValue("EntityLogicalName"),
                item.ChildValue("TableLogicalName"),
                item.AttributeValue("entity"));
            var fetchXml = InnerOrText(
                item.ElementNamed("FetchXml")
                ?? item.ElementNamed("ProfileItemRule"));
            if (string.IsNullOrWhiteSpace(tableName)
                || string.IsNullOrWhiteSpace(fetchXml))
            {
                continue;
            }

            tableName = tableName.ToLowerInvariant();
            if (!tableNames.Contains(tableName))
            {
                issues.Add(new(
                    "offline-profile-table-missing",
                    CompatibilitySeverity.Blocking,
                    tableName,
                    "The offline profile references a table outside the selected app model.",
                    "Include the table metadata or remove it from the profile."));
                continue;
            }

            if (!ValidateFragment(
                    fetchXml,
                    "Fetch.xsd",
                    $"offline-profile:{tableName}",
                    issues))
            {
                continue;
            }

            items.Add(new(
                tableName,
                fetchXml,
                item.DescendantsNamed("Relationship")
                    .Select(relationship =>
                        relationship.AttributeValue("Name")
                        ?? relationship.Value.Trim())
                    .Where(name => !string.IsNullOrWhiteSpace(name))
                    .Select(name => name!)
                    .ToArray())
            {
                MaximumRecordCount = ParseNullableInteger(
                    item.ChildValue("RecordsOwnedByMe")),
                IsReadOnly = ParseBoolean(
                    item.ChildValue("IsReadOnly"),
                    defaultValue: false),
            });
        }

        return new(
            profileId,
            FirstNonBlank(
                selected.profile.ChildValue("Name"),
                selected.profile.AttributeValue("name"),
                profileId.ToString(
                    "D",
                    CultureInfo.InvariantCulture))!,
            items,
            selected.document.Sha256);
    }

    private WebResourceDefinition[] ParseWebResources(
        SolutionPackage package,
        List<PackageXmlDocument> documents,
        SolutionIdentity identity,
        List<CompatibilityIssue> issues)
    {
        var result = new Dictionary<Guid, WebResourceDefinition>();
        foreach (var document in documents)
        {
            foreach (var source in document.Document
                .DescendantsNamed("WebResource"))
            {
                if (!SolutionDiscoveryService.TryParseGuid(
                        FirstNonBlank(
                            source.ChildValue("WebResourceId"),
                            source.AttributeValue("WebResourceId"),
                            source.AttributeValue("id")),
                        out var id))
                {
                    continue;
                }

                var name = FirstNonBlank(
                    source.ChildValue("Name"),
                    source.AttributeValue("Name"));
                if (string.IsNullOrWhiteSpace(name))
                {
                    continue;
                }

                var resourceEntry = FindResourceEntry(package, name);
                var hash = resourceEntry is null
                    ? Hash(Encoding.UTF8.GetBytes(
                        source.ToString(SaveOptions.DisableFormatting)))
                    : Hash(resourceEntry.Content);
                var provenance = importPolicy.CreateProvenance(
                    identity,
                    id.ToString("D", CultureInfo.InvariantCulture),
                    name,
                    hash);
                var decision = CleanRoomComponentPolicy.Evaluate(provenance);
                AddProvenanceIssue(
                    provenance,
                    id.ToString("D", CultureInfo.InvariantCulture),
                    issues);
                var kind = ParseWebResourceKind(
                    ParseInteger(FirstNonBlank(
                        source.ChildValue("WebResourceType"),
                        source.AttributeValue("WebResourceType"))));
                var compatibility = decision.Disposition switch
                {
                    ComponentDisposition.CustomerExecutable
                        when kind is WebResourceKind.JavaScript =>
                            CompatibilityDisposition.Native,
                    ComponentDisposition.CustomerExecutable
                        when kind is WebResourceKind.Html
                        or WebResourceKind.Css =>
                            CompatibilityDisposition.Transpilable,
                    ComponentDisposition.CustomerExecutable =>
                        CompatibilityDisposition.Native,
                    ComponentDisposition.CleanRoomNative =>
                        CompatibilityDisposition.Fallback,
                    ComponentDisposition.VendorAdapter =>
                        CompatibilityDisposition.OnlineOnly,
                    _ => CompatibilityDisposition.Blocked,
                };
                result.TryAdd(
                    id,
                    new(
                        id,
                        name,
                        kind,
                        resourceEntry?.Path ?? $"WebResources/{name}",
                        hash,
                        provenance)
                    {
                        Dependencies = resourceEntry is null
                            ? []
                            : DiscoverWebResourceDependencies(
                                name,
                                resourceEntry),
                        Compatibility = compatibility,
                    });
            }
        }

        return result.Values
            .OrderBy(resource => resource.Name, StringComparer.Ordinal)
            .ToArray();
    }

    private CodeComponentDefinition[] ParseCodeComponents(
        SolutionPackage package,
        SolutionIdentity identity,
        List<CompatibilityIssue> issues)
    {
        var result = new Dictionary<string, CodeComponentDefinition>(
            StringComparer.OrdinalIgnoreCase);
        foreach (var entry in package.Entries.Where(entry =>
            entry.Path.EndsWith(
                "ControlManifest.Input.xml",
                StringComparison.OrdinalIgnoreCase)))
        {
            XDocument document;
            try
            {
                using var stream = entry.OpenRead();
                document = SecureXml.Load(stream);
            }
            catch (XmlException exception)
            {
                issues.Add(new(
                    "invalid-pcf-manifest",
                    CompatibilitySeverity.Error,
                    entry.Path,
                    exception.Message,
                    "Correct the PCF manifest before activation."));
                continue;
            }

            var control = document.DescendantsNamed("control")
                .FirstOrDefault();
            if (control is null)
            {
                continue;
            }

            var name = control.AttributeValue("constructor")
                ?? control.AttributeValue("name");
            var componentNamespace = control.AttributeValue("namespace");
            if (string.IsNullOrWhiteSpace(name)
                || string.IsNullOrWhiteSpace(componentNamespace))
            {
                issues.Add(new(
                    "incomplete-pcf-manifest",
                    CompatibilitySeverity.Error,
                    entry.Path,
                    "The PCF manifest has no namespace or constructor name.",
                    "Correct the component manifest."));
                continue;
            }

            var uniqueName = $"{componentNamespace}.{name}";
            var provenance = importPolicy.CreateProvenance(
                identity,
                uniqueName,
                uniqueName,
                Hash(entry.Content));
            var decision = CleanRoomComponentPolicy.Evaluate(provenance);
            AddProvenanceIssue(provenance, uniqueName, issues);
            var datasets = control.DescendantsNamed("data-set").ToArray();
            var controlType = control.AttributeValue("control-type");
            var kind = string.Equals(
                    controlType,
                    "virtual",
                    StringComparison.OrdinalIgnoreCase)
                ? CodeComponentKind.Virtual
                : datasets.Length > 0
                    ? CodeComponentKind.Dataset
                    : CodeComponentKind.Field;
            var compatibility = decision.Disposition switch
            {
                ComponentDisposition.CustomerExecutable
                    when kind is not CodeComponentKind.Virtual =>
                        CompatibilityDisposition.Transpilable,
                ComponentDisposition.CleanRoomNative =>
                    CompatibilityDisposition.Fallback,
                ComponentDisposition.VendorAdapter =>
                    CompatibilityDisposition.OnlineOnly,
                _ => CompatibilityDisposition.Blocked,
            };

            result.TryAdd(
                uniqueName,
                new(
                    name,
                    componentNamespace,
                    kind,
                    control.AttributeValue("version") ?? "0.0.0",
                    provenance)
                {
                    SourceManifestPath = entry.Path,
                    Properties = control.DescendantsNamed("property")
                        .Select(property => new
                            CodeComponentPropertyDefinition(
                                property.AttributeValue("name")
                                    ?? string.Empty,
                                property.AttributeValue("usage")
                                    ?? "bound",
                                property.AttributeValue("of-type")
                                    ?? property.AttributeValue("of-type-group")
                                    ?? "SingleLine.Text",
                                ParseBoolean(
                                    property.AttributeValue("required"),
                                    defaultValue: false),
                                property.AttributeValue("default-value")))
                        .Where(property => property.Name.Length > 0)
                        .ToArray(),
                    ResourceNames = control.ElementNamed("resources")
                        ?.Elements()
                        .Select(resource =>
                            resource.AttributeValue("path"))
                        .Where(path => !string.IsNullOrWhiteSpace(path))
                        .Select(path => path!)
                        .ToArray()
                        ?? [],
                    RequiredFeatures = control
                        .DescendantsNamed("uses-feature")
                        .Select(feature => feature.AttributeValue("name"))
                        .Where(name => !string.IsNullOrWhiteSpace(name))
                        .Select(name => name!)
                        .ToArray(),
                    Compatibility = compatibility,
                });
        }

        return result.Values
            .OrderBy(
                component => component.Namespace,
                StringComparer.Ordinal)
            .ThenBy(component => component.Name, StringComparer.Ordinal)
            .ToArray();
    }

    private static RelationshipDefinition[] ParseRelationships(
        XElement entity,
        string tableLogicalName)
    {
        var relationships = new List<RelationshipDefinition>();
        foreach (var relationship in entity
            .DescendantsNamed("EntityRelationship"))
        {
            var schemaName = FirstNonBlank(
                relationship.AttributeValue("Name"),
                relationship.ChildValue("Name"),
                relationship.ChildValue("SchemaName"));
            if (string.IsNullOrWhiteSpace(schemaName))
            {
                continue;
            }

            relationships.Add(new(
                schemaName,
                FirstNonBlank(
                    relationship.ChildValue("ReferencingEntityName"),
                    tableLogicalName)!,
                FirstNonBlank(
                    relationship.ChildValue("ReferencingAttributeName"),
                    string.Empty)!,
                FirstNonBlank(
                    relationship.ChildValue("ReferencedEntityName"),
                    tableLogicalName)!,
                FirstNonBlank(
                    relationship.ChildValue("ReferencedAttributeName"),
                    string.Empty)!,
                ParseRelationshipKind(
                    relationship.AttributeValue("Type")
                    ?? relationship.ChildValue("Type")),
                ParseBoolean(
                    relationship.ChildValue("IsCustomizable"),
                    defaultValue: true)));
        }

        return relationships.ToArray();
    }

    private static AlternateKeyDefinition[] ParseAlternateKeys(
        XElement entity) =>
        entity.DescendantsNamed("EntityKey")
            .Select(key =>
            {
                var name = FirstNonBlank(
                    key.AttributeValue("Name"),
                    key.ChildValue("Name"),
                    key.ChildValue("SchemaName"));
                var columns = key.DescendantsNamed("Attribute")
                    .Select(attribute =>
                        attribute.AttributeValue("Name")
                        ?? attribute.Value.Trim())
                    .Where(value => !string.IsNullOrWhiteSpace(value))
                    .Select(value => value!.ToLowerInvariant())
                    .ToArray();
                return string.IsNullOrWhiteSpace(name)
                    ? null
                    : new AlternateKeyDefinition(name, columns);
            })
            .OfType<AlternateKeyDefinition>()
            .ToArray();

    private static string? ParseTableLogicalName(XElement entity)
    {
        var nameNode = entity.ElementNamed("Name");
        var inner = entity.ElementNamed("EntityInfo")
                ?.DescendantsNamed("entity")
                .FirstOrDefault()
            ?? entity.ElementsNamed("entity").FirstOrDefault();
        return FirstNonBlank(
                entity.AttributeValue("LogicalName"),
                inner?.AttributeValue("LogicalName"),
                inner?.AttributeValue("Name"),
                nameNode?.Value)
            ?.ToLowerInvariant();
    }

    private static XElement? FindSiteMap(
        List<PackageXmlDocument> documents,
        ModelDrivenAppDescriptor selectedApp)
    {
        var appDocument = documents.FirstOrDefault(document =>
            string.Equals(
                document.Path,
                selectedApp.SourcePath,
                StringComparison.OrdinalIgnoreCase));
        var appElement = appDocument?.Document is null
            ? null
            : SolutionDiscoveryService
                .AppModuleElements(appDocument.Document)
                .FirstOrDefault(element =>
                    SolutionDiscoveryService.TryParseGuid(
                        SolutionDiscoveryService.FirstValue(
                            element,
                            "AppModuleId",
                            "AppId",
                            "id"),
                        out var id)
                    && id == selectedApp.AppModuleId);
        var nestedSiteMap = appElement?.DescendantsNamed("SiteMap")
            .FirstOrDefault();
        if (nestedSiteMap is not null)
        {
            return nestedSiteMap;
        }

        var siteMapText = appElement?.DescendantsNamed("SiteMapXml")
            .FirstOrDefault()
            ?.Value
            .Trim();
        if (!string.IsNullOrWhiteSpace(siteMapText)
            && siteMapText[0] == '<')
        {
            try
            {
                return SecureXml.Parse(siteMapText).Root;
            }
            catch (XmlException)
            {
                return null;
            }
        }

        return documents
            .Where(document => document.Path.Contains(
                "SiteMap",
                StringComparison.OrdinalIgnoreCase))
            .Select(document => document.Document.Root)
            .FirstOrDefault(root => root is not null
                && string.Equals(
                    root.Name.LocalName,
                    "SiteMap",
                    StringComparison.OrdinalIgnoreCase));
    }

    private static string NavigationLabel(
        XElement element,
        string fallback) =>
        element.ElementNamed("Titles")
            ?.ElementsNamed("Title")
            .Select(title => title.AttributeValue("Description"))
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value))
        ?? element.AttributeValue("Title")
        ?? fallback;

    private static SolutionPackageEntry? FindResourceEntry(
        SolutionPackage package,
        string name)
    {
        var normalizedName = name
            .Replace('\\', '/')
            .TrimStart('/');
        return package.Entries.FirstOrDefault(entry =>
            string.Equals(
                entry.Path,
                normalizedName,
                StringComparison.OrdinalIgnoreCase)
            || string.Equals(
                entry.Path,
                $"WebResources/{normalizedName}",
                StringComparison.OrdinalIgnoreCase)
            || entry.Path.EndsWith(
                $"/{normalizedName}",
                StringComparison.OrdinalIgnoreCase));
    }

    private static string[] DiscoverWebResourceDependencies(
        string resourceName,
        SolutionPackageEntry entry)
    {
        if (!entry.Path.EndsWith(".html", StringComparison.OrdinalIgnoreCase)
            && !entry.Path.EndsWith(".css", StringComparison.OrdinalIgnoreCase)
            && !entry.Path.EndsWith(".js", StringComparison.OrdinalIgnoreCase))
        {
            return [];
        }

        var directory = resourceName.Replace('\\', '/');
        var separatorIndex = directory.LastIndexOf('/');
        directory = separatorIndex < 0
            ? string.Empty
            : directory[..separatorIndex];
        var dependencies = new HashSet<string>(
            StringComparer.OrdinalIgnoreCase);

        foreach (Match match in ResourceReferenceRegex().Matches(
            entry.ReadText()))
        {
            var reference = match.Groups["path"].Value.Trim();
            var normalized = NormalizeResourceReference(
                directory,
                reference);
            if (normalized is not null)
            {
                dependencies.Add(normalized);
            }
        }

        return dependencies
            .OrderBy(value => value, StringComparer.Ordinal)
            .ToArray();
    }

    private static string? NormalizeResourceReference(
        string directory,
        string reference)
    {
        var path = reference.Split(['?', '#'], 2)[0].Trim();
        if (path.Length == 0
            || path.StartsWith("data:", StringComparison.OrdinalIgnoreCase)
            || Uri.TryCreate(path, UriKind.Absolute, out _))
        {
            return null;
        }

        const string directive = "$webresource:";
        if (path.StartsWith(directive, StringComparison.OrdinalIgnoreCase))
        {
            path = path[directive.Length..];
        }
        else if (path.StartsWith(
            "/WebResources/",
            StringComparison.OrdinalIgnoreCase))
        {
            path = path["/WebResources/".Length..];
        }
        else if (path[0] == '/')
        {
            path = path[1..];
        }
        else if (directory.Length > 0)
        {
            path = $"{directory}/{path}";
        }

        var segments = new List<string>();
        foreach (var segment in path
            .Replace('\\', '/')
            .Split('/', StringSplitOptions.RemoveEmptyEntries))
        {
            if (segment == ".")
            {
                continue;
            }

            if (segment == "..")
            {
                if (segments.Count == 0)
                {
                    return null;
                }

                segments.RemoveAt(segments.Count - 1);
                continue;
            }

            segments.Add(segment);
        }

        return segments.Count == 0 ? null : string.Join('/', segments);
    }

    private static string InnerOrText(XElement? container)
    {
        if (container is null)
        {
            return string.Empty;
        }

        var child = container.Elements().FirstOrDefault();
        return child is null
            ? container.Value.Trim()
            : child.ToString(SaveOptions.DisableFormatting);
    }

    private static int ParseFormType(XElement systemForm)
    {
        var value = FirstNonBlank(
            systemForm.ChildValue("type"),
            systemForm.AttributeValue("type"),
            systemForm.Parent?.AttributeValue("type"));
        if (int.TryParse(
                value,
                NumberStyles.Integer,
                CultureInfo.InvariantCulture,
                out var numericType))
        {
            return numericType;
        }

        return value?.ToUpperInvariant() switch
        {
            "MAIN" => 2,
            "QUICK" or "QUICKCREATE" => 7,
            "CARD" => 11,
            _ => 0,
        };
    }

    private static ColumnRequiredLevel ParseRequiredLevel(string? value) =>
        value?.ToUpperInvariant() switch
        {
            "RECOMMENDED" => ColumnRequiredLevel.Recommended,
            "REQUIRED" => ColumnRequiredLevel.Required,
            "SYSTEMREQUIRED" => ColumnRequiredLevel.SystemRequired,
            _ => ColumnRequiredLevel.None,
        };

    private static RelationshipKind ParseRelationshipKind(string? value) =>
        value?.ToUpperInvariant() switch
        {
            "MANYTOMANY" or "N:N" => RelationshipKind.ManyToMany,
            "MANYTOONE" or "N:1" => RelationshipKind.ManyToOne,
            _ => RelationshipKind.OneToMany,
        };

    private static WebResourceKind ParseWebResourceKind(int value) =>
        Enum.IsDefined(typeof(WebResourceKind), value)
            ? (WebResourceKind)value
            : WebResourceKind.Unknown;

    private static bool ParseBoolean(string? value, bool defaultValue)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return defaultValue;
        }

        return value.Trim().ToUpperInvariant() switch
        {
            "1" or "TRUE" or "YES" => true,
            "0" or "FALSE" or "NO" => false,
            _ => defaultValue,
        };
    }

    private static int ParseInteger(string? value) =>
        int.TryParse(
            value,
            NumberStyles.Integer,
            CultureInfo.InvariantCulture,
            out var parsed)
                ? parsed
                : 0;

    private static int? ParseNullableInteger(string? value) =>
        int.TryParse(
            value,
            NumberStyles.Integer,
            CultureInfo.InvariantCulture,
            out var parsed)
                ? parsed
                : null;

    private static decimal? ParseNullableDecimal(string? value) =>
        decimal.TryParse(
            value,
            NumberStyles.Number,
            CultureInfo.InvariantCulture,
            out var parsed)
                ? parsed
                : null;

    private static string? FirstNonBlank(params string?[] values) =>
        values.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value))
            ?.Trim();

    private static string Hash(ReadOnlySpan<byte> content) =>
        Convert.ToHexString(SHA256.HashData(content)).ToLowerInvariant();

    private bool ValidateFragment(
        string xml,
        string schemaFile,
        string componentId,
        List<CompatibilityIssue> issues)
    {
        using var stream = new MemoryStream(
            Encoding.UTF8.GetBytes(xml),
            writable: false);
        var validation = schemaCatalog.Validate(stream, schemaFile);
        foreach (var issue in validation.Issues.Take(100))
        {
            issues.Add(new(
                "xsd-validation",
                schemaValidationBehavior is SchemaValidationBehavior.Strict
                    && issue.Severity is XmlSeverityType.Error
                        ? CompatibilitySeverity.Blocking
                        : CompatibilitySeverity.Warning,
                componentId,
                issue.Message,
                $"Validate this component against {schemaFile}."));
        }

        return validation.IsValid
            || schemaValidationBehavior is SchemaValidationBehavior.ReportOnly;
    }

    private static void AddProvenanceIssue(
        ComponentProvenance provenance,
        string componentId,
        List<CompatibilityIssue> issues)
    {
        var decision = CleanRoomComponentPolicy.Evaluate(provenance);
        switch (decision.Disposition)
        {
            case ComponentDisposition.Blocked:
                issues.Add(new(
                    "component-provenance-blocked",
                    CompatibilitySeverity.Blocking,
                    componentId,
                    decision.Reason,
                    "Configure an explicit solution and publisher ownership policy."));
                break;
            case ComponentDisposition.VendorAdapter:
                issues.Add(new(
                    "vendor-adapter-required",
                    CompatibilitySeverity.Warning,
                    componentId,
                    decision.Reason,
                    "Register a vendor-supported native adapter or keep the component online-only."));
                break;
            case ComponentDisposition.CleanRoomNative:
                issues.Add(new(
                    "clean-room-native-required",
                    CompatibilitySeverity.Information,
                    componentId,
                    decision.Reason,
                    "Use the corresponding VerseOff native behavior."));
                break;
        }
    }

    [GeneratedRegex(
        """(?ix)(?:src|href)\s*=\s*["'](?<path>[^"'<>]+)["']|\$webresource:(?<path>[A-Za-z0-9_./-]+)""",
        RegexOptions.CultureInvariant)]
    private static partial Regex ResourceReferenceRegex();

    private sealed record PackageXmlDocument(
        string Path,
        XDocument Document,
        string Sha256);
}
