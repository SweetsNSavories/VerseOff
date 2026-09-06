# VerseOff Native Microsoft Architecture

## Status

This is the canonical shipping architecture for VerseOff.

The existing Python, PyQt, Jinja, Chromium, and QWebChannel implementation is
an R&D prototype. It is useful for fixtures and compatibility tests, but it is
not the commercial runtime.

## Product intent

VerseOff is a commercial ISV platform for business continuity and disaster
recovery when Dynamics 365 or Dataverse connectivity is unavailable.

The runtime must:

- remain useful with no cloud, browser, Copilot, or AI dependency;
- render supported model-driven app behavior as native controls;
- use documented Microsoft schemas and APIs;
- execute customer-owned custom logic where safe;
- never depend on Microsoft proprietary client bundles;
- fail closed when metadata, security, or behavior cannot be reproduced
  safely.

## Technology stack

| Layer | Canonical technology |
|---|---|
| Language/runtime | C# on .NET 10 LTS |
| Cross-platform UI | .NET MAUI and XAML |
| Windows UI | WinUI 3 through .NET MAUI |
| Metadata validation | `System.Xml.Schema.XmlSchemaSet` |
| Serialization | `System.Text.Json` |
| Local database | `Microsoft.Data.Sqlite` through `Microsoft.EntityFrameworkCore.Sqlite` |
| Authentication | App-ID-free installed client through a customer BCDR gateway; the gateway owns the Dataverse workload identity |
| Dataverse access | `HttpClient` plus documented Dataverse Web API |
| Customer JavaScript | Jint in a constrained managed sandbox |
| Logging/telemetry | `Microsoft.Extensions.Logging`; local-first diagnostics |
| Packaging | MSIX, Android package, iOS archive, macOS package |

This is a Microsoft-centered application stack. Jint and the SQLite native
engine are audited open-source dependencies, not proprietary source. Their
licenses, versions, SBOM entries, and security advisories must be tracked.

Shared read projections use Microsoft SQL technology: SQL Server on-premises,
Azure SQL Database, or SQL database/Warehouse in Microsoft Fabric. Dataverse
remains the write authority. See
[Hybrid Data and Channel Integration](./HYBRID_DATA_AND_CHANNEL_INTEGRATION.md).
For regulated-bank approval gates, see
[Regulated Enterprise Acceptance](./REGULATED_ENTERPRISE_ACCEPTANCE.md).
For the no-separate-license and no-client-AppId options, see
[License-Bound Distribution and Authentication](./LICENSE_BOUND_DISTRIBUTION_AND_AUTHENTICATION.md).

## Normative metadata sources

VerseOff consumes published contracts, not decompiled implementation details:

- `CustomizationsSolution.xsd`
- `FormXml.xsd`
- `SiteMap.xsd` and `SiteMapType.xsd`
- `RibbonCore.xsd`, `RibbonTypes.xsd`, and `RibbonWSS.xsd`
- `Fetch.xsd`
- `ParameterXml.xsd`
- `VisualizationDataDescription.xsd`
- `isv.config.xsd`
- `reports.config.xsd`
- Microsoft Common Data Model schemas
- documented Dataverse Web API metadata
- official Microsoft Learn behavior
- official Microsoft samples

Every imported XML document is validated before it enters the canonical
application model. Unknown elements are retained for diagnostics, but they do
not silently enable behavior.

## Clean-room and intellectual-property boundary

### Microsoft OOTB and internal assets

Never decompile, transform, transpile, redistribute, or execute:

- `msdyn_*.js`
- `msdynce_*.js`
- internal `Mscrm.*` libraries
- Microsoft first-party compiled PCF bundles
- undocumented internal web resources
- proprietary Dynamics client assemblies or browser assets

Documented OOTB behavior is implemented independently in C# and XAML.

Examples:

- composite address and full-name controls;
- SLA timer;
- BPF stage bar;
- activity Timeline;
- lead qualification;
- opportunity close;
- case resolution;
- standard command and privilege behavior.

