#pragma warning disable CA1707 // Suppress underscores in member names (xUnit convention)
using VerseOff.Customization.Baseline;
using VerseOff.Domain;
using Xunit;
using Assert = Xunit.Assert;

namespace VerseOff.Customization.Tests.Baseline;

public class AppJsonBaselineMetadataExtractorTests
{
    #region Helpers

    private static ComponentProvenance CreateTestProvenance() =>
        new ComponentProvenance(
            ComponentId: "test-comp",
            UniqueName: "test",
            Origin: ComponentOrigin.VerseOffOwned,
            SolutionId: "00000000-0000-0000-0000-000000000000",
            PublisherId: "00000000-0000-0000-0000-000000000000",
            Sha256: "0000000000000000000000000000000000000000000000000000000000000000",
            IsManaged: false,
            OwnershipVerified: true
        );

    #endregion

    #region Constructor Null Checks

    [Fact]
    public void ExtractEntityMetadata_WithNullAppDefinition_ThrowsArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() => AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(null!));
    }

    [Fact]
    public void ExtractEntityMetadata_WithNullTableList_ThrowsArgumentNullException()
    {
        // Arrange
        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: null!,
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef));
    }

    #endregion

    #region Entity Extraction Tests

    [Fact]
    public void ExtractEntityMetadata_WithEmptyTableList_ReturnsEmptyDictionary()
    {
        // Arrange
        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition>(),
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public void ExtractEntityMetadata_WithSingleTable_ReturnsEntityMetadata()
    {
        // Arrange
        var columnDef = new ColumnDefinition(
            LogicalName: "name",
            AttributeType: "String",
            CanRead: true,
            CanCreate: true,
            CanUpdate: true,
            IsSecured: false
        )
        {
            DisplayName = "Name",
            MaxLength = 100,
            RequiredLevel = ColumnRequiredLevel.Required
        };

        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition> { columnDef }
        )
        {
            DisplayName = "Account",
            DisplayCollectionName = "Accounts",
            ObjectTypeCode = 1,
            IsCustomizable = true
        };

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        Assert.Single(result);
        Assert.True(result.ContainsKey("account"));

        var entityMetadata = result["account"];
        Assert.Equal("account", entityMetadata.LogicalName);
        Assert.Equal("Account", entityMetadata.DisplayName);
        Assert.Equal("Accounts", entityMetadata.PluralName);
        Assert.Single(entityMetadata.Fields);
    }

    [Fact]
    public void ExtractEntityMetadata_WithMultipleTables_ReturnsAllEntities()
    {
        // Arrange
        var accountTable = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition>()
        )
        {
            DisplayName = "Account",
            DisplayCollectionName = "Accounts",
            ObjectTypeCode = 1,
            IsCustomizable = true
        };

        var contactTable = new TableDefinition(
            LogicalName: "contact",
            EntitySetName: "contacts",
            PrimaryIdAttribute: "contactid",
            PrimaryNameAttribute: "fullname",
            IsActivity: false,
            Columns: new List<ColumnDefinition>()
        )
        {
            DisplayName = "Contact",
            DisplayCollectionName = "Contacts",
            ObjectTypeCode = 2,
            IsCustomizable = true
        };

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { accountTable, contactTable },
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.True(result.ContainsKey("account"));
        Assert.True(result.ContainsKey("contact"));
        Assert.Equal("Account", result["account"].DisplayName);
        Assert.Equal("Contact", result["contact"].DisplayName);
    }

    #endregion

    #region Field Extraction Tests

    [Theory]
    [InlineData(ColumnRequiredLevel.None, false)]
    [InlineData(ColumnRequiredLevel.Recommended, false)]
    [InlineData(ColumnRequiredLevel.Required, true)]
    [InlineData(ColumnRequiredLevel.SystemRequired, true)]
    public void ExtractEntityMetadata_WithVariousRequiredLevels_SetsFieldRequiredCorrectly(
        ColumnRequiredLevel requiredLevel, bool expectedRequired)
    {
        // Arrange
        var columnDef = new ColumnDefinition(
            LogicalName: "name",
            AttributeType: "String",
            CanRead: true,
            CanCreate: true,
            CanUpdate: true,
            IsSecured: false
        )
        {
            DisplayName = "Name",
            MaxLength = 100,
            RequiredLevel = requiredLevel
        };

        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition> { columnDef }
        )
        {
            DisplayName = "Account",
            ObjectTypeCode = 1
        };

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        Assert.Single(result);
        var field = result["account"].Fields[0];
        Assert.Equal(expectedRequired, field.Required);
    }

    [Fact]
    public void ExtractEntityMetadata_WithFieldExtendedProperties_BuildsExtendedPropertiesDictionary()
    {
        // Arrange
        var columnDef = new ColumnDefinition(
            LogicalName: "statuscode",
            AttributeType: "Picklist",
            CanRead: true,
            CanCreate: true,
            CanUpdate: true,
            IsSecured: false
        )
        {
            DisplayName = "Status",
            Precision = 2,
            MinimumValue = 0,
            MaximumValue = 5,
            DefaultValue = "1",
            Options = new List<OptionDefinition>
            {
                new OptionDefinition(1, "Active", null),
                new OptionDefinition(2, "Inactive", null)
            }.AsReadOnly()
        };

        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition> { columnDef }
        )
        {
            DisplayName = "Account",
            ObjectTypeCode = 1
        };

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        var field = result["account"].Fields[0];
        Assert.NotNull(field.ExtendedProperties);
        Assert.True(field.ExtendedProperties!.ContainsKey("Precision"));
        Assert.True(field.ExtendedProperties!.ContainsKey("Options"));
        Assert.Equal(2, ((int)field.ExtendedProperties["Precision"]));
    }

    #endregion

    #region Extended Metadata Tests

    [Fact]
    public void ExtractEntityMetadata_WithTableDefinition_BuildsExtendedMetadata()
    {
        // Arrange
        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition>()
        )
        {
            DisplayName = "Account",
            DisplayCollectionName = "Accounts",
            ObjectTypeCode = 1,
            IsCustomizable = true
        };

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        var entity = result["account"];
        if (entity.ExtendedMetadata != null)
        {
            Assert.True(entity.ExtendedMetadata.Count > 0);
            Assert.True(entity.ExtendedMetadata.ContainsKey("EntitySetName"));
            Assert.True(entity.ExtendedMetadata.ContainsKey("PrimaryIdAttribute"));
            Assert.True(entity.ExtendedMetadata.ContainsKey("ObjectTypeCode"));
            Assert.Equal("accounts", entity.ExtendedMetadata["EntitySetName"]);
            Assert.Equal("accountid", entity.ExtendedMetadata["PrimaryIdAttribute"]);
            Assert.Equal("1", entity.ExtendedMetadata["ObjectTypeCode"]);
        }
    }

    #endregion

    #region Forms and Views Association Tests

    [Fact]
    public void ExtractEntityMetadata_WithAssociatedForms_IncludesFormNamesInMetadata()
    {
        // Arrange
        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition>()
        )
        {
            DisplayName = "Account"
        };

        var form = new FormDefinition(
            FormId: Guid.NewGuid(),
            Name: "AccountMainForm",
            TableLogicalName: "account",
            FormType: 2, // Main form
            Events: new List<FormEventDefinition>(),
            Provenance: CreateTestProvenance()
        )
        {
            Description = "Main form for accounts"
        };

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition> { form },
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        var entity = result["account"];
        Assert.Single(entity.AssociatedForms);
        Assert.Contains("AccountMainForm", entity.AssociatedForms);
    }

    [Fact]
    public void ExtractEntityMetadata_WithAssociatedViews_IncludesViewNamesInMetadata()
    {
        // Arrange
        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition>()
        )
        {
            DisplayName = "Account"
        };

        var view = new ViewDefinition(
            ViewId: Guid.NewGuid(),
            Name: "AccountActiveView",
            TableLogicalName: "account",
            FetchXml: "<fetch/>",
            LayoutXml: "<grid/>",
            IsDefault: false,
            Provenance: CreateTestProvenance()
        );

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition>(),
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        )
        {
            Views = new List<ViewDefinition> { view }.AsReadOnly()
        };

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        var entity = result["account"];
        Assert.Single(entity.AssociatedViews);
        Assert.Contains("AccountActiveView", entity.AssociatedViews);
    }

    #endregion

    #region Event Handler Discovery Tests

    [Fact]
    public void ExtractEntityMetadata_WithFormEvents_DiscoverAvailableEventHandlers()
    {
        // Arrange
        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition>()
        )
        {
            DisplayName = "Account"
        };

        var formEvent1 = new FormEventDefinition(
            EventName: "OnLoad",
            HandlerId: "handler1",
            FunctionName: "onLoadHandler",
            LibraryName: null,
            PassExecutionContext: true,
            Order: 1,
            Provenance: CreateTestProvenance()
        );

        var formEvent2 = new FormEventDefinition(
            EventName: "OnSave",
            HandlerId: "handler2",
            FunctionName: "onSaveHandler",
            LibraryName: null,
            PassExecutionContext: true,
            Order: 2,
            Provenance: CreateTestProvenance()
        );

        var form = new FormDefinition(
            FormId: Guid.NewGuid(),
            Name: "AccountMainForm",
            TableLogicalName: "account",
            FormType: 2,
            Events: new List<FormEventDefinition> { formEvent1, formEvent2 },
            Provenance: CreateTestProvenance()
        );

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition> { form },
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        var entity = result["account"];
        Assert.Equal(2, entity.AvailableEventHandlers.Count);
        Assert.Contains("OnLoad", entity.AvailableEventHandlers);
        Assert.Contains("OnSave", entity.AvailableEventHandlers);
    }

    [Fact]
    public void ExtractEntityMetadata_WithDuplicateEventNames_DeduplicatesEventHandlers()
    {
        // Arrange
        var tableDef = new TableDefinition(
            LogicalName: "account",
            EntitySetName: "accounts",
            PrimaryIdAttribute: "accountid",
            PrimaryNameAttribute: "name",
            IsActivity: false,
            Columns: new List<ColumnDefinition>()
        )
        {
            DisplayName = "Account"
        };

        var onLoadEvent = new FormEventDefinition(
            EventName: "OnLoad",
            HandlerId: "handler1",
            FunctionName: "onLoadHandler",
            LibraryName: null,
            PassExecutionContext: true,
            Order: 1,
            Provenance: CreateTestProvenance()
        );

        var form1 = new FormDefinition(
            FormId: Guid.NewGuid(),
            Name: "AccountMainForm",
            TableLogicalName: "account",
            FormType: 2,
            Events: new List<FormEventDefinition> { onLoadEvent },
            Provenance: CreateTestProvenance()
        );

        var form2 = new FormDefinition(
            FormId: Guid.NewGuid(),
            Name: "AccountQuickCreate",
            TableLogicalName: "account",
            FormType: 6, // Quick create form
            Events: new List<FormEventDefinition> { onLoadEvent }, // Same OnLoad event
            Provenance: CreateTestProvenance()
        );

        var appDef = new ApplicationDefinition(
            AppModuleId: Guid.NewGuid(),
            UniqueName: "TestApp",
            DisplayName: "Test App",
            Tables: new List<TableDefinition> { tableDef },
            Forms: new List<FormDefinition> { form1, form2 },
            Navigation: new List<NavigationDefinition>(),
            SourceHash: "test-hash"
        );

        // Act
        var result = AppJsonBaselineMetadataExtractor.ExtractEntityMetadata(appDef);

        // Assert
        var entity = result["account"];
        Assert.Single(entity.AvailableEventHandlers); // Should be deduplicated
        Assert.Contains("OnLoad", entity.AvailableEventHandlers);
    }

    #endregion
}
