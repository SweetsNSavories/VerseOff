using Microsoft.Extensions.Logging;
using VerseOff.Domain;

namespace VerseOff.Gateway;

public static class GatewayAuditLog
{
    private static readonly Action<
        ILogger,
        Guid,
        Guid,
        string,
        Exception?> EntitlementIssuedMessage =
        LoggerMessage.Define<Guid, Guid, string>(
            LogLevel.Information,
            new EventId(2001, nameof(EntitlementIssued)),
            "Issued entitlement {LeaseId} to user {UserObjectId} for device {DeviceId}.");

    private static readonly Action<
        ILogger,
        Guid,
        Guid,
        string,
        bool,
        int?,
        Exception?> SyncCompletedMessage =
        LoggerMessage.Define<Guid, Guid, string, bool, int?>(
            LogLevel.Information,
            new EventId(2002, nameof(SyncCompleted)),
            "Processed sync operation {OperationId} for user {UserObjectId} with correlation {CorrelationId}; success={Succeeded}, status={StatusCode}.");

    public static void EntitlementIssued(
        ILogger logger,
        OfflineEntitlementLease lease)
    {
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(lease);
        EntitlementIssuedMessage(
            logger,
            lease.LeaseId,
            lease.UserObjectId,
            lease.DeviceId,
            null);
    }

    public static void SyncCompleted(
        ILogger logger,
        DataverseOperation operation,
        SyncResult result)
    {
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(operation);
        ArgumentNullException.ThrowIfNull(result);
        SyncCompletedMessage(
            logger,
            operation.OperationId,
            operation.UserObjectId,
            operation.CorrelationId,
            result.Succeeded,
            result.StatusCode,
            null);
    }
}
