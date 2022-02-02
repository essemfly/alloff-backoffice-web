export type TimedealDomainStatus = "PENDING" | "OPEN" | "CLOSED";
function getTimedealStatus(timedeal: Timedeal): TimedealDomainStatus;
function getTimedealStatus(
  starttime: Date,
  finishtime: Date,
): TimedealDomainStatus;
function getTimedealStatus(
  timedealOrStarttime: Timedeal | Date,
  finishTime?: Date,
): TimedealDomainStatus {
  if (timedealOrStarttime instanceof Date && finishTime === undefined) {
    throw new Error("starttime must accompany finishtime!");
  }

const getTimedealStatusColor = (status: TimedealDomainStatus) => {
  switch (status) {
    case "CLOSED":
      return "gray";
    case "PENDING":
      return "teal";
    case "OPEN":
      return "green";
  }
};

export { getTimedealStatus, getTimedealStatusColor };
