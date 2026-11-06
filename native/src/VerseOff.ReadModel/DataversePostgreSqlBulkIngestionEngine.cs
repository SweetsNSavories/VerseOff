using System.Data;
using System.Diagnostics;
using System.Globalization;
using Npgsql;
using NpgsqlTypes;

namespace VerseOff.ReadModel;

public sealed record DataverseBulkEntityRow(
    string TableLogicalName,
    Guid RecordId,
    Guid OwnerId,
    string OwnerType,
    Guid OwningBusinessUnitId,
    int StateCode,
    int StatusCode,
    long VersionNumber,
    string ETag,
    DateTimeOffset ModifiedOn,
    bool IsDeleted,
    string DataJson);

public sealed record DataverseBulkIngestionResult(
    string TableLogicalName,
    string PartitionId,
    int RowsIngested,
    long MaxVersionNumber,
    long DurationMilliseconds,
    double ThroughputRowsPerSecond,
    string? NewDeltaToken);

public interface IDataversePostgreSqlBulkIngestionEngine
{
    ValueTask<DataverseBulkIngestionResult> IngestBatchBinaryCopyAsync(
        string tableLogicalName,
        string partitionId,
        IReadOnlyList<DataverseBulkEntityRow> rows,
        string? newDeltaToken,
        string syncSource = "fabric-onelake-parquet-binary-copy",
        CancellationToken cancellationToken = default);
}

