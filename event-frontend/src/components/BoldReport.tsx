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
declare let BoldReportViewerComponent: any;

var viewerStyle = {
  'height': '700px',
  'width': '100%'
};

function App() {
  return (
   <div style={viewerStyle}>
    <BoldReportViewerComponent
     id="reportviewer-container"
    //  reportServiceUrl = {'https://localhost:59497/api/ReportViewer'}
    reportServiceUrl = {'https://teameventplannerapi-g4hge8h2ghach2ag.canadacentral-01.azurewebsites.net/api/ReportViewer'}
     reportPath = {'event_planner.rdl'} >
     </BoldReportViewerComponent>
   </div>
  );
}

export default App;
