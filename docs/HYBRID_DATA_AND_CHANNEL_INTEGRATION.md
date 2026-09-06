# VerseOff Hybrid Data and Channel Integration Architecture

## Decision summary

The proposed architecture is sound with one non-negotiable rule:

> Dataverse remains the transactional system of record. OneLake, Fabric, SQL
> read models, and device caches are projections and must never become an
> alternate write authority.

The native client uses:

- a local device database for true offline operation;
- an optional on-premises or alternate-cloud read service for broad lookups,
  homepage grids, and search;
- OneLake/Fabric as a source for large read-only projections;
- a transactional outbox for writes that synchronize to Dataverse;
- Microsoft Graph or a supported Outlook adapter for mail signals;
- a native channel adapter layer for CTI.

The controls and evidence expected by a highly regulated financial institution
are documented in
[Regulated Enterprise Acceptance](./REGULATED_ENTERPRISE_ACCEPTANCE.md).
License-bound distribution and the app-ID-free client/gateway split are
documented in
[License-Bound Distribution and Authentication](./LICENSE_BOUND_DISTRIBUTION_AND_AUTHENTICATION.md).

## Why OneLake belongs in the read plane

Dataverse integration with Microsoft Fabric can expose Dataverse data through
OneLake shortcuts. Microsoft documents Dataverse shortcuts as read-only.

That makes OneLake useful for:

- broad historical views;
- denormalized lookup projections;
- reporting and aggregate read models;
- search-index feeds;
- precomputing relationship traversals;
- seeding regional or on-premises read caches.

It is not suitable for:

- form saves;
- optimistic-concurrency writes;
- command execution;
- immediate read-after-write consistency;
- direct device access during a Microsoft cloud outage;
- enforcing Dataverse security without an additional security-trimming layer.

The native app should never directly query OneLake. A read-model service
should own OneLake/Fabric access, schema translation, security trimming,
indexing, throttling, and cache publication.

## Microsoft-centered database topology

### Transactional authority

| Purpose | Database/service |
|---|---|
| Business record authority | Microsoft Dataverse |
| Online command/plugin authority | Dataverse |
| Concurrency token authority | Dataverse ETag/version |
| Solution/configuration authority | Dataverse solutions and VerseOff configuration tables |

### Analytical and projection authority

| Purpose | Database/service |
|---|---|
| Lake projection | Microsoft Fabric / OneLake |
| Curated SQL projection | SQL database in Microsoft Fabric or Fabric Warehouse |
| Azure read service | Azure SQL Database |
| On-premises read service | Microsoft SQL Server |
| Multicloud Microsoft database option | SQL Server on a supported VM/container, optionally Azure Arc-enabled |

### Device database

The cross-platform MAUI client uses:

- `Microsoft.Data.Sqlite`;
- `Microsoft.EntityFrameworkCore.Sqlite`;
- platform data protection and .NET cryptography for protected local data.

`Microsoft.Data.Sqlite` and the EF Core provider are Microsoft-maintained
packages. The embedded database engine underneath is SQLite, which is
open-source rather than a Microsoft-owned database engine.

There is no supported cross-platform embedded SQL Server engine for Windows,
iOS, Android, and macOS. If a Microsoft-owned engine is an absolute
requirement, the design becomes Windows-only and can use SQL Server
Express/LocalDB. The recommended cross-platform decision is therefore:

> Microsoft .NET data access and EF Core over the audited SQLite engine on the
> device; Microsoft SQL Server/Azure SQL/Fabric SQL everywhere shared.

## Read hierarchy

The client resolves reads in this order:

1. Pending local write overlay.
2. Local device cache.
3. On-premises or alternate-cloud read-model service, when reachable.
4. Dataverse online read, when explicitly allowed.
5. Visible unavailable state.

OneLake is upstream of the read-model service, not a direct client tier.

### Read model contents

The read model is optimized for:

- lookup display values and alternate keys;
- homepage grids;
- saved-view projections;
- quick find and full-text search;
- relationship edges;
- Timeline summaries;
- user/team/queue display records;
- option, state, and status labels;
- form and navigation metadata;
- email/contact/case correlation.

It should not duplicate opaque server behavior or expose records the user
cannot read.

## Read-your-writes overlay

OneLake and downstream read caches are eventually consistent. A successful
Dataverse write can take time to appear in those projections.

VerseOff therefore overlays local mutations on every read:

```text
remote/cache projection
+ pending local creates
+ pending local updates
- pending local deletes
= user-visible read model
```

Each local mutation records:

- table and row ID;
- operation type;
- changed fields;
- local timestamp;
- source form/event;
- base ETag or version;
- retry state;
- correlation ID;
- server result;
- conflict state.

After Dataverse accepts the operation, the local overlay remains until the
Dataverse change feed or read projection confirms the same version.

