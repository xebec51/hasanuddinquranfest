type RevealEnvironment = {
  innerHeight: number;
  innerWidth?: number;
  IntersectionObserver?: typeof IntersectionObserver;
  matchMedia?: Window["matchMedia"];
};

/** Repeat on viewport entry; reset outside a buffer, never while content is visible. */
export function startScrollReveal(
  root: Document = document,
  environment: RevealEnvironment = window,
) {
  const motion = environment.matchMedia?.("(prefers-reduced-motion: reduce)");
  const Observer = environment.IntersectionObserver;
  if (motion?.matches || !Observer) return () => {};

  const elements = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
  // Read positions in one pass before changing any styles.
  const positions = elements.map((element) => ({
    element,
    rect: element.getBoundingClientRect(),
  }));
  const tracked = new Set(elements);
  let stopped = false;
  let observer: IntersectionObserver | undefined;
  const reveal = (element: HTMLElement) => {
    if (stopped || !tracked.has(element)) return;
    element.classList.add("is-revealed");
  };
  const restore = () => {
    stopped = true;
    observer?.disconnect();
    for (const element of elements) {
      element.classList.remove("reveal-ready", "is-revealed");
    }
  };
  const onFocus = (event: Event) => {
    // Never leave a keyboard-focused link inside transparent content.
    const target = event.target as HTMLElement | null;
    let element = target?.closest<HTMLElement>("[data-reveal]");
    while (element) {
      reveal(element);
      element = element.parentElement?.closest<HTMLElement>("[data-reveal]");
    }
  };
  const onMotionChange = () => {
    if (motion?.matches) restore();
  };

  try {
    observer = new Observer(
      (entries) => {
        if (stopped) return;
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            reveal(element);
            continue;
          }
          const rect = entry.boundingClientRect;
          const outside =
            rect.bottom <= -32 ||
            rect.top >= environment.innerHeight + 32 ||
            rect.right <= 0 ||
            rect.left >= (environment.innerWidth ?? Infinity);
          if (outside && !element.contains(root.activeElement)) {
            element.classList.remove("is-revealed");
          }
        }
      },
      { rootMargin: "32px 0px 32px 0px", threshold: 0 },
    );
    for (const { element, rect } of positions) {
      element.classList.add("reveal-ready");
      if (
        rect.bottom > 0 &&
        rect.top < environment.innerHeight &&
        rect.right > 0 &&
        rect.left < (environment.innerWidth ?? Infinity)
      )
        reveal(element);
      observer.observe(element);
    }
    root.addEventListener("focusin", onFocus);
    motion?.addEventListener?.("change", onMotionChange);
  } catch {
    // Unsupported or failing APIs must not hide the event information.
    restore();
  }

  return () => {
    restore();
    root.removeEventListener("focusin", onFocus);
    motion?.removeEventListener?.("change", onMotionChange);
  };
}
