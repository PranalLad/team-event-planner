using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeamEventPlanner.Core.Models
{
    public class ReportResponseDto
    {
        public DateTimeOffset ReportGeneratedOn { get; set; }
        public List<EventReportDto> Data { get; set; } = new List<EventReportDto>();
    }

}
