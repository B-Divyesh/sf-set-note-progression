import { describe, expect, it } from 'vitest';
import { formatLoad, nextSuggestion } from '../src/progression';
import type { Exercise, LoggedSet } from '../src/types';

const exercise: Exercise = {
  id: 'press', name: 'Press', minReps: 8, maxReps: 12, setCount: 3,
  increment: 2.5, unit: 'kg', createdAt: '2026-08-28T00:00:00.000Z',
};

const sets = (reps: number[], tags: string[] = []): LoggedSet[] => reps.map((count, index) => ({
  load: 60, reps: count, tags: index === 1 ? tags : [], note: '',
}));

describe('double progression', () => {
  it('increases only when every set reaches the top', () => {
    expect(nextSuggestion(exercise, sets([12, 12, 12]))).toMatchObject({ decision: 'increase', nextLoad: 62.5 });
  });

  it('adds reps when sets remain inside the range', () => {
    expect(nextSuggestion(exercise, sets([12, 11, 10]))).toMatchObject({ decision: 'add', nextLoad: 60 });
  });

  it('holds when a set is below the range', () => {
    expect(nextSuggestion(exercise, sets([12, 10, 7]))).toMatchObject({ decision: 'hold', nextLoad: 60 });
  });

  it('holds when a limiting note is logged', () => {
    expect(nextSuggestion(exercise, sets([12, 12, 12], ['Grip slipped']))).toMatchObject({ decision: 'hold', nextLoad: 60 });
  });

  it('shows quarter-unit loads without rounding them to tenths', () => {
    expect(formatLoad(60.25, 'kg')).toBe('60.25 kg');
    expect(formatLoad(62.5, 'kg')).toBe('62.5 kg');
  });

  it('does not describe saved-only detail text as a rule input', () => {
    const detailed = sets([12, 12, 12]);
    detailed[1].note = 'Grip slipped badly';
    expect(nextSuggestion(exercise, detailed)).toMatchObject({
      decision: 'increase',
      reason: 'Increase because every set reached 12 reps with no limiting chip selected.',
    });
  });
});
