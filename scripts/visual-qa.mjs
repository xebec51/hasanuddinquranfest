// Playwright is intentionally installed outside the application dependencies.
// Usage: node scripts/visual-qa.mjs <temporary-playwright-directory> [preview-url]
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const directory = process.argv[2];
if (!directory)
  throw new Error("Provide the isolated Playwright installation directory");
process.env.PLAYWRIGHT_BROWSERS_PATH = join(directory, "browsers");
const { chromium } = await import(
  pathToFileURL(join(directory, "node_modules/playwright/index.mjs"))
);
const output = join(directory, "results");
await mkdir(output, { recursive: true });
const base = process.argv[3] ?? "http://localhost:4173/";
const browser = await chromium.launch({ headless: true });
const report = {
  breakpoints: [],
  interactions: [],
  consoleErrors: [],
  failedAssets: [],
  failedRequests: [],
  screenshots: output,
};
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage();
page.on("pageerror", (error) => report.consoleErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") report.consoleErrors.push(message.text());
});
page.on("requestfailed", (request) =>
  report.failedRequests.push({
    url: request.url(),
    error: request.failure()?.errorText,
  }),
);
page.on("response", (response) => {
  if (response.url().startsWith(base) && response.status() >= 400)
    report.failedAssets.push({
      url: response.url(),
      status: response.status(),
    });
});

const waitForIntroEnd = () =>
  page.waitForFunction(
    () =>
      document.documentElement.dataset.intro === "done" &&
      !document.getElementById("hqf-intro"),
    null,
    { timeout: 2500 },
  );
