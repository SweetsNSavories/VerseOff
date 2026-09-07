# Quick Reference - VerseOff Metadata Framework

## Build & Test Commands

```bash
# Full build + test
cd native
dotnet build && dotnet test --no-build

# Quick build only
dotnet build

# Test metadata only
dotnet test native/tests/VerseOff.Metadata.Tests --no-build -v n

# Watch mode (continuous)
dotnet watch test native/tests/VerseOff.Metadata.Tests
```

---

## API Usage Examples

### 1. Static Analysis Only (AppModule declares)
```csharp
var analyzer = new AppModuleRequirementsAnalyzer();
var result = AppModuleRequirementsAnalyzer.AnalyzeStatic(appModule);
// result.AnalysisTier == AnalysisTier.StaticOnly
// result.RequiredTables: all tables app references
```

### 2. With Runtime Data (App Insights usage)
```csharp
var usageReport = new AppInsightsUsageReport
{
    HasData = true,
    AccessedFormIds = new HashSet<Guid> { /* form IDs */ },
    AccessedViewIds = new HashSet<Guid> { /* view IDs */ },
    AccessedTables = new HashSet<string> { "account", "quote" }
};

var result = AppModuleRequirementsAnalyzer.AnalyzeWithRuntime(appModule, usageReport);
// result.RequiredFormIds: only accessed forms
```

### 3. With Domain Requirements (force-includes)
```csharp
var domainConfig = DomainRequirementsLoader.LoadFromYaml("requirements.yaml");
var result = AppModuleRequirementsAnalyzer.AnalyzeWithDomainRequirements(appModule, domainConfig);
// result.RequiredTables: union of declared + force-included
```

### 4. Full 3-Tier Analysis
```csharp
var result = AppModuleRequirementsAnalyzer.AnalyzeFull(appModule, usageReport, domainConfig);
// Static + Runtime + Domain combined
// result.AnalysisTier == AnalysisTier.Full
```

---

## YAML Domain Requirements Format

**File**: `requirements.yaml`
```yaml
forceIncludeTables:
  - quote
  - quotedetail
  - account
  - contact
forceIncludeForms:
  - 00000000-0000-0000-0000-000000000001
  - 00000000-0000-0000-0000-000000000002
forceIncludeViews:
  - 11111111-1111-1111-1111-111111111111
```

**Load in code**:
```csharp
var config = DomainRequirementsLoader.LoadFromYaml("requirements.yaml");
if (config.HasRequirements)
{
    // Apply config
}
```

---

## Next: Implement BundledOOTBCatalog

**Location**: `native/src/VerseOff.Metadata/BundledOOTBCatalog.cs`

**Skeleton**:
```csharp
public sealed class BundledOOTBCatalog : IOOTBComponentResolver
{
    public FormDefinition? TryGetForm(Guid formId)
    {
        // Load from embedded XSD resources
    }

    public ViewDefinition? TryGetView(Guid viewId)
    {
        // Load from embedded XSD resources
    }

    public NavigationDefinition GenerateDefaultNavigation()
    {
        // Return default navigation
    }
}
```

**Resources to load**: XSD files embedded in csproj (line 8-11)
- Path: `VerseOff.Metadata.Schemas.*`

---

## Commit Convention

Use Conventional Commits:
```
feat(scope): short description
docs: longer explanation if needed

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

Examples:
- `feat(metadata): implement bundled OOTB catalog resolver`
- `fix(metadata): handle missing form IDs in resolver`
- `test(metadata): add BundledOOTBCatalog unit tests`

---

## Key Classes & Namespaces

```
VerseOff.Metadata
├── AppModuleRequirementsAnalyzer     → 3-tier analysis
├── DomainRequirementsLoader          → YAML + App Insights
├── AppModuleComponentAnalyzer        → Extract requirements
├── IOOTBComponentResolver            → Interface for resolvers
├── NullOOTBComponentResolver         → Placeholder impl
├── SchemaRegistry                    → XSD validation
├── SiteMapGenerator                  → XML generation
└── MetadataSchemaMap                 → 11 schema registry

VerseOff.Domain
├── ApplicationDefinition             → Core data model
├── ModelDrivenAppDescriptor          → App metadata
└── FormDefinition, ViewDefinition    → Component types
```

---

## Testing Checklist Before Commit

- [ ] `dotnet build` passes (0 errors, 0 warnings)
- [ ] `dotnet test --no-build` passes (147/147)
- [ ] No unused imports or commented code
- [ ] XML docs on public methods
- [ ] Commit message follows Conventional Commits
- [ ] No secrets or generated files staged

---

## Useful Git Commands

```bash
# See what changed
git diff

# Stage all changes
git add -A

# Commit
git commit -m "feat: description"

# Push (when ready)
git push origin agents/verseoff-app-sourcecode-generator

# Revert last commit (if needed)
git reset --soft HEAD~1
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `YamlDotNet not found` | Missing NuGet restore | `dotnet restore` |
| `CS0144 Cannot create instance of abstract type` | Using `new()` for ISet<T> | Use `new HashSet<T>()` |
| `CA1822 Member can be marked as static` | Instance methods with no state | Add `static` keyword |
| `Tests timeout` | Heavy integration test | Increase timeout in .runsettings |

---

## Progress Tracking

**Track your work in `native/SESSION_TODOS.md`** or use git branches:
```bash
git checkout -b feature/bundled-ootb-catalog
# ... make changes ...
git commit -m "feat(metadata): implement BundledOOTBCatalog"
git push origin feature/bundled-ootb-catalog
# Create PR from web UI
```

---

Last updated: Just now ✅
