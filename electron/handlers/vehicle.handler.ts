import { ipcMain } from 'electron';
import { getDatabase } from '../database/db.js';
import {
  getAllVehicles,
  getActiveVehicles,
  getVehicleById,
  registerVehicle,
  vehicleCheckout,
  editVehicle,
  removeVehicle,
} from '../service/vehicle.service.js';
import { CreateVehicleDto, UpdateVehicleDto } from '../models/vehicle.model.js';

export interface DashboardStats {
  parkedCount: number;
  todayRevenue: number;
  todayVehicles: number;
}

export function registerVehicleHandlers(): void {
  ipcMain.handle('vehicles:getAll', () => {
    return getAllVehicles();
  });

  ipcMain.handle('vehicles:getActive', () => {
    return getActiveVehicles();
  });

  ipcMain.handle('vehicles:getOne', (_e, id: number) => {
    return getVehicleById(id);
  });

  ipcMain.handle('vehicles:create', (_e, dto: CreateVehicleDto) => {
    return registerVehicle(dto);
  });

  ipcMain.handle('vehicles:checkout', (_e, id: number) => {
    return vehicleCheckout(id);
  });

  ipcMain.handle('vehicles:update', (_e, id: number, dto: UpdateVehicleDto) => {
    return editVehicle(id, dto);
  });

  ipcMain.handle('vehicles:delete', (_e, id: number) => {
    return removeVehicle(id);
  });

  // Dashboard statistics
  ipcMain.handle('vehicles:getStats', (): DashboardStats => {
    const db = getDatabase();

    // Count parked vehicles (status = 'P')
    const parkedResult = db
      .prepare("SELECT COUNT(*) as count FROM psm_vehicles WHERE veh_status = 'P'")
      .get() as { count: number };
    const parkedCount = parkedResult.count;

    // Get today's revenue (sum of transaction_amount for today)
    const today = new Date().toISOString().split('T')[0];

    // Check if transactions table exists, if not return 0
    let todayRevenue = 0;
    try {
      // Get transactions for today (if transactions table exists)
      const transResult = db
        .prepare(
          `
        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND DATE(veh_egress_date) = ?
      `
        )
        .get(today) as { total: number };
      todayRevenue = transResult?.total || 0;
    } catch {
      // Table doesn't exist yet
      todayRevenue = 0;
    }

    // Count vehicles served today (vehicles with exit)
    let todayVehicles = 0;
    try {
      const servedResult = db
        .prepare(
          `
        SELECT COUNT(*) as count 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND DATE(veh_egress_date) = ?
      `
        )
        .get(today) as { count: number };
      todayVehicles = servedResult.count;
    } catch {
      todayVehicles = 0;
    }

    return { parkedCount, todayRevenue, todayVehicles };
  });

  ipcMain.handle('vehicles:getParkedCount', (): number => {
    const db = getDatabase();
    const result = db
      .prepare("SELECT COUNT(*) as count FROM psm_vehicles WHERE veh_status = 'P'")
      .get() as { count: number };
    return result.count;
  });

  ipcMain.handle('vehicles:getTodayRevenue', (): number => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];

    try {
      const result = db
        .prepare(
          `
        SELECT COALESCE(SUM(CAST(veh_tax AS REAL)), 0) as total 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND DATE(veh_egress_date) = ?
      `
        )
        .get(today) as { total: number };
      return result?.total || 0;
    } catch {
      return 0;
    }
  });

  ipcMain.handle('vehicles:getTodayVehicles', (): number => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];

    try {
      const result = db
        .prepare(
          `
        SELECT COUNT(*) as count 
        FROM psm_vehicles 
        WHERE veh_status = 'S' 
        AND DATE(veh_egress_date) = ?
      `
        )
        .get(today) as { count: number };
      return result?.count || 0;
    } catch {
      return 0;
    }
  });
}
