using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeamEventPlanner.Core.Models
{
    public class EventReportDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime StartTime { get; set; }   // UTC
        public DateTime EndTime { get; set; }     // UTC
        public string Venue { get; set; } = null!;
        public List<AttendeeDto> Attendees { get; set; } = new List<AttendeeDto>();
    }

    public class AttendeeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}
