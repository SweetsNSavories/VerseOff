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
                        $"build \"{generated.ProjectFile}\" -c Release",
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
            await process.WaitForExitAsync();
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
