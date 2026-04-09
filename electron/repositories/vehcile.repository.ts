import { getDatabase } from '../database/db.js';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../models/vehicle.model.js';

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

export function findVehicleByPlate(plate: string): Vehicle | undefined {
  return getDatabase().prepare('SELECT * FROM psm_vehicles WHERE veh_plate = ?').get(plate) as
    | Vehicle
    | undefined;
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
