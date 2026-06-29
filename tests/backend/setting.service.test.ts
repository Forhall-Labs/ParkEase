import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from './setup.js';
import {
  getAllAppSettings,
  getAppSetting,
  saveAppSetting,
} from '../../electron/service/setting.service.js';

describe('setting.service', () => {
  beforeEach(() => {
    createTestDb();
  });

  describe('saveAppSetting', () => {
    it('inserts a new setting', () => {
      const result = saveAppSetting('parking_name', 'Mi Parqueo');
      expect(result.success).toBe(true);
      expect(getAppSetting('parking_name')).toBe('Mi Parqueo');
    });

    it('updates an existing setting', () => {
      saveAppSetting('parking_name', 'Primero');
      saveAppSetting('parking_name', 'Segundo');
      expect(getAppSetting('parking_name')).toBe('Segundo');
    });

    it('can save multiple distinct keys', () => {
      saveAppSetting('parking_name', 'Parqueo Central');
      saveAppSetting('parking_address', 'San José, CR');
      saveAppSetting('parking_phone', '2222-3333');
      saveAppSetting('parking_email', 'park@example.com');

      expect(getAppSetting('parking_name')).toBe('Parqueo Central');
      expect(getAppSetting('parking_address')).toBe('San José, CR');
      expect(getAppSetting('parking_phone')).toBe('2222-3333');
      expect(getAppSetting('parking_email')).toBe('park@example.com');
    });
  });

  describe('getAppSetting', () => {
    it('returns undefined for unknown key', () => {
      expect(getAppSetting('nonexistent')).toBeUndefined();
    });

    it('returns stored value', () => {
      saveAppSetting('test_key', 'hello');
      expect(getAppSetting('test_key')).toBe('hello');
    });
  });

  describe('getAllAppSettings', () => {
    it('returns empty array when no settings exist', () => {
      expect(getAllAppSettings()).toEqual([]);
    });

    it('returns all saved settings', () => {
      saveAppSetting('key_a', 'val_a');
      saveAppSetting('key_b', 'val_b');
      const all = getAllAppSettings();
      expect(all.length).toBe(2);
      expect(all.find((s) => s.set_key === 'key_a')?.set_value).toBe('val_a');
    });
  });
});
