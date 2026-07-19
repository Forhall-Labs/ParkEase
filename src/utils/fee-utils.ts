export interface FeeBreakdown {
  entryTime: Date;
  exitTime: Date;
  durationMinutes: number;
  firstHourCost: number;
  additionalMinutes: number;
  additionalCost: number;
  subtotal: number;
  roundedTotal: number;
}

const ADDITIONAL_MINUTE_RATE = 10;
const ROUNDING_STEP = 50;

/**
 * First 60 minutes are prorated against the configured hourly rate (e.g. a
 * ₡2000/hour tariff charges ₡667 for a 20-minute stay, not the full ₡2000).
 * Minutes beyond the first hour keep the flat ADDITIONAL_MINUTE_RATE.
 */
export function calculateFeeBreakdown(
  ingressDate: string,
  hourlyRate: number,
  now: Date = new Date()
): FeeBreakdown {
  const entryTime = new Date(ingressDate);
  const exitTime = now;
  const totalMinutes = Math.ceil((exitTime.getTime() - entryTime.getTime()) / (1000 * 60));
  const durationMinutes = Math.max(1, totalMinutes);

  const firstHourMinutes = Math.min(durationMinutes, 60);
  const firstHourCost = Math.ceil((hourlyRate * firstHourMinutes) / 60);

  const additionalMinutes = Math.max(0, durationMinutes - 60);
  const additionalCost = additionalMinutes * ADDITIONAL_MINUTE_RATE;

  const subtotal = firstHourCost + additionalCost;
  const roundedTotal = Math.ceil(subtotal / ROUNDING_STEP) * ROUNDING_STEP;

  return {
    entryTime,
    exitTime,
    durationMinutes,
    firstHourCost,
    additionalMinutes,
    additionalCost,
    subtotal,
    roundedTotal,
  };
}
