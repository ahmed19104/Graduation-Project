using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class BookingRela : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AiPlanId",
                table: "Bookings",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ManualPlanId",
                table: "Bookings",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_AiPlanId",
                table: "Bookings",
                column: "AiPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ManualPlanId",
                table: "Bookings",
                column: "ManualPlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AiPlans_AiPlanId",
                table: "Bookings",
                column: "AiPlanId",
                principalTable: "AiPlans",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_ManualPlans_ManualPlanId",
                table: "Bookings",
                column: "ManualPlanId",
                principalTable: "ManualPlans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AiPlans_AiPlanId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_ManualPlans_ManualPlanId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_AiPlanId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_ManualPlanId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "AiPlanId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "ManualPlanId",
                table: "Bookings");
        }
    }
}
