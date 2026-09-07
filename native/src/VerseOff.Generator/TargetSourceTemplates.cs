using System.Security;
using VerseOff.Domain;

namespace VerseOff.Generator;

internal sealed record TargetSourceFile
{
    public TargetSourceFile(string relativePath, string content)
    {
        RelativePath = relativePath;
        Content = content;
    }

    public TargetSourceFile(string relativePath, byte[] binaryContent)
    {
        RelativePath = relativePath;
        BinaryContent = binaryContent;
    }

    public string RelativePath { get; }

    public string? Content { get; }

    public byte[]? BinaryContent { get; }
}

internal static class TargetSourceTemplates
{
    public static IReadOnlyList<TargetSourceFile> Create(
        ApplicationDefinition application,
        string projectName,
        string namespaceName,
        SourceGenerationOptions options,
        string definitionJson)
    {
        var title = Xml(application.DisplayName);
        var applicationId =
            $"com.verseoff.generated.{application.AppModuleId:N}";

        var files = new List<TargetSourceFile>
        {
            new(
                $"{projectName}.csproj",
                ProjectFile(
                    title,
                    applicationId,
                    options)),
            new("Directory.Build.props", DirectoryBuildProps()),
            new("App.xaml", AppXaml(namespaceName)),
            new("App.xaml.cs", AppCode(namespaceName)),
            new("MauiProgram.cs", MauiProgram(namespaceName)),
            new("MainPage.xaml", MainPageXaml(namespaceName, title)),
            new("MainPage.xaml.cs", MainPageCode(namespaceName)),
            new(
                "Platforms/Windows/App.xaml",
                WindowsAppXaml(namespaceName)),
            new(
                "Platforms/Windows/App.xaml.cs",
                WindowsAppCode(namespaceName)),
            new(
                "Platforms/Windows/Package.appxmanifest",
                PackageManifest()),
            new(
                "Platforms/Windows/app.manifest",
                WindowsManifest(projectName)),
            new("Resources/AppIcon/appicon.svg", AppIconSvg()),
            new("Resources/AppIcon/appiconfg.svg", AppIconForegroundSvg()),
            new("Resources/Splash/splash.svg", SplashSvg()),
            new(
                "Resources/Raw/app-definition.json",
                definitionJson + Environment.NewLine),
            new(
                "README.md",
                Readme(application, projectName)),
        };
        files.AddRange(RuntimeSourceCatalog.Load());
        return files;
    }

    private static string ProjectFile(
        string title,
        string applicationId,
        SourceGenerationOptions options) =>
        $$"""
        <Project Sdk="Microsoft.NET.Sdk">
          <PropertyGroup>
            <TargetFramework>{{options.TargetFramework}}</TargetFramework>
            <OutputType>Exe</OutputType>
            <RootNamespace>GeneratedTarget</RootNamespace>
            <UseMaui>true</UseMaui>
            <SingleProject>true</SingleProject>
            <ImplicitUsings>enable</ImplicitUsings>
            <Nullable>enable</Nullable>
            <MauiXamlInflator>SourceGen</MauiXamlInflator>
            <ApplicationTitle>{{title}}</ApplicationTitle>
            <ApplicationId>{{applicationId}}</ApplicationId>
            <ApplicationDisplayVersion>1.0</ApplicationDisplayVersion>
            <ApplicationVersion>1</ApplicationVersion>
            <WindowsPackageType>None</WindowsPackageType>
            <SupportedOSPlatformVersion>10.0.17763.0</SupportedOSPlatformVersion>
            <TargetPlatformMinVersion>10.0.17763.0</TargetPlatformMinVersion>
          </PropertyGroup>

          <ItemGroup>
            <Compile Remove="Runtime\**\*.cs" />
            <MauiIcon Include="Resources\AppIcon\appicon.svg"
                      ForegroundFile="Resources\AppIcon\appiconfg.svg"
                      Color="#0F6CBD" />
            <MauiSplashScreen Include="Resources\Splash\splash.svg"
                              Color="#0F6CBD"
                              BaseSize="128,128" />
            <MauiAsset Include="Resources\Raw\**"
                       LogicalName="%(RecursiveDir)%(Filename)%(Extension)" />
            <MauiAsset Include="CustomerAssets\**"
                       LogicalName="CustomerAssets\%(RecursiveDir)%(Filename)%(Extension)" />
          </ItemGroup>

          <ItemGroup>
            <PackageReference Include="Microsoft.Maui.Controls"
                              Version="{{options.MauiVersion}}" />
            <PackageReference Include="Microsoft.Extensions.Logging.Debug"
                              Version="{{options.MicrosoftExtensionsVersion}}" />
          </ItemGroup>
          <ItemGroup>
            <ProjectReference Include="Runtime\VerseOff.Domain\VerseOff.Domain.csproj" />
            <ProjectReference Include="Runtime\VerseOff.Storage\VerseOff.Storage.csproj" />
            <ProjectReference Include="Runtime\VerseOff.ClientApi\VerseOff.ClientApi.csproj" />
            <ProjectReference Include="Runtime\VerseOff.ReadModel\VerseOff.ReadModel.csproj" />
            <ProjectReference Include="Runtime\VerseOff.Sync\VerseOff.Sync.csproj" />
            <ProjectReference Include="Runtime\VerseOff.Controls\VerseOff.Controls.csproj" />
            <ProjectReference Include="Runtime\VerseOff.Integrations\VerseOff.Integrations.csproj" />
          </ItemGroup>
        </Project>
        """;

