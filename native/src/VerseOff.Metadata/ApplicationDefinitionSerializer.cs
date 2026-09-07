using System.Globalization;
using System.Security;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using VerseOff.Domain;

namespace VerseOff.Metadata;

/// <summary>
/// Reference to an external FormXml file inside an offline package.
/// </summary>
public sealed record FormReferenceModel(
    Guid FormId,
    string Name,
    string TableLogicalName,
    int FormType,
    string RelativePath,
    bool IsDefault,
    string? Description,
    ComponentProvenance Provenance);

/// <summary>
/// Reference to an external FetchXml file inside an offline package.
/// </summary>
public sealed record ViewReferenceModel(
    Guid ViewId,
    string Name,
    string TableLogicalName,
    string RelativePath,
    bool IsDefault,
    string LayoutXml,
    IReadOnlyList<ViewColumnDefinition> Columns,
    ComponentProvenance Provenance);

/// <summary>
/// Root JSON model serialized into app.json.
/// </summary>
public sealed record ApplicationJsonModel(
    Guid AppModuleId,
    string UniqueName,
    string DisplayName,
    string SchemaVersion,
    string? Description,
    string SourceHash,
    IReadOnlyList<TableDefinition> Tables,
    IReadOnlyList<FormReferenceModel> Forms,
    IReadOnlyList<ViewReferenceModel> Views,
    IReadOnlyList<CommandDefinition> Commands,
    IReadOnlyList<WebResourceDefinition> WebResources,
    IReadOnlyList<CodeComponentDefinition> CodeComponents,
    IReadOnlyList<BusinessProcessFlowDefinition> BusinessProcessFlows,
    CompatibilityReport Compatibility);

