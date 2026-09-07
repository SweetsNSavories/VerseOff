using System.Text.Json;
using System.Diagnostics;
using VerseOff.Domain;

namespace VerseOff.Generator.Tests;

[TestClass]
public sealed class NativeSourceGeneratorTests
{
    [TestMethod]
    public async Task GeneratesDeterministicStandaloneSourceTree()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var firstPath = Path.Combine(root, "first");
            var secondPath = Path.Combine(root, "second");
            var generator = new NativeSourceGenerator();
            var application = CreateApplication();

            var first = await generator.GenerateAsync(
                application,
                firstPath);
            var second = await generator.GenerateAsync(
                application,
                secondPath);

            Assert.IsTrue(File.Exists(first.ProjectFile));
            Assert.IsTrue(File.Exists(first.ManifestFile));
            Assert.IsTrue(File.Exists(Path.Combine(
                first.OutputDirectory,
                "Resources",
                "Raw",
                "app-definition.json")));
            CollectionAssert.AreEqual(
                first.Files
                    .OrderBy(file => file.RelativePath, StringComparer.Ordinal)
                    .Select(file => file.Sha256)
                    .ToArray(),
                second.Files
                    .OrderBy(file => file.RelativePath, StringComparer.Ordinal)
                    .Select(file => file.Sha256)
                    .ToArray());

            using var manifestDocument = JsonDocument.Parse(
                await File.ReadAllTextAsync(first.ManifestFile));
            Assert.AreEqual(
                application.AppModuleId,
                manifestDocument.RootElement
                    .GetProperty("appModuleId")
                    .GetGuid());
            var mainPage = await File.ReadAllTextAsync(Path.Combine(
                first.OutputDirectory,
                "MainPage.xaml"));
            StringAssert.Contains(mainPage, "&lt;Unsafe &amp; App&gt;");
            StringAssert.Contains(mainPage, "UnsavedBadge");
            StringAssert.Contains(mainPage, "OutboxInspectorHost");

            var mainPageCode = await File.ReadAllTextAsync(Path.Combine(
                first.OutputDirectory,
                "MainPage.xaml.cs"));
            StringAssert.Contains(mainPageCode, "DisplayAlertAsync");
            StringAssert.Contains(mainPageCode, "IPendingOperationSource");
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task RefusesToOverwriteExistingSourceTree()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var output = Path.Combine(root, "target");
            var generator = new NativeSourceGenerator();
            await generator.GenerateAsync(CreateApplication(), output);

            await Assert.ThrowsExactlyAsync<IOException>(
                () => generator.GenerateAsync(
                    CreateApplication(),
                    output));
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task BlockingCompatibilityPreventsGeneration()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var application = CreateApplication() with
            {
                Compatibility = new(
                    CompatibilityDisposition.Blocked,
                    [
                        new(
                            "blocked",
                            CompatibilitySeverity.Blocking,
                            "component",
                            "Blocked component.",
                            null),
                    ]),
            };
            var generator = new NativeSourceGenerator();

