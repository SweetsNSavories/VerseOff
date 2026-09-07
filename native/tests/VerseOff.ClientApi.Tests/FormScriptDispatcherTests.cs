using System.Security.Cryptography;
using System.Text;
using VerseOff.Domain;

namespace VerseOff.ClientApi.Tests;

[TestClass]
public sealed class FormScriptDispatcherTests
{
    [TestMethod]
    public async Task TriggerOnLoadAsyncExecutesRegisteredHandlerMutatesFormContext()
    {
        const string scriptSource = """
            var Contoso = {};
            Contoso.onLoad = function(executionContext) {
                var formContext = executionContext.getFormContext();
                var attr = formContext.getAttribute("name");
                attr.setValue("Contoso Ltd (Loaded)");
            };
            """;

        var script = CreateScript("account_logic.js", scriptSource);
        var resolver = new InMemoryCustomerScriptResolver();
        resolver.AddOrUpdate("account_logic.js", script);

        var runtime = new JintCustomerScriptRuntime();
        var dispatcher = new FormScriptDispatcher(runtime, resolver);

        var eventDef = new FormEventDefinition(
            "onload",
            "handler_onload",
            "Contoso.onLoad",
            "account_logic.js",
            PassExecutionContext: true,
            Order: 0,
            script.Provenance);

        await dispatcher.RegisterEventsAsync([eventDef]);

        var attribute = new XrmAttribute("name", "string", "Initial Name");
        var formContext = new XrmFormContext(
            "account",
            Guid.NewGuid(),
            1,
            [attribute],
            [new XrmControl("name", "standard", "name")]);

        var result = await dispatcher.TriggerOnLoadAsync(formContext);

        Assert.IsFalse(result.DefaultPrevented);
        Assert.IsEmpty(result.Failures);
        Assert.AreEqual("Contoso Ltd (Loaded)", attribute.GetValue());
    }

    [TestMethod]
    public async Task TriggerOnChangeAsyncExecutesTargetAttributeHandler()
    {
        const string scriptSource = """
            function handlePhoneChange(executionContext) {
                var formContext = executionContext.getFormContext();
                var desc = formContext.getAttribute("description");
                desc.setValue("Phone updated via script");
            }
            """;

        var script = CreateScript("account_logic.js", scriptSource);
        var resolver = new InMemoryCustomerScriptResolver();
        resolver.AddOrUpdate("account_logic.js", script);

        var runtime = new JintCustomerScriptRuntime();
        var dispatcher = new FormScriptDispatcher(runtime, resolver);

        var phoneEvent = new FormEventDefinition(
            "onchange",
            "handler_phone_change",
            "handlePhoneChange",
            "account_logic.js",
            PassExecutionContext: true,
            Order: 0,
            script.Provenance)
        {
            TargetName = "telephone1",
        };

        await dispatcher.RegisterEventsAsync([phoneEvent]);

        var phoneAttr = new XrmAttribute("telephone1", "string", "555-0100");
        var descAttr = new XrmAttribute("description", "string", "Default");
        var formContext = new XrmFormContext(
            "account",
            Guid.NewGuid(),
            1,
            [phoneAttr, descAttr],
            [new XrmControl("telephone1", "standard", "telephone1"), new XrmControl("description", "standard", "description")]);

        // Trigger change on a different attribute ("name") -> should NOT fire handlePhoneChange
        var ignoreResult = await dispatcher.TriggerOnChangeAsync(formContext, "telephone1_other");
        Assert.AreEqual("Default", descAttr.GetValue());
        Assert.IsEmpty(ignoreResult.Failures);

        // Trigger change on "telephone1" -> should fire handlePhoneChange
        var matchResult = await dispatcher.TriggerOnChangeAsync(formContext, "telephone1");
        Assert.IsFalse(matchResult.DefaultPrevented);
        Assert.IsEmpty(matchResult.Failures);
        Assert.AreEqual("Phone updated via script", descAttr.GetValue());
    }

    [TestMethod]
    public async Task TriggerOnSaveAsyncPreventsDefaultWhenScriptCallsPreventDefault()
    {
        const string scriptSource = """
            function validateOnSave(executionContext) {
                var eventArgs = executionContext.getEventArgs();
                eventArgs.preventDefault();
            }
            """;

        var script = CreateScript("case_logic.js", scriptSource);
        var resolver = new InMemoryCustomerScriptResolver();
        resolver.AddOrUpdate("case_logic.js", script);

        var runtime = new JintCustomerScriptRuntime();
        var dispatcher = new FormScriptDispatcher(runtime, resolver);

        var eventDef = new FormEventDefinition(
            "onsave",
            "handler_save",
            "validateOnSave",
            "case_logic.js",
            PassExecutionContext: true,
            Order: 0,
            script.Provenance);

        await dispatcher.RegisterEventsAsync([eventDef]);

        var attribute = new XrmAttribute("title", "string", "Defective Unit");
        var formContext = new XrmFormContext(
            "incident",
            Guid.NewGuid(),
            1,
            [attribute],
            [new XrmControl("title", "standard", "title")]);

        var result = await dispatcher.TriggerOnSaveAsync(formContext, saveMode: 1);

        Assert.IsTrue(result.DefaultPrevented);
        Assert.IsEmpty(result.Failures);
    }

