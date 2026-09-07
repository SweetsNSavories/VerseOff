using System.Globalization;
using System.Text;
using System.Xml.Linq;
using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class ApplicationDefinitionSerializerTests
{
    [TestMethod]
    public async Task SerializesAndDeserializesRoundTripCorrectly()
    {
        var tempDir = Path.Combine(Path.GetTempPath(), $"verseoff-ser-test-{Guid.NewGuid():N}");
        try
        {
            var app = CreateSampleApplication();
            var manifest = await ApplicationDefinitionSerializer.SerializeToPackageAsync(app, tempDir);

            Assert.IsNotNull(manifest);
            Assert.AreEqual("contoso_sales", manifest.UniqueName);
            Assert.AreEqual("Contoso Sales Hub", manifest.DisplayName);
            Assert.AreEqual("1", manifest.ManifestVersion);
            Assert.IsGreaterThan(0, manifest.TotalSizeBytes);
            Assert.IsNotEmpty(manifest.Checksum);
            Assert.IsGreaterThanOrEqualTo(4, manifest.Files.Count);

            // Reconstitute via Deserializer
            var deserialized = await ApplicationDefinitionDeserializer.DeserializeFromPackageAsync(tempDir);

            Assert.IsNotNull(deserialized);
            Assert.AreEqual(app.AppModuleId, deserialized.AppModuleId);
            Assert.AreEqual(app.UniqueName, deserialized.UniqueName);
            Assert.AreEqual(app.DisplayName, deserialized.DisplayName);
            Assert.AreEqual(app.Description, deserialized.Description);
            Assert.AreEqual(app.SchemaVersion, deserialized.SchemaVersion);

            // Verify Tables
            Assert.HasCount(app.Tables.Count, deserialized.Tables);
            var accountTable = deserialized.Tables.FirstOrDefault(t => t.LogicalName == "account");
            Assert.IsNotNull(accountTable);
            Assert.AreEqual("accounts", accountTable.EntitySetName);
            Assert.AreEqual("accountid", accountTable.PrimaryIdAttribute);
            Assert.IsTrue(accountTable.Columns.Any(c => c.LogicalName == "name"));

            // Verify Forms
            Assert.HasCount(app.Forms.Count, deserialized.Forms);
            var form = deserialized.Forms[0];
            Assert.AreEqual(app.Forms[0].FormId, form.FormId);
            Assert.AreEqual(app.Forms[0].TableLogicalName, form.TableLogicalName);
            Assert.IsNotEmpty(form.Tabs);

            // Verify Views
            Assert.HasCount(app.Views.Count, deserialized.Views);
            var view = deserialized.Views[0];
            Assert.AreEqual(app.Views[0].ViewId, view.ViewId);
            Assert.AreEqual(app.Views[0].TableLogicalName, view.TableLogicalName);
            Assert.IsTrue(view.FetchXml.Contains("fetch", StringComparison.OrdinalIgnoreCase));

            // Verify Navigation
            Assert.HasCount(app.Navigation.Count, deserialized.Navigation);
            Assert.AreEqual("nav_accounts", deserialized.Navigation[0].Id);

            // Verify Offline Profile
            Assert.IsNotNull(deserialized.OfflineProfile);
            Assert.AreEqual("Sales Offline Profile", deserialized.OfflineProfile.Name);
            Assert.HasCount(1, deserialized.OfflineProfile.Items);
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
    public async Task ThrowsWhenFileChecksumIsCorrupted()
    {
        var tempDir = Path.Combine(Path.GetTempPath(), $"verseoff-tamper-test-{Guid.NewGuid():N}");
        try
        {
            var app = CreateSampleApplication();
            await ApplicationDefinitionSerializer.SerializeToPackageAsync(app, tempDir);

            // Tamper with app.json
            var appJsonPath = Path.Combine(tempDir, "app.json");
            await File.AppendAllTextAsync(appJsonPath, "   ");

            await Assert.ThrowsExactlyAsync<InvalidDataException>(
                () => ApplicationDefinitionDeserializer.DeserializeFromPackageAsync(tempDir));
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
    public async Task RenderedFormXmlIsValidAgainstPublishedSchema()
    {
        var tempDir = Path.Combine(Path.GetTempPath(), $"verseoff-schema-test-{Guid.NewGuid():N}");
        try
        {
            var app = CreateSampleApplication();
            var manifest = await ApplicationDefinitionSerializer.SerializeToPackageAsync(app, tempDir);

            var formFileEntry = manifest.Files.Keys.FirstOrDefault(k => k.EndsWith(".formxml", StringComparison.OrdinalIgnoreCase));
            Assert.IsNotNull(formFileEntry);

            var formXmlPath = Path.Combine(tempDir, formFileEntry);
            var formXml = await File.ReadAllTextAsync(formXmlPath);

            using var stream = new MemoryStream(Encoding.UTF8.GetBytes(formXml));
            var validation = PublishedSchemaCatalog.Default.Validate(stream, "FormXml.xsd");
            Assert.IsNotNull(validation);

            var doc = SecureXml.Parse(formXml);
            Assert.IsNotNull(doc.Root);
            Assert.AreEqual("form", doc.Root.Name.LocalName);
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

    private static ApplicationDefinition CreateSampleApplication()
    {
        var appId = Guid.NewGuid();
        var formId = Guid.NewGuid();
        var viewId = Guid.NewGuid();
        var provenance = new ComponentProvenance(
            "contoso_sales_comp",
            "ContosoSales",
            ComponentOrigin.CustomerOwned,
            "ContosoSolution",
            "contoso",
            "sha256-test",
            IsManaged: false,
            OwnershipVerified: true);

        var accountColumns = new List<ColumnDefinition>
        {
            new("accountid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
            new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
            new("telephone1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
        };

        var accountTable = new TableDefinition(
            "account",
            "accounts",
            "accountid",
            "name",
            IsActivity: false,
            accountColumns)
        {
            DisplayName = "Account",
            DisplayCollectionName = "Accounts",
        };

        var formControls = new List<FormControlDefinition>
        {
            new("name", "name", FormControlKind.Text, "{4273edbd-ac1d-40d3-9fb2-095c621b552d}", IsVisible: true, IsDisabled: false) { Label = "Account Name" },
            new("telephone1", "telephone1", FormControlKind.Text, "{4273edbd-ac1d-40d3-9fb2-095c621b552d}", IsVisible: true, IsDisabled: false) { Label = "Phone" },
        };

        var cells = formControls.Select(c => new FormCellDefinition(Guid.NewGuid().ToString("N", CultureInfo.InvariantCulture), c.Label, IsVisible: true, ShowLabel: true, 1, 1, c)).ToList();
        var rows = cells.Select(c => new FormRowDefinition(1, [c])).ToList();
        var sections = new List<FormSectionDefinition> { new("general_sec", "General Info", IsVisible: true, ShowLabel: true, 1, rows) };
        var formColumns = new List<FormColumnDefinition> { new(100, sections) };
        var tabs = new List<FormTabDefinition> { new("general", "General", IsVisible: true, IsExpanded: true, 1, formColumns) };

        var form = new FormDefinition(
            formId,
            "Account Main Form",
            "account",
            2,
            [],
            provenance)
        {
            Tabs = tabs,
        };

        var viewColumns = new List<ViewColumnDefinition>
        {
            new("name", 300, 1, IsPrimary: true),
            new("telephone1", 150, 2, IsPrimary: false),
        };

        var view = new ViewDefinition(
            viewId,
            "Active Accounts",
            "account",
            "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\"><entity name=\"account\"><attribute name=\"name\" /><attribute name=\"telephone1\" /></entity></fetch>",
            "<grid name=\"result\" object=\"1\" jump=\"name\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"result\" id=\"accountid\"><cell name=\"name\" width=\"300\" /><cell name=\"telephone1\" width=\"150\" /></row></grid>",
            IsDefault: true,
            provenance)
        {
            Columns = viewColumns,
        };

        var navigation = new List<NavigationDefinition>
        {
            new("nav_accounts", "Accounts", "account", null, 1) { Kind = NavigationNodeKind.SubArea },
        };

        var offlineProfile = new OfflineProfileDefinition(
            Guid.NewGuid(),
            "Sales Offline Profile",
            [new OfflineProfileItemDefinition("account", "<fetch><entity name=\"account\" /></fetch>", [])],
            "sha256-profile");

        return new ApplicationDefinition(
            appId,
            "contoso_sales",
            "Contoso Sales Hub",
            [accountTable],
            [form],
            navigation,
            "sha256-source")
        {
            Description = "Contoso Sales App for offline BCDR",
            Views = [view],
            OfflineProfile = offlineProfile,
        };
    }
}
