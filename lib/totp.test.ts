import assert from "node:assert/strict";
import test from "node:test";
import { base32Decode, base32Encode, totpCode, verifyTotp } from "./totp.ts";

// RFC 6238 appendix B uses the ASCII secret "12345678901234567890" with SHA-1.
const RFC_SECRET = base32Encode(Buffer.from("12345678901234567890"));

test("base32 round-trips", () => {
  const bytes = Buffer.from("hello, mashirika");
  assert.deepEqual(base32Decode(base32Encode(bytes)), bytes);
});

test("matches the RFC 6238 SHA-1 test vectors (last 6 digits)", () => {
  const vectors: [number, string][] = [
    [59, "287082"],
    [1111111109, "081804"],
    [1111111111, "050471"],
    [1234567890, "005924"],
    [2000000000, "279037"],
  ];
  for (const [seconds, expected] of vectors) {
    assert.equal(totpCode(RFC_SECRET, Math.floor(seconds / 30)), expected);
  }
});

test("verifyTotp accepts one step of drift and rejects the rest", () => {
  const now = 1234567890 * 1000;
  const step = Math.floor(1234567890 / 30);
  assert.equal(verifyTotp(RFC_SECRET, totpCode(RFC_SECRET, step), now), step);
  assert.equal(verifyTotp(RFC_SECRET, totpCode(RFC_SECRET, step - 1), now), step - 1);
  assert.equal(verifyTotp(RFC_SECRET, totpCode(RFC_SECRET, step + 2), now), null);
  assert.equal(verifyTotp(RFC_SECRET, "12345", now), null);
  assert.equal(verifyTotp(RFC_SECRET, "abcdef", now), null);
});
