import assert from "node:assert/strict";
import test from "node:test";
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
