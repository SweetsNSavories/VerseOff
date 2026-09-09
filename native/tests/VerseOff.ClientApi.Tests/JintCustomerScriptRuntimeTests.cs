using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Jint.Runtime;
using VerseOff.Domain;

namespace VerseOff.ClientApi.Tests;

[TestClass]
public sealed class JintCustomerScriptRuntimeTests
{
    [TestMethod]
    public async Task VerifiedCustomerScriptMutatesNativeFormState()
    {
        const string source = """
            var Sample = {};
            Sample.handle = async function(executionContext, suffix) {
                const formContext = executionContext.getFormContext();
                const attribute = formContext.getAttribute("name");
                const control = formContext.getControl("name");
                attribute.setValue(attribute.getValue() + suffix);
                attribute.setRequiredLevel("required");
                control.setVisible(false);
                control.setLabel("Customer name");
                control.setNotification("Review value", "review");
                executionContext.setSharedVariable("handled", true);
                executionContext.getEventArgs().preventDefault();
                await Promise.resolve();
                return Xrm.Encoding.htmlEncode("<ok>");
            };
            """;
        var attribute = new XrmAttribute("name", "string", "Acme");
        var control = new XrmControl(
            "name",
            "standard",
            "name",
            "Name");
        var formContext = new XrmFormContext(
            "account",
            Guid.NewGuid(),
            2,
            [attribute],
            [control],
            new Uri("https://example.crm.dynamics.com"));
        var eventArguments = new XrmSaveEventArguments(1);
        var executionContext = new XrmExecutionContext(
            formContext,
            attribute,
            eventArguments,
            0,
            new Dictionary<string, object?>(StringComparer.Ordinal));
        var runtime = new JintCustomerScriptRuntime();

        var result = await runtime.InvokeAsync(
            Script(source),
            "Sample.handle",
            executionContext,
            [" offline"]);

        Assert.AreEqual("Acme offline", attribute.GetValue());
        Assert.AreEqual("required", attribute.RequiredLevel);
        Assert.IsFalse(control.IsVisible);
        Assert.AreEqual("Customer name", control.Label);
        Assert.AreEqual("Review value", control.Notifications["review"]);
        var handled = executionContext.GetSharedVariable("handled");
        Assert.IsInstanceOfType<bool>(handled);
        Assert.IsTrue((bool)handled);
        Assert.IsTrue(eventArguments.IsDefaultPrevented);
        Assert.AreEqual("&lt;ok&gt;", result);
    }

    [TestMethod]
    public async Task ScriptHashMismatchIsRejected()
    {
        const string source = "function run(executionContext) {}";
        var script = Script(source) with
        {
            Provenance = Script(source).Provenance with
            {
                Sha256 = new string('0', 64),
            },
        };

        await Assert.ThrowsExactlyAsync<CustomerScriptRejectedException>(
            () => Runtime().InvokeAsync(
                    script,
                    "run",
                    Context(),
                    [])
                .AsTask());
    }

    [TestMethod]
    public async Task MicrosoftAndNetworkScriptsAreRejected()
    {
        const string source =
            "function run(executionContext) { return fetch('/data'); }";
        var customerScript = Script(source);
        var microsoftScript = customerScript with
        {
            Provenance = customerScript.Provenance with
            {
                Origin = ComponentOrigin.MicrosoftSystem,
            },
        };

        await Assert.ThrowsExactlyAsync<CustomerScriptRejectedException>(
            () => Runtime().InvokeAsync(
                    customerScript,
                    "run",
                    Context(),
                    [])
                .AsTask());
        await Assert.ThrowsExactlyAsync<CustomerScriptRejectedException>(
            () => Runtime().InvokeAsync(
                    microsoftScript,
                    "run",
                    Context(),
                    [])
                .AsTask());
    }

    [TestMethod]
    public async Task StatementLimitStopsInfiniteLoop()
    {
        const string source =
            "function run(executionContext) { while (true) {} }";
        var runtime = new JintCustomerScriptRuntime(new(
            TimeSpan.FromSeconds(15),
            MaximumMemoryBytes: 2 * 1024 * 1024,
            MaximumStatements: 100,
            MaximumRecursionDepth: 32,
            MaximumSourceBytes: 4096));

        await Assert.ThrowsExactlyAsync<StatementsCountOverflowException>(
            () => runtime.InvokeAsync(
                    Script(source),
                    "run",
                    Context(),
                    [])
                .AsTask());
    }

