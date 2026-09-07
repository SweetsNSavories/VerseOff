using System.Collections.Concurrent;
using System.Globalization;
using System.IO;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using VerseOff.Domain;

namespace VerseOff.Metadata;

/// <summary>
/// Clean-room implementation of standard Microsoft Dynamics 365 / Dataverse
/// Out-Of-The-Box (OOTB) component resolver.
/// Delivers standard forms, views, dashboards, and navigation conforming to published
/// Power Platform XML Schema Definitions (FormXml.xsd, Fetch.xsd, SiteMap.xsd).
/// Contains zero proprietary Microsoft scripts or internal cloud endpoints.
/// </summary>
public sealed class BundledOOTBCatalog : IOOTBComponentResolver
{
    private static readonly Lazy<BundledOOTBCatalog> LazyInstance =
        new(() => new BundledOOTBCatalog());

    public static BundledOOTBCatalog Instance => LazyInstance.Value;

    private readonly PublishedSchemaCatalog schemaCatalog;
    private readonly SiteMapGenerator siteMapGenerator;
    private readonly ConcurrentDictionary<string, FormDefinition> formCache = new(StringComparer.OrdinalIgnoreCase);
    private readonly ConcurrentDictionary<string, ViewDefinition> viewCache = new(StringComparer.OrdinalIgnoreCase);
    private readonly ConcurrentDictionary<Guid, FormDefinition> dashboardCache = new();

    // Standard Control Class IDs (Clean-room constants from published FormXml specifications)
    public const string TextControlClassId = "{4273EDBD-AC1D-40d3-9FB2-095C621B552D}";
    public const string MemoControlClassId = "{E0DBA600-D4C9-4b3c-B907-80E10892AD0E}";
    public const string ChoiceControlClassId = "{3EF39988-22BB-4f0b-BBBE-64B5A3748F10}";
    public const string CurrencyControlClassId = "{533B9E00-756B-4312-95A0-DC888637AC79}";
    public const string IntegerControlClassId = "{C6D124CA-7EDA-4a60-AEA9-7FB8D318B68F}";
    public const string DecimalControlClassId = "{C3EFE0C3-0EC6-42be-8349-CBD9079DFD8E}";
    public const string DateTimeControlClassId = "{5B773807-9FB2-42db-97C3-7A91EFF8ADFF}";
    public const string LookupControlClassId = "{270BD3DB-D9AF-4782-9025-509E298B0578}";
    public const string CustomerControlClassId = "{CB624414-7551-420a-9694-B2A6058097D7}";

    // Well-Known OOTB Form IDs
    public static readonly Guid QuoteMainFormId = Guid.Parse("d8c368d1-d2c0-43e9-9a25-78e8b2bfdf2a");
    public static readonly Guid AccountMainFormId = Guid.Parse("2f3fdbf9-8d4e-48bc-bb0c-9bd9a6c1d3bd");
    public static readonly Guid ContactMainFormId = Guid.Parse("b2053da5-74de-4d7a-8b8d-6b5895e69bf0");
    public static readonly Guid OpportunityMainFormId = Guid.Parse("8448b78f-8f42-454e-8e2a-f8196b0419af");
    public static readonly Guid LeadMainFormId = Guid.Parse("420e3099-9ea2-4519-a08a-2d626d6fb48e");
    public static readonly Guid IncidentMainFormId = Guid.Parse("e61b369c-0917-48f8-a006-25816c2763f2");
    public static readonly Guid TaskMainFormId = Guid.Parse("4b63ff5a-b620-4363-8a30-366050bda14c");
    public static readonly Guid AppointmentMainFormId = Guid.Parse("bf1fb542-a8c2-4682-95f2-95f32b1a1dd7");
    public static readonly Guid PhoneCallMainFormId = Guid.Parse("5ba6e7ae-59b3-4011-8e01-c8cae554d19d");
    public static readonly Guid EmailMainFormId = Guid.Parse("017e8832-6bb5-48b8-b4b6-75ab8a06e3e5");