            await Assert.ThrowsExactlyAsync<InvalidOperationException>(
                () => generator.GenerateAsync(
                    application,
                    Path.Combine(root, "target")));
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    [TestCategory("Integration")]
    public async Task GeneratedWindowsMauiProjectBuilds()
    {
        if (!OperatingSystem.IsWindows())
        {
            Assert.Inconclusive(
                "The generated Windows MAUI project is built only on Windows.");
        }

        var root = CreateTemporaryDirectory();
        try
        {
            var generator = new NativeSourceGenerator();
            var generated = await generator.GenerateAsync(
                CreateApplication(),
                Path.Combine(root, "target"));
            using var process = new Process
            {
                StartInfo = new()
                {
                    FileName = "dotnet",
                    Arguments =
                        $"build \"{generated.ProjectFile}\" -c Release /nodeReuse:false /p:UseSharedCompilation=false",
                    WorkingDirectory = generated.OutputDirectory,
                    RedirectStandardError = true,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                },
            };

            Assert.IsTrue(process.Start());
            var standardOutput = process.StandardOutput.ReadToEndAsync();
            var standardError = process.StandardError.ReadToEndAsync();
            using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(2));
            await process.WaitForExitAsync(cts.Token);
            var output = await standardOutput;
            var error = await standardError;

            Assert.AreEqual(
                0,
                process.ExitCode,
                $"Generated build failed.{Environment.NewLine}{output}{Environment.NewLine}{error}");
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task CopiesOnlyVerifiedCustomerOwnedAssets()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var customerContent =
                System.Text.Encoding.UTF8.GetBytes("function run() {}");
            var customerHash = Convert.ToHexString(
                    System.Security.Cryptography.SHA256.HashData(
                        customerContent))
                .ToLowerInvariant();
            var application = CreateApplication() with
            {
                WebResources =
                [
                    new(
                        Guid.NewGuid(),
                        "contoso_script.js",
                        WebResourceKind.JavaScript,
                        "WebResources/contoso_script.js",
                        customerHash,
                        Provenance(
                            ComponentOrigin.CustomerOwned,
                            customerHash))
                    {
                        Compatibility = CompatibilityDisposition.Native,
                    },
                    new(
                        Guid.NewGuid(),
                        "msdyn_internal.js",
                        WebResourceKind.JavaScript,
                        "WebResources/msdyn_internal.js",
                        new string('b', 64),
                        Provenance(
                            ComponentOrigin.MicrosoftSystem,
                            new string('b', 64)))
                    {
                        Compatibility = CompatibilityDisposition.Fallback,
                    },
                ],
            };
            var provider = new RecordingAssetProvider(
                new Dictionary<string, byte[]>(
                    StringComparer.OrdinalIgnoreCase)
                {
                    ["WebResources/contoso_script.js"] = customerContent,
                });
            var generator = new NativeSourceGenerator();

            var result = await generator.GenerateAsync(
                application,
                Path.Combine(root, "target"),
                sourceAssets: provider);

            Assert.IsTrue(File.Exists(Path.Combine(
                result.OutputDirectory,
                "CustomerAssets",
                "WebResources",
                "contoso_script.js")));
            Assert.HasCount(1, provider.RequestedPaths);
            Assert.AreEqual(
                "WebResources/contoso_script.js",
                provider.RequestedPaths[0]);
            Assert.IsFalse(Directory
                .EnumerateFiles(
                    result.OutputDirectory,
                    "*",
                    SearchOption.AllDirectories)
                .Any(path => path.Contains(
                    "msdyn_internal",
                    StringComparison.OrdinalIgnoreCase)));
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task GeneratesComprehensiveSyntheticCustomerApplicationWithAllSurfaces()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var output = Path.Combine(root, "target");
            var generator = new NativeSourceGenerator();
            var application = CreateComprehensiveApplication();

            var result = await generator.GenerateAsync(application, output);

            Assert.IsTrue(File.Exists(result.ProjectFile));
            Assert.IsTrue(File.Exists(result.ManifestFile));

            var definitionPath = Path.Combine(
                result.OutputDirectory,
                "Resources",
                "Raw",
                "app-definition.json");
            Assert.IsTrue(File.Exists(definitionPath));

            var definitionText = await File.ReadAllTextAsync(definitionPath);
            StringAssert.Contains(definitionText, "header_revenue");
            StringAssert.Contains(definitionText, "footer_statecode");
            StringAssert.Contains(definitionText, "contacts_subgrid");
            StringAssert.Contains(definitionText, "timeline_control");
            StringAssert.Contains(definitionText, "bpf_account_qualification");
            StringAssert.Contains(definitionText, "cmd.deactivate");
            StringAssert.Contains(definitionText, "ValueRule");

            var mainPageCode = await File.ReadAllTextAsync(Path.Combine(
                result.OutputDirectory,
                "MainPage.xaml.cs"));
            StringAssert.Contains(mainPageCode, "BusinessProcessFlowControl");
            StringAssert.Contains(mainPageCode, "commandEvaluator.CanDisplay");

            var mauiProgramCode = await File.ReadAllTextAsync(Path.Combine(
                result.OutputDirectory,
                "MauiProgram.cs"));
            StringAssert.Contains(mauiProgramCode, "InMemoryTimelineRecordProvider");
            StringAssert.Contains(mauiProgramCode, "CommandRuleEvaluator");
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    private static ApplicationDefinition CreateComprehensiveApplication()
    {
        var provenance = new ComponentProvenance(
            "form",
            "contoso_account_form",
            ComponentOrigin.CustomerOwned,
            "contoso_solution",
            "contoso",
            new string('a', 64),
            IsManaged: false,
            OwnershipVerified: true);

        var table = new TableDefinition(
            "account",
            "accounts",
            "accountid",
            "name",
            IsActivity: false,
            [
                new("accountid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("telephone1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("revenue", "Currency", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
            ]);

        var headerControls = new List<FormControlDefinition>
        {
            new(
                "header_revenue",
                "revenue",
                FormControlKind.Currency,
                "{533B9E00-756B-4312-95A0-DC888637AC78}",
                IsVisible: true,
                IsDisabled: false)
            {
                Label = "Annual Revenue",
            },
        };

        var footerControls = new List<FormControlDefinition>
        {
            new(
                "footer_statecode",
                "statecode",
                FormControlKind.Number,
                "{C6D124CA-7ED1-4238-8940-F920A883835E}",
                IsVisible: true,
                IsDisabled: true)
            {
                Label = "Status Code",
            },
        };

        var timelineDefinition = new TimelineDefinition(
            "timeline_control",
            "{06375649-C143-495E-A496-C962E5B4488E}",
            "Timeline",
            "<control />",
            new Dictionary<string, string?>(),
            [
                TimelineModule.Activities,
                TimelineModule.Notes,
                TimelineModule.Posts,
            ],
            ["email", "phonecall", "task"],
            10,
            ShowFilterPane: true,
            ExpandFilterPane: false,
            SearchEnabled: true,
            ExpandAllByDefault: false,
            TimelineSortDirection.NewestToOldest,
            "sortdate",
            TimelineRollupType.None);

        var tabs = new List<FormTabDefinition>
        {
            new(
                "general",
                "General Information",
                IsVisible: true,
                IsExpanded: true,
                0,
                [
                    new(
                        50,
                        [
                            new(
                                "summary",
                                "Account Summary",
                                IsVisible: true,
                                ShowLabel: true,
                                0,
                                [
                                    new(
                                        0,
                                        [
                                            new(
                                                "name-cell",
                                                "Account Name",
                                                IsVisible: true,
                                                ShowLabel: true,
                                                1,
                                                1,
                                                new(
                                                    "name",
                                                    "name",
                                                    FormControlKind.Text,
                                                    null,
                                                    IsVisible: true,
                                                    IsDisabled: false)),
                                        ]),
                                ]),
                            new(
                                "subgrid_section",
                                "Related Contacts",
                                IsVisible: true,
                                ShowLabel: true,
                                1,
                                [
                                    new(
                                        0,
                                        [
                                            new(
                                                "contacts_cell",
                                                "Contacts",
                                                IsVisible: true,
                                                ShowLabel: false,
                                                1,
                                                1,
                                                new(
                                                    "contacts_subgrid",
                                                    null,
                                                    FormControlKind.Subgrid,
                                                    "{E7A81278-8635-4d9e-8D4D-59480B391C5B}",
                                                    IsVisible: true,
                                                    IsDisabled: false)
                                                {
                                                    Label = "Contacts",
                                                    RelationshipName = "account_contacts",
                                                    ViewId = "{00000000-0000-0000-0000-000000000001}",
                                                }),
                                        ]),
                                ]),
                        ]),
                    new(
                        50,
                        [
                            new(
                                "timeline_section",
                                "Timeline & Activities",
                                IsVisible: true,
                                ShowLabel: true,
                                0,
                                [
                                    new(
                                        0,
                                        [
                                            new(
                                                "timeline-cell",
                                                "Timeline",
                                                IsVisible: true,
                                                ShowLabel: false,
                                                1,
                                                1,
                                                new(
                                                    "timeline",
                                                    null,
                                                    FormControlKind.Timeline,
                                                    "{06375649-C143-495E-A496-C962E5B4488E}",
                                                    IsVisible: true,
                                                    IsDisabled: false)
                                                {
                                                    Label = "Timeline",
                                                    Timeline = timelineDefinition,
                                                }),
                                        ]),
                                ]),
                        ]),
                ]),
            new(
                "details",
                "Additional Details",
                IsVisible: true,
                IsExpanded: false,
                1,
                [
                    new(
                        100,
                        [
                            new(
                                "details_section",
                                "Financial Information",
                                IsVisible: true,
                                ShowLabel: true,
                                0,
                                [
                                    new(
                                        0,
                                        [
                                            new(
                                                "revenue-cell",
                                                "Annual Revenue",
                                                IsVisible: true,
                                                ShowLabel: true,
                                                1,
                                                1,
                                                new(
                                                    "revenue",
                                                    "revenue",
                                                    FormControlKind.Currency,
                                                    null,
                                                    IsVisible: true,
                                                    IsDisabled: false)),
                                        ]),
                                ]),
                        ]),
                ]),
        };

        var form = new FormDefinition(
            Guid.Parse("2f3fdbf9-8d4e-48bc-bb0c-9bd9a6c1d3bd"),
            "Account Main Form",
            "account",
            2,
            [],
            provenance)
        {
            Tabs = tabs,
            HeaderControls = headerControls,
            FooterControls = footerControls,
        };

        var commands = new List<CommandDefinition>
        {
            new(
                "cmd.save",
                "Save",
                "account",
                0,
                new CommandActionDefinition(CommandActionKind.Native, "save", []),
                provenance),
            new(
                "cmd.deactivate",
                "Deactivate",
                "account",
                1,
                new CommandActionDefinition(CommandActionKind.Native, "deactivate", []),
                provenance)
            {
                EnableRules =
                [
                    new(
                        "ValueRule",
                        new Dictionary<string, string?>
                        {
                            ["Field"] = "statecode",
                            ["Value"] = "0",
                            ["Default"] = "true",
                        },
                        InvertResult: false),
                ],
            },
        };

        var bpfStage1 = new ProcessStageDefinition(
            Guid.Parse("11111111-1111-1111-1111-111111111111"),
            "Qualify",
            "account",
            ProcessStageCategory.Qualify,
            0,
            [
                new(Guid.NewGuid(), "Account Name", "name", true, 0),
                new(Guid.NewGuid(), "Phone Number", "telephone1", false, 1),
            ]);

        var bpfStage2 = new ProcessStageDefinition(
            Guid.Parse("22222222-2222-2222-2222-222222222222"),
            "Develop",
            "account",
            ProcessStageCategory.Develop,
            1,
            [
                new(Guid.NewGuid(), "Estimated Revenue", "revenue", true, 0),
            ]);

        var bpf = new BusinessProcessFlowDefinition(
            Guid.Parse("44444444-4444-4444-4444-444444444444"),
            "bpf_account_qualification",
            "Account Client Onboarding Flow",
            "account",
            [bpfStage1, bpfStage2],
            provenance);

        return new(
            Guid.Parse("a930ed64-979f-48c4-a618-8a0914a83fa2"),
            "contoso_service",
            "Contoso Service Target",
            [table],
            [form],
            [new("accounts", "Accounts", "account", null, 0)],
            new string('b', 64))
        {
            Commands = commands,
            BusinessProcessFlows = [bpf],
        };
    }

    private static ApplicationDefinition CreateApplication()
    {
        var provenance = new ComponentProvenance(
            "form",
            "contoso_form",
            ComponentOrigin.CustomerOwned,
            "contoso_solution",
            "contoso",
            new string('a', 64),
            IsManaged: false,
            OwnershipVerified: true);
        var table = new TableDefinition(
            "account",
            "accounts",
            "accountid",
            "name",
            IsActivity: false,
            [
                new(
                    "accountid",
                    "Uniqueidentifier",
                    CanRead: true,
                    CanCreate: false,
                    CanUpdate: false,
                    IsSecured: false),
                new(
                    "name",
                    "String",
                    CanRead: true,
                    CanCreate: true,
                    CanUpdate: true,
                    IsSecured: false),
            ]);
        var form = new FormDefinition(
            Guid.NewGuid(),
            "Main",
            "account",
            2,
            [],
            provenance)
        {
            Tabs =
            [
                new(
                    "general",
                    "General",
                    IsVisible: true,
                    IsExpanded: true,
                    0,
                    [
                        new(
                            100,
                            [
                                new(
                                    "summary",
                                    "Summary",
                                    IsVisible: true,
                                    ShowLabel: true,
                                    0,
                                    [
                                        new(
                                            0,
                                            [
                                                new(
                                                    "name-cell",
                                                    "Name",
                                                    IsVisible: true,
                                                    ShowLabel: true,
                                                    1,
                                                    1,
                                                    new(
                                                        "name",
                                                        "name",
                                                        FormControlKind.Text,
                                                        null,
                                                        IsVisible: true,
                                                        IsDisabled: false)),
                                            ]),
                                    ]),
                            ]),
                    ]),
            ],
        };

        return new(
            Guid.Parse("a930ed64-979f-48c4-a618-8a0914a83fa2"),
            "contoso_service",
            "<Unsafe & App>",
            [table],
            [form],
            [
                new(
                    "accounts",
                    "Accounts",
                    "account",
                    null,
                    0),
            ],
            new string('b', 64));
    }

    private static ComponentProvenance Provenance(
        ComponentOrigin origin,
        string hash) =>
        new(
            "resource",
            "resource",
            origin,
            "contoso_solution",
            "contoso",
            hash,
            IsManaged: false,
            OwnershipVerified: origin
                is ComponentOrigin.CustomerOwned);

    private static string CreateTemporaryDirectory()
    {
        var path = Path.Combine(
            Path.GetTempPath(),
            $"VerseOff.Generator.Tests-{Guid.NewGuid():N}");
        Directory.CreateDirectory(path);
        return path;
    }

    private sealed class RecordingAssetProvider(
        IReadOnlyDictionary<string, byte[]> assets) : ISourceAssetProvider
    {
        public List<string> RequestedPaths { get; } = [];

        public ValueTask<ReadOnlyMemory<byte>?> ReadAsync(
            string relativePath,
            CancellationToken cancellationToken = default)
        {
            RequestedPaths.Add(relativePath);
            return ValueTask.FromResult<ReadOnlyMemory<byte>?>(
                assets.TryGetValue(relativePath, out var content)
                    ? content
                    : null);
        }
    }
}
