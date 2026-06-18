using BLL.ModelVm.AiPlane;
using System.Text.Json;

namespace BLL.Service.Implementation
{
    public class AiIntegrationService : IAiIntegrationService
    {
        private readonly HttpClient _httpClient;
        private readonly IUnitOfWork _unitOfWork;

        public AiIntegrationService(HttpClient httpClient, IUnitOfWork unitOfWork)
        {
            _httpClient = httpClient;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Calls the Python AI API.
        /// While the Python team is not ready, falls back to a DB-aware mock that
        /// always returns valid IdFromModel values from the actual Places table,
        /// so the frontend can display real place details.
        /// </summary>
        public async Task<string> GetPlanFromPythonApi(int days, decimal budget, string type)
        {
            // ── Real API (uncomment when the Python service is ready) ──────────────
            // try
            // {
            //     var res = await _httpClient.PostAsJsonAsync(
            //         "http://localhost:5000/api/generate-plan",
            //         new { days, budget, type });
            //     if (res.IsSuccessStatusCode)
            //         return await res.Content.ReadAsStringAsync();
            // }
            // catch { /* fall through to mock */ }
            // ────────────────────────────────────────────────────────────────────────

            // DB-aware mock: read places that have IdFromModel > 0 (set by the migration)
            // and build a plan that references their real integer IDs.
            var places = (await _unitOfWork.Places.FindAsync(p => p.IdFromModel > 0))
                .OrderBy(p => p.IdFromModel)
                .ToList();

            if (!places.Any())
            {
                // No places seeded yet — return an empty plan rather than broken IDs.
                return "[]";
            }

            // Spread places across the requested number of days (cycle if fewer places than days).
            var items = Enumerable.Range(1, days)
                .Select(day =>
                {
                    var place = places[(day - 1) % places.Count];
                    return new PythonAiResponseItem
                    {
                        DayNumber = day,
                        PlaceId   = place.IdFromModel,
                    };
                })
                .ToList();

            return JsonSerializer.Serialize(items);
        }
    }
}
