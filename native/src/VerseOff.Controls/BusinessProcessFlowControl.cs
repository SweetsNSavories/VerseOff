using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Microsoft.Maui.Controls.Shapes;
using VerseOff.Domain;

namespace VerseOff.Controls;

public enum ProcessStageVisualState
{
    Completed = 0,
    Active = 1,
    Future = 2,
}

public sealed record BusinessProcessFlowState(
    Guid ProcessId,
    Guid ActiveStageId,
    IReadOnlySet<Guid> CompletedStageIds,
    IReadOnlyDictionary<string, object?> StepValues);

public interface IBusinessProcessFlowProvider
{
    ValueTask<BusinessProcessFlowState?> GetStateAsync(
        Guid processId,
        Guid recordId,
        CancellationToken cancellationToken = default);

    ValueTask<bool> SetActiveStageAsync(
        Guid processId,
        Guid recordId,
        Guid stageId,
        CancellationToken cancellationToken = default);
}

public sealed class ProcessStageItemViewModel : INotifyPropertyChanged
{
    private ProcessStageVisualState visualState;

    public ProcessStageItemViewModel(
        ProcessStageDefinition definition,
        ProcessStageVisualState visualState)
    {
        Definition = definition;
        this.visualState = visualState;
    }

    public ProcessStageDefinition Definition { get; }

    public Guid StageId => Definition.StageId;

    public string StageName => Definition.StageName;

    public int Order => Definition.Order;

    public ProcessStageVisualState VisualState
    {
        get => visualState;
        set
        {
            if (visualState != value)
            {
                visualState = value;
                OnPropertyChanged();
            }
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null) =>
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
}

public sealed class ProcessStepItemViewModel
{
    public ProcessStepItemViewModel(
        ProcessStepDefinition definition,
        string displayValue)
    {
        Definition = definition;
        DisplayValue = displayValue;
    }

    public ProcessStepDefinition Definition { get; }

    public string DisplayName => Definition.DisplayName;

    public bool IsRequired => Definition.IsRequired;

    public string DisplayValue { get; }
}

public sealed class BusinessProcessFlowViewModel : INotifyPropertyChanged
{
    private readonly BusinessProcessFlowDefinition definition;
    private readonly IBusinessProcessFlowProvider? provider;
    private readonly Guid recordId;
    private readonly SecuritySnapshot? security;

    private bool isBusy;
    private string? errorMessage;
    private Guid currentActiveStageId;

    public BusinessProcessFlowViewModel(
        BusinessProcessFlowDefinition definition,
        IBusinessProcessFlowProvider? provider,
        Guid recordId,
        SecuritySnapshot? security = null)
    {
        this.definition = definition ?? throw new ArgumentNullException(nameof(definition));
        this.provider = provider;
        this.recordId = recordId;
        this.security = security;

        if (provider is null)
        {
            IsAvailable = false;
            UnavailableReason =
                $"Business Process Flow '{definition.DisplayName}' is available in metadata, but no offline stage provider is registered.";
            return;
        }

        if (security is null)
        {
            IsAvailable = false;
            UnavailableReason =
                $"Business Process Flow '{definition.DisplayName}' requires a verified offline security snapshot to render stage transitions.";
            return;
        }

        if (definition.Stages.Count == 0)
        {
            IsAvailable = false;
            UnavailableReason =
                $"Business Process Flow '{definition.DisplayName}' has no configured stages.";
            return;
        }

        IsAvailable = true;
        currentActiveStageId = definition.Stages[0].StageId;

        foreach (var stage in definition.Stages.OrderBy(s => s.Order))
        {
            Stages.Add(new ProcessStageItemViewModel(
                stage,
                stage.StageId == currentActiveStageId
                    ? ProcessStageVisualState.Active
                    : ProcessStageVisualState.Future));
        }
    }

    public bool IsAvailable { get; }

    public string? UnavailableReason { get; }

    public string ProcessDisplayName => definition.DisplayName;

    public ObservableCollection<ProcessStageItemViewModel> Stages { get; } = [];

    public ObservableCollection<ProcessStepItemViewModel> ActiveSteps { get; } = [];

    public Guid ActiveStageId => currentActiveStageId;

    public bool IsBusy
    {
        get => isBusy;
        private set
        {
            if (isBusy != value)
            {
                isBusy = value;
                OnPropertyChanged();
            }
        }
    }

    public string? ErrorMessage
    {
        get => errorMessage;
        private set
        {
            if (errorMessage != value)
            {
                errorMessage = value;
                OnPropertyChanged();
            }
        }
    }

