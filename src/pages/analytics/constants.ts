export interface TimeSeriesData {
  timestamp: number;
  value: number;
  date?: string;
  time?: string;
  formattedValue?: string;
}