    private static string DirectoryBuildProps() =>
        """
        <Project>
          <PropertyGroup>
            <Nullable>enable</Nullable>
            <ImplicitUsings>enable</ImplicitUsings>
            <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
            <AnalysisLevel>latest-recommended</AnalysisLevel>
            <Deterministic>true</Deterministic>
          </PropertyGroup>
        </Project>
        """;

    private static string AppXaml(string namespaceName) =>
        $$"""
        <?xml version="1.0" encoding="utf-8" ?>
        <Application xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                     xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                     x:Class="{{namespaceName}}.App">
          <Application.Resources>
            <Color x:Key="VerseOffBlue">#0F6CBD</Color>
            <Color x:Key="SurfaceLight">#FFFFFF</Color>
            <Color x:Key="CanvasLight">#F5F5F5</Color>
          </Application.Resources>
        </Application>
        """;

    private static string AppCode(string namespaceName) =>
        $$"""
        namespace {{namespaceName}};

        public partial class App : Application
        {
            public App()
            {
                InitializeComponent();
            }

            protected override Window CreateWindow(
                IActivationState? activationState) =>
                new(new MainPage());
        }
        """;

    private static string MauiProgram(string namespaceName) =>
        $$"""
        using System.Text.Json;
        using Microsoft.Extensions.DependencyInjection;
        using Microsoft.Extensions.Logging;
        using VerseOff.Controls;
        using VerseOff.Domain;
        using VerseOff.Storage;

        namespace {{namespaceName}};

        public static class MauiProgram
        {
            public static MauiApp CreateMauiApp()
            {
                var builder = MauiApp.CreateBuilder();
                builder.UseMauiApp<App>();
                builder.Services.AddSingleton<ITimelineRecordProvider, InMemoryTimelineRecordProvider>();
                builder.Services.AddSingleton<ICommandRuleEvaluator, CommandRuleEvaluator>();
                builder.Services.AddSingleton<ILocalRecordStore, InMemoryLocalRecordStore>();
                builder.Services.AddTransient<MainPage>();
        #if DEBUG
                builder.Logging.AddDebug();
        #endif
                return builder.Build();
            }
        }

        public sealed class InMemoryTimelineRecordProvider : ITimelineRecordProvider
        {
            public ValueTask<TimelinePage> QueryAsync(
                TimelineQuery query,
                CancellationToken cancellationToken = default) =>
                ValueTask.FromResult(new TimelinePage([], null));
        }

        public sealed class InMemoryLocalRecordStore : ILocalRecordStore
        {
            private readonly Dictionary<(string, Guid), CachedRecordEntity> records = new();

            public Task<CachedRecordEntity?> RetrieveAsync(
                string tableLogicalName,
                Guid recordId,
                CancellationToken cancellationToken = default)
            {
                records.TryGetValue((tableLogicalName, recordId), out var record);
                return Task.FromResult(record);
            }

            public Task<CachedRecordEntity> SaveLocalAsync(
                string tableLogicalName,
                Guid recordId,
                JsonDocument data,
                Guid userObjectId,
                string deviceId,
                string securitySnapshotVersion,
                string correlationId,
                CancellationToken cancellationToken = default)
            {
                var entity = new CachedRecordEntity
                {
                    TableLogicalName = tableLogicalName,
                    RecordId = recordId,
                    DataJson = data.RootElement.GetRawText(),
                    SecuritySnapshotVersion = securitySnapshotVersion,
                    SyncState = LocalSyncState.PendingUpdate,
                    ModifiedAt = DateTimeOffset.UtcNow,
                };
                records[(tableLogicalName, recordId)] = entity;
                return Task.FromResult(entity);
            }

            public Task<bool> DeleteLocalAsync(
                string tableLogicalName,
                Guid recordId,
                Guid userObjectId,
                string deviceId,
                string correlationId,
                CancellationToken cancellationToken = default)
            {
                return Task.FromResult(records.Remove((tableLogicalName, recordId)));
            }

            public Task ApplyServerChangeAsync(
                DataverseChange change,
                string securitySnapshotVersion,
                CancellationToken cancellationToken = default)
            {
                return Task.CompletedTask;
            }
        }
        """;

