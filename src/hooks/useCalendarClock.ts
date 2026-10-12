import { useEffect, useState } from "react";
import { event } from "../data/event";

export function useCalendarClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: number;
    const schedule = () => {
      const remaining = Date.parse(event.registration.deadline) - Date.now();
      timer = window.setTimeout(
        () => {
          setNow(new Date());
          schedule();
        },
        remaining > 0 ? Math.min(60_000, remaining) : 60_000,
      );
    };
    const refresh = () => {
      window.clearTimeout(timer);
      setNow(new Date());
      schedule();
    };
    schedule();
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return now;
}
