using VerseOff.Domain;
using VerseOff.Storage;

namespace VerseOff.Sync;

public sealed record PullRequest(
    string TableLogicalName,
    string SecuritySnapshotVersion,
    string? DeltaLink,
    int MaximumPages = 20);

public sealed record PullSummary(
    int Pages,
    int Upserts,
    int Deletes,
    string DeltaLink);

public interface IDataverseChangeGateway
{
    ValueTask<DataverseChangePage> ReadChangesAsync(
        string tableLogicalName,
        string? pageOrDeltaLink,
        CancellationToken cancellationToken = default);
}

public sealed class PullCoordinator(
    IDataverseChangeGateway gateway,
    ILocalRecordStore localRecordStore)
{
    public async ValueTask<PullSummary> PullAsync(
        PullRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.TableLogicalName);
        ArgumentException.ThrowIfNullOrWhiteSpace(
            request.SecuritySnapshotVersion);
        ArgumentOutOfRangeException.ThrowIfLessThan(
            request.MaximumPages,
            1);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(
            request.MaximumPages,
            100);
        var pages = 0;
        var upserts = 0;
        var deletes = 0;
        var pageLink = request.DeltaLink;
        string? finalDeltaLink = null;

        while (pages < request.MaximumPages)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var page = await gateway.ReadChangesAsync(
                request.TableLogicalName,
                pageLink,
                cancellationToken);
            pages++;
            foreach (var change in page.Changes)
            {
                if (!string.Equals(
                        change.TableLogicalName,
                        request.TableLogicalName,
                        StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidDataException(
                        "The gateway returned a change for the wrong table.");
                }

                await localRecordStore.ApplyServerChangeAsync(
                    change,
                    request.SecuritySnapshotVersion,
                    cancellationToken);
                if (change.IsDeleted)
                {
                    deletes++;
                }
                else
                {
                    upserts++;
                }
            }

            if (!string.IsNullOrWhiteSpace(page.NextLink))
            {
                pageLink = page.NextLink;
                continue;
            }

            finalDeltaLink = page.DeltaLink;
            break;
        }

        return finalDeltaLink is null
            ? throw new InvalidDataException(
                "Dataverse change tracking did not produce a delta link within the configured page limit.")
            : new(pages, upserts, deletes, finalDeltaLink);
    }
}
