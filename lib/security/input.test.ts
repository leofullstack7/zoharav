import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FIELD_LIMITS,
  clip,
  isValidEmail,
  oneLine,
  readBoundedString,
} from "./input.ts";

test("rejects emails with header-breaking newlines", () => {
  assert.equal(isValidEmail("ok@zoharav.com"), true);
  assert.equal(isValidEmail("bad\r\nBcc: attacker@example.com"), false);
  assert.equal(isValidEmail("not-an-email"), false);
});

test("oneLine collapses CR/LF so subjects cannot split", () => {
  assert.equal(oneLine("Petróleo\r\nBcc: x"), "Petróleo Bcc: x");
});

test("readBoundedString clips and strips control characters", () => {
  const long = "a".repeat(FIELD_LIMITS.name + 40);
  assert.equal(readBoundedString(long, FIELD_LIMITS.name).length, FIELD_LIMITS.name);
  assert.equal(readBoundedString("  name\u0000  ", 120), "name");
});

test("clip never grows the string", () => {
  assert.equal(clip("short", 40), "short");
});
