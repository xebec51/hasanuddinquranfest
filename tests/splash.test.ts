import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bootstrap = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
  (match) => match[1],
);

function visit({ seen = false, reduced = false, blocked = false } = {}) {
  const storage = new Map<string, string>(
    seen ? [["hqf-intro-2026", "seen"]] : [],
  );
  const dataset: Record<string, string> = {};
  const timers: { callback: () => void; delay: number }[] = [];
  let removed = false;
  const context = {
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
      matchMedia: () => ({ matches: reduced }),
      setTimeout: (callback: () => void, delay: number) =>
        timers.push({ callback, delay }),
    },
  };
  for (const script of bootstrap) runInNewContext(script, context);
  return { storage, dataset, timers, isRemoved: () => removed };
}

test("the first session visit shows the branded shell with a bounded watchdog", () => {
  const first = visit();
  assert.equal(first.dataset.intro, "pending");
  assert.equal(first.storage.get("hqf-intro-2026"), "seen");
  assert.equal(first.timers.length, 1);
  assert.ok(first.timers[0].delay <= 2000);
  first.timers[0].callback();
  assert.equal(first.dataset.intro, "done");
  assert.equal(first.isRemoved(), true);
});

test("reload in the same session removes the splash immediately", () => {
  const reload = visit({ seen: true });
  assert.equal(reload.dataset.intro, "done");
  assert.equal(reload.isRemoved(), true);
  assert.equal(reload.timers.length, 0);
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
