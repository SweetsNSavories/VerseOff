# VerseOff Gemini 3.8 Flash Handoff

Date: 2026-09-06

## Mission

Continue VerseOff from the current native .NET foundation. Do not restart the
project and do not replace the native architecture with the legacy Python
prototype.

The product goal is a Microsoft-aligned, Windows-first native application that
generates offline-capable source code from a customer-owned Dataverse
model-driven app. Dataverse remains the write authority. The generated client
uses native .NET MAUI/WinUI controls and local SQLite storage.

## Current repository state

Latest commits:

- `94d7f97` — generated renderer command bar and header/footer regions
- `c76fbf2` — preserve MAUI source-generation settings
- `786247f` — isolate generated project intermediates
- `4a829aa` — persist Dataverse change-tracking cursors
- `d9c5d8c` — native VerseOff foundation

The working tree was clean at handoff.

The native solution is:

```text
native/VerseOff.Native.sln
```

The generated demonstration target is currently at:

```text
C:\vo-target
```

It builds and runs as `ContosoService`. This is a generated sample from
synthetic metadata, not a real customer Dataverse solution.

## Canonical architecture

Read these first:

1. `docs/NATIVE_MICROSOFT_ARCHITECTURE.md`
2. `docs/LICENSE_BOUND_DISTRIBUTION_AND_AUTHENTICATION.md`
3. `docs/ALM_PROFILES_DISTRIBUTION_EXTENSIBILITY.md`
4. `docs/HYBRID_DATA_AND_CHANNEL_INTEGRATION.md`
5. `docs/REGULATED_ENTERPRISE_ACCEPTANCE.md`

Important boundaries:

- Never transpile, decompile, redistribute, or execute Microsoft OOTB or
  third-party proprietary bundles.
- Only verified customer-authored or VerseOff-owned code may be transformed or
  executed.
- Unknown-provenance assets must fail closed.
- The installed client must not contain a client secret.
- A customer-operated gateway owns Dataverse workload authentication.
- Do not add a separate VerseOff user license requirement to the design.

## What is implemented

### Native foundation

- .NET 10 / MAUI / WinUI Windows-first solution.
- Domain metadata model for apps, tables, forms, tabs, sections, controls,
  commands, events, views, web resources, PCF metadata, and timelines.
- Secure metadata validation.
- EF Core SQLite local store and migrations.
- Transactional outbox.
- Protected local values and entitlement lease model.
- Event pipeline with ordering, depth, shared variables, timeout, and
  cancellation.
- Gateway health/session foundation.
- Dataverse pull coordinator and persistent protected delta-link cursors.

### Generator

`native/src/VerseOff.Generator/NativeSourceGenerator.cs` generates a native
target source tree containing:

- Target `.csproj`.
- MAUI application shell.
- `MainPage.xaml` and generated renderer.
- `Resources/Raw/app-definition.json`.
- Generation manifest.
- VerseOff runtime source projects.
- Customer-owned verified assets only.

The generated renderer currently supports:

- SiteMap subareas.
- Visible form tabs.
- Tab columns.
- Visible sections.
- Rows and cells.
- Native text, number, currency, date, boolean, choice, lookup, and custom
  control routing.
- Command bar foundation.
- Form header and footer control regions.

## What is not complete

Do not claim these are production-ready:

- Full Ribbon command behavior and display/enable rules.
- Real BPF rendering and stage transitions.
- Subgrid data provider and offline related-record editing.
- Timeline provider wiring in generated targets.
- Real Dataverse metadata download/import end-to-end.
- Complete Dataverse push synchronization, ETags, tombstones, conflicts, and
  temporary ID remapping.
- Customer JavaScript sandbox and complete Xrm shim.
- PCF execution in generated native targets.
- Graph/Outlook and CTI adapters.
- Signed entitlements and production gateway authentication.
- MSIX signing, Intune deployment, SBOM, accessibility, localization,
  telemetry, and enterprise security evidence.

Current honest product readiness is approximately 30–35%. It is a technical
prototype/pilot, not yet a sellable enterprise product.

## Recommended next five-hour execution order

