using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class DomainRequirementsLoaderTests
{
    [TestMethod]
    public void LoadFromStringValidYamlParsesCorrectly()
    {
        var formId = Guid.NewGuid();
        var viewId = Guid.NewGuid();

        var yaml = $"""
        forceIncludeTables:
          - quote
          - account
          - contact
        forceIncludeForms:
          - "{formId:D}"
        forceIncludeViews:
          - "{viewId:D}"
        """;

        var config = DomainRequirementsLoader.LoadFromString(yaml);

        Assert.IsTrue(config.HasRequirements);
        Assert.HasCount(3, config.ForceIncludeTables);
        Assert.Contains("quote", config.ForceIncludeTables);
        Assert.Contains("account", config.ForceIncludeTables);
        Assert.Contains("contact", config.ForceIncludeTables);
        Assert.Contains(formId, config.ForceIncludeFormIds);
        Assert.Contains(viewId, config.ForceIncludeViewIds);
    }

    [TestMethod]
    public void LoadFromStringEmptyOrInvalidYamlReturnsEmptyConfig()
    {
        var emptyConfig = DomainRequirementsLoader.LoadFromString("");
        Assert.IsFalse(emptyConfig.HasRequirements);

        var whitespaceConfig = DomainRequirementsLoader.LoadFromString("   ");
        Assert.IsFalse(whitespaceConfig.HasRequirements);
    }

    [TestMethod]
    public void AppInsightsUsageAnalyzerBuildKqlQueryGeneratesExpectedKql()
    {
        var appId = Guid.NewGuid();
        var start = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = new DateTime(2026, 1, 31, 0, 0, 0, DateTimeKind.Utc);

        var kql = AppInsightsUsageAnalyzer.BuildKqlQuery(appId, start, end);

        Assert.Contains("customEvents", kql);
        Assert.Contains("pageViews", kql);
        Assert.Contains(appId.ToString("D"), kql);
        Assert.Contains("Entity", kql);
        Assert.Contains("FormId", kql);
        Assert.Contains("ViewId", kql);
    }

    [TestMethod]
    public void AppInsightsUsageAnalyzerParseQueryResultParsesLogAnalyticsJson()
    {
        var formId = Guid.NewGuid();
        var viewId = Guid.NewGuid();

        var json = $$"""
        {
          "tables": [
            {
              "name": "PrimaryResult",
              "columns": [
                { "name": "Entity", "type": "string" },
                { "name": "FormId", "type": "string" },
                { "name": "ViewId", "type": "string" },
                { "name": "EventCount", "type": "long" }
              ],
              "rows": [
                [ "quote", "{{formId:D}}", "{{viewId:D}}", 42 ],
                [ "account", null, null, 15 ]
              ]
            }
          ]
        }
        """;

        var start = DateTime.UtcNow.AddDays(-30);
        var end = DateTime.UtcNow;

        var report = AppInsightsUsageAnalyzer.ParseQueryResult(json, start, end);

        Assert.IsTrue(report.HasData);
        Assert.HasCount(2, report.AccessedTables);
        Assert.Contains("quote", report.AccessedTables);
        Assert.Contains("account", report.AccessedTables);
        Assert.Contains(formId, report.AccessedFormIds);
        Assert.Contains(viewId, report.AccessedViewIds);
    }

    [TestMethod]
    public async Task AppInsightsUsageAnalyzerAnalyzeAppUsageAsyncExecutesQuery()
    {
        var appId = Guid.NewGuid();
        var formId = Guid.NewGuid();

        var dummyJson = $$"""
        {
          "tables": [
            {
              "name": "PrimaryResult",
              "columns": [
                { "name": "Entity", "type": "string" },
                { "name": "FormId", "type": "string" },
                { "name": "ViewId", "type": "string" }
              ],
              "rows": [
                [ "quote", "{{formId:D}}", null ]
              ]
            }
          ]
        }
        """;

        string? capturedKql = null;
        var analyzer = new AppInsightsUsageAnalyzer(
            instrumentationKey: "test-key",
            queryExecutor: kql =>
            {
                capturedKql = kql;
                return Task.FromResult(dummyJson);
            });

        var report = await analyzer.AnalyzeAppUsageAsync(appId);

        Assert.IsNotNull(report);
        Assert.IsTrue(report.HasData);
        Assert.Contains("quote", report.AccessedTables);
        Assert.Contains(formId, report.AccessedFormIds);
        Assert.IsNotNull(capturedKql);
        Assert.Contains(appId.ToString("D"), capturedKql);
    }
}
