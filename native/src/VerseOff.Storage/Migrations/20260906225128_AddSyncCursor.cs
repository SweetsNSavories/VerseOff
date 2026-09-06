using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VerseOff.Storage.Migrations
{
    /// <inheritdoc />
    public partial class AddSyncCursor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SyncCursors",
                columns: table => new
                {
                    Scope = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    TableLogicalName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    ProtectedDeltaLink = table.Column<string>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SyncCursors", x => new { x.Scope, x.TableLogicalName });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SyncCursors");
        }
    }
}
