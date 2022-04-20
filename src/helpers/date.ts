import { DateTime, DateTimeFormatOptions } from "luxon";

export const formatDate = (
  originDate: string,
  options: DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    weekday: "narrow",
  },
) => {
  if (!originDate) return "";
  let date = DateTime.fromSQL(originDate.replace(" UTC", ""));
  if (!date.isValid) {
    date = DateTime.fromISO(originDate.replace(" UTC", ""));
  }
  const formatted = date.setLocale("ko").toLocaleString(options);
  return formatted;
};
