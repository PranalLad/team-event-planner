import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

interface Attendee {
  id?: string;
  name?: string;
  email?: string;
}

interface Event {
  id?: string;
  name?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  attendees?: Attendee[];
}

interface Report {
  reportGeneratedOn?: string;
  data?: Event[];
}

type Order = "asc" | "desc";

const tenants = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Tenant 1" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Tenant 2" },
];

const BoldReport: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("2025-10-01");
  const [endDate, setEndDate] = useState<string>("2025-10-31");
  const [tenantId, setTenantId] = useState<string>(tenants[0].id);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Event>("startTime");

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, tenantId]);

  // --- Fetch and normalize data ---
  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Report>(
        `https://teameventplannerapi-g4hge8h2ghach2ag.canadacentral-01.azurewebsites.net/api/reports/bold?start=${startDate}T00:00:00&end=${endDate}T23:59:59&clientLocalTime=${new Date().toISOString()}`,
        { headers: { "X-Tenant-ID": tenantId } }
      );

      // Normalize: ensure `data` and `attendees` are arrays
      const normalized: Report = {
        reportGeneratedOn: response.data.reportGeneratedOn,
        data: Array.isArray(response.data.data)
          ? response.data.data.map(event => ({
              ...event,
              attendees: Array.isArray(event.attendees) ? event.attendees : [],
            }))
          : [],
      };

      setReport(normalized);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Sorting ---
  const handleSort = (property: keyof Event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // --- Prepare sorted and filtered data ---
  const sortedData: Event[] = (report?.data ?? [])
    .filter(event => Array.isArray(event.attendees))
    .filter(event =>
      event.attendees!.some(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if ((orderBy === "startTime" || orderBy === "endTime") &&
          typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatLocalDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleString() : "N/A";

  // --- Export ---
  const exportToExcel = () => {
    if (!report?.data) return;
    const dataForExcel = report.data.map(event => ({
      "Event Name": event.name ?? "N/A",
      "Start Time": formatLocalDate(event.startTime),
      "End Time": formatLocalDate(event.endTime),
      Venue: event.venue ?? "N/A",
      Attendees: Array.isArray(event.attendees)
        ? event.attendees.map(a => a.name ?? "Unknown").join(", ")
        : "No attendees",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bold Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "BoldReport.xlsx");
  };

  const exportToPDF = () => {
    if (!report?.data) return;
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const tableColumn = ["Event Name", "Start Time", "End Time", "Venue", "Attendees"];
    const tableRows: any[] = [];

    report.data.forEach(event => {
      const rowData = [
        event.name ?? "N/A",
        formatLocalDate(event.startTime),
        formatLocalDate(event.endTime),
        event.venue ?? "N/A",
        Array.isArray(event.attendees)
          ? event.attendees.map(a => a.name ?? "Unknown").join(", ")
          : "No attendees",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("BoldReport.pdf");
  };

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>No report data found</div>;

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Bold Report Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Report Generated On: {formatLocalDate(report.reportGeneratedOn)}
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" marginBottom={2}>
        <TextField
          label="Search Attendee"
          variant="outlined"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl>
          <InputLabel>Tenant</InputLabel>
          <Select
            value={tenantId}
            label="Tenant"
            onChange={e => setTenantId(e.target.value)}
          >
            {tenants.map(t => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          Export Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={exportToPDF}>
          Export PDF
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}
              >
                Event Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "startTime"}
                direction={orderBy === "startTime" ? order : "asc"}
                onClick={() => handleSort("startTime")}
              >
                Start Time
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "endTime"}
                direction={orderBy === "endTime" ? order : "asc"}
                onClick={() => handleSort("endTime")}
              >
                End Time
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "venue"}
                direction={orderBy === "venue" ? order : "asc"}
                onClick={() => handleSort("venue")}
              >
                Venue
              </TableSortLabel>
            </TableCell>
            <TableCell>Attendees</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">No events found</TableCell>
            </TableRow>
          ) : (
            sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(event => (
                <TableRow key={event.id ?? Math.random()}>
                  <TableCell>{event.name ?? "N/A"}</TableCell>
                  <TableCell>{formatLocalDate(event.startTime)}</TableCell>
                  <TableCell>{formatLocalDate(event.endTime)}</TableCell>
                  <TableCell>{event.venue ?? "N/A"}</TableCell>
                  <TableCell>
                    {Array.isArray(event.attendees) && event.attendees.length > 0
                      ? event.attendees.map(a => a.name ?? "Unknown").join(", ")
                      : "No attendees"}
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={sortedData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Container>
  );
};

export default BoldReport;
