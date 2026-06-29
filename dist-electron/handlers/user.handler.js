import { ipcMain } from 'electron';
import { getAllUsers, getUserById, login, registerUser, editUser, changePassword, deactivateUserById, removeUser, } from '../service/user.service.js';
export function registerUserHandlers() {
    ipcMain.handle('users:getAll', () => {
        return getAllUsers();
    });
    ipcMain.handle('users:getOne', (_e, id) => {
        return getUserById(id);
    });
    ipcMain.handle('users:login', (_e, dto) => {
        return login(dto);
    });
    ipcMain.handle('users:create', (_e, dto) => {
        return registerUser(dto);
    });
    ipcMain.handle('users:update', (_e, id, dto) => {
        return editUser(id, dto);
    });
    ipcMain.handle('users:changePassword', (_e, id, currentPassword, newPassword) => {
        return changePassword(id, currentPassword, newPassword);
    });
    ipcMain.handle('users:deactivate', (_e, id) => {
        return deactivateUserById(id);
    });
    ipcMain.handle('users:delete', (_e, id) => {
        return removeUser(id);
    });
}
