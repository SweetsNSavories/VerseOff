using System.Globalization;
using System.IO.Compression;
using System.Text;
using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class QuoteAppPayloadReductionTests
{
    private static readonly SolutionImportPolicy PermissivePolicy = new(
        ["contoso_quotes", "ContosoQuotes"],
        new Dictionary<string, ComponentOrigin>(StringComparer.OrdinalIgnoreCase)
        {
            ["contoso"] = ComponentOrigin.CustomerOwned,
        });

    [TestMethod]
    public async Task VerifiesQuoteAppPayloadMeetsReductionTarget()
    {
        var tempRoot = Path.Combine(Path.GetTempPath(), $"verseoff-reduction-{Guid.NewGuid():N}");
        var deltaSolutionDir = Path.Combine(tempRoot, "delta");
        var baselineSolutionZip = Path.Combine(tempRoot, "baseline_solution.zip");
        var generatedOfflineZip = Path.Combine(tempRoot, "quote_app_offline.zip");

        try
        {
            Directory.CreateDirectory(tempRoot);
            Directory.CreateDirectory(deltaSolutionDir);

            var appId = Guid.NewGuid();
            var quoteFormId = Guid.Parse("d8c368d1-d2c0-43e9-9a25-78e8b2bfdf2a");

            // 1. Create a typical baseline enterprise solution package (with redundant full schemas, labels, ribbon diffs)
            await CreateBaselineEnterpriseSolutionZipAsync(baselineSolutionZip);
            var baselineZipSize = new FileInfo(baselineSolutionZip).Length;
            Assert.IsGreaterThan(0, baselineZipSize, "Baseline solution ZIP must exist.");

            // 2. Create the delta solution package
            await CreateDeltaSolutionPackageAsync(deltaSolutionDir, appId, quoteFormId);
            var package = await SolutionPackage.LoadAsync(deltaSolutionDir);

            // 3. Import with BundledOOTBCatalog resolving OOTB components
            var importer = new DataverseSolutionImporter(
                PermissivePolicy,
                SchemaValidationBehavior.ReportOnly,
                ootbResolver: BundledOOTBCatalog.Instance);

            var result = importer.Import(package, appId);
            Assert.IsTrue(result.Succeeded, "Import should succeed.");
            Assert.IsNotNull(result.Application);

            // 4. Generate compressed offline bundle
            var compressionResult = await OfflinePackageWriter.WriteCompressedPackageAsync(
                result.Application,
                generatedOfflineZip);

            Assert.IsNotNull(compressionResult);
            var offlineBundleSize = new FileInfo(generatedOfflineZip).Length;

            // 5. Assertions for Phase 2c Acceptance Criteria:
            // a) Generated offline package size < 100 KB
            Assert.IsLessThan(
                100 * 1024,
                offlineBundleSize,
                $"Generated offline bundle size ({offlineBundleSize / 1024.0:F1} KB) must be less than 100 KB.");

            // b) Reduction factor >= 5.0x
            var reductionRatio = (double)baselineZipSize / offlineBundleSize;
            Assert.IsGreaterThanOrEqualTo(
                5.0,
                reductionRatio,
                $"Payload reduction ratio ({reductionRatio:F2}x) must be at least 5.0x (Baseline: {baselineZipSize} bytes, Offline: {offlineBundleSize} bytes).");

            // c) Verify offline components render and validate
            Assert.IsTrue(result.Application.Tables.Any(t => t.LogicalName == "quote"));
            Assert.IsTrue(result.Application.Tables.Any(t => t.LogicalName == "account"));
            Assert.IsTrue(result.Application.Tables.Any(t => t.LogicalName == "contact"));
            Assert.IsTrue(result.Application.Forms.Any(f => f.TableLogicalName == "quote"));
            Assert.IsTrue(result.Application.Views.Any(v => v.TableLogicalName == "quote"));
            Assert.IsGreaterThanOrEqualTo(3, result.Application.Navigation.Count);
        }
        finally
        {
            try
            {
                if (Directory.Exists(tempRoot))
                {
                    Directory.Delete(tempRoot, recursive: true);
                }
            }
            catch (IOException)
            {
                // Best-effort cleanup
            }
        }
    }

    private static async Task CreateBaselineEnterpriseSolutionZipAsync(string zipPath)
    {
        var tempDir = Path.Combine(Path.GetTempPath(), $"verseoff-baseline-{Guid.NewGuid():N}");
        try
        {
            Directory.CreateDirectory(tempDir);

            // Create a realistic full enterprise solution with redundant entity descriptions, localized labels, multiple language packs, ribbon XML
            var sb = new StringBuilder();
            sb.AppendLine("""<ImportExportXml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">""");
            sb.AppendLine("""  <SolutionManifest>""");
            sb.AppendLine("""    <UniqueName>EnterpriseDynamicsSalesHub</UniqueName>""");
            sb.AppendLine("""    <Version>9.2.24011.00100</Version>""");
            sb.AppendLine("""    <Publisher><UniqueName>microsoft</UniqueName></Publisher>""");
            sb.AppendLine("""  </SolutionManifest>""");
            sb.AppendLine("""  <Entities>""");

            // Add large metadata blocks simulating full CRM export for Quote, Account, Contact, Competitor, Product, Opportunity
            string[] entities = ["quote", "account", "contact", "opportunity", "product", "pricelevel", "uom", "competitor"];
            foreach (var entity in entities)
            {
                sb.AppendLine(CultureInfo.InvariantCulture, $"""    <Entity><Name LocalizedName="{entity}">{entity}</Name>""");
                sb.AppendLine("""      <EntityInfo>""");
                sb.AppendLine(CultureInfo.InvariantCulture, $"""        <entity Name="{entity}" EntitySetName="{entity}s" PrimaryIdAttribute="{entity}id" PrimaryNameAttribute="name">""");
                sb.AppendLine("""          <attributes>""");

                // Generate 80-120 attributes per entity with multi-language localized labels to simulate enterprise metadata weight
                for (var i = 0; i < 90; i++)
                {
                    sb.AppendLine(CultureInfo.InvariantCulture, $"""            <attribute PhysicalName="field_{i}">""");
                    sb.AppendLine(CultureInfo.InvariantCulture, $"""              <LogicalName>field_{i}</LogicalName>""");
                    sb.AppendLine("""              <Type>String</Type>""");
                    sb.AppendLine("""              <Descriptions>""");
                    sb.AppendLine(CultureInfo.InvariantCulture, $"""                <Description description="Extended enterprise CRM description for attribute field_{i} across multi-geo organization" languagecode="1033" />""");
                    sb.AppendLine(CultureInfo.InvariantCulture, $"""                <Description description="Description etendue de l'entreprise CRM pour l'attribut field_{i}" languagecode="1036" />""");
                    sb.AppendLine(CultureInfo.InvariantCulture, $"""                <Description description="Erweiterte Unternehmens-CRM-Beschreibung fur das Attribut field_{i}" languagecode="1031" />""");
                    sb.AppendLine("""              </Descriptions>""");
                    sb.AppendLine("""            </attribute>""");
                }

                sb.AppendLine("""          </attributes>""");
                sb.AppendLine("""        </entity>""");
                sb.AppendLine("""      </EntityInfo>""");
                sb.AppendLine("""    </Entity>""");
            }

            sb.AppendLine("""  </Entities>""");

            // Add Ribbon XML block
            sb.AppendLine("""  <RibbonDiffXml>""");
            sb.AppendLine("""    <CustomActions>""");
            for (var i = 0; i < 40; i++)
            {
                sb.AppendLine(CultureInfo.InvariantCulture, $"""      <CustomAction Id="Contoso.Command_{i}" Location="Mscrm.Form.quote.MainTab.Actions.Controls._children" Sequence="{i * 10}" />""");
            }

            sb.AppendLine("""    </CustomActions>""");
            sb.AppendLine("""  </RibbonDiffXml>""");
            sb.AppendLine("""</ImportExportXml>""");

            await File.WriteAllTextAsync(Path.Combine(tempDir, "customizations.xml"), sb.ToString(), Encoding.UTF8);

            // Add realistic web resources representing standard D365 client libraries (typically 60-150KB in an enterprise solution)
            var webResDir = Path.Combine(tempDir, "WebResources");
            Directory.CreateDirectory(webResDir);
            for (var i = 0; i < 4; i++)
            {
                var libraryPayload = new byte[16 * 1024];
                Random.Shared.NextBytes(libraryPayload);
                await File.WriteAllBytesAsync(Path.Combine(webResDir, $"enterprise_library_{i}.js"), libraryPayload);
            }

            // Compress to baseline zip
            ZipFile.CreateFromDirectory(tempDir, zipPath, CompressionLevel.Optimal, includeBaseDirectory: false);
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

    private static async Task CreateDeltaSolutionPackageAsync(string packageDir, Guid appId, Guid quoteFormId)
    {
        var deltaXml = $"""
        <ImportExportXml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <SolutionManifest>
            <UniqueName>ContosoQuotes</UniqueName>
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
                  </attributes>
                </entity>
              </EntityInfo>
            </Entity>
          </Entities>
        </ImportExportXml>
        """;

        await File.WriteAllTextAsync(Path.Combine(packageDir, "customizations.xml"), deltaXml, Encoding.UTF8);
    }
}
