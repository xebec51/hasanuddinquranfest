import assert from "node:assert/strict";
import test from "node:test";
import { registrationState, stageStatus } from "../src/data/calendar.ts";
import {
  calendarDaysToRegistrationEnd,
  witaDate,
  event,
} from "../src/data/event.ts";

test("uses WITA calendar days rather than the browser timezone", () => {
  assert.equal(witaDate(new Date("2026-10-12T16:00:00Z")), "2026-10-13");
  assert.equal(
    calendarDaysToRegistrationEnd(new Date("2026-10-12T00:00:00Z")),
    26,
  );
});

test("counts down to the last date without inventing a closing hour", () => {
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
