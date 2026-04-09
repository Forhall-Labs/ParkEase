import { ipcMain } from 'electron';
import { getAllAppSettings, getAppSetting, saveAppSetting } from '../service/setting.service.js';

export function registerSettingHandlers(): void {
  ipcMain.handle('settings:getAll', () => {
    return getAllAppSettings();
  });

  ipcMain.handle('settings:get', (_e, key: string) => {
    return getAppSetting(key);
  });

  ipcMain.handle('settings:save', (_e, key: string, value: string) => {
    return saveAppSetting(key, value);
  });
}
