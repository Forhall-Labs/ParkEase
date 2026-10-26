import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from './setup.js';
import { getDatabase } from '../../electron/database/db.js';
import { findVehicleReport } from '../../electron/repositories/vehcile.repository.js';
import { toDateKey } from '../../electron/utils/day-range.js';

function checkedOutAt(local: Date, tax: string): void {
  getDatabase()
    .prepare(
      `
      INSERT INTO psm_vehicles
        (veh_owner, veh_reference, veh_plate, veh_ingress_date, veh_egress_date, veh_status, veh_tax, veh_version)
      VALUES
        ('Test', @ref, 'ABC-123', @ingress, @egress, 'S', @tax, 1)
    `
    )
    .run({
      ref: `VEH-${local.getTime()}`,
      ingress: new Date(local.getTime() - 60 * 60 * 1000).toISOString(),
      egress: local.toISOString(),
      tax,
    });
}

describe('findVehicleReport', () => {
  beforeEach(() => {
    createTestDb();
  });

  it('keeps evening checkouts inside the same local day', () => {
    const today = new Date();
    const sixPm = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 30, 0, 0);
    checkedOutAt(sixPm, '700');

    const report = findVehicleReport('daily', toDateKey(today));

    expect(report.totalVehicles).toBe(1);
    expect(report.totalRevenue).toBe(700);
  });

  it('leaves out checkouts that belong to the next local day', () => {
    const today = new Date();
    const tomorrowMorning = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      30,
      0,
      0
    );
    checkedOutAt(tomorrowMorning, '1200');

    const report = findVehicleReport('daily', toDateKey(today));

    expect(report.totalVehicles).toBe(0);
    expect(report.totalRevenue).toBe(0);
  });
});
