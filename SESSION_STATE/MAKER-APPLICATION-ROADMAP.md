# 🎯 VerseOff Maker Application Roadmap

**Focus**: Building the **Maker Tool** (not the generated apps)

---

## What We've Built (Foundation)

### Phase 1-2: Core Engine (Complete ✅)
- Form metadata runtime
- 50+ native controls
- OOTB component resolver (3-tier analysis)
- Delta solution ingestion
- SiteMap & navigation generation
- Domain requirements configuration

### Phase 2a-2c: Export Capability (Complete ✅)
- JSON ApplicationDefinition serializer/deserializer
- OfflinePackageWriter for distribution
- Quote app sample (proof of concept)
- Payload reduction verified: **9.0x-10.5x**
- All tests passing, build clean

---

## What We Need to Build: The Maker Tool

### The Maker is:
**A user-facing application that**:
1. Takes a Dataverse/D365 model-driven app as input (solution package)
2. Analyzes which OOTB components are needed
3. Allows user to configure/customize the extraction
4. Exports to offline-ready format (JSON, mobile app, etc.)
5. Packages for distribution

### NOT Just a Library
- Current Phase 2 code is reusable library/backend
- But users need a **Maker application** to use it
- Could be: console app, desktop app, web app, Visual Studio extension

---

## Maker UI Mockup

```
┌─────────────────────────────────────────────────┐
│  VerseOff Maker - Model-Driven App Generator   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Step 1: Select Your App                        │
│  ┌─────────────────────────────────────────┐   │
│  │ [Browse...] Choose solution.zip          │   │
│  │ File: contoso_quotes_1.0.0.0.zip ✓      │   │
│  │ Size: 156 KB                             │   │
│  │ App Name: Contoso Quote Manager           │   │
│  │ Publisher: Contoso Corp                   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Step 2: Configure OOTB Components             │
│  ┌─────────────────────────────────────────┐   │
│  │ ☑ Use App Module definition              │   │
│  │ ☑ Resolve OOTB forms/views/dashboards   │   │
│  │ ☑ Include navigation (SiteMap)           │   │
│  │                                          │   │
│  │ OOTB Selection Strategy:                  │   │
│  │ ◉ Static (from AppModule)                │   │
│  │ ◯ Runtime (with App Insights)            │   │
│  │ ◯ Domain Config (from YAML)              │   │
│  │ ◯ All (union of above)                   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Step 3: Select Output Format                  │
│  ┌─────────────────────────────────────────┐   │
│  │ ◉ JSON Offline Bundle (recommended)     │   │
│  │  └─ For mobile, web, offline use         │   │
│  │ ◯ C# Source (for .NET compilation)      │   │
│  │ ◯ MSIX Package (native Windows)         │   │
│  │                                          │   │
│  │ Compression: ☑ Gzip optimal             │   │
│  │ Target Size: ~10-15 KB (mobile)         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Step 4: Review & Export                       │
│  ┌─────────────────────────────────────────┐   │
│  │ Summary:                                 │   │
│  │ - Input: 156 KB solution                 │   │
│  │ - Custom Forms: 3                        │   │
│  │ - OOTB Tables: 5 (quote, account, etc)  │   │
│  │ - Navigation Items: 12                   │   │
│  │ - Estimated Output: 8-12 KB             │   │
│  │ - Compression: 9.0x reduction           │   │
│  │                                          │   │
│  │ [Generate] [Save As...] [Cancel]        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│ Status: Ready to generate ✓                    │
└─────────────────────────────────────────────────┘
```

---

## Architecture: Maker Application

### Option A: Console Application (Simple)
```
User Command:
  $ verseoff-maker.exe --input contoso_quotes.zip --output ./dist --format json

Output:
  ✓ Analyzing solution...
  ✓ Resolving OOTB components...
  ✓ Serializing to JSON...
  ✓ Creating manifest...
  ✓ Compressing package...
  ✓ Done! Output: ./dist/contoso_quotes.zip (8.3 KB)
```

### Option B: Windows Desktop Application (WPF/WinUI)
```
User clicks "Browse Solution"
  ↓
Maker loads solution package
  ↓
Shows configuration wizard (Steps 1-4 above)
  ↓
User clicks "Generate"
  ↓
Real-time progress (analyzing, resolving, exporting)
  ↓
Save dialog → user gets offline bundle
```

### Option C: Web Application (ASP.NET Core)
```
User visits: https://maker.verseoff.dev
  ↓
Drag-drop solution.zip
  ↓
Configure in browser
  ↓
Download generated bundle
```

### Option D: Visual Studio Extension
```
Right-click solution in Solution Explorer
  ↓
"Generate Offline Bundle with VerseOff"
  ↓
Configuration dialog
  ↓
Output folder gets generated offline package
```

---

## Recommended Path: Start with Console App

### Why Console First?
1. ✅ Fastest to build (1-2 days)
2. ✅ No UI framework complexity
3. ✅ Can test all core logic
4. ✅ Good foundation for web/desktop versions
5. ✅ DevOps-friendly (scripting, automation)

