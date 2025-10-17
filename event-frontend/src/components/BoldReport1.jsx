
/* eslint-disable */
import React from 'react';
import '../App.css';

//Report Viewer source
import '@boldreports/javascript-reporting-controls/Content/v2.0/tailwind-light/bold.report-viewer.min.css';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';
//Reports react base
import '@boldreports/react-reporting-components/Scripts/bold.reports.react.min';

var viewerStyle = {'height': '700px', 'width': '100%'};
  
function App() {
  return (
    <div style={viewerStyle}>
     <BoldReportViewerComponent
     id="reportviewer-container"
    //  reportServiceUrl = {'https://demos.boldreports.com/services/api/ReportViewer'}
    // //  reportPath = {'/reports/event_planner.rdl'} >
    //   reportPath = {'~/Resources/docs/sales-order-detail.rdl'} > 
      reportServiceUrl = {'https://localhost:59497/api/ReportViewer'}
      // reportServerUrl= {'https://acmecorp.boldreports.com/reporting/api/'}
      // serviceAuthorizationToken = {'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYW5hbC5ndXJ1bmF0aEBtaXRyYXRlY2guY29tIiwibmFtZWlkIjoiMTA4NzYiLCJ1bmlxdWVfbmFtZSI6IjNiZDkwNzYyLTRhMGMtNDZjZC1iNTg0LWJjZTFlNTczOGZkMiIsIklQIjoiMTAuMjQ0LjAuMjQ5IiwiaXNzdWVkX2RhdGUiOiIxNzYwNjM1MzA4IiwibmJmIjoxNzYwNjM1MzA4LCJleHAiOjE3NjEyNjQwMDAsImlhdCI6MTc2MDYzNTMwOCwiaXNzIjoiaHR0cHM6Ly9jbG91ZC5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvYjE5ODg2NDAiLCJhdWQiOiJodHRwczovL2Nsb3VkLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvc2l0ZS9iMTk4ODY0MCJ9.rNeve520YA3JC4cUcS7Tx-0ro0xeUtOPuO1YW11duLg'}
      reportPath = {'C:/Mitratech/teamEventPlannerWorking/backend/TeamEventPlanner.Api/wwwroot/event_planner.rdl'}>
      </BoldReportViewerComponent>
    </div>
  );
}
  
export default App;