using Microsoft.EntityFrameworkCore;
using TeamEventPlanner.Core.Interfaces;
using TeamEventPlanner.Core.Models;
using TeamEventPlanner.Infrastructure.Data;

namespace TeamEventPlanner.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext db;

        public EventRepository(AppDbContext db)
        {
            this.db = db;
        }

        public async Task<Event> AddAsync(Event ev)
        {
            db.Events.Add(ev);
            await db.SaveChangesAsync();
            return ev;
        }

        public async Task<IEnumerable<EventSummary>> GetEventsByTenantAndDateRangeAsync(Guid tenantId, DateTime startUtc, DateTime endUtc)
        {
            var query = db.Events
                .AsNoTracking()
                .Where(e => e.TenantId == tenantId && e.StartTimeUtc >= startUtc && e.StartTimeUtc <= endUtc)
                .Select(e => new EventSummary
                {
                    Id = e.Id,
                    Name = e.Name,
                    StartTimeUtc = e.StartTimeUtc,
                    EndTimeUtc = e.EndTimeUtc,
                    Venue = e.Venue,
                    AttendeeCount = e.Attendees.Count()
                });

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetEventsByTenantAsync(Guid tenantId)
        {
            return await db.Events.Include(e => e.Attendees).Where(e => e.TenantId == tenantId).ToListAsync();
        }
    }
}
