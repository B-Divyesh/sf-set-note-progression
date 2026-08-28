import type { Backup, Exercise, Session } from './types';
import { sampleExercises, sampleSessions } from './sample';

const DB_VERSION = 1;
const REAL_DB = 'set-note-progression';
const DEMO_DB = 'demo:set-note-progression';

function openDb(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(demo ? DEMO_DB : REAL_DB, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('exercises')) db.createObjectStore('exercises', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('The local log could not be opened. Reload and try again.'));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('The local log could not be read. Reload and try again.'));
  });
}

async function store(demo: boolean, name: 'exercises' | 'sessions' | 'meta', mode: IDBTransactionMode = 'readonly') {
  const db = await openDb(demo);
  return db.transaction(name, mode).objectStore(name);
}

export async function listExercises(demo: boolean): Promise<Exercise[]> {
  return requestResult((await store(demo, 'exercises')).getAll()) as Promise<Exercise[]>;
}

export async function listSessions(demo: boolean): Promise<Session[]> {
  const result = await requestResult((await store(demo, 'sessions')).getAll()) as Session[];
  return result.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

export async function saveExercise(demo: boolean, exercise: Exercise): Promise<void> {
  await requestResult((await store(demo, 'exercises', 'readwrite')).put(exercise));
}

export async function saveSession(demo: boolean, session: Session): Promise<void> {
  await requestResult((await store(demo, 'sessions', 'readwrite')).put(session));
}

export async function deleteSession(demo: boolean, id: string): Promise<void> {
  await requestResult((await store(demo, 'sessions', 'readwrite')).delete(id));
}

export async function ensureDemoSeeded(): Promise<void> {
  const meta = await store(true, 'meta');
  const seeded = await requestResult(meta.get('seeded')) as { key: string; value: boolean } | undefined;
  if (seeded?.value) return;
  const db = await openDb(true);
  const transaction = db.transaction(['exercises', 'sessions', 'meta'], 'readwrite');
  sampleExercises.forEach((item) => transaction.objectStore('exercises').put(item));
  sampleSessions.forEach((item) => transaction.objectStore('sessions').put(item));
  transaction.objectStore('meta').put({ key: 'seeded', value: true });
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function resetDemo(): Promise<void> {
  const db = await openDb(true);
  db.close();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DEMO_DB);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  await ensureDemoSeeded();
}

export async function makeBackup(demo: boolean): Promise<Backup> {
  return {
    format: 'set-note-progression',
    version: 1,
    exportedAt: new Date().toISOString(),
    exercises: await listExercises(demo),
    sessions: await listSessions(demo),
  };
}

export async function restoreBackup(demo: boolean, backup: Backup): Promise<void> {
  if (backup.format !== 'set-note-progression' || backup.version !== 1 || !Array.isArray(backup.exercises) || !Array.isArray(backup.sessions)) {
    throw new Error('This is not a Set Note Progression backup. Choose a file exported by this app.');
  }
  const db = await openDb(demo);
  const transaction = db.transaction(['exercises', 'sessions'], 'readwrite');
  backup.exercises.forEach((item) => transaction.objectStore('exercises').put(item));
  backup.sessions.forEach((item) => transaction.objectStore('sessions').put(item));
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
