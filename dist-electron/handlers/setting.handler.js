import { ipcMain } from 'electron';
import { getAllAppSettings, getAppSetting, saveAppSetting } from '../service/setting.service.js';
export function registerSettingHandlers() {
    ipcMain.handle('settings:getAll', () => {
        return getAllAppSettings();
    });
    ipcMain.handle('settings:get', (_e, key) => {
        return getAppSetting(key);
    });
    ipcMain.handle('settings:save', (_e, key, value) => {
        return saveAppSetting(key, value);
    });
}