### 1. Add fixture-driven generated UI coverage

Use synthetic, customer-owned-style metadata fixtures. Do not use Microsoft
proprietary source code.

Add a fixture containing:

- Two tabs.
- Two columns in one tab.
- Multiple sections.
- Header and footer controls.
- A native command.
- A command with a deterministic disabled/display rule.
- A timeline control with a fake in-memory provider.
- A subgrid with a fake local provider.
- A BPF definition with stages.

The fixture should prove that the generator serializes metadata and the target
renderer does not silently drop surfaces.

### 2. Implement generated-target command rules

Create a small deterministic evaluator for supported declarative rules:

- `ValueRule`.
- `EntityPrivilegeRule` only when a security snapshot is present.
- `CustomRule` must fail closed unless an approved customer handler exists.

Never treat unsupported rules as enabled by default.

### 3. Implement native BPF control

Create a VerseOff-owned MAUI control that renders:

- Process name.
- Ordered stages.
- Active stage.
- Completed/current/future visual state.
- Explicit unavailable state when no provider or security snapshot exists.

Keep stage transitions behind an interface so persistence and Dataverse update
logic can be added later.

### 4. Wire Timeline provider into generated targets

Use the existing `TimelineView`, `TimelineViewModel`, and
`CachedTimelineRecordProvider` implementations. Add DI registration in generated
`MauiProgram.cs` and use a safe empty provider for the sample target.

Do not make Timeline appear successful if the provider is unavailable.

### 5. Add subgrid native provider contract

Implement a read-only first version:

- Resolve relationship name.
- Resolve target table.
- Query local cache.
- Render columns from a view definition.
- Show an explicit offline-unavailable message when security or data is absent.

Editing and relationship rollups can remain blocked until synchronization is
complete.

### 6. Improve target generation validation

Add generator tests that:

- Generate multiple tabs/sections.
- Confirm header/footer metadata is preserved.
- Confirm commands are present in `app-definition.json`.
- Confirm timeline and BPF metadata are preserved.
- Confirm Microsoft-origin assets are excluded.
- Build the generated Windows target.

Use synthetic metadata only.

## Validation commands

Run targeted tests first:

```powershell
dotnet test native\tests\VerseOff.Generator.Tests\VerseOff.Generator.Tests.csproj -c Release
dotnet test native\tests\VerseOff.Controls.Tests\VerseOff.Controls.Tests.csproj -c Release
dotnet test native\tests\VerseOff.Metadata.Tests\VerseOff.Metadata.Tests.csproj -c Release
dotnet test native\tests\VerseOff.Storage.Tests\VerseOff.Storage.Tests.csproj -c Release
dotnet test native\tests\VerseOff.Sync.Tests\VerseOff.Sync.Tests.csproj -c Release
```

Build the full native solution:

```powershell
dotnet build native\VerseOff.Native.sln -c Release
```

Generate the sample target:

```powershell
dotnet run --project scratch\GenerateSample\GenerateSample.csproj -c Release
dotnet build C:\vo-target\ContosoService.csproj -c Release
dotnet run --project C:\vo-target\ContosoService.csproj -c Release --no-build
```

Check repository state before committing:

```powershell
git status --short
git diff --check
git log --oneline -8
```

## Coding rules for continuation

- Make surgical changes.
- Preserve existing user changes.
- Use `apply_patch` for manual edits.
- Do not add broad catches or silent fallbacks.
- Prefer explicit unavailable/blocked UI states.
- Keep nullable and warnings-as-errors behavior.
- Do not commit `bin`, `obj`, databases, logs, secrets, or generated temporary
  output.
- Do not amend commits.
- Commit with a focused Conventional Commit message and include:

```text
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Definition of done for this continuation window

At minimum, leave the repository with:

1. One meaningful native feature completed.
2. Targeted tests passing.
3. Generated sample target rebuilt and launched.
4. No proprietary Microsoft or third-party source added.
5. A clean, focused commit.

Do not claim the overall product is commercially ready unless all enterprise
requirements in the canonical architecture documents are actually implemented
and evidenced.
