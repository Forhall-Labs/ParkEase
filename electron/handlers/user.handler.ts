import { ipcMain } from 'electron';
import {
  getAllUsers,
  getUserById,
  login,
  registerUser,
  editUser,
  changePassword,
  deactivateUserById,
  removeUser,
} from '../service/user.service.js';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../models/user.model.js';

export function registerUserHandlers(): void {
  ipcMain.handle('users:getAll', () => {
    return getAllUsers();
  });

  ipcMain.handle('users:getOne', (_e, id: number) => {
    return getUserById(id);
  });

  ipcMain.handle('users:login', (_e, dto: LoginDto) => {
    return login(dto);
  });

  ipcMain.handle('users:create', (_e, dto: CreateUserDto) => {
    return registerUser(dto);
  });

  ipcMain.handle('users:update', (_e, id: number, dto: UpdateUserDto) => {
    return editUser(id, dto);
  });

  ipcMain.handle('users:changePassword', (_e, id: number, currentPassword: string, newPassword: string) => {
    return changePassword(id, currentPassword, newPassword);
  });

  ipcMain.handle('users:deactivate', (_e, id: number) => {
    return deactivateUserById(id);
  });

  ipcMain.handle('users:delete', (_e, id: number) => {
    return removeUser(id);
  });
}