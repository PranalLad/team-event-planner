import React from "react";

interface ReportRow {
  id: string;
  name: string;
  startTimeUtc: string;
  endTimeUtc: string;
  venue: string;
  attendeeCount: number;
}

interface ReportViewerProps {
  reportJson: {
    reportGeneratedOn: string;
    data: ReportRow[];
  };
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportJson }) => {
  const rows = reportJson.data ?? [];

  return (
    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
      <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
        Report Generated On:{" "}
        {reportJson.reportGeneratedOn
          ? new Date(reportJson.reportGeneratedOn).toLocaleString()
          : "N/A"}
      </div>

      {rows.length === 0 ? (
        <p>No report data available.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              {["Name", "Start", "End", "Venue", "#Attendees"].map((header) => (
                <th
                  key={header}
                  style={{
                    borderBottom: "2px solid #007bff",
                    padding: "0.5rem",
                    backgroundColor: "#f0f8ff",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "0.5rem" }}>{r.name}</td>
                <td style={{ padding: "0.5rem" }}>{new Date(r.startTimeUtc).toLocaleString()}</td>
                <td style={{ padding: "0.5rem" }}>{new Date(r.endTimeUtc).toLocaleString()}</td>
                <td style={{ padding: "0.5rem" }}>{r.venue}</td>
                <td style={{ padding: "0.5rem" }}>{r.attendeeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportViewer;
