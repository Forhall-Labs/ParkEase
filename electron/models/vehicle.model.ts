export interface Vehicle {
  veh_id?: number;
  veh_owner?: string;
  veh_reference: string;
  veh_plate: string;
  veh_ingress_date: string;
  veh_egress_date?: string;
  veh_status: 'P' | 'S';
  veh_tax: string;
  veh_version: number;
}

export type CreateVehicleDto = Omit<Vehicle, 'veh_id' | 'veh_status' | 'veh_egress_date'>;

export type UpdateVehicleDto = Partial<Omit<Vehicle, 'veh_id'>>;