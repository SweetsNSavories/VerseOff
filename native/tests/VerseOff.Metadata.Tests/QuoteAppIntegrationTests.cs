using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class QuoteAppIntegrationTests
{
    private static readonly SolutionImportPolicy PermissivePolicy = new(
        ["contoso_quote_management"],
        new Dictionary<string, ComponentOrigin>(StringComparer.OrdinalIgnoreCase)
        {
            ["contoso"] = ComponentOrigin.CustomerOwned,
        });

    [TestMethod]
    public async Task ImportQuoteAppDeltaSolutionResolvesAllOOTBComponents()
    {
        var root = Path.Combine(Path.GetTempPath(), "verseoff_quote_test_" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(root);

        try
        {
            var appId = Guid.NewGuid();
            var quoteFormId = BundledOOTBCatalog.QuoteMainFormId;

            // Delta solution XML where tables and forms are referenced by the app module,
            // but the solution package does not contain custom form XML (it references standard OOTB forms/views)
            var solutionXml = $$"""
            <ImportExportXml>
              <SolutionManifest>
                <UniqueName>contoso_quote_management</UniqueName>
                <Version>1.0.0.0</Version>
                <Managed>0</Managed>
                <Publisher><UniqueName>contoso</UniqueName></Publisher>
              </SolutionManifest>
              <AppModules>
                <AppModule>
                  <AppModuleId>{{appId:D}}</AppModuleId>
                  <UniqueName>contoso_quotes</UniqueName>
                  <LocalizedNames>
                    <LocalizedName description="Contoso Quote Manager" />
                  </LocalizedNames>
                  <AppModuleComponents>
                    <AppModuleComponent type="1" schemaName="quote" />
                    <AppModuleComponent type="1" schemaName="account" />
                    <AppModuleComponent type="1" schemaName="contact" />
                    <AppModuleComponent type="60" id="{{quoteFormId:D}}" />
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
                        <attribute PhysicalName="statecode">
                          <LogicalName>statecode</LogicalName>
                          <Type>State</Type>
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

            Assert.IsTrue(result.Succeeded, $"Import should succeed. Issues: {string.Join("; ", result.Issues.Select(i => $"[{i.Severity}] {i.Code}: {i.Message} ({i.ComponentId})"))}");
            Assert.IsNotNull(result.Application);
            Assert.AreEqual("contoso_quotes", result.Application.UniqueName);
            Assert.IsTrue(result.Application.Compatibility.CanActivate);
            Assert.AreEqual(CompatibilityDisposition.Fallback, result.Application.Compatibility.Disposition);

            // Verify tables are imported/resolved
            Assert.IsTrue(result.Application.Tables.Any(t => t.LogicalName == "quote"));
            Assert.IsTrue(result.Application.Tables.Any(t => t.LogicalName == "account"));
            Assert.IsTrue(result.Application.Tables.Any(t => t.LogicalName == "contact"));

            // Verify Quote Main Form was resolved by BundledOOTBCatalog
            var quoteForm = result.Application.Forms.FirstOrDefault(f => f.TableLogicalName == "quote");
            Assert.IsNotNull(quoteForm, "Quote form should be resolved from BundledOOTBCatalog");
            Assert.AreEqual(quoteFormId, quoteForm.FormId);
            Assert.IsNotEmpty(quoteForm.Tabs);

            // Verify controls in the quote form
            var allControls = quoteForm.Tabs
                .SelectMany(t => t.Columns)
                .SelectMany(c => c.Sections)
                .SelectMany(s => s.Rows)
                .SelectMany(r => r.Cells)
                .Select(c => c.Control)
                .Where(c => c is not null)
                .ToList();

            Assert.IsTrue(allControls.Any(c => c!.DataFieldName == "name"), "Form must have name field");
            Assert.IsTrue(allControls.Any(c => c!.DataFieldName == "customerid"), "Form must have customerid field");
            Assert.IsTrue(allControls.Any(c => c!.DataFieldName == "totalamount"), "Form must have totalamount field");

            // Verify Views were resolved by BundledOOTBCatalog
            var quoteViews = result.Application.Views.Where(v => v.TableLogicalName == "quote").ToList();
            Assert.IsNotEmpty(quoteViews, "Quote view should be resolved from BundledOOTBCatalog");
            var defaultQuoteView = quoteViews.FirstOrDefault(v => v.IsDefault);
            Assert.IsNotNull(defaultQuoteView, "Default quote view must exist");
            Assert.Contains("quote", defaultQuoteView.FetchXml);
            Assert.IsNotEmpty(defaultQuoteView.Columns);

            // Verify Navigation
            Assert.IsNotEmpty(result.Application.Navigation);
            Assert.IsTrue(result.Application.Navigation.Any(n => n.TableLogicalName == "quote"));
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public void AnalyzeStaticAndDomainRequirementsForQuoteAppAppliesDomainConfig()
    {
        var appId = Guid.NewGuid();
        var quoteFormId = BundledOOTBCatalog.QuoteMainFormId;

        var descriptor = new ModelDrivenAppDescriptor(
            appId,
            "contoso_quotes",
            "Contoso Quotes",
            "customizations.xml",
            new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "quote", "account", "contact" },
            new HashSet<Guid> { quoteFormId });

        // Tier 1: Static analysis
        var staticResult = AppModuleRequirementsAnalyzer.AnalyzeStatic(descriptor);
        Assert.IsNotNull(staticResult);
        Assert.Contains("quote", staticResult.RequiredTables);
        Assert.Contains("account", staticResult.RequiredTables);
        Assert.Contains("contact", staticResult.RequiredTables);
        Assert.Contains(quoteFormId, staticResult.RequiredFormIds);

        // Tier 3: Domain requirements integration
        var yamlConfig = """
        appName: "Quote Management"
        version: "1.0.0"
        forceIncludeTables:
          - quote
          - account
          - contact
          - quotedetail
          - pricelevel
        forceIncludeForms:
          - "d8c368d1-d2c0-43e9-9a25-78e8b2bfdf2a"
        forceIncludeViews:
          - "00000000-0000-0000-00aa-000010001004"
          - "00000000-0000-0000-00aa-000010001005"
        offlineSyncFilterProfile: "quote_offline_active_profile"
        conflictResolutionStrategy: "ServerWins"
        offlineTablePartitionFilter:
          quote: "statecode eq 0"
        """;

        var domainReqs = DomainRequirementsLoader.LoadFromString(yamlConfig);
        Assert.IsNotNull(domainReqs);
        Assert.AreEqual("Quote Management", domainReqs.AppName);
        Assert.HasCount(5, domainReqs.ForceIncludeTables);
        Assert.AreEqual("ServerWins", domainReqs.ConflictResolutionStrategy);

        // Combined requirements
        var combinedResult = AppModuleRequirementsAnalyzer.AnalyzeWithDomainRequirements(
            descriptor,
            domainReqs);

        Assert.IsNotNull(combinedResult);
        Assert.Contains("quote", combinedResult.RequiredTables);
        Assert.Contains("quotedetail", combinedResult.RequiredTables);
        Assert.Contains("pricelevel", combinedResult.RequiredTables);
        Assert.Contains(quoteFormId, combinedResult.RequiredFormIds);
        Assert.Contains(BundledOOTBCatalog.ActiveQuotesViewId, combinedResult.RequiredViewIds);
        Assert.Contains(BundledOOTBCatalog.DraftQuotesViewId, combinedResult.RequiredViewIds);
    }
}
