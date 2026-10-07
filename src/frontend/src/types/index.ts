export type {
  Class,
  ClassId,
  ClassInput,
  DashboardStats,
  Student,
  StudentId,
  StudentInput,
  Timestamp,
} from "@/backend";
export { UserRole } from "@/backend";

/** Nanosecond bigint from the backend → JS Date, or null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}
