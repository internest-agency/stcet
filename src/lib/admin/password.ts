import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

const SCRYPT_OPTIONS = { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };
const KEY_LENGTH = 64;

function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `scrypt$${SCRYPT_OPTIONS.N}$${SCRYPT_OPTIONS.r}$${SCRYPT_OPTIONS.p}$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyAdminPassword(
  encodedHash: string | null,
  password: string,
) {
  const parts = encodedHash?.split("$");
  const isSupported =
    parts?.length === 6 &&
    parts[0] === "scrypt" &&
    parts[1] === String(SCRYPT_OPTIONS.N) &&
    parts[2] === String(SCRYPT_OPTIONS.r) &&
    parts[3] === String(SCRYPT_OPTIONS.p) &&
    /^[a-f0-9]{32}$/i.test(parts[4]) &&
    /^[a-f0-9]{128}$/i.test(parts[5]);

  if (!isSupported) {
    await deriveKey(password, randomBytes(16));
    return false;
  }

  const expected = Buffer.from(parts[5], "hex");
  const actual = await deriveKey(password, Buffer.from(parts[4], "hex"));
  return timingSafeEqual(actual, expected);
}
