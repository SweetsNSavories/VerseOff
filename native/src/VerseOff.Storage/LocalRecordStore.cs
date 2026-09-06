using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;

namespace VerseOff.Storage;

public interface ILocalRecordStore
{
    Task<CachedRecordEntity?> RetrieveAsync(
        string tableLogicalName,
        Guid recordId,
        CancellationToken cancellationToken = default);

    Task<CachedRecordEntity> SaveLocalAsync(
        string tableLogicalName,
        Guid recordId,
        JsonDocument data,
        Guid userObjectId,
        string deviceId,
        string securitySnapshotVersion,
        string correlationId,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteLocalAsync(
        string tableLogicalName,
        Guid recordId,
        Guid userObjectId,
        string deviceId,
        string correlationId,
        CancellationToken cancellationToken = default);

    Task ApplyServerChangeAsync(
        DataverseChange change,
        string securitySnapshotVersion,
        CancellationToken cancellationToken = default);
}

public sealed class LocalRecordStore(
    IDbContextFactory<VerseOffDbContext> contextFactory,
    TimeProvider timeProvider,
    ILocalDataProtector dataProtector) : ILocalRecordStore
{
    public async Task<CachedRecordEntity?> RetrieveAsync(
        string tableLogicalName,
        Guid recordId,
        CancellationToken cancellationToken = default)
    {
        ValidateTableName(tableLogicalName);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var record = await context.CachedRecords
            .AsNoTracking()
            .SingleOrDefaultAsync(
                record => record.TableLogicalName == tableLogicalName
                    && record.RecordId == recordId,
                cancellationToken);
        return record is null ? null : Decrypted(record);
    }

    public async Task<CachedRecordEntity> SaveLocalAsync(
        string tableLogicalName,
        Guid recordId,
        JsonDocument data,
        Guid userObjectId,
        string deviceId,
        string securitySnapshotVersion,
        string correlationId,
        CancellationToken cancellationToken = default)
    {
        ValidateTableName(tableLogicalName);
        ArgumentNullException.ThrowIfNull(data);
        ArgumentOutOfRangeException.ThrowIfEqual(userObjectId, Guid.Empty);
        ArgumentException.ThrowIfNullOrWhiteSpace(deviceId);
        ArgumentException.ThrowIfNullOrWhiteSpace(securitySnapshotVersion);
        ArgumentException.ThrowIfNullOrWhiteSpace(correlationId);

        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        await using var transaction =
            await context.Database.BeginTransactionAsync(cancellationToken);

        var existing = await context.CachedRecords.SingleOrDefaultAsync(
            record => record.TableLogicalName == tableLogicalName
                && record.RecordId == recordId,
            cancellationToken);
        var isNewRecord = existing is null;
        var existingState = existing?.SyncState;
        var now = timeProvider.GetUtcNow();
        if (existing?.SyncState is LocalSyncState.PendingDelete)
        {
            throw new InvalidOperationException(
                "A record pending deletion cannot be edited.");
        }

        var operationType = existing is null
            || existing.SyncState is LocalSyncState.PendingCreate
                ? DataverseOperationType.Create
                : DataverseOperationType.Update;
        var state = existing?.SyncState == LocalSyncState.PendingCreate
            ? LocalSyncState.PendingCreate
            : operationType == DataverseOperationType.Create
                ? LocalSyncState.PendingCreate
                : LocalSyncState.PendingUpdate;

        if (existing is null)
        {
            existing = new CachedRecordEntity
            {
                TableLogicalName = tableLogicalName,
                RecordId = recordId,
                DataJson = dataProtector.Protect(
                    data.RootElement.GetRawText(),
                    LocalProtectionPurpose.Record(
                        tableLogicalName,
                        recordId)),
                SecuritySnapshotVersion = securitySnapshotVersion,
                SyncState = state,
                ModifiedAt = now,
            };
            context.CachedRecords.Add(existing);
        }
        else
        {
            existing.DataJson = dataProtector.Protect(
                data.RootElement.GetRawText(),
                LocalProtectionPurpose.Record(
                    tableLogicalName,
                    recordId));
            existing.SecuritySnapshotVersion = securitySnapshotVersion;
            existing.SyncState = state;
            existing.ModifiedAt = now;
        }

        var pendingEntries = await context.OutboxEntries
            .Where(entry => entry.TableLogicalName == tableLogicalName
                && entry.RecordId == recordId)
            .OrderBy(entry => entry.CreatedAt)
            .ToListAsync(cancellationToken);
        var baseEtag = existing?.Etag;
        var outbox = pendingEntries.LastOrDefault(entry =>
            entry.OperationType == operationType);
        if (!isNewRecord
            && existingState is LocalSyncState.PendingCreate
            && outbox is null)
        {
            throw new InvalidOperationException(
                "A pending local create has no matching outbox operation.");
        }

        if (outbox is null)
        {
            var operationId = Guid.NewGuid();
            outbox = new OutboxEntryEntity
            {
                OperationId = operationId,
                OperationType = operationType,
                TableLogicalName = tableLogicalName,
                RecordId = recordId,
                PayloadJson = dataProtector.Protect(
                    data.RootElement.GetRawText(),
                    LocalProtectionPurpose.Outbox(operationId)),
                BaseEtag = baseEtag,
                UserObjectId = userObjectId,
                DeviceId = deviceId,
                CreatedAt = now,
                CorrelationId = correlationId,
                State = state,
            };
            context.OutboxEntries.Add(outbox);
        }
        else
        {
            outbox.PayloadJson = dataProtector.Protect(
                data.RootElement.GetRawText(),
                LocalProtectionPurpose.Outbox(outbox.OperationId));
            outbox.BaseEtag = baseEtag;
            outbox.UserObjectId = userObjectId;
            outbox.DeviceId = deviceId;
            outbox.CreatedAt = now;
            outbox.CorrelationId = correlationId;
            outbox.State = state;
            outbox.AttemptCount = 0;
            outbox.LastError = null;
        }

        var superseded = pendingEntries
            .Where(entry => entry != outbox)
            .ToArray();
        context.OutboxEntries.RemoveRange(superseded);

        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return existing is null
            ? throw new InvalidOperationException(
                "The cached record was not created.")
            : Decrypted(existing);
    }

    public async Task<bool> DeleteLocalAsync(
        string tableLogicalName,
        Guid recordId,
        Guid userObjectId,
        string deviceId,
        string correlationId,
        CancellationToken cancellationToken = default)
    {
        ValidateTableName(tableLogicalName);
        ArgumentOutOfRangeException.ThrowIfEqual(userObjectId, Guid.Empty);
        ArgumentException.ThrowIfNullOrWhiteSpace(deviceId);
        ArgumentException.ThrowIfNullOrWhiteSpace(correlationId);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        await using var transaction =
            await context.Database.BeginTransactionAsync(cancellationToken);

        var existing = await context.CachedRecords.SingleOrDefaultAsync(
            record => record.TableLogicalName == tableLogicalName
                && record.RecordId == recordId,
            cancellationToken);
        if (existing is null)
        {
            return false;
        }

        if (existing.SyncState == LocalSyncState.PendingCreate)
        {
            context.CachedRecords.Remove(existing);
            var pending = await context.OutboxEntries
                .Where(entry => entry.TableLogicalName == tableLogicalName
                    && entry.RecordId == recordId)
                .ToListAsync(cancellationToken);
            context.OutboxEntries.RemoveRange(pending);
        }
        else
        {
            existing.SyncState = LocalSyncState.PendingDelete;
            existing.ModifiedAt = timeProvider.GetUtcNow();
            var pending = await context.OutboxEntries
                .Where(entry => entry.TableLogicalName == tableLogicalName
                    && entry.RecordId == recordId)
                .ToListAsync(cancellationToken);
            var delete = pending.FirstOrDefault(entry =>
                entry.OperationType is DataverseOperationType.Delete);
            if (delete is null)
            {
                var operationId = Guid.NewGuid();
                delete = new OutboxEntryEntity
                {
                    OperationId = operationId,
                    OperationType = DataverseOperationType.Delete,
                    TableLogicalName = tableLogicalName,
                    RecordId = recordId,
                    PayloadJson = dataProtector.Protect(
                        "{}",
                        LocalProtectionPurpose.Outbox(operationId)),
                    BaseEtag = existing.Etag,
                    UserObjectId = userObjectId,
                    DeviceId = deviceId,
                    CreatedAt = existing.ModifiedAt,
                    CorrelationId = correlationId,
                    State = LocalSyncState.PendingDelete,
                };
                context.OutboxEntries.Add(delete);
            }
            else
            {
                delete.UserObjectId = userObjectId;
                delete.DeviceId = deviceId;
                delete.CreatedAt = existing.ModifiedAt;
                delete.CorrelationId = correlationId;
                delete.AttemptCount = 0;
                delete.LastError = null;
            }

            context.OutboxEntries.RemoveRange(
                pending.Where(entry => entry != delete));
        }

        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return true;
    }

    public async Task ApplyServerChangeAsync(
        DataverseChange change,
        string securitySnapshotVersion,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(change);
        ValidateTableName(change.TableLogicalName);
        ArgumentException.ThrowIfNullOrWhiteSpace(
            securitySnapshotVersion);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        await using var transaction =
            await context.Database.BeginTransactionAsync(cancellationToken);
        var existing = await context.CachedRecords.SingleOrDefaultAsync(
            record =>
                record.TableLogicalName == change.TableLogicalName
                && record.RecordId == change.RecordId,
            cancellationToken);
        if (existing?.SyncState is LocalSyncState.PendingCreate
            or LocalSyncState.PendingUpdate
            or LocalSyncState.PendingDelete)
        {
            if (!string.Equals(
                    existing.Etag,
                    change.Etag,
                    StringComparison.Ordinal))
            {
                existing.SyncState = LocalSyncState.Conflict;
                await context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }

            return;
        }

        if (change.IsDeleted)
        {
            if (existing is not null)
            {
                context.CachedRecords.Remove(existing);
                await context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }

            return;
        }

        if (change.Payload.ValueKind is not JsonValueKind.Object)
        {
            throw new InvalidDataException(
                "A Dataverse server change payload must be a JSON object.");
        }

        var protectedJson = dataProtector.Protect(
            change.Payload.GetRawText(),
            LocalProtectionPurpose.Record(
                change.TableLogicalName,
                change.RecordId));
        if (existing is null)
        {
            context.CachedRecords.Add(new()
            {
                TableLogicalName = change.TableLogicalName,
                RecordId = change.RecordId,
                DataJson = protectedJson,
                Etag = change.Etag,
                SecuritySnapshotVersion = securitySnapshotVersion,
                SyncState = LocalSyncState.Synced,
                ModifiedAt = timeProvider.GetUtcNow(),
            });
        }
        else
        {
            existing.DataJson = protectedJson;
            existing.Etag = change.Etag;
            existing.SecuritySnapshotVersion = securitySnapshotVersion;
            existing.SyncState = LocalSyncState.Synced;
            existing.ModifiedAt = timeProvider.GetUtcNow();
        }

        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    private static void ValidateTableName(string tableLogicalName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        if (!tableLogicalName.All(character =>
                char.IsAsciiLetterOrDigit(character) || character == '_'))
        {
            throw new ArgumentException(
                "Dataverse logical names may contain ASCII letters, digits, and underscores only.",
                nameof(tableLogicalName));
        }
    }

    private CachedRecordEntity Decrypted(CachedRecordEntity entity) =>
        new()
        {
            TableLogicalName = entity.TableLogicalName,
            RecordId = entity.RecordId,
            DataJson = dataProtector.Unprotect(
                entity.DataJson,
                LocalProtectionPurpose.Record(
                    entity.TableLogicalName,
                    entity.RecordId)),
            Etag = entity.Etag,
            SecuritySnapshotVersion = entity.SecuritySnapshotVersion,
            SyncState = entity.SyncState,
            ModifiedAt = entity.ModifiedAt,
        };
}
