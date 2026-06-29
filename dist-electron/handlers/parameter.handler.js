import { ipcMain } from 'electron';
import { getAllParameters, getParameterById, getDefaultParameter, registerParameter, editParameter, markParameterAsDefault, } from '../service/parameter.service.js';
export function registerParameterHandlers() {
    ipcMain.handle('parameters:getAll', () => {
        return getAllParameters();
    });
    ipcMain.handle('parameters:getOne', (_e, id) => {
        return getParameterById(id);
    });
    ipcMain.handle('parameters:create', (_e, dto) => {
        return registerParameter(dto);
    });
    ipcMain.handle('parameters:update', (_e, id, dto) => {
        return editParameter(id, dto);
    });
    ipcMain.handle('parameters:getDefault', () => {
        return getDefaultParameter();
    });
    ipcMain.handle('parameters:setDefault', (_e, id) => {
        return markParameterAsDefault(id);
    });
}
