import { contextBridge, ipcRenderer } from 'electron';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Parameter {
  par_id?: number;
  par_quantity: string;
  par_tax: string;
  version: number;
}

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

export interface SafeUser {
  user_id?: number;
  user_name: string;
  user_lastname: string;
  user_username: string;
  user_email: string;
  user_status: 'A' | 'I';
  user_version: number;
}

export interface LoginDto {
  user_username: string;
  user_password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: SafeUser;
  message?: string;
}

export interface CreateUserDto {
  user_name: string;
  user_lastname: string;
  user_username: string;
  user_password: string;
  user_email: string;
}

export interface UpdateUserDto {
  user_name?: string;
  user_lastname?: string;
  user_username?: string;
  user_email?: string;
  user_status?: 'A' | 'I';
}

export interface CreateVehicleDto {
  veh_owner?: string;
  veh_reference: string;
  veh_plate: string;
  veh_ingress_date: string;
  veh_tax: string;
  veh_version: number;
}

export interface UpdateVehicleDto {
  veh_owner?: string;
  veh_reference?: string;
  veh_plate?: string;
  veh_ingress_date?: string;
  veh_egress_date?: string;
  veh_status?: 'P' | 'S';
  veh_tax?: string;
  veh_version?: number;
}

export interface CreateParameterDto {
  par_quantity: string;
  par_tax: string;
  version: number;
}

export interface UpdateParameterDto {
  par_quantity?: string;
  par_tax?: string;
  version?: number;
}

export interface MutationResult {
  success: boolean;
  message?: string;
  id?: number;
}

// ─── API expuesta a React ─────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Usuarios ─────────────────────────────────────────────────────────────────
  users: {
    getAll: (): Promise<SafeUser[]> => ipcRenderer.invoke('users:getAll'),

    getOne: (id: number): Promise<SafeUser | undefined> => ipcRenderer.invoke('users:getOne', id),

    login: (dto: LoginDto): Promise<LoginResponse> => ipcRenderer.invoke('users:login', dto),

    create: (dto: CreateUserDto): Promise<MutationResult> =>
      ipcRenderer.invoke('users:create', dto),

    update: (id: number, dto: UpdateUserDto): Promise<MutationResult> =>
      ipcRenderer.invoke('users:update', id, dto),

    changePassword: (
      id: number,
      currentPassword: string,
      newPassword: string
    ): Promise<MutationResult> =>
      ipcRenderer.invoke('users:changePassword', id, currentPassword, newPassword),

    deactivate: (id: number): Promise<MutationResult> => ipcRenderer.invoke('users:deactivate', id),

    delete: (id: number): Promise<MutationResult> => ipcRenderer.invoke('users:delete', id),
  },

  // ── Vehículos ────────────────────────────────────────────────────────────────
  vehicles: {
    getAll: (): Promise<Vehicle[]> => ipcRenderer.invoke('vehicles:getAll'),

    getActive: (): Promise<Vehicle[]> => ipcRenderer.invoke('vehicles:getActive'),

    getOne: (id: number): Promise<Vehicle | undefined> => ipcRenderer.invoke('vehicles:getOne', id),

    create: (dto: CreateVehicleDto): Promise<MutationResult> =>
      ipcRenderer.invoke('vehicles:create', dto),

    checkout: (id: number): Promise<MutationResult> => ipcRenderer.invoke('vehicles:checkout', id),

    update: (id: number, dto: UpdateVehicleDto): Promise<MutationResult> =>
      ipcRenderer.invoke('vehicles:update', id, dto),

    delete: (id: number): Promise<MutationResult> => ipcRenderer.invoke('vehicles:delete', id),

    getStats: (): Promise<{ parkedCount: number; todayRevenue: number; todayVehicles: number }> =>
      ipcRenderer.invoke('vehicles:getStats'),

    getParkedCount: (): Promise<number> => ipcRenderer.invoke('vehicles:getParkedCount'),

    getTodayRevenue: (): Promise<number> => ipcRenderer.invoke('vehicles:getTodayRevenue'),

    getTodayVehicles: (): Promise<number> => ipcRenderer.invoke('vehicles:getTodayVehicles'),
  },

  // ── Parámetros ───────────────────────────────────────────────────────────────
  parameters: {
    getAll: (): Promise<Parameter[]> => ipcRenderer.invoke('parameters:getAll'),

    getOne: (id: number): Promise<Parameter | undefined> =>
      ipcRenderer.invoke('parameters:getOne', id),

    create: (dto: CreateParameterDto): Promise<MutationResult> =>
      ipcRenderer.invoke('parameters:create', dto),

    update: (id: number, dto: UpdateParameterDto): Promise<MutationResult> =>
      ipcRenderer.invoke('parameters:update', id, dto),

    delete: (id: number): Promise<MutationResult> => ipcRenderer.invoke('parameters:delete', id),
  },

  // ── Sesión ───────────────────────────────────────────────────────────────────
  session: {
    save: (user: SafeUser): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('session:save', user),

    restore: (): Promise<SafeUser | null> => ipcRenderer.invoke('session:restore'),

    clear: (): Promise<{ success: boolean }> => ipcRenderer.invoke('session:clear'),
  },
});

// ─── Types globales para TypeScript en React ──────────────────────────────────

declare global {
  interface Window {
    electronAPI: {
      users: {
        getAll: () => Promise<SafeUser[]>;
        getOne: (id: number) => Promise<SafeUser | undefined>;
        login: (dto: LoginDto) => Promise<LoginResponse>;
        create: (dto: CreateUserDto) => Promise<MutationResult>;
        update: (id: number, dto: UpdateUserDto) => Promise<MutationResult>;
        changePassword: (
          id: number,
          currentPassword: string,
          newPassword: string
        ) => Promise<MutationResult>;
        deactivate: (id: number) => Promise<MutationResult>;
        delete: (id: number) => Promise<MutationResult>;
      };
      vehicles: {
        getAll: () => Promise<Vehicle[]>;
        getActive: () => Promise<Vehicle[]>;
        getOne: (id: number) => Promise<Vehicle | undefined>;
        create: (dto: CreateVehicleDto) => Promise<MutationResult>;
        checkout: (id: number) => Promise<MutationResult>;
        update: (id: number, dto: UpdateVehicleDto) => Promise<MutationResult>;
        delete: (id: number) => Promise<MutationResult>;
        getStats: () => Promise<{
          parkedCount: number;
          todayRevenue: number;
          todayVehicles: number;
        }>;
        getParkedCount: () => Promise<number>;
        getTodayRevenue: () => Promise<number>;
        getTodayVehicles: () => Promise<number>;
      };
      parameters: {
        getAll: () => Promise<Parameter[]>;
        getOne: (id: number) => Promise<Parameter | undefined>;
        create: (dto: CreateParameterDto) => Promise<MutationResult>;
        update: (id: number, dto: UpdateParameterDto) => Promise<MutationResult>;
        delete: (id: number) => Promise<MutationResult>;
      };
      session: {
        save: (user: SafeUser) => Promise<{ success: boolean }>;
        restore: () => Promise<SafeUser | null>;
        clear: () => Promise<{ success: boolean }>;
      };
    };
  }
}
