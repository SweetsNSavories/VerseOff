# Architecture Research: Resilient Offline Windows Client for Dynamics 365 / Dataverse

This document summarizes the research into building a highly defensive, offline-first Windows application that dynamically renders Model-Driven Apps and ensures critical data capture during emergencies or connectivity loss.

## 1. Documentation & Schemas Research

To build a metadata-driven UI with absolute precision, we rely strictly on the core Microsoft Dataverse schemas and object models. I have compiled an exhaustive catalogue of all required definitions in the [d365_comprehensive_reference.md](file:///C:/Users/prave/.gemini/antigravity/brain/2a3045b3-521e-4996-afd9-7b47cf3fed78/d365_comprehensive_reference.md) artifact, covering:
*   `FormXml.xsd` & `SiteMap.xsd`: The blueprints for generating the native UI structure.
*   **Web API Metadata (`AppModule`, `AppModuleComponent`)**: The endpoints to dynamically retrieve app configurations.
*   **Client API (`formContext`, `executionContext`)**: The strict object models our Python mock engine must adhere to, explicitly replacing the deprecated `Xrm.Page`.

## 2. Resilient Offline Architecture Strategy

Your vision for an offline-first, emergency application is entirely **doable** and represents a highly valuable architectural pattern for critical enterprise systems. By lowering the dependency on complex UI logic and prioritizing data capture, the feasibility goes up significantly.

### The "Always-On" Background Sync
*   **System Startup**: The app runs as a background Windows service/tray app that boots with the OS.
*   **Local Data Store**: A robust **SQLite** database acts as the local source of truth. It stores both the application metadata (Form layouts) and the actual business data (Records).
*   **Intelligent & Contextual Caching**: Instead of downloading the whole CRM, the app uses telemetry and context to download only what is highly relevant to the specific user:
    *   **Email & Calendar Sync**: Hooks into the local Outlook client (via Graph API or local COM) to scan recent email subjects and attendees, downloading Dataverse records related to those contacts and cases.
    *   **Audit & Telemetry**: Queries Dataverse audit logs to determine the records the user interacted with over the last 3 months.
    *   **Active Queues**: Downloads all "Open Cases", "Active Opportunities", and assigned tasks.

### New File: `telemetry_analyzer.py`

| Class | Purpose |
|---|---|
| `AuditAnalyzer` | Queries Dataverse `audits` entity with date-bounded FetchXML |
| `AppInsightsAnalyzer` | Queries Azure Monitor REST API with KQL |
| `CacheManifestBuilder` | Combines both signals → ranked cache manifest dict |

---

## Phase 1.8 — WebResource & Ribbon Parsing (`webresource_fetcher.py`) ⭐ NEW

> **Core idea:** To support high-fidelity offline forms, we must execute the original JavaScript. We need to fetch the WebResources and Ribbon definitions.

### A. WebResource Fetching
When parsing FormXML `<events>`, we identify JavaScript libraries (e.g., `new_account_main.js`).
We query the Dataverse Web API to download the raw JS content:
```http
GET {org}/api/data/v9.2/webresourceset?$filter=name eq 'new_account_main.js'&$select=content
```
The base64 encoded content is decoded and saved to the generated app's `webresources/` folder.

### B. RibbonDiffXml Parsing
We fetch the Ribbon definitions for each entity to generate the PyQt `QToolBar`.
```http
GET {org}/api/data/v9.2/ribbonclientmetadata?$filter=entity eq 'incident'
```
We parse `<EnableRule>` and `<CommandDefinition>` elements. 
- **ValueRules** are compiled into Python logic.
- **CustomRules** (JS calls) are prepared to be evaluated in the headless JS engine at runtime.

---

## Phase 2 — Maker UI (`maker_ui.py`)

### 2. Live Reloading Native Preview (`dev_runner.py`)
To provide a visual "Maker" experience without attempting to embed a PyQt window into HTML, we use a Live Reload approach.
- The extension spawns `python dev_runner.py` in the background.
- This script watches the generated Python code and JavaScript WebResources.
- Whenever the VS Code extension generates new metadata or the AI auto-corrects a file, `dev_runner.py` instantly kills the old PyQt window and restarts it.
- The developer sees the native app pop up next to VS Code, automatically refreshing as it is built.

### 3. The Generation Engine (The CLI)
When connectivity is restored, a background queue processor pushes changes back to Dataverse:
*   **Conflict Resolution**: The engine must handle situations where data was changed in Dataverse while the user was offline.
*   **Time Overrides**: To override fields like `CreatedOn` or `ModifiedBy` during sync to reflect the *actual* time the offline user did the work, the application will need to use a Service Principal or a user role with the specific `prvRecordComitment` (Override Created on or Created by) privilege.

## 3. Defensive UI & The Local LLM Interpreter

The core philosophy of this app is "Defensive Data Capture." Even if the complex bells and whistles fail, the user must be able to submit a case. However, mapping highly complex Dataverse schemas rigidly can be brittle. To solve this, VerseOff introduces a **Local LLM Integration** (e.g., Llama 3 via `llama.cpp` or Mistral).

### Intelligent Interpretation with an Inbuilt LLM
Instead of building a perfect, rigid Python parser for every edge case in Dataverse's XML and JavaScript, the app will use an inbuilt LLM to intelligently interpret metadata:
1.  **Dynamic UI Generation**: The LLM parses the `FormXml` and intelligently maps it to PyQt5/PyQt6 controls. If an unknown custom control is encountered, the LLM infers the best native fallback (like a generic text area).
2.  **Business Logic Interpretation**: The LLM can interpret declarative Business Rules and complex Dataverse JavaScript (`OnLoad`, `OnChange`) and simulate their intended effects on the PyQt UI state, rather than attempting to execute a perfect transpilation.
3.  **NLP Data Capture (Optional)**: Users can type natural language (e.g., "Log a call with John Smith regarding the broken printer"), and the LLM will parse the intent, map it to the offline SQLite schema, and draft the record.

### The Fallback (Bare-Minimum Mode)
If the LLM struggles or custom logic is too obscure, the app adopts a **graceful degradation** strategy. It simply renders the raw PyQt input fields, allows the user to input the data, and saves it to the SQLite database.

### Data Validation
Validation shifts from client-side UI scripts to the sync engine. If an offline record is synced and Dataverse rejects it (due to a server-side rule), it is marked in the local SQLite DB as "Sync Failed - Needs Correction" for the user to fix.

### `generated_db.j2` → `db.py`
- One table per entity: `CREATE TABLE IF NOT EXISTS {entity}s (...)`
- Dynamic columns from attribute metadata
- `sync_status` column: `'pending' | 'synced' | 'rejected' | 'conflict'`
- `sync_error` column for plugin rejection messages

---

## Phase 4.5 — Mock XRM Bridge Generation (`mock_xrm.py`) ⭐ NEW

> **Core idea:** A headless JS engine (`py_mini_racer` or `QJSEngine`) runs inside the PyQt app to evaluate the downloaded WebResources.

**1. Python `MockFormContext`:**
We generate a Python class that implements the standard D365 Client API:
- `getAttribute(name)`: Returns a `MockAttribute` that natively gets/sets values in the associated PyQt widget (e.g., `QLineEdit.setText()`).
- `getControl(name)`: Returns a `MockControl` that can `setVisible()` or `setDisabled()` on the PyQt widget.
- `ui.setFormNotification()`: Maps to a QLabel banner in the PyQt form.

**2. Runtime Execution:**
When the generated PyQt form opens:
- It instantiates the JS engine.
- It loads the downloaded WebResource JS files.
- It exposes the `MockFormContext` to the JS engine.
- It invokes the `OnLoad` handler defined in the FormXML.

If the JS tries to access the DOM (e.g., `document.getElementById`), the engine throws a `ReferenceError` which is caught and logged, ensuring the app degrades gracefully while preserving all supported business logic.

---

## Phase 5 — Sync Engine Upgrade (for generated app)

## Conclusion & Feasibility

**Yes, this is highly doable.** In fact, this approach—focusing on a telemetry-driven local SQLite cache and a defensive, bare-minimum UI generation engine—is much more practical than trying to perfectly replicate the entire Dataverse web client in a Windows app. 

## Proposed Architecture

### 1. Telemetry Shift: Azure Monitor JS SDK
Instead of doing App Insights telemetry in Python (`telemetry_analyzer.py`), we will migrate the App Insights logic directly into the **VS Code Extension (TypeScript)**. 

**The Approach:**
- Add `@azure/monitor-query` and `@azure/identity` to the extension dependencies.
- Use `InteractiveBrowserCredential` or `DeviceCodeCredential` from `@azure/identity` to pop up an authentication flow. This will capture the Entra ID token and handle refresh token caching automatically.
- Query the Dataverse App Insights workspace for the `pageViews` (EditForm Load) events.
- Merge these results with the Dataverse Audit Logs (if still desired) to build the `CacheManifest`.
- Inject the fully computed CacheManifest directly into the `maker_manifest.json` payload sent to the Python CLI.

### 2. The Maker Portal (VS Code Webview)
The Webview UI will be significantly enhanced to mirror the true Dataverse Maker experience:
- **Model-Driven App Selection:** After authenticating, the developer selects a specific Model-Driven App (`appmodule`) instead of a raw list of entities.
- **Hierarchical Trimming:** Once an app is selected, the extension queries `appmodulecomponents` to load *only* the entities, forms, and views included in that app. The UI presents this subset as a nested tree, allowing the developer to selectively uncheck (trim down) specific forms or views they don't want offline.
- **Prompt-Driven Component Inclusion:** We will embed a natural language input box (Chat UI) into the Webview. If a developer types *"Include the SLA escalation workflow"* or *"Add the custom account calculation plugin"*, the extension passes this prompt to the AI (`vscode.lm`). The AI returns a Dataverse OData query to locate the component, the extension fetches the component's GUID, and dynamically injects it into the `maker_manifest.json`!

### 3. Business Process Flow (BPF) Dependency Resolution
Business Process Flows span multiple entities (e.g., Lead to Opportunity). If a BPF is selected as part of the Model-Driven App, the offline app *must* cache all participating entities to prevent crashes.

**The Approach:**
- When a BPF (`workflow` where `category=4`) is identified in the selected components, the Python `metadata_fetcher.py` will intercept it.
- It will query the Dataverse `processstage` and `workflow` definitions to extract the logical names of all entities involved in the BPF stages.
- The Python engine will forcibly inject these participating entities (e.g., `lead`, `opportunity`, and the backing BPF entity like `leadtoopportunitysalesprocess`) into the caching manifest, ensuring they are downloaded to the SQLite database even if the developer forgot to explicitly select them in the Webview UI.

### 4. Offline-Only Extensibility (Custom Event Hooks)
Developers often need to write "offline-only" logic to enrich the app without polluting the online Dataverse environment (e.g., accessing the local GPS, auto-filling fields, or custom validation).

**The Approach:**
- **Event Scaffolding:** The Python generator will scaffold a `custom_events.py` file in the generated app workspace. This file will contain empty hook functions: `post_load(entity, form_context)`, `pre_save(entity, data)`, `pre_sync()`, etc.
- **Template Integration:** The Jinja templates (`generated_form.j2`, `generated_sync.j2`) will automatically import this file and trigger the hooks at the appropriate lifecycle events.
- **AI Code Generation:** The AI Chat UI in the Maker Portal will be upgraded. If a developer types, *"Write logic to auto-capitalize the Account Name before save"*, the VS Code extension will use `vscode.lm` to generate the exact Python hook and directly inject it into the `custom_events.py` file! Because the developer is already inside VS Code, they can visually review, edit, and test this custom logic immediately.

### 5. Concurrency & Conflict Resolution (Optimistic Sync)
When the offline app reconnects, there is a risk that a record updated offline was also modified by someone else online. 

**The Best Approach: Optimistic Concurrency**
Pessimistic concurrency (locking records) is not viable for disconnected apps because a locked record could be stuck indefinitely if the user never reconnects. We will use **Optimistic Concurrency**:
- **ETag Caching:** When pulling records, the `SyncEngine` stores the Dataverse `@odata.etag` (RowVersion) in the SQLite database alongside the record data.
- **Pushing Updates:** When pushing an update, the `SyncEngine` includes the ETag in the `If-Match` header.
- **Conflict Handling:** If the server record was modified by someone else, Dataverse rejects the push with an HTTP 412 (Precondition Failed). The `SyncEngine` catches this, marks the record status as `conflict`, and prevents it from overwriting the server. The user can then manually review the conflict in the app UI.

### 6. Resilient Data Facade (Fallback Stores)
Enterprise systems like Dataverse occasionally suffer outages. If a worker needs a record *right now* but Dataverse is down, the app should be able to query a synchronized backup data lake (e.g., Snowflake, Azure Data Lake) via a custom REST API.

**The Approach:**
- **Provider Interface (`IRemoteProvider`)**: The Python generator will scaffold an abstract data provider interface.
- **`DataverseProvider`**: The primary implementation wrapping the official `DataverseClient`.
- **`FallbackRESTProvider`**: A scaffolded secondary implementation acting as a Facade for the backup data lake. We will provide the concrete structure, and the developer can fill in the exact Snowflake REST endpoint URL later.
- **Failover Logic**: The `SyncEngine` will implement a try-catch failover mechanism. If an explicit search or background sync fails against the `DataverseProvider` (due to 500 Server Error or timeouts), it will automatically route the `get_record` request to the `FallbackRESTProvider` to pull the read-only data into the local SQLite store so the worker isn't blocked!

### 7. Native Button Generation (Ribbon XML Extraction)
Right now, the offline PyQt forms just have generic "Save" buttons. To make the offline app truly mirror the Model-Driven App, it needs the exact command bar buttons the developer configured.

**The Approach:**
- **`RetrieveEntityRibbon` API**: In `metadata_fetcher.py`, we will use the concept demonstrated in the Gist to call `RetrieveEntityRibbon(EntityName='...', RibbonLocationFilter=Microsoft.Dynamics.CRM.RibbonLocationFilters'1')`.
- **Base64 Unzipping**: We will decode the `CompressedEntityXml` Base64 string and unzip it in memory using Python's `zipfile` module.
- **XML Parsing**: We will parse the extracted `RibbonXml.xml` using `xml.etree.ElementTree` to find the `<CommandDefinition>` and `<Button>` nodes for the Form and Grid ribbons.
- **Dynamic PyQt Rendering**: The parsed buttons will be added to the `CacheManifest`. `generated_form.j2` will loop through these and natively render PyQt `QPushButton` elements that match the Dataverse command bar!

### 8. True Dynamic XRM Form Rendering Engine
Currently, VerseOff statically generates PyQt files that just loop over attributes to create a flat form. To truly emulate the Dynamics 365 Customer Engagement (CE) platform, VerseOff needs a parallel rendering engine that parses raw `FormXML` at runtime to build the UI dynamically (Tabs, Sections, Columns, and Controls) just like the web browser does!

**The Approach:**
- **XML Preservation**: The metadata fetcher already pulls the `formxml` from the `SystemForm` entity. Instead of discarding it, we will embed the raw `formxml` inside the `CacheManifest`.
- **The XRM Renderer Component**: We will replace the statically generated flat forms with a generic `xrm_form_renderer.py` module in the PyQt app.
- **Runtime Parsing**: When the user opens a record, the engine will parse the `formxml`.
  - `<tabs>` will dynamically generate PyQt `QTabWidget`s.
  - `<sections>` will generate `QGroupBox` elements.
  - `<control>` data class IDs will dynamically map to `QLineEdit`, `QComboBox`, or `QCheckBox`.
- **Result**: The offline form's layout will mathematically mirror the exact visual structure (columns, grouping, and tabbing) of the online Model-Driven App, without writing a single line of hardcoded UI code!

### 9. Ribbon Display & Enable Rule Evaluation Engine
Simply extracting all `<Button>` tags from the compiled Ribbon XML is dangerous because it will render hundreds of hidden system buttons (like "Activate", "Deactivate", "Assign", "Word Templates") on the UI simultaneously. The engine needs to understand *when* to show these buttons by parsing the `<CommandDefinitions>`, `<DisplayRules>`, and `<EnableRules>`.

**The Approach:**
- **Advanced XML Extraction**: Update `_fetch_ribbon_buttons` to extract not just buttons, but also their associated `<CommandDefinition>` mapping. We will parse the child `<DisplayRules>` (e.g., `<ValueRule Field="statecode" Value="0"/>`).
- **Manifest Injection**: We will inject these rules into the `manifest.json` under the button's definition.
- **Runtime Evaluation in `XrmFormRenderer`**:
  - When the offline form loads a record, the renderer will evaluate the Ribbon rules against the local SQLite data (e.g., "Is `statecode` 0?").
  - It will dynamically call `.setVisible(False)` or `.setEnabled(False)` on PyQt `QPushButton` widgets that fail the D365 Ribbon rules.
- **Result**: The offline app perfectly respects the exact state-based command bar logic configured in the Model-Driven App!

### 10. Native Business Process Flow (BPF) UI Rendering
While we already implemented BPF *dependency* resolution (so offline apps don't crash when jumping entities), we currently do not render the iconic chevron BPF progress bar on the offline forms.

**The Approach:**
- **BPF Metadata Extraction**: Update `metadata_fetcher.py` to extract the exact Stages and Steps (fields) for active BPFs linked to the app's entities from the `processstages` Web API endpoint.
- **PyQt UI Rendering**: Update `xrm_form_renderer.j2` to inject a horizontal layout at the top of the form containing native PyQt Widgets styled as Chevrons (e.g., using styled `QLabel`s or `QPushButton`s).
- **Stage State Engine**: 
  - The renderer will query the local SQLite DB for the associated BPF instance record (e.g., `leadtoopportunitysalesprocess`) linked to the current record ID.
  - It will highlight the `active_stage_id` chevron.
  - Clicking a stage chevron will dynamically swap out the main form's tabs/sections with the fields required for that specific BPF stage!

### 11. Native Form Header UI Rendering
In D365, the "Header" is the top-right section of the form that displays 3-4 critical fields (like Owner, Status, or Total Amount) that must remain visible regardless of which tab the user is viewing. Currently, our renderer might conflate header fields with body fields or ignore them entirely.

**The Approach:**
- **FormXML Scope Fix**: Update `xrm_form_renderer.j2` to specifically target `<body/tabs>` for the main UI, and `<header/tabs>` for the header fields to prevent XML collision.
- **PyQt Header Layout**: Inject a right-aligned horizontal layout (`QHBoxLayout`) at the top of the PyQt form, right below or next to the BPF.
- **Dynamic Field Rendering**: The engine will parse the `<header>` XML block, extract the `<control>` data fields, and generate read-only or editable widgets (like `QLabel` or `QLineEdit`) tightly packed together to mimic the dense D365 header UI.

### 12. Client API (formContext) Event Emulation
Dataverse forms heavily rely on client-side JavaScript Web Resources bound to `OnLoad`, `OnSave`, and `OnChange` events to enforce business logic natively in the browser. 

Executing raw Dataverse JavaScript inside a desktop PyQt app is technically unfeasible without building a massive `Xrm` browser emulation layer. Instead, VerseOff will map these web events to Python abstractions!

**The Approach:**
- **Event Extraction**: `metadata_fetcher.py` will parse the `<events>` nodes inside the FormXML, extracting every `libraryName` (e.g., `new_account_script.js`), `functionName`, and the trigger (`onload`, `onsave`, or control-level `onchange`).
- **Python Abstraction**: The generator will append these exact function signatures into `custom_events.py` as empty Python methods.
- **The `PythonFormContext`**: We will build a lightweight Python class (`PythonFormContext`) that implements the exact same API signature as the JavaScript `formContext` (e.g., `formContext.getAttribute("name").getValue()`, `formContext.ui.setFormNotification(...)`).
- **Runtime Binding**: `xrm_form_renderer.j2` will bind PyQt signals (like `textChanged` or `currentIndexChanged`) to execute these Python hooks, passing the `PythonFormContext` object.
- **Result**: The developer simply rewrites their simple JS validation logic into Python using the exact same API syntax they are already used to!

### 13. Deep Client API Object Model Emulation
To truly allow developers to copy and paste their Dataverse validation logic into VerseOff, the `PythonFormContext` needs to perfectly mirror the complex hierarchy of the official Microsoft Client API Object Model.

**The Approach:**
- **`formContext.data.entity`**: We will build out the `data` namespace. 
  - Developers will be able to call `formContext.data.entity.save()` which will natively trigger the PyQt SQLite `UPDATE` routine.
- **`formContext.ui`**: We will build the `ui` namespace.
  - Implement `formContext.ui.setFormNotification(message, level, uniqueId)` to spawn native PyQt infobars or QMessageBox popups at the top of the form.
  - Implement `formContext.ui.clearFormNotification(uniqueId)`.
- **`PythonControl` Wrapper**: Implement `formContext.getControl(name)`.
  - Developers can call `.setVisible(bool)` which calls PyQt's `.setVisible()`.
  - Developers can call `.setDisabled(bool)` which calls PyQt's `.setDisabled()`.
- **Result**: The VerseOff engine becomes an almost 1:1 translation layer for Dataverse UI manipulation logic!

### 14. Client API Execution Context & Save Cancellation
When `passExecutionContext="true"` is set in the FormXML event definition, D365 passes an `ExecutionContext` object as the first parameter to the function. We currently have a rudimentary mock, but it lacks the critical methods required for true data validation—most notably, the ability to cancel a Save operation.

**The Approach:**
- **`PythonExecutionContext`**: We will upgrade the mock to a full class that maintains state across the form lifecycle.
- **Shared Variables**: Implement `setSharedVariable(key, value)` and `getSharedVariable(key)` so Python hooks can pass data between `OnLoad` and `OnSave` events.
- **Event Source**: Implement `getEventSource()`. For `OnChange` events, this will return the exact `PythonAttribute` or `PythonControl` object that triggered the signal.
- **Save Event Args & Cancellation**: 
  - We will implement `getEventArgs()` which returns a `SaveEventArgs` object during an `OnSave` event.
  - We will implement `.preventDefault()` on this args object.
  - In `xrm_form_renderer.j2`, the `_fire_events("onsave")` routine will check if `preventDefault()` was called. If true, the renderer will abort the local SQLite database transaction, perfectly simulating D365 validation aborts!

### 15. Full `formContext` Object Model Emulation
To reach true 1:1 parity with the Microsoft Client API, we need to flesh out the remaining methods of the `formContext` object model as defined by the official documentation.

**The Approach:**
- **`formContext.ui` Expansions**:
  - Implement `formContext.ui.close()` which natively triggers the PyQt window `close()` method.
  - Implement `formContext.ui.refreshRibbon()` which forces VerseOff to re-evaluate the `<DisplayRules>` and `<EnableRules>` dynamically on the fly.
  - Implement `formContext.ui.getFormType()` which returns `1` for Create and `2` for Update (Existing).
- **`formContext.data.entity` Expansions**:
  - Implement `.getId()` returning the SQLite UUID.
  - Implement `.getEntityName()` returning the logical name.
- **`PythonAttribute` & `PythonControl` Expansions**:
  - Add `.getName()` and `.getLabel()` / `.setLabel()` to dynamically rename PyQt widgets at runtime.

### 16. Dataverse Collections & Deep UI Hierarchy Emulation
Looking at the official Dataverse Client API tree, we are missing the critical "Collection" infrastructure and the deeply nested Tab/Section hierarchy. We need to implement these to support standard JavaScript syntaxes like `formContext.ui.tabs.get("tabName").sections.get("sectionName").setVisible(false)` and `formContext.ui.controls.forEach(...)`.

**The Approach:**
- **`PythonCollection` Engine**: 
  - We will build a native `PythonCollection` class that perfectly mimics the D365 Collection array.
  - It will support `.get(name)`, `.get(index)`, `.getLength()`, and crucially `.forEach(func)`, allowing developers to loop over controls or attributes exactly as they would in JS.
- **Global Collections**:
  - Expose `formContext.data.attributes` (and `data.entity.attributes`) as a `PythonCollection` of all `PythonAttribute` objects.
  - Expose `formContext.ui.controls` as a `PythonCollection` of all `PythonControl` objects.
- **Deep UI Hierarchy**:
  - Implement `PythonTab` (with `.setVisible()`, `.getName()`, `.getLabel()`) and expose as `formContext.ui.tabs`.
  - Implement `PythonSection` (with `.setVisible()`, `.getName()`, `.getLabel()`) and expose as `PythonTab.sections`.
  - Implement `PythonSection.controls` to retrieve controls scoped specifically to that section.
  - **Dynamic Tracking**: `_render_from_xml` will be upgraded to track the PyQt layout references for Tabs (`QTabWidget` pages) and Sections (`QGroupBox` or specific layout bounds), linking them to these Python mock objects.

### 17. Subgrid UI Rendering & GridContext API Emulation
Forms in Dynamics 365 frequently display related records via Subgrids. To support this natively offline, VerseOff must dynamically render native `QTableWidget` elements for subgrids during FormXML parsing, and expose the deep `GridContext` Client API object model to allow developers to interact with the grid programmatically.

**The Approach:**
- **Native Subgrid UI Generation**: 
  - Update `xrm_form_renderer.j2` to detect `<control classid="{E7A81278-8635-4d9e-8D4D-59480B391C5B}">` (the D365 GUID for subgrids) during `_render_from_xml`.
  - It will dynamically spawn a PyQt `QTableWidget` within the section layout instead of a generic text box.
- **`PythonGridControl`**:
  - Upgrade `PythonFormContext.getControl(name)` to return a specialized `PythonGridControl` if the requested control is a subgrid.
  - Implement `.getGrid()` on this control, returning a `PythonGrid` object.
- **`GridContext` Emulation Architecture**:
  - Build `PythonGrid`: Implement `.getTotalRecordCount()`, `.getRows()`, and `.getSelectedRows()` returning `PythonCollection` structures.
  - Build `PythonGridRow`: Implement `.getData()`.
  - Build `PythonGridRowData`: Implement `.getEntity()`.
  - Build `PythonGridEntity`: Implement `.getEntityName()`, `.getEntityReference()`, and `.getPrimaryAttributeValue()`.
- **Result**: Developers can natively run Python loops like `formContext.getControl("Contacts").getGrid().getSelectedRows().forEach(...)` seamlessly against the PyQt `QTableWidget` offline!

### 18. Background Synchronization Engine (Defensive Decisions)
With the Client API layer finalized, VerseOff must now fulfill the core promise of an offline app: resilient data synchronization. Based on your prompt to "take best defensive decisions," we will implement a highly fault-tolerant sync architecture.

**The Approach:**
- **Authentication (`msal`)**: We will integrate the official Microsoft Authentication Library (`msal`) with a persistent `TokenCache`. This ensures the background agent can authenticate silently with Azure AD without prompting the user every 30 minutes.
- **The Polling Engine (`QTimer`)**: We will build `sync_engine.py` into the VerseOff client. When the app launches, it initiates a PyQt `QTimer` that triggers a sync loop every 30 minutes on a background thread (`QThread`) to prevent UI freezing.
- **Optimistic Concurrency (ETags)**:
  - The engine scans the SQLite database for records where `sync_status = 'PENDING'`.
  - It attempts a `PATCH` request to the Dataverse Web API, utilizing the `If-Match: [ETag]` header.
  - If a `412 Precondition Failed` is returned (meaning someone else modified the record online while this user was offline), the engine flags the record as `CONFLICT` in SQLite instead of overwriting the Dataverse data.
- **Fallback REST Provider**: If Dataverse returns a `503 Service Unavailable` or a timeout (simulating a system outage), the engine instantly routes the payload to a `FallbackRESTProvider`. For the MVP, this provider will be configured to target a mock Snowflake REST endpoint.

### 19. Global `Xrm` Object Model Emulation
You linked the overarching `Xrm` Client API. This is the global namespace used across all Dataverse applications for navigation, utility, and offline data operations. Implementing this natively elevates VerseOff from a simple Form renderer to a fully decoupled offline Data and UI platform.

**The Approach:**
- **`Xrm.Navigation`**:
  - Implement `Xrm.Navigation.openAlertDialog(strings, options)` natively mapped to `QMessageBox.warning` or `information`.
  - Implement `Xrm.Navigation.openConfirmDialog(strings, options)` natively mapped to `QMessageBox.question`, returning a Promise-like object or blocking boolean.
- **`Xrm.Utility`**:
  - Implement `Xrm.Utility.getGlobalContext().userSettings.userId` to expose the locally cached Azure AD ID or offline mock ID.

- **`Xrm.WebApi` (The Offline Data Engine)**:
  - This is the most crucial emulation. We will build a translation layer that intercepts JavaScript-style WebAPI calls and routes them to the local SQLite offline cache!
  - `Xrm.WebApi.retrieveRecord(entity, id, options)` -> Executes `SELECT * FROM {entity} WHERE id = ?`.
  - `Xrm.WebApi.retrieveMultipleRecords(entity, options)` -> Extracts OData `$select` and `$filter` parameters and dynamically compiles them into native SQLite `SELECT` and `WHERE` clauses.
  - `Xrm.WebApi.updateRecord(entity, id, data)` -> Executes a local SQLite `UPDATE` and flags the record `sync_status = 'PENDING'` for the Phase 22 background sync engine to pick up later.
- **Global Injection**: The `Xrm` object will be instantiated globally within the `xrm_form_renderer.j2` runtime, making it accessible from *any* custom event script without needing to be passed via the `ExecutionContext`.

### 20. Comprehensive Event Model Parity
Based on the Microsoft Events reference you shared, VerseOff currently supports Form `OnLoad`, Form `OnSave`, and Attribute `OnChange`. To achieve absolute parity, we must support the remainder of the Dataverse execution events natively within the PyQt lifecycle.

**The Approach:**
- **Tab `StateChange`**: We will wire the PyQt `QTabWidget.currentChanged` signal to the event engine to fire `TabStateChange`.
- **Form `PostSave`**: In `save_record()`, after SQLite `UPDATE` completes, VerseOff will explicitly fire a `PostSave` event.
- **`Data OnLoad` & `Subgrid OnLoad`**: We will add hooks to trigger when the primary payload finishes loading, and when Subgrids populate.
- **Event Registration Methods**: We will expand `formContext.getAttribute()` to support `.addOnChange(func)` and `.removeOnChange(func)`, allowing your scripts to *dynamically* attach and detach event listeners at runtime just like JavaScript!

### 21. Programmatic Event Triggers (`fireOnChange`)
Based on the Column OnChange documentation you linked, while we successfully implemented the UI-driven triggers (focus lost) and dynamic listener registration (`addOnChange`), we are missing the ability to trigger these events programmatically from the Python scripts.

**The Approach:**
- **`.fireOnChange()`**: We will expand the `PythonAttribute` object to include the `.fireOnChange()` method natively.
- **Execution Routing**: When a developer calls `formContext.getAttribute("budget").fireOnChange()`, it will instantly instruct the VerseOff engine to execute `self._fire_events("onchange", "budget")`, evaluating both the FormXML static handlers and any dynamically registered `addOnChange` lambda functions in real-time without requiring physical UI interaction.

### 22. Form OnLoad Event Emulation (`ui.addOnLoad`)
Based on the Form OnLoad documentation you linked, while VerseOff perfectly parses static `onload` handlers defined in the FormXML, the Microsoft API dictates that developers can programmatically attach handlers directly to the UI lifecycle via `formContext.ui`.

**The Approach:**
- **`ui.addOnLoad`**: We will expand the `PythonUIContext` object to include `.addOnLoad(func)` and `.removeOnLoad(func)`.
- **Event Lifecycle Integration**: These dynamically registered functions will be bound directly to the internal VerseOff `onload` event registry, guaranteeing they fire precisely when the PyQt form finishes rendering its controls, perfectly preserving the exact timing mechanics of Dataverse.

### 23. Form OnSave Event Emulation (`data.entity.addOnSave`)
Based on the Form OnSave documentation you linked, we already implemented `preventDefault()` and the static FormXML `onsave` mappings, but we missed the programmatic registration methods.

**The Approach:**
- **`data.entity.addOnSave`**: We will expand the `Entity` object under `formContext.data` to natively include `.addOnSave(func)` and `.removeOnSave(func)`.
- **Execution Routing**: These dynamic listeners will be injected into the `"onsave"` dispatch loop, meaning they will execute in sequence with the static FormXML validation scripts the moment the user clicks the PyQt Save ribbon button, with full access to `SaveEventArgs`.

### 24. Asynchronous OnSave & `preventDefaultOnError`
You linked the Form OnSave documentation a *second* time. I see what I missed! Microsoft recently added **Asynchronous Event Handler Support** to the OnSave event, allowing handlers to return Promises. They also added `eventArgs.preventDefaultOnError()`.

**The Approach:**
- **`preventDefaultOnError`**: I will add this method to `SaveEventArgs`.
- **Async Execution**: Currently, VerseOff executes all events synchronously on the PyQt main thread. If a Python validation handler returns an awaitable or mock Promise, VerseOff will natively intercept it, halt the SQLite commit, push the execution to a background `QThread` (to keep the UI responsive), and wait up to 10 seconds (mirroring Dataverse timeouts) for it to resolve before committing the transaction.

### 25. Data OnLoad Extension (`data.refresh()`) & Sync Engine Finalization
You linked the `form-data-onload` event documentation! While we already built the `formContext.data.addOnLoad` listener registration, the documentation reveals that the event fires not only on the initial fetch, but specifically when developers programmatically call `formContext.data.refresh()`, or immediately after a successful save operation.

**The Approach:**
- **`formContext.data.refresh`**: I will expand the `formContext.data` namespace to include the `.refresh(save=False)` function.
- **Refresh Execution**: Calling `.refresh()` will synchronously hit the SQLite database, pull the absolute latest values for the current record, silently overwrite all active PyQt widgets with the new state, and finally trigger the `"dataonload"` event loop to notify all listeners.
- **Save Refreshes**: In `save_record()`, after the SQLite `UPDATE` completes, the system will natively perform a post-save data fetch and fire `"dataonload"` to strictly adhere to the lifecycle.
- **Sync Engine Integration**: To conclude the background syncing architecture, I will transport the robust `SyncWorker` (with the MSAL authentication, ETag optimistic concurrency, and the Snowflake `FallbackRESTProvider`) directly into the `generated_sync.j2` compiler template. This guarantees that every offline app automatically possesses the fault-tolerant sync agent.

### Phase 32 — Packaging the Generator CLI
To allow you to test the VerseOff Maker UI on your machine without manually installing Python dependencies, we will package the generator into a standalone Windows Executable (`.exe`).

**The Approach:**
- **Dependencies (`requirements.txt`)**: Centralize all dependencies (`PyQt6`, `jinja2`, `requests`, `msal`, `lxml`) to ensure a clean build environment.
- **PyInstaller Bundling**: We will use `PyInstaller` to compile the entire `VerseOff` folder into a single `VerseOffMaker.exe`.
- **Resource Bundling (The Tricky Part)**: PyInstaller compiles Python code, but it ignores data files by default. We will write a custom `build.py` script or `.spec` file to explicitly instruct PyInstaller to embed the `templates/` folder (Jinja2 files) and the `schemas/` folder (XSD files) directly into the executable's `_MEIPASS` temp directory at runtime.
- **Runtime Path Resolution**: We must update `code_generator.py` to use `sys._MEIPASS` when resolving the path to the `templates/` folder so it doesn't crash when running as a compiled `.exe`.

### Phase 33 — Maker UI: App Selection Workflow
Currently, the Maker UI (`maker_ui.py`) skips the App selection phase and just dumps every single entity in Dataverse into a massive list for the user to pick from. We will redesign the `MakerWizard` to mimic the Power Apps App Designer:

1. **`AppSelectionPage`**: A new wizard page that calls `MetadataFetcher.get_app_modules()` to present a clean list of all Model-Driven Apps in the environment.
2. **`ComponentReviewPage`**: Once an app is selected, this page pulls the `appmodulecomponents` and lists the included Entities. 
    *   **Trimming**: The developer can uncheck entities they don't want to take offline.
    *   **Adding More**: We will add an "Add Additional Entity" button. This allows developers to manually inject extra tables (e.g., lookup reference tables or audit logs) into the offline app even if they aren't strictly part of the Model-Driven App's SiteMap.
3. **Forms & Views Handling**: For MVP, to keep the offline app robust, the generator will automatically pull **all active Main Forms and System Views** for the selected entities. 
4. **Dashboards & Charts**: *Note: Parsing Dataverse Chart XML and rendering native PyQt QtCharts offline is currently out-of-scope for the MVP, so dashboards will not be selectable yet.*

### Phase 34 — Homepage Grids (Views)
You are absolutely right. While we built the `view_parser.py` and it correctly parses FetchXML for **Subgrids** inside the forms, the *main* landing page of the offline app currently just dumps raw records into a flat `QListWidget`.

We will overhaul the generated `main.py` (via `generated_main.j2`):
1. **Navigation Pane**: Build a left-hand navigation pane (`QListWidget` or `QTreeWidget`) grouping the selected entities.
2. **Dynamic View Switcher**: When an entity is clicked, the right-hand panel loads a `QComboBox` populated with all downloaded System Views (e.g., "Active Accounts", "My Active Accounts") from the SQLite `saved_queries` table.
3. **The Data Grid**: We will inject the exact same `QTableWidget` logic we used for subgrids into the homepage! It will run the selected view's `FetchXML` against the local database and render the exact columns defined in the view's `LayoutXML`.

### Phase 35 — Native Lookup Controls & Views
Currently, Lookups might just render as standard text boxes. We will upgrade them to true Dataverse Lookups:
1. **Lookup UI**: In `xrm_form_renderer.j2`, Lookup attributes will render as a read-only `QLineEdit` paired with a `QPushButton` (Search icon).
2. **Lookup Dialog**: Clicking Search will spawn a native PyQt `QDialog` containing a `QTableWidget`.
3. **Lookup Views**: The dialog will query the `saved_queries` SQLite table for the target entity's default **Lookup View** (`querytype=64`). It will use `view_parser.py` to dynamically render the exact columns and search logic defined by the Maker!

### Phase 38: Associated Views (Related Records)
- Implement a **"Related" Tab** in `XrmFormRenderer`.
- Dynamically generate sub-tabs for 1:N relationships.
- When clicked, spawn a `QTableWidget` grid that queries the **Associated View** (`querytype=2`) for that relationship.
- Update `ViewParser` to dynamically inject a filter condition where the foreign key equals the current record's `id`.

### Phase 39: Native SiteMap Engine
- Update `metadata_fetcher.py` to fully parse `sitemapxml` into a hierarchical dictionary (`Area` -> `Group` -> `SubArea`).
- Save this hierarchy directly into the generated `manifest.json` under a new `"sitemap"` key.
- Overhaul `generated_main.j2`:
  - Replace the flat `QListWidget` with a native `QTreeWidget`.
  - Dynamically render the full SiteMap hierarchy as folders and sub-folders.
  - When a `SubArea` (Entity) leaf node is clicked, execute the standard grid-loading sequence.

### Phase 40: VS Code Native Project Generation
- Ensure the generator outputs a complete, Git-ready Python codebase (which it already does in the `out/` folder).
- Inject a `.vscode/launch.json` file into the generated output so the user can just open the folder in VS Code and hit **F5** to run the app.
- Inject a `.vscode/tasks.json` and a standard `build.py` into the output so the user can run a VS Code build task to compile the generated app into a standalone `.exe` using PyInstaller for their CI/CD pipeline!

### Phase 36 — Quick View Forms
Quick Views allow a form to display read-only data from a related parent record.
1. **Metadata Fetching**: We will update `metadata_fetcher.py` to pull Quick View forms (`type=6`) alongside Main forms.
2. **Nested Rendering**: When `xrm_form_renderer.j2` encounters a Quick View `<control classid="{5C5600E0-1D6E-4205-A272-BE80DA87FD42}">`, it will dynamically instantiate a *nested* instance of `XrmFormRenderer` inside a `QGroupBox`. 
3. **Data Binding**: It will automatically extract the parent record's ID from the corresponding lookup field on the current form and pass it to the nested renderer, perfectly mimicking the D365 web UI!

## User Review Required

> [!IMPORTANT]
> **Maker UI, Grids, Lookups, & Quick Views**
> Are you ready for me to execute this massive upgrade? 
> 1. `maker_ui.py` (App Designer experience)
> 2. `generated_main.j2` (Homepage Grids)
> 3. Native Lookup Dialogs (using Lookup Views)
> 4. Nested Quick View Forms
