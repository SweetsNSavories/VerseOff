using VerseOff.Domain;

namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class DataverseSolutionImporterTests
{
    [TestMethod]
    public async Task ImportsSelectedAppIntoCanonicalModel()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var appId = Guid.NewGuid();
            var formId = Guid.NewGuid();
            var webResourceId = Guid.NewGuid();
            await File.WriteAllTextAsync(
                Path.Combine(root, "customizations.xml"),
                BuildSolutionXml(appId, formId, webResourceId));
            Directory.CreateDirectory(Path.Combine(root, "WebResources"));
            await File.WriteAllTextAsync(
                Path.Combine(root, "WebResources", "contoso_form.js"),
                "function onLoad(executionContext) { return executionContext; }");
            var package = await SolutionPackage.LoadAsync(root);
            var policy = new SolutionImportPolicy(
                ["contoso_solution"],
                new Dictionary<string, ComponentOrigin>(
                    StringComparer.OrdinalIgnoreCase)
                {
                    ["contoso"] = ComponentOrigin.CustomerOwned,
                });
            var importer = new DataverseSolutionImporter(
                policy,
                SchemaValidationBehavior.ReportOnly);

            var result = importer.Import(package, appId);

            Assert.IsTrue(result.Succeeded);
            Assert.IsNotNull(result.Application);
            Assert.AreEqual("contoso_service", result.Application.UniqueName);
            Assert.HasCount(1, result.Application.Tables);
            Assert.HasCount(1, result.Application.Forms);
            Assert.HasCount(3, result.Application.Navigation);
            Assert.HasCount(1, result.Application.WebResources);
            Assert.HasCount(1, result.Application.Commands);
            Assert.AreEqual(
                ComponentDisposition.CustomerExecutable,
                CleanRoomComponentPolicy
                    .Evaluate(result.Application.Forms[0].Provenance)
                    .Disposition);
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task UnapprovedPublisherFailsClosed()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var appId = Guid.NewGuid();
            await File.WriteAllTextAsync(
                Path.Combine(root, "customizations.xml"),
                BuildSolutionXml(
                    appId,
                    Guid.NewGuid(),
                    Guid.NewGuid()));
            var package = await SolutionPackage.LoadAsync(root);
            var importer = new DataverseSolutionImporter(
                SolutionImportPolicy.FailClosed,
                SchemaValidationBehavior.ReportOnly);

            var result = importer.Import(package, appId);

            Assert.IsFalse(result.Succeeded);
            Assert.IsNotNull(result.Application);
            Assert.AreEqual(
                CompatibilityDisposition.Blocked,
                result.Application.Compatibility.Disposition);
            Assert.IsTrue(result.Issues.Any(issue =>
                issue.Code == "component-provenance-blocked"));
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    private static string BuildSolutionXml(
        Guid appId,
        Guid formId,
        Guid webResourceId) =>
        $$"""
        <ImportExportXml>
          <SolutionManifest>
            <UniqueName>contoso_solution</UniqueName>
            <Version>1.0.0.0</Version>
            <Managed>0</Managed>
            <Publisher><UniqueName>contoso</UniqueName></Publisher>
          </SolutionManifest>
          <AppModules>
            <AppModule>
              <AppModuleId>{{appId:D}}</AppModuleId>
              <UniqueName>contoso_service</UniqueName>
              <LocalizedNames>
                <LocalizedName description="Contoso Service" />
              </LocalizedNames>
              <AppModuleComponents>
                <AppModuleComponent type="1" schemaName="account" />
                <AppModuleComponent type="60" id="{{formId:D}}" />
              </AppModuleComponents>
              <SiteMapXml><![CDATA[
                <SiteMap>
                  <Area Id="Service">
                    <Titles><Title Description="Service" /></Titles>
                    <Group Id="Customers">
                      <Titles><Title Description="Customers" /></Titles>
                      <SubArea Id="Accounts" Entity="account">
                        <Titles><Title Description="Accounts" /></Titles>
                      </SubArea>
                    </Group>
                  </Area>
                </SiteMap>
              ]]></SiteMapXml>
            </AppModule>
          </AppModules>
          <Entities>
            <Entity>
              <Name LocalizedName="Account">account</Name>
              <EntityInfo>
                <entity Name="account"
                        EntitySetName="accounts"
                        PrimaryIdAttribute="accountid"
                        PrimaryNameAttribute="name">
                  <attributes>
                    <attribute PhysicalName="accountid">
                      <LogicalName>accountid</LogicalName>
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
              <FormXml>
                <forms type="main">
                  <systemform>
                    <formid>{{formId:D}}</formid>
                    <LocalizedNames>
                      <LocalizedName description="Account main" />
                    </LocalizedNames>
                    <form>
                      <events>
                        <event name="onload">
                          <Handlers>
                            <Handler functionName="Contoso.onLoad"
                              libraryName="$webresource:contoso_form.js"
                              passExecutionContext="true" />
                          </Handlers>
                        </event>
                      </events>
                      <tabs>
                        <tab name="general">
                          <columns>
                            <column width="100%">
                              <sections>
                                <section name="summary">
                                  <rows>
                                    <row>
                                      <cell>
                                        <control id="name"
                                          datafieldname="name"
                                          classid="{4273EDBD-AC1D-40d3-9FB2-095C621B552D}" />
                                      </cell>
                                    </row>
                                  </rows>
                                </section>
                              </sections>
                            </column>
                          </columns>
                        </tab>
                      </tabs>
                    </form>
                  </systemform>
                </forms>
              </FormXml>
            </Entity>
          </Entities>
          <WebResources>
            <WebResource>
              <WebResourceId>{{webResourceId:D}}</WebResourceId>
              <Name>contoso_form.js</Name>
              <WebResourceType>3</WebResourceType>
            </WebResource>
          </WebResources>
          <RibbonDiffXml>
            <CustomActions>
              <CustomAction Id="contoso.Action"
                            Location="Mscrm.Form.account.MainTab"
                            Sequence="10">
                <CommandUIDefinition>
                  <Button Id="contoso.Button"
                          Command="contoso.Command"
                          LabelText="Run offline" />
                </CommandUIDefinition>
              </CustomAction>
            </CustomActions>
            <CommandDefinitions>
              <CommandDefinition Id="contoso.Command">
                <Actions>
                  <JavaScriptFunction FunctionName="Contoso.run"
                                      Library="$webresource:contoso_form.js">
                    <CrmParameter Value="PrimaryControl" />
                  </JavaScriptFunction>
                </Actions>
              </CommandDefinition>
            </CommandDefinitions>
          </RibbonDiffXml>
        </ImportExportXml>
        """;

    private static string CreateTemporaryDirectory()
    {
        var path = Path.Combine(
            Path.GetTempPath(),
            $"VerseOff.Importer.Tests-{Guid.NewGuid():N}");
        Directory.CreateDirectory(path);
        return path;
    }
}
