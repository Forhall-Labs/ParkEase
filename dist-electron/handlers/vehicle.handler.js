import { ipcMain } from 'electron';
import { getDatabase } from '../database/db.js';
import { getAllVehicles, getActiveVehicles, getVehicleById, registerVehicle, vehicleCheckout, editVehicle, removeVehicle, getReport, } from '../service/vehicle.service.js';
function normalizeReportDate(selectedDate) {
    if (!selectedDate) {
        return new Date().toISOString().slice(0, 10);
    }
    const parsed = new Date(`${selectedDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
        return new Date().toISOString().slice(0, 10);
    }
    return parsed.toISOString().slice(0, 10);
}
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
        // Get today's revenue (sum of transaction_amount for today)
        const today = new Date().toISOString().split('T')[0];
        // Check if transactions table exists, if not return 0
        let todayRevenue = 0;
        try {
            // Get transactions for today (if transactions table exists)
            const transResult = db
                .prepare(`
        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND DATE(veh_egress_date) = ?
      `)
                .get(today);
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
        AND DATE(veh_egress_date) = ?
      `)
                .get(today);
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
        const today = new Date().toISOString().split('T')[0];
        try {
            const result = db
                .prepare(`
        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND DATE(veh_egress_date) = ?
      `)
                .get(today);
            return result?.total || 0;
        }
        catch {
            return 0;
        }
    });
    ipcMain.handle('vehicles:getTodayVehicles', () => {
        const db = getDatabase();
        const today = new Date().toISOString().split('T')[0];
        try {
            const result = db
                .prepare(`
        SELECT COUNT(*) as count 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND DATE(veh_egress_date) = ?
      `)
                .get(today);
            return result?.count || 0;
        }
        catch {
            return 0;
        }
    });
    ipcMain.handle('vehicles:getReport', (_e, period, selectedDate) => {
        const safePeriod = isReportPeriod(period) ? period : 'daily';
        const safeDate = normalizeReportDate(selectedDate);
        return getReport(safePeriod, safeDate);
    });
}
