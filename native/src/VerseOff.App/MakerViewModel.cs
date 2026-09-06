using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Logging;
using VerseOff.Domain;
using VerseOff.Metadata;

namespace VerseOff.App;

public sealed class MakerViewModel(
    IMakerWorkflow workflow,
    ILogger<MakerViewModel> logger) : INotifyPropertyChanged
{
    private static readonly Action<ILogger, Exception?> LogOperationFailed =
        LoggerMessage.Define(
            LogLevel.Error,
            new EventId(1001, nameof(LogOperationFailed)),
            "VerseOff Maker operation failed.");

    private string sourcePath = string.Empty;
    private string outputRoot = DefaultOutputRoot();
    private string solutionSummary =
        "Choose an exported Dataverse solution ZIP or enter an unpacked folder.";
    private string statusMessage = "Ready.";
    private string ownershipText =
        "Load a solution to review its publisher identity.";
    private ModelDrivenAppDescriptor? selectedApplication;
    private bool customerOwnershipConfirmed;
    private bool isBusy;

    public event PropertyChangedEventHandler? PropertyChanged;

    public ObservableCollection<ModelDrivenAppDescriptor> Applications
    {
        get;
    } = [];

    public string SourcePath
    {
        get => sourcePath;
        set => SetProperty(ref sourcePath, value);
    }

    public string OutputRoot
    {
        get => outputRoot;
        set => SetProperty(ref outputRoot, value);
    }

    public string SolutionSummary
    {
        get => solutionSummary;
        private set => SetProperty(ref solutionSummary, value);
    }

    public string StatusMessage
    {
        get => statusMessage;
        private set => SetProperty(ref statusMessage, value);
    }

    public string OwnershipText
    {
        get => ownershipText;
        private set => SetProperty(ref ownershipText, value);
    }

    public ModelDrivenAppDescriptor? SelectedApplication
    {
        get => selectedApplication;
        set
        {
            if (SetProperty(ref selectedApplication, value))
            {
                OnPropertyChanged(nameof(CanGenerate));
            }
        }
    }

    public bool CustomerOwnershipConfirmed
    {
        get => customerOwnershipConfirmed;
        set
        {
            if (SetProperty(ref customerOwnershipConfirmed, value))
            {
                OnPropertyChanged(nameof(CanGenerate));
            }
        }
    }

    public bool IsBusy
    {
        get => isBusy;
        private set
        {
            if (SetProperty(ref isBusy, value))
            {
                OnPropertyChanged(nameof(CanLoad));
                OnPropertyChanged(nameof(CanGenerate));
            }
        }
    }

    public bool CanLoad =>
        !IsBusy && !string.IsNullOrWhiteSpace(SourcePath);

    public bool CanGenerate =>
        !IsBusy
        && SelectedApplication is not null
        && CustomerOwnershipConfirmed
        && !string.IsNullOrWhiteSpace(OutputRoot);

    public async Task LoadAsync(CancellationToken cancellationToken = default)
    {
        if (!CanLoad)
        {
            StatusMessage = "Enter a solution ZIP or folder path first.";
            return;
        }

        IsBusy = true;
        StatusMessage = "Reading and validating solution metadata...";
        try
        {
            var solution = await workflow.LoadAsync(
                SourcePath,
                cancellationToken);
            Applications.Clear();
            foreach (var application in solution.Applications)
            {
                Applications.Add(application);
            }

            SelectedApplication = Applications.FirstOrDefault();
            CustomerOwnershipConfirmed = false;
            SolutionSummary =
                $"{solution.Identity.UniqueName} {solution.Identity.Version} | "
                + $"Publisher: {solution.Identity.PublisherUniqueName} | "
                + $"{Applications.Count} model-driven app(s) | "
                + $"SHA-256 {solution.SourceHash[..12]}...";
            OwnershipText =
                $"I verify that the customer owns solution '{solution.Identity.UniqueName}' "
                + $"and publisher '{solution.Identity.PublisherUniqueName}', including the right "
                + "to transform its custom assets.";
            StatusMessage = solution.DiscoveryIssues.Count == 0
                ? "Select the model-driven app to generate."
                : $"Loaded with {solution.DiscoveryIssues.Count} discovery notice(s).";
        }
        catch (InvalidDataException exception)
        {
            LogAndSetFailure(exception);
        }
        catch (IOException exception)
        {
            LogAndSetFailure(exception);
        }
        catch (UnauthorizedAccessException exception)
        {
            LogAndSetFailure(exception);
        }
        catch (ArgumentException exception)
        {
            LogAndSetFailure(exception);
        }
        finally
        {
            IsBusy = false;
        }
    }

    public async Task GenerateAsync(
        CancellationToken cancellationToken = default)
    {
        if (!CanGenerate || SelectedApplication is null)
        {
            StatusMessage =
                "Select an app, confirm ownership, and choose an output folder.";
            return;
        }

        IsBusy = true;
        StatusMessage =
            $"Importing {SelectedApplication.DisplayName} and generating native source...";
        try
        {
            var outcome = await workflow.GenerateAsync(
                SelectedApplication,
                OutputRoot,
                CustomerOwnershipConfirmed,
                cancellationToken);
            if (!outcome.Succeeded || outcome.Generation is null)
            {
                var blocking = outcome.CompatibilityIssues
                    .Where(issue =>
                        issue.Severity is CompatibilitySeverity.Blocking)
                    .Select(issue => issue.Message)
                    .Take(3)
                    .ToArray();
                StatusMessage = blocking.Length == 0
                    ? "Generation was blocked by the compatibility report."
                    : "Generation blocked: " + string.Join(" | ", blocking);
                return;
            }

            StatusMessage =
                $"Generated {outcome.Generation.Files.Count} files at "
                + outcome.Generation.OutputDirectory
                + (outcome.CompatibilityIssues.Count == 0
                    ? string.Empty
                    : $" ({outcome.CompatibilityIssues.Count} compatibility notice(s))");
        }
        catch (InvalidDataException exception)
        {
            LogAndSetFailure(exception);
        }
        catch (IOException exception)
        {
            LogAndSetFailure(exception);
        }
        catch (UnauthorizedAccessException exception)
        {
            LogAndSetFailure(exception);
        }
        catch (InvalidOperationException exception)
        {
            LogAndSetFailure(exception);
        }
        catch (ArgumentException exception)
        {
            LogAndSetFailure(exception);
        }
        finally
        {
            IsBusy = false;
        }
    }

    public void SetPickedSource(string path)
    {
        SourcePath = path;
        OnPropertyChanged(nameof(CanLoad));
    }

    public void ReportFailure(Exception exception)
    {
        ArgumentNullException.ThrowIfNull(exception);
        LogAndSetFailure(exception);
    }

    private void LogAndSetFailure(Exception exception)
    {
        LogOperationFailed(logger, exception);
        StatusMessage = exception.Message;
    }

    private bool SetProperty<T>(
        ref T field,
        T value,
        [CallerMemberName] string? propertyName = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value))
        {
            return false;
        }

        field = value;
        OnPropertyChanged(propertyName);
        if (propertyName is nameof(SourcePath))
        {
            OnPropertyChanged(nameof(CanLoad));
        }
        else if (propertyName is nameof(OutputRoot))
        {
            OnPropertyChanged(nameof(CanGenerate));
        }

        return true;
    }

    private void OnPropertyChanged(
        [CallerMemberName] string? propertyName = null) =>
        PropertyChanged?.Invoke(
            this,
            new PropertyChangedEventArgs(propertyName));

    private static string DefaultOutputRoot()
    {
        var documents = Environment.GetFolderPath(
            Environment.SpecialFolder.MyDocuments);
        return Path.Combine(
            string.IsNullOrWhiteSpace(documents)
                ? FileSystem.AppDataDirectory
                : documents,
            "VerseOffGenerated");
    }
}