### Customer-owned and VerseOff-owned assets

Customer-authored logic may be imported only when all of the following are
true:

1. The component belongs to the customer or VerseOff.
2. The customer has the right to use and transform it.
3. Its solution component identity and source layer are recorded.
4. Its hash and version are recorded.
5. The runtime capability scan passes.
6. Unsupported behavior is reported before deployment.

Do not decide ownership from a filename prefix alone. Use solution ID,
publisher, component ownership, layer, managed state, and an explicit
allowlist.

Third-party/partner managed code is not transpiled or executed by VerseOff.
Third-party functionality is integrated only through a vendor-supported public
API, SDK, protocol, or vendor-provided native adapter. Otherwise it remains
online-only or unsupported.

## Script and HTML strategy

### JavaScript

Approved customer-authored JavaScript executes in Jint against a native C#
Client API shim.

The shim exposes supported documented contracts such as:

- `XrmExecutionContext`
- `XrmFormContext`
- `XrmAttribute`
- `XrmControl`
- `XrmNavigation`
- `XrmUtility`
- `XrmWebApi`
- form, attribute, grid, save, and process event arguments

The sandbox does not expose:

- CLR reflection;
- arbitrary file access;
- process execution;
- arbitrary network access;
- environment variables or secrets;
- Microsoft internal objects;
- a general browser DOM.

Execution has deterministic time, recursion, statement, and memory limits.

### HTML and CSS

Customer-owned HTML/CSS web resources are not used as the primary UI runtime.
They follow one of three paths:

1. Transpile the supported declarative subset to MAUI XAML and native
   view-model bindings.
2. Replace the resource with a customer-provided native VerseOff component.
3. Mark it unsupported with a visible fallback when behavior requires a DOM,
   browser plugin, cloud endpoint, or unsupported API.

Transpilation applies only to approved customer-owned assets. Microsoft system
HTML and internal resources are never inputs.

### PCF

PCF handling has four tiers:

1. Legacy documented control class IDs map to native controls.
2. Microsoft first-party `MscrmControls.*` behavior maps to clean-room native
   controls; Microsoft bundles are not executed.
3. Customer-owned scalar or dataset PCF can be transpiled or replaced through
   the VerseOff component contract when its manifest and rights are available.
4. Virtual React controls, unsupported required features, or opaque
   proprietary bundles fail closed with a native fallback.

## Native component model

The .NET solution should expose stable extension interfaces:

```csharp
public interface IVerseOffControlFactory
{
    bool CanCreate(ControlDefinition definition);
    View Create(ControlDefinition definition, FormRuntimeContext context);
}

public interface IVerseOffEventHandler
{
    ValueTask ExecuteAsync(
        XrmExecutionContext executionContext,
        CancellationToken cancellationToken);
}

public interface IVerseOffCommandHandler
{
    bool CanExecute(CommandContext context);
    ValueTask ExecuteAsync(
        CommandContext context,
        CancellationToken cancellationToken);
}

public interface IVerseOffSyncProfileProvider
{
    SyncProfile Build(ProfileBuildContext context);
}
```

Cross-platform extensions should be declarative or compiled into the app
variant. Runtime assembly loading is not a portable assumption, particularly
for iOS AOT deployment.

## Canonical runtime pipeline

1. Import a selected app and approved solution components.
2. Validate XML using published XSDs.
3. Resolve solution layers and component ownership.
4. Build a canonical app model.
5. Expand bounded table, relationship, view, form, Timeline, and resource
   dependencies.
6. Import the standard mobile offline profile.
7. Generate EF Core SQLite schema and migrations.
8. Generate native MAUI pages, controls, commands, and view models.
9. Register clean-room OOTB handlers.
10. Register approved customer handlers in Jint.
11. Apply explicit VerseOff extension layers.
12. Compile, sign, test, package, and publish.

## Event handler model

Supported events use the documented Dataverse contracts:

