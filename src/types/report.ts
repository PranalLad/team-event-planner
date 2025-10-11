// frontend/src/types/report.ts
export interface ReportRow {
  id: string;
  name: string;
  startTimeUtc: string;
  endTimeUtc: string;
  venue: string;
  attendeeCount: number;
}

export interface ReportJson {
  reportGeneratedOn: string;
  data: ReportRow[];
}
