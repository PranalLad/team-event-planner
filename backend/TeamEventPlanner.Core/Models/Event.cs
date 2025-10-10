using System;
using System.Collections.Generic;

namespace TeamEventPlanner.Core.Models
{
    public class Event
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string Name { get; set; } = null!;
        public DateTime StartTimeUtc { get; set; }
        public DateTime EndTimeUtc { get; set; }
        public string Venue { get; set; } = null!;
        public ICollection<Attendee> Attendees { get; set; } = new List<Attendee>();
    }

    public class Attendee
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid EventId { get; set; }
        public Event Event { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
    }

    public class EventSummary
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime StartTimeUtc { get; set; }
        public DateTime EndTimeUtc { get; set; }
        public string Venue { get; set; } = null!;
        public int AttendeeCount { get; set; }
    }
}
