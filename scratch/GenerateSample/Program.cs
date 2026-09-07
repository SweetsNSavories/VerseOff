using VerseOff.Domain;
using VerseOff.Generator;

var output = @"C:\vo-target";
if (Directory.Exists(output))
{
    Directory.Delete(output, recursive: true);
}

var provenance = new ComponentProvenance(
    "form",
    "contoso_bcdr_solution",
    ComponentOrigin.CustomerOwned,
    "contoso_solution",
    "contoso",
    new string('a', 64),
    IsManaged: false,
    OwnershipVerified: true);

// ==========================================
// 1. ACCOUNT (Sales / Service Shared)
// ==========================================
var tableAccount = new TableDefinition(
    "account",
    "accounts",
    "accountid",
    "name",
    IsActivity: false,
    [
        new("accountid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
        new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
        new("telephone1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("revenue", "Currency", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("emailaddress1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
    ])
{
    DisplayName = "Account",
};

var accountHeaderControls = new List<FormControlDefinition>
{
    new(
        "header_revenue",
        "revenue",
        FormControlKind.Currency,
        "{533B9E00-756B-4312-95A0-DC888637AC78}",
        IsVisible: true,
        IsDisabled: false)
    {
        Label = "Annual Revenue",
    },
};

var accountFooterControls = new List<FormControlDefinition>
{
    new(
        "footer_statecode",
        "statecode",
        FormControlKind.Number,
        "{C6D124CA-7ED1-4238-8940-F920A883835E}",
        IsVisible: true,
        IsDisabled: true)
    {
        Label = "Status Code",
    },
};

var timelineDefinition = new TimelineDefinition(
    "timeline_control",
    "{06375649-C143-495E-A496-C962E5B4488E}",
    "Timeline",
    "<control />",
    new Dictionary<string, string?>(),
    [
        TimelineModule.Activities,
        TimelineModule.Notes,
        TimelineModule.Posts,
    ],
    ["email", "phonecall", "task"],
    10,
    ShowFilterPane: true,
    ExpandFilterPane: false,
    SearchEnabled: true,
    ExpandAllByDefault: false,
    TimelineSortDirection.NewestToOldest,
    "sortdate",
    TimelineRollupType.None);

var accountTabs = new List<FormTabDefinition>
{
    new(
        "general",
        "General Information",
        IsVisible: true,
        IsExpanded: true,
        0,
        [
            new(
                50,
                [
                    new(
                        "summary",
                        "Account Summary",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(
                                0,
                                [
                                    new(
                                        "name-cell",
                                        "Account Name",
                                        IsVisible: true,
                                        ShowLabel: true,
                                        1,
                                        1,
                                        new(
                                            "name",
                                            "name",
                                            FormControlKind.Text,
                                            null,
                                            IsVisible: true,
                                            IsDisabled: false)
                                        {
                                            Label = "Account Name",
                                        }),
                                ]),
                            new(
                                1,
                                [
                                    new(
                                        "phone-cell",
                                        "Phone",
                                        IsVisible: true,
                                        ShowLabel: true,
                                        1,
                                        1,
                                        new(
                                            "telephone1",
                                            "telephone1",
                                            FormControlKind.Text,
                                            null,
                                            IsVisible: true,
                                            IsDisabled: false)
                                        {
                                            Label = "Main Phone",
                                        }),
                                ]),
                            new(
                                2,
                                [
                                    new(
                                        "email-cell",
                                        "Email",
                                        IsVisible: true,
                                        ShowLabel: true,
                                        1,
                                        1,
                                        new(
                                            "emailaddress1",
                                            "emailaddress1",
                                            FormControlKind.Text,
                                            null,
                                            IsVisible: true,
                                            IsDisabled: false)
                                        {
                                            Label = "Primary Email",
                                        }),
                                ]),
                        ]),
                    new(
                        "subgrid_section",
                        "Related Contacts",
                        IsVisible: true,
                        ShowLabel: true,
                        1,
                        [
                            new(
                                0,
                                [
                                    new(
                                        "contacts_cell",
                                        "Contacts",
                                        IsVisible: true,
                                        ShowLabel: false,
                                        1,
                                        1,
                                        new(
                                            "contacts_subgrid",
                                            null,
                                            FormControlKind.Subgrid,
                                            "{E7A81278-8635-4d9e-8D4D-59480B391C5B}",
                                            IsVisible: true,
                                            IsDisabled: false)
                                        {
                                            Label = "Contacts",
                                            RelationshipName = "account_contacts",
                                            ViewId = "{00000000-0000-0000-0000-000000000001}",
                                        }),
                                ]),
                        ]),
                ]),
            new(
                50,
                [
                    new(
                        "timeline_section",
                        "Timeline & Activities",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(
                                0,
                                [
                                    new(
                                        "timeline-cell",
                                        "Timeline",
                                        IsVisible: true,
                                        ShowLabel: false,
                                        1,
                                        1,
                                        new(
                                            "timeline",
                                            null,
                                            FormControlKind.Timeline,
                                            "{06375649-C143-495E-A496-C962E5B4488E}",
                                            IsVisible: true,
                                            IsDisabled: false)
                                        {
                                            Label = "Timeline",
                                            Timeline = timelineDefinition,
                                        }),
                                ]),
                        ]),
                ]),
        ]),
    new(
        "details",
        "Financial Details",
        IsVisible: true,
        IsExpanded: false,
        1,
        [
            new(
                100,
                [
                    new(
                        "details_section",
                        "Financial Information",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(
                                0,
                                [
                                    new(
                                        "revenue-cell",
                                        "Annual Revenue",
                                        IsVisible: true,
                                        ShowLabel: true,
                                        1,
                                        1,
                                        new(
                                            "revenue",
                                            "revenue",
                                            FormControlKind.Currency,
                                            null,
                                            IsVisible: true,
                                            IsDisabled: false)
                                        {
                                            Label = "Annual Revenue",
                                        }),
                                ]),
                        ]),
                ]),
        ]),
};

