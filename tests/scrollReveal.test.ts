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
    | ((entries: { target: unknown; isIntersecting: boolean }[]) => void)
    | undefined;
  let disconnected = 0;
  const element = (top: number) => {
    const classes = new Set<string>();
    const result = {
      classes,
      parentElement: null,
      getBoundingClientRect: () => ({ top }),
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
    querySelectorAll: () => [visible, below, later],
    addEventListener: (name: string, listener: (event: Event) => void) =>
      rootListeners.set(name, listener),
    removeEventListener: (name: string) => rootListeners.delete(name),
  } as unknown as Document;
  const environment = {
    innerHeight: 800,
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
    intersect: (target: unknown, isIntersecting = true) =>
      callback?.([{ target, isIntersecting }]),
    focus: (target: unknown) =>
      rootListeners.get("focusin")?.({ target } as Event),
    reduce: () => {
      media.matches = true;
      mediaListeners.get("change")?.();
    },
    disconnected: () => disconnected,
  };
}

test("only offscreen elements are prepared and each entrance runs once", () => {
  const page = harness();
  const cleanup = page.start();
  assert.equal(page.visible.classes.size, 0);
  assert.ok(page.below.classes.has("reveal-ready"));
  page.intersect(page.below, false);
  assert.equal(page.below.classes.has("is-revealed"), false);
  page.intersect(page.below);
  page.intersect(page.below);
  assert.ok(page.below.classes.has("is-revealed"));
  assert.deepEqual(page.unobserved, [page.below]);
  assert.ok(page.observed.has(page.later));
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
  assert.equal(page.observed.has(page.below), false);
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
