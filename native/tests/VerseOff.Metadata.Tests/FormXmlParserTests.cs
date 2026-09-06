using System.Xml;
using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class FormXmlParserTests
{
    private static readonly ComponentProvenance Provenance = new(
        "form-id",
        "sample_form",
        ComponentOrigin.CustomerOwned,
        "solution-id",
        "publisher-id",
        new string('a', 64),
        IsManaged: false,
        OwnershipVerified: true);

    private static readonly ColumnDefinition[] Columns =
    [
        new(
            "name",
            "String",
            CanRead: true,
            CanCreate: true,
            CanUpdate: true,
            IsSecured: false),
        new(
            "description",
            "Memo",
            CanRead: true,
            CanCreate: true,
            CanUpdate: true,
            IsSecured: false),
    ];

    [TestMethod]
    public void PreservesLayoutVisibilityEventsAndCustomControlBinding()
    {
        var document = SecureXml.Parse("""
            <form>
              <formparameters>
                <querystringparameter name="new_mode" type="SafeString" />
              </formparameters>
              <events>
                <event name="onload" active="true">
                  <Handlers>
                    <Handler functionName="Sample.load"
                             libraryName="$webresource:new_events.js"
                             passExecutionContext="true"
                             parameters="&quot;first, value&quot;, second" />
                  </Handlers>
                </event>
              </events>
              <controlDescriptions>
                <controlDescription forControl="name">
                  <customControl name="Contoso.Controls.Input" formFactor="0" />
                </controlDescription>
              </controlDescriptions>
              <tabs>
                <tab name="summary">
                  <labels><label description="Summary" /></labels>
                  <columns>
                    <column width="33%">
                      <sections>
                        <section name="left" showlabel="true">
                          <labels><label description="Left details" /></labels>
                          <rows>
                            <row>
                              <cell id="name-cell" colspan="2" rowspan="1">
                                <labels><label description="Name" /></labels>
                                <control id="name" datafieldname="name"
                                  classid="{4273EDBD-AC1D-40d3-9FB2-095C621B552D}" />
                              </cell>
                            </row>
                          </rows>
                        </section>
                      </sections>
                    </column>
                    <column width="67%">
                      <sections>
                        <section name="hidden" visible="false">
                          <rows>
                            <row><cell><control id="description"
                              datafieldname="description" /></cell></row>
                          </rows>
                        </section>
                      </sections>
                    </column>
                  </columns>
                </tab>
              </tabs>
            </form>
            """);

        var form = FormXmlParser.Parse(
            document,
            Guid.NewGuid(),
            "Main",
            "account",
            2,
            Provenance,
            Columns);

        Assert.HasCount(1, form.Tabs);
        Assert.AreEqual("Summary", form.Tabs[0].Label);
        Assert.AreEqual(33, form.Tabs[0].Columns[0].WidthPercentage);
        Assert.AreEqual(67, form.Tabs[0].Columns[1].WidthPercentage);
        Assert.IsFalse(form.Tabs[0].Columns[1].Sections[0].IsVisible);

        var cell = form.Tabs[0].Columns[0].Sections[0].Rows[0].Cells[0];
        Assert.AreEqual(2, cell.ColumnSpan);
        Assert.IsNotNull(cell.Control);
        Assert.AreEqual(FormControlKind.CustomControl, cell.Control.Kind);
        Assert.AreEqual("Contoso.Controls.Input", cell.Control.CodeComponentName);

        Assert.HasCount(1, form.Events);
        Assert.AreEqual("new_events.js", form.Events[0].LibraryName);
        Assert.HasCount(2, form.Events[0].Parameters);
        Assert.AreEqual("first, value", form.Events[0].Parameters[0].Value);
        Assert.HasCount(1, form.Parameters);
    }

    [TestMethod]
    public void SecureParserRejectsDocumentTypeDefinitions()
    {
        const string xml =
            "<!DOCTYPE form [<!ENTITY xxe SYSTEM \"file:///secret\">]>"
            + "<form>&xxe;</form>";

        Assert.ThrowsExactly<XmlException>(() => SecureXml.Parse(xml));
    }

    [TestMethod]
    public void TimelinePreservesConfigurationAndExpandsDependencies()
    {
        var cardFormId = Guid.NewGuid();
        var document = SecureXml.Parse($$$"""
            <form>
              <tabs><tab name="timeline"><columns><column><sections>
                <section name="activity"><rows><row><cell>
                  <control id="notescontrol"
                    classid="{06375649-C143-495E-A496-C962E5B4488E}">
                    <parameters>
                      <UClientUniqueName>Timeline</UClientUniqueName>
                      <UClientModules>Activities,Notes,Posts</UClientModules>
                      <UClientRecordPerPage>60</UClientRecordPerPage>
                      <UClientActivities>email,task</UClientActivities>
                      <UClientShowFilterPane>true</UClientShowFilterPane>
                      <UClientUnknownFutureSetting>preserve</UClientUnknownFutureSetting>
                      <UClientActivityCardMap>email,4202,{{{cardFormId:D}}}</UClientActivityCardMap>
                      <UClientActivitiesConfigurationJSON><![CDATA[
                        {"email":{"showStatus":true,"canCreate":true,
                         "createUsing":"quickCreate","openUsing":"default"}}
                      ]]></UClientActivitiesConfigurationJSON>
                      <UClientRecordSourcesJSON><![CDATA[
                        [{"name":"External","webResourceName":"contoso_timeline.js",
                          "constructorName":"Contoso.Source"}]
                      ]]></UClientRecordSourcesJSON>
                    </parameters>
                  </control>
                </cell></row></rows></section>
              </sections></column></columns></tab></tabs>
            </form>
            """);

        var form = FormXmlParser.Parse(
            document,
            Guid.NewGuid(),
            "Main",
            "account",
            2,
            Provenance,
            Columns);

        var timeline = form.Tabs[0].Columns[0].Sections[0]
            .Rows[0].Cells[0].Control?.Timeline;
        Assert.IsNotNull(timeline);
        Assert.AreEqual(50, timeline.RecordsPerPage);
        var modules = timeline.EnabledModules.ToArray();
        CollectionAssert.Contains(modules, TimelineModule.Activities);
        CollectionAssert.Contains(modules, TimelineModule.Notes);
        CollectionAssert.Contains(modules, TimelineModule.Posts);
        Assert.AreEqual(
            "preserve",
            timeline.RawParameters["UClientUnknownFutureSetting"]);
        Assert.AreEqual(cardFormId, timeline.CardForms[0].CardFormId);
        Assert.AreEqual(
            "contoso_timeline.js",
            timeline.RecordSources[0].WebResourceName);
        var dependencies = TimelineDependencyPlanner.BuildRequiredTables(
            timeline);
        CollectionAssert.Contains(dependencies.ToArray(), "activitypointer");
        CollectionAssert.Contains(dependencies.ToArray(), "activityparty");
        CollectionAssert.Contains(dependencies.ToArray(), "annotation");
        CollectionAssert.Contains(dependencies.ToArray(), "post");
        CollectionAssert.Contains(dependencies.ToArray(), "email");
        CollectionAssert.Contains(dependencies.ToArray(), "task");
    }
}
