import { useEffect } from "react";

// Content stays visible by default. Only animate once an observed element enters.
export function useScrollReveal() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    const stop = () => {
      if (motion.matches) observer.disconnect();
    };
    motion.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", stop);
    };
  }, []);
}
