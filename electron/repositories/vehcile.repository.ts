import { getDatabase } from '../database/db.js';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../models/vehicle.model.js';

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface VehicleReportRow {
  veh_id: number;
  veh_plate: string;
  veh_owner: string | null;
  veh_ingress_date: string;
  veh_egress_date: string;
  veh_tax: string;
}

export interface VehicleReportResult {
  period: ReportPeriod;
  rangeStart: string;
  rangeEnd: string;
  totalVehicles: number;
  totalRevenue: number;
  rows: VehicleReportRow[];
}

const REPORT_WINDOW_DAYS: Record<ReportPeriod, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

function isReportPeriod(value: string): value is ReportPeriod {
  return value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'yearly';
}

function normalizeDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

function getReportRange(period: ReportPeriod, selectedDate: string): { rangeStart: string; rangeEnd: string } {
  const rangeEnd = normalizeDate(selectedDate);
  const endDate = new Date(`${rangeEnd}T00:00:00Z`);
  const windowDays = REPORT_WINDOW_DAYS[period];
  const startDate = new Date(endDate);

  startDate.setUTCDate(endDate.getUTCDate() - (windowDays - 1));

  return {
    rangeStart: startDate.toISOString().slice(0, 10),
    rangeEnd,
  };
}

export function findVehicleReport(period: string, selectedDate: string): VehicleReportResult {
  const reportPeriod: ReportPeriod = isReportPeriod(period) ? period : 'daily';
  const { rangeStart, rangeEnd } = getReportRange(reportPeriod, selectedDate);
  const db = getDatabase();

  const rows = db
    .prepare(
      `
      SELECT
        veh_id,
        veh_plate,
        veh_owner,
        veh_ingress_date,
        veh_egress_date,
        veh_tax
      FROM psm_vehicles
      WHERE veh_status = 'S'
        AND veh_egress_date IS NOT NULL
        AND DATE(veh_egress_date) BETWEEN @rangeStart AND @rangeEnd
      ORDER BY veh_egress_date DESC, veh_id DESC
    `
    )
    .all({ rangeStart, rangeEnd }) as VehicleReportRow[];

  const aggregates = db
    .prepare(
      `
      SELECT
        COUNT(*) AS totalVehicles,
        COALESCE(SUM(CAST(veh_tax AS REAL)), 0) AS totalRevenue
      FROM psm_vehicles
      WHERE veh_status = 'S'
        AND veh_egress_date IS NOT NULL
        AND DATE(veh_egress_date) BETWEEN @rangeStart AND @rangeEnd
    `
    )
    .get({ rangeStart, rangeEnd }) as { totalVehicles: number; totalRevenue: number } | undefined;

  return {
    period: reportPeriod,
    rangeStart,
    rangeEnd,
    totalVehicles: aggregates?.totalVehicles ?? rows.length,
    totalRevenue: Number(aggregates?.totalRevenue ?? 0),
    rows,
  };
}

export function findAllVehicles(): Vehicle[] {
  return getDatabase()
    .prepare('SELECT * FROM psm_vehicles ORDER BY veh_ingress_date DESC')
    .all() as Vehicle[];
}

export function findActiveVehicles(): Vehicle[] {
  return getDatabase()
    .prepare(
      `
      SELECT * FROM psm_vehicles
      WHERE veh_status = 'P'
      ORDER BY veh_ingress_date DESC
    `
    )
    .all() as Vehicle[];
}

export function findVehicleById(id: number): Vehicle | undefined {
  return getDatabase().prepare('SELECT * FROM psm_vehicles WHERE veh_id = ?').get(id) as
    | Vehicle
    | undefined;
}

export function findActiveVehicleByPlate(plate: string): Vehicle | undefined {
  return getDatabase()
    .prepare("SELECT * FROM psm_vehicles WHERE veh_plate = ? AND veh_status = 'P'")
    .get(plate) as Vehicle | undefined;
}

export function findVehicleByReference(reference: string): Vehicle | undefined {
  return getDatabase()
    .prepare('SELECT * FROM psm_vehicles WHERE veh_reference = ?')
    .get(reference) as Vehicle | undefined;
}

export function createVehicle(data: CreateVehicleDto): number {
  const result = getDatabase()
    .prepare(
      `
      INSERT INTO psm_vehicles
        (veh_owner, veh_reference, veh_plate, veh_ingress_date, veh_tax, veh_version, veh_status)
      VALUES
        (@veh_owner, @veh_reference, @veh_plate, @veh_ingress_date, @veh_tax, @veh_version, 'P')
    `
    )
    .run(data);

  return result.lastInsertRowid as number;
}

export function checkoutVehicle(id: number, egress_date: string, total?: string): number {
  const result = getDatabase()
    .prepare(
      `
      UPDATE psm_vehicles
      SET veh_status      = 'S',
          veh_egress_date = @egress_date,
          veh_tax         = COALESCE(@total, veh_tax),
          veh_version     = veh_version + 1
      WHERE veh_id = @id AND veh_status = 'P'
    `
    )
    .run({ egress_date, id, total: total || null });

  return result.changes;
}

export function updateVehicle(id: number, data: UpdateVehicleDto): number {
  const fields = Object.keys(data)
    .map((key) => `${key} = @${key}`)
    .join(', ');

  const result = getDatabase()
    .prepare(`UPDATE psm_vehicles SET ${fields} WHERE veh_id = @id`)
    .run({ ...data, id });

  return result.changes;
}

export function deleteVehicle(id: number): number {
  const result = getDatabase().prepare('DELETE FROM psm_vehicles WHERE veh_id = ?').run(id);

  return result.changes;
}
