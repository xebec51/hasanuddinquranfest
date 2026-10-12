import { ArrowUp, ArrowUpRight, Camera, MessageCircle } from "lucide-react";
import { event } from "../data/event";
import { transparentLogos } from "../assets/logos";
import { ExternalLink, SectionHeading } from "../components/UI";
export default function Footer() {
  return (
    <>
      <section id="kontak" className="section contact-section">
        <div className="container contact-grid">
          <SectionHeading title="Kontak panitia">
            Untuk informasi lebih lanjut, hubungi panitia melalui WhatsApp.
          </SectionHeading>
          <div className="contact-list">
            {event.contacts.map((contact) => (
              <div key={contact.phone} data-reveal="up">
                <ExternalLink href={contact.whatsapp} className="contact-link">
                  <MessageCircle
                    size={24}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span>
                    <strong>{contact.name}</strong>
                    <span>{contact.phone} · WhatsApp</span>
                  </span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </ExternalLink>
              </div>
            ))}
            <div className="social-links" data-reveal="up">
              <Camera size={20} aria-hidden="true" />
              <div>
                {event.social.map((social) => (
                  <ExternalLink href={social.url} key={social.handle}>
                    {social.handle}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </ExternalLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-main" data-reveal="up">
            <div>
              <a className="footer-brand" href="#beranda">
                Hasanuddin
                <br />
                <span>Qur'an Fest 2026.</span>
              </a>
              <p>{event.organizer}.</p>
            </div>
            <div className="footer-logos">
              <img
                src={transparentLogos.unhas}
                width="44"
                height="52"
                loading="lazy"
                alt="Logo resmi Universitas Hasanuddin"
              />
              <img
                src={transparentLogos.psq}
                width="76"
                height="76"
                loading="lazy"
                alt="Logo resmi UKM PSQ Unhas"
              />
              <img
                src={transparentLogos.hqf}
                width="62"
                height="78"
                loading="lazy"
                alt="Logo resmi HQF"
              />
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {event.year} Hasanuddin Qur'an Fest.</p>
            <a href="#beranda">
              Kembali ke atas <ArrowUp size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
