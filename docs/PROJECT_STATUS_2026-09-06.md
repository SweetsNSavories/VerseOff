# VerseOff Project Status — 2026-09-06

## Executive status

VerseOff is an executable native prototype/pilot. It is not yet ready for
general commercial sale or regulated-enterprise deployment.

Approximate completion:

| Pillar | Completion |
|---|---:|
| Native .NET foundation | 60% |
| Metadata/import pipeline | 55% |
| Source-code generator | 50% |
| Form UI rendering | 40% |
| Ribbon/commands | 25% |
| BPF | 5% |
| Timeline | 25% |
| Offline storage/cache | 45% |
| Dataverse synchronization | 30% |
| Customer scripting/runtime | 20% |
| Security/licensing/entitlements | 25% |
| Gateway/integration services | 20% |
| Packaging/deployment/Intune | 10% |
| Testing/enterprise hardening | 20% |

Overall prototype readiness: approximately 30–35%.

These percentages are directional engineering estimates, not audited project
metrics.

## Latest verified state

- Native Maker builds and runs.
- Generated target builds with zero warnings and zero errors.
- Generated target launches as `ContosoService`.
- Generated sample target path: `C:\vo-target`.
- Generator tests: 5 passed.
- Latest renderer commit: `94d7f97`.
- Latest generator fixes: `c76fbf2`, `786247f`.
- Latest sync cursor commit: `4a829aa`.

## Current generated UI behavior

The generated target reads `Resources/Raw/app-definition.json` and renders:

```text
SiteMap subareas
  -> selected table
    -> form header controls
    -> command bar
    -> visible tabs
      -> columns
        -> visible sections
          -> rows
            -> cells
              -> native controls
    -> form footer controls
```

The sample shown to the user contains one synthetic Accounts table, one General
tab, one Summary section, and one Name field. That limited screenshot reflects
the fixture size, not the renderer's maximum metadata shape.

## Immediate product risks

1. The sample is synthetic; a real Dataverse solution ZIP has not yet been
   used end-to-end in the native Maker.
2. Command metadata is parsed/modelled, but most command actions and rules are
   not executed.
3. Timeline, BPF, subgrid, PCF, and customer script runtime wiring is
   incomplete in generated targets.
4. Dataverse synchronization is foundation-level, not production-complete.
5. No production packaging, signing, deployment, support, or security evidence
   exists.

## Handoff principle

Continue from the native solution and existing commits. Treat the legacy
Python/PyQt implementation as a research and fixture source only. Do not
restart or delete it unless a specific migration task requires that.