/// <summary>
/// High-throughput 10 TB–scale bulk ingestion engine for PostgreSQL 17.
/// Streams batches via Npgsql binary COPY protocol into an UNLOGGED staging table
/// (<c>verseoff.dataverse_entity_staging</c>) to bypass WAL overhead during staging,
/// followed by a single set-based atomic upsert into <c>verseoff.dataverse_entity</c>
/// guarded by monotonic <c>version_number</c> and atomic watermark persistence in
/// <c>verseoff.sync_watermark</c>.
/// </summary>
public sealed class DataversePostgreSqlBulkIngestionEngine(
    string connectionString) : IDataversePostgreSqlBulkIngestionEngine
{
    public async ValueTask<DataverseBulkIngestionResult> IngestBatchBinaryCopyAsync(
        string tableLogicalName,
        string partitionId,
        IReadOnlyList<DataverseBulkEntityRow> rows,
        string? newDeltaToken,
        string syncSource = "fabric-onelake-parquet-binary-copy",
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        ArgumentException.ThrowIfNullOrWhiteSpace(partitionId);
        ArgumentNullException.ThrowIfNull(rows);

        var sw = Stopwatch.StartNew();
        var batchId = Guid.NewGuid();
        long maxVersion = 0;

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        // 1. Stream rows into UNLOGGED staging table via PostgreSQL Binary COPY protocol
        if (rows.Count > 0)
        {
            const string copyCommand =
                """
                COPY verseoff.dataverse_entity_staging (
                    batch_id,
                    table_logical_name,
                    record_id,
                    owner_id,
                    owner_type,
                    owning_business_unit_id,
                    statecode,
                    statuscode,
                    version_number,
                    etag,
                    modified_on,
                    is_deleted,
                    data_json
                ) FROM STDIN (FORMAT BINARY)
                """;

            await using var importer = await connection.BeginBinaryImportAsync(
                copyCommand,
                cancellationToken);

            foreach (var row in rows)
            {
                if (row.VersionNumber > maxVersion)
                {
                    maxVersion = row.VersionNumber;
                }

                await importer.StartRowAsync(cancellationToken);
                await importer.WriteAsync(batchId, NpgsqlDbType.Uuid, cancellationToken);
                await importer.WriteAsync(row.TableLogicalName, NpgsqlDbType.Text, cancellationToken);
                await importer.WriteAsync(row.RecordId, NpgsqlDbType.Uuid, cancellationToken);
                await importer.WriteAsync(row.OwnerId, NpgsqlDbType.Uuid, cancellationToken);
                await importer.WriteAsync(row.OwnerType, NpgsqlDbType.Text, cancellationToken);
                await importer.WriteAsync(row.OwningBusinessUnitId, NpgsqlDbType.Uuid, cancellationToken);
                await importer.WriteAsync(row.StateCode, NpgsqlDbType.Integer, cancellationToken);
                await importer.WriteAsync(row.StatusCode, NpgsqlDbType.Integer, cancellationToken);
                await importer.WriteAsync(row.VersionNumber, NpgsqlDbType.Bigint, cancellationToken);
                await importer.WriteAsync(row.ETag, NpgsqlDbType.Text, cancellationToken);
                await importer.WriteAsync(row.ModifiedOn.UtcDateTime, NpgsqlDbType.TimestampTz, cancellationToken);
                await importer.WriteAsync(row.IsDeleted, NpgsqlDbType.Boolean, cancellationToken);
                await importer.WriteAsync(row.DataJson, NpgsqlDbType.Jsonb, cancellationToken);
            }

            await importer.CompleteAsync(cancellationToken);
        }

        sw.Stop();
        var elapsedMs = Math.Max(1L, sw.ElapsedMilliseconds);
        var throughput = Math.Round((rows.Count * 1000.0) / elapsedMs, 2);

        // 2. Atomic set-based merge from UNLOGGED staging into verseoff.dataverse_entity + watermark update
        await using var mergeCmd = connection.CreateCommand();
        mergeCmd.CommandText =
            """
            WITH merged AS (
                INSERT INTO verseoff.dataverse_entity (
                    table_logical_name,
                    record_id,
                    owner_id,
                    owner_type,
                    owning_business_unit_id,
                    statecode,
                    statuscode,
                    version_number,
                    etag,
                    modified_on,
                    is_deleted,
                    data_json
                )
                SELECT DISTINCT ON (s.table_logical_name, s.record_id)
                    s.table_logical_name,
                    s.record_id,
                    s.owner_id,
                    s.owner_type,
                    s.owning_business_unit_id,
                    s.statecode,
                    s.statuscode,
                    s.version_number,
                    s.etag,
                    s.modified_on,
                    s.is_deleted,
                    s.data_json
                FROM verseoff.dataverse_entity_staging s
                WHERE s.batch_id = @batchId
                ORDER BY s.table_logical_name, s.record_id, s.version_number DESC
                ON CONFLICT (table_logical_name, record_id) DO UPDATE
                SET owner_id = EXCLUDED.owner_id,
                    owner_type = EXCLUDED.owner_type,
                    owning_business_unit_id = EXCLUDED.owning_business_unit_id,
                    statecode = EXCLUDED.statecode,
                    statuscode = EXCLUDED.statuscode,
                    version_number = EXCLUDED.version_number,
                    etag = EXCLUDED.etag,
                    modified_on = EXCLUDED.modified_on,
                    is_deleted = EXCLUDED.is_deleted,
                    data_json = EXCLUDED.data_json
                WHERE EXCLUDED.version_number >= verseoff.dataverse_entity.version_number
                RETURNING 1
            ),
            cleaned AS (
                DELETE FROM verseoff.dataverse_entity_staging
                WHERE batch_id = @batchId
            )
            INSERT INTO verseoff.sync_watermark (
                table_logical_name,
                partition_id,
                last_delta_token,
                last_version_number,
                rows_synced_total,
                last_batch_rows,
                last_batch_duration_ms,
                throughput_rows_per_sec,
                sync_source,
                updated_at
            )
            VALUES (
                @tableLogicalName,
                @partitionId,
                @deltaToken,
                @maxVersion,
                @batchRows,
                @batchRows,
                @durationMs,
                @throughput,
                @syncSource,
                NOW()
            )
            ON CONFLICT (table_logical_name, partition_id) DO UPDATE
            SET last_delta_token = COALESCE(EXCLUDED.last_delta_token, verseoff.sync_watermark.last_delta_token),
                last_version_number = GREATEST(EXCLUDED.last_version_number, verseoff.sync_watermark.last_version_number),
                rows_synced_total = verseoff.sync_watermark.rows_synced_total + EXCLUDED.last_batch_rows,
                last_batch_rows = EXCLUDED.last_batch_rows,
                last_batch_duration_ms = EXCLUDED.last_batch_duration_ms,
                throughput_rows_per_sec = EXCLUDED.throughput_rows_per_sec,
                sync_source = EXCLUDED.sync_source,
                updated_at = NOW();
            """;

        mergeCmd.Parameters.AddWithValue("@batchId", batchId);
        mergeCmd.Parameters.AddWithValue("@tableLogicalName", tableLogicalName);
        mergeCmd.Parameters.AddWithValue("@partitionId", partitionId);
        mergeCmd.Parameters.AddWithValue(
            "@deltaToken",
            (object?)newDeltaToken ?? DBNull.Value);
        mergeCmd.Parameters.AddWithValue("@maxVersion", maxVersion);
        mergeCmd.Parameters.AddWithValue("@batchRows", rows.Count);
        mergeCmd.Parameters.AddWithValue("@durationMs", elapsedMs);
        mergeCmd.Parameters.AddWithValue("@throughput", throughput);
        mergeCmd.Parameters.AddWithValue("@syncSource", syncSource);

        await mergeCmd.ExecuteNonQueryAsync(cancellationToken);

        return new DataverseBulkIngestionResult(
            tableLogicalName,
            partitionId,
            rows.Count,
            maxVersion,
            elapsedMs,
            throughput,
            newDeltaToken);
    }
}

