using System.IO.Compression;
using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class OfflinePackageWriterTests
{
    [TestMethod]
    public async Task WritesPackageDirectorySuccessfully()
    {
        var tempDir = Path.Combine(Path.GetTempPath(), $"verseoff-writer-dir-{Guid.NewGuid():N}");
        try
        {
            var app = CreateSampleApp();
            var manifest = await OfflinePackageWriter.WritePackageDirectoryAsync(app, tempDir);

            Assert.IsNotNull(manifest);
            Assert.IsTrue(File.Exists(Path.Combine(tempDir, "manifest.json")));
            Assert.IsTrue(File.Exists(Path.Combine(tempDir, "app.json")));
            Assert.IsTrue(Directory.Exists(Path.Combine(tempDir, "forms")));
            Assert.IsTrue(Directory.Exists(Path.Combine(tempDir, "views")));
        }
        finally
        {
            try
            {
                if (Directory.Exists(tempDir))
                {
                    Directory.Delete(tempDir, recursive: true);
                }
            }
            catch (IOException)
            {
                // Best-effort cleanup
            }
        }
    }

    [TestMethod]
    public async Task CompressesPackageAndVerifiesArchiveStructure()
    {
        var tempZip = Path.Combine(Path.GetTempPath(), $"verseoff-pkg-{Guid.NewGuid():N}.zip");
        var extractDir = Path.Combine(Path.GetTempPath(), $"verseoff-extract-{Guid.NewGuid():N}");
        try
        {
            var app = CreateSampleApp();
            var result = await OfflinePackageWriter.WriteCompressedPackageAsync(app, tempZip);

            Assert.IsNotNull(result);
            Assert.IsTrue(File.Exists(tempZip));
            Assert.IsGreaterThan(0, result.CompressedSizeBytes);
            Assert.IsGreaterThan(0, result.UncompressedSizeBytes);
            Assert.IsGreaterThan(0.0, result.CompressionRatio);

            // Extract and verify contents
            ZipFile.ExtractToDirectory(tempZip, extractDir);
            Assert.IsTrue(File.Exists(Path.Combine(extractDir, "manifest.json")));
            Assert.IsTrue(File.Exists(Path.Combine(extractDir, "app.json")));
            Assert.IsTrue(Directory.Exists(Path.Combine(extractDir, "forms")));

            // Deserialization check on extracted package
            var reconstituted = await ApplicationDefinitionDeserializer.DeserializeFromPackageAsync(extractDir);
            Assert.IsNotNull(reconstituted);
            Assert.AreEqual(app.UniqueName, reconstituted.UniqueName);
            Assert.HasCount(app.Tables.Count, reconstituted.Tables);
        }
        finally
        {
            try
            {
                if (File.Exists(tempZip))
                {
                    File.Delete(tempZip);
                }

                if (Directory.Exists(extractDir))
                {
                    Directory.Delete(extractDir, recursive: true);
                }
            }
            catch (IOException)
            {
                // Best-effort cleanup
            }
        }
    }

    private static ApplicationDefinition CreateSampleApp()
    {
        var provenance = new ComponentProvenance(
            "quote_comp",
            "QuoteComponent",
            ComponentOrigin.CustomerOwned,
            "ContosoSolution",
            "contoso",
            "sha256-dummy",
            IsManaged: false,
            OwnershipVerified: true);

        var table = new TableDefinition(
            "quote",
            "quotes",
            "quoteid",
            "name",
            IsActivity: false,
            [
                new("quoteid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ]);

        var form = new FormDefinition(
            Guid.NewGuid(),
            "Quote Main Form",
            "quote",
            2,
            [],
            provenance);

        var view = new ViewDefinition(
            Guid.NewGuid(),
            "Active Quotes",
            "quote",
            "<fetch><entity name=\"quote\" /></fetch>",
            "<grid />",
            IsDefault: true,
            provenance);

        return new ApplicationDefinition(
            Guid.NewGuid(),
            "contoso_quotes",
            "Contoso Quotes",
            [table],
            [form],
            [],
            "sha256-source")
        {
            Views = [view],
        };
    }
}
