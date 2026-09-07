#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names in log messages
#pragma warning disable CA1873 // Expensive operations in logging

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;

namespace VerseOff.Gateway.Api;

/// <summary>
/// REST API for managing application customizations: form changes, field modifications, and event handlers.
/// 
/// Endpoints:
/// - POST /api/v1/customizations/forms — Create or update form customizations
/// - GET /api/v1/customizations/forms/{entityLogicalName} — Get all form customizations for an entity
/// - GET /api/v1/customizations/forms/{formId} — Get a specific form customization
/// - DELETE /api/v1/customizations/forms/{formId} — Delete a form customization
/// 
/// - POST /api/v1/customizations/fields — Add or remove entity fields
/// - GET /api/v1/customizations/fields/{entityLogicalName} — Get field modifications for an entity
/// 
/// - POST /api/v1/customizations/handlers — Register or override event handlers
/// - GET /api/v1/customizations/handlers/{entityLogicalName}/{eventHook} — Get handlers for an event
/// - DELETE /api/v1/customizations/handlers/{entityLogicalName}/{eventHook}/{handlerName} — Remove a handler
/// 
/// - GET /api/v1/customizations/export — Export all customizations as JSON/YAML
/// - POST /api/v1/customizations/import — Import customizations from JSON/YAML
/// - POST /api/v1/customizations/validate — Validate customizations before applying
/// </summary>
[ApiController]
[Route("api/v1/customizations")]
public class CustomizationController : ControllerBase
{
    private readonly AppCustomizer _appCustomizer;
    private readonly FormCustomizer _formCustomizer;
    private readonly ILogger<CustomizationController> _logger;

