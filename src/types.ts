export type Unit = 'kg' | 'lb';

export interface Exercise {
  id: string;
  name: string;
  minReps: number;
  maxReps: number;
  setCount: number;
  increment: number;
  unit: Unit;
  createdAt: string;
}

export interface LoggedSet {
  load: number;
  reps: number;
  tags: string[];
  note: string;
}

export type Decision = 'hold' | 'add' | 'increase';

export interface Suggestion {
  decision: Decision;
  nextLoad: number;
  title: string;
  reason: string;
}

export interface Session {
  id: string;
  exerciseId: string;
  exerciseName: string;
  completedAt: string;
  minReps: number;
  maxReps: number;
  increment: number;
  unit: Unit;
  sets: LoggedSet[];
  suggestion: Suggestion;
}

export interface Backup {
  format: 'set-note-progression';
  version: 1;
  exportedAt: string;
  exercises: Exercise[];
  sessions: Session[];
}

export interface EncryptedBackup {
  format: 'set-note-progression-encrypted';
  version: 1;
  algorithm: 'AES-GCM';
  iterations: number;
  salt: string;
  iv: string;
  data: string;
}
