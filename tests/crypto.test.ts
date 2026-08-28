import { describe, expect, it } from 'vitest';
import { decryptBackup, encryptBackup } from '../src/crypto';
import type { Backup } from '../src/types';

const backup: Backup = {
  format: 'set-note-progression', version: 1, exportedAt: '2026-08-28T00:00:00.000Z',
  exercises: [], sessions: [],
};

describe('encrypted backup', () => {
  it('round trips with the right password', async () => {
    const encrypted = await encryptBackup(backup, 'correct horse battery staple');
    expect(JSON.stringify(encrypted)).not.toContain(backup.exportedAt);
    await expect(decryptBackup(encrypted, 'correct horse battery staple')).resolves.toEqual(backup);
  });

  it('rejects a short password', async () => {
    await expect(encryptBackup(backup, 'short')).rejects.toThrow('at least 8 characters');
  });
});
