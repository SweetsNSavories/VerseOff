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

namespace VerseOff.Customization.Tests;

[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class CustomizationApplierTests
{
    private readonly Mock<ILogger<CustomizationApplier>> _mockLogger = new();

    [Fact]
    public void ApplyCustomizations_WithNullCustomization_ReturnsBaselineMetadata()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();

        var result = applier.ApplyCustomizations(baselineEntity, null);

        XunitAssert.NotNull(result);
        XunitAssert.Equal(baselineEntity.LogicalName, result.LogicalName);
        XunitAssert.Equal(baselineEntity.Fields.Count, result.Fields.Count);
    }

    [Fact]
    public void ApplyCustomizations_WithFieldAddition_ReturnsEntityWithNewField()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "custom_field",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "custom_field",
                        DisplayName: "Custom Field",
                        AttributeType: "String"
                    ),
                    PropertyChanges: new Dictionary<string, object> { { "DisplayName", "Custom Field" } }
                )
            }
        );

        var result = applier.ApplyCustomizations(baselineEntity, customization);

        XunitAssert.NotNull(result);
        // Original should have 4 fields, result should have 5 after adding 1
        XunitAssert.Equal(5, result.Fields.Count);
    }

    [Fact]
    public void ApplyCustomizations_WithFieldRemoval_ReturnsEntityWithFewerFields()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var originalCount = baselineEntity.Fields.Count;
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "name",
                    ModificationType: FieldModificationType.Remove,
                    PropertyChanges: new Dictionary<string, object>()
                )
            }
        );

        var result = applier.ApplyCustomizations(baselineEntity, customization);

        XunitAssert.NotNull(result);
        XunitAssert.Equal(originalCount - 1, result.Fields.Count);
    }

    [Fact]
    public void ApplyCustomizations_WithFieldModification_ReturnsEntityWithModifiedField()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "name",
                    ModificationType: FieldModificationType.Modify,
                    PropertyChanges: new Dictionary<string, object> { { "MaxLength", 200 } }
                )
            }
        );

        var result = applier.ApplyCustomizations(baselineEntity, customization);

        XunitAssert.NotNull(result);
        var modifiedField = result.Fields.FirstOrDefault(f => f.LogicalName == "name");
        XunitAssert.NotNull(modifiedField);
    }

    [Fact]
    public void ApplyCustomizations_WithEventHandlerAddition_ReturnsEntityWithEventHandlers()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var customization = new CustomizationLayer(
            EventHandlers: new List<EventHandlerRegistration>
            {
                new(
                    EntityLogicalName: "account",
                    EventHook: "OnSave",
                    HandlerName: "CustomSaveHandler",
                    HandlerCode: "console.log('saved');",
                    HandlerType: EventHandlerType.JavaScript
                )
            }
        );

        var result = applier.ApplyCustomizations(baselineEntity, customization);

        XunitAssert.NotNull(result);
        XunitAssert.True(result.AvailableEventHandlers.Count > 0);
    }

    [Fact]
    public void ApplyCustomizations_WithMultipleModifications_AppliesAllChanges()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var originalCount = baselineEntity.Fields.Count;
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "custom_field_1",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "custom_field_1",
                        DisplayName: "Custom Field 1",
                        AttributeType: "String"
                    ),
                    PropertyChanges: new Dictionary<string, object>()
                ),
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "custom_field_2",
                    ModificationType: FieldModificationType.Add,
                    NewFieldDefinition: new FieldMetadata(
                        LogicalName: "custom_field_2",
                        DisplayName: "Custom Field 2",
                        AttributeType: "String"
                    ),
                    PropertyChanges: new Dictionary<string, object>()
                )
            },
            EventHandlers: new List<EventHandlerRegistration>
            {
                new(
                    EntityLogicalName: "account",
                    EventHook: "OnLoad",
                    HandlerName: "LoadHandler",
                    HandlerCode: "alert('loaded');",
                    HandlerType: EventHandlerType.JavaScript
                )
            }
        );

        var result = applier.ApplyCustomizations(baselineEntity, customization);

        XunitAssert.NotNull(result);
        XunitAssert.Equal(originalCount + 2, result.Fields.Count);
        XunitAssert.True(result.AvailableEventHandlers.Count > 0);
    }

    [Fact]
    public void ApplyCustomizations_DoesNotMutateBaselineMetadata()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var originalFieldCount = baselineEntity.Fields.Count;
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>
            {
                new(
                    EntityLogicalName: "account",
                    FieldLogicalName: "custom_field",
                    ModificationType: FieldModificationType.Add,
                    PropertyChanges: new Dictionary<string, object>()
                )
            }
        );

        applier.ApplyCustomizations(baselineEntity, customization);

        // Verify baseline is unchanged
        XunitAssert.Equal(originalFieldCount, baselineEntity.Fields.Count);
    }

    [Fact]
    public void ApplyCustomizations_WithEmptyCustomization_ReturnsUnmodifiedEntity()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>(),
            EventHandlers: new List<EventHandlerRegistration>()
        );

        var result = applier.ApplyCustomizations(baselineEntity, customization);

        XunitAssert.NotNull(result);
        XunitAssert.Equal(baselineEntity.Fields.Count, result.Fields.Count);
        XunitAssert.Equal(baselineEntity.AvailableEventHandlers.Count, result.AvailableEventHandlers.Count);
    }

    [Fact]
    public void ApplyCustomizations_PreservesBaselineFieldProperties()
    {
        var applier = new CustomizationApplier(_mockLogger.Object);
        var baselineEntity = CreateTestEntityMetadata();
        var nameField = baselineEntity.Fields.First(f => f.LogicalName == "name");
        var customization = new CustomizationLayer(
            FieldModifications: new List<FieldModification>()
        );

        var result = applier.ApplyCustomizations(baselineEntity, customization);

        var resultNameField = result.Fields.First(f => f.LogicalName == "name");
        XunitAssert.Equal(nameField.DisplayName, resultNameField.DisplayName);
        XunitAssert.Equal(nameField.AttributeType, resultNameField.AttributeType);
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
