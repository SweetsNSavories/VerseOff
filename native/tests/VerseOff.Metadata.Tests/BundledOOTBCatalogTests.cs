using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class BundledOOTBCatalogTests
{
    private readonly BundledOOTBCatalog catalog = BundledOOTBCatalog.Instance;

    [TestMethod]
    [DataRow("quote")]
    [DataRow("account")]
    [DataRow("contact")]
    [DataRow("opportunity")]
    [DataRow("lead")]
    [DataRow("incident")]
    public void TryGetFormForStandardTablesReturnsValidForm(string tableLogicalName)
    {
        var form = this.catalog.TryGetForm(tableLogicalName);

        Assert.IsNotNull(form);
        Assert.AreEqual(tableLogicalName, form.TableLogicalName);
        Assert.AreEqual(2, form.FormType); // Main form
        Assert.IsTrue(form.Provenance.OwnershipVerified);
        Assert.IsNotEmpty(form.Tabs);

        var generalTab = form.Tabs[0];
        Assert.IsNotEmpty(generalTab.Columns);

        var firstCol = generalTab.Columns[0];
        Assert.IsNotEmpty(firstCol.Sections);

        var firstSection = firstCol.Sections[0];
        Assert.IsNotEmpty(firstSection.Rows);

        var controls = firstSection.Rows
            .SelectMany(r => r.Cells)
            .Select(c => c.Control)
            .Where(c => c is not null)
            .ToList();

        Assert.IsNotEmpty(controls);
    }

    [TestMethod]
    public void TryGetFormWithKnownQuoteMainFormIdReturnsSpecificForm()
    {
        var form = this.catalog.TryGetForm(BundledOOTBCatalog.QuoteMainFormId, "quote");

        Assert.IsNotNull(form);
        Assert.AreEqual(BundledOOTBCatalog.QuoteMainFormId, form.FormId);
        Assert.AreEqual("quote", form.TableLogicalName);
    }

    [TestMethod]
    public void TryGetFormWithCustomGuidReturnsFormWithRequestedGuid()
    {
        var customGuid = Guid.NewGuid();
        var form = this.catalog.TryGetForm(customGuid, "quote");

        Assert.IsNotNull(form);
        Assert.AreEqual(customGuid, form.FormId);
        Assert.AreEqual("quote", form.TableLogicalName);
    }

    [TestMethod]
    public void TryGetFormForUnknownTableReturnsNull()
    {
        var form = this.catalog.TryGetForm("nonexistent_unknown_table_xyz");
        Assert.IsNull(form);
    }

    [TestMethod]
    [DataRow("quote")]
    [DataRow("account")]
    [DataRow("contact")]
    [DataRow("opportunity")]
    public void TryGetViewForStandardTablesReturnsValidActiveView(string tableLogicalName)
    {
        var view = this.catalog.TryGetView(tableLogicalName);

        Assert.IsNotNull(view);
        Assert.AreEqual(tableLogicalName, view.TableLogicalName);
        Assert.IsTrue(view.IsDefault);
        Assert.IsTrue(view.FetchXml.Trim().StartsWith("<fetch", StringComparison.OrdinalIgnoreCase));
        Assert.IsTrue(view.LayoutXml.Trim().StartsWith("<grid", StringComparison.OrdinalIgnoreCase));
        Assert.IsNotEmpty(view.Columns);
        Assert.IsTrue(view.Columns.Any(c => c.IsPrimary));
    }

    [TestMethod]
    public void TryGetViewForQuoteSupportsDraftAndWonViews()
    {
        var draftView = this.catalog.TryGetView(BundledOOTBCatalog.DraftQuotesViewId, "quote");
        Assert.IsNotNull(draftView);
        Assert.AreEqual("Draft Quotes", draftView.Name);
        Assert.IsFalse(draftView.IsDefault);
        Assert.Contains("statuscode", draftView.FetchXml);

        var wonView = this.catalog.TryGetView(BundledOOTBCatalog.WonQuotesViewId, "quote");
        Assert.IsNotNull(wonView);
        Assert.AreEqual("Won Quotes", wonView.Name);
        Assert.IsFalse(wonView.IsDefault);
        Assert.Contains("statecode", wonView.FetchXml);
    }

    [TestMethod]
    public void TryGetDashboardReturnsValidDashboard()
    {
        var salesDashboard = this.catalog.TryGetDashboard(BundledOOTBCatalog.SalesActivityDashboardId);
        Assert.IsNotNull(salesDashboard);
        Assert.AreEqual(BundledOOTBCatalog.SalesActivityDashboardId, salesDashboard.FormId);
        Assert.AreEqual("Sales Activity Dashboard", salesDashboard.Name);
        Assert.AreEqual(0, salesDashboard.FormType);

        var serviceDashboard = this.catalog.TryGetDashboard("Service");
        Assert.IsNotNull(serviceDashboard);
        Assert.AreEqual(BundledOOTBCatalog.ServiceActivityDashboardId, serviceDashboard.FormId);
        Assert.AreEqual("Customer Service Dashboard", serviceDashboard.Name);
    }

    [TestMethod]
    public void GenerateDefaultNavigationPreservesHierarchy()
    {
        var tableNames = new[] { "quote", "account", "contact" };
        var tables = tableNames
            .Select(name => StandardCdmTables.Definitions[name])
            .ToList();

        var navigation = this.catalog.GenerateDefaultNavigation(tableNames, tables);

        Assert.IsNotEmpty(navigation);
        Assert.IsTrue(navigation.Any(n => n.Kind == NavigationNodeKind.Area));
        Assert.IsTrue(navigation.Any(n => n.Kind == NavigationNodeKind.Group));
        Assert.IsTrue(navigation.Any(n => n.Kind == NavigationNodeKind.SubArea && n.TableLogicalName == "quote"));
        Assert.IsTrue(navigation.Any(n => n.Kind == NavigationNodeKind.SubArea && n.TableLogicalName == "account"));
        Assert.IsTrue(navigation.Any(n => n.Kind == NavigationNodeKind.SubArea && n.TableLogicalName == "contact"));
    }
}