### Console Command Structure
```
verseoff-maker.exe [OPTIONS]

OPTIONS:
  --input <path>           Path to solution.zip (required)
  --output <path>          Output directory (default: ./dist)
  --format <format>        json|csharp|msix (default: json)
  --compression <level>    none|fast|optimal (default: optimal)
  --ootb-strategy <s>      static|runtime|domain|all (default: static)
  --config <yaml>          Domain requirements YAML file
  --verbose                Show detailed output
  --validate-only          Don't generate, just validate
  --help                   Show help
```

### Example Usage
```bash
# Basic: Generate JSON package
verseoff-maker --input myapp.zip --output ./dist

# With domain config
verseoff-maker --input myapp.zip --config requirements.yaml --format json

# Validation only
verseoff-maker --input myapp.zip --validate-only --verbose

# Full options
verseoff-maker \
  --input myapp.zip \
  --output ./packages \
  --format json \
  --compression optimal \
  --ootb-strategy domain \
  --config domain-config.yaml \
  --verbose
```

---

## Implementation Plan: Build the Console Maker

### Phase 3a: Console App Shell (2-3 days)
**Deliverables**:
- `VerseOff.Maker.Console` project (.NET 10)
- Command-line argument parsing
- Integration with Phase 2 library (DataverseSolutionImporter)
- Basic error handling and logging
- Help/usage documentation

**Files to Create**:
```
native/src/VerseOff.Maker/
  ├─ Program.cs                      (entry point, arg parsing)
  ├─ MakerOptions.cs                 (command-line options)
  ├─ MakerCommand.cs                 (execution logic)
  ├─ ConsoleFormatter.cs             (progress output)
  └─ MakerValidator.cs               (input validation)

native/tests/VerseOff.Maker.Tests/
  ├─ MakerE2ETests.cs                (end-to-end console tests)
  ├─ MakerOptionsTests.cs            (arg parsing tests)
  └─ MakerValidatorTests.cs          (validation tests)

Examples:
  ├─ maker-basic.sh                  (simple example)
  ├─ maker-with-config.sh            (domain config example)
  └─ README.md                        (usage guide)
```

### Phase 3b: Maker UI (Web or Desktop) (4-6 days)
**After console is stable**, choose one:
- **Option 1**: Blazor Web App (ASP.NET Core) - easiest cross-platform
- **Option 2**: WinUI 3 Desktop App - native Windows experience
- **Option 3**: Both (shared library + two UIs)

---

## What Success Looks Like

### Phase 3a Complete (Console Maker)
```
$ verseoff-maker --input quote-app.zip --output ./dist --verbose

✓ Validating input...
  - File size: 156 KB
  - Format: Microsoft solution package
  - Publisher: Microsoft Corporation
  
✓ Loading solution...
  - Custom entities: 0
  - Custom forms: 3
  - Custom views: 2
  - OOTB tables referenced: 5

✓ Resolving OOTB components...
  - Account table + main form ✓
  - Contact table + main form ✓
  - Quote table (3 forms, 2 views) ✓
  - Caching: 3 forms, 3 views from BundledOOTBCatalog

✓ Generating offline package...
  - Serializing ApplicationDefinition...
  - Writing FormXml files...
  - Writing FetchXml queries...
  - Creating manifest with checksums...
  - Compressing package...

✓ Package ready!
  - Output: ./dist/quote-app-offline.zip
  - Size: 8.3 KB (compressed)
  - Reduction: 9.0x vs. original
  - Manifest: 8b4288c9353afa9989230bcc80f5b5e97affdd362caf9e9d55a8403e1d84005b
  
✓ Complete in 2.1 seconds
```

---

## Current Status & Next Steps

### ✅ Complete
- Phase 1: Form runtime, controls
- Phase 2: OOTB resolver, 3-tier analysis
- Phase 2a: JSON serialization/deserialization
- Phase 2c: Quote app validation (9x payload reduction)

### 🚀 Ready to Start
- **Phase 3a: Console Maker Application**
  - Estimated: 2-3 days
  - Build & test: All Phase 1-2c code already stable
  - Focus: User-facing CLI tool

### 📋 After Console
- Phase 3b: Web/Desktop UI
- Phase 3c: Activity Timeline (if prioritized)
- Phase 3d: Packaging & distribution

---

## Questions for You

1. **Console vs UI**: Should we start with console app first, or do you need UI immediately?
2. **Distribution**: How should users get the Maker?
   - Built .exe download?
   - NuGet package?
   - dotnet tool install?
   - Web-based service?
3. **Target Users**: Who uses the Maker?
   - ISVs building offline apps?
   - Enterprise IT for BCDR?
   - Both?

---

**Status**: Ready to build Phase 3a (Console Maker)  
**Estimated Duration**: 2-3 days  
**Dependencies**: All satisfied (Phases 1-2c complete)  
**Blockers**: None