var accountScriptSource = """
    var Contoso = {};
    Contoso.onAccountLoad = function(executionContext) {
        var formContext = executionContext.getFormContext();
        var phoneAttr = formContext.getAttribute("telephone1");
        if (phoneAttr && !phoneAttr.getValue()) {
            phoneAttr.setValue("+1 (555) 019-2834");
        }
    };
    Contoso.onPhoneChange = function(executionContext) {
        var formContext = executionContext.getFormContext();
        var phoneAttr = formContext.getAttribute("telephone1");
        if (phoneAttr && phoneAttr.getValue()) {
            var emailAttr = formContext.getAttribute("emailaddress1");
            if (emailAttr && !emailAttr.getValue()) {
                emailAttr.setValue("contact@contoso.example.com");
            }
        }
    };
    Contoso.onAccountSave = function(executionContext) {
        var formContext = executionContext.getFormContext();
        var nameAttr = formContext.getAttribute("name");
        if (nameAttr && (!nameAttr.getValue() || nameAttr.getValue().toString().trim().length === 0)) {
            executionContext.getEventArgs().preventDefault();
        }
    };
    Contoso.quickAuditAction = function(executionContext, auditTag) {
        var formContext = executionContext.getFormContext();
        var nameAttr = formContext.getAttribute("name");
        if (nameAttr) {
            nameAttr.setValue(nameAttr.getValue() + " [" + auditTag + "]");
        }
        return "AUDIT_COMPLETED";
    };
    """;

var accountScriptHash = Convert.ToHexString(
        System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(accountScriptSource)))
    .ToLowerInvariant();

var accountScriptProvenance = new ComponentProvenance(
    "webresource-account-logic",
    "account_logic.js",
    ComponentOrigin.CustomerOwned,
    "contoso_solution",
    "contoso",
    accountScriptHash,
    IsManaged: false,
    OwnershipVerified: true);

var webResourceAccountLogic = new WebResourceDefinition(
    Guid.Parse("99999999-9999-9999-9999-999999999999"),
    "account_logic.js",
    WebResourceKind.JavaScript,
    "WebResources/account_logic.js",
    accountScriptHash,
    accountScriptProvenance)
{
    Compatibility = CompatibilityDisposition.Native,
};

var accountOnLoadEvent = new FormEventDefinition(
    "onload",
    "evt_account_onload",
    "Contoso.onAccountLoad",
    "account_logic.js",
    PassExecutionContext: true,
    Order: 0,
    accountScriptProvenance);

var accountOnSaveEvent = new FormEventDefinition(
    "onsave",
    "evt_account_onsave",
    "Contoso.onAccountSave",
    "account_logic.js",
    PassExecutionContext: true,
    Order: 0,
    accountScriptProvenance);

var accountPhoneChangeEvent = new FormEventDefinition(
    "onchange",
    "evt_account_phone_change",
    "Contoso.onPhoneChange",
    "account_logic.js",
    PassExecutionContext: true,
    Order: 0,
    accountScriptProvenance)
{
    TargetName = "telephone1",
};

