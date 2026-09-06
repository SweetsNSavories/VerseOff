using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VerseOff.Storage.Migrations
{
    /// <inheritdoc />
    public partial class AddTimelineCache : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TimelineRecords",
                columns: table => new
                {
                    RecordId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RegardingTable = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    RegardingId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TableLogicalName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    RecordKind = table.Column<int>(type: "INTEGER", nullable: false),
                    ProtectedPayloadJson = table.Column<string>(type: "TEXT", nullable: false),
                    SortDate = table.Column<long>(type: "INTEGER", nullable: false),
                    IsPinned = table.Column<bool>(type: "INTEGER", nullable: false),
                    SecuritySnapshotVersion = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Etag = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimelineRecords", x => x.RecordId);
                });

            migrationBuilder.CreateTable(
                name: "TimelineAttachments",
                columns: table => new
                {
                    AttachmentId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TimelineRecordId = table.Column<Guid>(type: "TEXT", nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 512, nullable: false),
                    MimeType = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    Size = table.Column<long>(type: "INTEGER", nullable: false),
                    Checksum = table.Column<string>(type: "TEXT", maxLength: 128, nullable: true),
                    Etag = table.Column<string>(type: "TEXT", nullable: true),
                    TransferState = table.Column<int>(type: "INTEGER", nullable: false),
                    ProtectedStorageReference = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimelineAttachments", x => x.AttachmentId);
                    table.ForeignKey(
                        name: "FK_TimelineAttachments_TimelineRecords_TimelineRecordId",
                        column: x => x.TimelineRecordId,
                        principalTable: "TimelineRecords",
                        principalColumn: "RecordId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimelineParties",
                columns: table => new
                {
                    TimelineRecordId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PartyIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    ParticipationTypeMask = table.Column<int>(type: "INTEGER", nullable: false),
                    PartyId = table.Column<Guid>(type: "TEXT", nullable: true),
                    PartyLogicalName = table.Column<string>(type: "TEXT", nullable: true),
                    ProtectedDetailsJson = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimelineParties", x => new { x.TimelineRecordId, x.PartyIndex });
                    table.ForeignKey(
                        name: "FK_TimelineParties_TimelineRecords_TimelineRecordId",
                        column: x => x.TimelineRecordId,
                        principalTable: "TimelineRecords",
                        principalColumn: "RecordId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TimelineAttachments_TimelineRecordId",
                table: "TimelineAttachments",
                column: "TimelineRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_TimelineRecords_RegardingTable_RegardingId_SortDate",
                table: "TimelineRecords",
                columns: new[] { "RegardingTable", "RegardingId", "SortDate" });

            migrationBuilder.CreateIndex(
                name: "IX_TimelineRecords_SecuritySnapshotVersion",
                table: "TimelineRecords",
                column: "SecuritySnapshotVersion");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimelineAttachments");

            migrationBuilder.DropTable(
                name: "TimelineParties");

            migrationBuilder.DropTable(
                name: "TimelineRecords");
        }
    }
}
