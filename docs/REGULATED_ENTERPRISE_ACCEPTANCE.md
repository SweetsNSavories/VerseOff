# VerseOff Regulated Enterprise Acceptance Profile

## Scope

This document describes what is most likely to pass architecture, information
security, operational resilience, third-party risk, privacy, and production
support review at a highly regulated global financial institution.

It does not claim to represent BNY's confidential internal standards or
guarantee approval. Final acceptance depends on the bank's architecture review
board, CISO organization, data owners, vendor management, legal, privacy,
records management, and business-service resiliency owners.

Public BNY materials emphasize cybersecurity governance, recognized control
frameworks, third-party risk management, supply-chain accountability, business
continuity, disaster recovery, incident management, and operational
resilience. VerseOff should be prepared to provide evidence in all of those
areas.

## Executive answer

The architecture most likely to be accepted is:

- Windows-first enterprise deployment before expanding to mobile.
- C#/.NET LTS, WinUI 3/.NET MAUI, MSAL.NET, and Microsoft-supported data
  providers.
- Dataverse as the sole transactional write authority.
- SQL Server on-premises or Azure SQL in the institution's governed landing
  zone as the read-serving cache.
- OneLake/Fabric as an upstream read-only projection, never a direct client
  dependency.
- `Microsoft.Data.Sqlite`/EF Core SQLite as the bounded device cache, protected
  by platform key storage, app-level encryption, Intune policy, retention, and
  remote wipe.
- Signed MSIX distributed through Microsoft Intune.
- No Microsoft internal scripts, no decompiled assets, no runtime-loaded
  unsigned code, and no Copilot/AI dependency.
- Verified customer-authored JavaScript either transpiled at build time or
  frozen, scanned, hashed, signed, and packaged with the application before
  Jint can execute it.
- Microsoft Graph mail integration through least-privilege tenant services.
- CTI through a signed, mutually authenticated local channel broker.
- No separate VerseOff per-user license. Distribution and runtime entitlement
  are tied to a customer-managed group of appropriately Microsoft-licensed
  users.

If the native client must contain no Entra client ID, it uses the
customer-operated BCDR gateway described in
[License-Bound Distribution and Authentication](./LICENSE_BOUND_DISTRIBUTION_AND_AUTHENTICATION.md).
Microsoft still requires an application/workload identity at the gateway's
Dataverse integration boundary.

## Proprietary-boundary clarification

### Overall assessment

The canonical design is **defensible but not automatically approved**.

It stays on the safer side when VerseOff is an independently authored native
client that interoperates through documented schemas and APIs. It moves into a
dangerous area when it copies or executes proprietary implementation assets.

The earlier comparison to Resco is only a capability benchmark: mature ALM,
offline synchronization, configuration, native controls, and extensibility.
There is no proposed Resco integration, derivation, or source use, so Resco is
not a special risk in this design.

BCDR is a strong business and resiliency justification. It is not an exception
to copyright, contract, licensing, trademark, patent, privacy, or
reverse-engineering restrictions.

This section is architecture guidance, not legal advice. A commercial release
needs review by qualified intellectual-property and Microsoft licensing
counsel.

### Green: preferred and defensible

- Use documented Dataverse Web API operations.
- Use customer-authorized solution exports and metadata from that customer's
  tenant.
- Validate and interpret published Microsoft XSD contracts.
- Independently implement documented behavior in C# and XAML.
- Use a distinct VerseOff visual identity and interaction design.
- Execute or transpile only scripts/components authored and owned by the
  customer or VerseOff.
- Keep an immutable source-and-license record for every imported custom
  component.
- Use public Microsoft samples only under their stated licenses.
- Benchmark mature enterprise offline capabilities without importing another
  product's implementation.
- Store customer-specific generated output for that customer; do not build a
  redistributable library of extracted Microsoft or third-party assets.
- Obtain the required Dynamics 365/Power Platform licenses for every user or
  device that directly or indirectly accesses Dataverse.

### Yellow: requires explicit legal, security, and vendor approval

- Emulating public `Xrm` method names for compatibility.
- High-fidelity reproduction of model-driven form behavior.
- Build-time transformation of customer HTML, JavaScript, or PCF.
- Executing customer JavaScript in Jint.
- Reproducing the functional behavior of a Microsoft first-party control.
- Replicating Dataverse data to OneLake, SQL Server, Azure SQL, or devices.
- Using Microsoft trademarks in marketing or UI.
- Black-box compatibility testing beyond published behavior.

Controls for yellow items:

