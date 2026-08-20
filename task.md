# VerseOff — VS Code Extension Pivot Tasks

## Phase 1.5 — Azure Telemetry Shift
- [x] Add `@azure/identity` and `@azure/monitor-query` to `package.json`.
- [x] Implement `fetchAppInsightsTelemetry` in `extension.ts` using MSAL `InteractiveBrowserCredential`.
- [x] Inject the computed CacheManifest into the code generator payload.

## Phase 2 — VS Code Extension Scaffolding
- [x] Install `yo` and `generator-code` (bypassed with manual scaffolding for speed).
- [x] Scaffold `verseoff-vscode` extension project.
- [x] Implement Extension activation and command registration.

## Phase 3 — The Maker Portal (Webview)
- [x] Build React/Webview UI for Dataverse Connection.
- [x] Build React/Webview UI for Entity Selection.

## Phase 4 — AI Auto-Correction Loop
- [x] Implement function to execute `pytest` via child process.
- [x] Implement log parser to catch failed tests and stack traces.
- [x] Set up LLM prompt construction for auto-correction using `vscode.lm` API.

## Phase 5 — Advanced Maker UI & Prompt Inclusion
- [x] Implement Model-Driven App pre-selection in the Webview.
- [x] Implement hierarchical component trimming.
- [x] Build AI Chat interface in Webview.
- [x] Wire `invokeLLMForComponent` to translate natural language into Dataverse OData queries.

## Phase 6 — Business Process Flow Dependency Resolution
- [x] Add `get_bpf_entities_for_app` in `metadata_fetcher.py`.
- [x] Query `processstage` table to resolve multi-entity hops.
- [x] Forcibly inject BPF participating entities into the CacheManifest to prevent offline crashes.

## Phase 7 — Offline-Only Extensibility
- [x] Create `custom_events.j2` to scaffold offline hook definitions.
- [x] Update `code_generator.py` to render `custom_events.py` safely (no overwriting).
- [x] Wire `post_load` and `pre_save` hooks into `generated_form.j2`.
- [x] Wire `pre_sync` and `post_sync` hooks into `generated_sync.j2`.

## Phase 8 — Concurrency & Conflict Resolution
- [x] Extract `@odata.etag` from local SQLite database during sync push.
- [x] Implement Optimistic Concurrency by injecting `If-Match: <etag>` into Dataverse PATCH requests.
- [x] Catch HTTP 412 (Precondition Failed) and flag local records as `conflict` rather than blindly overwriting server data.

## Phase 9 — Autonomous Background Sync
- [x] Implement PyQt `QThread` `SyncWorker` to prevent UI freezing during sync.
- [x] Implement PyQt `QTimer` to autonomously trigger the sync loop.
- [x] Tie interval to the `sync_interval` configuration generated from the manifest.

## Phase 10 — Resilient Data Facade (Fallback Stores)
- [x] Scaffold `data_providers.py` with `IRerviceProvider` interface.
- [x] Implement `DataverseProvider` wrapping the official SDK.
- [x] Scaffold `FallbackRESTProvider` for secondary data lakes (e.g., Snowflake).
- [x] Implement Failover logic in `generated_sync.j2` (auto-switch on 5xx/timeout).

## Phase 11 — Native Button Generation (Ribbon XML)
- [x] Implement `_fetch_ribbon_buttons` in `metadata_fetcher.py`.
- [x] Extract and unzip the Base64 `CompressedEntityXml` using Python's `zipfile` module.
- [x] Parse `RibbonXml.xml` to extract Button definitions and Commands.
- [x] Inject native `QPushButton` definitions into `generated_form.j2` matching the Dataverse Command Bar.

## Phase 12 — True Dynamic XRM Form Rendering Engine
- [x] Update `code_generator.py` to preserve the full `manifest.json` at runtime.
- [x] Create `xrm_form_renderer.j2` to natively parse raw D365 `formxml` using `xml.etree`.
- [x] Map `<tabs>`, `<sections>`, and `<controls>` to `QTabWidget`, `QGroupBox`, and native PyQt input widgets.
- [x] Refactor `generated_main.j2` to spawn the dynamic `XrmFormRenderer` instead of statically generated flat forms.
- [x] Phase 37: Quick Find View (Search)
  - [x] Update `generated_main.j2` to include search bar
  - [x] Update `LookupWidget` in `xrm_form_renderer.j2` to include search bar
  - [x] Update `view_parser.py` to accept search string and inject into SQL
- [x] Phase 38: Associated Views (Related Records)
  - [x] Add "Related" Tab generation in `XrmFormRenderer`
  - [x] Implement grid spawning using Associated View (`querytype=2`)
  - [x] Update `view_parser.py` to accept filter dict to inject foreign key condition
