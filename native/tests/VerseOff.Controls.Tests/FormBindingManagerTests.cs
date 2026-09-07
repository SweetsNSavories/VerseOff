using VerseOff.ClientApi;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class FormBindingManagerTests
{
    [TestMethod]
    public void TwoWayBindingUpdatesAttributeWhenEditorChanges()
    {
        var manager = new FormBindingManager();
        var attribute = new XrmAttribute("name", "string");
        var editor = new TestEditor("name");

        manager.Bind("name", editor, attribute);

        Assert.IsFalse(manager.IsDirty);
        Assert.IsNull(attribute.GetValue());

        editor.SimulateUserEdit("Contoso Ltd");

        Assert.IsTrue(manager.IsDirty);
        Assert.AreEqual("Contoso Ltd", attribute.GetValue());
        Assert.AreEqual("Contoso Ltd", manager.GetValue("name"));
    }

    [TestMethod]
    public void PopulateSetsValuesAndClearsDirtyFlag()
    {
        var manager = new FormBindingManager();
        var nameAttr = new XrmAttribute("name", "string");
        var revAttr = new XrmAttribute("revenue", "currency");
        var nameEditor = new TestEditor("name");
        var revEditor = new TestEditor("revenue");

        manager.Bind("name", nameEditor, nameAttr);
        manager.Bind("revenue", revEditor, revAttr);

        var data = new Dictionary<string, object?>
        {
            ["name"] = "Fabrikam Inc",
            ["revenue"] = 250000m,
        };

        manager.Populate(data);

        Assert.IsFalse(manager.IsDirty);
        Assert.AreEqual("Fabrikam Inc", nameEditor.Value);
        Assert.AreEqual(250000m, revEditor.Value);
        Assert.AreEqual("Fabrikam Inc", nameAttr.GetValue());
        Assert.AreEqual(250000m, revAttr.GetValue());
    }

    [TestMethod]
    public void ExtractValuesOnlyDirtyReturnsModifiedAttributes()
    {
        var manager = new FormBindingManager();
        var nameAttr = new XrmAttribute("name", "string");
        var revAttr = new XrmAttribute("revenue", "currency");
        var nameEditor = new TestEditor("name");
        var revEditor = new TestEditor("revenue");

        manager.Bind("name", nameEditor, nameAttr);
        manager.Bind("revenue", revEditor, revAttr);

        manager.Populate(new Dictionary<string, object?>
        {
            ["name"] = "Initial Name",
            ["revenue"] = 1000m,
        });

        Assert.IsFalse(manager.IsDirty);

        // Edit only revenue
        revEditor.SimulateUserEdit(5000m);

        Assert.IsTrue(manager.IsDirty);
        var dirtyValues = manager.ExtractValues(onlyDirty: true);

        Assert.HasCount(1, dirtyValues);
        Assert.IsTrue(dirtyValues.ContainsKey("revenue"));
        Assert.AreEqual(5000m, dirtyValues["revenue"]);
        Assert.IsFalse(dirtyValues.ContainsKey("name"));
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