- legal opinion and customer attestation of authorship/ownership;
- publisher/solution allowlist;
- provenance ledger;
- automated Microsoft-system-asset rejection;
- no redistribution outside the licensed customer;
- distinct implementation and UX;
- security and licensing review;
- documented unsupported behavior.

### Red: do not do

- Decompile, transpile, execute, or disassemble Microsoft or third-party
  binaries.
- Beautify, translate, execute, or redistribute Microsoft internal/minified
  scripts.
- Extract and run Microsoft first-party PCF bundles.
- Copy another vendor's schemas, package formats, icons, screens, text, or
  private APIs.
- Scrape the model-driven app DOM or capture private network protocols to
  reproduce undocumented internals.
- Ship Microsoft default assets extracted from one environment as reusable
  VerseOff assets for other customers.
- Remove licensing checks or use a service account to avoid per-user/device
  licensing.
- Download executable scripts or plugins from Dataverse and run them without a
  signed release process.
- Claim VerseOff is Microsoft-certified or Microsoft-authored without a valid
  agreement.

### Mandatory clean-room controls

1. Maintain a source register for every implemented behavior.
2. Cite the XSD, Microsoft Learn page, certification objective, public sample,
   or customer requirement used.
3. Store no Microsoft or third-party proprietary source in the repository.
4. Separate behavioral specification from implementation for high-risk
   compatibility features.
5. Require code review confirming independent implementation.
6. Scan builds for blocked publisher prefixes, resources, and binary
   signatures.
7. Require customer attestation for custom and partner assets.
8. Keep hashes, licenses, solution IDs, publishers, and layer provenance.
9. Run an external IP review before commercial release.
10. Re-review when Microsoft Product Terms or platform contracts change.

## Microsoft licensing and multiplexing

A native VerseOff client does not reduce Microsoft licensing obligations.

Microsoft's multiplexing guidance states that hardware or software used to
pool, reroute, or indirectly access a product does not reduce the required
licenses. Users who access or benefit from Dynamics 365/Dataverse data through
VerseOff must have the appropriate licenses under the applicable Product
Terms.

Therefore:

- do not funnel many users through one service account to avoid licensing;
- preserve end-user identity for Dataverse operations;
- treat service principals as workload identities, not user-license bypasses;
- document licenses for offline users and BCDR devices;
- review external-user scenarios separately;
- obtain written Microsoft licensing guidance for the final SKU and deployment
  model.

Marketplace/AppSource certification and Microsoft partner participation can
improve enterprise confidence, but they do not replace legal or licensing
review.

## Important database decision

### Shared databases

Use Microsoft database engines:

- Microsoft SQL Server for on-premises read cache and BCDR.
- Azure SQL Database for Azure-hosted read services.
- SQL database or Warehouse in Microsoft Fabric for Fabric-native projections.
- Dataverse for transactions, solution configuration, and write processing.

Do not give the native client SQL or OneLake credentials. The app calls a
security-trimmed read-model API.

### Device database

For cross-platform MAUI, use Microsoft's:

- `Microsoft.Data.Sqlite`;
- `Microsoft.EntityFrameworkCore.Sqlite`.

The underlying SQLite engine is open-source. This normally goes through the
institution's open-source approval process.

If policy requires a Microsoft-owned database engine with no OSS embedded
engine, the product must become Windows-only and use SQL Server
Express/LocalDB. There is no SQL Server LocalDB equivalent for iOS and Android.

### Data protection

At minimum:

- minimize locally cached fields and records;
- encrypt sensitive values with .NET cryptography;
- protect keys with TPM/DPAPI on Windows and platform keystores on mobile;
- require BitLocker/device encryption through Intune;
- prohibit backup to unmanaged consumer locations;
- enforce retention and automatic purge;
- support selective and full remote wipe;
- log cache/profile version and security snapshot age;
- fail closed when the security snapshot expires.

## Architecture choices by acceptance likelihood

| Area | Most acceptable | Conditional | Likely rejected |
|---|---|---|---|
| Native runtime | Signed .NET LTS/WinUI/MAUI | Cross-platform rollout after Windows pilot | Python/PyQt as production banking client |
| Writes | Local outbox to Dataverse | Explicit approved adapter for a documented Dataverse action | Writing OneLake/read cache |
| Shared read cache | SQL Server or Azure SQL behind an API | Fabric SQL with approved capacity/governance | Direct client SQL/OneLake access |
| OneLake | Read-only upstream projection | Curated non-sensitive or approved data | Treating OneLake as transactional truth |
| Device cache | Microsoft.Data.Sqlite with strong controls | Windows-only LocalDB for stricter policy | Plain unencrypted local PII |
| Customer scripts | Verified customer-authored code transpiled at build time | Sandboxed Jint for immutable customer-authored scripts | Microsoft or third-party code transformation/execution |
| OOTB behavior | Clean-room native C# | Online-only placeholder for unsupported features | Executing/decompiling Microsoft bundles |
| Outlook | Graph with scoped access and mailbox policy | Signed classic Outlook Windows adapter | Parsing OST/PST or broad tenant mail access |
| CTI | Signed vendor adapter plus authenticated broker | CIF compatibility for approved customer providers | Open localhost port or scraped telephony UI |
| Deployment | Signed MSIX through Intune | Approved app store/mobile channel | Executable downloaded and run from Dataverse |
| Updates | Ringed, signed, reversible | Emergency hotfix with two-person approval | Self-modifying runtime |

