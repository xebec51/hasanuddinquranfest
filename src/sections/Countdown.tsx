import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { calendarDaysToRegistrationEnd, event, witaDate } from "../data/event";
import { ExternalLink } from "../components/UI";
export default function Countdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(interval);
  }, []);
  const days = calendarDaysToRegistrationEnd(now);
  const status =
    witaDate(now) < event.registration.start
      ? "Pendaftaran segera dibuka"
      : days > 0
        ? "Kesempatan untuk berkarya"
        : days === 0
          ? "Hari terakhir pendaftaran"
          : "Periode pendaftaran telah berakhir";
  return (
    <section className="countdown" aria-label="Batas pendaftaran">
      <div className="container countdown-inner">
        <div>
          <p className="eyebrow">PENDAFTARAN HQF 2026</p>
          <h2>{status}</h2>
          <p>{event.registration.endLabel} · Kalender WITA</p>
        </div>
        <div className="countdown-number">
          <strong>{Math.max(0, days).toString().padStart(2, "0")}</strong>
          <span>
            hari menuju tanggal
            <br />
            terakhir pendaftaran
          </span>
        </div>
        <div className="countdown-note">
          <p>
            Jam penutupan belum diumumkan.
            <br />
            Siapkan dan kirim videomu lebih awal.
          </p>
          <ExternalLink href={event.links.registration}>
            Buka formulir resmi <ArrowUpRight size={17} aria-hidden="true" />
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