- [x] Phase 39: Native SiteMap Engine
  - [x] Update `metadata_fetcher.py` to parse SiteMap XML hierarchy (Area > Group > SubArea)
  - [x] Update `code_generator.py` to store sitemap in `manifest.json`
  - [x] Update `generated_main.j2` to replace `QListWidget` with `QTreeWidget`
  - [x] Wire `QTreeWidget` click events to load grids
- [x] Phase 40: VS Code Native Project Generation
  - [x] Generate `.vscode/launch.json` for F5 debugging
  - [x] Generate `.vscode/tasks.json` for PyInstaller build task
  - [x] Inject `build_app.py` into the generated output

## Phase 13 — Ribbon Display & Enable Rule Evaluation Engine
- [x] Update `metadata_fetcher.py` to extract `<CommandDefinitions>` and `<RuleDefinitions>`.
- [x] Parse `FormStateRule` and `ValueRule` definitions and map them to Buttons in `manifest.json`.
- [x] Implement runtime `evaluate_ribbon_rules()` in `xrm_form_renderer.j2`.
- [x] Dynamically toggle PyQt Button visibility (`setVisible`) and enablement (`setEnabled`) based on local record state.

## Phase 14 — Native Business Process Flow (BPF) UI Rendering
- [x] Extract BPF definitions (Stages and primary entity mapping) via `get_bpf_definitions_for_app` in `metadata_fetcher.py`.
- [x] Embed BPF metadata globally in the generated `manifest.json`.
- [x] Implement `_create_bpf_ui` in `xrm_form_renderer.j2` to detect active BPFs.
- [x] Dynamically render BPF Stages as native PyQt Chevrons in a horizontal layout above the main form.

## Phase 15 — Native Form Header UI Rendering
- [x] Update `xrm_form_renderer.j2` XML parsing to specifically segregate `<header/tabs>` from `<body/tabs>`.
- [x] Inject a right-aligned `QHBoxLayout` underneath the BPF layout for the header metrics.
- [x] Dynamically parse Header `<control>` elements and spawn read-only native widgets.
- [x] Style header widgets with vertical labels and separator lines to exactly mimic D365 web UI density.

## Phase 16 — Client API (formContext) Event Emulation
- [x] Build `PythonFormContext` inside `xrm_form_renderer.j2` to mock the Microsoft Client API signature.
- [x] Update `_render_from_xml` to parse the `<events>` nodes from D365 `FormXML`.
- [x] Implement the `_fire_events` engine to dynamically route `onload`, `onsave`, and `onchange` triggers to `FormEvents`.
- [x] Wire up native PyQt signals (`editingFinished`, `currentIndexChanged`, `stateChanged`) to the `onchange` emulation layer.

## Phase 17 — Deep Client API Object Model Emulation
- [x] Expand `PythonFormContext.data` to include `entity.save()`, natively mapping to the PyQt `save_record()` engine.
- [x] Build `PythonFormContext.ui` namespace and implement native `setFormNotification` / `clearFormNotification` using styled `QLabel` infobars.
- [x] Implement `PythonFormContext.getControl(name)` returning a `PythonControl` object.
- [x] Wire `PythonControl.setVisible()` and `.setDisabled()` to the native PyQt UI layout components.

## Phase 18 — Client API Execution Context & Save Cancellation
- [x] Build `PythonExecutionContext` to persist state across the Form's runtime lifecycle.
- [x] Implement `getSharedVariable` and `setSharedVariable` mapping to a persistent dictionary on the Form Renderer.
- [x] Build `SaveEventArgs` supporting `.preventDefault()` and `.getSaveMode()`.
- [x] Update `_fire_events("onsave")` to intercept `isDefaultPrevented()` and dynamically abort the SQLite database `UPDATE` transaction.

## Phase 19 — Full `formContext` Object Model Emulation
- [x] Implement `formContext.ui.close()`, `refreshRibbon()`, and `getFormType()`.
- [x] Implement `formContext.data.entity.getId()` and `getEntityName()`.
- [x] Enhance `PythonControl` with `.getLabel()` and `.setLabel()`, dynamically manipulating the adjacent PyQt `QLabel` widgets.
- [x] Enhance `PythonAttribute` with `.getName()`.

## Phase 20 — Dataverse Collections & Deep UI Hierarchy Emulation
- [x] Build `PythonCollection` engine featuring native `.forEach()`, `.get(name)`, and `.get(index)` mapping identically to Dataverse logic.
- [x] Refactor `xrm_form_renderer.j2` XML parsing to track `tab_widget` pages and `groupbox` sections dynamically.
- [x] Build `PythonTab` and `PythonSection` structures with `.setVisible()` and `.getLabel()`.
- [x] Expose `formContext.ui.tabs` and nested `.sections` / `.controls` collections to enable deep UI programmatic manipulation.

