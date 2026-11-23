import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { getAuthSecret } from "@/lib/auth-env";

/**
 * Encrypts small secrets (MFA seeds) at rest with AES-256-GCM, keyed from AUTH_SECRET,
 * so a database dump alone cannot be used to mint login codes.
 * Rotating AUTH_SECRET makes stored MFA seeds unreadable: staff must enrol again.
 */

function key(): Buffer {
  const secret = getAuthSecret();
  if (!secret) throw new Error("AUTH_SECRET is required to store MFA secrets.");
  return createHash("sha256").update(`mfa-seed:${secret}`).digest();
}

export function sealSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), data.toString("base64url")].join(".");
}

export function openSecret(sealed: string): string | null {
  const [version, iv, tag, data] = sealed.split(".");
  if (version !== "v1" || !iv || !tag || !data) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
