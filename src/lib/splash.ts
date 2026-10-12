// Coordinate the actual CSS entrance, rather than overlapping it with dismissal.
// The independent HTML watchdog remains the final protection against boot failure.
export function playSplash(
  splash: HTMLElement,
  root: HTMLElement,
  environment: Window = window,
) {
  let disposed = false;
  let exiting = false;
  let frame = 0;
  const timers = new Set<number>();
  const motion = environment.matchMedia("(prefers-reduced-motion: reduce)");
  const schedule = (callback: () => void, delay: number) => {
    const timer = environment.setTimeout(callback, delay);
    timers.add(timer);
  };
  const cleanup = () => {
    disposed = true;
    environment.cancelAnimationFrame(frame);
    timers.forEach((timer) => environment.clearTimeout(timer));
    splash.removeEventListener("transitionend", onTransitionEnd);
    splash.removeEventListener("animationend", onAnimationEnd);
    motion.removeEventListener("change", onReducedMotion);
    environment.removeEventListener("keydown", onKey);
  };
  const finish = () => {
    if (disposed) return;
    splash.remove();
    root.dataset.intro = "done";
    cleanup();
  };
  const beginExit = () => {
    if (disposed || exiting || !splash.isConnected) return;
    exiting = true;
    root.dataset.intro = "leaving";
    schedule(finish, 500);
  };
  function onTransitionEnd(event: TransitionEvent) {
    if (exiting && event.target === splash && event.propertyName === "opacity")
      finish();
  }
  function onAnimationEnd(event: AnimationEvent) {
    // This is the last entrance animation; also covers browsers without getAnimations.
    if ((event.target as HTMLElement).classList.contains("intro-year"))
      beginExit();
  }
  function onReducedMotion() {
    if (motion.matches) finish();
  }
  function onKey(event: KeyboardEvent) {
    if (event.key === "Tab" || event.key === "Escape") finish();
  }
  const present = () => {
    if (disposed || !splash.isConnected) return;
    frame = environment.requestAnimationFrame(() => {
      if (disposed || !splash.isConnected) return;
      root.dataset.intro = "presenting";
      if (typeof splash.getAnimations === "function") {
        const animations = splash.getAnimations({ subtree: true });
        void Promise.allSettled(
          animations.map((animation) => animation.finished),
        ).then(beginExit);
      } else {
        // Event-based completion is primary; this only covers a missing animationend.
        schedule(beginExit, 600);
      }
    });
  };
  splash.addEventListener("transitionend", onTransitionEnd);
  splash.addEventListener("animationend", onAnimationEnd);
  motion.addEventListener("change", onReducedMotion);
  environment.addEventListener("keydown", onKey);
  schedule(finish, 1900);
  const logo = splash.querySelector("img");
  if (motion.matches) finish();
  else if (logo && typeof logo.decode === "function")
    void logo.decode().then(present, finish);
  else present();
  return cleanup;
}
