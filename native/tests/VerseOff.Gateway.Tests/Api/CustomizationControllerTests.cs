#pragma warning disable CA1707 // Remove underscores from member names

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using XunitAssert = Xunit.Assert;
using System.Globalization;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
using VerseOff.Domain;
using VerseOff.Gateway.Api;

namespace VerseOff.Gateway.Tests.Api;

[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class CustomizationControllerTests
{
    private readonly Mock<ILogger<CustomizationController>> _mockLogger = new();
    private readonly AppCustomizer _appCustomizer;
    private readonly FormCustomizer _formCustomizer;
    private readonly CustomizationController _controller;

    public CustomizationControllerTests()
    {
        var baselineMetadata = CreateTestMetadata();
        _appCustomizer = new AppCustomizer(baselineMetadata);
        _formCustomizer = new FormCustomizer(baselineMetadata);
        _controller = new CustomizationController(_appCustomizer, _formCustomizer, _mockLogger.Object);
    }

    #region Form Customization Tests

    [Fact]
    public void CreateOrUpdateFormCustomization_WithValidRequest_ReturnsOkResult()
    {
        var request = new FormCustomizationRequest
        {
            FormId = "account_form",
            EntityLogicalName = "account",
            SectionChanges = new()
            {
                new SectionChangeRequest
                {
                    SectionName = "General",
                    FieldsToAdd = new() { "name", "creditlimit" }
                }
            }
        };

        var result = _controller.CreateOrUpdateFormCustomization(request);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var response = XunitAssert.IsType<FormCustomizationResponse>(okResult.Value);
        XunitAssert.Equal("account_form", response.FormId);
        XunitAssert.Equal("account", response.EntityLogicalName);
        XunitAssert.Equal(1, response.SectionChanges);
    }

    [Fact]
    public void CreateOrUpdateFormCustomization_WithMissingFormId_ReturnsBadRequest()
    {
        var request = new FormCustomizationRequest
        {
            EntityLogicalName = "account",
            SectionChanges = new()
        };

        var result = _controller.CreateOrUpdateFormCustomization(request);

        var badResult = XunitAssert.IsType<BadRequestObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(badResult.Value);
        XunitAssert.Contains("required", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void CreateOrUpdateFormCustomization_WithInvalidEntity_ReturnsBadRequest()
    {
        var request = new FormCustomizationRequest
        {
            FormId = "form_1",
            EntityLogicalName = "nonexistent_entity",
            SectionChanges = new()
            {
                new SectionChangeRequest
                {
                    SectionName = "General",
                    FieldsToAdd = new() { "name" }
                }
            }
        };

        var result = _controller.CreateOrUpdateFormCustomization(request);

        var badResult = XunitAssert.IsType<BadRequestObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(badResult.Value);
        XunitAssert.Contains("not found", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void CreateOrUpdateFormCustomization_WithInvalidField_ReturnsBadRequest()
    {
        var request = new FormCustomizationRequest
        {
            FormId = "account_form",
            EntityLogicalName = "account",
            SectionChanges = new()
            {
                new SectionChangeRequest
                {
                    SectionName = "General",
                    FieldsToAdd = new() { "nonexistent_field" }
                }
            }
        };

        var result = _controller.CreateOrUpdateFormCustomization(request);

        var badResult = XunitAssert.IsType<BadRequestObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(badResult.Value);
        XunitAssert.Contains("not found", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void GetFormCustomizationsForEntity_WithValidEntity_ReturnsFormsList()
    {
        // First add a customization
        var addRequest = new FormCustomizationRequest
        {
            FormId = "account_form_1",
            EntityLogicalName = "account",
            SectionChanges = new()
            {
                new SectionChangeRequest
                {
                    SectionName = "General",
                    FieldsToAdd = new() { "name" }
                }
            }
        };
        _controller.CreateOrUpdateFormCustomization(addRequest);

        // Then retrieve
        var result = _controller.GetFormCustomizationsForEntity("account");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var response = XunitAssert.IsType<FormCustomizationsListResponse>(okResult.Value);
        XunitAssert.Equal("account", response.EntityLogicalName);
        XunitAssert.Equal(1, response.TotalCount);
        XunitAssert.Single(response.Forms);
    }

    [Fact]
    public void GetFormCustomization_WithValidFormId_ReturnFormCustomization()
    {
        // First add a customization
        var addRequest = new FormCustomizationRequest
        {
            FormId = "account_form",
            EntityLogicalName = "account",
            SectionChanges = new()
            {
                new SectionChangeRequest
                {
                    SectionName = "General",
                    FieldsToAdd = new() { "name" }
                }
            }
        };
        _controller.CreateOrUpdateFormCustomization(addRequest);

        // Then retrieve specific form
        var result = _controller.GetFormCustomization("account", "account_form");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        var form = XunitAssert.IsType<FormCustomization>(okResult.Value);
        XunitAssert.Equal("account_form", form.FormId);
        XunitAssert.Equal("account", form.EntityLogicalName);
    }

    [Fact]
    public void GetFormCustomization_WithInvalidFormId_ReturnsNotFound()
    {
        var result = _controller.GetFormCustomization("account", "nonexistent_form");

        var notFoundResult = XunitAssert.IsType<NotFoundObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(notFoundResult.Value);
        XunitAssert.Contains("not found", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void DeleteFormCustomization_WithValidFormId_ReturnsSuccess()
    {
        // First add a customization
        var addRequest = new FormCustomizationRequest
        {
            FormId = "account_form",
            EntityLogicalName = "account",
            SectionChanges = new()
            {
                new SectionChangeRequest
                {
                    SectionName = "General",
                    FieldsToAdd = new() { "name" }
                }
            }
        };
        _controller.CreateOrUpdateFormCustomization(addRequest);

        // Then delete
        var result = _controller.DeleteFormCustomization("account", "account_form");

        XunitAssert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public void DeleteFormCustomization_WithInvalidFormId_ReturnsNotFound()
    {
        var result = _controller.DeleteFormCustomization("account", "nonexistent_form");

        var notFoundResult = XunitAssert.IsType<NotFoundObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(notFoundResult.Value);
        XunitAssert.Contains("not found", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    #endregion

    #region Field Modification Tests

    [Fact]
    public void AddOrModifyField_WithValidRequest_ReturnsOkResult()
    {
        var request = new FieldModificationRequest
        {
            EntityLogicalName = "account",
            FieldLogicalName = "custom_field",
            ModificationType = FieldModificationType.Add
        };

        var result = _controller.AddOrModifyField(request);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    [Fact]
    public void AddOrModifyField_WithMissingEntity_ReturnsBadRequest()
    {
        var request = new FieldModificationRequest
        {
            FieldLogicalName = "custom_field",
            ModificationType = FieldModificationType.Add
        };

        var result = _controller.AddOrModifyField(request);

        var badResult = XunitAssert.IsType<BadRequestObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(badResult.Value);
        XunitAssert.Contains("required", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void GetFieldModifications_WithValidEntity_ReturnsOkResult()
    {
        var result = _controller.GetFieldModifications("account");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    #endregion

    #region Event Handler Tests

    [Fact]
    public void RegisterEventHandler_WithValidRequest_ReturnsOkResult()
    {
        var request = new EventHandlerRequest
        {
            EntityLogicalName = "account",
            EventHook = "OnSave",
            HandlerName = "AccountSaveHandler",
            HandlerCode = "alert('Account saved');",
            HandlerType = EventHandlerType.JavaScript
        };

        var result = _controller.RegisterEventHandler(request);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    [Fact]
    public void RegisterEventHandler_WithMissingEntity_ReturnsBadRequest()
    {
        var request = new EventHandlerRequest
        {
            EventHook = "OnSave",
            HandlerName = "AccountSaveHandler"
        };

        var result = _controller.RegisterEventHandler(request);

        var badResult = XunitAssert.IsType<BadRequestObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(badResult.Value);
        XunitAssert.Contains("required", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void GetEventHandlers_WithValidParameters_ReturnsOkResult()
    {
        var result = _controller.GetEventHandlers("account", "OnSave");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    [Fact]
    public void DeleteEventHandler_WithValidParameters_ReturnsOkResult()
    {
        var result = _controller.DeleteEventHandler("account", "OnSave", "AccountSaveHandler");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    #endregion

    #region Import/Export Tests

    [Fact]
    public void ExportCustomizations_WithJsonFormat_ReturnsOkResult()
    {
        var result = _controller.ExportCustomizations("json");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    [Fact]
    public void ExportCustomizations_WithYamlFormat_ReturnsOkResult()
    {
        var result = _controller.ExportCustomizations("yaml");

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    [Fact]
    public void ExportCustomizations_WithInvalidFormat_ReturnsBadRequest()
    {
        var result = _controller.ExportCustomizations("xml");

        var badResult = XunitAssert.IsType<BadRequestObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(badResult.Value);
        XunitAssert.Contains("format", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ImportCustomizations_WithValidRequest_ReturnsOkResult()
    {
        var request = new ImportCustomizationsRequest
        {
            Source = "{ \"version\": \"1.0.0\" }",
            Format = "json"
        };

        var result = _controller.ImportCustomizations(request);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    [Fact]
    public void ImportCustomizations_WithMissingSource_ReturnsBadRequest()
    {
        var request = new ImportCustomizationsRequest { Format = "json" };

        var result = _controller.ImportCustomizations(request);

        var badResult = XunitAssert.IsType<BadRequestObjectResult>(result);
        var error = XunitAssert.IsType<ErrorDto>(badResult.Value);
        XunitAssert.Contains("required", error.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ValidateCustomizations_WithValidForm_ReturnsOkResult()
    {
        var request = new FormCustomizationRequest
        {
            FormId = "account_form",
            EntityLogicalName = "account"
        };

        var result = _controller.ValidateCustomizations(request);

        var okResult = XunitAssert.IsType<OkObjectResult>(result);
        XunitAssert.NotNull(okResult.Value);
    }

    #endregion

    #region Test Helpers

    private static Dictionary<string, EntityMetadata> CreateTestMetadata()
    {
        var fields = new List<FieldMetadata>
        {
            new(
                LogicalName: "accountid",
                DisplayName: "Account ID",
                AttributeType: "Guid"
            ),
            new(
                LogicalName: "name",
                DisplayName: "Account Name",
                AttributeType: "String",
                MaxLength: 160
            ),
            new(
                LogicalName: "creditlimit",
                DisplayName: "Credit Limit",
                AttributeType: "Money"
            ),
            new(
                LogicalName: "accountnumber",
                DisplayName: "Account Number",
                AttributeType: "String",
                MaxLength: 20
            )
        };

        var accountEntity = new EntityMetadata(
            LogicalName: "account",
            DisplayName: "Account",
            PluralName: "Accounts",
            Fields: fields,
            AvailableEventHandlers: new List<string> { "OnSave", "OnLoad", "OnChange" },
            AssociatedForms: new List<string> { "account_form" },
            AssociatedViews: new List<string> { "account_view" }
        );

        return new Dictionary<string, EntityMetadata>
        {
            { "account", accountEntity }
        };
    }

    #endregion
}
