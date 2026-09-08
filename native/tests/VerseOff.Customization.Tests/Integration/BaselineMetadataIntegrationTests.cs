#pragma warning disable CA1707 // Suppress underscores in member names (xUnit convention)
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using VerseOff.Customization.Baseline;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Runtime;
using VerseOff.Customization.Services;
using VerseOff.Customization.Storage;
using Xunit;
using Assert = Xunit.Assert;

namespace VerseOff.Customization.Tests.Integration;

/// <summary>
/// Integration tests for baseline metadata loading in the DI container.
/// Verifies: startup loading, metadata availability, customizations layering.
/// </summary>
public class BaselineMetadataIntegrationTests : IDisposable
{
    private readonly string _customizationStorePath;
    private readonly string _tempDir;

    public BaselineMetadataIntegrationTests()
    {
        _tempDir = Path.Combine(Path.GetTempPath(), $"baseline-integration-{Guid.NewGuid()}");
        Directory.CreateDirectory(_tempDir);
        _customizationStorePath = Path.Combine(_tempDir, "customizations");
    }

    public void Dispose()
    {
        if (Directory.Exists(_tempDir))
            Directory.Delete(_tempDir, recursive: true);
        
        GC.SuppressFinalize(this);
    }

    #region Test Fixtures

    /// <summary>
    /// Build a service provider with optional baseline metadata loading.
    /// </summary>
    private ServiceProvider BuildServiceProvider(string? baselineMetadataPath = null)
    {
        var services = new ServiceCollection();
        
        // Register logging (required by customization services)
        services.AddLogging(logging => logging.AddConsole());
        
        // Register customization services with optional baseline metadata path
        services.AddVerseOffCustomization(_customizationStorePath, baselineMetadataPath);

        return services.BuildServiceProvider();
    }

    private string CreateBaselineMetadataFile(string filename, string jsonContent)
    {
        var filePath = Path.Combine(_tempDir, filename);
        File.WriteAllText(filePath, jsonContent);
        return filePath;
    }

