using TeamEventPlanner.Core.Interfaces;
using TeamEventPlanner.Core.Models;

namespace TeamEventPlanner.Services
{
    public interface IEventReportService
    {
        Task<IEnumerable<EventSummary>> GetReportDataAsync(Guid tenantId, DateTime startUtc, DateTime endUtc);
    }

    public class EventReportService : IEventReportService
    {
        private readonly IEventRepository repository;
        public EventReportService(IEventRepository repository)
        {
            this.repository = repository;
        }

        public async Task<IEnumerable<EventSummary>> GetReportDataAsync(Guid tenantId, DateTime startUtc, DateTime endUtc)
        {
            return await repository.GetEventsByTenantAndDateRangeAsync(tenantId, startUtc, endUtc);
        }
    }
}
