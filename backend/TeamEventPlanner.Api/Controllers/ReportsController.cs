using Microsoft.AspNetCore.Mvc;
using TeamEventPlanner.Services;

namespace TeamEventPlanner.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IEventReportService reportService;
        private readonly ILogger<ReportsController> logger;

        public ReportsController(IEventReportService reportService, ILogger<ReportsController> logger)
        {
            this.reportService = reportService;
            this.logger = logger;
        }

        [HttpGet("data")]
        public async Task<IActionResult> GetReportData([FromQuery] DateTime start, [FromQuery] DateTime end, [FromQuery] DateTimeOffset clientLocalTime)
        {
            if (!Request.Headers.TryGetValue("X-Tenant-ID", out var tenantHeader) || !Guid.TryParse(tenantHeader, out var tenantId))
                return BadRequest("X-Tenant-ID header missing or invalid.");

            var startUtc = start.ToUniversalTime();
            var endUtc = end.ToUniversalTime();

            var rows = await reportService.GetReportDataAsync(tenantId, startUtc, endUtc);

            var response = new
            {
                reportGeneratedOn = clientLocalTime,
                data = rows
            };

            return Ok(response);
        }
    }
}
