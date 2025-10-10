using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TeamEventPlanner.Infrastructure.Data;
using TeamEventPlanner.Infrastructure.Repositories;
using Xunit;
using TeamEventPlanner.Core.Models;

public class EventRepositoryTests
{
    [Fact]
    public async Task GetEventsByTenantAndDateRangeAsync_FiltersByTenant()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using (var db = new AppDbContext(options))
        {
            var tenantA = Guid.NewGuid();
            var tenantB = Guid.NewGuid();

            db.Events.Add(new Event
            {
                TenantId = tenantA,
                Name = "A1",
                StartTimeUtc = DateTime.UtcNow.AddDays(1),
                EndTimeUtc = DateTime.UtcNow.AddDays(1).AddHours(2),
            });

            db.Events.Add(new Event
            {
                TenantId = tenantB,
                Name = "B1",
                StartTimeUtc = DateTime.UtcNow.AddDays(1),
                EndTimeUtc = DateTime.UtcNow.AddDays(1).AddHours(2),
            });

            await db.SaveChangesAsync();

            var repo = new EventRepository(db);
            var results = await repo.GetEventsByTenantAndDateRangeAsync(tenantA, DateTime.UtcNow.AddDays(-1), DateTime.UtcNow.AddDays(7));

            Assert.Single(results);
            Assert.Equal("A1", results.Single().Name);
        }
    }
}
