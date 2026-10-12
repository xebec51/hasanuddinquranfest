import { useEffect } from "react";

// The branded shell is in index.html, so it is visible while the actual app boots.
// Dismiss immediately when React and the one critical logo are ready; no minimum delay.
export default function SplashScreen() {
  useEffect(() => {
    const splash = document.getElementById("hqf-intro");
    const root = document.documentElement;
    if (!splash || root.dataset.intro !== "pending") {
      root.dataset.intro = "done";
      splash?.remove();
      return;
    }
    let cancelled = false;
    let fallback: number | undefined;
    let frame = 0;
    const finish = () => {
      if (cancelled) return;
      splash.remove();
      root.dataset.intro = "done";
      window.clearTimeout(fallback);
    };
    const beginExit = () => {
      if (cancelled || !splash.isConnected) return;
      frame = window.requestAnimationFrame(() => {
        root.dataset.intro = "leaving";
        fallback = window.setTimeout(finish, 650);
      });
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === splash && event.propertyName === "opacity") finish();
    };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReducedMotion = () => {
      if (motion.matches) finish();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") finish();
    };
    splash.addEventListener("transitionend", onTransitionEnd);
    motion.addEventListener("change", onReducedMotion);
    window.addEventListener("keydown", onKey);
    const logo = splash.querySelector("img");
    if (motion.matches) finish();
    else if (logo && typeof logo.decode === "function")
      void logo
        .decode()
        .catch(() => {})
        .then(beginExit);
    else beginExit();
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      splash.removeEventListener("transitionend", onTransitionEnd);
      motion.removeEventListener("change", onReducedMotion);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}
