using System.Globalization;
using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class QuoteAppJsonExportTests
{
    private static readonly SolutionImportPolicy PermissivePolicy = new(
        ["contoso_quotes", "ContosoQuotes"],
        new Dictionary<string, ComponentOrigin>(StringComparer.OrdinalIgnoreCase)
        {
            ["contoso"] = ComponentOrigin.CustomerOwned,
        });

    [TestMethod]
    public async Task ImportsQuoteAppDeltaAndExportsToJsonPackageSuccessfully()
    {
        var root = Path.Combine(Path.GetTempPath(), $"verseoff-quote-json-src-{Guid.NewGuid():N}");
        var exportDir = Path.Combine(Path.GetTempPath(), $"verseoff-quote-json-dst-{Guid.NewGuid():N}");

        try
        {
            Directory.CreateDirectory(root);
            var appId = Guid.NewGuid();
            var quoteFormId = Guid.Parse("d8c368d1-d2c0-43e9-9a25-78e8b2bfdf2a");

            var solutionXml = $"""
            <ImportExportXml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <SolutionManifest>
                <UniqueName>ContosoQuotes</UniqueName>
                <LocalizedNames><LocalizedName description="Contoso Quotes" languagecode="1033" /></LocalizedNames>
                <Version>1.0.0.0</Version>
                <Publisher><UniqueName>contoso</UniqueName></Publisher>
              </SolutionManifest>
              <AppModules>
                <AppModule>
                  <AppModuleId>{appId:D}</AppModuleId>
                  <UniqueName>contoso_quotes</UniqueName>
                  <LocalizedNames>
                    <LocalizedName description="Contoso Quote Manager" />
                  </LocalizedNames>
                  <AppModuleComponents>
                    <AppModuleComponent type="1" schemaName="quote" />
                    <AppModuleComponent type="1" schemaName="account" />
                    <AppModuleComponent type="1" schemaName="contact" />
                    <AppModuleComponent type="60" id="{quoteFormId:D}" />
                  </AppModuleComponents>
                  <SiteMapXml><![CDATA[
                    <SiteMap>
                      <Area Id="Sales">
                        <Titles><Title Description="Sales" /></Titles>
                        <Group Id="Collateral">
                          <Titles><Title Description="Collateral" /></Titles>
                          <SubArea Id="Quotes" Entity="quote">
                            <Titles><Title Description="Quotes" /></Titles>
                          </SubArea>
                          <SubArea Id="Accounts" Entity="account">
                            <Titles><Title Description="Accounts" /></Titles>
                          </SubArea>
                          <SubArea Id="Contacts" Entity="contact">
                            <Titles><Title Description="Contacts" /></Titles>
                          </SubArea>
                        </Group>
                      </Area>
                    </SiteMap>
                  ]]></SiteMapXml>
                </AppModule>
              </AppModules>
              <Entities>
                <Entity>
                  <Name LocalizedName="Quote">quote</Name>
                  <EntityInfo>
                    <entity Name="quote"
                            EntitySetName="quotes"
                            PrimaryIdAttribute="quoteid"
                            PrimaryNameAttribute="name">
                      <attributes>
                        <attribute PhysicalName="quoteid">
                          <LogicalName>quoteid</LogicalName>
                          <Type>Uniqueidentifier</Type>
                        </attribute>
                        <attribute PhysicalName="name">
                          <LogicalName>name</LogicalName>
                          <Type>String</Type>
                          <RequiredLevel>Required</RequiredLevel>
                        </attribute>
                        <attribute PhysicalName="customerid">
                          <LogicalName>customerid</LogicalName>
                          <Type>Customer</Type>
                        </attribute>
                        <attribute PhysicalName="totalamount">
                          <LogicalName>totalamount</LogicalName>
                          <Type>Currency</Type>
                        </attribute>
                      </attributes>
                    </entity>
                  </EntityInfo>
                </Entity>
              </Entities>
            </ImportExportXml>
            """;

            await File.WriteAllTextAsync(Path.Combine(root, "customizations.xml"), solutionXml);
            var package = await SolutionPackage.LoadAsync(root);

            var importer = new DataverseSolutionImporter(
                PermissivePolicy,
                SchemaValidationBehavior.ReportOnly,
                ootbResolver: BundledOOTBCatalog.Instance);

            var result = importer.Import(package, appId);
            Assert.IsTrue(result.Succeeded, "Import should succeed");
            Assert.IsNotNull(result.Application);

            // Export to JSON Package
            var manifest = await DataverseSolutionImporter.ExportAsJsonAsync(result.Application, exportDir);
            Assert.IsNotNull(manifest);
            Assert.AreEqual("contoso_quotes", manifest.UniqueName);
            Assert.IsTrue(File.Exists(Path.Combine(exportDir, "manifest.json")));
            Assert.IsTrue(File.Exists(Path.Combine(exportDir, "app.json")));
            Assert.IsTrue(File.Exists(Path.Combine(exportDir, "navigation.json")));
            Assert.IsTrue(Directory.Exists(Path.Combine(exportDir, "forms")));
            Assert.IsTrue(Directory.Exists(Path.Combine(exportDir, "views")));

            // Deserialize and validate
            var reloaded = await ApplicationDefinitionDeserializer.DeserializeFromPackageAsync(exportDir);
            Assert.IsNotNull(reloaded);
            Assert.AreEqual(result.Application.UniqueName, reloaded.UniqueName);
            Assert.HasCount(result.Application.Tables.Count, reloaded.Tables);

            // Verify Quote form was loaded and intact
            var quoteForm = reloaded.Forms.FirstOrDefault(f => f.TableLogicalName == "quote");
            Assert.IsNotNull(quoteForm);
            Assert.AreEqual(quoteFormId, quoteForm.FormId);
            Assert.IsNotEmpty(quoteForm.Tabs);

            // Verify Navigation
            Assert.IsTrue(reloaded.Navigation.Any(n => n.TableLogicalName == "quote"));
            Assert.IsTrue(reloaded.Navigation.Any(n => n.TableLogicalName == "account"));
            Assert.IsTrue(reloaded.Navigation.Any(n => n.TableLogicalName == "contact"));

            // Verify Canonical Validation
            var validation = ApplicationDefinitionValidator.Validate(reloaded);
            Assert.IsTrue(validation.IsValid, $"Validation should pass. Issues: {string.Join("; ", validation.Issues.Select(i => i.Message))}");
        }
        finally
        {
            try
            {
                if (Directory.Exists(root))
                {
                    Directory.Delete(root, recursive: true);
                }

                if (Directory.Exists(exportDir))
                {
                    Directory.Delete(exportDir, recursive: true);
                }
            }
            catch (IOException)
            {
                // Best-effort cleanup
            }
        }
    }

    [TestMethod]
    public async Task ExportsReferenceSamplePackageToExamplesDirectory()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        string? examplesDir = null;
        while (current != null)
        {
            var candidate = Path.Combine(current.FullName, "native", "examples");
            if (Directory.Exists(candidate))
            {
                examplesDir = candidate;
                break;
            }

            current = current.Parent;
        }

        Assert.IsNotNull(examplesDir, "native/examples directory must exist.");
        var quoteAppOfflineDir = Path.Combine(examplesDir, "quote-app-offline");

        var root = Path.Combine(Path.GetTempPath(), $"verseoff-quote-sample-src-{Guid.NewGuid():N}");
        try
        {
            Directory.CreateDirectory(root);
            var appId = Guid.Parse("e84992dc-1296-41dc-a84e-39988b48ef72");
            var quoteFormId = BundledOOTBCatalog.QuoteMainFormId;

            var solutionXml = $"""
            <ImportExportXml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <SolutionManifest>
                <UniqueName>ContosoQuotes</UniqueName>
                <LocalizedNames><LocalizedName description="Contoso Quotes" languagecode="1033" /></LocalizedNames>
                <Version>1.0.0.0</Version>
                <Publisher><UniqueName>contoso</UniqueName></Publisher>
              </SolutionManifest>
              <AppModules>
                <AppModule>
                  <AppModuleId>{appId:D}</AppModuleId>
                  <UniqueName>contoso_quotes</UniqueName>
                  <LocalizedNames>
                    <LocalizedName description="Contoso Quote Manager" />
                  </LocalizedNames>
                  <AppModuleComponents>
                    <AppModuleComponent type="1" schemaName="quote" />
                    <AppModuleComponent type="1" schemaName="account" />
                    <AppModuleComponent type="1" schemaName="contact" />
                    <AppModuleComponent type="60" id="{quoteFormId:D}" />
                  </AppModuleComponents>
                  <SiteMapXml><![CDATA[
                    <SiteMap>
                      <Area Id="Sales">
                        <Titles><Title Description="Sales" /></Titles>
                        <Group Id="Collateral">
                          <Titles><Title Description="Collateral" /></Titles>
                          <SubArea Id="Quotes" Entity="quote">
                            <Titles><Title Description="Quotes" /></Titles>
                          </SubArea>
                          <SubArea Id="Accounts" Entity="account">
                            <Titles><Title Description="Accounts" /></Titles>
                          </SubArea>
                          <SubArea Id="Contacts" Entity="contact">
                            <Titles><Title Description="Contacts" /></Titles>
                          </SubArea>
                        </Group>
                      </Area>
                    </SiteMap>
                  ]]></SiteMapXml>
                </AppModule>
              </AppModules>
              <Entities>
                <Entity>
                  <Name LocalizedName="Quote">quote</Name>
                  <EntityInfo>
                    <entity Name="quote"
                            EntitySetName="quotes"
                            PrimaryIdAttribute="quoteid"
                            PrimaryNameAttribute="name">
                      <attributes>
                        <attribute PhysicalName="quoteid">
                          <LogicalName>quoteid</LogicalName>
                          <Type>Uniqueidentifier</Type>
                        </attribute>
                        <attribute PhysicalName="name">
                          <LogicalName>name</LogicalName>
                          <Type>String</Type>
                          <RequiredLevel>Required</RequiredLevel>
                        </attribute>
                        <attribute PhysicalName="customerid">
                          <LogicalName>customerid</LogicalName>
                          <Type>Customer</Type>
                        </attribute>
                        <attribute PhysicalName="totalamount">
                          <LogicalName>totalamount</LogicalName>
                          <Type>Currency</Type>
                        </attribute>
                      </attributes>
                    </entity>
                  </EntityInfo>
                </Entity>
              </Entities>
            </ImportExportXml>
            """;

            await File.WriteAllTextAsync(Path.Combine(root, "customizations.xml"), solutionXml);
            var package = await SolutionPackage.LoadAsync(root);

            var importer = new DataverseSolutionImporter(
                PermissivePolicy,
                SchemaValidationBehavior.ReportOnly,
                ootbResolver: BundledOOTBCatalog.Instance);

            var result = importer.Import(package, appId);
            Assert.IsTrue(result.Succeeded, "Import should succeed");
            Assert.IsNotNull(result.Application);

            var views = new List<ViewDefinition>();
            var quoteView = BundledOOTBCatalog.Instance.TryGetView(BundledOOTBCatalog.ActiveQuotesViewId, "quote");
            if (quoteView is not null)
            {
                views.Add(quoteView);
            }

            var accountView = BundledOOTBCatalog.Instance.TryGetView(BundledOOTBCatalog.ActiveAccountsViewId, "account");
            if (accountView is not null)
            {
                views.Add(accountView);
            }

            var contactView = BundledOOTBCatalog.Instance.TryGetView(BundledOOTBCatalog.ActiveContactsViewId, "contact");
            if (contactView is not null)
            {
                views.Add(contactView);
            }

            var offlineProfile = new OfflineProfileDefinition(
                Guid.Parse("7a918e95-7762-4212-87c2-192518e7e174"),
                "Contoso Quotes Offline Profile",
                [
                    new OfflineProfileItemDefinition("quote", "<fetch><entity name=\"quote\"><attribute name=\"quoteid\" /><attribute name=\"name\" /><attribute name=\"totalamount\" /></entity></fetch>", [])
                    {
                        SyncPriority = 1,
                        ConflictStrategy = ConflictStrategy.ServerWins,
                    },
                    new OfflineProfileItemDefinition("account", "<fetch><entity name=\"account\"><attribute name=\"accountid\" /><attribute name=\"name\" /></entity></fetch>", [])
                    {
                        SyncPriority = 2,
                        ConflictStrategy = ConflictStrategy.ServerWins,
                    },
                    new OfflineProfileItemDefinition("contact", "<fetch><entity name=\"contact\"><attribute name=\"contactid\" /><attribute name=\"fullname\" /></entity></fetch>", [])
                    {
                        SyncPriority = 3,
                        ConflictStrategy = ConflictStrategy.ServerWins,
                    },
                ],
                "sample-quote-hash")
            {
                Overlay = new BcdrProfileOverlay(["quote"], TimeSpan.FromHours(12), TimeSpan.FromDays(14), false, false),
            };

            var appToExport = result.Application with
            {
                Views = views,
                OfflineProfile = offlineProfile,
            };

            if (Directory.Exists(quoteAppOfflineDir))
            {
                Directory.Delete(quoteAppOfflineDir, recursive: true);
            }

            var manifest = await DataverseSolutionImporter.ExportAsJsonAsync(appToExport, quoteAppOfflineDir);
            Assert.IsNotNull(manifest);
            Assert.AreEqual("contoso_quotes", manifest.UniqueName);

            var reloaded = await ApplicationDefinitionDeserializer.DeserializeFromPackageAsync(quoteAppOfflineDir);
            Assert.IsNotNull(reloaded);
            Assert.AreEqual(appToExport.UniqueName, reloaded.UniqueName);
            Assert.IsNotNull(reloaded.OfflineProfile);
            Assert.HasCount(3, reloaded.Views);

            var validation = ApplicationDefinitionValidator.Validate(reloaded);
            Assert.IsTrue(validation.IsValid, $"Validation must pass: {string.Join("; ", validation.Issues.Select(i => i.Message))}");
        }
        finally
        {
            try
            {
                if (Directory.Exists(root))
                {
                    Directory.Delete(root, recursive: true);
                }
            }
            catch (IOException)
            {
                // Best-effort cleanup
            }
        }
    }
}

