using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <summary>
    /// Assigns a unique sequential IdFromModel (1, 2, 3 …) to every Place row that
    /// still has the default value of 0.  Ordered by Name so the assignment is
    /// deterministic across runs on the same data set.
    ///
    /// This is required for the AI plan integration to work: the Python AI model
    /// references places by integer ID, and PlaceService.GetPlaceByIdAiPlan()
    /// queries  Places.FirstOrDefault(p => p.IdFromModel == id).
    /// Without this migration every AI plan lookup returns 404.
    /// </summary>
    public partial class AutoSetIdFromModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                WITH NumberedPlaces AS (
                    SELECT
                        Id,
                        ROW_NUMBER() OVER (ORDER BY Name ASC) AS NewId
                    FROM Places
                    WHERE IdFromModel = 0
                )
                UPDATE Places
                SET    IdFromModel = np.NewId
                FROM   Places
                INNER  JOIN NumberedPlaces np ON Places.Id = np.Id;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Intentionally a no-op: rolling back would zero out data that may
            // now be referenced by live AI plans.
        }
    }
}