## Runtime custom scripting acceptance

An embedded JavaScript engine is a significant control point in a bank.

The safest order of preference is:

1. Transpile supported customer handlers to reviewed C# at build time.
2. Replace the handler with a native extension.
3. Execute an immutable approved script in Jint.
4. Mark the behavior online-only.
5. Block the app release when the handler is required for safe save behavior.

If Jint is enabled:

- scripts are imported only from verified customer-authored solution layers;
- scripts are scanned during CI;
- scripts are embedded in the signed package;
- no script is downloaded or modified after installation;
- `eval`, dynamic code generation, CLR access, reflection, process access,
  arbitrary file access, and arbitrary networking are disabled;
- API access is allowlisted;
- execution has time, statement, recursion, and memory limits;
- every execution records handler ID, version, hash, duration, outcome, and
  correlation ID;
- a tenant and device kill switch can disable a handler;
- the SBOM records Jint and all transitive dependencies.

## OneLake and read-cache acceptance

### Recommended topology

```text
Dataverse
  -> Fabric/OneLake read-only projection
  -> governed projector
  -> SQL Server/Azure SQL read model
  -> security-trimmed read API
  -> bounded local device cache
```

The projector and read API must run in an approved landing zone and provide:

- private connectivity where supported;
- Entra workload identity;
- no shared keys in clients;
- data classification and residency enforcement;
- row and field security trimming;
- encryption in transit and at rest;
- immutable audit records;
- recovery point and recovery time objectives;
- tested failover;
- schema/version compatibility;
- deletion and legal-hold propagation.

### BCDR reality

If Microsoft cloud services are unavailable, OneLake and Graph may also be
unavailable. A bank-grade BCDR design therefore needs:

- a continuously maintained on-premises or separately hosted SQL Server read
  cache;
- a bounded local device cache;
- a documented staleness policy;
- proof that critical business services remain available without Fabric,
  Dataverse, Exchange Online, or Entra token renewal for the approved outage
  window.

## Identity and access

- Use Entra ID and Conditional Access.
- Use managed identities/workload identities for services.
- Use certificate-based credentials where managed identity is unavailable.
- Store secrets in Key Vault, never app settings or Dataverse records.
- Use least-privilege delegated access for users.
- Use Exchange application RBAC or an equivalent mailbox-scoping control for
  Graph application access.
- Separate development, test, UAT, production, and BCDR environments.
- Use privileged identity management and two-person approval for release and
  emergency operations.
- Maintain break-glass procedures and audit them.

## Outlook acceptance

Prefer:

- Graph change notifications into a tenant-controlled integration service;
- Graph message delta queries for recovery and reconciliation;
- metadata-only notifications to the client;
- mailbox scopes limited to approved users or shared mailboxes;
- explicit retention and data-classification rules.

Avoid:

- `Mail.Read` for the entire tenant without an approved necessity;
- local OST/PST parsing;
- UI scraping;
- hidden attachment collection;
- storing full message bodies when sender/subject/conversation metadata is
  sufficient;
- assuming Graph works during the BCDR outage.

An optional classic Outlook adapter should be a separate Windows-only,
centrally deployed, signed component. New Outlook and cross-platform clients
should use Graph.

## CTI acceptance

The channel broker must:

- be signed and centrally deployed;
- use a supported vendor SDK;
- authenticate both ends of local IPC;
- authorize the signed VerseOff client;
- avoid unauthenticated localhost HTTP;
- protect call metadata and recordings;
- provide consent and recording indicators;
- emit structured auditable events;
- isolate vendor failures from the main app;
- support kill switch, upgrade, and rollback;
- queue Dataverse activities through the standard outbox.

Cloud telephony features remain online-only. Offline local calling requires a
supported local telephony or vendor integration.

## Software supply-chain evidence

Expect to provide:

