import { describe, it, expect } from 'vitest';
import {
  localDayRange,
  normalizeDateKey,
  shiftDateKey,
  toDateKey,
} from '../../electron/utils/day-range.js';

describe('day-range', () => {
  it('builds the key from the local date, not the UTC one', () => {
    // 23:30 local del 10/03: en UTC-6 ya es el día 11 en UTC.
    const lateNight = new Date(2026, 2, 10, 23, 30, 0, 0);
    expect(toDateKey(lateNight)).toBe('2026-03-10');
  });

  it('covers the whole local day as a half-open UTC range', () => {
    const { start, end } = localDayRange('2026-03-10');

    expect(start).toBe(new Date(2026, 2, 10, 0, 0, 0, 0).toISOString());
    expect(end).toBe(new Date(2026, 2, 11, 0, 0, 0, 0).toISOString());
  });

  it('includes an 18:00 local checkout in that same local day', () => {
    const { start, end } = localDayRange('2026-03-10');
    const sixPm = new Date(2026, 2, 10, 18, 0, 0, 0).toISOString();

    expect(sixPm >= start && sixPm < end).toBe(true);
  });

  it('spans from the first to the last local day of a range', () => {
    const { start, end } = localDayRange('2026-03-04', '2026-03-10');

    expect(start).toBe(new Date(2026, 2, 4, 0, 0, 0, 0).toISOString());
    expect(end).toBe(new Date(2026, 2, 11, 0, 0, 0, 0).toISOString());
  });

  it('shifts keys over month boundaries', () => {
    expect(shiftDateKey('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDateKey('2026-03-10', -6)).toBe('2026-03-04');
  });

  it('falls back to today when the key is missing or invalid', () => {
    expect(normalizeDateKey('2026-03-10')).toBe('2026-03-10');
    expect(normalizeDateKey('2026-13-45')).toBe(toDateKey());
    expect(normalizeDateKey(undefined)).toBe(toDateKey());
  });
});
