using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VerseOff.Storage.Migrations
{
    /// <inheritdoc />
    public partial class InitialDeviceStore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CachedRecords",
                columns: table => new
                {
                    TableLogicalName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    RecordId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DataJson = table.Column<string>(type: "TEXT", nullable: false),
                    Etag = table.Column<string>(type: "TEXT", nullable: true),
                    SecuritySnapshotVersion = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    SyncState = table.Column<int>(type: "INTEGER", nullable: false),
                    ModifiedAt = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CachedRecords", x => new { x.TableLogicalName, x.RecordId });
                });

            migrationBuilder.CreateTable(
                name: "EntitlementLeases",
                columns: table => new
                {
                    LeaseId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserObjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DeviceId = table.Column<string>(type: "TEXT", nullable: false),
                    AppModuleId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ProfileId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ExpiresAt = table.Column<long>(type: "INTEGER", nullable: false),
                    PayloadJson = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntitlementLeases", x => x.LeaseId);
                });

            migrationBuilder.CreateTable(
                name: "OutboxEntries",
                columns: table => new
                {
                    OperationId = table.Column<Guid>(type: "TEXT", nullable: false),
                    OperationType = table.Column<int>(type: "INTEGER", nullable: false),
                    TableLogicalName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    RecordId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PayloadJson = table.Column<string>(type: "TEXT", nullable: false),
                    BaseEtag = table.Column<string>(type: "TEXT", nullable: true),
                    UserObjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DeviceId = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    CreatedAt = table.Column<long>(type: "INTEGER", nullable: false),
                    CorrelationId = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    State = table.Column<int>(type: "INTEGER", nullable: false),
                    AttemptCount = table.Column<int>(type: "INTEGER", nullable: false),
                    LastError = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutboxEntries", x => x.OperationId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CachedRecords_SyncState",
                table: "CachedRecords",
                column: "SyncState");

            migrationBuilder.CreateIndex(
                name: "IX_EntitlementLeases_UserObjectId_DeviceId_ExpiresAt",
                table: "EntitlementLeases",
                columns: new[] { "UserObjectId", "DeviceId", "ExpiresAt" });

            migrationBuilder.CreateIndex(
                name: "IX_OutboxEntries_State_CreatedAt",
                table: "OutboxEntries",
                columns: new[] { "State", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CachedRecords");

            migrationBuilder.DropTable(
                name: "EntitlementLeases");

            migrationBuilder.DropTable(
                name: "OutboxEntries");
        }
    }
}
