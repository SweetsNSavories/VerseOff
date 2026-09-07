using Xunit;
using VerseOff.Customization.Customizations;
using VerseOff.Customization.Forms;
using VerseOff.Customization.Metadata;

namespace VerseOff.Customization.Tests;

[System.Diagnostics.CodeAnalysis.SuppressMessage("CodeQuality", "CA1707:Identifiers should not contain underscores")]
public class FormCustomizerTests
{
    private readonly Dictionary<string, EntityMetadata> _baselineMetadata;
    private readonly FormCustomizer _formCustomizer;

    public FormCustomizerTests()
    {
        _baselineMetadata = CreateTestMetadata();
        _formCustomizer = new FormCustomizer(_baselineMetadata);
    }

    #region Field Management Tests

    [Fact]
    public void AddFieldToSection_SucceedsWithValidField()
    {
        _formCustomizer.AddFieldToSection(
            "account_form",
            "account",
            "General",
            "name"
        );

        var form = _formCustomizer.GetFormCustomization("account_form");
        Assert.NotNull(form);
        Assert.NotNull(form.SectionChanges);
        Assert.Single(form.SectionChanges!);
        
        var section = form.SectionChanges!.First();
        Assert.Contains("name", section.FieldsToAdd!);
    }

    [Fact]
    public void AddFieldToSection_FailsWithInvalidEntity()
    {
        var ex = Assert.Throws<InvalidOperationException>(() =>
            _formCustomizer.AddFieldToSection(
                "form1",
                "nonexistent",
                "section1",
                "field1"
            )
        );

        Assert.Contains("not found", ex.Message);
    }

    [Fact]
    public void AddFieldToSection_FailsWithInvalidField()
    {
        var ex = Assert.Throws<InvalidOperationException>(() =>
            _formCustomizer.AddFieldToSection(
                "account_form",
                "account",
                "General",
                "nonexistent_field"
            )
        );

        Assert.Contains("not found", ex.Message);
    }

    [Fact]
    public void AddFieldToSection_DoesNotAddDuplicates()
    {
        _formCustomizer.AddFieldToSection("account_form", "account", "General", "name");
        _formCustomizer.AddFieldToSection("account_form", "account", "General", "name");

        var form = _formCustomizer.GetFormCustomization("account_form");
        var section = form!.SectionChanges!.First();
        
        Assert.Single(section.FieldsToAdd!);
    }

    [Fact]
    public void RemoveFieldFromSection_SucceedsWithExistingField()
    {
        _formCustomizer.AddFieldToSection("account_form", "account", "General", "name");
        _formCustomizer.RemoveFieldFromSection("account_form", "account", "General", "accountnumber");

        var form = _formCustomizer.GetFormCustomization("account_form");
        var section = form!.SectionChanges!.First(s => s.SectionName == "General");
        
        Assert.NotNull(section.FieldsToRemove);
        Assert.Contains("accountnumber", section.FieldsToRemove);
    }

    [Fact]
    public void RemoveFieldFromSection_FailsWithUnknownForm()
    {
        var ex = Assert.Throws<InvalidOperationException>(() =>
            _formCustomizer.RemoveFieldFromSection("unknown_form", "account", "General", "name")
        );

        Assert.Contains("not customized", ex.Message);
    }

    #endregion

    #region Section & Tab Management Tests

    [Fact]
    public void AddSectionToTab_CreatesNewTab()
    {
        _formCustomizer.AddSectionToTab(
            "account_form",
            "account",
            "Details",
            "Address"
        );

        var form = _formCustomizer.GetFormCustomization("account_form");
        Assert.NotNull(form!.TabChanges);
        Assert.Single(form.TabChanges!);
        
        var tab = form.TabChanges!.First();
        Assert.Equal("Details", tab.TabName);
        Assert.Contains("Address", tab.SectionsToAdd!);
    }

    [Fact]
    public void AddSectionToTab_AddesToExistingTab()
    {
        _formCustomizer.AddSectionToTab("account_form", "account", "Details", "Address");
        _formCustomizer.AddSectionToTab("account_form", "account", "Details", "Billing");

        var form = _formCustomizer.GetFormCustomization("account_form");
        var tab = form!.TabChanges!.First();
        
        Assert.Equal(2, tab.SectionsToAdd!.Count);
        Assert.Contains("Address", tab.SectionsToAdd);
        Assert.Contains("Billing", tab.SectionsToAdd);
    }

