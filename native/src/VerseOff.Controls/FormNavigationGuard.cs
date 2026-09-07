namespace VerseOff.Controls;

public sealed class FormNavigationGuard
{
    private readonly Func<Task<bool>> confirmDiscardAsync;

    public FormNavigationGuard(Func<Task<bool>> confirmDiscardAsync)
    {
        this.confirmDiscardAsync = confirmDiscardAsync
            ?? throw new ArgumentNullException(nameof(confirmDiscardAsync));
    }

    public async Task<bool> CanNavigateAsync(FormBindingManager? bindingManager)
    {
        if (bindingManager is null || !bindingManager.IsDirty)
        {
            return true;
        }

        return await confirmDiscardAsync();
    }
}
