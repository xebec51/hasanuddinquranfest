import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("rendered navigation, accordion relationships, and external links stay valid", async () => {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const { default: App } = await server.ssrLoadModule("/src/App.tsx");
    const html = renderToStaticMarkup(createElement(App));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, "IDs must be unique");
    for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
      assert.ok(ids.includes(match[1]), `Missing anchor target: ${match[1]}`);
    }
    for (const match of html.matchAll(/\baria-controls="([^"]+)"/g)) {
      assert.ok(
        ids.includes(match[1]),
        `Missing controlled region: ${match[1]}`,
      );
    }
    assert.equal((html.match(/id="faq-question-\d+"/g) ?? []).length, 6);
    assert.equal((html.match(/id="faq-answer-\d+"/g) ?? []).length, 6);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
    assert.match(html, /Hasanuddin[\s\S]*Qur&#x27;an Fest/);
    assert.match(
      html,
      /Membumikan Nilai Qur&#x27;ani, Menumbuhkan Jiwa Intelektual, Membangun Peradaban Mulia/,
    );
    assert.doesNotMatch(
      html,
      /Merawat nilai|Iman\. Ilmu\. Karya|Tiga jalan|Catat tanggalnya|Langkah kecilmu|Hadir dengan niat|Pulang dengan makna|perjalanan Qur|Bawa semangat|Kami siap|yang berarti/i,
    );
    for (const title of [
      "Tentang HQF 2026",
      "Cabang lomba",
      "Jadwal kegiatan",
      "Persyaratan peserta",
      "Pertanyaan umum",
      "Kontak panitia",
    ]) {
      assert.ok(
        html.includes(title),
        `Missing factual section heading: ${title}`,
      );
    }
    assert.match(html, /https:\/\/forms\.gle\/FnJdV3HPni5MUwqJA/);
    assert.match(html, /1P7u-2Wwhr4NrrHgCJooaUvcAxYdNnEHI/);
    assert.match(html, /https:\/\/wa.me\/6282348353632/);
    assert.match(html, /https:\/\/wa.me\/6285933498442/);
    assert.match(html, /instagram.com\/hasanuddinquranfest\//);
    assert.match(html, /instagram.com\/ukm_psq_unhas\//);
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(match[0], /alt="[^"]+"/);
      assert.match(match[0], /width="\d+"/);
      assert.match(match[0], /height="\d+"/);
    }
  } finally {
    await server.close();
  }
});
