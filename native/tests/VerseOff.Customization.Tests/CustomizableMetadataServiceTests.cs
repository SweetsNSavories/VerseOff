#pragma warning disable CA1707 // Remove underscores from member names

using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using XunitAssert = Xunit.Assert;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Runtime;
using VerseOff.Customization.Services;
using VerseOff.Customization.Storage;

namespace VerseOff.Customization.Tests;

/// <summary>
/// Tests for CustomizableMetadataService - the transparent wrapper
/// that applies customizations to baseline metadata on-demand.
/// </summary>
public class CustomizableMetadataServiceTests
{
    private readonly Dictionary<string, EntityMetadata> _baselineMetadata;

    public CustomizableMetadataServiceTests()
    {
        // Create baseline metadata
        _baselineMetadata = new()
        {
            {
                "account", new(
                    LogicalName: "account",
                    DisplayName: "Account",
                    PluralName: "Accounts",
                    Fields: [
                        new FieldMetadata("accountid", "Account ID", "Guid"),
                        new FieldMetadata("name", "Name", "String", MaxLength: 160)
                    ],
                    AvailableEventHandlers: [],
                    AssociatedForms: [],
                    AssociatedViews: []
                )
            },
            {
                "contact", new(
                    LogicalName: "contact",
                    DisplayName: "Contact",
                    PluralName: "Contacts",
                    Fields: [
                        new FieldMetadata("contactid", "Contact ID", "Guid"),
                        new FieldMetadata("firstname", "First Name", "String")
                    ],
                    AvailableEventHandlers: [],
                    AssociatedForms: [],
                    AssociatedViews: []
                )
            }
        };
    }

    private static RuntimeCustomizationApplication CreateRuntimeApp()
    {
        var mockStore = new Mock<ICustomizationStore>();
        var mockRuntimeLogger = new Mock<ILogger<RuntimeCustomizationApplication>>();
        var mockApplierLogger = new Mock<ILogger<CustomizationApplier>>();
        
        var applier = new CustomizationApplier(mockApplierLogger.Object);
        return new RuntimeCustomizationApplication(mockStore.Object, applier, mockRuntimeLogger.Object);
    }

    private static CustomizationApplier CreateApplier()
    {
        var mockLogger = new Mock<ILogger<CustomizationApplier>>();
        return new CustomizationApplier(mockLogger.Object);
    }

    [Fact]
    public void GetCustomizedMetadata_NoCustomization_ReturnsBaseline()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act
        var result = service.GetCustomizedMetadata("account");

        // Assert
        XunitAssert.NotNull(result);
        XunitAssert.Equal("account", result.LogicalName);
        XunitAssert.Equal("Account", result.DisplayName);
        XunitAssert.Equal(2, result.Fields.Count);
    }

    [Fact]
    public void GetCustomizedMetadata_EntityNotFound_ThrowsException()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act & Assert
        XunitAssert.Throws<InvalidOperationException>(() => 
            service.GetCustomizedMetadata("nonexistent"));
    }

    [Fact]
    public void GetCustomizedMetadata_NullEntityName_ThrowsException()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act & Assert
        XunitAssert.Throws<ArgumentException>(() => 
            service.GetCustomizedMetadata(null!));
    }

    [Fact]
    public void GetCustomizedMetadata_EmptyEntityName_ThrowsException()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act & Assert
        XunitAssert.Throws<ArgumentException>(() => 
            service.GetCustomizedMetadata(""));
    }

    [Fact]
    public void GetCustomizedMetadata_CaseInsensitiveEntityName_ReturnsMetadata()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act
        var result = service.GetCustomizedMetadata("ACCOUNT");

        // Assert
        XunitAssert.NotNull(result);
        XunitAssert.Equal("account", result.LogicalName);
    }

    [Fact]
    public void GetAllEntities_ReturnsAllBaseline()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act
        var result = service.GetAllEntities();

        // Assert
        XunitAssert.Equal(2, result.Count);
        XunitAssert.True(result.ContainsKey("account"));
        XunitAssert.True(result.ContainsKey("contact"));
    }

    [Fact]
    public void GetAllEntities_ReturnsCopy()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act
        var result1 = service.GetAllEntities();
        var result2 = service.GetAllEntities();

        // Assert
        XunitAssert.NotSame(result1, result2);
        XunitAssert.Equal(result1.Count, result2.Count);
    }

    [Fact]
    public void GetAllEntities_ModifyingReturnedDictionary_DoesNotAffectService()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act
        var result = service.GetAllEntities();
        result.Add("test", new EntityMetadata());

        // Assert
        var result2 = service.GetAllEntities();
        XunitAssert.Equal(2, result2.Count);
        XunitAssert.DoesNotContain("test", result2.Keys);
    }

    [Fact]
    public void ReplaceBaselineMetadata_RemovesStaleEntities()
    {
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        service.ReplaceBaselineMetadata(new Dictionary<string, EntityMetadata>
        {
            ["quote"] = new EntityMetadata(
                "quote", "Quote", "Quotes", [], [], [], [])
        });

        var result = service.GetAllEntities();
        XunitAssert.Single(result);
        XunitAssert.True(result.ContainsKey("quote"));
        XunitAssert.False(result.ContainsKey("account"));
    }

    [Fact]
    public void ClearBaselineMetadata_ReturnsUnloadedState()
    {
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        service.ClearBaselineMetadata();

        XunitAssert.Empty(service.GetAllEntities());
        XunitAssert.Throws<InvalidOperationException>(() => service.GetCustomizedMetadata("account"));
    }

    [Fact]
    public void GetAllCustomizedEntities_NoCustomizations_ReturnsAllBaseline()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();
        var service = new CustomizableMetadataService(_baselineMetadata, runtimeApp, applier);

        // Act
        var result = service.GetAllCustomizedEntities();

        // Assert
        XunitAssert.NotNull(result);
        XunitAssert.Equal(2, result.Count);
        XunitAssert.True(result.ContainsKey("account"));
        XunitAssert.True(result.ContainsKey("contact"));
    }

    [Fact]
    public void Constructor_NullBaselineMetadata_ThrowsException()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();
        var applier = CreateApplier();

        // Act & Assert
        XunitAssert.Throws<ArgumentNullException>(() => 
            new CustomizableMetadataService(null!, runtimeApp, applier));
    }

    [Fact]
    public void Constructor_NullRuntimeApp_ThrowsException()
    {
        // Arrange
        var applier = CreateApplier();

        // Act & Assert
        XunitAssert.Throws<ArgumentNullException>(() => 
            new CustomizableMetadataService(_baselineMetadata, null!, applier));
    }

    [Fact]
    public void Constructor_NullApplier_ThrowsException()
    {
        // Arrange
        var runtimeApp = CreateRuntimeApp();

        // Act & Assert
        XunitAssert.Throws<ArgumentNullException>(() => 
            new CustomizableMetadataService(_baselineMetadata, runtimeApp, null!));
    }
}
