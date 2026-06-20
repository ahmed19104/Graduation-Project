using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class ManualPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ManualPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TouristId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManualPlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManualPlans_Tourists_TouristId",
                        column: x => x.TouristId,
                        principalTable: "Tourists",
                        principalColumn: "TouristId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ManualPlanItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DayNumber = table.Column<int>(type: "int", nullable: false),
                    ManualPlanId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlaceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManualPlanItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManualPlanItems_ManualPlans_ManualPlanId",
                        column: x => x.ManualPlanId,
                        principalTable: "ManualPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ManualPlanItems_Places_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "Places",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ManualPlanItems_ManualPlanId",
                table: "ManualPlanItems",
                column: "ManualPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_ManualPlanItems_PlaceId",
                table: "ManualPlanItems",
                column: "PlaceId");

            migrationBuilder.CreateIndex(
                name: "IX_ManualPlans_TouristId",
                table: "ManualPlans",
                column: "TouristId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ManualPlanItems");

            migrationBuilder.DropTable(
                name: "ManualPlans");
        }
    }
}
