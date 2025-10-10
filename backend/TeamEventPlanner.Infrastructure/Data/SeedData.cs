using TeamEventPlanner.Core.Models;

namespace TeamEventPlanner.Infrastructure.Data
{
    public static class SeedData
    {
        public static async Task EnsureSeeded(AppDbContext db)
        {
            if (db.Events.Any()) return;

            var tenantA = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var tenantB = Guid.Parse("22222222-2222-2222-2222-222222222222");

            var rnd = new Random();

            var events = new List<Event>();

            for (int t = 0; t < 2; t++)
            {
                var tenantId = t == 0 ? tenantA : tenantB;
                for (int i = 0; i < 7; i++)
                {
                    var start = DateTime.UtcNow.AddDays(rnd.Next(-30, 30)).AddHours(rnd.Next(0, 24));
                    var end = start.AddHours(2);

                    var ev = new Event
                    {
                        TenantId = tenantId,
                        Name = $"Tenant {(t==0?"A":"B")} Event {i+1}",
                        StartTimeUtc = start,
                        EndTimeUtc = end,
                        Venue = $"Venue {rnd.Next(1,10)}"
                    };

                    var attendeesCount = rnd.Next(3, 12);
                    for (int a = 0; a < attendeesCount; a++)
                    {
                        ev.Attendees.Add(new Attendee { Name = $"Attendee {a+1}", Email = $"att{a+1}@example.com" });
                    }

                    events.Add(ev);
                }
            }

            db.Events.AddRange(events);
            await db.SaveChangesAsync();
        }
    }
}
