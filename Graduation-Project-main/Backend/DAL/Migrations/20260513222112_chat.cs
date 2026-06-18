using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class chat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_ChatMessage_ChatMessageId",
                table: "Bookings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChatMessage",
                table: "ChatMessage");

            migrationBuilder.RenameTable(
                name: "ChatMessage",
                newName: "ChatMessages");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "ChatMessages",
                newName: "ReceiverId");

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "ChatMessages",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "ChatMessages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChatMessages",
                table: "ChatMessages",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_BookingId",
                table: "ChatMessages",
                column: "BookingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_ChatMessages_ChatMessageId",
                table: "Bookings",
                column: "ChatMessageId",
                principalTable: "ChatMessages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_Bookings_BookingId",
                table: "ChatMessages",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_ChatMessages_ChatMessageId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_Bookings_BookingId",
                table: "ChatMessages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChatMessages",
                table: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_BookingId",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "Content",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "ChatMessages");

            migrationBuilder.RenameTable(
                name: "ChatMessages",
                newName: "ChatMessage");

            migrationBuilder.RenameColumn(
                name: "ReceiverId",
                table: "ChatMessage",
                newName: "Message");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChatMessage",
                table: "ChatMessage",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_ChatMessage_ChatMessageId",
                table: "Bookings",
                column: "ChatMessageId",
                principalTable: "ChatMessage",
                principalColumn: "Id");
        }
    }
}