var formAccount = new FormDefinition(
    Guid.Parse("2f3fdbf9-8d4e-48bc-bb0c-9bd9a6c1d3bd"),
    "Account Main Form",
    "account",
    2,
    [accountOnLoadEvent, accountOnSaveEvent, accountPhoneChangeEvent],
    provenance)
{
    Tabs = accountTabs,
    HeaderControls = accountHeaderControls,
    FooterControls = accountFooterControls,
};

// ==========================================
// 2. CONTACT (Customer Profile)
// ==========================================
var tableContact = new TableDefinition(
    "contact",
    "contacts",
    "contactid",
    "fullname",
    IsActivity: false,
    [
        new("contactid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
        new("fullname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
        new("firstname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("lastname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
        new("jobtitle", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("emailaddress1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("mobilephone", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("parentcustomerid", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
    ])
{
    DisplayName = "Contact",
};

var contactTabs = new List<FormTabDefinition>
{
    new(
        "summary",
        "Summary",
        IsVisible: true,
        IsExpanded: true,
        0,
        [
            new(
                50,
                [
                    new(
                        "contact_info",
                        "Contact Information",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(0, [new("fn-cell", "Full Name", true, true, 1, 1, new("fullname", "fullname", FormControlKind.Text, null, true, false) { Label = "Full Name" })]),
                            new(1, [new("jt-cell", "Job Title", true, true, 1, 1, new("jobtitle", "jobtitle", FormControlKind.Text, null, true, false) { Label = "Job Title" })]),
                            new(2, [new("pc-cell", "Parent Account", true, true, 1, 1, new("parentcustomerid", "parentcustomerid", FormControlKind.Text, null, true, false) { Label = "Account Name" })]),
                        ]),
                ]),
            new(
                50,
                [
                    new(
                        "contact_methods",
                        "Communication Channels",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(0, [new("email-cell", "Email", true, true, 1, 1, new("emailaddress1", "emailaddress1", FormControlKind.Text, null, true, false) { Label = "Email" })]),
                            new(1, [new("phone-cell", "Mobile Phone", true, true, 1, 1, new("mobilephone", "mobilephone", FormControlKind.Text, null, true, false) { Label = "Mobile Phone" })]),
                        ]),
                ]),
        ]),
};

var formContact = new FormDefinition(
    Guid.Parse("3a4bdbf9-8d4e-48bc-bb0c-9bd9a6c1d3ce"),
    "Contact Main Form",
    "contact",
    2,
    [],
    provenance)
{
    Tabs = contactTabs,
};

// ==========================================
// 3. INCIDENT (Customer Service Case - MB-230)
// ==========================================
var tableIncident = new TableDefinition(
    "incident",
    "incidents",
    "incidentid",
    "title",
    IsActivity: false,
    [
        new("incidentid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
        new("title", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
        new("ticketnumber", "String", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
        new("prioritycode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
        new("statuscode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
        new("description", "MultilineText", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
    ])
{
    DisplayName = "Case",
};

var incidentTabs = new List<FormTabDefinition>
{
    new(
        "case_details",
        "Case Details",
        IsVisible: true,
        IsExpanded: true,
        0,
        [
            new(
                60,
                [
                    new(
                        "case_info",
                        "Incident Summary",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(0, [new("title-cell", "Case Title", true, true, 1, 1, new("title", "title", FormControlKind.Text, null, true, false) { Label = "Case Title" })]),
                            new(1, [new("ticket-cell", "Ticket Number", true, true, 1, 1, new("ticketnumber", "ticketnumber", FormControlKind.Text, null, true, true) { Label = "Ticket Number" })]),
                            new(2, [new("desc-cell", "Description", true, true, 1, 1, new("description", "description", FormControlKind.MultilineText, null, true, false) { Label = "Description" })]),
                        ]),
                ]),
            new(
                40,
                [
                    new(
                        "case_status",
                        "Status & Priority",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(0, [new("prio-cell", "Priority", true, true, 1, 1, new("prioritycode", "prioritycode", FormControlKind.Number, null, true, false) { Label = "Priority Code (1=High)" })]),
                            new(1, [new("state-cell", "State", true, true, 1, 1, new("statecode", "statecode", FormControlKind.Number, null, true, true) { Label = "State Code (0=Active, 1=Resolved)" })]),
                            new(2, [new("status-cell", "Status Reason", true, true, 1, 1, new("statuscode", "statuscode", FormControlKind.Number, null, true, true) { Label = "Status Reason" })]),
                        ]),
                ]),
        ]),
};

var formIncident = new FormDefinition(
    Guid.Parse("4c5cdbf9-8d4e-48bc-bb0c-9bd9a6c1d3df"),
    "Case Main Form",
    "incident",
    2,
    [],
    provenance)
{
    Tabs = incidentTabs,
};

// ==========================================
// 4. OPPORTUNITY (Sales Lifecycle - MB-210)
// ==========================================
var tableOpportunity = new TableDefinition(
    "opportunity",
    "opportunities",
    "opportunityid",
    "name",
    IsActivity: false,
    [
        new("opportunityid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
        new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
        new("estimatedvalue", "Currency", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("closeprobability", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
        new("statuscode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
    ])
{
    DisplayName = "Opportunity",
};

var opportunityTabs = new List<FormTabDefinition>
{
    new(
        "summary",
        "Summary",
        IsVisible: true,
        IsExpanded: true,
        0,
        [
            new(
                50,
                [
                    new(
                        "opp_info",
                        "Opportunity Information",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(0, [new("name-cell", "Topic", true, true, 1, 1, new("name", "name", FormControlKind.Text, null, true, false) { Label = "Topic" })]),
                        ]),
                ]),
            new(
                50,
                [
                    new(
                        "opp_financials",
                        "Forecast & Pipeline",
                        IsVisible: true,
                        ShowLabel: true,
                        0,
                        [
                            new(0, [new("val-cell", "Estimated Value", true, true, 1, 1, new("estimatedvalue", "estimatedvalue", FormControlKind.Currency, null, true, false) { Label = "Est. Value" })]),
                            new(1, [new("prob-cell", "Close Probability", true, true, 1, 1, new("closeprobability", "closeprobability", FormControlKind.Number, null, true, false) { Label = "Probability (%)" })]),
                            new(2, [new("opp-state-cell", "Status", true, true, 1, 1, new("statecode", "statecode", FormControlKind.Number, null, true, true) { Label = "State (0=Open, 1=Won, 2=Lost)" })]),
                        ]),
                ]),
        ]),
};

var formOpportunity = new FormDefinition(
    Guid.Parse("5d6edbf9-8d4e-48bc-bb0c-9bd9a6c1d3f0"),
    "Opportunity Main Form",
    "opportunity",
    2,
    [],
    provenance)
{
    Tabs = opportunityTabs,
};

// ==========================================
// COMMANDS
// ==========================================
var commands = new List<CommandDefinition>
{
    // Account Commands
    new("cmd.account.save", "Save", "account", 0, new CommandActionDefinition(CommandActionKind.Native, "save", []), provenance),
    new("cmd.account.deactivate", "Deactivate", "account", 1, new CommandActionDefinition(CommandActionKind.Native, "deactivate", []), provenance),
    new("cmd.account.audit", "Run BCDR Audit", "account", 2,
        new CommandActionDefinition(CommandActionKind.CustomerJavaScript, "account_logic.js::Contoso.quickAuditAction",
            [new HandlerParameterDefinition("OFFLINE_VERIFIED", HandlerParameterKind.Literal)]),
        accountScriptProvenance),

    // Contact Commands
    new("cmd.contact.save", "Save", "contact", 0, new CommandActionDefinition(CommandActionKind.Native, "save", []), provenance),

    // Incident (Case) Commands
    new("cmd.incident.save", "Save", "incident", 0, new CommandActionDefinition(CommandActionKind.Native, "save", []), provenance),
    new("cmd.resolve_case", "Resolve Case", "incident", 1, new CommandActionDefinition(CommandActionKind.Native, "resolve_case", []), provenance),

    // Opportunity Commands
    new("cmd.opportunity.save", "Save", "opportunity", 0, new CommandActionDefinition(CommandActionKind.Native, "save", []), provenance),
    new("cmd.close_won", "Close as Won", "opportunity", 1, new CommandActionDefinition(CommandActionKind.Native, "close_won", []), provenance),
    new("cmd.close_lost", "Close as Lost", "opportunity", 2, new CommandActionDefinition(CommandActionKind.Native, "close_lost", []), provenance),
};

// ==========================================
// BUSINESS PROCESS FLOWS
// ==========================================
var bpfAccount = new BusinessProcessFlowDefinition(
    Guid.Parse("44444444-4444-4444-4444-444444444444"),
    "bpf_account_qualification",
    "Account Client Onboarding Flow",
    "account",
    [
        new(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Qualify", "account", ProcessStageCategory.Qualify, 0,
            [new(Guid.NewGuid(), "Account Name", "name", true, 0), new(Guid.NewGuid(), "Phone Number", "telephone1", false, 1)]),
        new(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Develop", "account", ProcessStageCategory.Develop, 1,
            [new(Guid.NewGuid(), "Estimated Revenue", "revenue", true, 0)]),
    ],
    provenance);

var bpfCase = new BusinessProcessFlowDefinition(
    Guid.Parse("55555555-5555-5555-5555-555555555555"),
    "bpf_phone_to_case",
    "Phone to Case Process",
    "incident",
    [
        new(Guid.Parse("33333333-3333-3333-3333-333333333333"), "Identify", "incident", ProcessStageCategory.Identify, 0,
            [new(Guid.NewGuid(), "Case Title", "title", true, 0), new(Guid.NewGuid(), "Priority", "prioritycode", true, 1)]),
        new(Guid.Parse("44444444-4444-4444-4444-444444444445"), "Research", "incident", ProcessStageCategory.Research, 1,
            [new(Guid.NewGuid(), "Issue Details", "description", false, 0)]),
        new(Guid.Parse("55555555-5555-5555-5555-555555555556"), "Resolve", "incident", ProcessStageCategory.Resolve, 2,
            [new(Guid.NewGuid(), "Ticket Confirmation", "ticketnumber", true, 0)]),
    ],
    provenance);

var bpfOpportunity = new BusinessProcessFlowDefinition(
    Guid.Parse("66666666-6666-6666-6666-666666666666"),
    "bpf_opportunity_sales",
    "Lead to Opportunity Sales Process",
    "opportunity",
    [
        new(Guid.Parse("66666666-6666-6666-6666-666666666661"), "Qualify", "opportunity", ProcessStageCategory.Qualify, 0,
            [new(Guid.NewGuid(), "Topic Name", "name", true, 0)]),
        new(Guid.Parse("77777777-7777-7777-7777-777777777772"), "Develop", "opportunity", ProcessStageCategory.Develop, 1,
            [new(Guid.NewGuid(), "Estimated Revenue", "estimatedvalue", true, 0)]),
        new(Guid.Parse("88888888-8888-8888-8888-888888888883"), "Close", "opportunity", ProcessStageCategory.Close, 2,
            [new(Guid.NewGuid(), "Win Probability", "closeprobability", true, 0)]),
    ],
    provenance);

// ==========================================
// SITE MAP NAVIGATION
// ==========================================
var navigation = new List<NavigationDefinition>
{
    new("nav_accounts", "Accounts", "account", null, 0),
    new("nav_contacts", "Contacts", "contact", null, 1),
    new("nav_cases", "Cases", "incident", null, 2),
    new("nav_opportunities", "Opportunities", "opportunity", null, 3),
};

var application = new ApplicationDefinition(
    Guid.Parse("a930ed64-979f-48c4-a618-8a0914a83fa2"),
    "contoso_service",
    "Contoso Service Target",
    [tableAccount, tableContact, tableIncident, tableOpportunity],
    [formAccount, formContact, formIncident, formOpportunity],
    navigation,
    new string('b', 64))
{
    Commands = commands,
    BusinessProcessFlows = [bpfAccount, bpfCase, bpfOpportunity],
    WebResources = [webResourceAccountLogic],
};

var assetProvider = new InMemoryAssetProvider(new Dictionary<string, byte[]>
{
    ["WebResources/account_logic.js"] = System.Text.Encoding.UTF8.GetBytes(accountScriptSource),
});

var generator = new NativeSourceGenerator();
var result = await generator.GenerateAsync(application, output, sourceAssets: assetProvider);
Console.WriteLine($"Output: {result.OutputDirectory}");
Console.WriteLine($"Project: {result.ProjectFile}");
Console.WriteLine($"Generated files: {result.Files.Count}");

internal sealed class InMemoryAssetProvider(IReadOnlyDictionary<string, byte[]> assets) : ISourceAssetProvider
{
    public ValueTask<ReadOnlyMemory<byte>?> ReadAsync(
        string relativePath,
        CancellationToken cancellationToken = default) =>
        ValueTask.FromResult<ReadOnlyMemory<byte>?>(
            assets.TryGetValue(relativePath, out var content)
                ? content
                : null);
}
