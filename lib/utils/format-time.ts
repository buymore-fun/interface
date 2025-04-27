import moment from "moment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Configure short format for relative time
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});

// https://day.js.org/docs/en/display/from-now
export function formatTimeAgo(timestamp: number | string | Date): string {
  return dayjs(timestamp).fromNow(true);
}

export function formatTime(timestamp: number | string | Date): string {
  return dayjs(timestamp).format("HH:mm MM/DD");
}

export function formatTimeToFull(timestamp: number): string {
  return dayjs.unix(timestamp).format("HH:mm MM/DD/YYYY");
}
