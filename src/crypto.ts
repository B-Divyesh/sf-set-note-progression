import type { Backup, EncryptedBackup } from './types';

const ITERATIONS = 210_000;
const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  let value = '';
  bytes.forEach((byte) => { value += String.fromCharCode(byte); });
  return btoa(value);
}

function base64ToBytes(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptBackup(backup: Backup, password: string): Promise<EncryptedBackup> {
  if (password.length < 8) throw new Error('Use at least 8 characters for the backup password.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(backup)));
  return {
    format: 'set-note-progression-encrypted', version: 1, algorithm: 'AES-GCM', iterations: ITERATIONS,
    salt: bytesToBase64(salt), iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(encrypted)),
  };
}

export async function decryptBackup(backup: EncryptedBackup, password: string): Promise<Backup> {
  if (backup.format !== 'set-note-progression-encrypted' || backup.algorithm !== 'AES-GCM') {
    throw new Error('This is not an encrypted Set Note Progression backup.');
  }
  try {
    const salt = base64ToBytes(backup.salt);
    const key = await deriveKey(password, salt);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(backup.iv) as BufferSource }, key, base64ToBytes(backup.data) as BufferSource);
    return JSON.parse(new TextDecoder().decode(plain)) as Backup;
  } catch {
    throw new Error('The backup could not be opened. Check the password and try again.');
  }
}
