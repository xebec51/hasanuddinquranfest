import { ArrowUpRight, BookOpen, Check, Mic, Users } from "lucide-react";
import { competitions, event, rupiah, timeline } from "../data/event";
import {
  ActionLink,
  ExternalLink,
  Ornament,
  SectionHeading,
} from "../components/UI";
export function About() {
  return (
    <section id="tentang" className="section">
      <div className="container about-grid" data-reveal>
        <SectionHeading
          label="TENTANG HQF"
          title={
            <>
              Dari nilai Qur'ani,
              <br />
              untuk generasi
              <br />
              <em>yang berarti.</em>
            </>
          }
        />
        <div className="about-copy">
          <p className="lead">
            Sebuah ruang untuk bertumbuh, berkarya, dan menghidupkan nilai
            Al-Qur'an.
          </p>
          <p>
            Hasanuddin Qur'an Fest (HQF) 2026 diselenggarakan oleh{" "}
            {event.organizer}. Kegiatan ini mempertemukan siswa dan mahasiswa
            dari seluruh Indonesia melalui seni, hafalan, dan pemaknaan
            Al-Qur'an.
          </p>
          <p>
            Dengan semangat membumikan nilai Qur'ani dan menumbuhkan jiwa
            intelektual, HQF mengajak generasi muda mengambil bagian dalam
            membangun peradaban mulia.
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
  const icons = { mic: Mic, book: BookOpen, users: Users };
  return (
    <section id="lomba" className="section competition-section">
      <div className="container">
        <div className="heading-row" data-reveal>
          <SectionHeading
            label="CABANG LOMBA"
            title={
              <>
                Tiga jalan.
                <br />
                <em>Satu semangat Qur'ani.</em>
              </>
            }
          />
          <p>
            Pilih ruang terbaik untuk potensimu.
            <br />
            Bawa semangat, hadirkan karya.
          </p>
        </div>
        <div className="competition-grid">
          {competitions.map((competition, index) => {
            const Icon = icons[competition.icon];
            return (
              <article
                key={competition.code}
                className="competition"
                data-reveal
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
                  <span>{competition.detail}</span>
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
  return (
    <section id="jadwal" className="section">
      <div className="container" data-reveal>
        <div className="heading-row">
          <SectionHeading
            label="LINIMASA KEGIATAN"
            title={
              <>
                Catat tanggalnya.
                <br />
                <em>Siapkan langkahmu.</em>
              </>
            }
          />
          <span className="year-label">OKTOBER — NOVEMBER 2026</span>
        </div>
        <ol className="timeline">
          {timeline.map((step, index) => (
            <li key={step.title}>
              <div className="step-line">
                <span className="step-number">0{index + 1}</span>
              </div>
              <p className="step-date">
                <time dateTime={step.start}>{step.date}</time>
              </p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
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
      <div className="container information-grid" data-reveal>
        <div>
          <SectionHeading
            label="INFORMASI PESERTA"
            title={
              <>
                Langkah kecilmu,
                <br />
                <em>awal karya besar.</em>
              </>
            }
          />
          <p className="info-intro">
            Terbuka untuk siswa dan mahasiswa seluruh Indonesia. Kenali
            persyaratannya, lalu siapkan dirimu.
          </p>
          <ul className="requirements">
            <li>
              <Check size={18} aria-hidden="true" />
              Siswa atau mahasiswa
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Berusia 16–22 tahun
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              MSQ: tim beranggotakan 3 orang
            </li>
            <li>
              <Check size={18} aria-hidden="true" />
              Mengikuti ketentuan dalam pedoman resmi
            </li>
          </ul>
        </div>
        <div className="fees">
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
            Pelajari pedoman
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
      <div className="container registration-copy" data-reveal>
        <p className="eyebrow">GILIRANMU UNTUK MENGAMBIL BAGIAN</p>
        <h2>
          Hadir dengan niat.
          <br />
          <span>Pulang dengan makna.</span>
        </h2>
        <p>
          Jadilah bagian dari Hasanuddin Qur'an Fest 2026.
          <br />
          Mulai perjalanan Qur'animu bersama kami.
        </p>
        <div className="hero-actions">
          <ActionLink href={event.links.registration}>
            Daftar sekarang
          </ActionLink>
          <ActionLink secondary href={event.links.guide}>
            Baca pedoman
          </ActionLink>
        </div>
        <span className="registration-date">
          Pendaftaran · {event.registration.label}
        </span>
      </div>
    </section>
  );
}
