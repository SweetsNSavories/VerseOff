using Microsoft.Maui.Controls.Shapes;
using VerseOff.Domain;

namespace VerseOff.Controls;

public sealed class TimelineView : ContentView
{
    private readonly TimelineViewModel viewModel;
    private readonly RefreshView refreshView;

    public TimelineView(
        TimelineDefinition definition,
        ITimelineRecordProvider provider,
        Guid regardingId,
        string regardingTable)
    {
        viewModel = new(
            definition,
            provider,
            regardingId,
            regardingTable);
        BindingContext = viewModel;

        var search = new SearchBar
        {
            Placeholder = "Search Timeline",
            IsVisible = definition.SearchEnabled,
        };
        search.SetBinding(
            SearchBar.TextProperty,
            nameof(TimelineViewModel.SearchText));
        search.SearchButtonPressed += OnSearch;

        var records = new CollectionView
        {
            ItemTemplate = new DataTemplate(CreateCard),
            SelectionMode = SelectionMode.None,
            ItemsLayout = new LinearItemsLayout(
                ItemsLayoutOrientation.Vertical)
            {
                ItemSpacing = 8,
            },
        };
        records.SetBinding(
            ItemsView.ItemsSourceProperty,
            nameof(TimelineViewModel.Records));
        records.EmptyView = new Label
        {
            Text = "No Timeline records are available.",
            Padding = 16,
            HorizontalTextAlignment = TextAlignment.Center,
        };

        refreshView = new()
        {
            Content = records,
        };
        refreshView.SetBinding(
            RefreshView.IsRefreshingProperty,
            nameof(TimelineViewModel.IsBusy));
        refreshView.Refreshing += OnRefresh;

        var loadMore = new Button
        {
            Text = "Load more",
            HorizontalOptions = LayoutOptions.Center,
        };
        loadMore.SetBinding(
            IsEnabledProperty,
            nameof(TimelineViewModel.CanLoadMore));
        loadMore.Clicked += OnLoadMore;

        var error = new Label
        {
            TextColor = Colors.DarkRed,
            FontSize = 12,
        };
        error.SetBinding(
            Label.TextProperty,
            nameof(TimelineViewModel.ErrorMessage));

        Content = new VerticalStackLayout
        {
            Spacing = 10,
            Children =
            {
                search,
                refreshView,
                loadMore,
                error,
            },
        };

        Loaded += OnLoaded;
    }

    public Task RefreshAsync(
        CancellationToken cancellationToken = default) =>
        viewModel.RefreshAsync(cancellationToken);

    private static Border CreateCard()
    {
        var subject = new Label
        {
            FontAttributes = FontAttributes.Bold,
            FontSize = 15,
        };
        subject.SetBinding(Label.TextProperty, nameof(TimelineRecord.Subject));

        var status = new Label
        {
            FontSize = 11,
            TextColor = Colors.DarkSlateGray,
            HorizontalOptions = LayoutOptions.End,
        };
        status.SetBinding(
            Label.TextProperty,
            nameof(TimelineRecord.StatusLabel));

        var body = new Label
        {
            FontSize = 13,
            MaxLines = 3,
            LineBreakMode = LineBreakMode.TailTruncation,
        };
        body.SetBinding(Label.TextProperty, nameof(TimelineRecord.Body));

        var timestamp = new Label
        {
            FontSize = 11,
            TextColor = Colors.Gray,
        };
        timestamp.SetBinding(
            Label.TextProperty,
            nameof(TimelineRecord.SortDate),
            stringFormat: "{0:g}");

        var card = new Border
        {
            Padding = 14,
            Stroke = Colors.LightGray,
            StrokeShape = new RoundRectangle
            {
                CornerRadius = 8,
            },
            BackgroundColor = Colors.White,
            Content = new VerticalStackLayout
            {
                Spacing = 6,
                Children =
                {
                    new Grid
                    {
                        ColumnDefinitions =
                        {
                            new(GridLength.Star),
                            new(GridLength.Auto),
                        },
                        Children =
                        {
                            subject,
                            status,
                        },
                    },
                    body,
                    timestamp,
                },
            },
        };
        Grid.SetColumn(status, 1);
        SemanticProperties.SetDescription(
            card,
            "Timeline record card");
        return card;
    }

    private async void OnLoaded(object? sender, EventArgs args)
    {
        Loaded -= OnLoaded;
        await viewModel.RefreshAsync();
    }

    private async void OnSearch(object? sender, EventArgs args) =>
        await viewModel.RefreshAsync();

    private async void OnRefresh(object? sender, EventArgs args)
    {
        await viewModel.RefreshAsync();
        refreshView.IsRefreshing = false;
    }

    private async void OnLoadMore(object? sender, EventArgs args) =>
        await viewModel.LoadMoreAsync();
}