    [Fact]
    public void ReorderSections_UpdatesSectionOrder()
    {
        _formCustomizer.ReorderSections(
            "account_form",
            "account",
            "General",
            new()
            {
                { "Section1", 1 },
                { "Section2", 2 },
                { "Section3", 3 }
            }
        );

        var form = _formCustomizer.GetFormCustomization("account_form");
        var sections = form!.SectionChanges!;
        
        Assert.Equal(3, sections.Count);
        Assert.Equal(1, sections[0].Order);
        Assert.Equal(2, sections[1].Order);
        Assert.Equal(3, sections[2].Order);
    }

    #endregion

    #region Visibility Rules Tests

    [Fact]
    public void SetFieldVisibility_CreatesVisibilityRule()
    {
        var condition = new VisibilityCondition(
            VisibilityOperator.Equals,
            "status",
            "active"
        );

        _formCustomizer.SetFieldVisibility("account_form", "description", condition);
        var rules = _formCustomizer.GetVisibilityRules("account_form").ToList();

        Assert.Single(rules);
        Assert.Equal("description", rules[0].FieldName);
    }

    [Fact]
    public void VisibilityCondition_EvaluatesEquals()
    {
        var condition = new VisibilityCondition(
            VisibilityOperator.Equals,
            "status",
            "active"
        );

        var fieldValues = new Dictionary<string, object> { { "status", "active" } };
        Assert.True(condition.Evaluate(fieldValues));

        fieldValues["status"] = "inactive";
        Assert.False(condition.Evaluate(fieldValues));
    }

    [Fact]
    public void VisibilityCondition_EvaluatesNotEquals()
    {
        var condition = new VisibilityCondition(
            VisibilityOperator.NotEquals,
            "status",
            "deleted"
        );

        var fieldValues = new Dictionary<string, object> { { "status", "active" } };
        Assert.True(condition.Evaluate(fieldValues));

        fieldValues["status"] = "deleted";
        Assert.False(condition.Evaluate(fieldValues));
    }

    [Fact]
    public void VisibilityCondition_EvaluatesIsEmpty()
    {
        var condition = new VisibilityCondition(
            VisibilityOperator.IsEmpty,
            "description",
            null!
        );

        var fieldValues = new Dictionary<string, object> { { "description", "" } };
        Assert.True(condition.Evaluate(fieldValues));

        fieldValues["description"] = "some text";
        Assert.False(condition.Evaluate(fieldValues));
    }

    [Fact]
    public void VisibilityCondition_EvaluatesIsNotEmpty()
    {
        var condition = new VisibilityCondition(
            VisibilityOperator.IsNotEmpty,
            "description",
            null!
        );

        var fieldValues = new Dictionary<string, object> { { "description", "text" } };
        Assert.True(condition.Evaluate(fieldValues));

        fieldValues["description"] = "";
        Assert.False(condition.Evaluate(fieldValues));
    }

    [Fact]
    public void VisibilityCondition_EvaluatesChainedCondition()
    {
        var condition1 = new VisibilityCondition(
            VisibilityOperator.Equals,
            "type",
            "customer"
        );

        var condition2 = new VisibilityCondition(
            VisibilityOperator.NotEquals,
            "status",
            "deleted",
            "AND",
            condition1
        );

        var fieldValues = new Dictionary<string, object>
        {
            { "type", "customer" },
            { "status", "active" }
        };

        Assert.True(condition2.Evaluate(fieldValues));

        fieldValues["status"] = "deleted";
        Assert.False(condition2.Evaluate(fieldValues));
    }

    #endregion

    #region Validation Tests

    [Fact]
    public void ValidateForm_SucceedsForValidCustomization()
    {
        _formCustomizer.AddFieldToSection("account_form", "account", "General", "name");

        var result = _formCustomizer.ValidateForm("account_form", "account");
        Assert.True(result.IsValid);
        Assert.Empty(result.Issues);
    }

    [Fact]
    public void ValidateForm_FailsForInvalidEntity()
    {
        var result = _formCustomizer.ValidateForm("form1", "nonexistent");
        Assert.False(result.IsValid);
        Assert.NotEmpty(result.Issues);
        Assert.Contains("not found", result.Issues.First());
    }

    [Fact]
    public void ValidateForm_FailsForInvalidField()
    {
        _formCustomizer.AddFieldToSection("account_form", "account", "General", "name");
        
        var form = _formCustomizer.GetFormCustomization("account_form")!;
        form.SectionChanges!.First().FieldsToAdd!.Add("nonexistent_field");

        var result = _formCustomizer.ValidateForm("account_form", "account");
        Assert.False(result.IsValid);
        Assert.Contains("nonexistent_field", result.Issues.First());
    }

