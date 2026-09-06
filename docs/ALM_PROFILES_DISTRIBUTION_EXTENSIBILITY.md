# VerseOff ALM, Profiles, Distribution, and Extensibility

## ALM principles

VerseOff uses Power Platform solutions as the application-definition control
plane and normal software delivery tooling for native binaries.

The two artifact families are intentionally separate:

1. Dataverse solution artifacts describe metadata, configuration, approved
   custom logic, profiles, and extension registrations.
2. Signed native packages contain the executable MAUI application.

This separation respects Power Platform ALM and avoids treating Dataverse as a
native application store.

The operational data topology is documented in
[Hybrid Data and Channel Integration](./HYBRID_DATA_AND_CHANNEL_INTEGRATION.md).
Licensed-user distribution and the supported no-client-AppId gateway mode are
documented in
[License-Bound Distribution and Authentication](./LICENSE_BOUND_DISTRIBUTION_AND_AUTHENTICATION.md).

## Source solution ingestion

### Development

- Build customizations in an unmanaged development solution.
- Use a dedicated publisher and stable prefixes.
- Keep solution source unpacked in version control.
- Validate supported XML against Microsoft XSDs.
- Build only from explicitly selected apps and approved solutions.
- Record component IDs, solution IDs, publisher IDs, layers, versions, and
  hashes.

### Test and production

- Release managed solutions.
- Use environment variables and connection references for environment-specific
  configuration.
- Run solution check and compatibility analysis before native generation.
- Prefer complete upgrades over long-lived patch stacks.
- Preserve rollback artifacts and the prior signed native package.

Power Platform applies managed and unmanaged solution layers at component
level. Forms, model-driven apps, and SiteMaps have merge behavior; many other
components use top-layer-wins behavior. VerseOff's effective metadata resolver
must reproduce the effective supported layer without executing proprietary
assets from lower layers.

## Component ownership classification

Every imported component is classified as:

| Class | Example | Treatment |
|---|---|---|
| Microsoft system | OOTB form script, internal PCF, `Mscrm.*` command | Ignore executable asset; use clean-room native behavior |
| Customer custom | Customer-authored JS, HTML, PCF, Ribbon handler | Interpret/transpile only after ownership is verified |
| Partner managed | ISV managed component | Do not transpile or execute; use a vendor-supported API/SDK/adapter or keep online-only |
| VerseOff extension | Native control, handler override, sync overlay | Apply through governed VerseOff solution layer |
| Unknown | Unresolved owner or layer | Fail closed |

Classification uses solution and publisher metadata, not filename heuristics.

## Standard offline profiles

VerseOff ingests the standard Dataverse mobile offline profile and profile
items as the baseline sync scope.

The profile supplies:

- included tables;
- relationships;
- FetchXML filters;
- user/team ownership scope;
- offline-enabled resources;
- initial synchronization boundaries.

VerseOff may add a BCDR overlay, but it must not replace the standard profile
with an opaque proprietary format.

### BCDR overlay

The overlay may define:

- emergency-only tables;
- maximum record counts;
- attachment limits;
- retention windows;
- conflict strategy;
- sync priority;
- Wi-Fi or charging requirements;
- read-only tables;
- forced security refresh age;
- feature availability while disconnected.

The effective profile is:

```text
standard offline profile
+ approved VerseOff BCDR overlay
- unsupported or unsafe capabilities
= deterministic native sync manifest
```

The result is versioned and hashed so the device can prove which scope it is
using.

## Dataverse solution delivered by VerseOff

A managed VerseOff solution can contain:

- configuration tables;
- app-to-profile bindings;
- release channels;
- native package version metadata;
- minimum supported client version;
- package URI and SHA-256 hash;
- extension registrations;
- handler override registrations;
- native component bindings;
- compatibility scan results;
- deployment status and audit records;
- optional PCF/maker surfaces used to administer VerseOff.

Solutions contain metadata and configuration data, not normal business data.
Business data remains in Dataverse tables and is synchronized according to the
profile.

## Should the native app be uploaded into Dataverse?

### Supported but not recommended as the primary channel

Dataverse file columns can store and transfer binary files, including chunked
upload/download. A signed MSIX, APK/AAB, IPA archive, or related package could
therefore be stored in a file column.

However, storing a package does not install, trust, update, or execute it.
Dataverse is not a replacement for a device-management or application-store
channel.

### Recommended pattern

Store this release record in Dataverse:

- product and channel;
- semantic version;
- platform and architecture;
- release status;
- download URI;
- SHA-256 hash;
- signing certificate thumbprint;
- minimum profile/schema version;
- minimum supported app version;
- release notes;
- rollout ring;
- published and retired timestamps.

Distribute the actual signed binary through:

- Microsoft Intune / Company Portal;
- MSIX and App Installer for Windows;
- SCCM where required;
- managed Google Play for Android;
- Apple Business Manager or enterprise distribution for iOS;
- the appropriate macOS enterprise channel.

Use a Dataverse file column only for an optional controlled package mirror or
air-gap handoff. Enforce signing, hash verification, size limits, retention,
malware scanning, and access auditing.

## Native build and release pipeline

