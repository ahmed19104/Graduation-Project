using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class Test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CancellationStrikes",
                table: "TourGuides",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsSuspended",
                table: "TourGuides",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ChatMessageId",
                table: "Bookings",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChatMessage",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SenderId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessage", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ChatMessageId",
                table: "Bookings",
                column: "ChatMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_ChatMessage_ChatMessageId",
                table: "Bookings",
                column: "ChatMessageId",
                principalTable: "ChatMessage",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_ChatMessage_ChatMessageId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "ChatMessage");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_ChatMessageId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "CancellationStrikes",
                table: "TourGuides");

            migrationBuilder.DropColumn(
                name: "IsSuspended",
                table: "TourGuides");

            migrationBuilder.DropColumn(
                name: "ChatMessageId",
                table: "Bookings");
        }
    }
}
