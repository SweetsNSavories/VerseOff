namespace VerseOff.App;

public partial class MainPage : ContentPage
{
    private readonly MakerViewModel viewModel;

    public MainPage(MakerViewModel viewModel)
    {
        this.viewModel = viewModel;
        InitializeComponent();
        BindingContext = viewModel;
    }

    private async void OnBrowseSolution(object? sender, EventArgs args)
    {
        try
        {
            var file = await FilePicker.Default.PickAsync(new PickOptions
            {
                PickerTitle = "Select an exported Dataverse solution ZIP",
            });
            if (file is not null)
            {
                viewModel.SetPickedSource(file.FullPath);
            }
        }
        catch (IOException exception)
        {
            viewModel.ReportFailure(exception);
        }
        catch (UnauthorizedAccessException exception)
        {
            viewModel.ReportFailure(exception);
        }
        catch (NotSupportedException exception)
        {
            viewModel.ReportFailure(exception);
        }
    }

    private async void OnLoadSolution(object? sender, EventArgs args)
    {
        await viewModel.LoadAsync();
    }

    private async void OnGenerateSource(object? sender, EventArgs args)
    {
        await viewModel.GenerateAsync();
    }
}