    [TestMethod]
    public async Task TimelineRefreshUsesDocumentedTimelinewallControl()
    {
        const string source = """
            function refreshTimeline(executionContext) {
                const timeline = executionContext
                    .getFormContext()
                    .getControl("Timeline");
                if (timeline.getControlType() !== "timelinewall") {
                    throw new Error("Unexpected control type.");
                }
                timeline.refresh();
            }
            """;
        var timeline = new XrmTimelineControl("Timeline");
        var refreshCount = 0;
        timeline.RefreshRequested += (_, _) => refreshCount++;
        var context = new XrmExecutionContext(
            new XrmFormContext(
                "account",
                Guid.NewGuid(),
                2,
                [],
                [timeline]),
            timeline,
            null,
            0,
            new Dictionary<string, object?>(StringComparer.Ordinal));

        await Runtime().InvokeAsync(
            Script(source),
            "refreshTimeline",
            context,
            []);

        Assert.AreEqual(1, refreshCount);
    }

    [TestMethod]
    public async Task TimelineControlSupportsDocumentedStateAndFocusMethods()
    {
        const string source = """
            function configureTimeline(executionContext) {
                const timeline = executionContext.getFormContext().getControl("Timeline");
                timeline.setVisible(false);
                timeline.setDisabled(true);
                timeline.setLabel("Activity history");
                timeline.setFocus();
            }
            """;
        var timeline = new XrmTimelineControl("Timeline");
        var focusCount = 0;
        timeline.FocusRequested += (_, _) => focusCount++;
        var context = new XrmExecutionContext(
            new XrmFormContext(
                "account",
                Guid.NewGuid(),
                2,
                [],
                [timeline]),
            timeline,
            null,
            0,
            new Dictionary<string, object?>(StringComparer.Ordinal));

        await Runtime().InvokeAsync(
            Script(source),
            "configureTimeline",
            context,
            []);

        Assert.IsFalse(timeline.IsVisible);
        Assert.IsTrue(timeline.IsDisabled);
        Assert.AreEqual("Activity history", timeline.Label);
        Assert.AreEqual(1, focusCount);
    }

    [TestMethod]
    public async Task GridTabAndProcessStateRoundTripThroughShim()
    {
        const string source = """
            var Api = {};
            Api.run = function(executionContext) {
                const form = executionContext.getFormContext();
                const tab = form.ui.tabs.get("general");
                tab.setDisplayState("collapsed");
                tab.sections.get("summary").setVisible(false);

                const grid = form.getControl("Contacts").getGrid();
                const selected = grid.getSelectedRows();
                selected.get(0).getData().getEntity()
                    .attributes.get("fullname").setValue("Updated contact");

                form.data.process.moveNext(function(result) {
                    executionContext.setSharedVariable(
                        "processResult",
                        result);
                });
                return grid.getTotalRecordCount();
            };
            """;
        var rowId = Guid.NewGuid();
        var row = new XrmGridRow(
            rowId,
            "contact",
            "Original contact",
            new Dictionary<string, object?>
            {
                ["fullname"] = "Original contact",
            });
        var grid = new XrmGridControl(
            "Contacts",
            "contact",
            [row],
            [rowId]);
        var tab = new XrmTab(
            "general",
            "General",
            [new("summary", "Summary")]);
        var process = new XrmProcess(
            Guid.NewGuid(),
            "Account process",
            [
                new(
                    Guid.NewGuid(),
                    "Qualify",
                    "account",
                    "active",
                    0),
                new(
                    Guid.NewGuid(),
                    "Develop",
                    "account",
                    "inactive",
                    1),
            ]);
        var context = new XrmExecutionContext(
            new XrmFormContext(
                "account",
                Guid.NewGuid(),
                2,
                [],
                [grid],
                tabs: [tab],
                process: process),
            grid,
            null,
            0,
            new Dictionary<string, object?>(StringComparer.Ordinal));

        var result = await Runtime().InvokeAsync(
            Script(source),
            "Api.run",
            context,
            []);

        Assert.AreEqual(1d, result);
        Assert.AreEqual("collapsed", tab.DisplayState);
        Assert.IsFalse(tab.Sections.Single().IsVisible);
        Assert.AreEqual("Updated contact", row.Values["fullname"]);
        Assert.AreEqual(1, process.ActiveStageIndex);
        Assert.AreEqual(
            "success",
            context.GetSharedVariable("processResult"));
    }

