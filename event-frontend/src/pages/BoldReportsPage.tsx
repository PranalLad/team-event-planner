import React from 'react';
import { BoldReport } from '../components/BoldReport';

const BoldReportsPage: React.FC = () => {
  const startDate = '2025-10-01T00:00:00';
  const endDate = '2025-10-31T23:59:59';

  return (
    <div>
      <h2>Bold Reports Viewer</h2>
      <BoldReport
        apiUrl="https://teameventplannerapi-g4hge8h2ghach2ag.canadacentral-01.azurewebsites.net/api/reports/bold" // Your backend API endpoint
        reportName="event-report.rdl"                     // RDL file in public or served from backend
        tenantId="22222222-2222-2222-2222-222222222222"  // Example tenant
        start={startDate}
        end={endDate}
      />
    </div>
  );
};

export default BoldReportsPage;
