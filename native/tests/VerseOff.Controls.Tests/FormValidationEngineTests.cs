using VerseOff.ClientApi;
using VerseOff.Domain;
using ColumnDefinition = VerseOff.Domain.ColumnDefinition;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class FormValidationEngineTests
{
    [TestMethod]
    public void MissingRequiredFieldFailsValidation()
    {
        var (table, form) = CreateTableAndForm();
        var manager = new FormBindingManager();
        var nameAttr = new XrmAttribute("name", "string", requiredLevel: "required");
        var editor = new TestEditor("name");
        manager.Bind("name", editor, nameAttr);

        // Name is null / empty
        var result = FormValidationEngine.Validate(table, form, manager);

        Assert.IsFalse(result.IsValid);
        Assert.HasCount(1, result.Errors);
        Assert.AreEqual("name", result.Errors[0].AttributeName);
        StringAssert.Contains(result.Errors[0].Message, "required");
    }

    [TestMethod]
    public void StringExceedingMaxLengthFailsValidation()
    {
        var (table, form) = CreateTableAndForm();
        var manager = new FormBindingManager();
        var nameAttr = new XrmAttribute("name", "string", requiredLevel: "required");
        var editor = new TestEditor("name");
        manager.Bind("name", editor, nameAttr);

        // MaxLength in table is 100 characters. Simulate 150 chars.
        editor.SimulateUserEdit(new string('X', 150));

        var result = FormValidationEngine.Validate(table, form, manager);

        Assert.IsFalse(result.IsValid);
        Assert.HasCount(1, result.Errors);
        StringAssert.Contains(result.Errors[0].Message, "maximum length");
    }

    [TestMethod]
    public void NumericValueOutOfRangeFailsValidation()
    {
        var (table, form) = CreateTableAndForm();
        var manager = new FormBindingManager();
        var nameAttr = new XrmAttribute("name", "string", requiredLevel: "required");
        var revAttr = new XrmAttribute("revenue", "currency");
        var nameEditor = new TestEditor("name");
        var revEditor = new TestEditor("revenue");

        manager.Bind("name", nameEditor, nameAttr);
        manager.Bind("revenue", revEditor, revAttr);

        nameEditor.SimulateUserEdit("Valid Name");
        // Minimum revenue in table is 0. Give -50.
        revEditor.SimulateUserEdit(-50m);

        var result = FormValidationEngine.Validate(table, form, manager);

        Assert.IsFalse(result.IsValid);
        Assert.HasCount(1, result.Errors);
        Assert.AreEqual("revenue", result.Errors[0].AttributeName);
        StringAssert.Contains(result.Errors[0].Message, "cannot be less than 0");
    }

    [TestMethod]
    public void ValidFormPassesValidation()
    {
        var (table, form) = CreateTableAndForm();
        var manager = new FormBindingManager();
        var nameAttr = new XrmAttribute("name", "string", requiredLevel: "required");
        var revAttr = new XrmAttribute("revenue", "currency");
        var nameEditor = new TestEditor("name");
        var revEditor = new TestEditor("revenue");

        manager.Bind("name", nameEditor, nameAttr);
        manager.Bind("revenue", revEditor, revAttr);

        nameEditor.SimulateUserEdit("Contoso Corp");
        revEditor.SimulateUserEdit(150000m);

        var result = FormValidationEngine.Validate(table, form, manager);

        Assert.IsTrue(result.IsValid);
        Assert.HasCount(0, result.Errors);
    }

    private static (TableDefinition Table, FormDefinition Form) CreateTableAndForm()
    {
        var columns = new List<ColumnDefinition>
        {
            new("accountid", "Uniqueidentifier", true, false, false, false),
            new("name", "String", true, true, true, false)
            {
                DisplayName = "Account Name",
                RequiredLevel = ColumnRequiredLevel.Required,
                MaxLength = 100,
            },
            new("revenue", "Currency", true, true, true, false)
            {
                DisplayName = "Annual Revenue",
                RequiredLevel = ColumnRequiredLevel.None,
                MinimumValue = 0m,
                MaximumValue = 1000000000m,
            },
        };

        var table = new TableDefinition(
            "account",
            "accounts",
            "accountid",
            "name",
            false,
            columns);

        var provenance = new ComponentProvenance(
            "form",
            "account_form",
            ComponentOrigin.CustomerOwned,
            "solution",
            "prefix",
            new string('a', 64),
            false,
            true);

        var form = new FormDefinition(
            Guid.NewGuid(),
            "Main",
            "account",
            2,
            [],
            provenance);

        return (table, form);
    }

    private sealed class TestEditor(string attributeName) : IFormEditor
    {
        public string AttributeName { get; } = attributeName;

        public object? Value { get; set; }

        public event EventHandler? ValueChanged;

        public void SimulateUserEdit(object? newValue)
        {
            Value = newValue;
            ValueChanged?.Invoke(this, EventArgs.Empty);
        }
    }
}