    private static string CreateSampleBaselineMetadata()
    {
        return @"{
            ""version"": ""1.0"",
            ""entities"": [
                {
                    ""logicalName"": ""account"",
                    ""displayName"": ""Account"",
                    ""pluralName"": ""Accounts"",
                    ""fields"": [
                        {
                            ""logicalName"": ""accountid"",
                            ""displayName"": ""Account ID"",
                            ""attributeType"": ""Uniqueidentifier"",
                            ""required"": true,
                            ""isCustom"": false
                        },
                        {
                            ""logicalName"": ""name"",
                            ""displayName"": ""Account Name"",
                            ""attributeType"": ""String"",
                            ""maxLength"": 160,
                            ""required"": true,
                            ""isCustom"": false
                        }
                    ],
                    ""availableEventHandlers"": [""onLoad"", ""onSave""],
                    ""associatedForms"": [""Information""],
                    ""associatedViews"": [""Active Accounts""]
                },
                {
                    ""logicalName"": ""contact"",
                    ""displayName"": ""Contact"",
                    ""pluralName"": ""Contacts"",
                    ""fields"": [
                        {
                            ""logicalName"": ""contactid"",
                            ""displayName"": ""Contact ID"",
                            ""attributeType"": ""Uniqueidentifier"",
                            ""required"": true,
                            ""isCustom"": false
                        }
                    ],
                    ""availableEventHandlers"": [],
                    ""associatedForms"": [],
                    ""associatedViews"": []
                }
            ]
        }";
    }

    #endregion

    #region DI Container Tests

    [Fact]
    public void AddVerseOffCustomization_WithoutBaselineMetadata_RegistersEmptyMetadata()
    {
        // Arrange
        using var sp = BuildServiceProvider();

        // Act
        var metadataService = sp.GetRequiredService<CustomizableMetadataService>();

        // Assert
        Assert.NotNull(metadataService);
        Assert.NotNull(metadataService.GetAllEntities());
    }

    [Fact]
    public void AddVerseOffCustomization_WithBaselineMetadataFile_LoadsMetadata()
    {
        // Arrange
        var jsonContent = CreateSampleBaselineMetadata();
        var baselinePath = CreateBaselineMetadataFile("baseline.json", jsonContent);
        
        using var sp = BuildServiceProvider(baselinePath);

        // Act
        var metadataService = sp.GetRequiredService<CustomizableMetadataService>();
        var baseline = metadataService.GetAllEntities();

        // Assert
        Assert.NotNull(baseline);
        Assert.NotEmpty(baseline);
        Assert.True(baseline.ContainsKey("account"));
        Assert.True(baseline.ContainsKey("contact"));
        Assert.Equal(2, baseline.Count);
    }

    [Fact]
    public void AddVerseOffCustomization_WithNonexistentFile_ProceedsWithEmptyMetadata()
    {
        // Arrange
        var nonexistentPath = Path.Combine(_tempDir, "nonexistent-baseline.json");
        
        // Act - should not throw
        using var sp = BuildServiceProvider(nonexistentPath);
        var metadataService = sp.GetRequiredService<CustomizableMetadataService>();

        // Assert - service should be functional with empty baseline
        Assert.NotNull(metadataService);
    }

    [Fact]
    public void AddVerseOffCustomization_BaselineLoaderIsRegisteredAsSingleton()
    {
        // Arrange
        using var sp = BuildServiceProvider();

        // Act
        var loader1 = sp.GetRequiredService<BaselineMetadataLoader>();
        var loader2 = sp.GetRequiredService<BaselineMetadataLoader>();

        // Assert - should be the same instance (singleton)
        Assert.Same(loader1, loader2);
    }

    [Fact]
    public void AddVerseOffCustomization_AllServicesAreRegistered()
    {
        // Arrange
        using var sp = BuildServiceProvider();

        // Act & Assert - all services should be resolvable
        Assert.NotNull(sp.GetRequiredService<ICustomizationStore>());
        Assert.NotNull(sp.GetRequiredService<CustomizationApplier>());
        Assert.NotNull(sp.GetRequiredService<RuntimeCustomizationApplication>());
        Assert.NotNull(sp.GetRequiredService<BaselineMetadataLoader>());
        Assert.NotNull(sp.GetRequiredService<CustomizableMetadataService>());
    }

    #endregion

    #region Customization Layering Tests

    [Fact]
    public void CustomizableMetadataService_WithBaseline_ReturnsBaselineMetadata()
    {
        // Arrange
        var jsonContent = CreateSampleBaselineMetadata();
        var baselinePath = CreateBaselineMetadataFile("baseline.json", jsonContent);
        
        using var sp = BuildServiceProvider(baselinePath);
        var service = sp.GetRequiredService<CustomizableMetadataService>();

        // Act
        var accountMetadata = service.GetCustomizedMetadata("account");

        // Assert
        Assert.NotNull(accountMetadata);
        Assert.Equal("account", accountMetadata.LogicalName);
        Assert.Equal("Account", accountMetadata.DisplayName);
        Assert.Equal(2, accountMetadata.Fields.Count);
    }

    [Fact]
    public void CustomizableMetadataService_WithBaseline_AllEntitiesAvailable()
    {
        // Arrange
        var jsonContent = CreateSampleBaselineMetadata();
        var baselinePath = CreateBaselineMetadataFile("baseline.json", jsonContent);
        
        using var sp = BuildServiceProvider(baselinePath);
        var service = sp.GetRequiredService<CustomizableMetadataService>();

        // Act
        var allMetadata = service.GetAllEntities();

        // Assert
        Assert.NotNull(allMetadata);
        Assert.NotEmpty(allMetadata);
        Assert.Contains(allMetadata, m => m.Key == "account");
        Assert.Contains(allMetadata, m => m.Key == "contact");
    }

    #endregion

    #region Scoped Service Tests

    [Fact]
    public void CustomizableMetadataService_IsScoped_NewInstancePerScope()
    {
        // Arrange
        var jsonContent = CreateSampleBaselineMetadata();
        var baselinePath = CreateBaselineMetadataFile("baseline.json", jsonContent);
        
        using var sp = BuildServiceProvider(baselinePath);

        // Act
        using var scope1 = sp.CreateScope();
        var service1 = scope1.ServiceProvider.GetRequiredService<CustomizableMetadataService>();
        
        using var scope2 = sp.CreateScope();
        var service2 = scope2.ServiceProvider.GetRequiredService<CustomizableMetadataService>();

        // Assert - should be different instances per scope
        Assert.NotSame(service1, service2);
    }

    [Fact]
    public void ICustomizationStore_IsScoped_NewInstancePerScope()
    {
        // Arrange
        using var sp = BuildServiceProvider();

        // Act
        using var scope1 = sp.CreateScope();
        var store1 = scope1.ServiceProvider.GetRequiredService<ICustomizationStore>();
        
        using var scope2 = sp.CreateScope();
        var store2 = scope2.ServiceProvider.GetRequiredService<ICustomizationStore>();

        // Assert - should be different instances per scope
        Assert.NotSame(store1, store2);
    }

    #endregion

    #region Error Handling Tests

    [Fact]
    public void AddVerseOffCustomization_WithInvalidJsonFile_ProceedsWithEmptyMetadata()
    {
        // Arrange
        var invalidJson = "{invalid json content}";
        var baselinePath = CreateBaselineMetadataFile("invalid-baseline.json", invalidJson);
        
        // Act - should not throw during registration
        using var sp = BuildServiceProvider(baselinePath);
        var service = sp.GetRequiredService<CustomizableMetadataService>();

        // Assert - service should still be functional
        Assert.NotNull(service);
    }

    [Fact]
    public void AddVerseOffCustomization_WithEmptyJsonFile_ProceedsWithEmptyMetadata()
    {
        // Arrange
        var emptyJson = "";
        var baselinePath = CreateBaselineMetadataFile("empty-baseline.json", emptyJson);
        
        // Act - should not throw during registration
        using var sp = BuildServiceProvider(baselinePath);
        var service = sp.GetRequiredService<CustomizableMetadataService>();

        // Assert - service should still be functional
        Assert.NotNull(service);
    }

    [Fact]
    public void AddVerseOffCustomization_WithNullBaselinePath_SkipsLoading()
    {
        // Arrange & Act
        using var sp = BuildServiceProvider(baselineMetadataPath: null);
        var service = sp.GetRequiredService<CustomizableMetadataService>();

        // Assert - service should be functional with empty baseline
        Assert.NotNull(service);
    }

    #endregion

    #region Multiple Scope Consistency Tests

    [Fact]
    public void BaselineMetadataLoader_ReturnsSameDataAcrossScopes()
    {
        // Arrange
        var jsonContent = CreateSampleBaselineMetadata();
        var baselinePath = CreateBaselineMetadataFile("baseline.json", jsonContent);
        
        using var sp = BuildServiceProvider(baselinePath);

        // Act
        using var scope1 = sp.CreateScope();
        var service1 = scope1.ServiceProvider.GetRequiredService<CustomizableMetadataService>();
        var metadata1 = service1.GetCustomizedMetadata("account");
        
        using var scope2 = sp.CreateScope();
        var service2 = scope2.ServiceProvider.GetRequiredService<CustomizableMetadataService>();
        var metadata2 = service2.GetCustomizedMetadata("account");

        // Assert - baseline data should be identical across scopes
        Assert.NotNull(metadata1);
        Assert.NotNull(metadata2);
        Assert.Equal(metadata1.LogicalName, metadata2.LogicalName);
        Assert.Equal(metadata1.DisplayName, metadata2.DisplayName);
        Assert.Equal(metadata1.Fields.Count, metadata2.Fields.Count);
    }

    #endregion
}