    [TestMethod]
    public async Task DocumentedClientApiSurfaceIsPresentAndGated()
    {
        const string source = """
            var Surface = {};
            Surface.verify = function(executionContext) {
                function requireMethods(target, methods, label) {
                    methods.forEach(function(name) {
                        if (typeof target[name] !== "function") {
                            throw new Error(label + "." + name + " missing");
                        }
                    });
                }
                const form = executionContext.getFormContext();
                requireMethods(form.data, [
                    "addOnLoad", "removeOnLoad", "getIsDirty",
                    "isValid", "refresh", "save"
                ], "data");
                requireMethods(form.data.entity, [
                    "addOnSave", "removeOnSave", "addOnPostSave",
                    "removeOnPostSave", "getDataXml", "getEntityName",
                    "getEntityReference", "getId", "getIsDirty",
                    "getPrimaryAttributeValue", "isValid", "save"
                ], "entity");
                requireMethods(form.data.process, [
                    "addOnPreProcessStatusChange",
                    "removeOnPreProcessStatusChange",
                    "addOnProcessStatusChange",
                    "removeOnProcessStatusChange",
                    "addOnPreStageChange", "removeOnPreStageChange",
                    "addOnStageChange", "removeOnStageChange",
                    "addOnStageSelected", "removeOnStageSelected",
                    "getActiveProcess", "getActiveStage",
                    "getSelectedStage", "getActivePath",
                    "setActiveProcess", "setActiveStage",
                    "moveNext", "movePrevious", "getEnabledProcesses",
                    "getProcessInstances", "setActiveProcessInstance"
                ], "process");
                requireMethods(form.ui, [
                    "addOnLoad", "removeOnLoad", "addLoaded",
                    "removeLoaded", "setFormNotification",
                    "clearFormNotification", "close", "getFormType",
                    "getViewPortHeight", "getViewPortWidth",
                    "refreshRibbon", "setFormEntityName"
                ], "ui");
                const attribute = form.getAttribute("name");
                requireMethods(attribute, [
                    "addOnChange", "removeOnChange", "fireOnChange",
                    "getAttributeType", "getFormat", "getInitialValue",
                    "getIsDirty", "getName", "getParent",
                    "getRequiredLevel", "setRequiredLevel",
                    "getSubmitMode", "setSubmitMode",
                    "getUserPrivilege", "getValue", "setValue",
                    "isValid", "setIsValid", "getOptions", "getOption",
                    "getSelectedOption", "getText", "getMax", "getMin",
                    "getPrecision", "setPrecision", "getMaxLength"
                ], "attribute");
                const control = form.getControl("name");
                requireMethods(control, [
                    "getName", "getLabel", "setLabel", "getVisible",
                    "setVisible", "getDisabled", "setDisabled",
                    "getControlType", "getAttribute", "getParent",
                    "setFocus", "refresh", "addNotification",
                    "setNotification", "clearNotification", "getOutputs"
                ], "control");
                [
                    Xrm.App, Xrm.Copilot, Xrm.Device, Xrm.Encoding,
                    Xrm.Navigation, Xrm.Panel, Xrm.Utility, Xrm.WebApi
                ].forEach(function(value) {
                    if (!value) { throw new Error("namespace missing"); }
                });
                requireMethods(Xrm.Navigation, [
                    "navigateTo", "openAlertDialog", "openConfirmDialog",
                    "openErrorDialog", "openFile", "openForm",
                    "openUrl", "openWebResource"
                ], "Navigation");
                requireMethods(Xrm.Utility, [
                    "closeProgressIndicator",
                    "getAllowedStatusTransitions", "getEntityMetadata",
                    "getEntityMainFormDescriptor", "getGlobalContext",
                    "getLearningPathAttributeName", "getPageContext",
                    "getResourceString", "invokeProcessAction",
                    "lookupObjects", "refreshParentGrid",
                    "showProgressIndicator"
                ], "Utility");
                requireMethods(Xrm.WebApi, [
                    "createRecord", "deleteRecord", "retrieveRecord",
                    "retrieveMultipleRecords", "updateRecord",
                    "isAvailableOffline", "execute", "executeMultiple"
                ], "WebApi");
                if (GetGlobalContext().getClientUrl() !==
                    "https://example.crm.dynamics.com/") {
                    throw new Error("GetGlobalContext mismatch");
                }
                return Xrm.Encoding.htmlEncode("<ok>");
            };
            """;
        var attribute = new XrmAttribute(
            "name",
            "string",
            "Acme",
            options:
            [
                new("One", 1),
                new("Two", 2),
            ]);
        var process = new XrmProcess(
            Guid.NewGuid(),
            "Process",
            [
                new(
                    Guid.NewGuid(),
                    "Stage",
                    "account",
                    "active",
                    0),
            ]);
        var context = new XrmExecutionContext(
            new XrmFormContext(
                "account",
                Guid.NewGuid(),
                2,
                [attribute],
                [new("name", "standard", "name")],
                new Uri("https://example.crm.dynamics.com/"),
                [new("general", "General")],
                process),
            attribute,
            null,
            0,
            new Dictionary<string, object?>(StringComparer.Ordinal));

        var result = await Runtime().InvokeAsync(
            Script(source),
            "Surface.verify",
            context,
            []);

        Assert.AreEqual("&lt;ok&gt;", result);
    }

