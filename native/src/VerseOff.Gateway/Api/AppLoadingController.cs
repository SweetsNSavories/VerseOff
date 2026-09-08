#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for named placeholders
#pragma warning disable CA1305 // Use IFormatProvider
#pragma warning disable CA1873 // Evaluation of this argument may be expensive

using Microsoft.AspNetCore.Mvc;
using VerseOff.Customization.Baseline;
using VerseOff.Customization.Services;
using VerseOff.Metadata;

namespace VerseOff.Gateway.Api;

/// <summary>
/// REST API controller for loading offline app packages and initializing baseline metadata.
/// Supports extracting metadata from offline packages (app.json) for use in the customization pipeline.
/// </summary>
[ApiController]
[Route("api/v1/apps")]
[Produces("application/json")]
public class AppLoadingController : ControllerBase
{
    private readonly BaselineMetadataLoader _baselineLoader;
    private readonly CustomizableMetadataService _metadataService;
    private readonly ILogger<AppLoadingController> _logger;

    public AppLoadingController(
        BaselineMetadataLoader baselineLoader,
        CustomizableMetadataService metadataService,
        ILogger<AppLoadingController> logger)
    {
        ArgumentNullException.ThrowIfNull(baselineLoader);
        ArgumentNullException.ThrowIfNull(metadataService);
        ArgumentNullException.ThrowIfNull(logger);

        _baselineLoader = baselineLoader;
        _metadataService = metadataService;
        _logger = logger;
    }

    /// <summary>
    /// Load an offline app package and extract baseline metadata.
    /// The package should contain an app.json file with ApplicationDefinition records.
    /// Extracted metadata is registered in the DI container for use by metadata endpoints.
    /// 
    /// Example: POST /api/v1/apps/load-offline-package
    /// Body: { "packagePath": "C:\\path\\to\\offline\\package" }
    /// </summary>
    [HttpPost("load-offline-package")]
    public async Task<IActionResult> LoadOfflinePackage(
        [FromBody] AppPackageLoadRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request?.PackagePath))
            {
                _logger.LogWarning("POST /api/v1/apps/load-offline-package - package path is empty");
                return BadRequest(new { error = "Package path is required" });
            }

            _logger.LogInformation("POST /api/v1/apps/load-offline-package - loading from {PackagePath}",
                request.PackagePath);

            // Verify the package path exists
            if (!Directory.Exists(request.PackagePath))
            {
                _logger.LogWarning("POST /api/v1/apps/load-offline-package - package directory not found: {PackagePath}",
                    request.PackagePath);
                return NotFound(new { error = $"Package directory not found: {request.PackagePath}" });
            }

            // Load and parse the offline package using ApplicationDefinitionDeserializer
            var appDefinition = await ApplicationDefinitionDeserializer.DeserializeFromPackageAsync(
                request.PackagePath,
                cancellationToken);

            if (appDefinition == null)
            {
                _logger.LogWarning("POST /api/v1/apps/load-offline-package - failed to deserialize package");
                return BadRequest(new { error = "Failed to parse offline package - invalid format" });
            }

            // Extract baseline metadata from the app definition
            var baselineMetadata = _baselineLoader.ExtractFromApplicationDefinition(appDefinition);

            if (baselineMetadata.Count == 0)
            {
                _logger.LogWarning("POST /api/v1/apps/load-offline-package - no entities found in app definition");
                return BadRequest(new { error = "No entities found in app package" });
            }

            // Register the baseline metadata in the metadata service
            _metadataService.RegisterBaselineMetadata(baselineMetadata);

            _logger.LogInformation("POST /api/v1/apps/load-offline-package - successfully loaded {EntityCount} entities",
                baselineMetadata.Count);

            return Ok(new
            {
                message = "Successfully loaded offline app package",
                appName = appDefinition.DisplayName,
                entityCount = baselineMetadata.Count,
                entities = baselineMetadata.Keys.ToList()
            });
        }
        catch (DirectoryNotFoundException ex)
        {
            _logger.LogWarning(ex, "POST /api/v1/apps/load-offline-package - directory not found");
            return NotFound(new { error = ex.Message });
        }
        catch (FileNotFoundException ex)
        {
            _logger.LogWarning(ex, "POST /api/v1/apps/load-offline-package - file not found");
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidDataException ex)
        {
            _logger.LogError(ex, "POST /api/v1/apps/load-offline-package - invalid package data");
            return BadRequest(new { error = "Invalid package data", details = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "POST /api/v1/apps/load-offline-package - unexpected error");
            return StatusCode(500, new { error = "An unexpected error occurred while loading the package" });
        }
    }

    /// <summary>
    /// Get currently loaded app metadata summary.
    /// Returns information about the loaded offline app and its entities.
    /// 
    /// Example: GET /api/v1/apps/status
    /// </summary>
    [HttpGet("status")]
    public IActionResult GetAppStatus()
    {
        try
        {
            _logger.LogInformation("GET /api/v1/apps/status");

            var allEntities = _metadataService.GetAllCustomizedEntities();

            return Ok(new
            {
                isLoaded = allEntities.Count > 0,
                entityCount = allEntities.Count,
                entities = allEntities.Keys.ToList()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/v1/apps/status - unexpected error");
            return StatusCode(500, new { error = "An unexpected error occurred while retrieving app status" });
        }
    }
}

/// <summary>
/// Request model for loading an offline app package.
/// </summary>
public class AppPackageLoadRequest
{
    /// <summary>
    /// Path to the offline app package directory (should contain app.json and other package files).
    /// </summary>
    public string? PackagePath { get; set; }
}