## Synchronization paths

### Write path

```text
MAUI form / customer script
  -> local transaction
  -> transactional outbox
  -> Dataverse Web API
  -> Dataverse plug-ins and business rules
  -> Dataverse change tracking
  -> Fabric/OneLake projection
  -> read-model projector
  -> device read cache
```

Writes never target OneLake, Fabric SQL, Azure SQL, or the on-premises read
cache.

### Read projection path

```text
Dataverse
  -> Link to Fabric / OneLake shortcut
  -> curated Fabric projection
  -> read-model publisher
  -> SQL Server/Azure SQL/Fabric SQL serving database
  -> bounded device delta
  -> local Microsoft.Data.Sqlite cache
```

For datasets not appropriate for Fabric, the publisher can use Dataverse
change tracking directly. Dataverse change tracking uses
`Prefer: odata.track-changes` and opaque delta links; clients must persist and
replay those links rather than constructing them.

## Security

Direct OneLake access from native clients is prohibited.

The read-model service must enforce:

- Entra ID authentication;
- app and environment tenancy;
- Dataverse table/row/field access snapshots;
- ownership, team, sharing, and business-unit scope;
- explicit projection allowlists;
- security-snapshot age;
- audit logging;
- data residency and retention.

If security trimming cannot be proven, the read fails closed.

The local cache stores the effective security snapshot version used to admit
each projection. Expired or missing security state disables sensitive reads.

## Client scripting shim

Customer scripts continue to see a documented Client API-shaped shim, but the
shim routes operations to native services:

| Client API call | Native route |
|---|---|
| `getAttribute`, `getControl` | Native form state and MAUI controls |
| `retrieveRecord` | Local overlay/cache; optional read-model provider |
| `retrieveMultipleRecords` | Local query/index; optional read-model provider |
| `lookupObjects` | Local lookup projection and search |
| `createRecord` | Local transaction plus Dataverse outbox |
| `updateRecord` | Local overlay plus Dataverse outbox |
| `deleteRecord` | Local tombstone plus Dataverse outbox |
| `data.save` | Native save pipeline and outbox |
| `navigateTo` | Native MAUI navigation |
| server action/online execute | Explicit supported adapter or fail closed |

Scripts never receive OneLake credentials, SQL credentials, file-system
access, or direct network access.

## Search

### Connected enterprise search

Use a Microsoft serving technology appropriate to deployment:

- SQL Server Full-Text Search on-premises;
- Azure SQL read model and indexed projections;
- Azure AI Search where cloud search is allowed;
- Fabric SQL/Warehouse for curated connected reads.

### Offline search

The device carries a bounded search projection in the local SQLite database.
Search results are security trimmed before download and merged with pending
local writes.

## Resilience modes

| Mode | Available data/services |
|---|---|
| Normal online | Dataverse writes, read service, Graph, CTI provider |
| Dataverse degraded | Local writes queued; read service and local cache remain |
| Microsoft cloud degraded | On-premises read service and local cache remain |
| Fully disconnected | Local device cache and outbox only |
| Security snapshot expired | Non-sensitive fallback or fail closed |

OneLake alone does not satisfy BCDR because it is another Microsoft cloud
dependency. The on-premises/alternate-cloud read service and device cache are
what preserve availability during a broader outage.

## Outlook integration

### Recommended online signal path

Use Microsoft Graph:

1. Subscribe to Outlook message change notifications through a secured
   integration service.
2. Use message delta queries to recover missed notifications and maintain the
   mailbox cursor.
3. Normalize the signal to a minimal event.
4. Correlate sender, recipients, conversation, and subject against the
   VerseOff read model.
5. Notify the native client and offer a screen pop or activity draft.
6. Queue any Dataverse email/activity records through the normal outbox.

Graph notifications are hints, not the data authority. The integration service
must query the resource or delta feed and persist its cursor.

### Local Outlook option

For classic Outlook on Windows, an optional signed adapter can use supported
Outlook extensibility to emit local signals.

Constraints:

- Classic Outlook COM integration is Windows-only.
- New Outlook does not provide the same COM object model.
- Office add-in event activation is not a general mailbox-arrival daemon.
- Never parse OST/PST internals.
- Never scrape Outlook UI or undocumented local stores.
- Mail content and attachments require explicit consent, retention, and data
  classification rules.

For cross-platform and new Outlook, Microsoft Graph remains the primary
integration.

### Email-to-Dataverse behavior

A new-mail signal can:

- match contacts, accounts, cases, leads, and opportunities;
- display a native notification;
- open a matching record from the local read cache;
- draft an `email`, `task`, or custom activity;
- queue activity parties without flattening them;
- attach the message only when policy and licensing allow.

Do not silently create Dataverse records unless an approved automation policy
requires it.

## CTI and channel integration

