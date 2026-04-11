import { getAllSettings, getSettingByKey, upsertSetting, } from '../repositories/setting.repository.js';
export function getAllAppSettings() {
    return getAllSettings();
}
export function getAppSetting(key) {
    const setting = getSettingByKey(key);
    return setting?.set_value;
}
export function saveAppSetting(key, value) {
    try {
        upsertSetting(key, value);
        return { success: true };
    }
    catch (error) {
        console.error('Error saving setting:', error);
        return { success: false };
    }
}
