using VerseOff.Domain;

namespace VerseOff.Sync;

public interface IPendingOperationSource
{
    IAsyncEnumerable<DataverseOperation> ReadPendingAsync(
        CancellationToken cancellationToken = default);

    ValueTask ApplyResultAsync(
        SyncResult result,
        CancellationToken cancellationToken = default);
}

public interface IDataverseWriteGateway
{
    ValueTask<SyncResult> ExecuteAsync(
        DataverseOperation operation,
        CancellationToken cancellationToken = default);
}

public sealed record SyncSummary(
    int Attempted,
    int Succeeded,
    int Failed);

public sealed class SyncCoordinator(
    IPendingOperationSource operationSource,
    IDataverseWriteGateway gateway)
{
    public async ValueTask<SyncSummary> PushAsync(
        CancellationToken cancellationToken = default)
    {
        var attempted = 0;
        var succeeded = 0;

        await foreach (var operation in operationSource
            .ReadPendingAsync(cancellationToken))
        {
            cancellationToken.ThrowIfCancellationRequested();
            attempted++;
            var result = await gateway.ExecuteAsync(
                operation,
                cancellationToken);
            await operationSource.ApplyResultAsync(result, cancellationToken);
            if (result.Succeeded)
            {
                succeeded++;
            }
        }

        return new(attempted, succeeded, attempted - succeeded);
    }
}
