#pragma warning disable CA1707 // Suppress underscores in member names (xUnit convention)

using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using VerseOff.Customization.Baseline;
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

public sealed class AppLoadingControllerTests
{
    [Fact]
    public async Task LoadOfflinePackage_WithCommittedQuotePackage_RegistersAllEntityMetadata()
    {
        var metadataService = CreateMetadataService();
        var controller = CreateController(metadataService);
        var packagePath = FindQuotePackagePath();

        var result = await controller.LoadOfflinePackage(
            new AppPackageLoadRequest { PackagePath = packagePath });

        var response = Assert.IsType<OkObjectResult>(result);
        using var document = JsonDocument.Parse(JsonSerializer.Serialize(response.Value));

        Assert.Equal("Successfully loaded offline app package", document.RootElement.GetProperty("message").GetString());
        Assert.Equal(3, document.RootElement.GetProperty("entityCount").GetInt32());
        Assert.Equal(3, metadataService.GetAllEntities().Count);
        Assert.NotNull(metadataService.GetCustomizedMetadata("account").GetField("accountid"));
        Assert.NotNull(metadataService.GetCustomizedMetadata("contact").GetField("contactid"));
        Assert.NotNull(metadataService.GetCustomizedMetadata("quote").GetField("quoteid"));
    }

    [Fact]
    public async Task LoadOfflinePackage_WithMissingPath_ReturnsNotFoundWithoutChangingMetadata()
    {
        var metadataService = CreateMetadataService();
        var controller = CreateController(metadataService);

        var result = await controller.LoadOfflinePackage(
            new AppPackageLoadRequest { PackagePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N")) });

        var response = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Empty(metadataService.GetAllEntities());
        Assert.Contains("Package directory not found", JsonSerializer.Serialize(response.Value));
    }

    [Fact]
    public async Task GetAppStatus_AfterLoadingPackage_ReportsLoadedEntities()
    {
        var metadataService = CreateMetadataService();
        var controller = CreateController(metadataService);

        await controller.LoadOfflinePackage(
            new AppPackageLoadRequest { PackagePath = FindQuotePackagePath() });

        var result = controller.GetAppStatus();

        var response = Assert.IsType<OkObjectResult>(result);
        using var document = JsonDocument.Parse(JsonSerializer.Serialize(response.Value));
        Assert.True(document.RootElement.GetProperty("isLoaded").GetBoolean());
        Assert.Equal(3, document.RootElement.GetProperty("entityCount").GetInt32());
    }

    private static CustomizableMetadataService CreateMetadataService()
    {
        var applier = new CustomizationApplier(
            new Mock<ILogger<CustomizationApplier>>().Object);
        var store = new Mock<ICustomizationStore>();
        store.Setup(value => value.ListCustomizedEntitiesAsync(default))
            .ReturnsAsync(new List<string>());
        var runtime = new RuntimeCustomizationApplication(
            store.Object,
            applier,
            new Mock<ILogger<RuntimeCustomizationApplication>>().Object);

        return new CustomizableMetadataService(
            new Dictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase),
            runtime,
            applier);
    }

    private static AppLoadingController CreateController(CustomizableMetadataService metadataService)
    {
        return new AppLoadingController(
            new BaselineMetadataLoader(new Mock<ILogger<BaselineMetadataLoader>>().Object),
            metadataService,
            new Mock<ILogger<AppLoadingController>>().Object);
    }

    private static string FindQuotePackagePath()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var candidate = Path.Combine(current.FullName, "native", "examples", "quote-app-offline");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            current = current.Parent;
        }

        throw new DirectoryNotFoundException("The committed quote-app-offline sample package could not be found.");
    }
}
