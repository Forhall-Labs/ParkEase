import { ipcMain } from 'electron';
import { getDatabase } from '../database/db.js';
import { getAllVehicles, getActiveVehicles, getVehicleById, registerVehicle, vehicleCheckout, editVehicle, removeVehicle, getReport, } from '../service/vehicle.service.js';
import { localDayRange, normalizeDateKey, toDateKey } from '../utils/day-range.js';
function isReportPeriod(value) {
    return value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'yearly';
}
export function registerVehicleHandlers() {
    ipcMain.handle('vehicles:getAll', () => {
        return getAllVehicles();
    });
    ipcMain.handle('vehicles:getActive', () => {
        return getActiveVehicles();
    });
    ipcMain.handle('vehicles:getOne', (_e, id) => {
        return getVehicleById(id);
    });
    ipcMain.handle('vehicles:create', (_e, dto) => {
        return registerVehicle(dto);
    });
    ipcMain.handle('vehicles:checkout', (_e, id, total) => {
        return vehicleCheckout(id, total);
    });
    ipcMain.handle('vehicles:update', (_e, id, dto) => {
        return editVehicle(id, dto);
    });
    ipcMain.handle('vehicles:delete', (_e, id) => {
        return removeVehicle(id);
    });
    // Dashboard statistics
    ipcMain.handle('vehicles:getStats', () => {
        const db = getDatabase();
        // Count parked vehicles (status = 'P')
        const parkedResult = db
            .prepare("SELECT COUNT(*) as count FROM psm_vehicles WHERE veh_status = 'P'")
            .get();
        const parkedCount = parkedResult.count;
        // Totales del día operativo: medianoche local a medianoche local
        const { start, end } = localDayRange(toDateKey());
        // Check if transactions table exists, if not return 0
        let todayRevenue = 0;
        try {
            // Get transactions for today (if transactions table exists)
            const transResult = db
                .prepare(`
        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND veh_egress_date >= ?
        AND veh_egress_date < ?
      `)
                .get(start, end);
            todayRevenue = transResult?.total || 0;
        }
        catch {
            // Table doesn't exist yet
            todayRevenue = 0;
        }
        // Count vehicles served today (vehicles with exit)
        let todayVehicles = 0;
        try {
            const servedResult = db
                .prepare(`
        SELECT COUNT(*) as count 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND veh_egress_date >= ?
        AND veh_egress_date < ?
      `)
                .get(start, end);
            todayVehicles = servedResult.count;
        }
        catch {
            todayVehicles = 0;
        }
        return { parkedCount, todayRevenue, todayVehicles };
    });
    ipcMain.handle('vehicles:getParkedCount', () => {
        const db = getDatabase();
        const result = db
            .prepare("SELECT COUNT(*) as count FROM psm_vehicles WHERE veh_status = 'P'")
            .get();
        return result.count;
    });
    ipcMain.handle('vehicles:getTodayRevenue', () => {
        const db = getDatabase();
        const { start, end } = localDayRange(toDateKey());
        try {
            const result = db
                .prepare(`
        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND veh_egress_date >= ?
        AND veh_egress_date < ?
      `)
                .get(start, end);
            return result?.total || 0;
        }
        catch {
            return 0;
        }
    });
    ipcMain.handle('vehicles:getTodayVehicles', () => {
        const db = getDatabase();
        const { start, end } = localDayRange(toDateKey());
        try {
            const result = db
                .prepare(`
        SELECT COUNT(*) as count 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND veh_egress_date >= ?
        AND veh_egress_date < ?
      `)
                .get(start, end);
            return result?.count || 0;
        }
        catch {
            return 0;
        }
    });
    ipcMain.handle('vehicles:getReport', (_e, period, selectedDate) => {
        const safePeriod = isReportPeriod(period) ? period : 'daily';
        const safeDate = normalizeDateKey(selectedDate);
        return getReport(safePeriod, safeDate);
    });
}