- source repository governance;
- protected branches;
- peer review/two-person integrity;
- isolated and reproducible builds;
- pinned dependencies and lock files;
- SBOM for every release;
- open-source license inventory;
- SAST, secret scanning, dependency scanning, and malware scanning;
- signed commits/tags where required;
- signed binaries and verified provenance;
- vulnerability disclosure and remediation SLA;
- penetration-test report;
- threat model and data-flow diagrams;
- secure coding standard;
- release, rollback, and emergency-fix procedures;
- build artifact retention;
- evidence that no Microsoft or third-party proprietary source is included.

Microsoft's Secure Future Initiative guidance emphasizes protected engineering
systems, trusted code signing, two-person integrity, and SBOM adoption. These
controls align well with regulated-bank review.

## Operational resilience evidence

Expect review of:

- business service and impact mapping;
- BCP and disaster recovery plans;
- RTO and RPO;
- dependency failure analysis;
- regional and provider concentration risk;
- outage-mode authentication behavior;
- offline data staleness;
- queue recovery and replay;
- conflict resolution;
- capacity and load testing;
- backup and restoration;
- incident classification and notification;
- crisis communications;
- annual or more frequent resilience exercises;
- third-party and subcontractor dependencies;
- end-of-support and exit plans.

## Privacy and records management

- Document every data element copied to OneLake, SQL, and devices.
- Define purpose, retention, residency, and legal basis.
- Avoid copying sensitive fields into broad projections.
- Propagate deletion and retention policies.
- Separate diagnostic telemetry from business content.
- Redact PII and secrets from logs.
- Support legal hold without keeping unnecessary device copies.
- Document email, call, transcript, and recording handling separately.

## Required review package

The minimum useful enterprise review package is:

1. Executive architecture summary.
2. Logical and physical data-flow diagrams.
3. Threat model.
4. Data classification and residency matrix.
5. Identity and privilege matrix.
6. Offline security and key-management design.
7. OneLake/read-cache security model.
8. Graph mailbox-scope design.
9. CTI broker protocol and vendor dependencies.
10. Script/extension sandbox specification.
11. Clean-room/IP provenance report.
12. SBOM and OSS licenses.
13. Secure SDLC evidence.
14. Penetration-test report.
15. BCP/DR test evidence.
16. Support model, SLAs, and escalation paths.
17. Deployment, update, rollback, and remote-wipe procedures.
18. Pilot exit criteria.

## Recommended adoption sequence

### Phase 1: Architecture approval

- Windows-only pilot.
- Synthetic or masked data.
- Dataverse writes and SQL Server read cache.
- No Jint, Outlook, CTI, or OneLake client dependency.
- Intune deployment and remote wipe.

### Phase 2: Controlled business pilot

- Approved device cache.
- Standard offline profile.
- Read-your-writes overlay.
- OneLake-fed read model.
- Selected custom scripts transpiled to C#.

### Phase 3: Governed extensions

- Sandboxed immutable Jint scripts, if approved.
- Custom native controls.
- Graph mail signals with restricted mailboxes.
- One approved CTI provider.

### Phase 4: Broader rollout

- Mobile platforms.
- Multiple channel providers.
- Additional regions and BCDR caches.
- Formal production SLOs and recurring resilience exercises.

## Public references

- [BNY cybersecurity program overview](https://www.bny.com/assets/corporate/documents/pdf/bny-cybersecurity-overview.pdf)
- [BNY information security](https://www.bny.com/corporate/global/en/about-us/trust-center/information-security.html)
- [BNY enterprise resiliency](https://www.bny.com/corporate/global/en/about-us/trust-center/resiliency.html)
- [BNY supplier code of conduct](https://www.bnymellon.com/content/dam/bnymellon/documents/pdf/csr/bny-mellon-supplier-code-of-conduct.pdf)
- [Microsoft financial-services infrastructure governance](https://learn.microsoft.com/azure/cloud-adoption-framework/industry/financial-services/infrastructure-governance)
- [Microsoft Secure Future Initiative best practices](https://learn.microsoft.com/security/engineering/sfi-best-practices)
- [Deploy MSIX apps with Microsoft Intune](https://learn.microsoft.com/intune/intune-service/apps/apps-windows-10-app-deploy)
- [Microsoft.Data.Sqlite overview](https://learn.microsoft.com/dotnet/standard/data/sqlite/)
- [Microsoft multiplexing licensing guidance](https://www.microsoft.com/licensing/guidance/Multiplexing)
- [Microsoft Product Terms](https://www.microsoft.com/licensing/terms)
- [Microsoft Marketplace certification policies](https://learn.microsoft.com/legal/marketplace/certification-policies)
