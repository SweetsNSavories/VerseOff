#pragma warning disable CA1707 // Suppress underscores in member names (xUnit convention)
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Runtime;
using VerseOff.Customization.Services;
using VerseOff.Customization.Storage;
using VerseOff.Gateway.Api;
using Xunit;
using Assert = Xunit.Assert;

namespace VerseOff.Gateway.Tests.Api;

public class MetadataControllerTests
{
    private readonly CustomizableMetadataService _metadataService;
    private readonly Mock<ILogger<MetadataController>> _mockLogger;
    private readonly MetadataController _controller;

    public MetadataControllerTests()
    {
        // Use real instances with minimal dependencies
        var loggerForApplier = new Mock<ILogger<CustomizationApplier>>().Object;
        var applier = new CustomizationApplier(loggerForApplier);
        
        // Use a mock store that returns empty list
        var mockStore = new Mock<ICustomizationStore>();
        mockStore.Setup(s => s.ListCustomizedEntitiesAsync(default))
            .ReturnsAsync(new List<string>());
        
        var loggerForRuntime = new Mock<ILogger<RuntimeCustomizationApplication>>().Object;
        var runtime = new RuntimeCustomizationApplication(mockStore.Object, applier, loggerForRuntime);
        
        var baselineMetadata = new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);
        _metadataService = new CustomizableMetadataService(baselineMetadata, runtime, applier);

        _mockLogger = new Mock<ILogger<MetadataController>>();
        _controller = new MetadataController(_metadataService, _mockLogger.Object);
    }

    [Fact]
    public void Constructor_WithNullMetadataService_ThrowsArgumentNullException()
    {
        // Arrange & Act & Assert
        Assert.Throws<ArgumentNullException>(() =>
            new MetadataController(null!, _mockLogger.Object));
    }

    [Fact]
    public void Constructor_WithNullLogger_ThrowsArgumentNullException()
    {
        // Arrange & Act & Assert
        Assert.Throws<ArgumentNullException>(() =>
            new MetadataController(_metadataService, null!));
    }

    [Fact]
    public void GetEntityMetadata_WithValidEntity_ReturnsOkResultWithMetadata()
    {
        // Arrange - populate baseline metadata with a test entity
        var entity = "account";
        var metadata = new EntityMetadata(
            "account",
            "Account",
            "Accounts",
            new List<FieldMetadata>
            {
                new("accountid", "Account ID", "Uniqueidentifier", Required: true),
                new("name", "Account Name", "String", MaxLength: 160, Required: true)
            },
            new List<string> { "OnLoad", "OnSave" },
            new List<string> { "Information", "Contacts" },
            new List<string> { "Active Accounts", "Inactive Accounts" }
        );
        
        // Create a new service with baseline metadata populated
        var baselineMetadata = new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase)
        {
            { entity, metadata }
        };
        var loggerForApplier = new Mock<ILogger<CustomizationApplier>>().Object;
        var applier = new CustomizationApplier(loggerForApplier);
        var mockStore = new Mock<ICustomizationStore>();
        mockStore.Setup(s => s.ListCustomizedEntitiesAsync(default)).ReturnsAsync(new List<string>());
        var loggerForRuntime = new Mock<ILogger<RuntimeCustomizationApplication>>().Object;
        var runtime = new RuntimeCustomizationApplication(mockStore.Object, applier, loggerForRuntime);
        var testService = new CustomizableMetadataService(baselineMetadata, runtime, applier);
        var testController = new MetadataController(testService, _mockLogger.Object);

        // Act
        var result = testController.GetEntityMetadata(entity);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedDto = Assert.IsType<EntityMetadataDto>(okResult.Value);
        Assert.Equal("account", returnedDto.LogicalName);
        Assert.Equal("Account", returnedDto.DisplayName);
        Assert.Equal(2, returnedDto.Fields.Count);
    }

    [Fact]
    public void GetEntityMetadata_WithEmptyEntity_ReturnsBadRequest()
    {
        // Arrange
        var entity = "";

        // Act
        var result = _controller.GetEntityMetadata(entity);

        // Assert
        var badResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badResult.Value);
    }

    [Fact]
    public void GetEntityMetadata_WithNonexistentEntity_Returns404()
    {
        // Arrange
        var entity = "nonexistent";
        // Controller uses empty baseline metadata, so all lookups return 404

        // Act
        var result = _controller.GetEntityMetadata(entity);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void GetAllEntitiesMetadata_WithEmptyBaseline_ReturnsEmptyDictionary()
    {
        // Arrange - _controller uses empty baseline metadata
        
        // Act
        var result = _controller.GetAllEntitiesMetadata();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedDtos = Assert.IsType<Dictionary<string, EntityMetadataDto>>(okResult.Value);
        Assert.Empty(returnedDtos);
    }

    [Fact]
    public void GetFormMetadata_WithEmptyEntity_ReturnsBadRequest()
    {
        // Arrange
        var entity = "";

        // Act
        var result = _controller.GetFormMetadata(entity);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void GetFormMetadata_WithNonexistentEntity_Returns404()
    {
        // Arrange
        var entity = "nonexistent";

        // Act
        var result = _controller.GetFormMetadata(entity);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public void GetGridMetadata_WithEmptyEntity_ReturnsBadRequest()
    {
        // Arrange
        var entity = "";

        // Act
        var result = _controller.GetGridMetadata(entity);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void GetGridMetadata_WithNonexistentEntity_Returns404()
    {
        // Arrange
        var entity = "nonexistent";

        // Act
        var result = _controller.GetGridMetadata(entity);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}

