import { DateTime, DateTimeFormatOptions } from "luxon";

export const formatDate = (
  originDate: string,
  options: DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    weekday: "narrow",
  },
) => {
  const formatted = DateTime.fromSQL(originDate.replace(" UTC", ""))
    .setLocale("ko")
    .toLocaleString(options);
  return formatted;
};