    [TestMethod]
    public async Task WebApiAndNavigationUseBoundedHostServices()
    {
        const string source = """
            var Host = {};
            Host.run = async function(executionContext) {
                const record = await Xrm.WebApi.retrieveRecord(
                    "account",
                    "11111111-1111-1111-1111-111111111111",
                    "?$select=name");
                const navigation = await Xrm.Navigation.navigateTo(
                    { pageType: "entityrecord", entityName: "account" },
                    { target: 2 });
                return record.name + ":" + navigation.status;
            };
            """;
        var webApi = new StubWebApiService();
        var navigation = new StubNavigationService();
        var runtime = new JintCustomerScriptRuntime(
            webApiService: webApi,
            navigationService: navigation);

        var result = await runtime.InvokeAsync(
            Script(source),
            "Host.run",
            Context(),
            []);

        Assert.AreEqual("Acme:navigated", result);
        Assert.AreEqual(
            "retrieveRecord",
            webApi.Requests.Single().Operation);
        Assert.AreEqual(
            "navigateTo",
            navigation.Requests.Single().Operation);
        Assert.IsTrue(webApi.IsAvailableOffline("account"));
    }

    private static JintCustomerScriptRuntime Runtime() => new();

    private static XrmExecutionContext Context()
    {
        var attribute = new XrmAttribute("name", "string", "Acme");
        return new(
            new XrmFormContext(
                "account",
                Guid.NewGuid(),
                2,
                [attribute],
                [new("name", "standard", "name")]),
            attribute,
            null,
            0,
            new Dictionary<string, object?>(StringComparer.Ordinal));
    }

    private static CustomerScript Script(string source)
    {
        var hash = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(source)))
            .ToLowerInvariant();
        return new(
            "contoso_script",
            source,
            new(
                "script-id",
                "contoso_script",
                ComponentOrigin.CustomerOwned,
                "contoso_solution",
                "contoso",
                hash,
                IsManaged: false,
                OwnershipVerified: true));
    }

    private sealed class StubWebApiService : IXrmWebApiService
    {
        public List<XrmHostRequest> Requests { get; } = [];

        public bool IsAvailableOffline(string tableLogicalName) =>
            string.Equals(
                tableLogicalName,
                "account",
                StringComparison.OrdinalIgnoreCase);

        public ValueTask<JsonElement> ExecuteAsync(
            XrmHostRequest request,
            CancellationToken cancellationToken = default)
        {
            Requests.Add(request);
            return ValueTask.FromResult(
                JsonSerializer.SerializeToElement(new
                {
                    name = "Acme",
                }));
        }
    }

    private sealed class StubNavigationService : IXrmNavigationService
    {
        public List<XrmHostRequest> Requests { get; } = [];

        public ValueTask<JsonElement> ExecuteAsync(
            XrmHostRequest request,
            CancellationToken cancellationToken = default)
        {
            Requests.Add(request);
            return ValueTask.FromResult(
                JsonSerializer.SerializeToElement(new
                {
                    status = "navigated",
                }));
        }
    }
}
