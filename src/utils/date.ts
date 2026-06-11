import { Anniversary } from '../types';

/**
 * Calculates absolute day gap between two dates ignoring the year,
 * or calculates based on actual target years surrounding the current date.
 */
export function getClosestAnniversaryIndex(anniversaries: Anniversary[], currentDate: Date): number {
  if (anniversaries.length === 0) return 0;

  const currentYear = currentDate.getFullYear();
  let minDiff = Infinity;
  let closestIndex = 0;

  anniversaries.forEach((ann, index) => {
    // Generate dates in previous, current, and next year to handle wrapping correctly
    const dates = [
      new Date(currentYear - 1, ann.month - 1, ann.day),
      new Date(currentYear, ann.month - 1, ann.day),
      new Date(currentYear + 1, ann.month - 1, ann.day)
    ];

    dates.forEach((d) => {
      const diff = Math.abs(d.getTime() - currentDate.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });
  });

  return closestIndex;
}
