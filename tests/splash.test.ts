import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { playSplash } from "../src/lib/splash.ts";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bootstrap = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
  (match) => match[1],
);

function visit({
  seen = false,
  reduced = false,
  blocked = false,
  replay = false,
} = {}) {
  const storage = new Map<string, string>(
    seen ? [["hqf-intro-2026-v2", "seen"]] : [],
  );
  const dataset: Record<string, string> = {};
  const timers: { callback: () => void; delay: number }[] = [];
  let removed = false;
  const context = {
    URLSearchParams,
    sessionStorage: {
      getItem(key: string) {
        if (blocked) throw new Error("Storage blocked");
        return storage.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        if (blocked) throw new Error("Storage blocked");
        storage.set(key, value);
      },
    },
    document: {
      documentElement: { dataset },
      getElementById: () =>
        removed
          ? null
          : {
              remove() {
                removed = true;
              },
            },
    },
    window: {
      location: { search: replay ? "?intro=1" : "" },
      matchMedia: () => ({ matches: reduced }),
      setTimeout: (callback: () => void, delay: number) =>
        timers.push({ callback, delay }),
    },
  };
  for (const script of bootstrap) runInNewContext(script, context);
  return { storage, dataset, timers, isRemoved: () => removed };
}

test("every document load shows the branded shell with a bounded watchdog", () => {
  const first = visit();
  assert.equal(first.dataset.intro, "pending");
  assert.equal(
    first.storage.size,
    0,
    "Splash must not write a session skip flag",
  );
  assert.equal(first.timers.length, 1);
  assert.ok(first.timers[0].delay <= 2000);
  first.timers[0].callback();
  assert.equal(first.dataset.intro, "done");
  assert.equal(first.isRemoved(), true);
});

test("reload shows the splash even when a legacy session flag exists", () => {
  const reload = visit({ seen: true });
  assert.equal(reload.dataset.intro, "pending");
  assert.equal(reload.isRemoved(), false);
  assert.equal(reload.timers.length, 1);
});

test("legacy replay links remain usable without bypassing reduced motion", () => {
  assert.equal(visit({ seen: true, replay: true }).dataset.intro, "pending");
  assert.equal(
    visit({ seen: true, replay: true, reduced: true }).dataset.intro,
    "done",
  );
});

function animationHarness({
  reduced = false,
  failedImage = false,
  missingAnimationApi = false,
} = {}) {
  let endEntrance!: () => void;
  const finished = new Promise<void>((resolve) => {
    endEntrance = resolve;
  });
  const dataset: Record<string, string> = { intro: "pending" };
  const timers = new Map<number, { callback: () => void; delay: number }>();
  const listeners = new Map<string, (event: unknown) => void>();
  let nextTimer = 0;
  let frame: (() => void) | undefined;
  let removed = false;
  const splash = {
    get isConnected() {
      return !removed;
    },
    remove() {
      removed = true;
    },
    querySelector: () => ({
      decode: () =>
        failedImage
          ? Promise.reject(new Error("Image failed"))
          : Promise.resolve(),
    }),
    getAnimations: missingAnimationApi ? undefined : () => [{ finished }],
    addEventListener(name: string, listener: (event: unknown) => void) {
      listeners.set(name, listener);
    },
    removeEventListener(name: string) {
      listeners.delete(name);
    },
  };
  const environment = {
    matchMedia: () => ({
      matches: reduced,
      addEventListener() {},
      removeEventListener() {},
    }),
    requestAnimationFrame(callback: () => void) {
      frame = callback;
      return 1;
    },
    cancelAnimationFrame() {
      frame = undefined;
    },
    setTimeout(callback: () => void, delay: number) {
      const id = ++nextTimer;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id: number) {
      timers.delete(id);
    },
    addEventListener(name: string, listener: (event: unknown) => void) {
      listeners.set(name, listener);
    },
    removeEventListener(name: string) {
      listeners.delete(name);
    },
  };
  const dispose = playSplash(
    splash as unknown as HTMLElement,
    { dataset } as unknown as HTMLElement,
    environment as unknown as Window,
  );
  return {
    dataset,
    timers,
    listeners,
    dispose,
    endEntrance,
    isRemoved: () => removed,
    paint: () => frame?.(),
    emit: (name: string, event: unknown) => listeners.get(name)?.(event),
    splash,
  };
}