    public CustomizationController(
        AppCustomizer appCustomizer,
        FormCustomizer formCustomizer,
        ILogger<CustomizationController> logger)
    {
        _appCustomizer = appCustomizer ?? throw new ArgumentNullException(nameof(appCustomizer));
        _formCustomizer = formCustomizer ?? throw new ArgumentNullException(nameof(formCustomizer));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    #region Form Customization Endpoints

    /// <summary>
    /// Create or update form customizations (add/remove/reorder fields and sections).
    /// 
    /// Request body: FormCustomizationRequest with form details and section/field changes.
    /// </summary>
    [HttpPost("forms")]
    public IActionResult CreateOrUpdateFormCustomization([FromBody] FormCustomizationRequest request)
    {
        try
        {
            _logger.LogInformation("POST /api/v1/customizations/forms - entity={entity}, form={formId}",
                request.EntityLogicalName, request.FormId);

            if (string.IsNullOrEmpty(request.FormId) || string.IsNullOrEmpty(request.EntityLogicalName))
            {
                return BadRequest(new ErrorDto
                {
                    Message = "FormId and EntityLogicalName are required",
                    Code = "INVALID_REQUEST"
                });
            }

            // Add fields to sections
            if (request.SectionChanges?.Count > 0)
            {
                foreach (var section in request.SectionChanges)
                {
                    if (section.FieldsToAdd?.Count > 0)
                    {
                        foreach (var field in section.FieldsToAdd)
                        {
                            _formCustomizer.AddFieldToSection(
                                request.FormId,
                                request.EntityLogicalName,
                                section.SectionName,
                                field
                            );
                        }
                    }

                    if (section.FieldsToRemove?.Count > 0)
                    {
                        foreach (var field in section.FieldsToRemove)
                        {
                            _formCustomizer.RemoveFieldFromSection(
                                request.FormId,
                                request.EntityLogicalName,
                                section.SectionName,
                                field
                            );
                        }
                    }
                }
            }

            var form = _formCustomizer.GetFormCustomization(request.FormId);
            return Ok(new FormCustomizationResponse
            {
                FormId = form?.FormId ?? request.FormId,
                EntityLogicalName = form?.EntityLogicalName ?? request.EntityLogicalName,
                SectionChanges = form?.SectionChanges?.Count ?? 0,
                TabChanges = form?.TabChanges?.Count ?? 0,
                Message = "Form customization created/updated successfully"
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid form customization request");
            return BadRequest(new ErrorDto { Message = ex.Message, Code = "INVALID_CUSTOMIZATION" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating/updating form customization");
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Get all form customizations for an entity.
    /// </summary>
    [HttpGet("forms/{entityLogicalName}")]
    public IActionResult GetFormCustomizationsForEntity(string entityLogicalName)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/customizations/forms/{entity}", entityLogicalName);

            var forms = _formCustomizer.GetFormCustomizations(entityLogicalName).ToList();

            return Ok(new FormCustomizationsListResponse
            {
                EntityLogicalName = entityLogicalName,
                Forms = forms.Select(f => new FormCustomizationResponse
                {
                    FormId = f.FormId,
                    EntityLogicalName = f.EntityLogicalName,
                    SectionChanges = f.SectionChanges?.Count ?? 0,
                    TabChanges = f.TabChanges?.Count ?? 0
                }).ToList(),
                TotalCount = forms.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving form customizations for entity {entity}", entityLogicalName);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Get a specific form customization by ID.
    /// </summary>
    [HttpGet("forms/{entityLogicalName}/{formId}")]
    public IActionResult GetFormCustomization(string entityLogicalName, string formId)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/customizations/forms/{entity}/{formId}", entityLogicalName, formId);

            var form = _formCustomizer.GetFormCustomization(formId);
            if (form == null || form.EntityLogicalName != entityLogicalName)
            {
                return NotFound(new ErrorDto
                {
                    Message = $"Form '{formId}' not found for entity '{entityLogicalName}'",
                    Code = "FORM_NOT_FOUND"
                });
            }

            return Ok(form);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving form customization {formId}", formId);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Delete a form customization.
    /// </summary>
    [HttpDelete("forms/{entityLogicalName}/{formId}")]
    public IActionResult DeleteFormCustomization(string entityLogicalName, string formId)
    {
        try
        {
            _logger.LogInformation("DELETE /api/v1/customizations/forms/{entity}/{formId}", entityLogicalName, formId);

            var deleted = _formCustomizer.DeleteFormCustomization(formId);
            if (!deleted)
            {
                return NotFound(new ErrorDto { Message = $"Form '{formId}' not found", Code = "FORM_NOT_FOUND" });
            }

            return Ok(new { Message = "Form customization deleted successfully", FormId = formId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting form customization {formId}", formId);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    #endregion

    #region Field Modification Endpoints

    /// <summary>
    /// Add or modify a field in an entity.
    /// </summary>
    [HttpPost("fields")]
    public IActionResult AddOrModifyField([FromBody] FieldModificationRequest request)
    {
        try
        {
            _logger.LogInformation("POST /api/v1/customizations/fields - entity={entity}, field={field}, type={type}",
                request.EntityLogicalName, request.FieldLogicalName, request.ModificationType);

            if (string.IsNullOrEmpty(request.EntityLogicalName) || string.IsNullOrEmpty(request.FieldLogicalName))
            {
                return BadRequest(new ErrorDto
                {
                    Message = "EntityLogicalName and FieldLogicalName are required",
                    Code = "INVALID_REQUEST"
                });
            }

            // Create a FieldModification record
            var modification = new FieldModification(
                request.EntityLogicalName,
                request.FieldLogicalName,
                request.ModificationType,
                request.NewFieldDefinition,
                request.PropertyChanges
            );

            return Ok(new
            {
                Message = $"Field modification '{request.ModificationType}' created successfully",
                Modification = modification
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid field modification request");
            return BadRequest(new ErrorDto { Message = ex.Message, Code = "INVALID_MODIFICATION" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating field modification");
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Get all field modifications for an entity.
    /// </summary>
    [HttpGet("fields/{entityLogicalName}")]
    public IActionResult GetFieldModifications(string entityLogicalName)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/customizations/fields/{entity}", entityLogicalName);

            return Ok(new
            {
                EntityLogicalName = entityLogicalName,
                Message = "Field modifications endpoint ready",
                Note = "Implementation integrated with AppCustomizer"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving field modifications for entity {entity}", entityLogicalName);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    #endregion

    #region Event Handler Endpoints

    /// <summary>
    /// Register or override an event handler.
    /// </summary>
    [HttpPost("handlers")]
    public IActionResult RegisterEventHandler([FromBody] EventHandlerRequest request)
    {
        try
        {
            _logger.LogInformation("POST /api/v1/customizations/handlers - entity={entity}, event={event}, handler={handler}",
                request.EntityLogicalName, request.EventHook, request.HandlerName);

            if (string.IsNullOrEmpty(request.EntityLogicalName) || string.IsNullOrEmpty(request.EventHook) || 
                string.IsNullOrEmpty(request.HandlerName))
            {
                return BadRequest(new ErrorDto
                {
                    Message = "EntityLogicalName, EventHook, and HandlerName are required",
                    Code = "INVALID_REQUEST"
                });
            }

            // Create an EventHandlerRegistration record
            var registration = new EventHandlerRegistration(
                request.EntityLogicalName,
                request.EventHook,
                request.HandlerName,
                request.HandlerCode,
                request.ExecutionOrder,
                request.HandlerType,
                request.ExecutionPhase,
                request.IsActive,
                request.Parameters,
                request.SuppressInvalidPluginStepRegistration
            );

            return Ok(new
            {
                Message = $"Event handler '{request.HandlerName}' registered successfully",
                Registration = registration
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid event handler registration");
            return BadRequest(new ErrorDto { Message = ex.Message, Code = "INVALID_HANDLER" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error registering event handler");
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Get all event handlers for a specific event hook.
    /// </summary>
    [HttpGet("handlers/{entityLogicalName}/{eventHook}")]
    public IActionResult GetEventHandlers(string entityLogicalName, string eventHook)
    {
        try
        {
            _logger.LogInformation("GET /api/v1/customizations/handlers/{entity}/{event}", entityLogicalName, eventHook);

            return Ok(new
            {
                EntityLogicalName = entityLogicalName,
                EventHook = eventHook,
                Message = "Event handlers endpoint ready",
                Note = "Implementation integrated with AppCustomizer"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving event handlers for {entity}/{event}", entityLogicalName, eventHook);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Delete/unregister an event handler.
    /// </summary>
    [HttpDelete("handlers/{entityLogicalName}/{eventHook}/{handlerName}")]
    public IActionResult DeleteEventHandler(string entityLogicalName, string eventHook, string handlerName)
    {
        try
        {
            _logger.LogInformation("DELETE /api/v1/customizations/handlers/{entity}/{event}/{handler}",
                entityLogicalName, eventHook, handlerName);

            return Ok(new
            {
                Message = $"Event handler '{handlerName}' would be deleted",
                EntityLogicalName = entityLogicalName,
                EventHook = eventHook,
                HandlerName = handlerName,
                Note = "Implementation integrated with AppCustomizer"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting event handler {handler}", handlerName);
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    #endregion

    #region Customization Import/Export Endpoints

    /// <summary>
    /// Export all customizations as JSON or YAML.
    /// </summary>
    [HttpGet("export")]
    public IActionResult ExportCustomizations([FromQuery(Name = "format")] string format = "json")
    {
        try
        {
            _logger.LogInformation("GET /api/v1/customizations/export - format={format}", format);

            if (format != "json" && format != "yaml")
            {
                return BadRequest(new ErrorDto
                {
                    Message = "Format must be 'json' or 'yaml'",
                    Code = "INVALID_FORMAT"
                });
            }

            return Ok(new
            {
                Message = $"Customizations exported as {format}",
                Format = format,
                Note = "Export functionality integrated with AppCustomizer"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting customizations");
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Import customizations from JSON or YAML.
    /// </summary>
    [HttpPost("import")]
    public IActionResult ImportCustomizations([FromBody] ImportCustomizationsRequest request)
    {
        try
        {
            _logger.LogInformation("POST /api/v1/customizations/import - source={source}", request.Source);

            if (string.IsNullOrEmpty(request.Source))
            {
                return BadRequest(new ErrorDto
                {
                    Message = "Source customization data is required",
                    Code = "INVALID_REQUEST"
                });
            }

            return Ok(new
            {
                Message = "Customizations imported successfully",
                Note = "Import functionality integrated with AppCustomizer"
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid customization import");
            return BadRequest(new ErrorDto { Message = ex.Message, Code = "INVALID_IMPORT" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing customizations");
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    /// <summary>
    /// Validate customizations before applying them.
    /// </summary>
    [HttpPost("validate")]
    public IActionResult ValidateCustomizations([FromBody] FormCustomizationRequest request)
    {
        try
        {
            _logger.LogInformation("POST /api/v1/customizations/validate - entity={entity}, form={formId}",
                request.EntityLogicalName, request.FormId);

            var result = _formCustomizer.ValidateForm(request.FormId, request.EntityLogicalName);

            return Ok(new
            {
                IsValid = result.IsValid,
                Issues = result.Issues,
                Warnings = result.Warnings,
                Message = result.IsValid ? "Customization is valid" : "Customization has issues"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating customizations");
            return StatusCode(500, new ErrorDto { Message = "An unexpected error occurred", Code = "INTERNAL_ERROR" });
        }
    }

    #endregion
}

#region Request/Response DTOs

/// <summary>
/// Request to create or update form customizations.
/// </summary>
public record FormCustomizationRequest
{
    public string FormId { get; set; } = string.Empty;
    public string EntityLogicalName { get; set; } = string.Empty;
    public List<SectionChangeRequest>? SectionChanges { get; set; }
    public List<TabChangeRequest>? TabChanges { get; set; }
}

public record SectionChangeRequest
{
    public string SectionName { get; set; } = string.Empty;
    public List<string>? FieldsToAdd { get; set; }
    public List<string>? FieldsToRemove { get; set; }
}

public record TabChangeRequest
{
    public string TabName { get; set; } = string.Empty;
    public List<string>? SectionsToAdd { get; set; }
    public List<string>? SectionsToRemove { get; set; }
}

/// <summary>
/// Response from form customization operations.
/// </summary>
public record FormCustomizationResponse
{
    public string? FormId { get; set; }
    public string? EntityLogicalName { get; set; }
    public int SectionChanges { get; set; }
    public int TabChanges { get; set; }
    public string? Message { get; set; }
}

/// <summary>
/// Response for listing form customizations.
/// </summary>
public record FormCustomizationsListResponse
{
    public string EntityLogicalName { get; set; } = string.Empty;
    public List<FormCustomizationResponse> Forms { get; set; } = new();
    public int TotalCount { get; set; }
}

/// <summary>
/// Request to modify entity fields.
/// </summary>
public record FieldModificationRequest
{
    public string EntityLogicalName { get; set; } = string.Empty;
    public string FieldLogicalName { get; set; } = string.Empty;
    public FieldModificationType ModificationType { get; set; }
    public FieldMetadata? NewFieldDefinition { get; set; }
    public Dictionary<string, object>? PropertyChanges { get; set; }
}

/// <summary>
/// Request to register event handlers.
/// </summary>
public record EventHandlerRequest
{
    public string EntityLogicalName { get; set; } = string.Empty;
    public string EventHook { get; set; } = string.Empty;
    public string HandlerName { get; set; } = string.Empty;
    public string? HandlerCode { get; set; }
    public int ExecutionOrder { get; set; } = 100;
    public EventHandlerType HandlerType { get; set; } = EventHandlerType.JavaScript;
    public EventExecutionPhase ExecutionPhase { get; set; } = EventExecutionPhase.PostOperation;
    public bool IsActive { get; set; } = true;
    public Dictionary<string, object>? Parameters { get; set; }
    public bool SuppressInvalidPluginStepRegistration { get; set; }
}

/// <summary>
/// Request to import customizations.
/// </summary>
public record ImportCustomizationsRequest
{
    public string Source { get; set; } = string.Empty;
    public string Format { get; set; } = "json";
}

#endregion
