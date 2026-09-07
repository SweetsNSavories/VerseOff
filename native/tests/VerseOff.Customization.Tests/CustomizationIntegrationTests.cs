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

/// <summary>
/// Integration tests for the complete customization pipeline:
/// API endpoint → Storage layer → Runtime application → Metadata service.
/// </summary>
[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class CustomizationIntegrationTests
{
    private readonly Mock<ICustomizationStore> _mockStore;
    private readonly CustomizationApplier _applier;
    private readonly RuntimeCustomizationApplication _runtime;
    private readonly Mock<ILogger<RuntimeCustomizationApplication>> _mockLogger;

    public CustomizationIntegrationTests()
    {
        _mockStore = new();
        _mockLogger = new();
        _applier = new CustomizationApplier(Mock.Of<ILogger<CustomizationApplier>>());
        _runtime = new RuntimeCustomizationApplication(_mockStore.Object, _applier, _mockLogger.Object);
    }

    private static EntityMetadata CreateBaselineAccount()
    {
        return new EntityMetadata(
            LogicalName: "account",
            DisplayName: "Account",
            PluralName: "accounts",
            Fields: new List<FieldMetadata>
            {
                new("accountid", "Account ID", "Guid"),
                new("name", "Name", "String", MaxLength: 160),
                new("industrycode", "Industry Code", "Int", Required: true),
                new("creditlimit", "Credit Limit", "Money")
            },
            AvailableEventHandlers: new List<string> { "OnLoad", "OnSave" },
            AssociatedForms: new List<string> { "account_form_main" },
            AssociatedViews: new List<string> { "active_accounts" }
        );
    }

    [Fact]
    public async Task EndToEnd_SaveCustomization_ThenLoadAndApply_ProducesCustomizedMetadata()
    {
        // Arrange
        var baseline = CreateBaselineAccount();
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "email",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "email",
                        DisplayName: "Email Address",
                        AttributeType: "String",
                        MaxLength: 256
                    )
                )
            },
            Version: "1.0.0",
            CreatedBy: "testuser"
        );

        // Mock the storage to return our customization
        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization);

        // Act 1: Initialize runtime (simulates app startup)
        await _runtime.InitializeAsync();

        // Assert 1: Customization is cached
        XunitAssert.True(_runtime.HasCustomizations("account"));
        var cached = _runtime.GetCustomization("account");
        XunitAssert.NotNull(cached);
        XunitAssert.Equal("1.0.0", cached.Version);

        // Act 2: Apply customizations to baseline metadata
        var customized = await _runtime.ApplyCustomizationsAsync("account", baseline);

        // Assert 2: Customized metadata includes new field
        XunitAssert.Equal(5, customized.Fields.Count);  // 4 original + 1 new
        var emailField = customized.Fields.FirstOrDefault(f => f.LogicalName == "email");
        XunitAssert.NotNull(emailField);
        XunitAssert.Equal("Email Address", emailField.DisplayName);
        XunitAssert.Equal(256, emailField.MaxLength);

        // Assert 3: Baseline is unchanged (immutable contract)
        XunitAssert.Equal(4, baseline.Fields.Count);
        XunitAssert.Null(baseline.Fields.FirstOrDefault(f => f.LogicalName == "email"));
    }

    [Fact]
    public async Task EndToEnd_ModifyCustomization_ThenRefreshAndReapply_ReflectsUpdates()
    {
        // Arrange
        var baseline = CreateBaselineAccount();
        var customization1 = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "phone",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "phone",
                        DisplayName: "Phone",
                        AttributeType: "String",
                        MaxLength: 20
                    )
                )
            },
            Version: "1.0.0"
        );

        var customization2 = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "phone",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "phone",
                        DisplayName: "Phone Number",
                        AttributeType: "String",
                        MaxLength: 30
                    )
                ),
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "email",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "email",
                        DisplayName: "Email",
                        AttributeType: "String",
                        MaxLength: 256
                    )
                )
            },
            Version: "2.0.0"
        );

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization1);

        // Act 1: Initialize runtime
        await _runtime.InitializeAsync();

        // Assert 1: Version 1.0.0 applied
        var customized1 = await _runtime.ApplyCustomizationsAsync("account", baseline);
        XunitAssert.Equal(5, customized1.Fields.Count);  // 4 original + phone
        XunitAssert.NotNull(customized1.Fields.FirstOrDefault(f => f.LogicalName == "phone"));

        // Act 2: Simulate edit API call and refresh cache
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization2);
        await _runtime.RefreshCustomizationAsync("account");

        // Assert 2: Cache updated to version 2.0.0
        var refreshed = _runtime.GetCustomization("account");
        XunitAssert.NotNull(refreshed);
        XunitAssert.Equal("2.0.0", refreshed.Version);

        // Act 3: Re-apply with updated customization
        var customized2 = await _runtime.ApplyCustomizationsAsync("account", baseline);

        // Assert 3: Version 2.0.0 changes reflected (2 new fields, 1 updated)
        XunitAssert.Equal(6, customized2.Fields.Count);  // 4 original + phone + email
        var phone = customized2.Fields.FirstOrDefault(f => f.LogicalName == "phone");
        XunitAssert.NotNull(phone);
        XunitAssert.Equal("Phone Number", phone.DisplayName);  // Updated display name
        XunitAssert.Equal(30, phone.MaxLength);  // Updated max length
        var email = customized2.Fields.FirstOrDefault(f => f.LogicalName == "email");
        XunitAssert.NotNull(email);
    }

    [Fact]
    public async Task EndToEnd_MultipleEntities_EachWithDifferentCustomizations()
    {
        // Arrange
        var accountCustomization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "website",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "website",
                        DisplayName: "Website",
                        AttributeType: "String",
                        MaxLength: 2048
                    )
                )
            },
            Version: "1.0.0"
        );

        var contactCustomization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "contact",
                    FieldLogicalName: "salutation",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "salutation",
                        DisplayName: "Salutation",
                        AttributeType: "String",
                        MaxLength: 10
                    )
                )
            },
            Version: "1.0.0"
        );

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account", "contact" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(accountCustomization);
        _mockStore.Setup(s => s.LoadAsync("contact", It.IsAny<CancellationToken>()))
            .ReturnsAsync(contactCustomization);

        // Act: Initialize runtime
        await _runtime.InitializeAsync();

        // Assert: Both entities customizations cached and ready
        XunitAssert.Equal(2, _runtime.CachedCustomizationCount);
        XunitAssert.True(_runtime.HasCustomizations("account"));
        XunitAssert.True(_runtime.HasCustomizations("contact"));

        // Apply customizations to both entities
        var accountBaseline = CreateBaselineAccount();
        var contactBaseline = new EntityMetadata(
            LogicalName: "contact",
            DisplayName: "Contact",
            PluralName: "contacts",
            Fields: new List<FieldMetadata>
            {
                new("contactid", "Contact ID", "Guid"),
                new("firstname", "First Name", "String", MaxLength: 50),
                new("lastname", "Last Name", "String", MaxLength: 50)
            },
            AvailableEventHandlers: new List<string> { "OnLoad", "OnSave" },
            AssociatedForms: new List<string>(),
            AssociatedViews: new List<string>()
        );

        var customizedAccount = await _runtime.ApplyCustomizationsAsync("account", accountBaseline);
        var customizedContact = await _runtime.ApplyCustomizationsAsync("contact", contactBaseline);

        // Verify independent customizations applied correctly
        XunitAssert.NotNull(customizedAccount.Fields.FirstOrDefault(f => f.LogicalName == "website"));
        XunitAssert.NotNull(customizedContact.Fields.FirstOrDefault(f => f.LogicalName == "salutation"));
        XunitAssert.Null(customizedAccount.Fields.FirstOrDefault(f => f.LogicalName == "salutation"));
        XunitAssert.Null(customizedContact.Fields.FirstOrDefault(f => f.LogicalName == "website"));
    }

    [Fact]
    public async Task EndToEnd_DeleteCustomization_ThenRefreshAndReapply_ReturnsBaseline()
    {
        // Arrange
        var baseline = CreateBaselineAccount();
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "newfield",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "newfield",
                        DisplayName: "New Field",
                        AttributeType: "String"
                    )
                )
            },
            Version: "1.0.0"
        );

        _mockStore.Setup(s => s.ListCustomizedEntitiesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<string> { "account" });
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync(customization);

        // Act 1: Initialize and apply
        await _runtime.InitializeAsync();
        var customized = await _runtime.ApplyCustomizationsAsync("account", baseline);
        XunitAssert.Equal(5, customized.Fields.Count);

        // Act 2: Simulate deletion (store returns null)
        _mockStore.Setup(s => s.LoadAsync("account", It.IsAny<CancellationToken>()))
            .ReturnsAsync((CustomizationLayer?)null);
        await _runtime.RefreshCustomizationAsync("account");

        // Assert: Customization removed from cache
        XunitAssert.False(_runtime.HasCustomizations("account"));

        // Act 3: Apply to baseline (no customizations)
        var uncustomized = await _runtime.ApplyCustomizationsAsync("account", baseline);

        // Assert: Returns baseline unchanged
        XunitAssert.Equal(4, uncustomized.Fields.Count);
        XunitAssert.Null(uncustomized.Fields.FirstOrDefault(f => f.LogicalName == "newfield"));
    }
}
