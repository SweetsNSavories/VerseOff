using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace VerseOff.Storage.Tests;

[TestClass]
public sealed class TimelineCacheStoreTests
{
    [TestMethod]
    public async Task StoresEncryptedTimelineWithNormalizedPartiesAndAttachments()
    {
        await using var connection = new SqliteConnection(
            "Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<VerseOffDbContext>()
            .UseSqlite(connection)
            .Options;
        await using (var setup = new VerseOffDbContext(options))
        {
            await setup.Database.EnsureCreatedAsync();
        }

        var protector = new AesGcmLocalDataProtector(
            Enumerable.Range(1, 32).Select(value => (byte)value).ToArray());
        var store = new TimelineCacheStore(
            new TestDbContextFactory(options),
            protector);
        var recordId = Guid.NewGuid();
        var regardingId = Guid.NewGuid();
        var attachmentId = Guid.NewGuid();
        using var payload = JsonDocument.Parse(
            """{"subject":"Hello customer","body":"Details"}""");

        await store.UpsertAsync(new(
            recordId,
            "account",
            regardingId,
            "email",
            RecordKind: 0,
            payload.RootElement.Clone(),
            DateTimeOffset.UtcNow,
            IsPinned: false,
            "security-v1",
            "W/\"1\"",
            IsDeleted: false,
            [
                new(
                    ParticipationTypeMask: 1,
                    Guid.NewGuid(),
                    "systemuser",
                    null,
                    "sender@example.test"),
                new(
                    ParticipationTypeMask: 2,
                    Guid.NewGuid(),
                    "contact",
                    null,
                    "recipient@example.test"),
            ],
            [
                new(
                    attachmentId,
                    "message.txt",
                    "text/plain",
                    12,
                    "checksum",
                    "W/\"a\"",
                    TransferState: 2,
                    "files/message.txt"),
            ]));

        var records = await store.QueryAsync(
            "account",
            regardingId,
            "security-v1",
            "hello",
            10);

        Assert.HasCount(1, records);
        Assert.HasCount(2, records[0].Parties);
        Assert.AreEqual(1, records[0].Parties[0].ParticipationTypeMask);
        Assert.AreEqual(
            "recipient@example.test",
            records[0].Parties[1].AddressUsed);
        Assert.HasCount(1, records[0].Attachments);
        Assert.AreEqual(
            "files/message.txt",
            records[0].Attachments[0].StorageReference);

        await using var verification = Context(options);
        var storedRecord = await verification.TimelineRecords.SingleAsync();
        var storedParty = await verification.TimelineParties.FirstAsync();
        var storedAttachment =
            await verification.TimelineAttachments.SingleAsync();
        Assert.IsFalse(storedRecord.ProtectedPayloadJson.Contains(
            "Hello",
            StringComparison.Ordinal));
        Assert.IsFalse(storedParty.ProtectedDetailsJson.Contains(
            "example.test",
            StringComparison.Ordinal));
        Assert.IsFalse(storedAttachment.ProtectedStorageReference.Contains(
            "message.txt",
            StringComparison.Ordinal));
    }

    private static VerseOffDbContext Context(
        DbContextOptions<VerseOffDbContext> options) =>
        new(options);

    private sealed class TestDbContextFactory(
        DbContextOptions<VerseOffDbContext> options)
        : IDbContextFactory<VerseOffDbContext>
    {
        public VerseOffDbContext CreateDbContext() => new(options);
    }
}
