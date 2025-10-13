using Microsoft.AspNetCore.Mvc;
using TeamEventPlanner.Core.Models;
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

        [HttpGet("event-report")]
        public IActionResult GetEventReport()
        {
            // Path to your RDL
            var reportPath = Path.Combine(@"C:\", "reports", "event_report.rdl");
            //var reportPath = Path.Combine(Directory.GetCurrentDirectory(), "reports", "event_report.rdl");

            // Return RDL file as JSON for Bold Reports React Viewer
            return File(System.IO.File.ReadAllBytes(reportPath), "application/octet-stream");
        }

        [HttpGet("Bold")]
        public async Task<IActionResult> GetBoldReportData(
    [FromQuery] DateTime start,
    [FromQuery] DateTime end,
    [FromQuery] DateTimeOffset clientLocalTime)
        {
            if (!Request.Headers.TryGetValue("X-Tenant-ID", out var tenantHeader) ||
                !Guid.TryParse(tenantHeader, out var tenantId))
                return BadRequest("X-Tenant-ID header missing or invalid.");

            var startUtc = start.ToUniversalTime();
            var endUtc = end.ToUniversalTime();

            var events = await reportService.GetReportDataAsync1(tenantId, startUtc, endUtc);

            var result = events.Select(e => new EventReportDto
            {
                Id = e.Id,
                Name = e.Name,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                Venue = e.Venue,
                Attendees = e.Attendees.Select(a => new AttendeeDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Email = a.Email
                }).ToList()
            }).ToList();

            var response = new ReportResponseDto
            {
                ReportGeneratedOn = clientLocalTime,
                Data = result
            };

            return Ok(response);
        }

    }
}
