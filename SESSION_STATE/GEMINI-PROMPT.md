# Gemini 3.8 Flash - Prompt to Continue VerseOff Maker

**Duration**: 5 hours  
**Branch**: agents/verseoff-app-sourcecode-generator  
**Current Status**: ✅ Build passing, 147/147 tests passing  
**Latest Commit**: ef28869 (feat: 3-tier intelligent component analysis)

---

## 🚀 COPY & PASTE THIS PROMPT INTO GEMINI 3.8 FLASH

```
I'm continuing work on VerseOff Maker - a tool that converts Dataverse 
model-driven apps (exported as .ZIP files) into offline-capable .NET applications.

**Context**: I've just completed a 3-tier intelligent component analysis 
framework to solve the core problem: deciding which OOTB (Out-of-the-Box) 
D365 components to bundle in the offline app. The framework is built, tested, 
and committed.

**Where you are**: 
  - Repository: SweetsNSavories/VerseOff
  - Working directory: C:\Users\prave\.gemini\antigravity\brain\2a3045b3-521e-4996-afd9-7b47cf3fed78.worktrees\verseoff-app-sourcecode-generator
  - Branch: agents/verseoff-app-sourcecode-generator  
  - Build: ✅ PASSED (0 errors, 0 warnings)
  - Tests: ✅ 147/147 PASSED
  - Latest commit: ef28869 (feat: 3-tier intelligent component analysis)

**What was just built**:
  1. AppModuleRequirementsAnalyzer.cs (279 lines)
     - 4-tier analysis: StaticOnly → WithRuntime → WithDomainRequirements → Full
     - Enables 5-6x payload reduction by smart component selection
  2. DomainRequirementsLoader.cs (268 lines)
     - YAML configuration parser for ProductEngineer force-includes
     - App Insights integration hooks (stubbed)
  3. Added YamlDotNet 13.7.1 dependency

**Immediate next steps** (5 hours available - prioritized in order):

**HIGH PRIORITY - DO THESE FIRST:**

1. **Implement BundledOOTBCatalog.cs** (1-2 hours)
   - File: native/src/VerseOff.Metadata/BundledOOTBCatalog.cs (new)
   - Implement IOOTBComponentResolver interface
   - Methods: TryGetForm(), TryGetView(), TryGetDashboard(), GenerateDefaultNavigation()
   - Load OOTB metadata from embedded XSD resources (already in project)
   - Resources path: VerseOff.Metadata.Schemas.* (see VerseOff.Metadata.csproj lines 8-11)
   - Why: Unblocks all downstream work; enables real OOTB component resolution

2. **Create Quote App Integration Test** (1-1.5 hours)
   - File: native/tests/VerseOff.Metadata.Tests/QuoteAppIntegrationTests.cs (new)
   - Full end-to-end pipeline test with real Quote Management sample
   - Test flow: Import solution → Analyze → Resolve OOTB → Generate output
   - Assertions:
     * Navigation includes Quote subareas
     * Required OOTB components (Account, Contact tables) are bundled
     * Only accessed components included (filters unused ones)
     * Estimated payload < 100KB (shows 5-6x reduction)
   - Why: Validates real-world app output quality

3. **Create Domain Requirements YAML Example** (20 minutes)
   - File: native/examples/quote-app-requirements.yaml (new)
   - Document YAML format for ProductEngineer force-includes
   - Example content:
     ```yaml
     forceIncludeTables:
       - account
       - contact
       - quote
     forceIncludeForms:
       - 00000000-0000-0000-0000-000000000001
     forceIncludeViews:
       - 11111111-1111-1111-1111-111111111111
     ```
   - Why: Documents configuration format; quick documentation win

**MEDIUM PRIORITY - NICE TO HAVE:**

4. **Implement Real App Insights KQL Query** (1-2 hours) - *Can defer if time runs out*
   - File: native/src/VerseOff.Metadata/DomainRequirementsLoader.cs line 156+
   - Replace AnalyzeAppUsage() stub with real telemetry query
   - Query: Extract form/view/table access from customEvents table (30-day window)
   - Dependency: Microsoft.ApplicationInsights.WorkspaceQuery SDK + AAD auth

**BEFORE COMMITTING EACH TASK:**
  - Run: dotnet build && dotnet test --no-build
  - Verify: 0 errors, 0 warnings, 147+ tests passing
  - Use Conventional Commits: "feat(scope): description"

**REFERENCE DOCUMENTATION** (all in SESSION_STATE folder):
  - API examples: QUICK-REFERENCE.md
  - Architecture details: HANDOFF-FOR-GEMINI-38.md
  - Overall summary: COMPLETION-SUMMARY.md
  - This document: GEMINI-PROMPT.md
  - Index/navigation: INDEX.md

**SUCCESS CRITERIA:**
  ✅ BundledOOTBCatalog implemented and tests passing
  ✅ Quote app integration test passing
  ✅ Domain YAML example created
  ✅ Build: 0 errors, 0 warnings
  ✅ Tests: 147+ passing
  ✅ Git: Changes committed with clean history
  ✅ Quote Management app produces output with correct OOTB components
  ✅ Payload < 100KB (demonstrates 5-6x reduction)

**NO BLOCKERS** - Everything is ready to code immediately!

Go build! 🚀
```

