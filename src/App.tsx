import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Countdown from "./sections/Countdown";
import {
  About,
  Competitions,
  Information,
  Registration,
  Schedule,
} from "./sections/EventSections";
import FAQ from "./sections/FAQ";
import Footer from "./sections/Footer";
export default function App() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      element.classList.add("reveal-ready");
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("reveal-ready"));
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Countdown />
        <About />
        <Competitions />
        <Schedule />
        <Information />
        <Registration />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
