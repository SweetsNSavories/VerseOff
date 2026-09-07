#pragma warning disable CA1707 // Remove underscores from member names
#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names

using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using XunitAssert = Xunit.Assert;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Storage;

namespace VerseOff.Customization.Tests;

[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class JsonFileCustomizationStoreTests
{
    private readonly Mock<ILogger<JsonFileCustomizationStore>> _mockLogger = new();
    private readonly string _tempDirectory;

    public JsonFileCustomizationStoreTests()
    {
        _tempDirectory = Path.Combine(Path.GetTempPath(), $"verseoff-test-{Guid.NewGuid()}");
        if (Directory.Exists(_tempDirectory))
            Directory.Delete(_tempDirectory, true);
    }

    [Fact]
    public async Task SaveAsync_WithValidCustomization_CreatesJsonFile()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);
        var customization = new CustomizationLayer(Version: "1.0.0");

        await store.SaveAsync("account", customization);

        var filePath = Path.Combine(_tempDirectory, "account.json");
        XunitAssert.True(File.Exists(filePath), $"File should exist at {filePath}");
    }

    [Fact]
    public async Task SaveAsync_AndLoadAsync_RoundTripPreservesData()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);
        var customization = new CustomizationLayer(
            Version: "1.0.0",
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "custom_field",
                    ModificationType: FieldModificationType.Add,
                    PropertyChanges: new Dictionary<string, object> { { "DisplayName", "Custom Field" } }
                )
            }
        );

        await store.SaveAsync("account", customization);
        var loaded = await store.LoadAsync("account");

        XunitAssert.NotNull(loaded);
        XunitAssert.NotNull(loaded.FieldModifications);
        XunitAssert.Single(loaded.FieldModifications);
        XunitAssert.Equal("custom_field", loaded.FieldModifications[0].FieldLogicalName);
    }

    [Fact]
    public async Task DeleteAsync_WithExistingFile_RemovesFile()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);
        var customization = new CustomizationLayer(Version: "1.0.0");
        await store.SaveAsync("account", customization);

        var filePath = Path.Combine(_tempDirectory, "account.json");
        XunitAssert.True(File.Exists(filePath));

        await store.DeleteAsync("account");

        XunitAssert.False(File.Exists(filePath));
    }

    [Fact]
    public async Task ExistsAsync_WithExistingCustomization_ReturnsTrue()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);
        var customization = new CustomizationLayer(Version: "1.0.0");
        await store.SaveAsync("account", customization);

        var exists = await store.ExistsAsync("account");

        XunitAssert.True(exists);
    }

    [Fact]
    public async Task ExistsAsync_WithNonexistentCustomization_ReturnsFalse()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);

        var exists = await store.ExistsAsync("nonexistent");

        XunitAssert.False(exists);
    }

    [Fact]
    public async Task ListCustomizedEntitiesAsync_WithMultipleEntities_ReturnsAllEntityNames()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);
        await store.SaveAsync("account", new CustomizationLayer(Version: "1.0.0"));
        await store.SaveAsync("contact", new CustomizationLayer(Version: "1.0.0"));
        await store.SaveAsync("opportunity", new CustomizationLayer(Version: "1.0.0"));

        var entities = await store.ListCustomizedEntitiesAsync();

        XunitAssert.Equal(3, entities.Count);
        XunitAssert.Contains("account", entities);
        XunitAssert.Contains("contact", entities);
        XunitAssert.Contains("opportunity", entities);
    }

    [Fact]
    public async Task ListCustomizedEntitiesAsync_WithNoCustomizations_ReturnsEmptyList()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);

        var entities = await store.ListCustomizedEntitiesAsync();

        XunitAssert.Empty(entities);
    }

    [Fact]
    public async Task ExportAsync_WithMultipleEntities_ReturnsJsonString()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);
        await store.SaveAsync("account", new CustomizationLayer(Version: "1.0.0"));
        await store.SaveAsync("contact", new CustomizationLayer(Version: "1.0.0"));

        var exported = await store.ExportAsync("json");

        XunitAssert.NotEmpty(exported);
        XunitAssert.Contains("account", exported, StringComparison.OrdinalIgnoreCase);
        XunitAssert.Contains("contact", exported, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ImportAsync_WithValidJsonContent_CreatesFiles()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);
        var json = @"{
  ""account"": { ""version"": ""1.0.0"", ""fieldModifications"": [] },
  ""contact"": { ""version"": ""1.0.0"", ""fieldModifications"": [] }
}";

        await store.ImportAsync(json, "json");

        // Check that files were created for entities
        var accountFile = Path.Combine(_tempDirectory, "account.json");
        var contactFile = Path.Combine(_tempDirectory, "contact.json");
        XunitAssert.True(File.Exists(accountFile), $"Account file should exist at {accountFile}");
        XunitAssert.True(File.Exists(contactFile), $"Contact file should exist at {contactFile}");
    }

    [Fact]
    public async Task LoadAsync_WithNonexistentFile_ReturnsNull()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);

        var loaded = await store.LoadAsync("nonexistent");

        XunitAssert.Null(loaded);
    }

    [Fact]
    public async Task SaveAsync_WithNullCustomization_ThrowsArgumentNullException()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);

        await XunitAssert.ThrowsAsync<ArgumentNullException>(() => store.SaveAsync("account", null!));
    }

    [Fact]
    public async Task SaveAsync_CreatesDirectoryIfNotExists()
    {
        var nestedPath = Path.Combine(_tempDirectory, "nested", "path");
        XunitAssert.False(Directory.Exists(nestedPath));

        var store = new JsonFileCustomizationStore(nestedPath, _mockLogger.Object);
        await store.SaveAsync("account", new CustomizationLayer(Version: "1.0.0"));

        XunitAssert.True(Directory.Exists(nestedPath));
    }

    [Fact]
    public async Task DeleteAsync_WithNonexistentEntity_DoesNotThrow()
    {
        var store = new JsonFileCustomizationStore(_tempDirectory, _mockLogger.Object);

        await store.DeleteAsync("nonexistent");
    }
}
