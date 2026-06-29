import { ipcMain } from 'electron';
import {
  getAllParameters,
  getParameterById,
  getDefaultParameter,
  registerParameter,
  editParameter,
  markParameterAsDefault,
} from '../service/parameter.service.js';
import { CreateParameterDto, UpdateParameterDto } from '../models/parameter.model.js';

export function registerParameterHandlers(): void {
  ipcMain.handle('parameters:getAll', () => {
    return getAllParameters();
  });

  ipcMain.handle('parameters:getOne', (_e, id: number) => {
    return getParameterById(id);
  });

  ipcMain.handle('parameters:create', (_e, dto: CreateParameterDto) => {
    return registerParameter(dto);
  });

  ipcMain.handle('parameters:update', (_e, id: number, dto: UpdateParameterDto) => {
    return editParameter(id, dto);
  });

  ipcMain.handle('parameters:getDefault', () => {
    return getDefaultParameter();
  });

  ipcMain.handle('parameters:setDefault', (_e, id: number) => {
    return markParameterAsDefault(id);
  });
}
