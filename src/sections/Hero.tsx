import { ArrowDown, CalendarDays, Globe, GraduationCap } from "lucide-react";
import { logos } from "../assets/logos";
import { event } from "../data/event";
import { ActionLink, Ornament } from "../components/UI";
export default function Hero() {
  return (
    <section id="beranda" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="organizer-lockup">
            <img
              src={logos.unhas}
              width="45"
              height="52"
              alt="Logo resmi Universitas Hasanuddin"
            />
            <img
              src={logos.psq}
              width="57"
              height="57"
              alt="Logo resmi UKM PSQ Unhas"
            />
            <span>
              UKM PSQ
              <br />
              <strong>Universitas Hasanuddin</strong>
            </span>
          </div>
          <p className="eyebrow hero-eyebrow">
            <span />
            {event.name.toUpperCase()} · {event.year}
          </p>
          <h1>
            <span className="sr-only">
              {event.name} {event.year}.{" "}
            </span>
            Merawat nilai.
            <br />
            Menumbuhkan <span>peradaban.</span>
          </h1>
          <p className="hero-theme">“{event.theme}”</p>
          <div className="hero-actions">
            <ActionLink href={event.links.registration}>
              Daftar sekarang
            </ActionLink>
            <ActionLink secondary href={event.links.guide}>
              Baca pedoman
            </ActionLink>
          </div>
          <div className="hero-details">
            <span>
              <CalendarDays size={17} aria-hidden="true" />
              {event.registration.shortLabel}
            </span>
            <span>
              <GraduationCap size={18} aria-hidden="true" />
              Siswa & mahasiswa
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <Ornament className="hero-ornament" />
          <div className="visual-topline">
            <span>IMAN. ILMU. KARYA.</span>
            <span>01 / HQF</span>
          </div>
          <div className="logo-arch">
            <img
              src={logos.hqf}
              width="800"
              height="1000"
              alt="Logo resmi Hasanuddin Qur'an Fest 2026"
              fetchPriority="high"
            />
          </div>
          <div className="visual-caption">
            <span>
              Hasanuddin
              <br />
              <strong>Qur'an Fest</strong>
            </span>
            <span className="visual-year">{event.year}</span>
          </div>
        </div>
      </div>
      <div className="container hero-bottom">
        <a href="#tentang">
          Kenali HQF lebih dekat <ArrowDown size={16} aria-hidden="true" />
        </a>
        <span>
          <Globe size={15} aria-hidden="true" />
          Terbuka untuk seluruh Indonesia
        </span>
      </div>
    </section>
  );
}
