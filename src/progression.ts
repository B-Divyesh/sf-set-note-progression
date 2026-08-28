import type { Exercise, LoggedSet, Suggestion } from './types';

export const LIMITING_TAGS = ['Grip slipped', 'Form broke'] as const;

export function nextSuggestion(exercise: Exercise, sets: LoggedSet[]): Suggestion {
  const currentLoad = sets[0]?.load ?? 0;
  const hasLimitingChip = sets.some((set) =>
    set.tags.some((tag) => LIMITING_TAGS.includes(tag as (typeof LIMITING_TAGS)[number])),
  );
  const belowRange = sets.some((set) => set.reps < exercise.minReps);
  const everySetAtTop = sets.length === exercise.setCount && sets.every((set) => set.reps >= exercise.maxReps);

  if (hasLimitingChip || belowRange) {
    const cause = hasLimitingChip ? 'a limiting chip was selected' : `a set was below ${exercise.minReps} reps`;
    return {
      decision: 'hold',
      nextLoad: currentLoad,
      title: `Hold at ${formatLoad(currentLoad, exercise.unit)}`,
      reason: `Hold because ${cause}. Repeat the load before adding reps.`,
    };
  }

  if (everySetAtTop) {
    const nextLoad = roundLoad(currentLoad + exercise.increment);
    return {
      decision: 'increase',
      nextLoad,
      title: `Increase to ${formatLoad(nextLoad, exercise.unit)}`,
      reason: `Increase because every set reached ${exercise.maxReps} reps with no limiting chip selected.`,
    };
  }

  return {
    decision: 'add',
    nextLoad: currentLoad,
    title: `Add reps at ${formatLoad(currentLoad, exercise.unit)}`,
    reason: `Keep the load because not every set reached ${exercise.maxReps} reps. Add reps within the range.`,
  };
}

export function ruleText(exercise: Exercise): string {
  return `Increase by ${formatLoad(exercise.increment, exercise.unit)} only when every set reaches ${exercise.maxReps} reps and neither Grip slipped nor Form broke is selected.`;
}

export function formatLoad(load: number, unit: string): string {
  return `${Number(load.toFixed(2))} ${unit}`;
}

function roundLoad(value: number): number {
  return Math.round(value * 100) / 100;
}
