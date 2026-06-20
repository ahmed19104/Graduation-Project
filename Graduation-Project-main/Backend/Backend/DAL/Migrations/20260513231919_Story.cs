using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class Story : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stories_Tourists_TouristId",
                table: "Stories");

            migrationBuilder.DropColumn(
                name: "LoveCount",
                table: "Stories");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "Stories");

            migrationBuilder.AlterColumn<string>(
                name: "TouristId",
                table: "Stories",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "MediaType",
                table: "Stories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Stories",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "StoryInteractions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsViewed = table.Column<bool>(type: "bit", nullable: false),
                    IsLoved = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoryInteractions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StoryInteractions_Stories_StoryId",
                        column: x => x.StoryId,
                        principalTable: "Stories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Stories_UserId",
                table: "Stories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_StoryInteractions_StoryId",
                table: "StoryInteractions",
                column: "StoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Stories_AspNetUsers_UserId",
                table: "Stories",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stories_Tourists_TouristId",
                table: "Stories",
                column: "TouristId",
                principalTable: "Tourists",
                principalColumn: "TouristId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stories_AspNetUsers_UserId",
                table: "Stories");

            migrationBuilder.DropForeignKey(
                name: "FK_Stories_Tourists_TouristId",
                table: "Stories");

            migrationBuilder.DropTable(
                name: "StoryInteractions");

            migrationBuilder.DropIndex(
                name: "IX_Stories_UserId",
                table: "Stories");

            migrationBuilder.DropColumn(
                name: "MediaType",
                table: "Stories");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Stories");

            migrationBuilder.AlterColumn<string>(
                name: "TouristId",
                table: "Stories",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoveCount",
                table: "Stories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "Stories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Stories_Tourists_TouristId",
                table: "Stories",
                column: "TouristId",
                principalTable: "Tourists",
                principalColumn: "TouristId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
