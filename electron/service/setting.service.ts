import {
  getAllSettings,
  getSettingByKey,
  upsertSetting,
  type Setting,
} from '../repositories/setting.repository.js';

export function getAllAppSettings(): Setting[] {
  return getAllSettings();
}

export function getAppSetting(key: string): string | undefined {
  const setting = getSettingByKey(key);
  return setting?.set_value;
}

export function saveAppSetting(key: string, value: string): { success: boolean } {
  try {
    upsertSetting(key, value);
    return { success: true };
  } catch (error) {
    console.error('Error saving setting:', error);
    return { success: false };
  }
}