    [TestMethod]
    public async Task ExecuteRibbonActionAsyncExecutesCustomerJavaScriptRibbonAction()
    {
        const string scriptSource = """
            function runRibbonCommand(executionContext, tag) {
                var formContext = executionContext.getFormContext();
                var nameAttr = formContext.getAttribute("name");
                nameAttr.setValue("Processed:" + tag);
                return "OK:" + tag;
            }
            """;

        var script = CreateScript("custom_ribbon.js", scriptSource);
        var resolver = new InMemoryCustomerScriptResolver();
        resolver.AddOrUpdate("custom_ribbon.js", script);

        var runtime = new JintCustomerScriptRuntime();
        var dispatcher = new FormScriptDispatcher(runtime, resolver);

        var attribute = new XrmAttribute("name", "string", "Original");
        var formContext = new XrmFormContext(
            "account",
            Guid.NewGuid(),
            1,
            [attribute],
            [new XrmControl("name", "standard", "name")]);

        var actionResult = await dispatcher.ExecuteRibbonActionAsync(
            "custom_ribbon.js",
            "runRibbonCommand",
            formContext,
            ["VIP_FLAG"]);

        Assert.AreEqual("OK:VIP_FLAG", actionResult);
        Assert.AreEqual("Processed:VIP_FLAG", attribute.GetValue());
    }

    [TestMethod]
    public async Task UnresolvedScriptFailsClosedWithoutCrashing()
    {
        var resolver = new InMemoryCustomerScriptResolver();
        var runtime = new JintCustomerScriptRuntime();
        var dispatcher = new FormScriptDispatcher(runtime, resolver);

        var prov = new ComponentProvenance(
            Guid.NewGuid().ToString(),
            "missing",
            ComponentOrigin.CustomerOwned,
            "sol",
            "pub",
            new string('0', 64),
            IsManaged: false,
            OwnershipVerified: true);

        var missingEvent = new FormEventDefinition(
            "onload",
            "handler_missing",
            "doSomething",
            "nonexistent_script.js",
            PassExecutionContext: true,
            Order: 0,
            prov);

        // Registering missing script definition does not crash
        await dispatcher.RegisterEventsAsync([missingEvent]);

        var attribute = new XrmAttribute("name", "string", "Unchanged");
        var formContext = new XrmFormContext(
            "account",
            Guid.NewGuid(),
            1,
            [attribute],
            [new XrmControl("name", "standard", "name")]);

        var result = await dispatcher.TriggerOnLoadAsync(formContext);

        Assert.IsFalse(result.DefaultPrevented);
        Assert.IsEmpty(result.Failures);
        Assert.AreEqual("Unchanged", attribute.GetValue());
    }

    [TestMethod]
    public async Task UnverifiedScriptHashMismatchFailsClosedSafely()
    {
        const string scriptSource = "function badScript(ctx) {}";
        var script = new CustomerScript(
            "bad_script.js",
            scriptSource,
            new ComponentProvenance(
                "script-bad",
                "bad_script.js",
                ComponentOrigin.CustomerOwned,
                "solution",
                "publisher",
                Sha256: new string('0', 64), // Invalid hash
                IsManaged: false,
                OwnershipVerified: true));

        var resolver = new InMemoryCustomerScriptResolver();
        resolver.AddOrUpdate("bad_script.js", script);

        var runtime = new JintCustomerScriptRuntime();
        var dispatcher = new FormScriptDispatcher(runtime, resolver);

        var eventDef = new FormEventDefinition(
            "onload",
            "handler_bad",
            "badScript",
            "bad_script.js",
            PassExecutionContext: true,
            Order: 0,
            script.Provenance);

        await dispatcher.RegisterEventsAsync([eventDef]);

        var attribute = new XrmAttribute("name", "string", "Initial");
        var formContext = new XrmFormContext(
            "account",
            Guid.NewGuid(),
            1,
            [attribute],
            [new XrmControl("name", "standard", "name")]);

        var result = await dispatcher.TriggerOnLoadAsync(formContext);

        // Security check failure is trapped safely in result.Failures without crashing the app
        Assert.HasCount(1, result.Failures);
        Assert.AreEqual("Initial", attribute.GetValue());
    }

    private static CustomerScript CreateScript(string libraryName, string source)
    {
        var hash = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(source)))
            .ToLowerInvariant();

        return new CustomerScript(
            libraryName,
            source,
            new ComponentProvenance(
                Guid.NewGuid().ToString(),
                libraryName,
                ComponentOrigin.CustomerOwned,
                "contoso_solution",
                "contoso",
                hash,
                IsManaged: false,
                OwnershipVerified: true));
    }
}
