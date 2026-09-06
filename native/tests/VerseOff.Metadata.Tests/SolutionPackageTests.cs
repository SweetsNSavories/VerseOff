using System.IO.Compression;
using System.Text;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class SolutionPackageTests
{
    [TestMethod]
    public async Task DirectoryAndZipProduceSameDeterministicHash()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var source = Path.Combine(root, "source");
            Directory.CreateDirectory(Path.Combine(source, "AppModules"));
            await File.WriteAllTextAsync(
                Path.Combine(source, "customizations.xml"),
                "<ImportExportXml />");
            await File.WriteAllTextAsync(
                Path.Combine(source, "AppModules", "app.xml"),
                "<AppModule />");

            var archivePath = Path.Combine(root, "solution.zip");
            ZipFile.CreateFromDirectory(source, archivePath);

            var directoryPackage = await SolutionPackage.LoadAsync(source);
            var archivePackage = await SolutionPackage.LoadAsync(archivePath);

            Assert.AreEqual(directoryPackage.Sha256, archivePackage.Sha256);
            Assert.HasCount(2, directoryPackage.Entries);
            Assert.IsTrue(archivePackage.TryGetEntry(
                "AppModules/app.xml",
                out var entry));
            Assert.IsNotNull(entry);
            StringAssert.Contains(entry.ReadText(), "AppModule");
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task ArchiveTraversalPathIsRejected()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var archivePath = Path.Combine(root, "solution.zip");
            await using (var file = File.Create(archivePath))
            using (var archive = new ZipArchive(
                file,
                ZipArchiveMode.Create,
                leaveOpen: false))
            {
                var entry = archive.CreateEntry("../outside.xml");
                await using var stream = entry.Open();
                await stream.WriteAsync(Encoding.UTF8.GetBytes("<root />"));
            }

            await Assert.ThrowsExactlyAsync<InvalidDataException>(
                () => SolutionPackage.LoadAsync(archivePath));
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task OversizedEntryIsRejected()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            await File.WriteAllTextAsync(
                Path.Combine(root, "large.xml"),
                "<root>too large</root>");
            var limits = new SolutionPackageLimits(
                MaximumEntryCount: 10,
                MaximumEntryBytes: 4,
                MaximumTotalBytes: 100);

            await Assert.ThrowsExactlyAsync<InvalidDataException>(
                () => SolutionPackage.LoadAsync(root, limits));
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    private static string CreateTemporaryDirectory()
    {
        var path = Path.Combine(
            Path.GetTempPath(),
            $"VerseOff.Metadata.Tests-{Guid.NewGuid():N}");
        Directory.CreateDirectory(path);
        return path;
    }
}
