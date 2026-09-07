namespace VerseOff.Metadata.Tests;

[TestClass]
public sealed class SolutionDiscoveryServiceTests
{
    [TestMethod]
    public async Task DiscoversAppsAndTheirDeclaredComponents()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            var appId = Guid.NewGuid();
            var formId = Guid.NewGuid();
            await File.WriteAllTextAsync(
                Path.Combine(root, "customizations.xml"),
                $$"""
                <ImportExportXml>
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
                    </AppModule>
                  </AppModules>
                </ImportExportXml>
                """);
            var package = await SolutionPackage.LoadAsync(root);

            var result = SolutionDiscoveryService.Discover(package);

            Assert.HasCount(1, result.Applications);
            Assert.IsEmpty(result.Issues);
            var app = result.Applications[0];
            Assert.AreEqual(appId, app.AppModuleId);
            Assert.AreEqual("contoso_service", app.UniqueName);
            Assert.AreEqual("Contoso Service", app.DisplayName);
            CollectionAssert.Contains(
                app.TableLogicalNames.ToArray(),
                "account");
            CollectionAssert.Contains(app.FormIds.ToArray(), formId);
            Assert.IsNull(result.Identity);
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task DiscoversAppModuleWithoutExplicitIdDeterministically()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            await File.WriteAllTextAsync(
                Path.Combine(root, "customizations.xml"),
                """
                <ImportExportXml>
                  <AppModules>
                    <AppModule>
                      <UniqueName>msauto_AutoHub</UniqueName>
                      <LocalizedNames>
                        <LocalizedName description="Auto Hub" />
                      </LocalizedNames>
                      <AppModuleComponents>
                        <AppModuleComponent type="1" schemaName="account" />
                      </AppModuleComponents>
                    </AppModule>
                  </AppModules>
                </ImportExportXml>
                """);
            var package = await SolutionPackage.LoadAsync(root);

            var result = SolutionDiscoveryService.Discover(package);

            Assert.HasCount(1, result.Applications);
            Assert.IsEmpty(result.Issues);
            var app = result.Applications[0];
            Assert.AreNotEqual(Guid.Empty, app.AppModuleId);
            Assert.AreEqual("msauto_AutoHub", app.UniqueName);
            Assert.AreEqual("Auto Hub", app.DisplayName);
            CollectionAssert.Contains(app.TableLogicalNames.ToArray(), "account");

            var expectedId = SolutionDiscoveryService.DeterministicGuid("msauto_AutoHub");
            Assert.AreEqual(expectedId, app.AppModuleId);
        }
        finally
        {
            Directory.Delete(root, recursive: true);
        }
    }

    [TestMethod]
    public async Task MissingApplicationIsReported()
    {
        var root = CreateTemporaryDirectory();
        try
        {
            await File.WriteAllTextAsync(
                Path.Combine(root, "customizations.xml"),
                "<ImportExportXml />");
            var package = await SolutionPackage.LoadAsync(root);

            var result = SolutionDiscoveryService.Discover(package);

            Assert.IsEmpty(result.Applications);
            Assert.HasCount(1, result.Issues);
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
            $"VerseOff.Discovery.Tests-{Guid.NewGuid():N}");
        Directory.CreateDirectory(path);
        return path;
    }
}
