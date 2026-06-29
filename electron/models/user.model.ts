export interface User {
  user_id?: number;
  user_name: string;
  user_lastname: string;
  user_username: string;
  user_password: string;
  user_email: string;
  user_status: 'A' | 'I';
  user_role: 'admin' | 'user';
  user_version: number;
}

// Sin contraseña — para devolver al frontend
export type SafeUser = Omit<User, 'user_password'>;

export type CreateUserDto = Omit<User, 'user_id' | 'user_status' | 'user_version'>;

export type UpdateUserDto = Partial<Omit<User, 'user_id' | 'user_password'>>;

export interface LoginDto {
  user_username: string;
  user_password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: SafeUser;
  message?: string;
}
