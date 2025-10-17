import React, { useEffect } from "react";

declare global {
  interface Window {
    boldReportViewer: any;
  }
}

const ReportViewerNew: React.FC = () => {
  useEffect(() => {
    (window as any).$("#viewer").boldReportViewer({
      reportServiceUrl: "https://your-api-url/api/reports/event-report",
      reportPath: "/reports/event_report.rdl"
    });
  }, []);

  return <div id="viewer" style={{ height: "100vh", width: "100%" }}></div>;
};

export default ReportViewerNew;
