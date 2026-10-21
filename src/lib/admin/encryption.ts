import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt as scryptCallback,
} from "node:crypto";

/**
 * Secure encryption utilities for sensitive settings like ZeptoMail API tokens.
 * Uses AES-256-GCM for authenticated encryption.
 *
 * The master encryption key is derived from a passphrase stored in the environment
 * variable ZEPTOMAIL_ENCRYPTION_KEY. This key must be set in production.
 * It is NOT stored in the database.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM
const SALT_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits
const TAG_LENGTH = 16; // 128-bit auth tag

const SCRYPT_OPTIONS = { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };

/**
 * Derives the master encryption key from the environment passphrase.
 * The passphrase should be a strong random string set in ZEPTOMAIL_ENCRYPTION_KEY.
 */
function deriveMasterKey(): Promise<Buffer> {
  const passphrase = process.env.ZEPTOMAIL_ENCRYPTION_KEY;
  if (!passphrase) {
    throw new Error(
      "ZEPTOMAIL_ENCRYPTION_KEY environment variable is not set. " +
        "Please configure a strong passphrase for encrypting sensitive settings. " +
        "This is required for ZeptoMail token encryption."
    );
  }

  // Use a fixed salt for the master key derivation (stored in env, not DB)
  // In production, you could also use a separate key management system
  const salt = Buffer.from("zeptomail-master-salt-v1", "utf8");

  return new Promise((resolve, reject) => {
    scryptCallback(passphrase, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns an object with the encrypted data, salt, and IV, all base64-encoded.
 * The format is suitable for database storage.
 */
export async function encryptSecret(plaintext: string): Promise<{
  encrypted: string; // base64 encoded ciphertext
  salt: string; // base64 encoded salt
  iv: string; // base64 encoded IV
  tag: string; // base64 encoded auth tag
}> {
  const masterKey = await deriveMasterKey();
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: TAG_LENGTH,
  });

  // Note: scrypt with salt is not used here for per-field encryption;
  // we use the master key directly with a random IV per encryption.
  // The salt is stored but not used for key derivation in this simple scheme.
  // For higher security, you could derive per-field keys from master key + salt.

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return {
    encrypted: ciphertext.toString("base64"),
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

/**
 * Decrypts a secret encrypted with encryptSecret.
 * Takes the stored encrypted data, salt, IV, and tag (all base64).
 * Returns the plaintext string.
 * Throws if decryption fails (auth tag mismatch, wrong key, corrupted data).
 */
export async function decryptSecret(data: {
  encrypted: string;
  salt: string;
  iv: string;
  tag: string;
}): Promise<string> {
  const masterKey = await deriveMasterKey();

  const ciphertext = Buffer.from(data.encrypted, "base64");
  const iv = Buffer.from(data.iv, "base64");
  const tag = Buffer.from(data.tag, "base64");

  const decipher = createDecipheriv(ALGORITHM, masterKey, iv, {
    authTagLength: TAG_LENGTH,
  });
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

/**
 * Helper to combine encrypted parts into a single string for storage.
 * Format: salt:iv:tag:encrypted (all base64, colon-separated)
 */
export function packEncrypted(data: {
  encrypted: string;
  salt: string;
  iv: string;
  tag: string;
}): string {
  return `${data.salt}:${data.iv}:${data.tag}:${data.encrypted}`;
}

/**
 * Helper to parse a packed encrypted string back into parts.
 */
export function unpackEncrypted(packed: string): {
  encrypted: string;
  salt: string;
  iv: string;
  tag: string;
} | null {
  const parts = packed.split(":");
  if (parts.length !== 4) return null;
  return {
    salt: parts[0],
    iv: parts[1],
    tag: parts[2],
    encrypted: parts[3],
  };
}

/**
 * High-level encrypt function that returns a single packed string.
 */
export async function encryptAndPack(plaintext: string): Promise<string> {
  const data = await encryptSecret(plaintext);
  return packEncrypted(data);
}

/**
 * High-level decrypt function that takes a packed string and returns plaintext.
 */
export async function unpackAndDecrypt(packed: string): Promise<string> {
  const data = unpackEncrypted(packed);
  if (!data) {
    throw new Error("Invalid encrypted data format");
  }
  return decryptSecret(data);
}

/**
 * Validates that the encryption system is configured correctly.
 * Call this at startup or in health checks.
 */
export async function validateEncryptionConfig(): Promise<boolean> {
  try {
    const test = "zeptomail-test-encryption";
    const packed = await encryptAndPack(test);
    const decrypted = await unpackAndDecrypt(packed);
    return decrypted === test;
  } catch {
    return false;
  }
}