export interface SafeUser {
  user_id?: number;
  user_name: string;
  user_lastname: string;
  user_username: string;
  user_email: string;
  user_status: 'A' | 'I';
  user_role: 'admin' | 'user';
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

export interface MutationResult {
  success: boolean;
  message?: string;
  id?: number;
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

export interface Parameter {
  par_id?: number;
  par_name: string;
  par_amount: string;
  par_is_default: number;
  version: number;
}

export interface CreateParameterDto {
  par_name: string;
  par_amount: string;
  par_is_default: number;
  version: number;
}

export interface UpdateParameterDto {
  par_name?: string;
  par_amount?: string;
  par_is_default?: number;
  version?: number;
}

export interface DashboardStats {
  parkedCount: number;
  todayRevenue: number;
  todayVehicles: number;
}

export interface PrintResult {
  success: boolean;
  message?: string;
}

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface VehicleReportRow {
  veh_id: number;
  veh_plate: string;
  veh_reference: string;
  veh_owner: string | null;
  veh_ingress_date: string;
  veh_egress_date: string;
  veh_tax: string;
}

export interface VehicleReportResult {
  period: ReportPeriod;
  rangeStart: string;
  rangeEnd: string;
  totalVehicles: number;
  totalRevenue: number;
  rows: VehicleReportRow[];
}

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
        checkout: (id: number, total?: string) => Promise<MutationResult>;
        update: (id: number, dto: UpdateVehicleDto) => Promise<MutationResult>;
        delete: (id: number) => Promise<MutationResult>;
        getStats: () => Promise<DashboardStats>;
        getParkedCount: () => Promise<number>;
        getTodayRevenue: () => Promise<number>;
        getTodayVehicles: () => Promise<number>;
        getReport: (period: ReportPeriod, selectedDate: string) => Promise<VehicleReportResult>;
      };
      receipts: {
        print: (html: string) => Promise<PrintResult>;
      };
      parameters: {
        getAll: () => Promise<Parameter[]>;
        getOne: (id: number) => Promise<Parameter | undefined>;
        getDefault: () => Promise<Parameter | undefined>;
        create: (dto: CreateParameterDto) => Promise<MutationResult>;
        update: (id: number, dto: UpdateParameterDto) => Promise<MutationResult>;
        setDefault: (id: number) => Promise<MutationResult>;
      };
      session: {
        save: (user: SafeUser) => Promise<{ success: boolean }>;
        restore: () => Promise<SafeUser | null>;
        clear: () => Promise<{ success: boolean }>;
      };
      settings: {
        getAll: () => Promise<{ set_key: string; set_value: string }[]>;
        get: (key: string) => Promise<string | undefined>;
        save: (key: string, value: string) => Promise<{ success: boolean }>;
      };
    };
  }
}

export {};
