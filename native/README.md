# VerseOff Native

This solution is the shipping .NET implementation described by the repository
architecture documents. The Python/PyQt project outside this folder is a
prototype and compatibility-fixture source.

## Projects

- `VerseOff.Domain`: canonical models, ownership policy, entitlement, and sync contracts.
- `VerseOff.Metadata`: XSD validation and metadata ingestion.
- `VerseOff.Storage`: EF Core SQLite device cache and transactional outbox.
- `VerseOff.ClientApi`: native Client API contracts, event pipeline, and constrained customer-script host.
- `VerseOff.Generator`: deterministic standalone MAUI source generation for a selected app.
- `VerseOff.Controls`: clean-room native fields, first-party control mappings, and Activity Timeline.
- `VerseOff.Sync`: Dataverse synchronization orchestration.
- `VerseOff.ReadModel`: security-trimmed local overlays and Microsoft SQL read projections.
- `VerseOff.Integrations`: Microsoft Graph inbox delta and signed CTI signal contracts.
- `VerseOff.Gateway`: customer-operated BCDR gateway. The installed app has no Entra client ID.
- `VerseOff.App`: Windows-first VerseOff Maker. It loads a solution ZIP/folder,
  lists model-driven apps, verifies ownership, and generates target source.
- `tests`: MSTest contract and regression projects.

## Build

```powershell
dotnet restore .\VerseOff.Native.sln
dotnet build .\VerseOff.Native.sln -c Release
dotnet test .\VerseOff.Native.sln -c Release --no-build
```

The MAUI Windows workload is required to build `VerseOff.App`.

Run the complete validation pipeline with:

```powershell
.\eng\Invoke-NativeValidation.ps1
```

## Use VerseOff Maker

```powershell
dotnet run --project .\src\VerseOff.App\VerseOff.App.csproj -c Release
```

1. Choose an exported Dataverse solution ZIP or enter an unpacked solution
   folder.
2. Load and select one discovered model-driven app.
3. Confirm the customer owns the named solution and publisher assets.
4. Choose an output root and generate.

The output is a standalone Windows-first .NET MAUI source project containing
the canonical selected-app model, native form rendering source, approved
hash-verified customer assets, and a deterministic generation manifest.
Microsoft and unapproved partner bundles are never requested or copied.

## Gateway configuration

The gateway fails closed when signing or Dataverse services are not configured.
For entitlement issuance, configure `EntitlementSigning` through the
customer's protected configuration provider:

- `PrivateKeyPemPath`
- `Issuer`
- `SigningKeyId`
- `LeaseHours` (maximum 720)

Never commit the private key. The default empty settings keep entitlement
issuance unavailable while health and authentication endpoints remain
operational.

For a signed MSIX, install the signing certificate in the current user's
certificate store and run:

```powershell
.\eng\Publish-MakerMsix.ps1 -CertificateThumbprint <40-character-thumbprint>
```
