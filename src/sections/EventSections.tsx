import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Mic,
  Users,
} from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import {
  competitions,
  event,
  requirements,
  rupiah,
  timeline,
} from "../data/event";
import { stageStatus } from "../data/calendar";
import { useCalendarClock } from "../hooks/useCalendarClock";
import {
  ActionLink,
  ExternalLink,
  Ornament,
  SectionHeading,
} from "../components/UI";
export function About() {
  return (
    <section id="tentang" className="section">
      <div className="container about-grid">
        <SectionHeading title="Tentang HQF 2026" />
        <div className="about-copy" data-reveal="up">
          <p className="lead">
            Hasanuddin Qur'an Fest (HQF) 2026 merupakan kegiatan perlombaan
            Al-Qur'an yang diselenggarakan oleh {event.organizer}.
          </p>
          <p>
            Cabang yang diperlombakan adalah MTQ, MHQ 10 Juz, dan MSQ. Kegiatan
            ini terbuka bagi siswa dan mahasiswa seluruh Indonesia yang berusia
            16–22 tahun.
          </p>
          <div className="about-facts">
            <div>
              <strong>03</strong>
              <span>Cabang perlombaan</span>
            </div>
            <div>
              <strong>16–22</strong>
              <span>Tahun usia peserta</span>
            </div>
            <div>
              <strong>Nasional</strong>
              <span>Lingkup peserta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export function Competitions() {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const move = (direction: number) => {
    const track = rail.current;
    if (!track) return;
    const card = track.firstElementChild;
    const distance =
      (card?.getBoundingClientRect().width ?? track.clientWidth) + 16;
    track.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  const icons = { mic: Mic, book: BookOpen, users: Users };
  return (
    <section id="lomba" className="section competition-section">
      <div className="container">
        <div className="heading-row">
          <SectionHeading title="Cabang lomba" />
        </div>
        <div className="competition-controls">
          <span>Geser untuk melihat cabang lomba</span>
          <div>
            <button
              type="button"
              aria-label="Cabang lomba sebelumnya"
              aria-controls="competition-list"
              disabled={position === 0}
              onClick={() => move(-1)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Cabang lomba berikutnya"
              aria-controls="competition-list"
              disabled={position === competitions.length - 1}
              onClick={() => move(1)}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          className="competition-grid"
          id="competition-list"
          ref={rail}
          role="region"
          aria-label="Cabang lomba HQF 2026"
          tabIndex={0}
          onScroll={() => {
            const track = rail.current;
            if (!track) return;
            const maximum = track.scrollWidth - track.clientWidth;
            setPosition(
              maximum > 0
                ? Math.round(
                    (track.scrollLeft / maximum) * (competitions.length - 1),
                  )
                : 0,
            );
          }}
        >
          {competitions.map((competition, index) => {
            const Icon = icons[competition.icon];
            return (
              <article
                key={competition.code}
                className="competition"
                data-reveal="card"
                style={{ "--reveal-delay": `${index * 65}ms` } as CSSProperties}
              >
                <div className="competition-top">
                  <Icon size={28} strokeWidth={1.4} aria-hidden="true" />
                  <span>0{index + 1}</span>
                </div>
                <p className="competition-category">{competition.category}</p>
                <h3>
                  {competition.code}
                  {competition.code === "MHQ" && <span>10 Juz</span>}
                </h3>
                <p className="competition-title">{competition.title}</p>
                <p>{competition.description}</p>
                <ExternalLink
                  href={event.links.guide}
                  className="competition-detail"
                >
                  <span>
                    {competition.detail}
                    <small>Lihat ketentuan lomba</small>
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </ExternalLink>
              </article>
            );
          })}
        </div>
        <p className="section-footnote">
          Ketentuan teknis setiap cabang mengacu pada{" "}
          <a href={event.links.guide} target="_blank" rel="noopener noreferrer">
            pedoman resmi lomba<span className="sr-only"> (buka tab baru)</span>
          </a>
          .
        </p>
      </div>
    </section>
  );
}
export function Schedule() {
  const now = useCalendarClock();
  const statusLabels = {
    upcoming: "Akan datang",
    active: "Sedang berlangsung",
    complete: "Tahap telah berakhir",
  };
  return (
    <section id="jadwal" className="section">
      <div className="container">
        <div className="heading-row">
          <SectionHeading title="Jadwal kegiatan" />
          <span className="year-label">OKTOBER — NOVEMBER 2026</span>
        </div>
        <ol className="timeline">
          {timeline.map((step, index) => (
            <li
              key={step.title}
              data-status={stageStatus(step.start, step.end, now)}
              data-reveal="step"
              style={{ "--reveal-delay": `${index * 55}ms` } as CSSProperties}
            >
              <div className="step-line">
                <span className="step-number">
                  {stageStatus(step.start, step.end, now) === "complete" ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    `0${index + 1}`
                  )}
                </span>
              </div>
              <p className="step-date">
                <time dateTime={step.start}>{step.date}</time>
              </p>
              <h3>{step.title}</h3>
              <span className="stage-status">
                {statusLabels[stageStatus(step.start, step.end, now)]}
              </span>
            </li>
          ))}
        </ol>
        <p className="section-footnote">
          Pendaftaran dan pengumpulan video: {event.registration.label}. Babak
          final dilaksanakan secara online.
        </p>
      </div>
    </section>
  );
}
export function Information() {
  return (
    <section id="informasi" className="section information-section">
      <div className="container information-grid">
        <div>
          <SectionHeading title="Persyaratan peserta" />
          <p className="info-intro" data-reveal="up">
            Peserta dari seluruh Indonesia dapat mengikuti lomba dengan
            ketentuan berikut.
          </p>
          <ul className="requirements" data-reveal="up">
            {requirements.map((requirement) => (
              <li key={requirement}>
                <Check size={18} aria-hidden="true" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="fees" data-reveal="card">
          <p className="eyebrow">BIAYA PENDAFTARAN</p>
          <div className="fee-row">
            <div>
              <span>Individu</span>
              <p>MTQ & MHQ 10 Juz</p>
            </div>
            <strong>{rupiah(event.fees.individual)}</strong>
          </div>
          <div className="fee-row">
            <div>
              <span>Tim</span>
              <p>MSQ · 3 orang</p>
            </div>
            <strong>{rupiah(event.fees.team)}</strong>
          </div>
          <p className="fee-note">
            Detail persyaratan, ketentuan video, dan pembayaran tersedia pada
            formulir serta pedoman resmi.
          </p>
          <ActionLink secondary href={event.links.guide}>
            Baca pedoman
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
export function Registration() {
  return (
    <section id="daftar" className="registration-section">
      <Ornament className="registration-ornament" />
      <div className="container registration-copy">
        <h2 data-reveal="heading">Pendaftaran HQF {event.year}</h2>
        <p data-reveal="up">
          Pendaftaran dan pengumpulan video: {event.registration.label}.<br />
          Batas akhir: {event.registration.endLabel}, pukul{" "}
          {event.registration.closingTime}.
        </p>
        <div className="hero-actions" data-reveal="up">
          <ActionLink href={event.links.registration}>
            Daftar sekarang
          </ActionLink>
          <ActionLink secondary href={event.links.guide}>
            Baca pedoman
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