const flushReveals = async () => {
  await page.evaluate(async () => {
    const end = document.documentElement.scrollHeight - innerHeight;
    for (let y = 0; y <= end + innerHeight; y += innerHeight * 0.7) {
      window.scrollTo({ top: Math.min(y, end), behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 65));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(750);
};

try {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.locator("#hqf-intro").waitFor({ state: "visible", timeout: 2000 });
  await page.waitForFunction(
    () => {
      const logo = document.querySelector(".intro-logo");
      return logo && Number(getComputedStyle(logo).opacity) > 0.5;
    },
    null,
    { timeout: 1700 },
  );
  await page.screenshot({ path: join(output, "splash-390.png") });
  await waitForIntroEnd();
  assert.equal(await page.locator("#hqf-intro").count(), 0);
  report.interactions.push(
    "Initial splash is visible, logo enters, overlay is removed",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#hqf-intro").waitFor({ state: "visible", timeout: 2000 });
  await waitForIntroEnd();
  report.interactions.push(
    "Refresh in the same browser tab shows splash again",
  );

  assert.ok(
    (await page.locator(".reveal-ready:not(.is-revealed)").count()) > 0,
    "Offscreen reveals should be prepared",
  );
  await page.locator("#lomba").scrollIntoViewIfNeeded();
  await page.waitForTimeout(750);
  assert.ok((await page.locator(".competition.is-revealed").count()) > 0);
  report.interactions.push(
    "Scroll reveals competition cards on viewport entry",
  );
  await page.getByRole("button", { name: "Cabang lomba berikutnya" }).click();
  await page.waitForTimeout(650);
  assert.ok(
    (await page
      .locator("#competition-list")
      .evaluate((element) => element.scrollLeft)) > 0,
  );
  await page.getByRole("button", { name: "Cabang lomba berikutnya" }).click();
  await page.waitForTimeout(650);
  assert.equal(
    await page
      .getByRole("button", { name: "Cabang lomba berikutnya" })
      .isDisabled(),
    true,
  );
  await page.getByRole("button", { name: "Cabang lomba sebelumnya" }).click();
  await page.waitForTimeout(650);
  report.interactions.push(
    "Horizontal competition rail advances and returns with arrow controls",
  );

  await page.getByRole("button", { name: "Buka menu", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Tutup menu", exact: true })
      .getAttribute("aria-expanded"),
    "true",
  );
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  await page.screenshot({ path: join(output, "menu-390.png") });
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Buka menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Buka menu", exact: true })
      .evaluate((button) => document.activeElement === button),
    true,
  );
  await page.getByRole("button", { name: "Buka menu", exact: true }).click();
  await page
    .locator("#mobile-navigation")
    .getByRole("link", { name: /Cabang lomba/ })
    .click();
  await page.waitForTimeout(750);
  assert.equal(
    await page
      .getByRole("button", { name: "Buka menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(await page.locator("#hqf-intro").count(), 0);
  assert.notEqual(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  report.interactions.push(
    "Hamburger, Escape focus return, anchor navigation and scroll unlocking work; anchors do not replay splash",
  );

  const questions = page.locator(".faq-item button");
  for (let index = 0; index < (await questions.count()); index++) {
    const button = questions.nth(index);
    await button.click();
    assert.equal(await button.getAttribute("aria-expanded"), "true");
    assert.equal(
      await page.locator(`#faq-answer-${index}`).getAttribute("aria-hidden"),
      "false",
    );
    await page.waitForTimeout(330);
    assert.ok(
      (await page
        .locator(`#faq-answer-${index}`)
        .evaluate((element) => element.getBoundingClientRect().height)) > 0,
    );
    await button.click();
    assert.equal(await button.getAttribute("aria-expanded"), "false");
  }
  report.interactions.push(
    "All 14 FAQ panels open and close with matching ARIA state",
  );
  await questions.first().focus();
  await page.keyboard.press("Enter");
  assert.equal(await questions.first().getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Space");
  assert.equal(await questions.first().getAttribute("aria-expanded"), "false");

  const required = [
    "https://forms.gle/FnJdV3HPni5MUwqJA",
    "https://drive.google.com/file/d/1P7u-2Wwhr4NrrHgCJooaUvcAxYdNnEHI/view?usp=drivesdk",
    "https://wa.me/6282348353632",
    "https://wa.me/6285933498442",
    "https://www.instagram.com/hasanuddinquranfest/",
    "https://www.instagram.com/ukm_psq_unhas/",
  ];
  for (const url of required) {
    const link = page.locator(`a[href="${url}"]`).first();
    assert.ok((await link.count()) > 0);
    assert.equal(await link.getAttribute("target"), "_blank");
    assert.match(await link.getAttribute("rel"), /noopener/);
  }
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.locator(".hero-actions a").first().click(),
  ]);
  assert.ok(popup);
  await popup.close();
  report.interactions.push(
    "Official external destinations retained; registration CTA opens a new tab (no form submission)",
  );

  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await waitForIntroEnd();
    await flushReveals();
    const measurements = await page.evaluate(() => {
      const headline = document
        .querySelector(".hero h1")
        .getBoundingClientRect();
      const overflow = [...document.querySelectorAll("body *")]
        .filter((element) => {
          const box = element.getBoundingClientRect();
          const css = getComputedStyle(element);
          if (!box.width || css.position === "fixed" || css.display === "none")
            return false;
          if (
            element.closest(
              ".competition-grid, .registration-section, .hero-visual, .mobile-menu-shell",
            )
          )
            return false;
          return box.right > innerWidth + 1 || box.left < -1;
        })
        .map((element) => `${element.tagName}.${element.className}`);
      return {
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        headlineBottom: Math.round(headline.bottom),
        overflow,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.src),
        hiddenAfterScroll: document.querySelectorAll(
          ".reveal-ready:not(.is-revealed):not(.competition)",
        ).length,
      };
    });
    assert.ok(
      measurements.scrollWidth <= width,
      `Horizontal page overflow at ${width}: ${JSON.stringify(measurements)}`,
    );
    assert.deepEqual(
      measurements.overflow,
      [],
      `Overflowing content at ${width}`,
    );
    assert.deepEqual(
      measurements.brokenImages,
      [],
      `Broken images at ${width}`,
    );
    assert.equal(
      measurements.hiddenAfterScroll,
      0,
      `Unrevealed content at ${width}`,
    );
    assert.ok(
      measurements.headlineBottom < 844,
      `Event headline must be visible in the first viewport at ${width}`,
    );
    await page.screenshot({ path: join(output, `hero-${width}.png`) });
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: join(output, `page-${width}.png`),
        fullPage: true,
      });
    report.breakpoints.push(measurements);
  }
  await page.locator("#lomba").scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(output, "competitions-1440.png") });
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(output, "footer-1440.png") });

  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base, { waitUntil: "domcontentloaded" });
  await reducedPage.locator(".hero h1").waitFor();
  assert.equal(await reducedPage.locator("#hqf-intro").count(), 0);
  assert.equal(await reducedPage.locator(".reveal-ready").count(), 0);
  await reducedPage.reload({ waitUntil: "domcontentloaded" });
  await reducedPage.locator(".hero h1").waitFor();
  assert.equal(await reducedPage.locator("#hqf-intro").count(), 0);
  await reducedPage.screenshot({
    path: join(output, "reduced-motion-390.png"),
  });
  report.interactions.push(
    "Reduced motion skips splash and offscreen hiding, including on refresh",
  );
  await reduced.close();

  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const touchPage = await touch.newPage();
  await touchPage.goto(base, { waitUntil: "domcontentloaded" });
  await touchPage.waitForFunction(
    () => document.documentElement.dataset.intro === "done",
    null,
    { timeout: 2500 },
  );
  await touchPage.locator("#competition-list").scrollIntoViewIfNeeded();
  await touchPage.waitForTimeout(750);
  const trackBox = await touchPage.locator("#competition-list").boundingBox();
  assert.ok(trackBox);
  const touchY = Math.min(trackBox.y + 130, 700);
  const input = await touch.newCDPSession(touchPage);
  await input.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 320, y: touchY }],
  });
  for (let x = 290; x >= 80; x -= 30) {
    await input.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: touchY }],
    });
    await touchPage.waitForTimeout(20);
  }
  await input.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await touchPage.waitForTimeout(650);
  assert.ok(
    (await touchPage
      .locator("#competition-list")
      .evaluate((element) => element.scrollLeft)) > 100,
    "Touch swipe must move the competition rail",
  );
  await touchPage.screenshot({ path: join(output, "touch-rail-390.png") });
  report.interactions.push(
    "Mobile touch emulation swipes the competition rail horizontally",
  );
  await touch.close();

  const noScript = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  const fallbackPage = await noScript.newPage();
  await fallbackPage.goto(base, { waitUntil: "domcontentloaded" });
  assert.ok(await fallbackPage.locator(".app-fallback").isVisible());
  assert.equal(await fallbackPage.locator("#hqf-intro").isVisible(), false);
  assert.equal(
    await fallbackPage
      .getByRole("link", { name: "Buka pendaftaran resmi" })
      .getAttribute("href"),
    required[0],
  );
  await fallbackPage.screenshot({
    path: join(output, "no-javascript-390.png"),
  });
  report.interactions.push(
    "No-JavaScript fallback shows the official information and working registration link",
  );
  await noScript.close();
  assert.deepEqual(report.failedAssets, []);
  assert.deepEqual(report.consoleErrors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