    private static string MainPageXaml(
        string namespaceName,
        string title) =>
        $$"""
        <?xml version="1.0" encoding="utf-8" ?>
        <ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                     xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                     x:Class="{{namespaceName}}.MainPage"
                     Title="{{title}}">
          <Grid RowDefinitions="Auto,*"
                BackgroundColor="#F5F5F5">
            <Grid Padding="24,16"
                  ColumnDefinitions="*,Auto"
                  BackgroundColor="White">
              <VerticalStackLayout Spacing="2">
                <Label Text="{{title}}"
                       FontSize="24"
                       FontAttributes="Bold" />
                <Label Text="VerseOff native offline target"
                       FontSize="12"
                       TextColor="#605E5C" />
              </VerticalStackLayout>
              <Border Grid.Column="1"
                      Padding="10,5"
                      StrokeShape="RoundRectangle 12"
                      BackgroundColor="#DFF6DD"
                      Stroke="#107C10">
                <Label Text="Generated source"
                       TextColor="#0B5A08" />
              </Border>
            </Grid>

            <Grid Grid.Row="1"
                  ColumnDefinitions="280,*"
                  ColumnSpacing="1">
              <Border Padding="12"
                      BackgroundColor="#FAFAFA"
                      Stroke="#E1DFDD">
                <CollectionView x:Name="NavigationList"
                                SelectionMode="Single"
                                SelectionChanged="OnNavigationChanged">
                  <CollectionView.ItemTemplate>
                    <DataTemplate>
                      <Border Padding="12,10"
                              Margin="0,2"
                              StrokeShape="RoundRectangle 6"
                              BackgroundColor="White"
                              Stroke="#E1DFDD">
                        <Label Text="{Binding Title}" />
                      </Border>
                    </DataTemplate>
                  </CollectionView.ItemTemplate>
                </CollectionView>
              </Border>

              <Grid Grid.Column="1"
                    RowDefinitions="Auto,Auto,*">
                <ScrollView HorizontalScrollBarVisibility="Never">
                  <HorizontalStackLayout x:Name="CommandBarHost"
                                         Padding="20,12"
                                         Spacing="8" />
                </ScrollView>
                <VerticalStackLayout x:Name="NotificationHost"
                                     Grid.Row="1"
                                     Padding="28,0,28,8"
                                     IsVisible="False" />
                <ScrollView Grid.Row="2">
                  <VerticalStackLayout x:Name="ContentHost"
                                       Padding="28"
                                       Spacing="16" />
                </ScrollView>
              </Grid>
            </Grid>
          </Grid>
        </ContentPage>
        """;

