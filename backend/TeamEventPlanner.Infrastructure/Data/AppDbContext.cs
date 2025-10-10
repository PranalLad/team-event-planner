using Microsoft.EntityFrameworkCore;
using TeamEventPlanner.Core.Models;

namespace TeamEventPlanner.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Event> Events => Set<Event>();
        public DbSet<Attendee> Attendees => Set<Attendee>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>(eb =>
            {
                eb.HasKey(e => e.Id);
                eb.Property(e => e.Name).IsRequired();
                eb.HasMany(e => e.Attendees).WithOne(a => a.Event).HasForeignKey(a => a.EventId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Attendee>(ab =>
            {
                ab.HasKey(a => a.Id);
                ab.Property(a => a.Name).IsRequired();
                ab.Property(a => a.Email).IsRequired();
            });
        }
    }
}
