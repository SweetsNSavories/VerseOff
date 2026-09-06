using System.Runtime.CompilerServices;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;
using VerseOff.Storage;

namespace VerseOff.Sync;

public sealed class EfPendingOperationSource : IPendingOperationSource
{
    private readonly IDbContextFactory<VerseOffDbContext> contextFactory;
    private readonly int maximumBatchSize;
    private readonly ILocalDataProtector dataProtector;

    public EfPendingOperationSource(
        IDbContextFactory<VerseOffDbContext> contextFactory,
        ILocalDataProtector dataProtector,
        int maximumBatchSize = 100)
    {
        this.contextFactory = contextFactory
            ?? throw new ArgumentNullException(nameof(contextFactory));
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maximumBatchSize);
        this.maximumBatchSize = maximumBatchSize;
        this.dataProtector = dataProtector
            ?? throw new ArgumentNullException(nameof(dataProtector));
    }

    public async IAsyncEnumerable<DataverseOperation> ReadPendingAsync(
        [EnumeratorCancellation]
        CancellationToken cancellationToken = default)
    {
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var entries = await context.OutboxEntries
            .AsNoTracking()
            .Where(entry =>
                entry.State == LocalSyncState.PendingCreate
                || entry.State == LocalSyncState.PendingUpdate
                || entry.State == LocalSyncState.PendingDelete)
            .OrderBy(entry => entry.CreatedAt)
            .ThenBy(entry => entry.OperationId)
            .Take(maximumBatchSize)
            .ToListAsync(cancellationToken);

        foreach (var entry in entries)
        {
            cancellationToken.ThrowIfCancellationRequested();
            using var payload = JsonDocument.Parse(
                dataProtector.Unprotect(
                    entry.PayloadJson,
                    LocalProtectionPurpose.Outbox(entry.OperationId)));
            yield return new(
                entry.OperationId,
                entry.OperationType,
                entry.TableLogicalName,
                entry.RecordId,
                payload.RootElement.Clone(),
                entry.BaseEtag,
                entry.UserObjectId,
                entry.DeviceId,
                entry.CreatedAt,
                entry.CorrelationId);
        }
    }

    public async ValueTask ApplyResultAsync(
        SyncResult result,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(result);

        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        await using var transaction =
            await context.Database.BeginTransactionAsync(cancellationToken);
        var entry = await context.OutboxEntries.SingleOrDefaultAsync(
            candidate => candidate.OperationId == result.OperationId,
            cancellationToken)
            ?? throw new InvalidOperationException(
                $"Outbox operation '{result.OperationId:D}' was not found.");
        var record = await context.CachedRecords.SingleOrDefaultAsync(
            candidate =>
                candidate.TableLogicalName == entry.TableLogicalName
                && candidate.RecordId == entry.RecordId,
            cancellationToken);

        if (result.Succeeded)
        {
            context.OutboxEntries.Remove(entry);
            if (entry.OperationType is DataverseOperationType.Delete)
            {
                if (record is not null)
                {
                    context.CachedRecords.Remove(record);
                }
            }
            else if (record is not null)
            {
                record.Etag = result.Etag;
                record.SyncState = LocalSyncState.Synced;
            }
        }
        else
        {
            entry.AttemptCount++;
            entry.LastError = TruncateError(result.ErrorMessage);
            var terminalState = result.StatusCode switch
            {
                409 or 412 => LocalSyncState.Conflict,
                400 or 401 or 403 => LocalSyncState.Rejected,
                _ => entry.State,
            };
            entry.State = terminalState;
            if (record is not null
                && terminalState is LocalSyncState.Conflict
                    or LocalSyncState.Rejected)
            {
                record.SyncState = terminalState;
            }
        }

        await context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    private static string? TruncateError(string? error)
    {
        const int maximumLength = 2048;
        return error is { Length: > maximumLength }
            ? error[..maximumLength]
            : error;
    }
}