    public async Task LoadStateAsync(CancellationToken cancellationToken = default)
    {
        if (!IsAvailable || provider is null)
        {
            return;
        }

        IsBusy = true;
        ErrorMessage = null;
        try
        {
            var state = await provider.GetStateAsync(
                definition.ProcessId,
                recordId,
                cancellationToken);

            var activeId = state?.ActiveStageId ?? definition.Stages[0].StageId;
            var completed = state?.CompletedStageIds ?? new HashSet<Guid>();
            var stepValues = state?.StepValues ?? new Dictionary<string, object?>();

            currentActiveStageId = activeId;

            foreach (var stageItem in Stages)
            {
                stageItem.VisualState = stageItem.StageId == currentActiveStageId
                    ? ProcessStageVisualState.Active
                    : completed.Contains(stageItem.StageId)
                        ? ProcessStageVisualState.Completed
                        : ProcessStageVisualState.Future;
            }

            UpdateActiveSteps(stepValues);
            OnPropertyChanged(nameof(ActiveStageId));
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Failed to load process state: {ex.Message}";
        }
        finally
        {
            IsBusy = false;
        }
    }

    public async Task<bool> SetActiveStageAsync(
        Guid stageId,
        CancellationToken cancellationToken = default)
    {
        if (!IsAvailable || provider is null)
        {
            return false;
        }

        IsBusy = true;
        ErrorMessage = null;
        try
        {
            var succeeded = await provider.SetActiveStageAsync(
                definition.ProcessId,
                recordId,
                stageId,
                cancellationToken);

            if (succeeded)
            {
                currentActiveStageId = stageId;
                await LoadStateAsync(cancellationToken);
                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Failed to transition stage: {ex.Message}";
            return false;
        }
        finally
        {
            IsBusy = false;
        }
    }

    private void UpdateActiveSteps(IReadOnlyDictionary<string, object?> stepValues)
    {
        ActiveSteps.Clear();
        var currentStage = definition.Stages.FirstOrDefault(s => s.StageId == currentActiveStageId)
            ?? definition.Stages[0];

        foreach (var step in currentStage.Steps.OrderBy(s => s.Order))
        {
            var displayVal = stepValues.TryGetValue(step.AttributeLogicalName, out var val)
                ? val?.ToString() ?? "--"
                : "--";

            ActiveSteps.Add(new ProcessStepItemViewModel(step, displayVal));
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null) =>
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
}

public sealed class BusinessProcessFlowControl : ContentView
{
    private readonly BusinessProcessFlowViewModel viewModel;
    private readonly HorizontalStackLayout stageBar;
    private readonly VerticalStackLayout stepPanel;
    private readonly Label statusLabel;

    public BusinessProcessFlowControl(
        BusinessProcessFlowDefinition definition,
        IBusinessProcessFlowProvider? provider,
        Guid recordId,
        SecuritySnapshot? security = null)
    {
        viewModel = new(definition, provider, recordId, security);
        BindingContext = viewModel;

        stageBar = new HorizontalStackLayout
        {
            Spacing = 8,
        };

        stepPanel = new VerticalStackLayout
        {
            Spacing = 6,
            Padding = new Thickness(12, 8),
        };

        statusLabel = new Label
        {
            FontSize = 12,
            TextColor = Color.FromArgb("#605E5C"),
        };
        statusLabel.SetBinding(Label.TextProperty, nameof(BusinessProcessFlowViewModel.ErrorMessage));

        if (!viewModel.IsAvailable)
        {
            Content = CreateUnavailableView(
                viewModel.UnavailableReason ?? "Business Process Flow is unavailable.");
            return;
        }

        var header = new Grid
        {
            ColumnDefinitions =
            {
                new Microsoft.Maui.Controls.ColumnDefinition(GridLength.Star),
                new Microsoft.Maui.Controls.ColumnDefinition(GridLength.Auto),
            },
            Padding = new Thickness(4, 0),
        };

        var titleLabel = new Label
        {
            Text = viewModel.ProcessDisplayName,
            FontSize = 14,
            FontAttributes = FontAttributes.Bold,
            TextColor = Color.FromArgb("#242424"),
            VerticalOptions = LayoutOptions.Center,
        };
        header.Add(titleLabel);

        var badge = new Border
        {
            Padding = new Thickness(8, 2),
            StrokeShape = new RoundRectangle { CornerRadius = 10 },
            BackgroundColor = Color.FromArgb("#EFF6FC"),
            Stroke = Color.FromArgb("#0F6CBD"),
            Content = new Label
            {
                Text = "Business Process",
                FontSize = 10,
                TextColor = Color.FromArgb("#0F6CBD"),
            },
            VerticalOptions = LayoutOptions.Center,
        };
        Grid.SetColumn(badge, 1);
        header.Add(badge);

        var container = new VerticalStackLayout
        {
            Spacing = 10,
            Children =
            {
                header,
                new ScrollView
                {
                    Orientation = ScrollOrientation.Horizontal,
                    HorizontalScrollBarVisibility = ScrollBarVisibility.Never,
                    Content = stageBar,
                },
                new Border
                {
                    Stroke = Color.FromArgb("#E1DFDD"),
                    StrokeShape = new RoundRectangle { CornerRadius = 6 },
                    BackgroundColor = Color.FromArgb("#FAF9F8"),
                    Content = stepPanel,
                },
                statusLabel,
            },
        };

        Content = new Border
        {
            Padding = 14,
            Stroke = Color.FromArgb("#E1DFDD"),
            StrokeShape = new RoundRectangle { CornerRadius = 8 },
            BackgroundColor = Colors.White,
            Content = container,
        };

        Loaded += OnLoaded;
    }

    public Task RefreshAsync(CancellationToken cancellationToken = default) =>
        viewModel.LoadStateAsync(cancellationToken);

    private async void OnLoaded(object? sender, EventArgs args)
    {
        Loaded -= OnLoaded;
        await viewModel.LoadStateAsync();
        RenderFromViewModel();
    }

    private void RenderFromViewModel()
    {
        stageBar.Clear();
        foreach (var stageItem in viewModel.Stages)
        {
            stageBar.Add(CreateStageChip(stageItem));
        }

        RenderStepPanel();
    }

    private Border CreateStageChip(ProcessStageItemViewModel stageItem)
    {
        var chip = new Border
        {
            Padding = new Thickness(12, 6),
            StrokeShape = new RoundRectangle { CornerRadius = 16 },
        };

        var label = new Label
        {
            FontSize = 12,
            VerticalOptions = LayoutOptions.Center,
        };

        switch (stageItem.VisualState)
        {
            case ProcessStageVisualState.Completed:
                chip.BackgroundColor = Color.FromArgb("#DFF6DD");
                chip.Stroke = Color.FromArgb("#107C10");
                label.Text = $"✓ {stageItem.StageName}";
                label.TextColor = Color.FromArgb("#0B5A08");
                break;

            case ProcessStageVisualState.Active:
                chip.BackgroundColor = Color.FromArgb("#0F6CBD");
                chip.Stroke = Color.FromArgb("#0F6CBD");
                label.Text = $"● {stageItem.StageName}";
                label.TextColor = Colors.White;
                label.FontAttributes = FontAttributes.Bold;
                break;

            case ProcessStageVisualState.Future:
            default:
                chip.BackgroundColor = Color.FromArgb("#F3F2F1");
                chip.Stroke = Color.FromArgb("#E1DFDD");
                label.Text = stageItem.StageName;
                label.TextColor = Color.FromArgb("#605E5C");
                break;
        }

        chip.Content = label;

        var tapGesture = new TapGestureRecognizer();
        tapGesture.Tapped += async (_, _) =>
        {
            if (stageItem.StageId != viewModel.ActiveStageId)
            {
                var succeeded = await viewModel.SetActiveStageAsync(stageItem.StageId);
                if (succeeded)
                {
                    RenderFromViewModel();
                }
            }
        };
        chip.GestureRecognizers.Add(tapGesture);

        return chip;
    }

    private void RenderStepPanel()
    {
        stepPanel.Clear();
        var activeStage = viewModel.Stages.FirstOrDefault(s => s.StageId == viewModel.ActiveStageId);
        stepPanel.Add(new Label
        {
            Text = $"Stage Details: {activeStage?.StageName ?? "Active Stage"}",
            FontSize = 12,
            FontAttributes = FontAttributes.Bold,
            TextColor = Color.FromArgb("#242424"),
        });

        if (viewModel.ActiveSteps.Count == 0)
        {
            stepPanel.Add(new Label
            {
                Text = "No required steps for this stage.",
                FontSize = 11,
                TextColor = Color.FromArgb("#605E5C"),
            });
            return;
        }

        foreach (var stepItem in viewModel.ActiveSteps)
        {
            var row = new HorizontalStackLayout
            {
                Spacing = 8,
            };

            var requiredMark = stepItem.IsRequired ? " *" : string.Empty;
            row.Add(new Label
            {
                Text = $"• {stepItem.DisplayName}{requiredMark}:",
                FontSize = 11,
                TextColor = Color.FromArgb("#323130"),
                VerticalOptions = LayoutOptions.Center,
            });

            row.Add(new Label
            {
                Text = stepItem.DisplayValue,
                FontSize = 11,
                FontAttributes = FontAttributes.Italic,
                TextColor = Color.FromArgb("#605E5C"),
                VerticalOptions = LayoutOptions.Center,
            });

            stepPanel.Add(row);
        }
    }

    private static Border CreateUnavailableView(string message) =>
        new()
        {
            Padding = 12,
            Stroke = Color.FromArgb("#D83B01"),
            StrokeShape = new RoundRectangle { CornerRadius = 6 },
            BackgroundColor = Color.FromArgb("#FFF4CE"),
            Content = new Label
            {
                Text = message,
                FontSize = 12,
                TextColor = Color.FromArgb("#797673"),
                LineBreakMode = LineBreakMode.WordWrap,
            },
        };
}
