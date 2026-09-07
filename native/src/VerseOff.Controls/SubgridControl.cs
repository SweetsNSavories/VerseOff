using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Microsoft.Maui.Controls.Shapes;
using VerseOff.Domain;

namespace VerseOff.Controls;

public sealed record SubgridRow(
    Guid RecordId,
    IReadOnlyDictionary<string, object?> Values);

public sealed record SubgridResult(
    string TargetTable,
    IReadOnlyList<ViewColumnDefinition> Columns,
    IReadOnlyList<SubgridRow> Rows);

public interface ISubgridRecordProvider
{
    ValueTask<SubgridResult?> RetrieveSubgridDataAsync(
        string referencingTable,
        Guid recordId,
        string relationshipName,
        string? targetTable,
        string? viewId,
        CancellationToken cancellationToken = default);
}

public sealed class SubgridViewModel : INotifyPropertyChanged
{
    private readonly FormControlDefinition definition;
    private readonly ISubgridRecordProvider? provider;
    private readonly FormRuntimeContext context;

    private bool isBusy;
    private string? errorMessage;

    public SubgridViewModel(
        FormControlDefinition definition,
        ISubgridRecordProvider? provider,
        FormRuntimeContext context)
    {
        this.definition = definition ?? throw new ArgumentNullException(nameof(definition));
        this.provider = provider;
        this.context = context ?? throw new ArgumentNullException(nameof(context));

        Title = definition.Label ?? "Related Records";
        RelationshipName = definition.RelationshipName ?? string.Empty;

        if (provider is null)
        {
            IsAvailable = false;
            UnavailableReason =
                $"Subgrid '{Title}' is configured in FormXml, but no offline subgrid provider is registered.";
            return;
        }

        IsAvailable = true;
    }

    public bool IsAvailable { get; }

    public string? UnavailableReason { get; }

    public string Title { get; }

    public string RelationshipName { get; }

    public ObservableCollection<ViewColumnDefinition> Columns { get; } = [];

    public ObservableCollection<SubgridRow> Rows { get; } = [];

    public int RowCount => Rows.Count;

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

    public async Task LoadDataAsync(CancellationToken cancellationToken = default)
    {
        if (!IsAvailable || provider is null)
        {
            return;
        }

        IsBusy = true;
        ErrorMessage = null;
        try
        {
            var targetTable = definition.Parameters.TryGetValue("TargetEntityType", out var tt) ? tt : null;
            var result = await provider.RetrieveSubgridDataAsync(
                context.TableLogicalName,
                context.RecordId,
                RelationshipName,
                targetTable,
                definition.ViewId,
                cancellationToken);

            Columns.Clear();
            Rows.Clear();

            if (result is not null)
            {
                foreach (var col in result.Columns.OrderBy(c => c.Order))
                {
                    Columns.Add(col);
                }

                foreach (var row in result.Rows)
                {
                    Rows.Add(row);
                }
            }

            OnPropertyChanged(nameof(RowCount));
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Failed to load subgrid records: {ex.Message}";
        }
        finally
        {
            IsBusy = false;
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged([CallerMemberName] string? propertyName = null) =>
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
}

public sealed class SubgridControl : ContentView
{
    private readonly SubgridViewModel viewModel;
    private readonly VerticalStackLayout gridContainer;

    public SubgridControl(
        FormControlDefinition definition,
        ISubgridRecordProvider? provider,
        FormRuntimeContext context)
    {
        viewModel = new(definition, provider, context);
        BindingContext = viewModel;

        gridContainer = new VerticalStackLayout
        {
            Spacing = 8,
        };

        if (!viewModel.IsAvailable)
        {
            Content = CreateUnavailableView(
                viewModel.UnavailableReason ?? "Subgrid is unavailable.");
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
            Text = viewModel.Title,
            FontSize = 14,
            FontAttributes = FontAttributes.Bold,
            TextColor = Color.FromArgb("#242424"),
            VerticalOptions = LayoutOptions.Center,
        };
        header.Add(titleLabel);

        var countBadge = new Border
        {
            Padding = new Thickness(8, 2),
            StrokeShape = new RoundRectangle { CornerRadius = 10 },
            BackgroundColor = Color.FromArgb("#F3F2F1"),
            Stroke = Color.FromArgb("#E1DFDD"),
            Content = new Label
            {
                FontSize = 11,
                TextColor = Color.FromArgb("#605E5C"),
            },
            VerticalOptions = LayoutOptions.Center,
        };
        Grid.SetColumn(countBadge, 1);
        header.Add(countBadge);

        var container = new VerticalStackLayout
        {
            Spacing = 10,
            Children =
            {
                header,
                gridContainer,
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
        viewModel.LoadDataAsync(cancellationToken);

    private async void OnLoaded(object? sender, EventArgs args)
    {
        Loaded -= OnLoaded;
        await viewModel.LoadDataAsync();
        RenderGrid();
    }

    private void RenderGrid()
    {
        gridContainer.Clear();

        if (viewModel.Columns.Count == 0)
        {
            gridContainer.Add(new Label
            {
                Text = "No columns configured for this subgrid view.",
                FontSize = 11,
                TextColor = Color.FromArgb("#605E5C"),
            });
            return;
        }

        var headerRow = new Grid
        {
            Padding = new Thickness(6, 6),
            BackgroundColor = Color.FromArgb("#F8F9FA"),
        };

        for (var i = 0; i < viewModel.Columns.Count; i++)
        {
            headerRow.ColumnDefinitions.Add(
                new Microsoft.Maui.Controls.ColumnDefinition(GridLength.Star));

            var col = viewModel.Columns[i];
            var colHeader = new Label
            {
                Text = col.LogicalName,
                FontSize = 11,
                FontAttributes = FontAttributes.Bold,
                TextColor = Color.FromArgb("#323130"),
            };
            Grid.SetColumn(colHeader, i);
            headerRow.Add(colHeader);
        }

        gridContainer.Add(headerRow);

        if (viewModel.Rows.Count == 0)
        {
            gridContainer.Add(new Label
            {
                Text = "No offline related records found.",
                FontSize = 11,
                TextColor = Color.FromArgb("#605E5C"),
                Padding = new Thickness(6, 8),
            });
            return;
        }

        foreach (var rowData in viewModel.Rows)
        {
            var dataRow = new Grid
            {
                Padding = new Thickness(6, 6),
            };

            for (var i = 0; i < viewModel.Columns.Count; i++)
            {
                dataRow.ColumnDefinitions.Add(
                    new Microsoft.Maui.Controls.ColumnDefinition(GridLength.Star));

                var col = viewModel.Columns[i];
                var cellValue = rowData.Values.TryGetValue(col.LogicalName, out var v)
                    ? v?.ToString() ?? "--"
                    : "--";

                var cellLabel = new Label
                {
                    Text = cellValue,
                    FontSize = 11,
                    TextColor = Color.FromArgb("#242424"),
                };
                Grid.SetColumn(cellLabel, i);
                dataRow.Add(cellLabel);
            }

            gridContainer.Add(dataRow);
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