    // Well-Known OOTB View IDs
    public static readonly Guid ActiveQuotesViewId = Guid.Parse("00000000-0000-0000-00aa-000010001004");
    public static readonly Guid DraftQuotesViewId = Guid.Parse("00000000-0000-0000-00aa-000010001005");
    public static readonly Guid WonQuotesViewId = Guid.Parse("00000000-0000-0000-00aa-000010001006");
    public static readonly Guid ActiveAccountsViewId = Guid.Parse("00000000-0000-0000-00aa-000010001002");
    public static readonly Guid ActiveContactsViewId = Guid.Parse("00000000-0000-0000-00aa-000010001003");
    public static readonly Guid OpenOpportunitiesViewId = Guid.Parse("00000000-0000-0000-00aa-000010001007");
    public static readonly Guid OpenLeadsViewId = Guid.Parse("00000000-0000-0000-00aa-000010001008");
    public static readonly Guid ActiveCasesViewId = Guid.Parse("00000000-0000-0000-00aa-000010001009");

    // Well-Known OOTB Dashboards
    public static readonly Guid SalesActivityDashboardId = Guid.Parse("00000000-0000-0000-0000-000000000001");
    public static readonly Guid ServiceActivityDashboardId = Guid.Parse("00000000-0000-0000-0000-000000000002");

    private static readonly Dictionary<Guid, string> StandardFormIdToTable = new()
    {
        [QuoteMainFormId] = "quote",
        [AccountMainFormId] = "account",
        [ContactMainFormId] = "contact",
        [OpportunityMainFormId] = "opportunity",
        [LeadMainFormId] = "lead",
        [IncidentMainFormId] = "incident",
        [TaskMainFormId] = "task",
        [AppointmentMainFormId] = "appointment",
        [PhoneCallMainFormId] = "phonecall",
        [EmailMainFormId] = "email",
    };

    private static readonly Dictionary<Guid, string> StandardViewIdToTable = new()
    {
        [ActiveQuotesViewId] = "quote",
        [DraftQuotesViewId] = "quote",
        [WonQuotesViewId] = "quote",
        [ActiveAccountsViewId] = "account",
        [ActiveContactsViewId] = "contact",
        [OpenOpportunitiesViewId] = "opportunity",
        [OpenLeadsViewId] = "lead",
        [ActiveCasesViewId] = "incident",
    };

    public BundledOOTBCatalog(
        PublishedSchemaCatalog? schemaCatalog = null,
        SiteMapGenerator? siteMapGenerator = null)
    {
        this.schemaCatalog = schemaCatalog ?? PublishedSchemaCatalog.Default;
        this.siteMapGenerator = siteMapGenerator ?? new SiteMapGenerator();
    }

