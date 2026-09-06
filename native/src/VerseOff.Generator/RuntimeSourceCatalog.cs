using System.Reflection;

namespace VerseOff.Generator;

internal static class RuntimeSourceCatalog
{
    private const string Prefix = "VerseOff.RuntimeSources/";

    public static IReadOnlyList<TargetSourceFile> Load()
    {
        var assembly = typeof(RuntimeSourceCatalog).Assembly;
        var sources = new List<TargetSourceFile>();
        foreach (var resourceName in assembly
            .GetManifestResourceNames()
            .Where(name => name.StartsWith(
                Prefix,
                StringComparison.Ordinal)))
        {
            using var stream = assembly.GetManifestResourceStream(resourceName)
                ?? throw new InvalidOperationException(
                    $"Embedded runtime source '{resourceName}' cannot be opened.");
            using var reader = new StreamReader(stream);
            var relativePath = "Runtime/"
                + resourceName[Prefix.Length..].Replace('\\', '/');
            sources.Add(new(relativePath, reader.ReadToEnd()));
        }

        if (sources.Count == 0)
        {
            throw new InvalidOperationException(
                "The VerseOff runtime source catalog is empty.");
        }

        sources.AddRange(RuntimeProjectFiles());
        return sources;
    }

    private static IReadOnlyList<TargetSourceFile> RuntimeProjectFiles() =>
    [
        new(
            "Runtime/VerseOff.Domain/VerseOff.Domain.csproj",
            Project("net10.0")),
        new(
            "Runtime/VerseOff.Storage/VerseOff.Storage.csproj",
            Project(
                "net10.0",
                references: ["VerseOff.Domain"],
                packages:
                [
                    ("Microsoft.EntityFrameworkCore.Design", "10.0.11"),
                    ("Microsoft.EntityFrameworkCore.Sqlite", "10.0.11"),
                    ("SQLitePCLRaw.bundle_e_sqlite3", "2.1.13"),
                ])),
        new(
            "Runtime/VerseOff.ClientApi/VerseOff.ClientApi.csproj",
            Project(
                "net10.0",
                references: ["VerseOff.Domain"],
                packages: [("Jint", "4.16.1")])),
        new(
            "Runtime/VerseOff.ReadModel/VerseOff.ReadModel.csproj",
            Project(
                "net10.0",
                references: ["VerseOff.Domain", "VerseOff.Storage"],
                packages: [("Microsoft.Data.SqlClient", "7.0.2")])),
        new(
            "Runtime/VerseOff.Sync/VerseOff.Sync.csproj",
            Project(
                "net10.0",
                references:
                [
                    "VerseOff.Domain",
                    "VerseOff.Storage",
                    "VerseOff.ClientApi",
                    "VerseOff.ReadModel",
                ])),
        new(
            "Runtime/VerseOff.Controls/VerseOff.Controls.csproj",
            MauiProject(
                references:
                [
                    "VerseOff.Domain",
                    "VerseOff.Storage",
                    "VerseOff.ClientApi",
                    "VerseOff.ReadModel",
                ])),
        new(
            "Runtime/VerseOff.Integrations/VerseOff.Integrations.csproj",
            Project(
                "net10.0",
                references: ["VerseOff.Domain"])),
        new(
            "Runtime/VerseOff.Storage/Migrations/.editorconfig",
            """
            [*.cs]
            dotnet_diagnostic.CA1861.severity = none
            """),
    ];

    private static string Project(
        string targetFramework,
        IReadOnlyList<string>? references = null,
        IReadOnlyList<(string Name, string Version)>? packages = null)
    {
        var projectReferences = string.Join(
            Environment.NewLine,
            (references ?? []).Select(reference =>
                $"    <ProjectReference Include=\"..\\{reference}\\{reference}.csproj\" />"));
        var packageReferences = string.Join(
            Environment.NewLine,
            (packages ?? []).Select(package =>
            {
                if (package.Name is
                    "Microsoft.EntityFrameworkCore.Design")
                {
                    return
                        $"    <PackageReference Include=\"{package.Name}\" Version=\"{package.Version}\">"
                        + Environment.NewLine
                        + "      <PrivateAssets>all</PrivateAssets>"
                        + Environment.NewLine
                        + "    </PackageReference>";
                }

                return
                    $"    <PackageReference Include=\"{package.Name}\" Version=\"{package.Version}\" />";
            }));
        var referencesGroup = projectReferences.Length == 0
            ? string.Empty
            : Environment.NewLine + $"""
              <ItemGroup>
              {projectReferences}
              </ItemGroup>
              """;
        var packagesGroup = packageReferences.Length == 0
            ? string.Empty
            : Environment.NewLine + $"""
              <ItemGroup>
              {packageReferences}
              </ItemGroup>
              """;

        return $"""
            <Project Sdk="Microsoft.NET.Sdk">
              <PropertyGroup>
                <TargetFramework>{targetFramework}</TargetFramework>
              </PropertyGroup>{referencesGroup}{packagesGroup}
            </Project>
            """;
    }

    private static string MauiProject(
        IReadOnlyList<string> references)
    {
        var projectReferences = string.Join(
            Environment.NewLine,
            references.Select(reference =>
                $"    <ProjectReference Include=\"..\\{reference}\\{reference}.csproj\" />"));
        return $"""
            <Project Sdk="Microsoft.NET.Sdk">
              <PropertyGroup>
                <TargetFramework>net10.0-windows10.0.19041.0</TargetFramework>
                <UseMaui>true</UseMaui>
                <SingleProject>true</SingleProject>
                <SupportedOSPlatformVersion>10.0.17763.0</SupportedOSPlatformVersion>
                <TargetPlatformMinVersion>10.0.17763.0</TargetPlatformMinVersion>
              </PropertyGroup>
              <ItemGroup>
                <PackageReference Include="Microsoft.Maui.Controls"
                                  Version="10.0.20" />
              </ItemGroup>
              <ItemGroup>
            {projectReferences}
              </ItemGroup>
            </Project>
            """;
    }
}