/// <summary>
/// Serializes canonical ApplicationDefinition models into lightweight, distribution-ready offline packages.
/// </summary>
public sealed class ApplicationDefinitionSerializer
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters =
        {
            new JsonStringEnumConverter(),
        },
    };

    public static ApplicationDefinitionSerializer Instance { get; } = new();

    /// <summary>
    /// Serializes an ApplicationDefinition into a distribution-ready package folder.
    /// </summary>
    public static async Task<OfflinePackageManifest> SerializeToPackageAsync(
        ApplicationDefinition app,
        string outputDirectory,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(app);
        ArgumentException.ThrowIfNullOrWhiteSpace(outputDirectory);

        Directory.CreateDirectory(outputDirectory);
        var formsDir = Path.Combine(outputDirectory, "forms");
        var viewsDir = Path.Combine(outputDirectory, "views");
        Directory.CreateDirectory(formsDir);
        Directory.CreateDirectory(viewsDir);

        var fileEntries = new Dictionary<string, PackageFileEntry>(StringComparer.OrdinalIgnoreCase);

        // 1. Serialize Forms as discrete .formxml files
        var formReferences = new List<FormReferenceModel>();
        foreach (var form in app.Forms)
        {
            var fileName = $"{form.TableLogicalName}_{form.FormId:N}.formxml";
            var relativePath = $"forms/{fileName}";
            var fullPath = Path.Combine(outputDirectory, "forms", fileName);

            var formXml = RenderFormXml(form);
            var formBytes = Encoding.UTF8.GetBytes(formXml);
            await File.WriteAllBytesAsync(fullPath, formBytes, cancellationToken).ConfigureAwait(false);

            var checksum = ComputeSha256Hex(formBytes);
            fileEntries[relativePath] = new PackageFileEntry(checksum, formBytes.Length);

            formReferences.Add(new FormReferenceModel(
                form.FormId,
                form.Name,
                form.TableLogicalName,
                form.FormType,
                relativePath,
                form.IsActive,
                form.Description,
                form.Provenance));
        }

        // 2. Serialize Views as discrete .fetchxml files
        var viewReferences = new List<ViewReferenceModel>();
        foreach (var view in app.Views)
        {
            var fileName = $"{view.TableLogicalName}_{view.ViewId:N}.fetchxml";
            var relativePath = $"views/{fileName}";
            var fullPath = Path.Combine(outputDirectory, "views", fileName);

            var fetchXml = view.FetchXml;
            var fetchBytes = Encoding.UTF8.GetBytes(fetchXml);
            await File.WriteAllBytesAsync(fullPath, fetchBytes, cancellationToken).ConfigureAwait(false);

            var checksum = ComputeSha256Hex(fetchBytes);
            fileEntries[relativePath] = new PackageFileEntry(checksum, fetchBytes.Length);

            viewReferences.Add(new ViewReferenceModel(
                view.ViewId,
                view.Name,
                view.TableLogicalName,
                relativePath,
                view.IsDefault,
                view.LayoutXml,
                view.Columns,
                view.Provenance));
        }

        // 3. Serialize Navigation to navigation.json
        string? navigationPath = null;
        if (app.Navigation.Count > 0)
        {
            navigationPath = "navigation.json";
            var navJson = JsonSerializer.Serialize(app.Navigation, JsonOptions);
            var navBytes = Encoding.UTF8.GetBytes(navJson);
            var fullPath = Path.Combine(outputDirectory, navigationPath);
            await File.WriteAllBytesAsync(fullPath, navBytes, cancellationToken).ConfigureAwait(false);
            fileEntries[navigationPath] = new PackageFileEntry(ComputeSha256Hex(navBytes), navBytes.Length);
        }

        // 4. Serialize Offline Profile to offline-profile.json
        string? offlineProfilePath = null;
        if (app.OfflineProfile is not null)
        {
            offlineProfilePath = "offline-profile.json";
            var profileJson = JsonSerializer.Serialize(app.OfflineProfile, JsonOptions);
            var profileBytes = Encoding.UTF8.GetBytes(profileJson);
            var fullPath = Path.Combine(outputDirectory, offlineProfilePath);
            await File.WriteAllBytesAsync(fullPath, profileBytes, cancellationToken).ConfigureAwait(false);
            fileEntries[offlineProfilePath] = new PackageFileEntry(ComputeSha256Hex(profileBytes), profileBytes.Length);
        }

        // 5. Serialize app.json
        const string appPath = "app.json";
        var appModel = new ApplicationJsonModel(
            app.AppModuleId,
            app.UniqueName,
            app.DisplayName,
            app.SchemaVersion,
            app.Description,
            app.SourceHash,
            app.Tables,
            formReferences,
            viewReferences,
            app.Commands,
            app.WebResources,
            app.CodeComponents,
            app.BusinessProcessFlows,
            app.Compatibility);

        var appJson = JsonSerializer.Serialize(appModel, JsonOptions);
        var appBytes = Encoding.UTF8.GetBytes(appJson);
        await File.WriteAllBytesAsync(Path.Combine(outputDirectory, appPath), appBytes, cancellationToken).ConfigureAwait(false);
        fileEntries[appPath] = new PackageFileEntry(ComputeSha256Hex(appBytes), appBytes.Length);

        // 6. Generate and write manifest.json
        var totalSizeBytes = fileEntries.Values.Sum(e => e.SizeBytes);
        var rootChecksum = ComputePackageRootChecksum(fileEntries);

        var manifest = new OfflinePackageManifest(
            ManifestVersion: "1",
            SchemaVersion: app.SchemaVersion,
            AppId: app.AppModuleId,
            UniqueName: app.UniqueName,
            DisplayName: app.DisplayName,
            Version: "1.0.0.0",
            Checksum: rootChecksum,
            TotalSizeBytes: totalSizeBytes,
            CreatedAt: DateTimeOffset.UtcNow,
            SupportedD365Versions: ["9.0.0.2090", "10.0.0.2500"],
            ApplicationPath: appPath,
            NavigationPath: navigationPath,
            OfflineProfilePath: offlineProfilePath,
            Files: fileEntries);

        var manifestJson = JsonSerializer.Serialize(manifest, JsonOptions);
        await File.WriteAllTextAsync(Path.Combine(outputDirectory, "manifest.json"), manifestJson, Encoding.UTF8, cancellationToken).ConfigureAwait(false);

        return manifest;
    }

    /// <summary>
    /// Serializes an ApplicationDefinition directly to an in-memory JSON string.
    /// </summary>
    public static string ToJson(ApplicationDefinition app)
    {
        ArgumentNullException.ThrowIfNull(app);

        var formReferences = app.Forms.Select(f => new FormReferenceModel(
            f.FormId,
            f.Name,
            f.TableLogicalName,
            f.FormType,
            $"forms/{f.TableLogicalName}_{f.FormId:N}.formxml",
            f.IsActive,
            f.Description,
            f.Provenance)).ToList();

        var viewReferences = app.Views.Select(v => new ViewReferenceModel(
            v.ViewId,
            v.Name,
            v.TableLogicalName,
            $"views/{v.TableLogicalName}_{v.ViewId:N}.fetchxml",
            v.IsDefault,
            v.LayoutXml,
            v.Columns,
            v.Provenance)).ToList();

        var appModel = new ApplicationJsonModel(
            app.AppModuleId,
            app.UniqueName,
            app.DisplayName,
            app.SchemaVersion,
            app.Description,
            app.SourceHash,
            app.Tables,
            formReferences,
            viewReferences,
            app.Commands,
            app.WebResources,
            app.CodeComponents,
            app.BusinessProcessFlows,
            app.Compatibility);

        return JsonSerializer.Serialize(appModel, JsonOptions);
    }

    /// <summary>
    /// Renders a FormDefinition into a clean-room FormXml string conforming to FormXml.xsd.
    /// </summary>
    public static string RenderFormXml(FormDefinition form)
    {
        ArgumentNullException.ThrowIfNull(form);

        var sb = new StringBuilder();
        sb.AppendLine("""<form>""");

        if (form.Tabs.Count > 0)
        {
            sb.AppendLine("""  <tabs>""");
            foreach (var tab in form.Tabs)
            {
                var tabName = string.IsNullOrWhiteSpace(tab.Name) ? "general" : tab.Name;
                var tabLabel = string.IsNullOrWhiteSpace(tab.Label) ? "General" : tab.Label;
                sb.AppendLine(CultureInfo.InvariantCulture, $"""    <tab name="{EscapeXml(tabName)}" verticallayout="true" id="{Guid.NewGuid():D}">""");
                sb.AppendLine("""      <labels>""");
                sb.AppendLine(CultureInfo.InvariantCulture, $"""        <label description="{EscapeXml(tabLabel)}" languagecode="1033" />""");
                sb.AppendLine("""      </labels>""");
                sb.AppendLine("""      <columns>""");

                foreach (var col in tab.Columns)
                {
                    sb.AppendLine(CultureInfo.InvariantCulture, $"""        <column width="{col.WidthPercentage}%">""");
                    sb.AppendLine("""          <sections>""");

                    foreach (var sec in col.Sections)
                    {
                        var secName = string.IsNullOrWhiteSpace(sec.Name) ? "section" : sec.Name;
                        var secLabel = string.IsNullOrWhiteSpace(sec.Label) ? "Section" : sec.Label;
                        var showLabelStr = sec.ShowLabel ? "true" : "false";

                        sb.AppendLine(CultureInfo.InvariantCulture, $"""            <section name="{EscapeXml(secName)}" showlabel="{showLabelStr}" showbar="false" id="{Guid.NewGuid():D}">""");
                        sb.AppendLine("""              <labels>""");
                        sb.AppendLine(CultureInfo.InvariantCulture, $"""                <label description="{EscapeXml(secLabel)}" languagecode="1033" />""");
                        sb.AppendLine("""              </labels>""");
                        sb.AppendLine("""              <rows>""");

                        foreach (var row in sec.Rows)
                        {
                            sb.AppendLine("""                <row>""");
                            foreach (var cell in row.Cells)
                            {
                                sb.AppendLine(CultureInfo.InvariantCulture, $"""                  <cell id="{Guid.NewGuid():D}">""");
                                if (!string.IsNullOrWhiteSpace(cell.Label))
                                {
                                    sb.AppendLine("""                    <labels>""");
                                    sb.AppendLine(CultureInfo.InvariantCulture, $"""                      <label description="{EscapeXml(cell.Label)}" languagecode="1033" />""");
                                    sb.AppendLine("""                    </labels>""");
                                }

                                if (cell.Control is not null)
                                {
                                    var classId = !string.IsNullOrWhiteSpace(cell.Control.ClassId)
                                        ? cell.Control.ClassId
                                        : "{4273edbd-ac1d-40d3-9fb2-095c621b552d}";
                                    var dataFieldAttr = !string.IsNullOrWhiteSpace(cell.Control.DataFieldName)
                                        ? $" datafieldname=\"{EscapeXml(cell.Control.DataFieldName)}\""
                                        : string.Empty;

                                    sb.AppendLine(CultureInfo.InvariantCulture, $"""                    <control id="{EscapeXml(cell.Control.Id)}"{dataFieldAttr} classid="{classId}" />""");
                                }

                                sb.AppendLine("""                  </cell>""");
                            }
                            sb.AppendLine("""                </row>""");
                        }

                        sb.AppendLine("""              </rows>""");
                        sb.AppendLine("""            </section>""");
                    }

                    sb.AppendLine("""          </sections>""");
                    sb.AppendLine("""        </column>""");
                }

                sb.AppendLine("""      </columns>""");
                sb.AppendLine("""    </tab>""");
            }
            sb.AppendLine("""  </tabs>""");
        }

        if (form.HeaderControls.Count > 0)
        {
            sb.AppendLine("""  <header>""");
            sb.AppendLine("""    <rows>""");
            sb.AppendLine("""      <row>""");
            foreach (var ctrl in form.HeaderControls)
            {
                sb.AppendLine(CultureInfo.InvariantCulture, $"""        <cell id="{Guid.NewGuid():D}">""");
                var classId = !string.IsNullOrWhiteSpace(ctrl.ClassId)
                    ? ctrl.ClassId
                    : "{4273edbd-ac1d-40d3-9fb2-095c621b552d}";
                var dataFieldAttr = !string.IsNullOrWhiteSpace(ctrl.DataFieldName)
                    ? $" datafieldname=\"{EscapeXml(ctrl.DataFieldName)}\""
                    : string.Empty;
                sb.AppendLine(CultureInfo.InvariantCulture, $"""          <control id="{EscapeXml(ctrl.Id)}"{dataFieldAttr} classid="{classId}" />""");
                sb.AppendLine("""        </cell>""");
            }
            sb.AppendLine("""      </row>""");
            sb.AppendLine("""    </rows>""");
            sb.AppendLine("""  </header>""");
        }

        if (form.Events.Count > 0)
        {
            sb.AppendLine("""  <events>""");
            foreach (var evt in form.Events)
            {
                sb.AppendLine(CultureInfo.InvariantCulture, $"""    <event name="{EscapeXml(evt.EventName)}" application="false" active="{evt.IsEnabled.ToString().ToLowerInvariant()}">""");
                sb.AppendLine("""      <Handlers>""");
                var libAttr = !string.IsNullOrWhiteSpace(evt.LibraryName)
                    ? $" libraryName=\"{EscapeXml(evt.LibraryName)}\""
                    : string.Empty;
                sb.AppendLine(CultureInfo.InvariantCulture, $"""        <Handler functionName="{EscapeXml(evt.FunctionName)}"{libAttr} handlerUniqueId="{EscapeXml(evt.HandlerId)}" enabled="{evt.IsEnabled.ToString().ToLowerInvariant()}" passExecutionContext="{evt.PassExecutionContext.ToString().ToLowerInvariant()}" />""");
                sb.AppendLine("""      </Handlers>""");
                sb.AppendLine("""    </event>""");
            }
            sb.AppendLine("""  </events>""");
        }

        sb.AppendLine("""</form>""");
        return sb.ToString();
    }

    private static string ComputeSha256Hex(byte[] bytes)
    {
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static string ComputePackageRootChecksum(IReadOnlyDictionary<string, PackageFileEntry> fileEntries)
    {
        var sb = new StringBuilder();
        foreach (var key in fileEntries.Keys.OrderBy(k => k, StringComparer.OrdinalIgnoreCase))
        {
            sb.Append(key);
            sb.Append(':');
            sb.Append(fileEntries[key].Checksum);
            sb.Append(';');
        }

        return ComputeSha256Hex(Encoding.UTF8.GetBytes(sb.ToString()));
    }

    private static string EscapeXml(string value) =>
        SecurityElement.Escape(value) ?? string.Empty;
}
