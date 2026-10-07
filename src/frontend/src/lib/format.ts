import { timestampToDate } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("ckb", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Format a backend nanosecond timestamp as a Kurdish date, or a dash. */
export function formatEnrollmentDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? dateFormatter.format(date) : "—";
}

/** Shorten a principal for display in the header. */
export function shortenPrincipal(principal: string): string {
  if (principal.length <= 14) return principal;
  return `${principal.slice(0, 7)}…${principal.slice(-5)}`;
}
