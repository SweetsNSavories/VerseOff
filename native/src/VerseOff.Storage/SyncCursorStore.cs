using Microsoft.EntityFrameworkCore;

namespace VerseOff.Storage;

public interface ISyncCursorStore
{
    Task<string?> GetAsync(
        string scope,
        string tableLogicalName,
        CancellationToken cancellationToken = default);

    Task SetAsync(
        string scope,
        string tableLogicalName,
        string deltaLink,
        CancellationToken cancellationToken = default);
}

public sealed class SyncCursorStore(
    IDbContextFactory<VerseOffDbContext> contextFactory,
    ILocalDataProtector dataProtector,
    TimeProvider timeProvider) : ISyncCursorStore
{
    public async Task<string?> GetAsync(
        string scope,
        string tableLogicalName,
        CancellationToken cancellationToken = default)
    {
        Validate(scope, tableLogicalName);
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var cursor = await context.SyncCursors
            .AsNoTracking()
            .SingleOrDefaultAsync(
                candidate =>
                    candidate.Scope == scope
                    && candidate.TableLogicalName == tableLogicalName,
                cancellationToken);
        return cursor is null
            ? null
            : dataProtector.Unprotect(
                cursor.ProtectedDeltaLink,
                LocalProtectionPurpose.SyncCursor(
                    scope,
                    tableLogicalName));
    }

    public async Task SetAsync(
        string scope,
        string tableLogicalName,
        string deltaLink,
        CancellationToken cancellationToken = default)
    {
        Validate(scope, tableLogicalName);
        ArgumentException.ThrowIfNullOrWhiteSpace(deltaLink);
        if (!Uri.TryCreate(deltaLink, UriKind.Absolute, out var uri)
            || !string.Equals(
                uri.Scheme,
                Uri.UriSchemeHttps,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "A sync delta cursor must be an absolute HTTPS URI.",
                nameof(deltaLink));
        }

        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        var cursor = await context.SyncCursors.SingleOrDefaultAsync(
            candidate =>
                candidate.Scope == scope
                && candidate.TableLogicalName == tableLogicalName,
            cancellationToken);
        if (cursor is null)
        {
            cursor = new()
            {
                Scope = scope,
                TableLogicalName = tableLogicalName,
                ProtectedDeltaLink = string.Empty,
            };
            context.SyncCursors.Add(cursor);
        }

        cursor.ProtectedDeltaLink = dataProtector.Protect(
            uri.AbsoluteUri,
            LocalProtectionPurpose.SyncCursor(
                scope,
                tableLogicalName));
        cursor.UpdatedAt = timeProvider.GetUtcNow();
        await context.SaveChangesAsync(cancellationToken);
    }

    private static void Validate(
        string scope,
        string tableLogicalName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(scope);
        ArgumentException.ThrowIfNullOrWhiteSpace(tableLogicalName);
        if (scope.Length > 256
            || tableLogicalName.Length > 128
            || !tableLogicalName.All(character =>
                char.IsAsciiLetterOrDigit(character) || character == '_'))
        {
            throw new ArgumentException(
                "The sync cursor scope or table name is invalid.");
        }
    }
}
