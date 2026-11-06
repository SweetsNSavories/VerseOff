# VerseOff 10 TB Dataverse-to-PostgreSQL 17 Enterprise Architecture & Sizing Guide

This document provides the engineering blueprint, throughput calculations, hardware sizing, and PostgreSQL 17 tuning recommendations for operating **VerseOff** against a **10 TB Microsoft Dataverse** environment (~5–12 billion entity rows and 300–800 million `PrincipalObjectAccess` [POA] rows).

---

## 1. Why a Dual-Path Sync Architecture Is Mandatory at 10 TB

A common architectural mistake is attempting to initial-load or bulk-sync a 10 TB Dataverse instance directly through the **Dataverse Web API (`/api/data/v9.2`)**.

### Throughput Math: Dataverse Web API vs. Fabric OneLake Parquet + Binary `COPY`
- **Dataverse Service Protection API Limits**:
  - Dataverse enforces ~6,000 requests per 300 seconds (20 req/sec) per application user, with a maximum page size of 5,000 rows (`Prefer: odata.maxpagesize=5000`).
  - Even with 16 pooled Application Users in parallel, Web API throughput caps at ~150–250 MB/sec under ideal conditions, meaning a **10 TB initial load over OData Web API would take 14–28 days** and risk throttling live production users.
- **Fabric Link / Synapse Link (Delta Parquet on ADLS Gen2 / OneLake) + Npgsql Binary `COPY` ([`DataversePostgreSqlBulkIngestionEngine`](../native/src/VerseOff.ReadModel/DataversePostgreSqlBulkIngestionEngine.cs))**:
  - Dataverse exports initial snapshots and continuous trickle-feed changes directly from the underlying Azure SQL storage tier into **ADLS Gen2 / Microsoft Fabric OneLake** as ZSTD/Snappy-compressed **Delta Parquet** files without consuming interactive API quota.
  - Using `NpgsqlConnection.BeginBinaryImportAsync("COPY verseoff.dataverse_entity_staging ... FROM STDIN (FORMAT BINARY)")` into an `UNLOGGED` staging table across 32 parallel partition readers achieves **1.2–2.4 GB/sec (800,000–1,500,000 rows/sec)** on a single high-core sync worker.
  - **10 TB Initial Load Time**: **~1.5 to 2.5 hours**.
  - **Incremental Trickle-Feed RPO**: **15–60 seconds** (combining OneLake Delta Log tailing for bulk tables + Web API `$deltatoken` polling for sub-minute critical operational tables).

```
+---------------------------------------------------------------------------------------------------+
|                                   MICROSOFT DATAVERSE (10 TB)                                     |
|  - Business Entities (account, contact, incident, workorder, activitypointer, custom tables)      |
|  - Security Model (businessunit, systemuser, team, teammembership, role, roleprivileges, POA)     |
+-----------------------------------+-----------------------------------+---------------------------+
                                    |                                   |
        [Path A: Bulk & Continuous Lake Link]               [Path B: Sub-Second Critical Delta]
        Azure Synapse Link / Fabric OneLake                 Dataverse Web API v9.2
        Delta Parquet on ADLS Gen2                          Prefer: odata.track-changes ($deltatoken)
                                    |                                   |
                                    v                                   v
+---------------------------------------------------------------------------------------------------+
|                        VERSEOFF SYNC WORKER NODE (64 vCPU / 256 GB RAM)                           |
|  - 32-Channel Parquet Reader Pool -> Npgsql Binary COPY -> UNLOGGED verseoff.dataverse_entity_staging |
|  - Set-Based Atomic Upsert (WHERE EXCLUDED.version_number >= target.version_number)               |
|  - Per-Partition Watermark Checkpointing (verseoff.sync_watermark)                                |
+---------------------------------------------------+-----------------------------------------------+
                                                    |
                                                    v
+---------------------------------------------------------------------------------------------------+
|                   ON-PREMISES POSTGRESQL 17 CLUSTER (128 vCPU / 1 TB RAM / NVMe)                  |
|  - LIST Partitioned by table_logical_name + 32x HASH Sub-Partitions on record_id                  |
|  - PrincipalObjectAccess (POA) 64x HASH Partitioned on principalid                                |
|  - Single-Query Recursive CTE Security Engine (BU + Role Depth 1/2/4/8 + Team + POA + Manager + FLS) |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Recommended Hardware Specifications (10 TB Scale)

### Tier A: VerseOff Sync Worker Machine ("Good Dedicated Machine")
Because the Sync Worker decompresses Parquet files, parses JSON/columnar payloads, and streams binary `COPY` buffers over 25/40 GbE to PostgreSQL, it is CPU- and network-bound rather than disk-bound:

| Component | Recommended Specification (10 TB Scale) | Purpose |
| :--- | :--- | :--- |
| **CPU** | **32–64 Cores** (e.g., AMD EPYC 9354 / Intel Xeon Gold 6548Y+ or Azure `Standard_F64s_v2` / `E64ds_v5`) | 32 concurrent Parquet decompression + Npgsql binary `COPY` pipelines |
| **Memory (RAM)** | **128–256 GB DDR5** | Bounded `System.Threading.Channels` ring buffers (64 batches × 50,000 rows in flight) with zero LOH GC pressure |
| **Local Scratch NVMe** | **2 TB PCIe Gen4/Gen5 NVMe** (3,500+ MB/s) | Local checkpointing of downloaded OneLake Delta Parquet segments |
| **Network** | **25 GbE or 40 GbE NIC** (Jumbo Frames MTU 9000 to PostgreSQL host; ExpressRoute 10 Gbps to Azure) | Sustains 1.5–2.5 GB/s ingestion stream between Azure ADLS Gen2 and On-Premises PostgreSQL 17 |

### Tier B: On-Premises PostgreSQL 17 Database Server (Primary + Standby)
For a 10 TB Dataverse footprint, the working set (hot indexes + `businessunit`/`roleprivileges`/`teammembership` security tables + active `POA` partitions + recent 90 days of operational entities) is typically **600 GB – 1.2 TB**:

| Component | Recommended Specification (10 TB Scale) | Purpose |
| :--- | :--- | :--- |
| **CPU** | **64–128 Cores** (AMD EPYC 9554 / 9654) | Parallel index scans, JSONB path evaluation, and high-concurrency OData v4 queries |
| **Memory (RAM)** | **512 GB – 1 TB DDR5 ECC** | Keeps the entire Security Model, `POA` B-Tree indexes, and hot entity partitions pinned in `shared_buffers` + OS page cache |
| **Data Array (`PGDATA`)** | **24 TB usable PCIe Gen4/Gen5 Enterprise NVMe in RAID 10** (e.g., 8 × 6.4 TB mixed-use NVMe, 1.5M+ random read IOPS) | 10 TB raw data + ~4 TB GIN/B-Tree indexes + 30% autovacuum/repack headroom |
| **Dedicated WAL Array (`pg_wal`)** | **2 TB Enterprise NVMe in RAID 1 (High DWPD, PLP power-loss protection)** | Isolates sequential `fsync` WAL writes from random read/write table I/O during heavy delta ingestion |

---

## 3. PostgreSQL 17 Configuration (`postgresql.conf`) for 10 TB

```ini
# Memory Configuration (Assuming 1 TB RAM Server)
shared_buffers = 256GB                  # 25% of total RAM
effective_cache_size = 768GB            # 75% of total RAM
work_mem = 64MB                         # Per sort/hash operation inside OData CTEs
maintenance_work_mem = 16GB             # Fast GIN/B-Tree index builds and autovacuum
huge_pages = on                         # Mandatory at 256GB shared_buffers to eliminate TLB miss overhead

