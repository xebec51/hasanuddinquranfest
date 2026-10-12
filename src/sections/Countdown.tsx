import { ArrowUpRight, CalendarDays, CheckCircle } from "lucide-react";
import { event } from "../data/event";
import { registrationState } from "../data/calendar";
import { useCalendarClock } from "../hooks/useCalendarClock";
import { ExternalLink } from "../components/UI";

export default function Countdown() {
  const now = useCalendarClock();
  const state = registrationState(now);
  const closed = state.kind === "closed";
  const lastDay = state.kind === "last-day";
  return (
    <section className="countdown" aria-label="Status pendaftaran">
      <div className="container countdown-inner">
        <div>
          <p className="eyebrow">PENDAFTARAN HQF {event.year}</p>
          <h2>{state.title}</h2>
          <p>{event.registration.endLabel} · Kalender WITA</p>
        </div>
        <div
          className={`countdown-number ${closed || lastDay ? "countdown-status" : ""}`}
        >
          {closed ? (
            <>
              <CheckCircle size={32} strokeWidth={1.4} aria-hidden="true" />
              <span>
                Pendaftaran
                <br />
                <strong>telah berakhir</strong>
              </span>
            </>
          ) : lastDay ? (
            <>
              <CalendarDays size={32} strokeWidth={1.4} aria-hidden="true" />
              <span>
                Tanggal terakhir
                <br />
                <strong>pendaftaran hari ini</strong>
              </span>
            </>
          ) : (
            <>
              <strong>{state.days.toString().padStart(2, "0")}</strong>
              <span>
                hari menuju tanggal
                <br />
                terakhir pendaftaran
              </span>
            </>
          )}
        </div>
        <div className="countdown-note">
          <p>
            {closed
              ? "Terima kasih atas partisipasimu. Lihat jadwal tahap berikutnya atau hubungi panitia."
              : "Jam penutupan belum diumumkan. Siapkan dan kirim videomu lebih awal."}
          </p>
          {closed ? (
            <a href="#jadwal">
              Lihat linimasa kegiatan{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ) : (
            <ExternalLink href={event.links.registration}>
              Buka formulir resmi <ArrowUpRight size={18} aria-hidden="true" />
            </ExternalLink>
          )}
        </div>
      </div>
    </section>
  );
}
