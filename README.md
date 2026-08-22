# VerseOff — Dynamics 365 Offline Client Engine

A model-driven offline desktop client for Microsoft Dynamics 365 Customer Engagement, built with **Python**, **PyQt6**, and **Jinja2** code generation.

VerseOff fetches your Dynamics 365 organization metadata (entities, forms, views, ribbons, sitemap, BPFs, web resources) via the Dataverse Web API, generates a fully functional offline PyQt6 desktop application, and syncs data bidirectionally when connectivity is available.

---

## Architecture

```
┌──────────────────────────────────────────────┐
│              VerseOff Engine                 │
├──────────────────────────────────────────────┤
│  metadata_fetcher.py  → Dataverse Web API   │
│  code_generator.py    → Jinja2 Templates    │
│  form_parser.py       → FormXML → PyQt6     │
│  canvas_parser.py     → Canvas JSON → PyQt6 │
│  schema_builder.py    → SQLite DDL           │
│  sync_engine.py       → Delta Sync           │
│  auth.py              → MSAL OAuth2          │
├──────────────────────────────────────────────┤
│           Jinja2 Templates                   │
│  generated_main.j2    → Main Window + SiteMap│
│  generated_db.j2      → SQLite ORM Layer     │
│  xrm_form_renderer.j2 → XRM Form Engine     │
│  view_parser.j2       → FetchXML → SQL       │
│  sync_engine.j2       → Background Sync      │
├──────────────────────────────────────────────┤
│          Generated Output (out/)             │
│  main.py              → PyQt6 Desktop App    │
│  db.py                → Local SQLite DB      │
│  xrm_form_renderer.py → Dynamic Form Render  │
│  view_parser.py       → View Grid Engine     │
│  sync_engine.py       → Cloud Sync Worker    │
│  manifest.json        → Full Org Metadata    │
└──────────────────────────────────────────────┘
```

## Features

- **Model-Driven UI Generation**: Reads Dynamics 365 metadata (EntityDefinitions, FormXML, SavedQueries, RibbonXml, SiteMap) and generates a complete native desktop app.
- **XSD-Compliant Ribbon Parsing**: Parses `RibbonCore.xsd` / `RibbonTypes.xsd` schema-compliant XML, resolves `$LocLabels` and `$Resources` tokens, and separates HomepageGrid vs Form vs SubGrid command bars.
- **FormXML Runtime Renderer**: Dynamically renders D365 forms with tabs, sections, fields, subgrids, lookups, option sets, and header metrics.
- **Schema-Faithful Form Layouts**: Preserves FormXML tab columns, percentage widths, section visibility, row/cell spans, label placement, Main vs Quick View form types, and localized labels.
- **FetchXML → SQL Translation**: Converts Dynamics 365 FetchXML view definitions to SQLite-compatible SQL for offline querying.
- **Native Subgrids and Views**: Resolves FormXML subgrid parameters, relationships, saved-query FetchXML filters/order, and LayoutXML columns against local records.
- **PCF Runtime and Fallbacks**: Extracts `customcontrol` manifests and linked resources, runs self-contained standard PCF bundles in an isolated Chromium host, maps first-party and dataset controls to native widgets, and fails closed for unavailable required features or virtual React controls.
- **Canvas App Parser**: Unpacks `.msapp` Canvas JSON layouts into PyQt6 widget hierarchies.
- **Business Process Flow (BPF)**: Renders BPF chevron stage indicators with cross-entity stage support.
- **Xrm Client API**: Loads original form and Ribbon libraries into Chromium/V8 with form, execution, save, grid-row, user, organization, app, process, navigation, utility, and SQLite-backed WebApi contexts.
- **Web Resource Hosting**: Packages text and binary web resources transitively, provides embedded `parent.Xrm` and standalone `GetGlobalContext`, and supports cross-process `getContentWindow()` function invocation without exposing raw DOM objects.
- **Fail-Closed Script Boundary**: Blocks direct network access and rejects server-only, device-only, Copilot, or otherwise unsupported calls instead of returning fake success.
- **Background Delta Sync**: Automatic bidirectional sync with conflict detection and resolution.
- **Microsoft Fluent 2 UI**: Segoe UI typography, rounded cards, zebra-striped grids, Dynamics blue accents.
- **Fluent Controls**: Uses a platform-independent Fluent chevron instead of the legacy native Windows combo-box arrow.

## Quick Start

### Prerequisites
- Python 3.10+
- PyQt6
- MSAL (Microsoft Authentication Library)

### Install Dependencies
```bash
pip install PyQt6 PyQt6-WebEngine msal requests jinja2
```

### Generate from a Model-Driven App

Launch the existing VerseOff Maker:

```bash
python VerseOff/main.py
```

On Windows, you can also double-click `run_maker.bat`. This source launcher is
useful on managed devices that block locally built, unsigned executables.

The wizard authenticates to Dataverse, lists the environment's model-driven
apps, loads the selected app's tables and business-process dependencies, and
lets you choose a destination for the generated source project. The target
folder includes its manifest, Python source, dependency list, VS Code launch
and build tasks, a README, and a PyInstaller build script.

To package VerseOff Maker itself as a Windows executable:

```bash
python VerseOff/build.py
```

### Configure & Generate
```bash
# 1. Fetch metadata from your D365 org
python VerseOff/metadata_fetcher.py

# 2. Generate the offline app
python -c "
import json, sys
sys.path.append('VerseOff')
from code_generator import CodeGenerator
m = json.load(open('VerseOff/out/manifest.json', encoding='utf-8'))
CodeGenerator(output_dir='VerseOff/out').generate(m)
"

# 3. Run the offline client
python VerseOff/out/main.py
```

### Run Tests
```bash
pytest tests/ -v
```

## Project Structure

```
VerseOff/
├── auth.py                  # MSAL OAuth2 authentication
├── metadata_fetcher.py      # Dataverse Web API metadata extraction
├── code_generator.py        # Jinja2 template renderer
├── form_parser.py           # FormXML parser
├── canvas_parser.py         # Canvas App JSON parser
├── schema_builder.py        # SQLite schema generator
├── sync_engine.py           # Delta sync engine
├── maker_ui.py              # App configuration UI
├── templates/
│   ├── generated_main.j2    # Main window + SiteMap template
│   ├── generated_db.j2      # SQLite database layer template
│   ├── xrm_form_renderer.j2 # XRM form engine template
│   ├── view_parser.j2       # FetchXML→SQL template
│   └── sync_engine.j2       # Sync worker template
├── schemas/                 # D365 XSD schemas (Ribbon, SiteMap, etc.)
├── out/                     # Generated application output
│   ├── main.py
│   ├── db.py
│   ├── xrm_form_renderer.py
│   ├── view_parser.py
│   ├── sync_engine.py
│   └── manifest.json
tests/
├── test_generated_app.py
└── test_offline_engine.py
```

## License

MIT
