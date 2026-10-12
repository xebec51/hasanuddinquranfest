import assert from "node:assert/strict";
import test from "node:test";
import { registrationState, stageStatus } from "../src/data/calendar.ts";
import {
  calendarDaysToRegistrationEnd,
  witaDate,
  event,
  competitions,
  faqs,
  requirements,
} from "../src/data/event.ts";

test("uses WITA calendar days rather than the browser timezone", () => {
  assert.equal(witaDate(new Date("2026-10-12T16:00:00Z")), "2026-10-13");
  assert.equal(
    calendarDaysToRegistrationEnd(new Date("2026-10-12T00:00:00Z")),
    26,
  );
});

test("counts down using calendar dates even with a confirmed closing time", () => {
  assert.equal(
    calendarDaysToRegistrationEnd(new Date("2026-11-06T15:59:59Z")),
    1,
  );
  assert.equal(
    calendarDaysToRegistrationEnd(new Date("2026-11-06T16:00:00Z")),
    0,
  );
  assert.equal(
    calendarDaysToRegistrationEnd(new Date("2026-11-07T15:59:59Z")),
    0,
  );
  assert.equal(
    calendarDaysToRegistrationEnd(new Date("2026-11-07T16:00:00Z")),
    -1,
  );
});

test("registration closes at the user-confirmed 23:59 WITA", () => {
  assert.equal(event.registration.deadline, "2026-11-07T23:59:00+08:00");
  assert.equal(
    registrationState(new Date("2026-11-07T15:58:59.999Z")).kind,
    "last-day",
  );
  assert.equal(
    registrationState(new Date("2026-11-07T15:59:00.000Z")).kind,
    "closed",
  );
  assert.equal(
    registrationState(new Date("2026-11-07T15:59:59.999Z")).kind,
    "closed",
  );
  assert.equal(
    registrationState(new Date("2026-11-07T16:00:00.000Z")).kind,
    "closed",
  );
});

test("guide-derived rules keep the approved form and original event facts", () => {
  assert.equal(event.links.registration, "https://forms.gle/FnJdV3HPni5MUwqJA");
  assert.deepEqual(event.fees, { individual: 35000, team: 60000 });
  assert.match(requirements.join(" "), /satu cabang/);
  assert.match(requirements.join(" "), /institusi yang sama/);
  assert.match(requirements.join(" "), /KTM, atau KTP/);
  assert.match(competitions[0].description, /31–33/);
  assert.match(competitions[1].description, /4–5 menit/);
  assert.match(competitions[2].description, /landscape, maksimal 15 menit/);
  assert.equal(new Set(faqs.map((faq) => faq.question)).size, faqs.length);
  assert.equal(faqs.length, 14);
  assert.doesNotMatch(JSON.stringify(faqs), /DEirmCbSBGThmrhp8|semifinal/);
});

test("WhatsApp links retain the supplied contact numbers", () => {
  for (const contact of event.contacts) {
    assert.equal(contact.whatsapp, `https://wa.me/62${contact.phone.slice(1)}`);
  }
});

test("registration messaging covers upcoming, open, last-day, and closed dates", () => {
  assert.equal(
    registrationState(new Date("2026-10-10T00:00:00Z")).kind,
    "upcoming",
  );
  assert.equal(
    registrationState(new Date("2026-10-12T00:00:00Z")).kind,
    "open",
  );
  assert.equal(
    registrationState(new Date("2026-11-06T16:00:00Z")).kind,
    "last-day",
  );
  const closed = registrationState(new Date("2026-11-07T16:00:00Z"));
  assert.equal(closed.kind, "closed");
  assert.ok(closed.days < 0);
});

test("timeline stages change at WITA date boundaries, including single-day stages", () => {
  assert.equal(
    stageStatus("2026-11-11", "2026-11-11", new Date("2026-11-10T15:59:59Z")),
    "upcoming",
  );
  assert.equal(
    stageStatus("2026-11-11", "2026-11-11", new Date("2026-11-10T16:00:00Z")),
    "active",
  );
  assert.equal(
    stageStatus("2026-11-11", "2026-11-11", new Date("2026-11-11T16:00:00Z")),
    "complete",
  );
});
