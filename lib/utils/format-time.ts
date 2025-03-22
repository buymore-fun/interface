import moment from "moment";

// https://day.js.org/docs/en/display/from-now
export function formatTimeAgo(timestamp: number | string | Date): string {
  return moment(timestamp).fromNow(true);
}

export function formatTime(timestamp: number | string | Date): string {
  return moment(timestamp).format("HH:mm MM/DD");
}
