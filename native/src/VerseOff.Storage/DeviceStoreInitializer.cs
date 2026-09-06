using Microsoft.EntityFrameworkCore;

namespace VerseOff.Storage;

public sealed class DeviceStoreInitializer(
    IDbContextFactory<VerseOffDbContext> contextFactory)
{
    public async Task InitializeAsync(
        CancellationToken cancellationToken = default)
    {
        await using var context =
            await contextFactory.CreateDbContextAsync(cancellationToken);
        await context.Database.MigrateAsync(cancellationToken);
    }
}