test("a cached logo still gets its full entrance before the splash exits", async () => {
  const intro = animationHarness();
  await Promise.resolve();
  intro.paint();
  assert.equal(intro.dataset.intro, "presenting");
  assert.equal(intro.isRemoved(), false);
  intro.endEntrance();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(intro.dataset.intro, "leaving");
  intro.emit("transitionend", {
    target: intro.splash,
    propertyName: "opacity",
  });
  assert.equal(intro.dataset.intro, "done");
  assert.equal(intro.isRemoved(), true);
  assert.equal(intro.timers.size, 0);
  assert.equal(intro.listeners.size, 0);
});

test("a stuck entrance cannot exceed the watchdog", async () => {
  const intro = animationHarness();
  await Promise.resolve();
  intro.paint();
  [...intro.timers.values()].find((timer) => timer.delay === 1900)?.callback();
  assert.equal(intro.dataset.intro, "done");
  assert.equal(intro.isRemoved(), true);
  assert.equal(intro.listeners.size, 0);
});

test("reduced motion and image errors reveal content immediately", async () => {
  for (const options of [{ reduced: true }, { failedImage: true }]) {
    const intro = animationHarness(options);
    await Promise.resolve();
    assert.equal(intro.dataset.intro, "done");
    assert.equal(intro.isRemoved(), true);
    assert.equal(intro.timers.size, 0);
  }
});

test("animationend provides a fallback when the animations API is unavailable", async () => {
  const intro = animationHarness({ missingAnimationApi: true });
  await Promise.resolve();
  intro.paint();
  intro.emit("animationend", {
    target: { classList: { contains: () => true } },
  });
  assert.equal(intro.dataset.intro, "leaving");
  [...intro.timers.values()].find((timer) => timer.delay === 500)?.callback();
  assert.equal(intro.isRemoved(), true);
});

test("keyboard dismissal and effect cleanup cannot leave a delayed overlay", async () => {
  const intro = animationHarness();
  intro.emit("keydown", { key: "Tab" });
  await Promise.resolve();
  intro.paint();
  assert.equal(intro.dataset.intro, "done");
  assert.equal(intro.listeners.size, 0);
  const cancelled = animationHarness();
  cancelled.dispose();
  await Promise.resolve();
  cancelled.paint();
  assert.equal(cancelled.dataset.intro, "pending");
  assert.equal(cancelled.timers.size, 0);
  assert.equal(cancelled.listeners.size, 0);
});

test("reduced motion bypasses the splash without a timer", () => {
  for (const blocked of [true, false]) {
    const reduced = visit({ reduced: true, blocked });
    assert.equal(reduced.dataset.intro, "done");
    assert.equal(reduced.isRemoved(), true);
    assert.equal(reduced.timers.length, 0);
  }
});

test("blocked storage cannot strand the intro overlay", () => {
  const blocked = visit({ blocked: true });
  assert.equal(blocked.dataset.intro, "pending");
  blocked.timers[0].callback();
  assert.equal(blocked.isRemoved(), true);
  assert.equal(blocked.dataset.intro, "done");
});

test("the boot fallback retains official information and links", () => {
  assert.match(html, /class="app-fallback"/);
  assert.match(html, /#root:empty\s*\+\s*\.app-fallback/);
  assert.match(html, /https:\/\/forms\.gle\/FnJdV3HPni5MUwqJA/);
  assert.match(html, /1P7u-2Wwhr4NrrHgCJooaUvcAxYdNnEHI/);
  assert.match(html, /role="status"/);
});
