using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace VerseOff.Storage;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddVerseOffStorage(
        this IServiceCollection services,
        string connectionString,
        ILocalDataProtector dataProtector,
        IEntitlementLeaseVerifier entitlementLeaseVerifier)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);
        ArgumentNullException.ThrowIfNull(dataProtector);
        ArgumentNullException.ThrowIfNull(entitlementLeaseVerifier);

        services.AddSingleton(TimeProvider.System);
        services.AddSingleton(dataProtector);
        services.AddSingleton(entitlementLeaseVerifier);
        services.AddPooledDbContextFactory<VerseOffDbContext>(
            options => options.UseSqlite(connectionString));
        services.AddScoped<ILocalRecordStore, LocalRecordStore>();
        services.AddScoped<IEntitlementLeaseStore, EntitlementLeaseStore>();
        services.AddScoped<ITimelineCacheStore, TimelineCacheStore>();
        services.AddScoped<ISyncCursorStore, SyncCursorStore>();
        services.AddSingleton<DeviceStoreInitializer>();
        return services;
    }
}
