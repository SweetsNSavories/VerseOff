using Microsoft.EntityFrameworkCore;
using VerseOff.Domain;

namespace VerseOff.Storage;

public sealed class VerseOffDbContext(DbContextOptions<VerseOffDbContext> options)
    : DbContext(options)
{
    public DbSet<CachedRecordEntity> CachedRecords => Set<CachedRecordEntity>();

    public DbSet<OutboxEntryEntity> OutboxEntries => Set<OutboxEntryEntity>();

    public DbSet<EntitlementLeaseEntity> EntitlementLeases =>
        Set<EntitlementLeaseEntity>();

    public DbSet<TimelineRecordEntity> TimelineRecords =>
        Set<TimelineRecordEntity>();

    public DbSet<TimelinePartyEntity> TimelineParties =>
        Set<TimelinePartyEntity>();

    public DbSet<TimelineAttachmentEntity> TimelineAttachments =>
        Set<TimelineAttachmentEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);

        modelBuilder.Entity<CachedRecordEntity>(entity =>
        {
            entity.HasKey(record => new
            {
                record.TableLogicalName,
                record.RecordId,
            });
            entity.Property(record => record.TableLogicalName).HasMaxLength(128);
            entity.Property(record => record.DataJson).IsRequired();
            entity.Property(record => record.SecuritySnapshotVersion)
                .HasMaxLength(128);
            entity.Property(record => record.ModifiedAt)
                .HasConversion(
                    value => value.UtcDateTime.Ticks,
                    value => new DateTimeOffset(value, TimeSpan.Zero));
            entity.HasIndex(record => record.SyncState);
        });

        modelBuilder.Entity<OutboxEntryEntity>(entity =>
        {
            entity.HasKey(entry => entry.OperationId);
            entity.Property(entry => entry.TableLogicalName).HasMaxLength(128);
            entity.Property(entry => entry.DeviceId).HasMaxLength(256);
            entity.Property(entry => entry.CorrelationId).HasMaxLength(128);
            entity.Property(entry => entry.CreatedAt)
                .HasConversion(
                    value => value.UtcDateTime.Ticks,
                    value => new DateTimeOffset(value, TimeSpan.Zero));
            entity.HasIndex(entry => new
            {
                entry.State,
                entry.CreatedAt,
            });
        });

        modelBuilder.Entity<EntitlementLeaseEntity>(entity =>
        {
            entity.HasKey(lease => lease.LeaseId);
            entity.Property(lease => lease.ExpiresAt)
                .HasConversion(
                    value => value.UtcDateTime.Ticks,
                    value => new DateTimeOffset(value, TimeSpan.Zero));
            entity.HasIndex(lease => new
            {
                lease.UserObjectId,
                lease.DeviceId,
                lease.ExpiresAt,
            });
        });

        modelBuilder.Entity<TimelineRecordEntity>(entity =>
        {
            entity.HasKey(record => record.RecordId);
            entity.Property(record => record.RegardingTable)
                .HasMaxLength(128);
            entity.Property(record => record.TableLogicalName)
                .HasMaxLength(128);
            entity.Property(record => record.SecuritySnapshotVersion)
                .HasMaxLength(128);
            entity.Property(record => record.SortDate)
                .HasConversion(
                    value => value.UtcDateTime.Ticks,
                    value => new DateTimeOffset(value, TimeSpan.Zero));
            entity.HasIndex(record => new
            {
                record.RegardingTable,
                record.RegardingId,
                record.SortDate,
            });
            entity.HasIndex(record => record.SecuritySnapshotVersion);
        });

        modelBuilder.Entity<TimelinePartyEntity>(entity =>
        {
            entity.HasKey(party => new
            {
                party.TimelineRecordId,
                party.PartyIndex,
            });
            entity.HasOne<TimelineRecordEntity>()
                .WithMany()
                .HasForeignKey(party => party.TimelineRecordId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TimelineAttachmentEntity>(entity =>
        {
            entity.HasKey(attachment => attachment.AttachmentId);
            entity.Property(attachment => attachment.FileName)
                .HasMaxLength(512);
            entity.Property(attachment => attachment.MimeType)
                .HasMaxLength(256);
            entity.Property(attachment => attachment.Checksum)
                .HasMaxLength(128);
            entity.HasOne<TimelineRecordEntity>()
                .WithMany()
                .HasForeignKey(attachment => attachment.TimelineRecordId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(attachment => attachment.TimelineRecordId);
        });
    }
}

public sealed class CachedRecordEntity
{
    public required string TableLogicalName { get; set; }

    public Guid RecordId { get; set; }

    public required string DataJson { get; set; }

    public string? Etag { get; set; }

    public required string SecuritySnapshotVersion { get; set; }

    public LocalSyncState SyncState { get; set; }

    public DateTimeOffset ModifiedAt { get; set; }
}

public sealed class OutboxEntryEntity
{
    public Guid OperationId { get; set; }

    public DataverseOperationType OperationType { get; set; }

    public required string TableLogicalName { get; set; }

    public Guid RecordId { get; set; }

    public required string PayloadJson { get; set; }

    public string? BaseEtag { get; set; }

    public Guid UserObjectId { get; set; }

    public required string DeviceId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public required string CorrelationId { get; set; }

    public LocalSyncState State { get; set; }

    public int AttemptCount { get; set; }

    public string? LastError { get; set; }
}

public sealed class EntitlementLeaseEntity
{
    public Guid LeaseId { get; set; }

    public Guid TenantId { get; set; }

    public Guid UserObjectId { get; set; }

    public required string DeviceId { get; set; }

    public Guid AppModuleId { get; set; }

    public Guid ProfileId { get; set; }

    public DateTimeOffset ExpiresAt { get; set; }

    public required string PayloadJson { get; set; }
}

public sealed class TimelineRecordEntity
{
    public Guid RecordId { get; set; }

    public required string RegardingTable { get; set; }

    public Guid RegardingId { get; set; }

    public required string TableLogicalName { get; set; }

    public int RecordKind { get; set; }

    public required string ProtectedPayloadJson { get; set; }

    public DateTimeOffset SortDate { get; set; }

    public bool IsPinned { get; set; }

    public required string SecuritySnapshotVersion { get; set; }

    public string? Etag { get; set; }

    public bool IsDeleted { get; set; }
}

public sealed class TimelinePartyEntity
{
    public Guid TimelineRecordId { get; set; }

    public int PartyIndex { get; set; }

    public int ParticipationTypeMask { get; set; }

    public Guid? PartyId { get; set; }

    public string? PartyLogicalName { get; set; }

    public required string ProtectedDetailsJson { get; set; }
}

public sealed class TimelineAttachmentEntity
{
    public Guid AttachmentId { get; set; }

    public Guid TimelineRecordId { get; set; }

    public required string FileName { get; set; }

    public required string MimeType { get; set; }

    public long Size { get; set; }

    public string? Checksum { get; set; }

    public string? Etag { get; set; }

    public int TransferState { get; set; }

    public required string ProtectedStorageReference { get; set; }
}
