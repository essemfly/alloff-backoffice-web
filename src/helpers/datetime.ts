import { DateTime } from "luxon";

export const toLocaleDateTime = (dateString: string) =>
  DateTime.fromISO(dateString).setLocale("ko").toLocaleString({
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
