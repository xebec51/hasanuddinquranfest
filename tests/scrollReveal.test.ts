import assert from "node:assert/strict";
import test from "node:test";
import { startScrollReveal } from "../src/lib/scrollReveal.ts";

function harness({
  reduced = false,
  missingObserver = false,
  failedObserver = false,
  failedObserve = false,
} = {}) {
  const mediaListeners = new Map<string, () => void>();
  const rootListeners = new Map<string, (event: Event) => void>();
  const observed = new Set<unknown>();
  const unobserved: unknown[] = [];
  let callback:
    | ((
        entries: {
          target: unknown;
          isIntersecting: boolean;
          boundingClientRect: {
            top: number;
            bottom: number;
            left: number;
            right: number;
          };
        }[],
      ) => void)
    | undefined;
  let disconnected = 0;
  let activeElement: unknown = null;
  const element = (top: number) => {
    const classes = new Set<string>();
    const result = {
      classes,
      top,
      parentElement: null,
      getBoundingClientRect: () => ({
        top: result.top,
        bottom: result.top + 120,
        left: 20,
        right: 320,
      }),
      contains: (target: unknown) =>
        target === result ||
        (target as { closest?: () => unknown } | null)?.closest?.() === result,
      classList: {
        add: (...names: string[]) => names.forEach((name) => classes.add(name)),
        remove: (...names: string[]) =>
          names.forEach((name) => classes.delete(name)),
      },
      closest: () => result,
    };
    return result;
  };
  const visible = element(100);
  const below = element(1000);
  const later = element(1400);
  const media = {
    matches: reduced,
    addEventListener: (name: string, listener: () => void) =>
      mediaListeners.set(name, listener),
    removeEventListener: (name: string) => mediaListeners.delete(name),
  };
  class Observer {
    constructor(listener: typeof callback) {
      if (failedObserver) throw new Error("Observer unavailable");
      callback = listener;
    }
    observe(target: unknown) {
      if (failedObserve && observed.size === 1)
        throw new Error("Observe failed");
      observed.add(target);
    }
    unobserve(target: unknown) {
      unobserved.push(target);
      observed.delete(target);
    }
    disconnect() {
      disconnected++;
      observed.clear();
    }
  }
  const root = {
    get activeElement() {
      return activeElement;
    },
    querySelectorAll: () => [visible, below, later],
    addEventListener: (name: string, listener: (event: Event) => void) =>
      rootListeners.set(name, listener),
    removeEventListener: (name: string) => rootListeners.delete(name),
  } as unknown as Document;
  const environment = {
    innerHeight: 800,
    innerWidth: 390,
    IntersectionObserver: missingObserver
      ? undefined
      : (Observer as unknown as typeof IntersectionObserver),
    matchMedia: (() => media) as unknown as Window["matchMedia"],
  };
  return {
    visible,
    below,
    later,
    observed,
    unobserved,
    media,
    mediaListeners,
    rootListeners,
    start: () => startScrollReveal(root, environment),
    intersect: (target: ReturnType<typeof element>, isIntersecting = true) =>
      callback?.([
        {
          target,
          isIntersecting,
          boundingClientRect: target.getBoundingClientRect(),
        },
      ]),
    focus: (target: unknown) => {
      activeElement = target;
      rootListeners.get("focusin")?.({ target } as Event);
    },
    blur: () => {
      activeElement = null;
    },
    reduce: () => {
      media.matches = true;
      mediaListeners.get("change")?.();
    },
    disconnected: () => disconnected,
  };
}

test("initial visible content stays visible and elements remain observed for repeat entrances", () => {
  const page = harness();
  const cleanup = page.start();
  assert.ok(page.visible.classes.has("is-revealed"));
  assert.ok(page.below.classes.has("reveal-ready"));
  page.intersect(page.below, false);
  assert.equal(page.below.classes.has("is-revealed"), false);
  page.intersect(page.below);
  page.intersect(page.below);
  assert.ok(page.below.classes.has("is-revealed"));
  assert.deepEqual(page.unobserved, []);
  assert.ok(page.observed.has(page.below));
  assert.ok(page.observed.has(page.later));
  cleanup();
});

test("reveal repeats after scrolling past the bottom and returning, in either direction", () => {
  const page = harness();
  const cleanup = page.start();
  for (const outsideTop of [-200, 1000, -200]) {
    page.below.top = 200;
    page.intersect(page.below);
    assert.ok(page.below.classes.has("is-revealed"));
    page.below.top = outsideTop;
    page.intersect(page.below, false);
    assert.equal(page.below.classes.has("is-revealed"), false);
    page.below.top = 200;
    page.intersect(page.below);
    assert.ok(page.below.classes.has("is-revealed"));
  }
  cleanup();
});

test("partially visible content does not reset near a viewport edge", () => {
  const page = harness();
  const cleanup = page.start();
  page.intersect(page.visible);
  for (const top of [-100, -140, 810]) {
    page.visible.top = top;
    page.intersect(page.visible, false);
    assert.ok(page.visible.classes.has("is-revealed"));
  }
  cleanup();
});

test("reduced motion and missing observer leave all content visible", () => {
  for (const options of [{ reduced: true }, { missingObserver: true }]) {
    const page = harness(options);
    const cleanup = page.start();
    assert.equal(page.below.classes.size, 0);
    assert.equal(page.observed.size, 0);
    assert.equal(page.rootListeners.size, 0);
    cleanup();
  }
});

test("keyboard focus immediately reveals an offscreen link's container", () => {
  const page = harness();
  const cleanup = page.start();
  page.focus({ closest: () => page.below });
  assert.ok(page.below.classes.has("is-revealed"));
  assert.equal(page.observed.has(page.below), true);
  page.intersect(page.below, false);
  assert.ok(
    page.below.classes.has("is-revealed"),
    "Focused content must not hide",
  );
  page.blur();
  page.intersect(page.below, false);
  assert.equal(page.below.classes.has("is-revealed"), false);
  cleanup();
});

test("changing to reduced motion restores pending content and disconnects", () => {
  const page = harness();
  const cleanup = page.start();
  page.intersect(page.below);
  page.reduce();
  assert.equal(page.below.classes.size, 0);
  assert.equal(page.later.classes.size, 0);
  assert.equal(page.observed.size, 0);
  assert.ok(page.disconnected() > 0);
  page.intersect(page.below);
  assert.equal(
    page.below.classes.size,
    0,
    "Queued callbacks cannot restart reduced motion",
  );
  cleanup();
});

test("cleanup restores content and StrictMode setup can observe again", () => {
  const page = harness();
  page.start()();
  assert.equal(page.below.classes.size, 0);
  assert.equal(page.rootListeners.size, 0);
  assert.equal(page.mediaListeners.size, 0);
  const cleanup = page.start();
  assert.ok(page.below.classes.has("reveal-ready"));
  page.intersect(page.below);
  assert.ok(page.below.classes.has("is-revealed"));
  cleanup();
});

test("observer construction errors leave information visible", () => {
  const page = harness({ failedObserver: true });
  page.start()();
  assert.equal(page.below.classes.size, 0);
  assert.equal(page.later.classes.size, 0);
});

test("partial observer setup errors undo all hidden states", () => {
  const page = harness({ failedObserve: true });
  page.start()();
  assert.equal(page.below.classes.size, 0);
  assert.equal(page.later.classes.size, 0);
  assert.equal(page.observed.size, 0);
});
