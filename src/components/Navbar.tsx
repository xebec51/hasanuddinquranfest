import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { transparentLogos } from "../assets/logos";
import { event } from "../data/event";
import { ExternalLink } from "./UI";

const navigation = [
  { href: "#tentang", label: "Tentang" },
  { href: "#lomba", label: "Cabang lomba" },
  { href: "#jadwal", label: "Jadwal" },
  { href: "#informasi", label: "Informasi" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("beranda");
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const closeMenu = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggle.current?.focus();
  };

  useEffect(() => {
    let frame = 0;
    const sections = [
      ...document.querySelectorAll<HTMLElement>("main section[id], #kontak"),
    ];
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 16);
      let current = "beranda";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 160) current = section.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current
      ?.querySelector<HTMLAnchorElement>("a")
      ?.focus({ preventScroll: true });
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const links = Array.from(
        menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
      );
      const first = toggle.current;
      const last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    desktop.addEventListener("change", onDesktop);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onDesktop);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    const target = document.getElementById(href.slice(1));
    if (target) {
      target.setAttribute("tabindex", "-1");
      window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  }

  return (
    <header
      className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "menu-is-open" : ""}`}
    >
      <div className="container nav-inner">
        <a
          className="brand"
          href="#beranda"
          aria-label="HQF 2026, kembali ke beranda"
          onClick={() => closeMenu()}
        >
          <img
            src={transparentLogos.hqf}
            width="36"
            height="45"
            alt="Logo resmi HQF"
          />
          <span>
            HQF<span className="brand-year">{event.year}</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={
                active === item.href.slice(1) ? "location" : undefined
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <ExternalLink className="nav-register" href={event.links.registration}>
          Daftar sekarang <ArrowUpRight size={17} aria-hidden="true" />
        </ExternalLink>
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="hamburger" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
      <button
        className="menu-backdrop"
        type="button"
        tabIndex={-1}
        aria-label="Tutup navigasi"
        hidden={!open}
        onClick={() => closeMenu(true)}
      />
      <div className="mobile-menu-shell" inert={!open} aria-hidden={!open}>
        <div className="mobile-menu-clip">
          <nav
            ref={menu}
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Navigasi seluler"
          >
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => navigate(item.href)}
                aria-current={
                  active === item.href.slice(1) ? "location" : undefined
                }
              >
                <span className="menu-index">0{index + 1}</span>
                {item.label}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
            <a href="#kontak" onClick={() => navigate("#kontak")}>
              <span className="menu-index">06</span>Kontak panitia
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <ExternalLink
              href={event.links.registration}
              className="button button-primary"
            >
              Daftar sekarang
              <ArrowUpRight size={18} aria-hidden="true" />
            </ExternalLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