- form `OnLoad`, Loaded, data `OnLoad`, `OnSave`, and `PostSave`;
- attribute `OnChange`;
- subgrid `OnLoad`;
- editable-grid `OnChange`, `OnRecordSelect`, and `OnSave`;
- lookup, tab, process, and control events where the native control supports
  them;
- Ribbon/command JavaScript actions with documented parameter binding.

Rules:

- configured order is preserved;
- code-added handlers append to the pipeline;
- depth and shared variables are per event pipeline;
- `preventDefault` and pre-stage cancellation are honored synchronously;
- supported async handlers are awaited with bounded timeouts;
- unsupported server calls never return success-shaped responses.

## Additional and overridden behavior

VerseOff supports additive or replacement behavior through a governed
extension layer:

- `Append`: run after source handlers;
- `Prepend`: run before source customer handlers;
- `Replace`: replace a specifically identified customer handler;
- `Disable`: disable a specifically identified customer handler;
- `NativeCommandOverride`: replace a documented native command at an approved
  extension point.

Platform safety, security, sync integrity, and clean-room OOTB handlers cannot
be disabled by a tenant extension.

Every override records:

- target app/table/form/control/event;
- original handler identity;
- solution and publisher;
- priority and mode;
- function or native component identity;
- version, signature, and hash;
- compatibility result;
- activation and rollback state.

## Enterprise offline capability benchmark

Resco was mentioned only as an example of the maturity expected from an
enterprise offline product. VerseOff has no technical dependency on Resco and
does not use Resco code, metadata, packages, or APIs.

The benchmark is the level of capability:

- offline-first UX;
- configurable sync scope;
- background synchronization;
- conflict visibility;
- native mobile forms;
- extensible controls;
- enterprise packaging.

These capabilities are designed independently from VerseOff requirements and
Microsoft's documented platform contracts.

## Security model

- Authenticate with MSAL.NET.
- Encrypt local data and secrets using platform-protected key material.
- Preserve Dataverse row, field, ownership, team, and privilege snapshots.
- Deny access when the effective security snapshot is absent or stale.
- Sign native packages and extension manifests.
- Hash all imported customer resources.
- Produce an SBOM.
- Keep diagnostic logs local by default.
- Exclude Copilot and cloud AI from the BCDR runtime.

## Migration from the prototype

| Prototype asset | Native destination |
|---|---|
| `form_parser.py` | `VerseOff.Metadata.FormXml` |
| `metadata_fetcher.py` | `VerseOff.Dataverse.Metadata` |
| `schema_builder.py` | `VerseOff.Storage.Migrations` |
| `verseoff_bridge.js` tests | `VerseOff.ClientApi` contract tests |
| `xrm_form_renderer.j2` behavior | MAUI pages, controls, and view models |
| `timeline_metadata.py` | `VerseOff.Controls.Timeline` |
| Python sync engine | `VerseOff.Sync` background services |
| Node/Chromium fixtures | Jint and MAUI integration fixtures |

Port behavior and tests, not the runtime architecture.

## Official references

- [ALM basics with Microsoft Power Platform](https://learn.microsoft.com/power-platform/alm/basics-alm)
- [Solution layers](https://learn.microsoft.com/power-platform/alm/solution-layers-alm)
- [Power Apps component framework](https://learn.microsoft.com/power-apps/developer/component-framework/overview)
- [Code components ALM](https://learn.microsoft.com/power-apps/developer/component-framework/code-components-alm)
- [Client API reference](https://learn.microsoft.com/power-apps/developer/model-driven-apps/clientapi/reference)
- [Work with model-driven apps offline](https://learn.microsoft.com/power-apps/mobile/work-offline)
- [Publish a packaged .NET MAUI app for Windows](https://learn.microsoft.com/dotnet/maui/windows/deployment/publish-cli)
- [Hybrid Data and Channel Integration](./HYBRID_DATA_AND_CHANNEL_INTEGRATION.md)
