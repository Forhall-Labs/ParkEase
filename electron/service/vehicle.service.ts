import {
  findAllVehicles,
  findActiveVehicles,
  findVehicleById,
  findActiveVehicleByPlate,
  findVehicleByReference,
  createVehicle,
  checkoutVehicle,
  updateVehicle,
  deleteVehicle,
  findVehicleReport,
  type VehicleReportResult,
} from '../repositories/vehcile.repository.js';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../models/vehicle.model.js';

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getAllVehicles(): Vehicle[] {
  return findAllVehicles();
}

export function getActiveVehicles(): Vehicle[] {
  return findActiveVehicles();
}

export function getVehicleById(id: number): Vehicle | undefined {
  return findVehicleById(id);
}

// ─── Registrar ingreso ────────────────────────────────────────────────────────

export function registerVehicle(dto: CreateVehicleDto): {
  success: boolean;
  message?: string;
  id?: number;
} {
  // Validar placa activa duplicada (misma placa puede reingresar si ya salió)
  const byPlate = findActiveVehicleByPlate(dto.veh_plate);
  if (byPlate) {
    return { success: false, message: `La placa ${dto.veh_plate} ya tiene un ingreso activo.` };
  }

  // Validar referencia duplicada
  const byReference = findVehicleByReference(dto.veh_reference);
  if (byReference) {
    return { success: false, message: `La referencia ${dto.veh_reference} ya existe.` };
  }

  const id = createVehicle(dto);
  return { success: true, id };
}

// ─── Registrar salida ─────────────────────────────────────────────────────────

export function vehicleCheckout(
  id: number,
  total?: string
): { success: boolean; message?: string } {
  const vehicle = findVehicleById(id);

  if (!vehicle) {
    return { success: false, message: 'Vehículo no encontrado.' };
  }

  if (vehicle.veh_status === 'S') {
    return { success: false, message: 'El vehículo ya registró su salida.' };
  }

  const egress_date = new Date().toISOString();
  const changes = checkoutVehicle(id, egress_date, total);

  if (changes === 0) {
    return { success: false, message: 'No se pudo registrar la salida.' };
  }

  return { success: true };
}

// ─── Actualizar ───────────────────────────────────────────────────────────────

export function editVehicle(
  id: number,
  dto: UpdateVehicleDto
): { success: boolean; message?: string } {
  const existing = findVehicleById(id);
  if (!existing) {
    return { success: false, message: 'Vehículo no encontrado.' };
  }

  // Bloquear si otra sesión activa tiene la misma placa
  if (dto.veh_plate) {
    const byPlate = findActiveVehicleByPlate(dto.veh_plate);
    if (byPlate && byPlate.veh_id !== id) {
      return { success: false, message: `La placa ${dto.veh_plate} ya tiene un ingreso activo.` };
    }
  }

  updateVehicle(id, dto);
  return { success: true };
}

// ─── Eliminar ─────────────────────────────────────────────────────────────────

export function removeVehicle(id: number): { success: boolean; message?: string } {
  const existing = findVehicleById(id);
  if (!existing) {
    return { success: false, message: 'Vehículo no encontrado.' };
  }

  deleteVehicle(id);
  return { success: true };
}

export function getReport(period: string, selectedDate: string): VehicleReportResult {
  return findVehicleReport(period, selectedDate);
}

export type { ReportPeriod, VehicleReportRow, VehicleReportResult } from '../repositories/vehcile.repository.js';
