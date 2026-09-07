#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for named placeholders
#pragma warning disable CA1305 // Use IFormatProvider
#pragma warning disable CA1873 // Evaluation of this argument may be expensive

using Microsoft.AspNetCore.Mvc;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Services;

namespace VerseOff.Gateway.Api;

/// <summary>
/// REST API controller for reading entity metadata with customizations applied.
/// Supports form metadata, grid metadata, and list metadata with all customizations transparently applied.
/// </summary>
[ApiController]
[Route("api/v1/metadata")]
[Produces("application/json")]
public class MetadataController : ControllerBase
{
    private readonly CustomizableMetadataService _metadataService;
    private readonly ILogger<MetadataController> _logger;

    public MetadataController(
        CustomizableMetadataService metadataService,
        ILogger<MetadataController> logger)
    {
        ArgumentNullException.ThrowIfNull(metadataService);
        ArgumentNullException.ThrowIfNull(logger);

        _metadataService = metadataService;
        _logger = logger;
    }

    /// <summary>
    /// Get entity metadata with customizations applied.
    /// Returns EntityMetadata including all baseline fields plus any custom fields added via customizations.
    /// 
    /// Example: GET /api/v1/metadata/account
    /// </summary>
    [HttpGet("{entity}")]
    public IActionResult GetEntityMetadata(string entity)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(entity))
            {
                _logger.LogWarning("GET /api/v1/metadata - entity name is empty");
                return BadRequest(new { error = "Entity logical name is required" });
            }

            _logger.LogInformation("GET /api/v1/metadata/{entity}", entity);

            var metadata = _metadataService.GetCustomizedMetadata(entity);

            var response = new EntityMetadataDto
            {
                LogicalName = metadata.LogicalName,
                DisplayName = metadata.DisplayName,
                PluralName = metadata.PluralName,
                Fields = metadata.Fields
                    .Select(f => new FieldMetadataDto
                    {
                        LogicalName = f.LogicalName,
                        DisplayName = f.DisplayName,
                        AttributeType = f.AttributeType,
                        Format = f.Format,
                        MaxLength = f.MaxLength,
                        Required = f.Required,
                        IsCustom = f.IsCustom
                    })
                    .ToList(),
                AvailableEventHandlers = metadata.AvailableEventHandlers.ToList(),
                AssociatedForms = metadata.AssociatedForms.ToList(),
                AssociatedViews = metadata.AssociatedViews.ToList()
            };

            _logger.LogInformation("GET /api/v1/metadata/{entity} - success, {fieldCount} fields returned",
                entity, response.Fields.Count);

            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "GET /api/v1/metadata/{entity} - entity not found", entity);
            return NotFound(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "GET /api/v1/metadata/{entity} - invalid argument", entity);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/v1/metadata/{entity} - unexpected error", entity);
            return StatusCode(500, new { error = "An unexpected error occurred while retrieving metadata" });
        }
    }

    /// <summary>
    /// Get all available entities with customizations applied.
    /// Returns a dictionary of entity logical names to their customized metadata.
    /// 
    /// Example: GET /api/v1/metadata
    /// </summary>
    [HttpGet]
    public IActionResult GetAllEntitiesMetadata()
    {
        try
        {
            _logger.LogInformation("GET /api/v1/metadata - retrieving all entities");

            var allEntities = _metadataService.GetAllEntities();
            var customizedEntities = _metadataService.GetAllCustomizedEntities();

            var response = new Dictionary<string, EntityMetadataDto>();
            foreach (var (entityName, metadata) in customizedEntities)
            {
                response[entityName] = new EntityMetadataDto
                {
                    LogicalName = metadata.LogicalName,
                    DisplayName = metadata.DisplayName,
                    PluralName = metadata.PluralName,
                    Fields = metadata.Fields
                        .Select(f => new FieldMetadataDto
                        {
                            LogicalName = f.LogicalName,
                            DisplayName = f.DisplayName,
                            AttributeType = f.AttributeType,
                            Format = f.Format,
                            MaxLength = f.MaxLength,
                            Required = f.Required,
                            IsCustom = f.IsCustom
                        })
                        .ToList(),
                    AvailableEventHandlers = metadata.AvailableEventHandlers.ToList(),
                    AssociatedForms = metadata.AssociatedForms.ToList(),
                    AssociatedViews = metadata.AssociatedViews.ToList()
                };
            }

            _logger.LogInformation("GET /api/v1/metadata - success, {entityCount} entities returned", response.Count);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/v1/metadata - unexpected error");
            return StatusCode(500, new { error = "An unexpected error occurred while retrieving metadata" });
        }
    }

    /// <summary>
    /// Get form metadata for a specific entity.
    /// Includes all fields that are displayed on forms plus customization information.
    /// 
    /// Example: GET /api/v1/metadata/account/forms
    /// </summary>
    [HttpGet("{entity}/forms")]
    public IActionResult GetFormMetadata(string entity)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(entity))
            {
                _logger.LogWarning("GET /api/v1/metadata/forms - entity name is empty");
                return BadRequest(new { error = "Entity logical name is required" });
            }

            _logger.LogInformation("GET /api/v1/metadata/{entity}/forms", entity);

            var metadata = _metadataService.GetCustomizedMetadata(entity);

            var response = new FormMetadataDto
            {
                EntityLogicalName = metadata.LogicalName,
                EntityDisplayName = metadata.DisplayName,
                FormFields = metadata.Fields
                    .Select(f => new FieldMetadataDto
                    {
                        LogicalName = f.LogicalName,
                        DisplayName = f.DisplayName,
                        AttributeType = f.AttributeType,
                        Format = f.Format,
                        MaxLength = f.MaxLength,
                        Required = f.Required,
                        IsCustom = f.IsCustom
                    })
                    .ToList(),
                AvailableForms = metadata.AssociatedForms.ToList(),
                SupportedEventHandlers = metadata.AvailableEventHandlers.ToList()
            };

            _logger.LogInformation("GET /api/v1/metadata/{entity}/forms - success, {fieldCount} fields, {formCount} forms",
                entity, response.FormFields.Count, response.AvailableForms.Count);

            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "GET /api/v1/metadata/{entity}/forms - entity not found", entity);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/v1/metadata/{entity}/forms - unexpected error", entity);
            return StatusCode(500, new { error = "An unexpected error occurred while retrieving form metadata" });
        }
    }

    /// <summary>
    /// Get grid metadata for a specific entity.
    /// Includes all fields that are typically displayed in grids plus customization information.
    /// 
    /// Example: GET /api/v1/metadata/account/grids
    /// </summary>
    [HttpGet("{entity}/grids")]
    public IActionResult GetGridMetadata(string entity)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(entity))
            {
                _logger.LogWarning("GET /api/v1/metadata/grids - entity name is empty");
                return BadRequest(new { error = "Entity logical name is required" });
            }

            _logger.LogInformation("GET /api/v1/metadata/{entity}/grids", entity);

            var metadata = _metadataService.GetCustomizedMetadata(entity);

            var response = new GridMetadataDto
            {
                EntityLogicalName = metadata.LogicalName,
                EntityDisplayName = metadata.DisplayName,
                GridFields = metadata.Fields
                    .Select(f => new FieldMetadataDto
                    {
                        LogicalName = f.LogicalName,
                        DisplayName = f.DisplayName,
                        AttributeType = f.AttributeType,
                        Format = f.Format,
                        MaxLength = f.MaxLength,
                        Required = f.Required,
                        IsCustom = f.IsCustom
                    })
                    .ToList(),
                AvailableViews = metadata.AssociatedViews.ToList(),
                CustomFieldCount = metadata.Fields.Count(f => f.IsCustom),
                TotalFieldCount = metadata.Fields.Count
            };

            _logger.LogInformation("GET /api/v1/metadata/{entity}/grids - success, {fieldCount} fields, {viewCount} views",
                entity, response.GridFields.Count, response.AvailableViews.Count);

            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "GET /api/v1/metadata/{entity}/grids - entity not found", entity);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/v1/metadata/{entity}/grids - unexpected error", entity);
            return StatusCode(500, new { error = "An unexpected error occurred while retrieving grid metadata" });
        }
    }
}

