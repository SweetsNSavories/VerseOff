#pragma warning disable CA1707 // Remove underscores from member names
#pragma warning disable CA1848 // Use LoggerMessage delegates
#pragma warning disable CA1727 // Use PascalCase for parameter names

using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using XunitAssert = Xunit.Assert;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;
using VerseOff.Customization.Runtime;
using VerseOff.Customization.Storage;

namespace VerseOff.Customization.Tests;

[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class RuntimeCustomizationApplicationTests
{
    private readonly Mock<ICustomizationStore> _mockStore = new();
    private readonly Mock<ILogger<RuntimeCustomizationApplication>> _mockLogger = new();
    private readonly CustomizationApplier _applier;

    public RuntimeCustomizationApplicationTests()
    {
        _applier = new CustomizationApplier(Mock.Of<ILogger<CustomizationApplier>>());
    }

    [Fact]
    public async Task InitializeAsync_WithStoredCustomizations_LoadsAllCustomizationsIntoCache()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var customizations = new Dictionary<string, CustomizationLayer>
        {
            { "account", new CustomizationLayer(Version: "1.0.0") },
            { "contact", new CustomizationLayer(Version: "1.0.0") },
            { "opportunity", new CustomizationLayer(Version: "1.0.0") }
        };

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account", "contact", "opportunity" });

        foreach (var (entityName, customization) in customizations)
        {
            _mockStore.Setup(s => s.LoadAsync(entityName, It.IsAny<CancellationToken>()))
                .ReturnsAsync(customization);
        }

        await runtime.InitializeAsync();

        XunitAssert.Equal(3, runtime.CachedCustomizationCount);
        XunitAssert.True(runtime.HasCustomizations("account"));
        XunitAssert.True(runtime.HasCustomizations("contact"));
        XunitAssert.True(runtime.HasCustomizations("opportunity"));
    }

    [Fact]
    public async Task InitializeAsync_WithNoCustomizations_CacheRemainEmpty()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string>());

        await runtime.InitializeAsync();

        XunitAssert.Equal(0, runtime.CachedCustomizationCount);
    }

    [Fact]
    public async Task InitializeAsync_WithLoadFailure_SkipsFailedEntityAndContinues()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account", "contact", "opportunity" });

        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CustomizationLayer(Version: "1.0.0"));
        _mockStore.Setup(s => s.LoadAsync("contact", It.IsAny<CancellationToken>()))
            .ThrowsAsync(new IOException("Load failed"));
        _mockStore.Setup(s => s.LoadAsync("opportunity", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CustomizationLayer(Version: "1.0.0"));

        await runtime.InitializeAsync();

        XunitAssert.Equal(2, runtime.CachedCustomizationCount);
        XunitAssert.True(runtime.HasCustomizations("account"));
        XunitAssert.False(runtime.HasCustomizations("contact"));
        XunitAssert.True(runtime.HasCustomizations("opportunity"));
    }

    [Fact]
    public async Task ApplyCustomizationsAsync_WithCachedCustomization_ReturnsCustomizedEntity()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var customization = new CustomizationLayer(
            Version: "1.0.0",
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "name",
                    ModificationType: FieldModificationType.Remove
                )
            }
        );

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization);

        await runtime.InitializeAsync();
        var result = await runtime.ApplyCustomizationsAsync("account", baselineEntity);

        XunitAssert.NotNull(result);
        XunitAssert.Equal(baselineEntity.Fields.Count - 1, result.Fields.Count);
    }

    [Fact]
    public async Task ApplyCustomizationsAsync_WithNoCustomization_ReturnsBaselineEntity()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string>());

        await runtime.InitializeAsync();
        var result = await runtime.ApplyCustomizationsAsync("account", baselineEntity);

        XunitAssert.NotNull(result);
        XunitAssert.Equal(baselineEntity.Fields.Count, result.Fields.Count);
    }

    [Fact]
    public async Task ApplyCustomizationsAsync_WithLazyLoadAndLoadFromStoreFalse_ReturnsBaselineWithoutLoading()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string>());

        await runtime.InitializeAsync();
        var result = await runtime.ApplyCustomizationsAsync("account", baselineEntity, loadFromStore: false);

        XunitAssert.NotNull(result);
        _mockStore.Verify(s => s.LoadAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task HasCustomizations_WithCachedCustomization_ReturnsTrue()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var customization = new CustomizationLayer(Version: "1.0.0");

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization);

        await runtime.InitializeAsync();

        XunitAssert.True(runtime.HasCustomizations("account"));
        XunitAssert.False(runtime.HasCustomizations("contact"));
    }

    [Fact]
    public async Task GetCustomization_WithCachedCustomization_ReturnsCustomization()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var customization = new CustomizationLayer(Version: "1.0.0");

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization);

        await runtime.InitializeAsync();

        var result = runtime.GetCustomization("account");
        XunitAssert.NotNull(result);
        XunitAssert.Equal("1.0.0", result.Version);
    }

    [Fact]
    public async Task GetCustomization_WithMissingCustomization_ReturnsNull()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string>());

        await runtime.InitializeAsync();

        var result = runtime.GetCustomization("account");
        XunitAssert.Null(result);
    }

    [Fact]
    public async Task RefreshCustomizationAsync_WithUpdatedCustomization_UpdatesCache()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var customization1 = new CustomizationLayer(Version: "1.0.0");
        var customization2 = new CustomizationLayer(Version: "2.0.0");

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization1);

        await runtime.InitializeAsync();
        XunitAssert.Equal("1.0.0", runtime.GetCustomization("account")!.Version);

        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization2);

        await runtime.RefreshCustomizationAsync("account");

        XunitAssert.Equal("2.0.0", runtime.GetCustomization("account")!.Version);
    }

    [Fact]
    public async Task RefreshCustomizationAsync_WithDeletedCustomization_RemovesFromCache()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var customization = new CustomizationLayer(Version: "1.0.0");

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization);

        await runtime.InitializeAsync();
        XunitAssert.True(runtime.HasCustomizations("account"));

        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(null as CustomizationLayer);

        await runtime.RefreshCustomizationAsync("account");

        XunitAssert.False(runtime.HasCustomizations("account"));
    }

    [Fact]
    public async Task ClearCache_RemovesAllCachedCustomizations()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account", "contact" });
        _mockStore.Setup(s => s.LoadAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CustomizationLayer(Version: "1.0.0"));

        await runtime.InitializeAsync();
        XunitAssert.Equal(2, runtime.CachedCustomizationCount);

        runtime.ClearCache();

        XunitAssert.Equal(0, runtime.CachedCustomizationCount);
        XunitAssert.False(runtime.HasCustomizations("account"));
    }

    [Fact]
    public async Task ApplyCustomizationsAsync_WithNullEntityName_ThrowsArgumentException()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();

        await XunitAssert.ThrowsAsync<ArgumentException>(() =>
            runtime.ApplyCustomizationsAsync(null!, baselineEntity)
        );
    }

    [Fact]
    public async Task ApplyCustomizationsAsync_WithNullBaselineEntity_ThrowsArgumentNullException()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);

        await XunitAssert.ThrowsAsync<ArgumentNullException>(() =>
            runtime.ApplyCustomizationsAsync("account", null!)
        );
    }

    [Fact]
    public void HasCustomizations_WithNullEntityName_ThrowsArgumentException()
    {
        var runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);

        XunitAssert.Throws<ArgumentException>(() => runtime.HasCustomizations(null!));
    }

    private static EntityMetadata CreateTestEntityMetadata()
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

        return new EntityMetadata(
            LogicalName: "account",
            DisplayName: "Account",
            PluralName: "Accounts",
            Fields: fields,
            AvailableEventHandlers: new List<string> { "OnSave", "OnLoad", "OnChange" },
            AssociatedForms: new List<string> { "account_form" },
            AssociatedViews: new List<string> { "account_view" }
        );
    }
}
