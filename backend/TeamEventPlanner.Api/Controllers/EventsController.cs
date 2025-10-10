using Microsoft.AspNetCore.Mvc;
using TeamEventPlanner.Core.Interfaces;
using TeamEventPlanner.Core.Models;

namespace TeamEventPlanner.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventRepository repository;

        public EventsController(IEventRepository repository)
        {
            this.repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEventDto dto)
        {
            if (!Request.Headers.TryGetValue("X-Tenant-ID", out var tenantHeader) || !Guid.TryParse(tenantHeader, out var tenantId))
                return BadRequest("X-Tenant-ID header missing or invalid.");

            var ev = new Event
            {
                TenantId = tenantId,
                Name = dto.Name,
                StartTimeUtc = dto.StartTime.ToUniversalTime(),
                EndTimeUtc = dto.EndTime.ToUniversalTime(),
                Venue = dto.Venue,
                Attendees = dto.Attendees.Select(a => new Attendee { Name = a.Name, Email = a.Email }).ToList()
            };

            var created = await repository.AddAsync(ev);
            return CreatedAtAction(nameof(GetByTenant), new { id = created.Id }, created);
        }

        [HttpGet]
        public async Task<IActionResult> GetByTenant()
        {
            if (!Request.Headers.TryGetValue("X-Tenant-ID", out var tenantHeader) || !Guid.TryParse(tenantHeader, out var tenantId))
                return BadRequest("X-Tenant-ID header missing or invalid.");

            var events = await repository.GetEventsByTenantAsync(tenantId);
            return Ok(events);
        }
    }

    public record CreateEventDto(string Name, DateTime StartTime, DateTime EndTime, string Venue, IEnumerable<CreateAttendeeDto> Attendees);
    public record CreateAttendeeDto(string Name, string Email);
}