## Phase 21 — Subgrid UI Rendering & GridContext Emulation
- [x] Enhance `_create_widget_for_field` to detect `<control classid="{E7A81278...}">` and dynamically spawn a native PyQt `QTableWidget` instead of a generic text input.
- [x] Build `PythonGridControl` which inherits from `PythonControl` and exposes `.getGrid()`.
- [x] Build `PythonGrid`, `PythonGridRow`, and `PythonGridEntity` structures to natively mimic the Microsoft Grid Context API.
- [x] Expose `grid.getTotalRecordCount()`, `grid.getRows()`, and `grid.getSelectedRows()` as `PythonCollection` objects to allow native subgrid iteration.

## Phase 23 — Global Xrm Object Model Emulation
- [x] Refactored `Xrm.WebApi` to execute completely synchronously, returning raw dictionaries without mocked `Promises` per user request.
- [x] Implement `Xrm.Navigation.openAlertDialog` and `openConfirmDialog`, mapping them to `QMessageBox`.
- [x] Implement `Xrm.Utility.getGlobalContext()` to expose mocked offline Azure AD user settings.
- [x] Build the ultimate `Xrm.WebApi` translation layer, dynamically routing `.retrieveRecord()`, `.retrieveMultipleRecords()`, `.createRecord()`, and `.updateRecord()` directly to SQLite local queries.
- [x] Inject `GlobalXrm` directly into Python `builtins` so that it is universally available to all executed Form Events.

## Phase 24 — Comprehensive Event Model Parity
- [x] Add dynamic event registration natively via `PythonAttribute.addOnChange(func)` and `removeOnChange(func)`.
- [x] Build `TabStateChange` event routing bound to the PyQt `QTabWidget.currentChanged` signal.
- [x] Implement `DataOnLoad` and explicit `PostSave` hooks triggered after the respective SQLite I/O operations complete.

## Phase 25 — Programmatic Event Triggers (`fireOnChange`)
- [x] Implement `.fireOnChange()` on `PythonAttribute` natively.
- [x] Wire `.fireOnChange()` to seamlessly trigger both FormXML definitions and `.addOnChange()` dynamic listeners without UI interaction.

## Phase 26 — Form OnLoad Event Emulation (`ui.addOnLoad`)
- [x] Implemented `formContext.ui.addOnLoad(func)` and `removeOnLoad(func)` on `PythonUIContext`.
- [x] Wired dynamic UI OnLoad listeners directly into the VerseOff Form `onload` dispatch loop, ensuring they execute immediately after PyQt layout generation.

## Phase 27 — Form Loaded Event Emulation (`ui.addLoaded`)
- [x] Read Microsoft documentation on the modern `Form Loaded` post-load event.
- [x] Implemented `formContext.ui.addLoaded(func)` and `removeLoaded(func)` on `PythonUIContext`.
- [x] Plumbed the `"formloaded"` event trigger to fire precisely after all UI rendering and SQLite data fetching is fully resolved, giving developers a safe post-load optimization hook.

## Phase 28 — Form OnSave Event Emulation (`data.entity.addOnSave`)
- [x] Implemented `formContext.data.entity.addOnSave(func)` and `removeOnSave(func)`.
- [x] Wired dynamic OnSave listeners natively into the `"onsave"` dispatch loop, guaranteeing sequence execution and full access to `SaveEventArgs.preventDefault()` alongside static FormXML scripts.

## Phase 29 — Asynchronous OnSave & `preventDefaultOnError`
- [x] Added `SaveEventArgs.preventDefaultOnError()` to align with modern Microsoft specifications.
- [x] Built native Async OnSave interceptors inside the VerseOff event engine that detect Python coroutines/awaitables.
- [x] Implemented the 10-second wait/timeout execution blocker for Async handlers using `asyncio.wait_for`.

## Phase 30 — Background Synchronization Engine
- [x] Build `sync_engine.py` using PyQt `QThread` and `QTimer` to poll SQLite without freezing the UI.
- [x] Implement MSAL integration for silent Azure AD token acquisition.
- [x] Implement Optimistic Concurrency checking (ETag 412) to handle collision and flag `CONFLICT` in SQLite.
- [x] Build the `FallbackRESTProvider` to route data to a Snowflake mock endpoint if D365 is down (503/timeout).
- [x] Wire the `SyncEngine` to boot up automatically when the VerseOff client launches.

## Phase 31 — Data OnLoad Extension (`data.refresh()`) & Sync Engine Finalization
- [x] Implemented `formContext.data.refresh(save)` to explicitly re-fetch database state and trigger `"dataonload"`.
- [x] Altered the `save_record()` pipeline to trigger `"dataonload"` natively after a successful commit.
- [x] Re-architected `generated_sync.j2` to ensure the MSAL engine compiles automatically into new offline apps.
