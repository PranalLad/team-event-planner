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

// Extend jsPDF to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

// TypeScript interfaces
interface Attendee {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  venue: string;
  attendees: Attendee[];
}

interface Report {
  reportGeneratedOn: string;
  data: Event[];
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
  }, [startDate, endDate, tenantId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Report>(
        `https://teameventplannerapi-g4hge8h2ghach2ag.canadacentral-01.azurewebsites.net/api/reports/bold?start=${startDate}T00:00:00&end=${endDate}T23:59:59&clientLocalTime=${new Date().toISOString()}`,
        {
          headers: {
            "X-Tenant-ID": tenantId,
          },
        }
      );
      setReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property: keyof Event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = report?.data
    .filter((event) =>
      event.attendees.some((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (orderBy === "startTime" || orderBy === "endTime") {
        const dateA = new Date(a[orderBy]);
        const dateB = new Date(b[orderBy]);
        return order === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return order === "asc"
        ? (a[orderBy] as string).localeCompare(b[orderBy] as string)
        : (b[orderBy] as string).localeCompare(a[orderBy] as string);
    }) || [];

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatLocalDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString();

  const exportToExcel = () => {
    if (!report) return;
    const dataForExcel = report.data.map((event) => ({
      "Event Name": event.name,
      "Start Time": formatLocalDate(event.startTime),
      "End Time": formatLocalDate(event.endTime),
      Venue: event.venue,
      Attendees: event.attendees.map((a) => a.name).join(", "),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bold Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "BoldReport.xlsx");
  };

  const exportToPDF = () => {
    if (!report) return;
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const tableColumn = ["Event Name", "Start Time", "End Time", "Venue", "Attendees"];
    const tableRows: any[] = [];

    report.data.forEach((event) => {
      const rowData = [
        event.name,
        formatLocalDate(event.startTime),
        formatLocalDate(event.endTime),
        event.venue,
        event.attendees.map((a) => a.name).join(", "),
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl>
          <InputLabel>Tenant</InputLabel>
          <Select
            value={tenantId}
            label="Tenant"
            onChange={(e) => setTenantId(e.target.value)}
          >
            {tenants.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
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
          {sortedData
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{formatLocalDate(event.startTime)}</TableCell>
                <TableCell>{formatLocalDate(event.endTime)}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>{event.attendees.map((a) => a.name).join(", ")}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={sortedData?.length || 0}
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
