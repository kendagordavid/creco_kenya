import "server-only";

import QRCode from "qrcode";
import { openSecret, sealSecret } from "@/lib/secret-box";
import {
  activatePendingMfa,
  claimMfaStep,
  clearMfa,
  getMfaSecrets,
  setPendingMfaSecret,
} from "@/lib/staff-store";
import { generateTotpSecret, totpAuthUri, verifyTotp } from "@/lib/totp";

export type MfaEnrollment = {
  secret: string;
  otpauthUri: string;
  qrDataUrl: string;
};

/** Creates a fresh secret and keeps it pending until the user confirms a code from it. */
export async function startMfaEnrollment(userId: string, email: string): Promise<MfaEnrollment> {
  const secret = generateTotpSecret();
  await setPendingMfaSecret(userId, sealSecret(secret));
  const otpauthUri = totpAuthUri(secret, email);
  const qrDataUrl = await QRCode.toDataURL(otpauthUri, { margin: 1, width: 220 });
  return { secret, otpauthUri, qrDataUrl };
}

export async function confirmMfaEnrollment(userId: string, code: string): Promise<boolean> {
  const state = await getMfaSecrets(userId);
  const secret = state?.pending ? openSecret(state.pending) : null;
  if (!secret) return false;
  const step = verifyTotp(secret, code);
  if (step === null) return false;
  await activatePendingMfa(userId, step);
  return true;
}

/** Checks a sign-in code and burns it so it cannot be used twice. */
export async function verifyMfaCode(userId: string, code: string): Promise<boolean> {
  const state = await getMfaSecrets(userId);
  const secret = state?.enabled && state.secret ? openSecret(state.secret) : null;
  if (!secret) return false;
  const step = verifyTotp(secret, code);
  if (step === null) return false;
  return claimMfaStep(userId, step);
}

export async function isMfaEnabled(userId: string): Promise<boolean> {
  return Boolean((await getMfaSecrets(userId))?.enabled);
}

export async function disableMfa(userId: string): Promise<void> {
  await clearMfa(userId);
}
