using VerseOff.ClientApi;

namespace VerseOff.Controls.Tests;

[TestClass]
public sealed class UnsavedChangesGuardTests
{
    [TestMethod]
    public async Task CanNavigateReturnsTrueWhenBindingManagerIsNull()
    {
        var promptCalled = false;
        var guard = new FormNavigationGuard(() =>
        {
            promptCalled = true;
            return Task.FromResult(false);
        });

        var result = await guard.CanNavigateAsync(null);

        Assert.IsTrue(result);
        Assert.IsFalse(promptCalled);
    }

    [TestMethod]
    public async Task CanNavigateReturnsTrueWhenBindingManagerIsNotDirty()
    {
        var promptCalled = false;
        var guard = new FormNavigationGuard(() =>
        {
            promptCalled = true;
            return Task.FromResult(false);
        });

        var manager = new FormBindingManager();
        var attr = new XrmAttribute("name", "string");
        var editor = new MockEditor("name");
        manager.Bind("name", editor, attr);

        var result = await guard.CanNavigateAsync(manager);

        Assert.IsTrue(result);
        Assert.IsFalse(promptCalled);
    }

    [TestMethod]
    public async Task CanNavigateInvokesPromptWhenBindingManagerIsDirtyAndRespectsDiscardChoice()
    {
        var promptCalled = false;
        var guard = new FormNavigationGuard(() =>
        {
            promptCalled = true;
            return Task.FromResult(false); // User clicked Cancel
        });

        var manager = new FormBindingManager();
        var attr = new XrmAttribute("name", "string");
        var editor = new MockEditor("name");
        manager.Bind("name", editor, attr);

        editor.Value = "Dirty Value";

        Assert.IsTrue(manager.IsDirty);

        var result = await guard.CanNavigateAsync(manager);

        Assert.IsFalse(result);
        Assert.IsTrue(promptCalled);
    }

    [TestMethod]
    public async Task CanNavigateAllowsNavigationWhenUserApprovesDiscard()
    {
        var guard = new FormNavigationGuard(() => Task.FromResult(true));

        var manager = new FormBindingManager();
        var attr = new XrmAttribute("name", "string");
        var editor = new MockEditor("name");
        manager.Bind("name", editor, attr);

        editor.Value = "Dirty Value";

        var result = await guard.CanNavigateAsync(manager);

        Assert.IsTrue(result);
    }

    [TestMethod]
    public void StateChangedFiresWhenControlModified()
    {
        var manager = new FormBindingManager();
        var attr = new XrmAttribute("name", "string");
        var editor = new MockEditor("name");
        manager.Bind("name", editor, attr);

        var eventFired = false;
        manager.StateChanged += (_, _) => eventFired = true;

        editor.Value = "New Name";

        Assert.IsTrue(eventFired);
        Assert.IsTrue(manager.IsDirty);

        manager.ResetDirty();
        Assert.IsFalse(manager.IsDirty);
    }

    private sealed class MockEditor(string attributeName) : IFormEditor
    {
        private object? value;

        public string AttributeName { get; } = attributeName;

        public object? Value
        {
            get => value;
            set
            {
                this.value = value;
                ValueChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        public event EventHandler? ValueChanged;
    }
}