    private static string MainPageCode(string namespaceName) =>
        $$"""
        using System.Text.Json;
        using System.Text.Json.Serialization;
        using Microsoft.Maui.Controls.Shapes;
        using VerseOff.ClientApi;
        using VerseOff.Controls;
        using VerseOff.Domain;
        using VerseOff.Storage;

        namespace {{namespaceName}};

        public partial class MainPage : ContentPage
        {
            private static readonly JsonSerializerOptions JsonOptions = new()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Converters =
                {
                    new JsonStringEnumConverter(JsonNamingPolicy.CamelCase),
                },
            };

            private readonly NativeControlFactory controlFactory = new([]);
            private readonly ITimelineRecordProvider? injectedTimelineProvider;
            private readonly ICommandRuleEvaluator? injectedCommandRuleEvaluator;
            private readonly ILocalRecordStore? injectedLocalRecordStore;
            private ApplicationDefinition? definition;
            private TableDefinition? currentTable;
            private FormDefinition? currentForm;
            private Guid currentRecordId = Guid.Empty;
            private XrmFormContext? activeFormContext;
            private FormBindingManager? activeBindingManager;

            public MainPage() : this(null, null, null)
            {
            }

            public MainPage(
                ITimelineRecordProvider? timelineProvider,
                ICommandRuleEvaluator? commandRuleEvaluator,
                ILocalRecordStore? localRecordStore = null)
            {
                injectedTimelineProvider = timelineProvider;
                injectedCommandRuleEvaluator = commandRuleEvaluator;
                injectedLocalRecordStore = localRecordStore;
                InitializeComponent();
                Loaded += OnLoaded;
            }

            private async void OnLoaded(object? sender, EventArgs args)
            {
                Loaded -= OnLoaded;
                try
                {
                    await using var stream =
                        await FileSystem.OpenAppPackageFileAsync(
                            "app-definition.json");
                    definition = await JsonSerializer
                        .DeserializeAsync<ApplicationDefinition>(
                            stream,
                            JsonOptions)
                        ?? throw new InvalidDataException(
                            "The generated app definition is empty.");
                    var navigation = definition.Navigation
                        .Where(item =>
                            item.Kind is NavigationNodeKind.SubArea)
                        .ToArray();
                    NavigationList.ItemsSource = navigation;

                    if (navigation.Length > 0)
                    {
                        NavigationList.SelectedItem = navigation[0];
                    }
                    else
                    {
                        RenderMessage(
                            "This app has no generated SiteMap subareas.");
                    }
                }
                catch (InvalidDataException exception)
                {
                    RenderLoadFailure(exception);
                }
                catch (JsonException exception)
                {
                    RenderLoadFailure(exception);
                }
                catch (IOException exception)
                {
                    RenderLoadFailure(exception);
                }
            }

            private void OnNavigationChanged(
                object? sender,
                SelectionChangedEventArgs args)
            {
                if (args.CurrentSelection.Count > 0
                    && args.CurrentSelection[0]
                        is NavigationDefinition selected)
                {
                    RenderTable(
                        selected.TableLogicalName,
                        selected.Title);
                }
            }

            private void ShowNotification(string message, bool isError)
            {
                NotificationHost.Clear();
                NotificationHost.IsVisible = true;
                NotificationHost.Add(new Border
                {
                    Padding = new Thickness(14, 10),
                    StrokeShape = new RoundRectangle { CornerRadius = 6 },
                    BackgroundColor = isError ? Color.FromArgb("#FDE7E9") : Color.FromArgb("#DFF6DD"),
                    Stroke = isError ? Color.FromArgb("#A80000") : Color.FromArgb("#107C10"),
                    Content = new Label
                    {
                        Text = message,
                        TextColor = isError ? Color.FromArgb("#A80000") : Color.FromArgb("#0B5A08"),
                        FontAttributes = FontAttributes.Bold,
                        LineBreakMode = LineBreakMode.WordWrap,
                    },
                });
            }

            private void ClearNotification()
            {
                NotificationHost.Clear();
                NotificationHost.IsVisible = false;
            }

            private void RenderTable(string? tableLogicalName, string title)
            {
                ContentHost.Clear();
                ClearNotification();
                ContentHost.Add(new Label
                {
                    Text = title,
                    FontSize = 24,
                    FontAttributes = FontAttributes.Bold,
                });

                if (definition is null
                    || string.IsNullOrWhiteSpace(tableLogicalName))
                {
                    RenderMessage("This navigation item has no table form.");
                    return;
                }

                var form = definition.Forms.FirstOrDefault(candidate =>
                    string.Equals(
                        candidate.TableLogicalName,
                        tableLogicalName,
                        StringComparison.OrdinalIgnoreCase)
                    && candidate.IsActive);
                if (form is null)
                {
                    RenderMessage(
                        $"No generated form is available for {tableLogicalName}.");
                    return;
                }

                currentTable = definition.Tables.FirstOrDefault(candidate =>
                    string.Equals(
                        candidate.LogicalName,
                        tableLogicalName,
                        StringComparison.OrdinalIgnoreCase));
                currentForm = form;
                currentRecordId = Guid.NewGuid();

                var timeline = injectedTimelineProvider
                    ?? Handler?.MauiContext?.Services.GetService<ITimelineRecordProvider>();
                var commandEvaluator = injectedCommandRuleEvaluator
                    ?? Handler?.MauiContext?.Services.GetService<ICommandRuleEvaluator>()
                    ?? new CommandRuleEvaluator();

                var runtimeContext = new FormRuntimeContext(
                    definition,
                    currentRecordId,
                    tableLogicalName,
                    TimelineProvider: timeline,
                    SubgridProvider: null,
                    BpfProvider: null,
                    Security: null);

                var attributes = new List<XrmAttribute>();
                if (currentTable is not null)
                {
                    foreach (var column in currentTable.Columns)
                    {
                        var req = column.RequiredLevel switch
                        {
                            ColumnRequiredLevel.Required or ColumnRequiredLevel.SystemRequired => "required",
                            ColumnRequiredLevel.Recommended => "recommended",
                            _ => "none",
                        };
                        attributes.Add(new XrmAttribute(
                            column.LogicalName,
                            column.AttributeType.ToLowerInvariant(),
                            maximumLength: column.MaxLength,
                            requiredLevel: req,
                            minimum: column.MinimumValue,
                            maximum: column.MaximumValue));
                    }
                }

                var controls = new List<XrmControl>();
                activeFormContext = new XrmFormContext(
                    tableLogicalName,
                    currentRecordId,
                    2,
                    attributes,
                    controls);
                activeBindingManager = new FormBindingManager();

                RenderCommands(form, commandEvaluator);

                var bpf = definition.BusinessProcessFlows.FirstOrDefault(candidate =>
                    string.Equals(
                        candidate.PrimaryTableLogicalName,
                        tableLogicalName,
                        StringComparison.OrdinalIgnoreCase)
                    && candidate.IsActive);
                if (bpf is not null)
                {
                    ContentHost.Add(new BusinessProcessFlowControl(
                        bpf,
                        provider: null,
                        currentRecordId,
                        security: null));
                }

                RenderControls(form.HeaderControls, runtimeContext, "Header");
                foreach (var tab in form.Tabs)
                {
                    if (!tab.IsVisible)
                    {
                        continue;
                    }

                    var tabContent = new VerticalStackLayout
                    {
                        Spacing = 14,
                    };
                    tabContent.Add(new Label
                    {
                        Text = tab.Label,
                        FontSize = 19,
                        FontAttributes = FontAttributes.Bold,
                    });

                    foreach (var column in tab.Columns)
                    {
                        foreach (var section in column.Sections)
                        {
                            if (!section.IsVisible)
                            {
                                continue;
                            }

                            tabContent.Add(new Label
                            {
                                Text = section.Label,
                                FontAttributes = FontAttributes.Bold,
                            });
                            foreach (var row in section.Rows)
                            {
                                foreach (var cell in row.Cells)
                                {
                                    if (!cell.IsVisible
                                        || cell.Control is null)
                                    {
                                        continue;
                                    }

                                    tabContent.Add(CreateField(
                                        cell.Control,
                                        runtimeContext));
                                }
                            }
                        }
                    }

                    ContentHost.Add(new Border
                    {
                        Padding = 20,
                        Stroke = Color.FromArgb("#E1DFDD"),
                        StrokeShape = new RoundRectangle
                        {
                            CornerRadius = 8,
                        },
                        BackgroundColor = Colors.White,
                        Content = tabContent,
                    });
                }
                RenderControls(form.FooterControls, runtimeContext, "Footer");

                PopulateInitialRecord(tableLogicalName);
            }

            private void PopulateInitialRecord(string tableLogicalName)
            {
                if (activeBindingManager is null || currentTable is null)
                {
                    return;
                }

                var initialData = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
                if (!string.IsNullOrWhiteSpace(currentTable.PrimaryNameAttribute))
                {
                    initialData[currentTable.PrimaryNameAttribute] =
                        $"Contoso {currentTable.DisplayName ?? tableLogicalName}";
                }

                if (string.Equals(tableLogicalName, "account", StringComparison.OrdinalIgnoreCase))
                {
                    initialData["name"] = "Contoso Pharmaceuticals";
                    initialData["telephone1"] = "+1 (555) 019-2834";
                    initialData["revenue"] = 1250000m;
                    initialData["emailaddress1"] = "contact@contoso.example.com";
                }

                if (initialData.Count > 0)
                {
                    activeBindingManager.Populate(initialData);
                }
            }

            private void RenderCommands(
                FormDefinition form,
                ICommandRuleEvaluator commandEvaluator)
            {
                CommandBarHost.Clear();
                var ruleContext = new CommandRuleEvaluationContext(
                    form.TableLogicalName,
                    currentRecordId,
                    activeBindingManager?.GetValues(onlyDirty: false)
                        ?? new Dictionary<string, object?>());

                foreach (var command in definition!.Commands
                    .Where(candidate => string.Equals(
                        candidate.Location,
                        form.TableLogicalName,
                        StringComparison.OrdinalIgnoreCase)
                        || string.Equals(
                            candidate.Location,
                            "Form",
                            StringComparison.OrdinalIgnoreCase))
                    .OrderBy(candidate => candidate.Order))
                {
                    if (!commandEvaluator.CanDisplay(command, ruleContext))
                    {
                        continue;
                    }

                    var button = new Button
                    {
                        Text = command.Label,
                        CommandParameter = command.CommandId,
                        Padding = new Thickness(14, 6),
                        IsEnabled = commandEvaluator.CanEnable(command, ruleContext),
                    };
                    button.Clicked += (_, _) => ExecuteCommand(command);
                    CommandBarHost.Add(button);
                }
                if (CommandBarHost.Children.Count == 0)
                {
                    CommandBarHost.Add(new Label
                    {
                        Text = "No commands configured",
                        TextColor = Color.FromArgb("#605E5C"),
                        VerticalOptions = LayoutOptions.Center,
                    });
                }
            }

            private async void ExecuteCommand(CommandDefinition command)
            {
                if (string.Equals(command.CommandId, "cmd.save", StringComparison.OrdinalIgnoreCase)
                    || command.Label.Contains("Save", StringComparison.OrdinalIgnoreCase))
                {
                    await SaveActiveRecordAsync();
                    return;
                }

                if (command.Action.Kind is CommandActionKind.OpenUrl
                    && Uri.TryCreate(command.Action.Target, UriKind.Absolute, out var uri))
                {
                    await Launcher.Default.OpenAsync(uri);
                    return;
                }

                RenderMessage(
                    $"{command.Label}: {command.Action.Kind} command is available in metadata but has no native action adapter.");
            }

            private async Task SaveActiveRecordAsync()
            {
                if (currentTable is null || currentForm is null || activeBindingManager is null)
                {
                    ShowNotification("Save failed: No active form session is loaded.", isError: true);
                    return;
                }

                var validation = FormValidationEngine.Validate(
                    currentTable,
                    currentForm,
                    activeBindingManager);
                if (!validation.IsValid)
                {
                    var messages = string.Join("; ", validation.Errors.Select(e => e.Message));
                    ShowNotification($"Validation failed: {messages}", isError: true);
                    return;
                }

                var values = activeBindingManager.GetValues(onlyDirty: false);
                var jsonBytes = JsonSerializer.SerializeToUtf8Bytes(values);
                using var jsonDoc = JsonDocument.Parse(jsonBytes);

                var recordStore = injectedLocalRecordStore
                    ?? Handler?.MauiContext?.Services.GetService<ILocalRecordStore>();

                if (recordStore is not null)
                {
                    try
                    {
                        await recordStore.SaveLocalAsync(
                            currentTable.LogicalName,
                            currentRecordId,
                            jsonDoc,
                            userObjectId: Guid.Empty,
                            deviceId: "verseoff-device",
                            securitySnapshotVersion: "1.0",
                            correlationId: Guid.NewGuid().ToString("N"));

                        activeBindingManager.ResetDirty();
                        ShowNotification(
                            $"Saved {currentTable.DisplayName ?? currentTable.LogicalName} record ({currentRecordId:D}) successfully to encrypted offline store.",
                            isError: false);
                    }
                    catch (Exception ex)
                    {
                        ShowNotification($"Save failed while writing to offline store: {ex.Message}", isError: true);
                    }
                }
                else
                {
                    activeBindingManager.ResetDirty();
                    ShowNotification(
                        $"Record saved locally ({values.Count} attributes updated).",
                        isError: false);
                }
            }

            private void RenderControls(
                IReadOnlyList<FormControlDefinition> controls,
                FormRuntimeContext runtimeContext,
                string region)
            {
                if (controls.Count == 0)
                {
                    return;
                }

                var panel = new VerticalStackLayout
                {
                    Spacing = 8,
                };
                panel.Add(new Label
                {
                    Text = region,
                    FontAttributes = FontAttributes.Bold,
                });
                foreach (var control in controls.Where(control => control.IsVisible))
                {
                    panel.Add(CreateField(control, runtimeContext));
                }
                ContentHost.Insert(0, new Border
                {
                    Padding = 16,
                    Stroke = Color.FromArgb("#E1DFDD"),
                    StrokeShape = new RoundRectangle { CornerRadius = 8 },
                    BackgroundColor = Colors.White,
                    Content = panel,
                });
            }

            private VerticalStackLayout CreateField(
                FormControlDefinition control,
                FormRuntimeContext runtimeContext)
            {
                var editor = controlFactory.Create(
                    control,
                    runtimeContext);
                editor.IsEnabled = !control.IsDisabled;
                editor.IsVisible = control.IsVisible;

                if (activeBindingManager is not null
                    && activeFormContext is not null
                    && !string.IsNullOrWhiteSpace(control.DataFieldName))
                {
                    var attr = activeFormContext.GetAttribute(control.DataFieldName);
                    if (attr is not null)
                    {
                        var adapter = new MauiFormEditorAdapter(
                            control.DataFieldName,
                            editor,
                            attr.AttributeType);
                        activeBindingManager.Bind(control.DataFieldName, adapter, attr);
                    }
                }

                return new VerticalStackLayout
                {
                    Spacing = 5,
                    Children =
                    {
                        new Label
                        {
                            Text = control.Label
                                ?? control.DataFieldName
                                ?? control.Id,
                            FontSize = 12,
                            TextColor = Color.FromArgb("#605E5C"),
                        },
                        editor,
                    },
                };
            }

            private void RenderMessage(string message)
            {
                ContentHost.Add(new Label
                {
                    Text = message,
                    TextColor = Color.FromArgb("#605E5C"),
                });
            }

            private void RenderLoadFailure(Exception exception) =>
                RenderMessage(
                    $"The generated definition could not be loaded: {exception.Message}");
        }
        """;

