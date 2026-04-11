import { getDatabase } from '../database/db.js';
const REPORT_WINDOW_DAYS = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365,
};
function isReportPeriod(value) {
    return value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'yearly';
}
function normalizeDate(value) {
    const parsed = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
        return new Date().toISOString().slice(0, 10);
    }
    return parsed.toISOString().slice(0, 10);
}
function getReportRange(period, selectedDate) {
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
export function findVehicleReport(period, selectedDate) {
    const reportPeriod = isReportPeriod(period) ? period : 'daily';
    const { rangeStart, rangeEnd } = getReportRange(reportPeriod, selectedDate);
    const db = getDatabase();
    const rows = db
        .prepare(`
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
    `)
        .all({ rangeStart, rangeEnd });
    const aggregates = db
        .prepare(`
      SELECT
        COUNT(*) AS totalVehicles,
        COALESCE(SUM(CAST(veh_tax AS REAL)), 0) AS totalRevenue
      FROM psm_vehicles
      WHERE veh_status = 'S'
        AND veh_egress_date IS NOT NULL
        AND DATE(veh_egress_date) BETWEEN @rangeStart AND @rangeEnd
    `)
        .get({ rangeStart, rangeEnd });
    return {
        period: reportPeriod,
        rangeStart,
        rangeEnd,
        totalVehicles: aggregates?.totalVehicles ?? rows.length,
        totalRevenue: Number(aggregates?.totalRevenue ?? 0),
        rows,
    };
}
export function findAllVehicles() {
    return getDatabase()
        .prepare('SELECT * FROM psm_vehicles ORDER BY veh_ingress_date DESC')
        .all();
}
export function findActiveVehicles() {
    return getDatabase()
        .prepare(`
      SELECT * FROM psm_vehicles
      WHERE veh_status = 'P'
      ORDER BY veh_ingress_date DESC
    `)
        .all();
}
export function findVehicleById(id) {
    return getDatabase().prepare('SELECT * FROM psm_vehicles WHERE veh_id = ?').get(id);
}
export function findVehicleByPlate(plate) {
    return getDatabase().prepare('SELECT * FROM psm_vehicles WHERE veh_plate = ?').get(plate);
}
export function findVehicleByReference(reference) {
    return getDatabase()
        .prepare('SELECT * FROM psm_vehicles WHERE veh_reference = ?')
        .get(reference);
}
export function createVehicle(data) {
    const result = getDatabase()
        .prepare(`
      INSERT INTO psm_vehicles
        (veh_owner, veh_reference, veh_plate, veh_ingress_date, veh_tax, veh_version, veh_status)
      VALUES
        (@veh_owner, @veh_reference, @veh_plate, @veh_ingress_date, @veh_tax, @veh_version, 'P')
    `)
        .run(data);
    return result.lastInsertRowid;
}
export function checkoutVehicle(id, egress_date, total) {
    const result = getDatabase()
        .prepare(`
      UPDATE psm_vehicles
      SET veh_status      = 'S',
          veh_egress_date = @egress_date,
          veh_tax         = COALESCE(@total, veh_tax),
          veh_version     = veh_version + 1
      WHERE veh_id = @id AND veh_status = 'P'
    `)
        .run({ egress_date, id, total: total || null });
    return result.changes;
}
export function updateVehicle(id, data) {
    const fields = Object.keys(data)
        .map((key) => `${key} = @${key}`)
        .join(', ');
    const result = getDatabase()
        .prepare(`UPDATE psm_vehicles SET ${fields} WHERE veh_id = @id`)
        .run({ ...data, id });
    return result.changes;
}
export function deleteVehicle(id) {
    const result = getDatabase().prepare('DELETE FROM psm_vehicles WHERE veh_id = ?').run(id);
    return result.changes;
}
