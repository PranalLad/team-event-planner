using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeamEventPlanner.Core.Models;

namespace TeamEventPlanner.Core.Interfaces
{
    public interface IEventRepository
    {
        Task<Event> AddAsync(Event ev);
        Task<IEnumerable<EventSummary>> GetEventsByTenantAndDateRangeAsync(Guid tenantId, DateTime startUtc, DateTime endUtc);
        Task<IEnumerable<Event>> GetEventsByTenantAsync(Guid tenantId);

        Task<IEnumerable<EventReportDto>> GetEventsByTenantAndDateRangeAsync1(Guid tenantId, DateTime startUtc, DateTime endUtc);
    }
}
