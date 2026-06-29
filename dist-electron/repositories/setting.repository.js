import { getDatabase } from '../database/db.js';
export function getAllSettings() {
    return getDatabase().prepare('SELECT * FROM psm_settings').all();
}
export function getSettingByKey(key) {
    return getDatabase().prepare('SELECT * FROM psm_settings WHERE set_key = ?').get(key);
}
export function upsertSetting(key, value) {
    const existing = getSettingByKey(key);
    if (existing) {
        const result = getDatabase()
            .prepare('UPDATE psm_settings SET set_value = ?, version = version + 1 WHERE set_key = ?')
            .run(value, key);
        return result.changes;
    }
    else {
        const result = getDatabase()
            .prepare('INSERT INTO psm_settings (set_key, set_value) VALUES (?, ?)')
            .run(key, value);
        return result.changes;
    }
}