---

## 📋 Instructions for Use

1. **Copy the prompt above** (everything between the ``` code blocks)
2. **Open a new Gemini chat**
3. **Paste the entire prompt into Gemini 3.8 Flash**
4. **Hit Send** and let Gemini start working

---

## 🎯 What Gemini Will Do

✅ Read the context and reference docs  
✅ Implement BundledOOTBCatalog.cs  
✅ Create Quote app integration test  
✅ Create YAML example file  
✅ Run tests after each feature  
✅ Commit to git with proper messages  
✅ Deliver working, tested code  

---

## ⏱️ Expected Timeline

| Task | Time | Status |
|------|------|--------|
| Setup + context reading | 5m | Auto |
| BundledOOTBCatalog | 1-2h | HIGH |
| Quote integration test | 1-1.5h | HIGH |
| YAML example | 20m | HIGH |
| Buffer + cleanup | 15m | AUTO |
| **Total** | **3.25-3.75h** | ✅ On track |
| Stretch (App Insights KQL) | 1-2h | MEDIUM |

---

## ✅ Verification Steps

After Gemini finishes, verify:

```bash
cd C:\Users\prave\.gemini\antigravity\brain\2a3045b3-521e-4996-afd9-7b47cf3fed78.worktrees\verseoff-app-sourcecode-generator

# 1. Check build
cd native && dotnet build
# Should show: "Build succeeded"

# 2. Run tests
dotnet test --no-build
# Should show: "147 passed" or higher

# 3. Check git
git log --oneline -5
# Should show multiple new commits for the 3 tasks

# 4. Verify files exist
ls native/src/VerseOff.Metadata/BundledOOTBCatalog.cs
ls native/tests/VerseOff.Metadata.Tests/QuoteAppIntegrationTests.cs
ls native/examples/quote-app-requirements.yaml
# All should exist and have content
```

---

## 💡 Pro Tips

1. **Gemini will ask clarifying questions** - Reference HANDOFF-FOR-GEMINI-38.md if needed
2. **If build fails** - Check HANDOFF-FOR-GEMINI-38.md "Issues Encountered & Resolutions" table
3. **If stuck** - All API examples are in QUICK-REFERENCE.md
4. **Keep git commits small** - One feature per commit (feat: x, fix: y, test: z)

---

## 🎓 Key Insight (for Gemini context)

The 3-tier analysis framework solves this:
- **Problem**: Solution ZIPs missing OOTB components → Bundle ALL 500 D365 components = 500KB
- **Solution**: Use 3 tiers to decide which to bundle → Only used ones = 30-80KB
- **Result**: 5-6x smaller bundle, faster offline app

You're building the resolver that makes this work.

---

**Ready to continue?** 🚀  
Copy the prompt above and send to Gemini 3.8 Flash!