Dynamics 365 Channel Integration Framework 2.0 is a documented web framework
for embedding channel providers into model-driven app sessions. It is useful
as a behavioral reference, but it is not the native offline runtime.

VerseOff defines a native adapter contract:

```csharp
public interface IVerseOffChannelAdapter
{
    IAsyncEnumerable<ChannelEvent> ListenAsync(
        CancellationToken cancellationToken);

    ValueTask<ChannelCommandResult> ExecuteAsync(
        ChannelCommand command,
        CancellationToken cancellationToken);
}
```

Supported event categories:

- incoming interaction;
- outgoing interaction;
- connected/disconnected;
- hold/resume;
- transfer;
- participant change;
- disposition/wrap-up;
- provider error;
- transcript or recording reference, when permitted.

### Local channel broker

Vendor SDKs and telephony stacks should be isolated in a signed local broker:

```text
Telephony/vendor SDK
  -> VerseOff Channel Broker
  -> authenticated local IPC
  -> MAUI client
  -> lookup/search against local read cache
  -> screen pop
  -> Dataverse activity outbox
```

Use named pipes on Windows or authenticated loopback gRPC/HTTP where
cross-platform support is required. Do not expose an unauthenticated localhost
port.

### CIF compatibility

Provide a documented compatibility adapter for customer-owned CIF provider
logic where feasible, but do not execute Microsoft internal CIF host scripts.
Provider-specific web UIs should be replaced by a native adapter or marked
online-only.

Teams Phone and cloud communications features remain online services. Local
offline calling requires a supported local/vendor telephony SDK.

## Unified signal bus

Outlook and CTI integrations publish a common native signal:

```csharp
public sealed record InteractionSignal(
    string Provider,
    string Kind,
    string ExternalId,
    DateTimeOffset OccurredOn,
    IReadOnlyList<PartyReference> Parties,
    string? Subject,
    IReadOnlyDictionary<string, string> Metadata);
```

The signal pipeline:

1. deduplicates by provider/external ID;
2. applies privacy policy;
3. resolves parties through the local read model;
4. ranks related Dataverse records;
5. performs a native screen pop;
6. optionally creates a local activity draft;
7. queues approved writes to Dataverse;
8. records audit and correlation IDs.

## Required .NET services

```csharp
public interface IReadModelProvider
{
    ValueTask<Record?> RetrieveAsync(
        RecordReference reference,
        CancellationToken cancellationToken);

    ValueTask<QueryPage> QueryAsync(
        ReadQuery query,
        CancellationToken cancellationToken);
}

public interface IWriteOutbox
{
    ValueTask<OutboxReceipt> EnqueueAsync(
        DataverseOperation operation,
        CancellationToken cancellationToken);
}

public interface IInteractionSignalSource
{
    IAsyncEnumerable<InteractionSignal> ListenAsync(
        CancellationToken cancellationToken);
}
```

Implementations:

- `SqliteReadModelProvider`
- `EnterpriseSqlReadModelProvider`
- `CompositeReadModelProvider`
- `DataverseOutbox`
- `GraphMailSignalSource`
- `ClassicOutlookSignalSource` for the optional Windows adapter
- `ChannelBrokerSignalSource`

## Delivery order

1. Local device schema, read projection, and outbox.
2. Dataverse write sync and conflict handling.
3. SQL Server/Azure SQL/Fabric SQL read-model service.
4. OneLake/Fabric projection ingestion.
5. Lookup, homepage grid, and search providers.
6. Read-your-writes overlay and reconciliation.
7. Graph mail signal integration.
8. Local Outlook adapter, if required.
9. Native channel adapter and broker.
10. CIF compatibility adapters for approved customer providers.

## Official references

- [Create a Dataverse shortcut in OneLake](https://learn.microsoft.com/fabric/onelake/create-dataverse-shortcut)
- [Use change tracking to synchronize data](https://learn.microsoft.com/power-apps/developer/data-platform/use-change-tracking-synchronize-data-external-systems)
- [Microsoft.Data.Sqlite overview](https://learn.microsoft.com/dotnet/standard/data/sqlite/)
- [SQL database in Microsoft Fabric](https://learn.microsoft.com/fabric/database/sql/overview)
- [Microsoft Graph change notifications](https://learn.microsoft.com/graph/api/resources/change-notifications-api-overview)
- [Delta query for Outlook messages](https://learn.microsoft.com/graph/delta-query-messages)
- [Organize Outlook messages](https://learn.microsoft.com/graph/outlook-organize-messages)
- [Event-based activation for Outlook add-ins](https://learn.microsoft.com/office/dev/add-ins/develop/event-based-activation)
- [Dynamics 365 Channel Integration Framework](https://learn.microsoft.com/dynamics365/channel-integration-framework/overview-channel-integration-framework)