1. Export/unpack the approved source solutions.
2. Validate solution and XML schemas.
3. Resolve effective layers.
4. Run ownership and proprietary-boundary checks.
5. Generate the canonical native app model.
6. Generate or update MAUI/XAML/C# artifacts.
7. Restore pinned dependencies.
8. Run unit, compatibility, migration, sync, and UI tests.
9. Produce an SBOM and vulnerability report.
10. Sign the native package.
11. Publish package metadata to Dataverse.
12. Publish the package to the enterprise distribution channel.
13. Deploy the managed VerseOff configuration solution.
14. Roll out through rings.
15. Monitor sync failures and compatibility telemetry.

## Custom UI components

### Native component registration

Each component registration includes:

- component unique name;
- owning solution and publisher;
- supported table/column/control types;
- native implementation type;
- settings schema;
- supported platforms;
- minimum VerseOff version;
- required capabilities;
- offline behavior;
- accessibility declaration;
- localization resources;
- signature and hash.

### Delivery forms

Preferred:

- declarative component descriptor plus built-in native factory;
- native component compiled into an app variant;
- customer-owned source component transpiled at build time.

Restricted:

- dynamically loaded assemblies on platforms that permit them.

Unsupported:

- opaque Microsoft system bundles;
- runtime download and execution of unsigned code;
- controls requiring undocumented Power Apps host internals;
- controls whose required cloud services are unavailable in BCDR mode.

## Additional and overridden event handlers

VerseOff supports solution-managed handler extensions without editing generated
code.

Suggested registration fields:

| Field | Purpose |
|---|---|
| App | Target model-driven app |
| Table | Target table |
| Form | Target form |
| Control/column | Optional target |
| Event | OnLoad, OnChange, OnSave, grid event, command, process event |
| Mode | Prepend, Append, Replace, Disable |
| Target handler ID | Required for Replace/Disable |
| Library/resource | Verified customer-authored script or native handler |
| Function/type | Entry point |
| Pass context | Execution-context contract |
| Parameters | Ordered typed parameters |
| Priority | Deterministic order |
| Condition | Supported declarative condition |
| Solution/publisher | Ownership and ALM |
| Version/hash/signature | Integrity |
| Platforms | Windows, Android, iOS, macOS |
| Enabled | Activation state |

### Precedence

1. Non-overridable security and data-integrity handlers.
2. Clean-room native OOTB behavior.
3. Effective customer source-solution handlers.
4. VerseOff `Prepend` handlers at the documented extension point.
5. Remaining source customer handlers.
6. VerseOff `Append` handlers.

`Replace` and `Disable` apply only to a named customer-authored handler.
Third-party/partner handlers are not transformed or overridden unless the
vendor exposes a supported configuration or adapter contract. Extensions never
suppress platform security, sync integrity, or clean-room OOTB safety behavior.

## Custom script compatibility gate

Before a solution can be activated, first verify that each script is
customer-authored. Then scan each approved script for:

- supported Client API calls;
- DOM dependencies;
- direct network calls;
- timers and unbounded recursion;
- `eval` or dynamic code generation;
- browser storage;
- unsupported promises or event timing;
- server-only actions;
- references to Microsoft internal libraries;
- unresolved web-resource dependencies.

Classification:

- `Native`: fully supported in Jint/native shim.
- `Transpilable`: build-time translation available.
- `Fallback`: safe native substitute exists.
- `OnlineOnly`: visible but disabled while offline.
- `Blocked`: violates ownership, security, or runtime rules.

Activation fails if a required handler is `Blocked` or if an `OnlineOnly`
handler is required for safe save behavior.

## Upgrade and rollback

- Never mutate a released native package.
- Use semantic versioning for native and solution artifacts.
- Keep the native schema version compatible with the profile and configuration
  solution.
- Stage Dataverse solution upgrades before activating a native release.
- Retain the previous managed solution and native package for rollback.
- Treat a breaking profile change as a coordinated app and solution release.
- Invalidate local metadata caches when the effective solution layer hash
  changes.

## Enterprise offline product benchmark

The goal is to reach the ALM, configuration, sync, and extensibility maturity
expected from an established enterprise offline platform:

- configuration-driven mobile apps;
- offline-first data access;
- background sync;
- conflict workbench;
- device-aware forms;
- native control extensibility;
- deployment profiles.

This is a product-capability benchmark, not a plan to integrate with or derive
technology from another offline product.

## Official references

- [ALM basics with Microsoft Power Platform](https://learn.microsoft.com/power-platform/alm/basics-alm)
- [Solution layers](https://learn.microsoft.com/power-platform/alm/solution-layers-alm)
- [Solutions overview](https://learn.microsoft.com/power-apps/maker/data-platform/solutions-overview)
- [Code components ALM](https://learn.microsoft.com/power-apps/developer/component-framework/code-components-alm)
- [Work with model-driven apps offline](https://learn.microsoft.com/power-apps/mobile/work-offline)
- [Use file column data in Dataverse](https://learn.microsoft.com/power-apps/developer/data-platform/file-column-data)
- [Publish a packaged .NET MAUI app for Windows](https://learn.microsoft.com/dotnet/maui/windows/deployment/publish-cli)
