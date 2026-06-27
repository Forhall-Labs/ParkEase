import { describe, it, expect } from 'vitest';
import { autoFormatPlate, validatePlate } from '../plate-utils';

describe('autoFormatPlate', () => {
  it('inserts dash between letters and first digit', () => {
    expect(autoFormatPlate('ABC001')).toBe('ABC-001');
  });

  it('inserts dash for MOT prefix', () => {
    expect(autoFormatPlate('MOT123456')).toBe('MOT-123456');
  });

  it('inserts dash for CL prefix', () => {
    expect(autoFormatPlate('CL12345')).toBe('CL-12345');
  });

  it('leaves already-dashed plate unchanged', () => {
    expect(autoFormatPlate('ABC-123')).toBe('ABC-123');
  });

  it('leaves numeric-only plate unchanged', () => {
    expect(autoFormatPlate('904080')).toBe('904080');
  });

  it('uppercases input', () => {
    expect(autoFormatPlate('abc123')).toBe('ABC-123');
  });

  it('handles single-digit suffix', () => {
    expect(autoFormatPlate('ABC1')).toBe('ABC-1');
  });
});

describe('validatePlate', () => {
  describe('valid plates', () => {
    it('accepts regular CR plate (3 letters + dash + 1-3 digits)', () => {
      expect(validatePlate('ABC-123').isValid).toBe(true);
      expect(validatePlate('ABC-123').vehicleType).toBe('Regular');
    });

    it('accepts regular plate with 1 digit', () => {
      expect(validatePlate('BNX-1').isValid).toBe(true);
    });

    it('accepts regular plate with 3 digits', () => {
      expect(validatePlate('ZZZ-999').isValid).toBe(true);
    });

    it('accepts motorcycle plate (MOT-XXXXXX)', () => {
      expect(validatePlate('MOT-123456').isValid).toBe(true);
      expect(validatePlate('MOT-123456').vehicleType).toBe('Motorcycle');
    });

    it('accepts light truck plate (CL-XXXXXX)', () => {
      expect(validatePlate('CL-12345').isValid).toBe(true);
      expect(validatePlate('CL-12345').vehicleType).toBe('Light truck');
    });

    it('accepts numeric-only plate (1-6 digits)', () => {
      expect(validatePlate('904080').isValid).toBe(true);
      expect(validatePlate('1').isValid).toBe(true);
      expect(validatePlate('123456').isValid).toBe(true);
    });
  });

  describe('invalid plates', () => {
    it('rejects empty string', () => {
      const result = validatePlate('');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBeTruthy();
    });

    it('rejects whitespace-only', () => {
      expect(validatePlate('   ').isValid).toBe(false);
    });

    it('rejects plate without dash (not auto-formatted)', () => {
      expect(validatePlate('ABC123').isValid).toBe(false);
    });

    it('rejects plate with 4 digits on regular format', () => {
      expect(validatePlate('ABC-1234').isValid).toBe(false);
    });

    it('rejects plate with 2 letters prefix', () => {
      expect(validatePlate('AB-123').isValid).toBe(false);
    });

    it('rejects plate with 4 letters prefix', () => {
      expect(validatePlate('ABCD-123').isValid).toBe(false);
    });

    it('rejects lowercase', () => {
      expect(validatePlate('abc-123').isValid).toBe(false);
    });

    it('rejects 7-digit numeric plate', () => {
      expect(validatePlate('1234567').isValid).toBe(false);
    });

    it('returns errorMessage on invalid', () => {
      const result = validatePlate('INVALID');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBeTypeOf('string');
      expect(result.vehicleType).toBeNull();
    });
  });
});