/// <summary>
/// DTO for entity metadata with all fields and configurations
/// </summary>
public class EntityMetadataDto
{
    public string LogicalName { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string PluralName { get; set; } = "";
    public List<FieldMetadataDto> Fields { get; set; } = new();
    public List<string> AvailableEventHandlers { get; set; } = new();
    public List<string> AssociatedForms { get; set; } = new();
    public List<string> AssociatedViews { get; set; } = new();
}

/// <summary>
/// DTO for field metadata
/// </summary>
public class FieldMetadataDto
{
    public string LogicalName { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string AttributeType { get; set; } = "";
    public string? Format { get; set; }
    public int MaxLength { get; set; } = -1;
    public bool Required { get; set; }
    public bool IsCustom { get; set; }
}

/// <summary>
/// DTO for form metadata
/// </summary>
public class FormMetadataDto
{
    public string EntityLogicalName { get; set; } = "";
    public string EntityDisplayName { get; set; } = "";
    public List<FieldMetadataDto> FormFields { get; set; } = new();
    public List<string> AvailableForms { get; set; } = new();
    public List<string> SupportedEventHandlers { get; set; } = new();
}

/// <summary>
/// DTO for grid metadata
/// </summary>
public class GridMetadataDto
{
    public string EntityLogicalName { get; set; } = "";
    public string EntityDisplayName { get; set; } = "";
    public List<FieldMetadataDto> GridFields { get; set; } = new();
    public List<string> AvailableViews { get; set; } = new();
    public int CustomFieldCount { get; set; }
    public int TotalFieldCount { get; set; }
}
