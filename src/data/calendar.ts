import { calendarDaysToRegistrationEnd, event, witaDate } from "./event.ts";

export function registrationState(now = new Date()) {
  const today = witaDate(now);
  const days = calendarDaysToRegistrationEnd(now);
  if (today < event.registration.start)
    return {
      kind: "upcoming",
      title: "Pendaftaran segera dibuka",
      days,
    } as const;
  if (now.getTime() >= Date.parse(event.registration.deadline))
    return {
      kind: "closed",
      title: "Periode pendaftaran telah berakhir",
      days,
    } as const;
  if (days === 0)
    return {
      kind: "last-day",
      title: "Hari terakhir pendaftaran",
      days,
    } as const;
  return { kind: "open", title: "Pendaftaran dibuka", days } as const;
}

export function stageStatus(start: string, end: string, now = new Date()) {
  const today = witaDate(now);
  return today < start ? "upcoming" : today > end ? "complete" : "active";
}
