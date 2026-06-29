import { getDatabase } from '../database/db.js';

export interface Setting {
  set_id?: number;
  set_key: string;
  set_value: string;
  version: number;
}

export function getAllSettings(): Setting[] {
  return getDatabase().prepare('SELECT * FROM psm_settings').all() as Setting[];
}

export function getSettingByKey(key: string): Setting | undefined {
  return getDatabase().prepare('SELECT * FROM psm_settings WHERE set_key = ?').get(key) as
    | Setting
    | undefined;
}

export function upsertSetting(key: string, value: string): number {
  const existing = getSettingByKey(key);
  if (existing) {
    const result = getDatabase()
      .prepare('UPDATE psm_settings SET set_value = ?, version = version + 1 WHERE set_key = ?')
      .run(value, key);
    return result.changes;
  } else {
    const result = getDatabase()
      .prepare('INSERT INTO psm_settings (set_key, set_value) VALUES (?, ?)')
      .run(key, value);
    return result.changes;
  }
}
