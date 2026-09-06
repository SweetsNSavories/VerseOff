using System.Text.Json;

namespace VerseOff.Domain;

public enum LocalSyncState
{
    Synced = 0,
    PendingCreate = 1,
    PendingUpdate = 2,
    PendingDelete = 3,
    Conflict = 4,
    Rejected = 5,
}

public enum DataverseOperationType
{
    Create = 1,
    Update = 2,
    Delete = 3,
}

public sealed record DataverseOperation(
    Guid OperationId,
    DataverseOperationType OperationType,
    string TableLogicalName,
    Guid RecordId,
    JsonElement Payload,
    string? BaseEtag,
    Guid UserObjectId,
    string DeviceId,
    DateTimeOffset CreatedAt,
    string CorrelationId);

public sealed record SyncResult(
    Guid OperationId,
    bool Succeeded,
    string? Etag,
    int? StatusCode,
    string? ErrorCode,
    string? ErrorMessage);

public sealed record DataverseChange(
    string TableLogicalName,
    Guid RecordId,
    JsonElement Payload,
    string? Etag,
    bool IsDeleted);

public sealed record DataverseChangePage(
    IReadOnlyList<DataverseChange> Changes,
    string? NextLink,
    string? DeltaLink);