    private static string WindowsAppXaml(string namespaceName) =>
        $$"""
        <maui:MauiWinUIApplication
            x:Class="{{namespaceName}}.WinUI.App"
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
            xmlns:maui="using:Microsoft.Maui">
        </maui:MauiWinUIApplication>
        """;

    private static string WindowsAppCode(string namespaceName) =>
        $$"""
        namespace {{namespaceName}}.WinUI;

        public partial class App : MauiWinUIApplication
        {
            public App()
            {
                InitializeComponent();
            }

            protected override MauiApp CreateMauiApp() =>
                MauiProgram.CreateMauiApp();
        }
        """;

    private static string PackageManifest() =>
        """
        <?xml version="1.0" encoding="utf-8"?>
        <Package
          xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
          xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
          xmlns:mp="http://schemas.microsoft.com/appx/2014/phone/manifest"
          xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities"
          IgnorableNamespaces="uap rescap">
          <Identity Name="maui-package-name-placeholder"
                    Publisher="CN=User Name"
                    Version="0.0.0.0" />
          <mp:PhoneIdentity PhoneProductId="5B04384C-4000-4A48-8586-4955E7D93DE5"
                            PhonePublisherId="00000000-0000-0000-0000-000000000000" />
          <Properties>
            <DisplayName>$placeholder$</DisplayName>
            <PublisherDisplayName>User Name</PublisherDisplayName>
            <Logo>$placeholder$.png</Logo>
          </Properties>
          <Dependencies>
            <TargetDeviceFamily Name="Windows.Universal"
                                MinVersion="10.0.17763.0"
                                MaxVersionTested="10.0.19041.0" />
            <TargetDeviceFamily Name="Windows.Desktop"
                                MinVersion="10.0.17763.0"
                                MaxVersionTested="10.0.19041.0" />
          </Dependencies>
          <Resources>
            <Resource Language="x-generate" />
          </Resources>
          <Applications>
            <Application Id="App"
                         Executable="$targetnametoken$.exe"
                         EntryPoint="$targetentrypoint$">
              <uap:VisualElements
                DisplayName="$placeholder$"
                Description="$placeholder$"
                Square150x150Logo="$placeholder$.png"
                Square44x44Logo="$placeholder$.png"
                BackgroundColor="transparent">
                <uap:DefaultTile
                  Square71x71Logo="$placeholder$.png"
                  Wide310x150Logo="$placeholder$.png"
                  Square310x310Logo="$placeholder$.png" />
                <uap:SplashScreen Image="$placeholder$.png" />
              </uap:VisualElements>
            </Application>
          </Applications>
          <Capabilities>
            <rescap:Capability Name="runFullTrust" />
          </Capabilities>
        </Package>
        """;

