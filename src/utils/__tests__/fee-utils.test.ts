import { describe, it, expect } from 'vitest';
import { calculateFeeBreakdown } from '../fee-utils';

describe('calculateFeeBreakdown', () => {
  it('prorates a stay under 60 minutes against the hourly rate (reported bug scenario)', () => {
    // First vehicle of the day/session: ₡2000/hour tariff, parked ~20 minutes.
    // Previously this charged the full ₡2000 (flat first-hour minimum);
    // it must now be prorated: 2000 * 20 / 60 = 666.67 -> ceil -> 667 -> rounded to 700.
    const now = new Date('2026-07-19T12:20:00.000Z');
    const ingressDate = new Date('2026-07-19T12:00:00.000Z').toISOString();

    const result = calculateFeeBreakdown(ingressDate, 2000, now);

    expect(result.durationMinutes).toBe(20);
    expect(result.firstHourCost).toBe(667);
    expect(result.additionalMinutes).toBe(0);
    expect(result.additionalCost).toBe(0);
    expect(result.subtotal).toBe(667);
    expect(result.roundedTotal).toBe(700);
  });

  it('prorates a very short stay (a few minutes) proportionally, not as a full hour', () => {
    const now = new Date('2026-07-19T12:05:00.000Z');
    const ingressDate = new Date('2026-07-19T12:00:00.000Z').toISOString();

    const result = calculateFeeBreakdown(ingressDate, 600, now);

    expect(result.durationMinutes).toBe(5);
    // 600 * 5 / 60 = 50
    expect(result.firstHourCost).toBe(50);
    expect(result.roundedTotal).toBe(50);
  });

  it('charges the full hourly rate for exactly 60 minutes', () => {
    const now = new Date('2026-07-19T13:00:00.000Z');
    const ingressDate = new Date('2026-07-19T12:00:00.000Z').toISOString();

    const result = calculateFeeBreakdown(ingressDate, 1500, now);

    expect(result.durationMinutes).toBe(60);
    expect(result.firstHourCost).toBe(1500);
    expect(result.additionalMinutes).toBe(0);
    expect(result.additionalCost).toBe(0);
  });

  it('charges the full first hour plus a flat ₡10/minute beyond it', () => {
    const now = new Date('2026-07-19T13:30:00.000Z');
    const ingressDate = new Date('2026-07-19T12:00:00.000Z').toISOString();

    const result = calculateFeeBreakdown(ingressDate, 1500, now);

    expect(result.durationMinutes).toBe(90);
    expect(result.firstHourCost).toBe(1500);
    expect(result.additionalMinutes).toBe(30);
    expect(result.additionalCost).toBe(300);
    expect(result.subtotal).toBe(1800);
    expect(result.roundedTotal).toBe(1800);
  });

  it('rounds the total up to the nearest ₡50', () => {
    const now = new Date('2026-07-19T12:37:00.000Z');
    const ingressDate = new Date('2026-07-19T12:00:00.000Z').toISOString();

    const result = calculateFeeBreakdown(ingressDate, 1000, now);

    expect(result.durationMinutes).toBe(37);
    // 1000 * 37 / 60 = 616.67 -> ceil -> 617 -> rounded up to 650
    expect(result.firstHourCost).toBe(617);
    expect(result.roundedTotal).toBe(650);
  });

  it('never charges for less than 1 minute of parking', () => {
    const now = new Date('2026-07-19T12:00:10.000Z');
    const ingressDate = new Date('2026-07-19T12:00:00.000Z').toISOString();

    const result = calculateFeeBreakdown(ingressDate, 600, now);

    expect(result.durationMinutes).toBe(1);
    expect(result.firstHourCost).toBe(10);
  });
});
