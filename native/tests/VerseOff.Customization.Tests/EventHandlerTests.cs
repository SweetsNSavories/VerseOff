using Xunit;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.EventHandlers;
using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Tests;

[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class EventHandlerTests
{
    private readonly Dictionary<string, EntityMetadata> _baselineMetadata;
    private readonly EventHandlerValidator _validator;
    private readonly EventHandlerExecutor _executor;

    public EventHandlerTests()
    {
        _baselineMetadata = CreateTestMetadata();
        _validator = new EventHandlerValidator(_baselineMetadata);
        _executor = new EventHandlerExecutor();
    }

    #region EventHandlerCode Tests

    [Fact]
    public void EventHandlerCode_InlineJavaScript_ReturnsContent()
    {
        var code = new EventHandlerCode(
            EventHandlerCodeType.Inline,
            "function onLoad(formContext) { console.log('loaded'); }",
            null
        );

        Assert.Equal("function onLoad(formContext) { console.log('loaded'); }", code.GetCode());
    }

    [Fact]
    public void EventHandlerCode_ExternalFile_ReturnsReference()
    {
        var code = new EventHandlerCode(
            EventHandlerCodeType.ExternalFile,
            "",
            "handlers/onLoad.js"
        );

        Assert.Equal("handlers/onLoad.js", code.GetCode());
    }

    [Fact]
    public void EventHandlerCode_PluginAssembly_ReturnsTypeReference()
    {
        var code = new EventHandlerCode(
            EventHandlerCodeType.PluginAssembly,
            "",
            "MyPlugin.Handlers.AccountPlugin"
        );

        Assert.Equal("MyPlugin.Handlers.AccountPlugin", code.GetCode());
    }

    [Fact]
    public void EventHandlerCode_Validate_ValidatesCodeSize()
    {
        var largeCode = new string('x', 60000);
        var code = new EventHandlerCode(
            EventHandlerCodeType.Inline,
            largeCode,
            null
        );

        var result = code.Validate();
        Assert.False(result.IsValid);
        Assert.Contains("exceeds maximum size", result.Issues.First());
    }

    [Fact]
    public void EventHandlerCode_Validate_EmptyInlineCodeFails()
    {
        var code = new EventHandlerCode(
            EventHandlerCodeType.Inline,
            "",
            null
        );

        var result = code.Validate();
        Assert.False(result.IsValid);
        Assert.Contains("cannot be empty", result.Issues.First());
    }

    #endregion

    #region EventHandlerValidator Tests

    [Fact]
    public void Validator_ValidateHandler_SucceedsForValidRegistration()
    {
        var handler = new EventHandlerRegistration(
            "account",
            "onCreate",
            "CreateAccountHandler",
            "function onCreate() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var result = _validator.Validate(handler, new());
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validator_ValidateHandler_FailsForMissingEntity()
    {
        var handler = new EventHandlerRegistration(
            "nonexistent",
            "onCreate",
            "TestHandler",
            "function onCreate() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var result = _validator.Validate(handler, new());
        Assert.False(result.IsValid);
        Assert.Contains("not found", result.Issues.First());
    }

    [Fact]
    public void Validator_ValidateHandler_FailsForUnsupportedEvent()
    {
        var handler = new EventHandlerRegistration(
            "account",
            "onInvalidEvent",
            "TestHandler",
            "function onInvalidEvent() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var result = _validator.Validate(handler, new());
        Assert.False(result.IsValid);
        Assert.Contains("not supported", result.Issues.First());
    }

    [Fact]
    public void Validator_ValidateHandler_FailsForDuplicates()
    {
        var handler1 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "CreateAccountHandler",
            "function onCreate() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var handler2 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "CreateAccountHandler",
            "function onCreate() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var result = _validator.Validate(handler2, new() { handler1 });
        Assert.False(result.IsValid);
        Assert.Contains("already registered", result.Issues.First());
    }

    [Fact]
    public void Validator_ValidateHandler_WarnsForExecutionOrderConflicts()
    {
        var handler1 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "Handler1",
            "function onCreate() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var handler2 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "Handler2",
            "function onCreate() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var result = _validator.Validate(handler2, new() { handler1 });
        Assert.True(result.IsValid);
        Assert.Single(result.Warnings);
        Assert.Contains("same execution order", result.Warnings.First());
    }

    [Fact]
    public void Validator_ValidateHandlerCode_ValidatesJavaScript()
    {
        var code = new EventHandlerCode(
            EventHandlerCodeType.Inline,
            "function test() { return true; }",
            null
        );

        var result = EventHandlerValidator.ValidateHandlerCode(code, EventHandlerType.JavaScript);
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validator_ValidateExecutionPhase_EnforcesWorkflowPhase()
    {
        var handler = new EventHandlerRegistration(
            "account",
            "onCreate",
            "WorkflowHandler",
            "workflow-ref",
            100,
            EventHandlerType.Workflow,
            EventExecutionPhase.PreOperation
        );

        var result = EventHandlerValidator.ValidateExecutionPhase(handler, EventExecutionPhase.PreOperation);
        Assert.False(result.IsValid);
        Assert.Contains("PostOperation", result.Issues.First());
    }

    #endregion

    #region EventHandlerExecutor Tests

    [Fact]
    public void Executor_Register_StoresHandler()
    {
        var handler = new EventHandlerRegistration(
            "account",
            "onCreate",
            "CreateAccountHandler",
            "function onCreate() {}",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        _executor.Register(handler);

        Assert.True(_executor.HasHandlers("account"));
    }

    [Fact]
    public void Executor_GetHandlers_ReturnsSortedByExecutionOrder()
    {
        var handler1 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "Handler1",
            "code1",
            200,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var handler2 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "Handler2",
            "code2",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var handler3 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "Handler3",
            "code3",
            150,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        _executor.Register(handler1);
        _executor.Register(handler2);
        _executor.Register(handler3);

        var handlers = _executor.GetHandlers("account", "onCreate").ToList();
        Assert.Equal(3, handlers.Count);
        Assert.Equal(100, handlers[0].ExecutionOrder);
        Assert.Equal(150, handlers[1].ExecutionOrder);
        Assert.Equal(200, handlers[2].ExecutionOrder);
    }

    [Fact]
    public void Executor_GetHandlersByEvent_ReturnsGroupedByEvent()
    {
        var handler1 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "CreateHandler",
            "code1",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var handler2 = new EventHandlerRegistration(
            "account",
            "onUpdate",
            "UpdateHandler",
            "code2",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        _executor.Register(handler1);
        _executor.Register(handler2);

        var dict = _executor.GetHandlersByEvent("account");
        Assert.Equal(2, dict.Count);
        Assert.Contains("onCreate", dict.Keys);
        Assert.Contains("onUpdate", dict.Keys);
    }

    [Fact]
    public void Executor_GetTotalHandlerCount_ReturnsCorrectCount()
    {
        var handler1 = new EventHandlerRegistration(
            "account",
            "onCreate",
            "Handler1",
            "code1",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        var handler2 = new EventHandlerRegistration(
            "contact",
            "onUpdate",
            "Handler2",
            "code2",
            100,
            EventHandlerType.JavaScript,
            EventExecutionPhase.PostOperation
        );

        _executor.Register(handler1);
        _executor.Register(handler2);

        Assert.Equal(2, _executor.GetTotalHandlerCount());
    }

    #endregion

    #region AppCustomizer Integration Tests

    [Fact]
    public void AppCustomizer_AddEventHandlerWithCode_SucceedsWithValidCode()
    {
        var customizer = new AppCustomizer(_baselineMetadata);
        var code = new EventHandlerCode(
            EventHandlerCodeType.Inline,
            "function onCreate(formContext) { console.log('created'); }",
            null
        );

        customizer.AddEventHandlerWithCode(
            "account",
            "onCreate",
            "AccountCreateHandler",
            code
        );

        var handlers = customizer.GetHandlers("account", "onCreate").ToList();
        Assert.Single(handlers);
        Assert.Equal("AccountCreateHandler", handlers.First().HandlerName);
    }

    [Fact]
    public void AppCustomizer_AddEventHandlerWithCode_FailsWithEmptyCode()
    {
        var customizer = new AppCustomizer(_baselineMetadata);
        var code = new EventHandlerCode(
            EventHandlerCodeType.Inline,
            "",
            null
        );

        var ex = Assert.Throws<InvalidOperationException>(() =>
            customizer.AddEventHandlerWithCode(
                "account",
                "onCreate",
                "InvalidHandler",
                code
            )
        );

        Assert.Contains("validation failed", ex.Message);
    }

    [Fact]
    public void AppCustomizer_GetHandlerCode_ReturnsStoredCode()
    {
        var customizer = new AppCustomizer(_baselineMetadata);
        var code = new EventHandlerCode(
            EventHandlerCodeType.Inline,
            "function onSave(formContext) { /* save logic */ }",
            null
        );

        customizer.AddEventHandlerWithCode(
            "account",
            "onSave",
            "SaveHandler",
            code
        );

        var retrieved = customizer.GetHandlerCode("account", "onSave", "SaveHandler");
        Assert.NotNull(retrieved);
        Assert.Contains("save logic", retrieved.GetCode());
    }

    [Fact]
    public void AppCustomizer_MultipleHandlers_ExecutionOrderMaintained()
    {
        var customizer = new AppCustomizer(_baselineMetadata);

        for (int i = 3; i >= 1; i--)
        {
            var code = new EventHandlerCode(
                EventHandlerCodeType.Inline,
                $"function onCreate() {{ console.log('handler{i}'); }}",
                null
            );

            customizer.AddEventHandlerWithCode(
                "account",
                "onCreate",
                $"Handler{i}",
                code,
                executionOrder: i * 100
            );
        }

        var handlers = customizer.GetHandlers("account", "onCreate").ToList();
        Assert.Equal(3, handlers.Count);
        Assert.Equal(100, handlers[0].ExecutionOrder);
        Assert.Equal(200, handlers[1].ExecutionOrder);
        Assert.Equal(300, handlers[2].ExecutionOrder);
    }

    #endregion

    #region Helper Methods

    private static Dictionary<string, EntityMetadata> CreateTestMetadata()
    {
        return new()
        {
            {
                "account",
                new EntityMetadata(
                    "account",
                    "Account",
                    "Accounts",
                    new()
                    {
                        new FieldMetadata("accountid", "Account ID", "Guid", IsCustom: false),
                        new FieldMetadata("name", "Account Name", "String", MaxLength: 160, Required: true, IsCustom: false),
                        new FieldMetadata("accountnumber", "Account Number", "String", MaxLength: 20, IsCustom: false),
                        new FieldMetadata("creditlimit", "Credit Limit", "Decimal", IsCustom: false),
                    },
                    new()
                    {
                        "onCreate",
                        "onUpdate",
                        "onSave",
                        "onDelete",
                        "onLoad",
                        "onChange"
                    },
                    new() { "Account", "Account Related" },
                    new() { "Account", "Active Accounts" }
                )
            },
            {
                "contact",
                new EntityMetadata(
                    "contact",
                    "Contact",
                    "Contacts",
                    new()
                    {
                        new FieldMetadata("contactid", "Contact ID", "Guid", IsCustom: false),
                        new FieldMetadata("firstname", "First Name", "String", MaxLength: 50, IsCustom: false),
                        new FieldMetadata("lastname", "Last Name", "String", MaxLength: 50, IsCustom: false),
                        new FieldMetadata("emailaddress1", "Email Address", "String", IsCustom: false),
                    },
                    new()
                    {
                        "onCreate",
                        "onUpdate",
                        "onDelete",
                        "onChange"
                    },
                    new() { "Contact" },
                    new() { "Active Contacts" }
                )
            }
        };
    }

    #endregion
}
