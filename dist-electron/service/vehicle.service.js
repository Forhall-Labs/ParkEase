import { findAllVehicles, findActiveVehicles, findVehicleById, findVehicleByPlate, findVehicleByReference, createVehicle, checkoutVehicle, updateVehicle, deleteVehicle, findVehicleReport, } from '../repositories/vehcile.repository.js';
// ─── Queries ──────────────────────────────────────────────────────────────────
export function getAllVehicles() {
    return findAllVehicles();
}
export function getActiveVehicles() {
    return findActiveVehicles();
}
export function getVehicleById(id) {
    return findVehicleById(id);
}
// ─── Registrar ingreso ────────────────────────────────────────────────────────
export function registerVehicle(dto) {
    // Validar placa duplicada
    const byPlate = findVehicleByPlate(dto.veh_plate);
    if (byPlate && byPlate.veh_status === 'P') {
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
export function vehicleCheckout(id, total) {
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
export function editVehicle(id, dto) {
    const existing = findVehicleById(id);
    if (!existing) {
        return { success: false, message: 'Vehículo no encontrado.' };
    }
    // Validar placa duplicada con otro vehículo
    if (dto.veh_plate) {
        const byPlate = findVehicleByPlate(dto.veh_plate);
        if (byPlate && byPlate.veh_id !== id) {
            return { success: false, message: `La placa ${dto.veh_plate} ya está registrada.` };
        }
    }
    updateVehicle(id, dto);
    return { success: true };
}
// ─── Eliminar ─────────────────────────────────────────────────────────────────
export function removeVehicle(id) {
    const existing = findVehicleById(id);
    if (!existing) {
        return { success: false, message: 'Vehículo no encontrado.' };
    }
    deleteVehicle(id);
    return { success: true };
}
export function getReport(period, selectedDate) {
    return findVehicleReport(period, selectedDate);
}
