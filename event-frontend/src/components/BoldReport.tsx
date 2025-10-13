import React, { useEffect, useRef, useState } from 'react';

interface BoldReportProps {
  apiUrl: string;      // Backend API endpoint
  reportName: string;  // RDL file name
  tenantId: string;    // Tenant ID
  start: string;       // Start date
  end: string;         // End date
}

declare const $: any;

export const BoldReport: React.FC<BoldReportProps> = ({ apiUrl, reportName, tenantId, start, end }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const clientLocalTime = new Date().toISOString();
        const response = await fetch(`${apiUrl}?start=${start}&end=${end}&clientLocalTime=${clientLocalTime}`, {
          method: 'GET',
          headers: {
            'X-Tenant-ID': tenantId,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch report data');

        const data = await response.json();
        setReportData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReportData();
  }, [apiUrl, tenantId, start, end]);

  useEffect(() => {
    const loadViewer = () => {
      if (viewerRef.current && reportData && typeof $(viewerRef.current).boldReportViewer === 'function') {
        $(viewerRef.current).boldReportViewer({
          id: 'reportViewer',
          reportServiceUrl: apiUrl,
          reportPath: reportName,
          parameters: [
            { name: 'TenantId', value: tenantId },
            { name: 'ReportGeneratedOn', value: reportData.reportGeneratedOn },
          ],
          toolbarSettings: { showToolbar: true },
          height: '900px',
        });
      } else {
        setTimeout(loadViewer, 100);
      }
    };

    loadViewer();
  }, [reportData, apiUrl, reportName, tenantId]);

  return <div ref={viewerRef} style={{ width: '100%' }} />;
};