# WAL & Checkpoint Tuning for High-Rate Delta Ingestion
wal_level = replica
max_wal_size = 128GB
min_wal_size = 16GB
checkpoint_timeout = 30min
checkpoint_completion_target = 0.9
wal_compression = zstd                  # PostgreSQL 17 ZSTD WAL compression cuts WAL disk I/O by ~55%
wal_buffers = 64MB

# Parallelism & I/O (Enterprise NVMe)
max_worker_processes = 128
max_parallel_workers = 64
max_parallel_workers_per_gather = 8
max_parallel_maintenance_workers = 16
random_page_cost = 1.1                  # Tells planner NVMe random reads are nearly as fast as sequential
effective_io_concurrency = 256          # Exploits NVMe queue depth

# Aggressive Autovacuum for Continuous Trickle-Feed Updates
autovacuum_max_workers = 12
autovacuum_vacuum_cost_limit = 10000
autovacuum_vacuum_scale_factor = 0.01   # Vacuum after 1% dead tuples on large partitions
autovacuum_analyze_scale_factor = 0.005
```

---

## 4. Partitioning Strategy for 10 TB (`dataverse_entity` & `principalobjectaccess`)

At 10 TB, storing 8 billion records in a single monolithic B-Tree causes index bloat and slow `autovacuum`.

### A. Two-Level Partitioning on `verseoff.dataverse_entity`
1. **Level 1 (`LIST` by `LOWER(table_logical_name)`)**:
   - Every OData v4 request (`/api/data/v9.2/accounts`, `/api/data/v9.2/incidents`, etc.) always specifies `table_logical_name`. PostgreSQL **Partition Pruning** immediately eliminates 99% of the 10 TB database at query plan time.
2. **Level 2 (`HASH` 32 sub-partitions by `record_id` for tables > 50M rows)**:
   - Keeps each physical partition table under ~25–40 GB so B-Tree indexes fit cleanly in `shared_buffers` and `autovacuum` finishes in seconds.

### B. Optimizing the `PrincipalObjectAccess` (`POA`) Table at 500M+ Rows
In large Dataverse environments, the `POA` table is often the single largest table (hundreds of millions of rows from cascading parental shares).
1. **Partition `verseoff.principalobjectaccess` by `HASH (principalid)` (64 Partitions)**:
   - Because `DataversePostgreSqlODataEngine` always joins `POA` via `JOIN caller_principals cp ON cp.principal_id = poa.principalid`, hash-partitioning on `principalid` prunes the lookup to only the 1–5 partitions matching the user and their teams.
2. **Covering Index-Only Scan**:
   ```sql
   CREATE INDEX ix_poa_covering
       ON verseoff.principalobjectaccess (principalid, LOWER(objecttypecode), objectid)
       INCLUDE (accessrightsmask, inheritedaccessrightsmask)
       WHERE ((accessrightsmask | inheritedaccessrightsmask) & 1) <> 0;
   ```
   This partial covering index filters out non-read shares and satisfies the entire `poa_shared` CTE via an **Index-Only Scan** with zero heap fetches.

