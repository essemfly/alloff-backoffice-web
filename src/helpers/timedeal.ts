export const a = "1";
// import { DateTime } from "luxon";
// import { Timedeal } from "../api";

// export type TimedealDomainStatus = "PENDING" | "OPEN" | "CLOSED";
// function getTimedealStatus(timedeal: Timedeal): TimedealDomainStatus;
// function getTimedealStatus(
//   starttime: Date,
//   finishtime: Date
// ): TimedealDomainStatus;
// function getTimedealStatus(
//   timedealOrStarttime: Timedeal | Date,
//   finishTime?: Date
// ): TimedealDomainStatus {
//   if (timedealOrStarttime instanceof Date && finishTime === undefined) {
//     throw new Error("starttime must accompany finishtime!");
//   }
export type TimedealDomainStatus = "PENDING" | "OPEN" | "CLOSED";
// function getTimedealStatus(timedeal: Timedeal): TimedealDomainStatus;
// function getTimedealStatus(
//   starttime: Date,
//   finishtime: Date,
// ): TimedealDomainStatus;
// function getTimedealStatus(
//   timedealOrStarttime: Timedeal | Date,
//   finishTime?: Date,
// ): TimedealDomainStatus {
//   if (timedealOrStarttime instanceof Date && finishTime === undefined) {
//     throw new Error("starttime must accompany finishtime!");
//   }
// }
//   const startsAt =
//     timedealOrStarttime instanceof Date
//       ? DateTime.fromJSDate(timedealOrStarttime)
//       : DateTime.fromISO(timedealOrStarttime.starttime);
//   const endsAt = finishTime
//     ? DateTime.fromJSDate(finishTime)
//     : DateTime.fromISO((timedealOrStarttime as Timedeal).finishtime);
//   const now = DateTime.utc().setZone("UTC+9");
//   let result: TimedealDomainStatus;

//   if (startsAt > now) {
//     result = "PENDING";
//   } else if (endsAt > now) {
//     result = "OPEN";
//   } else {
//     result = "CLOSED";
//   }

//   return result;
// }

// const getTimedealStatusColor = (status: TimedealDomainStatus) => {
//   switch (status) {
//     case "CLOSED":
//       return "gray";
//     case "PENDING":
//       return "teal";
//     case "OPEN":
//       return "green";
//   }
// };

// export { getTimedealStatus, getTimedealStatusColor };
