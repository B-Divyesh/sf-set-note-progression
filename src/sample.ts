import type { Exercise, Session } from './types';
import { nextSuggestion } from './progression';

const createdAt = '2026-08-24T18:10:00.000Z';

export const sampleExercises: Exercise[] = [
  { id: 'ex-bench', name: 'Barbell bench press', minReps: 8, maxReps: 12, setCount: 3, increment: 2.5, unit: 'kg', createdAt },
  { id: 'ex-row', name: 'Chest-supported row', minReps: 10, maxReps: 15, setCount: 3, increment: 5, unit: 'kg', createdAt },
  { id: 'ex-squat', name: 'Goblet squat', minReps: 8, maxReps: 12, setCount: 3, increment: 2, unit: 'kg', createdAt },
];

const bench = sampleExercises[0];
const row = sampleExercises[1];

export const sampleSessions: Session[] = [
  {
    id: 'session-bench-2', exerciseId: bench.id, exerciseName: bench.name,
    completedAt: '2026-08-27T18:42:00.000Z', minReps: 8, maxReps: 12, increment: 2.5, unit: 'kg',
    sets: [
      { load: 60, reps: 12, tags: ['Clean reps'], note: 'Two reps left in reserve.' },
      { load: 60, reps: 12, tags: ['Paused'], note: '' },
      { load: 60, reps: 12, tags: ['Felt easy'], note: 'Same setup next time.' },
    ],
    suggestion: nextSuggestion(bench, [
      { load: 60, reps: 12, tags: ['Clean reps'], note: 'Two reps left in reserve.' },
      { load: 60, reps: 12, tags: ['Paused'], note: '' },
      { load: 60, reps: 12, tags: ['Felt easy'], note: 'Same setup next time.' },
    ]),
  },
  {
    id: 'session-row-1', exerciseId: row.id, exerciseName: row.name,
    completedAt: '2026-08-25T17:30:00.000Z', minReps: 10, maxReps: 15, increment: 5, unit: 'kg',
    sets: [
      { load: 45, reps: 15, tags: ['Clean reps'], note: '' },
      { load: 45, reps: 13, tags: ['Grip slipped'], note: 'Use straps only if grip slips again.' },
      { load: 45, reps: 12, tags: [], note: '' },
    ],
    suggestion: nextSuggestion(row, [
      { load: 45, reps: 15, tags: ['Clean reps'], note: '' },
      { load: 45, reps: 13, tags: ['Grip slipped'], note: 'Use straps only if grip slips again.' },
      { load: 45, reps: 12, tags: [], note: '' },
    ]),
  },
];