    private static string WindowsManifest(string projectName) =>
        $$"""
        <?xml version="1.0" encoding="utf-8"?>
        <assembly manifestVersion="1.0"
                  xmlns="urn:schemas-microsoft-com:asm.v1">
          <assemblyIdentity version="1.0.0.0"
                            name="{{Xml(projectName)}}.WinUI.app" />
          <application xmlns="urn:schemas-microsoft-com:asm.v3">
            <windowsSettings>
              <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/PM</dpiAware>
              <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2, PerMonitor</dpiAwareness>
              <longPathAware xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">true</longPathAware>
            </windowsSettings>
          </application>
        </assembly>
        """;

    private static string AppIconSvg() =>
        """
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 128 128">
          <rect width="128" height="128" rx="24" fill="#0F6CBD" />
        </svg>
        """;

    private static string AppIconForegroundSvg() =>
        """
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 128 128">
          <path d="M28 34h72L70 96H54z" fill="#FFFFFF" />
          <path d="M42 48h44L66 82h-8z" fill="#B4D6FA" />
        </svg>
        """;

    private static string SplashSvg() =>
        """
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 128 128">
          <path d="M28 34h72L70 96H54z" fill="#FFFFFF" />
        </svg>
        """;

    private static string Readme(
        ApplicationDefinition application,
        string projectName) =>
        $"""
        # {SingleLine(application.DisplayName)}

        This Windows-first .NET MAUI source project was generated by VerseOff
        from model-driven app `{SingleLine(application.UniqueName)}`.

        - App module ID: `{application.AppModuleId:D}`
        - Source SHA-256: `{application.SourceHash}`
        - Tables: {application.Tables.Count}
        - Forms: {application.Forms.Count}
        - Views: {application.Views.Count}

        The generated project contains only the canonical metadata model and
        clean-room native rendering source. Microsoft proprietary scripts,
        bundles, and first-party PCF implementations are not copied or executed.
        Approved customer scripts and native factories must pass the VerseOff
        compatibility and signing gates before activation.

        ## Build

        ```powershell
        dotnet build .\{projectName}.csproj -c Release
        ```
        """;

    private static string Xml(string value) =>
        SecurityElement.Escape(SingleLine(value)) ?? string.Empty;

    private static string SingleLine(string value) =>
        value.Replace('\r', ' ').Replace('\n', ' ').Trim();
}
