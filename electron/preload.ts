import { contextBridge, ipcRenderer } from 'electron';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface PsmParameter {
  par_id?: number;
  par_quantity: string;
  par_tax: string;
  version: number;
}

export interface PsmVehicle {
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

// ─── API expuesta a React ─────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronAPI', {

  // ── Parámetros ──────────────────────────────────────────────────────────────
  parameters: {
    getAll: (): Promise<PsmParameter[]> =>
      ipcRenderer.invoke('parameters:getAll'),

    getOne: (id: number): Promise<PsmParameter | undefined> =>
      ipcRenderer.invoke('parameters:getOne', id),

    create: (data: Omit<PsmParameter, 'par_id'>): Promise<{ id: number }> =>
      ipcRenderer.invoke('parameters:create', data),

    update: (id: number, data: Omit<PsmParameter, 'par_id'>): Promise<{ changes: number }> =>
      ipcRenderer.invoke('parameters:update', id, data),

    delete: (id: number): Promise<{ changes: number }> =>
      ipcRenderer.invoke('parameters:delete', id),
  },

  // ── Vehículos ────────────────────────────────────────────────────────────────
  vehicles: {
    getAll: (): Promise<PsmVehicle[]> =>
      ipcRenderer.invoke('vehicles:getAll'),

    getActive: (): Promise<PsmVehicle[]> =>
      ipcRenderer.invoke('vehicles:getActive'),

    getOne: (id: number): Promise<PsmVehicle | undefined> =>
      ipcRenderer.invoke('vehicles:getOne', id),

    create: (data: Omit<PsmVehicle, 'veh_id' | 'veh_status' | 'veh_egress_date'>): Promise<{ id: number }> =>
      ipcRenderer.invoke('vehicles:create', data),

    checkout: (id: number, egress_date: string): Promise<{ changes: number }> =>
      ipcRenderer.invoke('vehicles:checkout', id, egress_date),

    delete: (id: number): Promise<{ changes: number }> =>
      ipcRenderer.invoke('vehicles:delete', id),
  },

});

// ─── Types para TypeScript en React ──────────────────────────────────────────
// Esto le dice a TypeScript que window.electronAPI existe

declare global {
  interface Window {
    electronAPI: {
      parameters: {
        getAll: () => Promise<PsmParameter[]>;
        getOne: (id: number) => Promise<PsmParameter | undefined>;
        create: (data: Omit<PsmParameter, 'par_id'>) => Promise<{ id: number }>;
        update: (id: number, data: Omit<PsmParameter, 'par_id'>) => Promise<{ changes: number }>;
        delete: (id: number) => Promise<{ changes: number }>;
      };
      vehicles: {
        getAll: () => Promise<PsmVehicle[]>;
        getActive: () => Promise<PsmVehicle[]>;
        getOne: (id: number) => Promise<PsmVehicle | undefined>;
        create: (data: Omit<PsmVehicle, 'veh_id' | 'veh_status' | 'veh_egress_date'>) => Promise<{ id: number }>;
        checkout: (id: number, egress_date: string) => Promise<{ changes: number }>;
        delete: (id: number) => Promise<{ changes: number }>;
      };
    };
  }
}