    /// <inheritdoc />
    public FormDefinition? TryGetForm(Guid formId, string tableLogicalName)
    {
        if (string.IsNullOrWhiteSpace(tableLogicalName))
        {
            return null;
        }

        var normalizedTable = tableLogicalName.Trim().ToLowerInvariant();

        if (formId != Guid.Empty && StandardFormIdToTable.TryGetValue(formId, out var ownerTable))
        {
            if (!string.Equals(ownerTable, normalizedTable, StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }
        }

        // Check if formId matches a known main form, or is Guid.Empty (default)
        var knownFormId = GetStandardFormId(normalizedTable);
        if (formId != Guid.Empty && knownFormId.HasValue && formId != knownFormId.Value)
        {
            var customKey = $"{normalizedTable}_{formId:N}";
            if (this.formCache.TryGetValue(customKey, out var cachedCustom))
            {
                return cachedCustom;
            }

            var builtCustom = BuildFormForTable(normalizedTable, formId);
            if (builtCustom is not null)
            {
                this.formCache[customKey] = builtCustom;
            }

            return builtCustom;
        }

        if (this.formCache.TryGetValue(normalizedTable, out var cachedMain))
        {
            return cachedMain;
        }

        var builtMain = BuildFormForTable(normalizedTable, knownFormId ?? Guid.NewGuid());
        if (builtMain is not null)
        {
            this.formCache[normalizedTable] = builtMain;
        }

        return builtMain;
    }

    /// <summary>
    /// Gets the standard OOTB main form for a table by logical name.
    /// </summary>
    public FormDefinition? TryGetForm(string tableLogicalName) =>
        TryGetForm(Guid.Empty, tableLogicalName);

    /// <inheritdoc />
    public ViewDefinition? TryGetView(Guid viewId, string tableLogicalName)
    {
        if (string.IsNullOrWhiteSpace(tableLogicalName))
        {
            return null;
        }

        var normalizedTable = tableLogicalName.Trim().ToLowerInvariant();

        if (viewId != Guid.Empty && StandardViewIdToTable.TryGetValue(viewId, out var ownerTable))
        {
            if (!string.Equals(ownerTable, normalizedTable, StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }
        }

        var cacheKey = viewId == Guid.Empty
            ? normalizedTable
            : $"{normalizedTable}_{viewId:N}";

        if (this.viewCache.TryGetValue(cacheKey, out var cachedView))
        {
            return cachedView;
        }

        var builtView = BuildViewForTable(normalizedTable, viewId);
        if (builtView is not null)
        {
            this.viewCache[cacheKey] = builtView;
        }

        return builtView;
    }

    /// <summary>
    /// Gets the standard default active view for a table by logical name.
    /// </summary>
    public ViewDefinition? TryGetView(string tableLogicalName) =>
        TryGetView(Guid.Empty, tableLogicalName);

    /// <summary>
    /// Gets an OOTB dashboard by ID.
    /// </summary>
    public FormDefinition? TryGetDashboard(Guid dashboardId)
    {
        return this.dashboardCache.GetOrAdd(dashboardId, id =>
        {
            if (id == SalesActivityDashboardId)
            {
                return BuildDashboard(id, "Sales Activity Dashboard");
            }
            if (id == ServiceActivityDashboardId)
            {
                return BuildDashboard(id, "Customer Service Dashboard");
            }
            return BuildDashboard(id, "Overview Dashboard");
        });
    }

    /// <summary>
    /// Gets an OOTB dashboard by name.
    /// </summary>
    public FormDefinition? TryGetDashboard(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        if (name.Contains("Sales", StringComparison.OrdinalIgnoreCase))
        {
            return TryGetDashboard(SalesActivityDashboardId);
        }
        if (name.Contains("Service", StringComparison.OrdinalIgnoreCase))
        {
            return TryGetDashboard(ServiceActivityDashboardId);
        }

        return TryGetDashboard(Guid.NewGuid());
    }

    /// <inheritdoc />
    public IReadOnlyList<NavigationDefinition> GenerateDefaultNavigation(
        IReadOnlyList<string> tableLogicalNames,
        IReadOnlyList<TableDefinition> tables)
    {
        ArgumentNullException.ThrowIfNull(tableLogicalNames);
        ArgumentNullException.ThrowIfNull(tables);

        if (tableLogicalNames.Count == 0)
        {
            return [];
        }

        var siteMapXml = this.siteMapGenerator.GenerateSiteMap(
            tableLogicalNames,
            tables,
            validateAgainstSchema: true);

        return ParseSiteMapToNavigation(siteMapXml);
    }

    private static Guid? GetStandardFormId(string tableLogicalName) =>
        tableLogicalName switch
        {
            "quote" => QuoteMainFormId,
            "account" => AccountMainFormId,
            "contact" => ContactMainFormId,
            "opportunity" => OpportunityMainFormId,
            "lead" => LeadMainFormId,
            "incident" => IncidentMainFormId,
            "task" => TaskMainFormId,
            "appointment" => AppointmentMainFormId,
            "phonecall" => PhoneCallMainFormId,
            "email" => EmailMainFormId,
            _ => null,
        };

    private FormDefinition? BuildFormForTable(string tableLogicalName, Guid formId)
    {
        if (!StandardCdmTables.Definitions.TryGetValue(tableLogicalName, out var table))
        {
            return null;
        }

        var formName = $"{table.DisplayName ?? tableLogicalName} Main Form";
        var formXml = GenerateCleanRoomFormXml(table);

        // Validate XML against FormXml.xsd schema
        ValidateXmlAgainstSchema(formXml, "FormXml.xsd", formId.ToString("D", CultureInfo.InvariantCulture));

        var provenance = new ComponentProvenance(
            formId.ToString("D", CultureInfo.InvariantCulture),
            formName,
            ComponentOrigin.VerseOffOwned,
            "VerseOff.BundledOOTB",
            "VerseOff",
            Hash(Encoding.UTF8.GetBytes(formXml)),
            IsManaged: true,
            OwnershipVerified: true);

        var document = SecureXml.Parse(formXml);
        return FormXmlParser.Parse(
            document,
            formId,
            formName,
            tableLogicalName,
            formType: 2, // Main Form
            provenance,
            table.Columns);
    }

    private static string GenerateCleanRoomFormXml(TableDefinition table)
    {
        var fieldsToInclude = GetFormFieldsForTable(table);
        var sb = new StringBuilder();
        sb.AppendLine("""<form>""");
        sb.AppendLine("""  <tabs>""");
        sb.AppendLine(CultureInfo.InvariantCulture, $"""    <tab name="general" verticallayout="true" id="{Guid.NewGuid():D}">""");
        sb.AppendLine("""      <labels>""");
        sb.AppendLine("""        <label description="General" languagecode="1033" />""");
        sb.AppendLine("""      </labels>""");
        sb.AppendLine("""      <columns>""");
        sb.AppendLine("""        <column width="100%">""");
        sb.AppendLine("""          <sections>""");
        sb.AppendLine(CultureInfo.InvariantCulture, $"""            <section name="summary" showlabel="true" showbar="false" id="{Guid.NewGuid():D}">""");
        sb.AppendLine("""              <labels>""");
        sb.AppendLine(CultureInfo.InvariantCulture, $"""                <label description="{table.DisplayName ?? "Summary"}" languagecode="1033" />""");
        sb.AppendLine("""              </labels>""");
        sb.AppendLine("""              <rows>""");

        foreach (var col in fieldsToInclude)
        {
            var classId = GetControlClassId(col);
            var label = FormatLabel(col.LogicalName);

            sb.AppendLine("""                <row>""");
            sb.AppendLine(CultureInfo.InvariantCulture, $"""                  <cell id="{Guid.NewGuid():D}">""");
            sb.AppendLine("""                    <labels>""");
            sb.AppendLine(CultureInfo.InvariantCulture, $"""                      <label description="{label}" languagecode="1033" />""");
            sb.AppendLine("""                    </labels>""");
            sb.AppendLine(CultureInfo.InvariantCulture, $"""                    <control id="{col.LogicalName}" classid="{classId}" datafieldname="{col.LogicalName}" />""");
            sb.AppendLine("""                  </cell>""");
            sb.AppendLine("""                </row>""");
        }

        sb.AppendLine("""              </rows>""");
        sb.AppendLine("""            </section>""");
        sb.AppendLine("""          </sections>""");
        sb.AppendLine("""        </column>""");
        sb.AppendLine("""      </columns>""");
        sb.AppendLine("""    </tab>""");
        sb.AppendLine("""  </tabs>""");
        sb.AppendLine("""</form>""");

        return sb.ToString();
    }

    private ViewDefinition? BuildViewForTable(string tableLogicalName, Guid viewId)
    {
        if (!StandardCdmTables.Definitions.TryGetValue(tableLogicalName, out var table))
        {
            return null;
        }

        var isDefault = true;
        var viewGuid = viewId;
        string viewName;

        if (viewGuid == Guid.Empty)
        {
            viewGuid = GetStandardActiveViewId(tableLogicalName) ?? Guid.NewGuid();
            viewName = $"Active {table.DisplayCollectionName ?? table.DisplayName ?? tableLogicalName}";
        }
        else if (viewGuid == DraftQuotesViewId && tableLogicalName == "quote")
        {
            viewName = "Draft Quotes";
            isDefault = false;
        }
        else if (viewGuid == WonQuotesViewId && tableLogicalName == "quote")
        {
            viewName = "Won Quotes";
            isDefault = false;
        }
        else
        {
            viewName = $"Active {table.DisplayCollectionName ?? table.DisplayName ?? tableLogicalName}";
        }

        var (fetchXml, layoutXml, columns) = GenerateCleanRoomViewXml(table, viewName);

        // Validate FetchXML against Fetch.xsd
        ValidateXmlAgainstSchema(fetchXml, "Fetch.xsd", viewGuid.ToString("D", CultureInfo.InvariantCulture));

        var provenance = new ComponentProvenance(
            viewGuid.ToString("D", CultureInfo.InvariantCulture),
            viewName,
            ComponentOrigin.VerseOffOwned,
            "VerseOff.BundledOOTB",
            "VerseOff",
            Hash(Encoding.UTF8.GetBytes(fetchXml)),
            IsManaged: true,
            OwnershipVerified: true);

        return new ViewDefinition(
            viewGuid,
            viewName,
            tableLogicalName,
            fetchXml,
            layoutXml,
            isDefault,
            provenance)
        {
            Columns = columns,
        };
    }

    private static (string fetchXml, string layoutXml, List<ViewColumnDefinition> columns) GenerateCleanRoomViewXml(
        TableDefinition table,
        string viewName)
    {
        var cols = GetViewColumnsForTable(table);
        var primaryName = table.PrimaryNameAttribute ?? "name";
        var primaryId = table.PrimaryIdAttribute;

        var sbFetch = new StringBuilder();
        sbFetch.AppendLine("""<fetch mapping="logical">""");
        sbFetch.AppendLine(CultureInfo.InvariantCulture, $"""  <entity name="{table.LogicalName}">""");
        sbFetch.AppendLine(CultureInfo.InvariantCulture, $"""    <attribute name="{primaryId}" />""");

        foreach (var col in cols)
        {
            if (!string.Equals(col.LogicalName, primaryId, StringComparison.OrdinalIgnoreCase))
            {
                sbFetch.AppendLine(CultureInfo.InvariantCulture, $"""    <attribute name="{col.LogicalName}" />""");
            }
        }

        if (string.Equals(viewName, "Draft Quotes", StringComparison.OrdinalIgnoreCase))
        {
            sbFetch.AppendLine("""    <filter>""");
            sbFetch.AppendLine("""      <condition attribute="statecode" operator="eq" value="0" />""");
            sbFetch.AppendLine("""      <condition attribute="statuscode" operator="eq" value="1" />""");
            sbFetch.AppendLine("""    </filter>""");
        }
        else if (string.Equals(viewName, "Won Quotes", StringComparison.OrdinalIgnoreCase))
        {
            sbFetch.AppendLine("""    <filter>""");
            sbFetch.AppendLine("""      <condition attribute="statecode" operator="eq" value="2" />""");
            sbFetch.AppendLine("""    </filter>""");
        }
        else if (table.Columns.Any(c => c.LogicalName == "statecode"))
        {
            sbFetch.AppendLine("""    <filter>""");
            sbFetch.AppendLine("""      <condition attribute="statecode" operator="eq" value="0" />""");
            sbFetch.AppendLine("""    </filter>""");
        }

        sbFetch.AppendLine("""  </entity>""");
        sbFetch.AppendLine("""</fetch>""");

        var sbLayout = new StringBuilder();
        sbLayout.AppendLine(CultureInfo.InvariantCulture, $"""<grid name="result" jump="{primaryName}" select="1" preview="1" icon="1">""");
        sbLayout.AppendLine(CultureInfo.InvariantCulture, $"""  <row name="result" id="{primaryId}">""");

        var viewColumns = new List<ViewColumnDefinition>();
        var order = 0;

        foreach (var col in cols)
        {
            var width = GetColumnWidth(col);
            var isPrimary = string.Equals(col.LogicalName, primaryName, StringComparison.OrdinalIgnoreCase);

            sbLayout.AppendLine(CultureInfo.InvariantCulture, $"""    <cell name="{col.LogicalName}" width="{width}" />""");
            viewColumns.Add(new ViewColumnDefinition(col.LogicalName, width, order++, isPrimary));
        }

        sbLayout.AppendLine("""  </row>""");
        sbLayout.AppendLine("""</grid>""");

        return (sbFetch.ToString(), sbLayout.ToString(), viewColumns);
    }

    private static Guid? GetStandardActiveViewId(string tableLogicalName) =>
        tableLogicalName switch
        {
            "quote" => ActiveQuotesViewId,
            "account" => ActiveAccountsViewId,
            "contact" => ActiveContactsViewId,
            "opportunity" => OpenOpportunitiesViewId,
            "lead" => OpenLeadsViewId,
            "incident" => ActiveCasesViewId,
            _ => null,
        };

    private static FormDefinition BuildDashboard(Guid dashboardId, string name)
    {
        var provenance = new ComponentProvenance(
            dashboardId.ToString("D", CultureInfo.InvariantCulture),
            name,
            ComponentOrigin.VerseOffOwned,
            "VerseOff.BundledOOTB",
            "VerseOff",
            Hash(Encoding.UTF8.GetBytes(name)),
            IsManaged: true,
            OwnershipVerified: true);

        return new FormDefinition(
            dashboardId,
            name,
            "none",
            FormType: 0, // Dashboard
            [],
            provenance);
    }

    private static List<ColumnDefinition> GetFormFieldsForTable(TableDefinition table)
    {
        var candidates = new List<ColumnDefinition>();

        // Always put primary name attribute first
        if (!string.IsNullOrEmpty(table.PrimaryNameAttribute))
        {
            var primaryCol = table.Columns.FirstOrDefault(c =>
                string.Equals(c.LogicalName, table.PrimaryNameAttribute, StringComparison.OrdinalIgnoreCase));
            if (primaryCol is not null)
            {
                candidates.Add(primaryCol);
            }
        }

        // Table-specific priority columns
        var priorityNames = table.LogicalName switch
        {
            "quote" => new[] { "customerid", "totalamount", "statecode", "statuscode", "description", "pricelevelid", "opportunityid" },
            "account" => new[] { "telephone1", "emailaddress1", "revenue", "address1_city", "statecode" },
            "contact" => new[] { "firstname", "lastname", "emailaddress1", "telephone1", "parentcustomerid", "jobtitle" },
            "opportunity" => new[] { "parentaccountid", "customerid", "estimatedvalue", "estimatedclosedate", "closeprobability" },
            "lead" => new[] { "companyname", "telephone1", "emailaddress1", "subject" },
            "incident" => new[] { "ticketnumber", "customerid", "prioritycode", "casetypecode", "description" },
            _ => table.Columns
                .Where(c => c.CanRead && !c.LogicalName.EndsWith("id", StringComparison.OrdinalIgnoreCase) && c.LogicalName != "statecode" && c.LogicalName != "statuscode")
                .Select(c => c.LogicalName)
                .Take(6)
                .ToArray(),
        };

        foreach (var colName in priorityNames)
        {
            var col = table.Columns.FirstOrDefault(c =>
                string.Equals(c.LogicalName, colName, StringComparison.OrdinalIgnoreCase));
            if (col is not null && !candidates.Contains(col))
            {
                candidates.Add(col);
            }
        }

        return candidates;
    }

    private static List<ColumnDefinition> GetViewColumnsForTable(TableDefinition table)
    {
        var candidates = new List<ColumnDefinition>();

        // Always put primary name first
        if (!string.IsNullOrEmpty(table.PrimaryNameAttribute))
        {
            var primary = table.Columns.FirstOrDefault(c =>
                string.Equals(c.LogicalName, table.PrimaryNameAttribute, StringComparison.OrdinalIgnoreCase));
            if (primary is not null)
            {
                candidates.Add(primary);
            }
        }

        var priorityViewCols = table.LogicalName switch
        {
            "quote" => new[] { "customerid", "totalamount", "statecode" },
            "account" => new[] { "telephone1", "emailaddress1", "address1_city" },
            "contact" => new[] { "emailaddress1", "telephone1", "parentcustomerid" },
            "opportunity" => new[] { "parentaccountid", "estimatedvalue", "estimatedclosedate" },
            "lead" => new[] { "companyname", "telephone1", "emailaddress1" },
            "incident" => new[] { "ticketnumber", "customerid", "prioritycode" },
            _ => table.Columns
                .Where(c => c.CanRead && !c.LogicalName.EndsWith("id", StringComparison.OrdinalIgnoreCase))
                .Select(c => c.LogicalName)
                .Take(4)
                .ToArray(),
        };

        foreach (var colName in priorityViewCols)
        {
            var col = table.Columns.FirstOrDefault(c =>
                string.Equals(c.LogicalName, colName, StringComparison.OrdinalIgnoreCase));
            if (col is not null && !candidates.Contains(col))
            {
                candidates.Add(col);
            }
        }

        return candidates;
    }

    private static string GetControlClassId(ColumnDefinition column)
    {
        return column.AttributeType switch
        {
            "String" => TextControlClassId,
            "Memo" => MemoControlClassId,
            "Integer" => IntegerControlClassId,
            "Decimal" or "Double" => DecimalControlClassId,
            "Currency" => CurrencyControlClassId,
            "DateTime" => DateTimeControlClassId,
            "Lookup" => LookupControlClassId,
            "Customer" => CustomerControlClassId,
            "Boolean" or "Picklist" or "State" or "Status" => ChoiceControlClassId,
            _ => TextControlClassId,
        };
    }

    private static int GetColumnWidth(ColumnDefinition column)
    {
        return column.AttributeType switch
        {
            "Currency" or "Integer" or "Decimal" => 120,
            "DateTime" => 140,
            "Lookup" or "Customer" => 200,
            _ => 250,
        };
    }

    private static string FormatLabel(string fieldName)
    {
        if (string.IsNullOrEmpty(fieldName))
        {
            return fieldName;
        }

        var sb = new StringBuilder();
        sb.Append(char.ToUpperInvariant(fieldName[0]));
        for (var i = 1; i < fieldName.Length; i++)
        {
            var c = fieldName[i];
            if (char.IsUpper(c) || c == '_')
            {
                sb.Append(' ');
                if (c != '_')
                {
                    sb.Append(c);
                }
            }
            else
            {
                sb.Append(c);
            }
        }

        return sb.ToString().Trim();
    }

    private void ValidateXmlAgainstSchema(string xml, string schemaFile, string componentId)
    {
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes(xml), writable: false);
        var validation = this.schemaCatalog.Validate(stream, schemaFile);
        if (!validation.IsValid)
        {
            var firstError = validation.Issues.Count > 0 ? validation.Issues[0].Message : "Unknown validation issue";
            throw new InvalidOperationException(
                $"OOTB component '{componentId}' failed schema validation against '{schemaFile}': {firstError}");
        }
    }

    private static List<NavigationDefinition> ParseSiteMapToNavigation(XElement siteMap)
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

            foreach (var group in area.Elements("Group"))
            {
                var groupId = group.Attribute("Id")?.Value ?? $"group-{order}";
                var groupTitle = ExtractTitle(group);

                result.Add(new(groupId, groupTitle, null, null, order++)
                {
                    Kind = NavigationNodeKind.Group,
                    ParentId = areaId,
                });

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

    private static string ExtractTitle(XElement element)
    {
        var title = element.Element("Titles")?.Element("Title")?.Attribute("Title")?.Value;
        if (!string.IsNullOrWhiteSpace(title))
        {
            return title;
        }

        var desc = element.Element("Titles")?.Element("Title")?.Attribute("Description")?.Value;
        if (!string.IsNullOrWhiteSpace(desc))
        {
            return desc;
        }

        return element.Attribute("Id")?.Value ?? "Navigation";
    }

    private static string Hash(ReadOnlySpan<byte> content) =>
        Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(content)).ToLowerInvariant();
}
