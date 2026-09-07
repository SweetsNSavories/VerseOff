#pragma warning disable CA1707 // Suppress underscores in member names (xUnit convention)
using Microsoft.Extensions.Logging;
using Moq;
using VerseOff.Customization.Baseline;
using VerseOff.Customization.Metadata;
using Xunit;
using Assert = Xunit.Assert;

namespace VerseOff.Customization.Tests.Baseline;

public class BaselineMetadataLoaderTests
{
    private readonly Mock<ILogger<BaselineMetadataLoader>> _mockLogger;
    private readonly BaselineMetadataLoader _loader;

    public BaselineMetadataLoaderTests()
    {
        _mockLogger = new Mock<ILogger<BaselineMetadataLoader>>();
        _loader = new BaselineMetadataLoader(_mockLogger.Object);
    }

    #region Constructor Tests

    [Fact]
    public void Constructor_WithNullLogger_ThrowsArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() => new BaselineMetadataLoader(null!));
    }

    #endregion

    #region ParseMetadataJson Tests

    [Fact]
    public void ParseMetadataJson_WithValidSchema_ReturnsEntityMetadata()
    {
        // Arrange
        var json = @"{
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
                            ""required"": true
                        },
                        {
                            ""logicalName"": ""name"",
                            ""displayName"": ""Account Name"",
                            ""attributeType"": ""String"",
                            ""maxLength"": 160,
                            ""required"": true
                        }
                    ],
                    ""availableEventHandlers"": [""onLoad"", ""onSave""],
                    ""associatedForms"": [""Information""],
                    ""associatedViews"": [""Active Accounts""]
                }
            ]
        }";

        // Act
        var result = _loader.ParseMetadataJson(json);

        // Assert
        Assert.NotEmpty(result);
        Assert.True(result.ContainsKey("account"));
        
        var accountMetadata = result["account"];
        Assert.Equal("account", accountMetadata.LogicalName);
        Assert.Equal("Account", accountMetadata.DisplayName);
        Assert.Equal("Accounts", accountMetadata.PluralName);
        Assert.Equal(2, accountMetadata.Fields.Count);
        Assert.Equal(2, accountMetadata.AvailableEventHandlers.Count);
        Assert.Single(accountMetadata.AssociatedForms);
        Assert.Single(accountMetadata.AssociatedViews);
    }

    [Fact]
    public void ParseMetadataJson_WithMultipleEntities_ReturnsAllEntities()
    {
        // Arrange
        var json = @"{
            ""version"": ""1.0"",
            ""entities"": [
                {
                    ""logicalName"": ""account"",
                    ""displayName"": ""Account"",
                    ""pluralName"": ""Accounts"",
                    ""fields"": [],
                    ""availableEventHandlers"": [],
                    ""associatedForms"": [],
                    ""associatedViews"": []
                },
                {
                    ""logicalName"": ""contact"",
                    ""displayName"": ""Contact"",
                    ""pluralName"": ""Contacts"",
                    ""fields"": [],
                    ""availableEventHandlers"": [],
                    ""associatedForms"": [],
                    ""associatedViews"": []
                }
            ]
        }";

        // Act
        var result = _loader.ParseMetadataJson(json);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.True(result.ContainsKey("account"));
        Assert.True(result.ContainsKey("contact"));
    }

    [Fact]
    public void ParseMetadataJson_WithEmptySchema_ReturnsEmptyDictionary()
    {
        // Arrange
        var json = @"{
            ""version"": ""1.0"",
            ""entities"": []
        }";

        // Act
        var result = _loader.ParseMetadataJson(json);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void ParseMetadataJson_WithNullContent_ReturnsEmptyDictionary()
    {
        // Act
        var result = _loader.ParseMetadataJson(null!);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void ParseMetadataJson_WithEmptyContent_ReturnsEmptyDictionary()
    {
        // Act
        var result = _loader.ParseMetadataJson("");

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void ParseMetadataJson_WithInvalidJson_ThrowsJsonException()
    {
        // Arrange
        var json = "{invalid json}";

        // Act & Assert
        Assert.Throws<System.Text.Json.JsonException>(() => _loader.ParseMetadataJson(json));
    }

    [Fact]
    public void ParseMetadataJson_WithMissingFields_UsesDefaults()
    {
        // Arrange
        var json = @"{
            ""version"": ""1.0"",
            ""entities"": [
                {
                    ""logicalName"": ""account"",
                    ""displayName"": ""Account"",
                    ""pluralName"": ""Accounts""
                }
            ]
        }";

        // Act
        var result = _loader.ParseMetadataJson(json);

        // Assert
        var accountMetadata = result["account"];
        Assert.Empty(accountMetadata.Fields);
        Assert.Empty(accountMetadata.AvailableEventHandlers);
        Assert.Empty(accountMetadata.AssociatedForms);
        Assert.Empty(accountMetadata.AssociatedViews);
    }

    [Fact]
    public void ParseMetadataJson_WithCaseInsensitiveKeys_SuccessfullyParses()
    {
        // Arrange
        var json = @"{
            ""VERSION"": ""1.0"",
            ""ENTITIES"": [
                {
                    ""LOGICALNAME"": ""account"",
                    ""DISPLAYNAME"": ""Account"",
                    ""PLURALNAME"": ""Accounts"",
                    ""FIELDS"": [],
                    ""AVAILABLEEVENTHANDLERS"": [],
                    ""ASSOCIATEDFORMS"": [],
                    ""ASSOCIATEDVIEWS"": []
                }
            ]
        }";

        // Act
        var result = _loader.ParseMetadataJson(json);

        // Assert
        Assert.True(result.ContainsKey("account"));
    }

    #endregion

    #region LoadFromFileAsync Tests

    [Fact]
    public async Task LoadFromFileAsync_WithValidFile_ReturnsEntityMetadata()
    {
        // Arrange
        var tempFile = Path.Combine(Path.GetTempPath(), $"baseline-metadata-{Guid.NewGuid()}.json");
        var json = @"{
            ""version"": ""1.0"",
            ""entities"": [
                {
                    ""logicalName"": ""account"",
                    ""displayName"": ""Account"",
                    ""pluralName"": ""Accounts"",
                    ""fields"": [],
                    ""availableEventHandlers"": [],
                    ""associatedForms"": [],
                    ""associatedViews"": []
                }
            ]
        }";

        try
        {
            File.WriteAllText(tempFile, json);

            // Act
            var result = await _loader.LoadFromFileAsync(tempFile);

            // Assert
            Assert.True(result.ContainsKey("account"));
        }
        finally
        {
            if (File.Exists(tempFile))
                File.Delete(tempFile);
        }
    }

    [Fact]
    public async Task LoadFromFileAsync_WithNonexistentFile_ThrowsFileNotFoundException()
    {
        // Arrange
        var nonexistentFile = Path.Combine(Path.GetTempPath(), "nonexistent-baseline.json");

        // Act & Assert
        await Assert.ThrowsAsync<FileNotFoundException>(() => _loader.LoadFromFileAsync(nonexistentFile));
    }

    [Fact]
    public async Task LoadFromFileAsync_WithEmptyPath_ThrowsArgumentException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _loader.LoadFromFileAsync(""));
    }

    [Fact]
    public async Task LoadFromFileAsync_WithNullPath_ThrowsArgumentException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _loader.LoadFromFileAsync(null!));
    }

    #endregion

    #region MergeMetadata Tests

    [Fact]
    public void MergeMetadata_WithMultipleSources_MergesAllEntities()
    {
        // Arrange
        var source1 = new Dictionary<string, EntityMetadata>
        {
            { "account", new EntityMetadata("account", "Account", "Accounts", new(), new(), new(), new()) }
        };

        var source2 = new Dictionary<string, EntityMetadata>
        {
            { "contact", new EntityMetadata("contact", "Contact", "Contacts", new(), new(), new(), new()) }
        };

        // Act
        var result = _loader.MergeMetadata(source1, source2);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.True(result.ContainsKey("account"));
        Assert.True(result.ContainsKey("contact"));
    }

    [Fact]
    public void MergeMetadata_WithDuplicateEntities_LaterEntriesOverride()
    {
        // Arrange
        var source1 = new Dictionary<string, EntityMetadata>
        {
            { "account", new EntityMetadata("account", "Account v1", "Accounts", new(), new(), new(), new()) }
        };

        var source2 = new Dictionary<string, EntityMetadata>
        {
            { "account", new EntityMetadata("account", "Account v2", "Accounts", new(), new(), new(), new()) }
        };

        // Act
        var result = _loader.MergeMetadata(source1, source2);

        // Assert
        Assert.Single(result);
        Assert.Equal("Account v2", result["account"].DisplayName);
    }

    [Fact]
    public void MergeMetadata_WithEmptySources_ReturnsEmptyDictionary()
    {
        // Act
        var result = _loader.MergeMetadata();

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void MergeMetadata_WithNullSources_IgnoresNulls()
    {
        // Arrange
        var source = new Dictionary<string, EntityMetadata>
        {
            { "account", new EntityMetadata("account", "Account", "Accounts", new(), new(), new(), new()) }
        };

        // Act
        var result = _loader.MergeMetadata(null!, source, null!);

        // Assert
        Assert.Single(result);
        Assert.True(result.ContainsKey("account"));
    }

    #endregion
}
