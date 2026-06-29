import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from './setup.js';
import {
  registerParameter,
  editParameter,
  markParameterAsDefault,
  validateParameterDefaults,
  getAllParameters,
  getParameterById,
  getDefaultParameter,
} from '../../electron/service/parameter.service.js';

function makeParamDto(overrides: Partial<{
  par_name: string;
  par_amount: string;
  par_is_default: number;
}> = {}) {
  return {
    par_name: overrides.par_name ?? 'Tarifa Test',
    par_amount: overrides.par_amount ?? '600',
    par_is_default: overrides.par_is_default ?? 0,
    version: 1,
  };
}

describe('parameter.service', () => {
  beforeEach(() => {
    createTestDb();
  });

  describe('registerParameter', () => {
    it('creates a parameter and auto-assigns as default when first', () => {
      const result = registerParameter(makeParamDto());
      expect(result.success).toBe(true);
      expect(result.id).toBeTypeOf('number');

      const def = getDefaultParameter();
      expect(def).toBeDefined();
      expect(def?.par_id).toBe(result.id);
    });

    it('respects explicit par_is_default=1', () => {
      registerParameter(makeParamDto({ par_name: 'Tarifa A' }));
      const result = registerParameter(makeParamDto({ par_name: 'Tarifa B', par_is_default: 1 }));
      expect(result.success).toBe(true);

      const def = getDefaultParameter();
      expect(def?.par_id).toBe(result.id);
    });

    it('fails with empty name', () => {
      const result = registerParameter(makeParamDto({ par_name: '   ' }));
      expect(result.success).toBe(false);
      expect(result.message).toContain('nombre');
    });

    it('fails with zero amount', () => {
      const result = registerParameter(makeParamDto({ par_amount: '0' }));
      expect(result.success).toBe(false);
      expect(result.message).toContain('monto');
    });

    it('fails with negative amount', () => {
      const result = registerParameter(makeParamDto({ par_amount: '-100' }));
      expect(result.success).toBe(false);
    });

    it('fails with non-numeric amount', () => {
      const result = registerParameter(makeParamDto({ par_amount: 'abc' }));
      expect(result.success).toBe(false);
    });
  });

  describe('editParameter', () => {
    it('updates name and amount', () => {
      const { id } = registerParameter(makeParamDto());
      const result = editParameter(id!, { par_name: 'Nuevo Nombre', par_amount: '800' });
      expect(result.success).toBe(true);

      const updated = getParameterById(id!);
      expect(updated?.par_name).toBe('Nuevo Nombre');
      expect(updated?.par_amount).toBe('800');
    });

    it('fails when parameter not found', () => {
      const result = editParameter(9999, { par_name: 'X' });
      expect(result.success).toBe(false);
    });

    it('fails unsetting default when it is the only default', () => {
      const { id } = registerParameter(makeParamDto());
      const result = editParameter(id!, { par_is_default: 0 });
      expect(result.success).toBe(false);
      expect(result.message).toContain('tarifa general');
    });

    it('fails with empty name on edit', () => {
      const { id } = registerParameter(makeParamDto());
      const result = editParameter(id!, { par_name: '' });
      expect(result.success).toBe(false);
    });

    it('fails with invalid amount on edit', () => {
      const { id } = registerParameter(makeParamDto());
      const result = editParameter(id!, { par_amount: 'nope' });
      expect(result.success).toBe(false);
    });
  });

  describe('markParameterAsDefault', () => {
    it('marks a parameter as default', () => {
      const { id: id1 } = registerParameter(makeParamDto({ par_name: 'T1' }));
      const { id: id2 } = registerParameter(makeParamDto({ par_name: 'T2' }));
      const result = markParameterAsDefault(id2!);
      expect(result.success).toBe(true);

      const def = getDefaultParameter();
      expect(def?.par_id).toBe(id2);
      expect(id1).toBeDefined();
    });

    it('fails when parameter not found', () => {
      const result = markParameterAsDefault(9999);
      expect(result.success).toBe(false);
    });
  });

  describe('validateParameterDefaults', () => {
    it('fails when no parameters exist', () => {
      const result = validateParameterDefaults();
      expect(result.success).toBe(false);
    });

    it('succeeds when a default exists', () => {
      registerParameter(makeParamDto());
      const result = validateParameterDefaults();
      expect(result.success).toBe(true);
    });
  });

  describe('getAllParameters', () => {
    it('returns empty array initially', () => {
      expect(getAllParameters()).toEqual([]);
    });

    it('returns all created parameters', () => {
      registerParameter(makeParamDto({ par_name: 'T1' }));
      registerParameter(makeParamDto({ par_name: 'T2' }));
      expect(getAllParameters().length).toBe(2);
    });
  });
});
