# VerseOff Session Worklog: Metadata and Script Runtime Prototype

## Purpose

This document records the intensive implementation session that preceded the
native Microsoft-stack pivot. It distinguishes reusable research and test
assets from prototype code that is not part of the shipping architecture.

The canonical product direction is documented in:

- [Native Microsoft Architecture](./NATIVE_MICROSOFT_ARCHITECTURE.md)
- [ALM, Profiles, Distribution, and Extensibility](./ALM_PROFILES_DISTRIBUTION_EXTENSIBILITY.md)

## What was investigated

The session tested whether a generated offline client could reproduce a
model-driven app from Dataverse metadata and run form, grid, Ribbon, HTML web
resource, and PCF behavior.

The investigation covered:

1. Generic FormXml parsing rather than form-specific rendering.
2. Ribbon command/action parsing and parameter binding.
3. Form and editable-grid event contexts.
4. User, organization, app, and form context injection.
5. Packaging referenced web resources and custom controls.
6. SQLite schema and relationship metadata.
7. Activity Timeline metadata and Client API behavior.
8. Parallel metadata and resource acquisition.
9. Explicit unsupported-operation gates.
10. End-to-end tests in JavaScript and Chromium.

## Prototype work completed

### FormXml and metadata

- Form tabs, columns, sections, rows, cells, labels, visibility, column span,
  row span, and raw control XML were preserved.
- Form libraries and registered event handlers were extracted.
- Main, Quick Create, Quick View, and Card form types were retained.
- Subgrid targets, lookups, relationships, Timeline definitions, Card forms,
  and transitive dependencies were investigated.
- Entity and relationship metadata were persisted to SQLite.

Primary prototype files:

- `VerseOff/form_parser.py`
- `VerseOff/metadata_fetcher.py`
- `VerseOff/schema_builder.py`
- `VerseOff/timeline_metadata.py`

### Form, grid, and Ribbon script behavior

- Form `OnLoad`, data `OnLoad`, `OnChange`, `OnSave`, `PostSave`, and Loaded
  event semantics were researched against Microsoft Learn.
- Grid `OnLoad`, `OnChange`, `OnRecordSelect`, and `OnSave` received distinct
  event sources and row-scoped contexts.
- FormXml handlers respected `passExecutionContext`.
- Code-added handlers were appended after configured handlers.
- Handler order, depth, shared variables, async completion, timeouts, and save
  cancellation were prototyped.
- Ribbon `PrimaryControl`, `SelectedControl`, `CommandProperties`, selected
  record IDs/references, locale values, and literal parameters were bound in
  XML order.
- Unsupported server operations were changed from fake success to explicit
  failure.

Primary prototype files:

- `VerseOff/verseoff_bridge.js`
- `VerseOff/templates/xrm_form_renderer.j2`
- `tests/test_client_api_surface.py`
- `tests/test_form_parser.py`
- `tests/test_offline_engine.py`

### Web resources

- JavaScript, HTML, CSS, XML, XSL, SVG, RESX, and binary resources were
  materialized without corrupting binary content.
- Dependency discovery included explicit dependency XML and relative
  references found inside customer resources.
- Embedded HTML resources received the documented `parent.Xrm` behavior.
- Standalone resources received a `GetGlobalContext` shim.
- Direct network access from the prototype browser profiles was blocked.
- A constrained cross-process `getContentWindow()` function proxy was tested.

### PCF

- `customcontrol` manifests and `customcontrolresource` links were parsed.
- Manifest properties, datasets, resources, feature usage, platform
  libraries, events, and compatibility types were retained.
- First-party controls were mapped to native fallback controls.
- Dataset controls were mapped to the native grid.
- Self-contained custom standard PCF bundles were executed in a constrained
  prototype host.
- Virtual React/Fluent controls and controls requiring unavailable features
  failed closed.

Primary prototype files:

- `VerseOff/pcf_metadata.py`
- `VerseOff/verseoff_pcf_host.js`
- `tests/test_pcf_metadata.py`

### App generation and packaging

- Entity metadata and web resources were downloaded in parallel.
- Dependency expansion was bounded.
- Generated resources were hashed.
- The generated application included the bridge and packaged resources.
- User, organization, locale, role, and source-app metadata were added to the
  generated manifest.

### Validation performed

Targeted tests proved the following concepts:

- A customer form library can run `OnLoad` in a JavaScript engine and update a
  native-bound field.
- A customer `OnSave` handler can cancel a save.
- Grid row context exposes the correct row and attribute.
- Ribbon `PrimaryControl` and related parameters are bound correctly.
- Embedded HTML resources can call `parent.Xrm`.
- A custom PCF bundle can run its lifecycle and return bound outputs.
- Binary and RESX resources survive generation.
- Unsupported online APIs fail explicitly.

The full prototype suite reached all functional tests, while late Qt teardown
callbacks exposed lifecycle races that were being hardened. These races are
specific to the discarded PyQt/Chromium prototype and are not a reason to
retain that runtime.

## Architectural conclusions from the prototype

The prototype produced valuable compatibility knowledge, but it also showed
why it should not become the commercial runtime:

- A browser-shaped host creates cross-process context, callback, teardown, and
  lifecycle complexity.
- Executing Microsoft system bundles would cross a proprietary boundary and
  would remain coupled to undocumented cloud internals.
- A Python/PyQt generator does not match the desired Microsoft enterprise
  deployment stack.
- Arbitrary PCF hosting requires a substantial Power Apps framework clone.
- A native control library is more deterministic for BCDR use.

## What is retained after the pivot

Retain and port:

- XSD-driven metadata interpretation.
- FormXml, RibbonXml, SiteMap, FetchXML, relationship, Timeline, and profile
  fixtures.
- Client API behavioral tests and compatibility matrices.
- Event ordering, Ribbon parameter, and save-cancellation research.
- Resource dependency discovery and integrity hashing.
- Fail-closed rules and security assumptions.
- SQLite sync-state and relationship design.

Do not ship:

- Python/PyQt application runtime.
- Chromium/QWebEngine form runtime.
- Execution of Microsoft OOTB or internal JavaScript.
- Browser-hosted Microsoft first-party PCF bundles.
- LLM interpretation as a runtime dependency.

## Pivot outcome

The shipping architecture is now:

- .NET 8/9 and C#.
- .NET MAUI native UI, with WinUI 3 on Windows.
- XAML/native control rendering.
- XSD validation through `System.Xml.Schema`.
- EF Core SQLite for local data.
- MSAL.NET and Dataverse Web API for authenticated sync.
- Jint as a constrained interpreter for approved customer-owned JavaScript
  only.
- Clean-room C# implementations for documented OOTB behavior.
- Standard Dataverse solutions and mobile offline profiles as the ALM and sync
  control plane.

The prototype remains a research oracle and migration test bed until its
metadata fixtures and compatibility tests are ported to the .NET solution.
