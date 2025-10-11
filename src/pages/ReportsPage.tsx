import React, { useEffect, useState } from "react";
import api, { setTenantId } from "../services/api";
import ReportViewer from "../components/ReportViewer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReportsPage() {
  const tenantId =
    process.env.REACT_APP_TENANT_ID ?? "11111111-1111-1111-1111-111111111111";
  setTenantId(tenantId);

  const [start, setStart] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [end, setEnd] = useState<Date>(() => new Date());
  const [reportJson, setReportJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadReport() {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get("/api/reports/data", {
        params: {
          start: start.toISOString(),
          end: end.toISOString(),
          clientLocalTime: new Date().toISOString(),
        },
      });

      let rows: any[] = [];
      if (Array.isArray(resp.data)) rows = resp.data;
      else if (Array.isArray(resp.data?.data)) rows = resp.data.data;
      else if (Array.isArray(resp.data?.data?.$values)) rows = resp.data.data.$values;
      else if (resp.data) rows = [resp.data];

      const report = {
        reportGeneratedOn: resp.data.reportGeneratedOn ?? new Date().toISOString(),
        data: rows,
      };
      setReportJson(report);
    } catch (err: any) {
      console.error("Error fetching report:", err);
      setError(err?.message || "Failed to load report.");
      setReportJson(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Event Reports</h2>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "0.25rem" }}>From:</label>
          <DatePicker
            selected={start}
            onChange={(date: Date | null) => date && setStart(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Start date & time"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "0.25rem" }}>To:</label>
          <DatePicker
            selected={end}
            onChange={(date: Date | null) => date && setEnd(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="End date & time"
          />
        </div>

        <button onClick={loadReport} disabled={loading} style={{ alignSelf: "flex-end", padding: "0.6rem 1.2rem", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Loading..." : "Show Data"}
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading report...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {!loading && reportJson && <ReportViewer reportJson={reportJson} />}
      {!loading && !reportJson && !error && <p style={{ textAlign: "center" }}>No report data available.</p>}
    </div>
  );
}
