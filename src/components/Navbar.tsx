import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { logos } from "../assets/logos";
import { event } from "../data/event";
import { ExternalLink } from "./UI";
const navigation = [
  { href: "#tentang", label: "Tentang" },
  { href: "#lomba", label: "Cabang lomba" },
  { href: "#jadwal", label: "Jadwal" },
  { href: "#faq", label: "FAQ" },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <a
          className="brand"
          href="#beranda"
          aria-label="HQF 2026, kembali ke beranda"
          onClick={() => setOpen(false)}
        >
          <img src={logos.hqf} width="38" height="44" alt="Logo resmi HQF" />
          <span>
            HQF<span className="brand-year">2026</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <ExternalLink className="nav-register" href={event.links.registration}>
          Daftar sekarang <ArrowUpRight size={16} aria-hidden="true" />
        </ExternalLink>
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Navigasi seluler"
        hidden={!open}
      >
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a href="#informasi" onClick={() => setOpen(false)}>
          Informasi peserta
        </a>
        <a href="#kontak" onClick={() => setOpen(false)}>
          Kontak panitia
        </a>
        <ExternalLink href={event.links.registration}>
          Daftar sekarang <ArrowUpRight size={16} aria-hidden="true" />
        </ExternalLink>
      </nav>
    </header>
  );
}