    [Fact]
    public void ValidateForm_SucceedsWithMultipleFieldsInSameSection()
    {
        _formCustomizer.AddFieldToSection("account_form", "account", "GeneralInfo", "name");
        _formCustomizer.AddFieldToSection("account_form", "account", "GeneralInfo", "accountnumber");

        var result = _formCustomizer.ValidateForm("account_form", "account");
        Assert.True(result.IsValid);
        Assert.Empty(result.Warnings);
    }

    [Fact]
    public void ValidateForm_DetectsFieldRemovalConflicts()
    {
        _formCustomizer.AddFieldToSection("account_form", "account", "General", "name");

        var form = _formCustomizer.GetFormCustomization("account_form")!;
        var section = form.SectionChanges!.First();
        section.FieldsToRemove!.Add("name");

        var result = _formCustomizer.ValidateForm("account_form", "account");
        Assert.False(result.IsValid);
        Assert.Contains("Cannot remove field", result.Issues.First());
    }

    #endregion

    #region Form Lifecycle Tests

    [Fact]
    public void GetFormCustomization_ReturnsNullForUnknownForm()
    {
        var form = _formCustomizer.GetFormCustomization("unknown");
        Assert.Null(form);
    }

    [Fact]
    public void GetFormCustomizations_ReturnsAllForEntity()
    {
        _formCustomizer.AddFieldToSection("account_form1", "account", "General", "name");
        _formCustomizer.AddFieldToSection("account_form2", "account", "General", "accountnumber");
        _formCustomizer.AddFieldToSection("contact_form", "contact", "General", "firstname");

        var accountForms = _formCustomizer.GetFormCustomizations("account").ToList();
        Assert.Equal(2, accountForms.Count);

        var contactForms = _formCustomizer.GetFormCustomizations("contact").ToList();
        Assert.Single(contactForms);
    }

    [Fact]
    public void DeleteFormCustomization_RemovesForm()
    {
        _formCustomizer.AddFieldToSection("account_form", "account", "General", "name");
        _formCustomizer.SetFieldVisibility(
            "account_form",
            "description",
            new VisibilityCondition(VisibilityOperator.IsNotEmpty, "name", null!)
        );

        var deleted = _formCustomizer.DeleteFormCustomization("account_form");
        Assert.True(deleted);

        var form = _formCustomizer.GetFormCustomization("account_form");
        Assert.Null(form);

        var rules = _formCustomizer.GetVisibilityRules("account_form").ToList();
        Assert.Empty(rules);
    }

    [Fact]
    public void DeleteFormCustomization_ReturnsFalseForUnknownForm()
    {
        var deleted = _formCustomizer.DeleteFormCustomization("unknown");
        Assert.False(deleted);
    }

    #endregion

    #region Helper Methods

    private static Dictionary<string, EntityMetadata> CreateTestMetadata()
    {
        return new()
        {
            {
                "account",
                new EntityMetadata(
                    "account",
                    "Account",
                    "Accounts",
                    new()
                    {
                        new FieldMetadata("accountid", "Account ID", "Guid", IsCustom: false),
                        new FieldMetadata("name", "Account Name", "String", MaxLength: 160, Required: true, IsCustom: false),
                        new FieldMetadata("accountnumber", "Account Number", "String", MaxLength: 20, IsCustom: false),
                        new FieldMetadata("creditlimit", "Credit Limit", "Decimal", IsCustom: false),
                        new FieldMetadata("description", "Description", "String", IsCustom: false),
                    },
                    new() { "onCreate", "onUpdate", "onSave" },
                    new() { "Account" },
                    new() { "Active Accounts" }
                )
            },
            {
                "contact",
                new EntityMetadata(
                    "contact",
                    "Contact",
                    "Contacts",
                    new()
                    {
                        new FieldMetadata("contactid", "Contact ID", "Guid", IsCustom: false),
                        new FieldMetadata("firstname", "First Name", "String", MaxLength: 50, IsCustom: false),
                        new FieldMetadata("lastname", "Last Name", "String", MaxLength: 50, IsCustom: false),
                        new FieldMetadata("emailaddress1", "Email Address", "String", IsCustom: false),
                    },
                    new() { "onCreate", "onUpdate" },
                    new() { "Contact" },
                    new() { "Active Contacts" }
                )
            }
        };
    }

    #endregion
}
