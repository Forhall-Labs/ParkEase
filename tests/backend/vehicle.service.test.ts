import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from './setup.js';
import {
  registerVehicle,
  vehicleCheckout,
  editVehicle,
  removeVehicle,
  getAllVehicles,
  getActiveVehicles,
} from '../../electron/service/vehicle.service.js';

function makeVehicleDto(overrides: Partial<{
  veh_plate: string;
  veh_reference: string;
  veh_owner: string;
  veh_tax: string;
}> = {}) {
  return {
    veh_plate: overrides.veh_plate ?? 'ABC-123',
    veh_reference: overrides.veh_reference ?? `VEH-${Date.now()}-${Math.random()}`,
    veh_owner: overrides.veh_owner ?? 'Test Owner',
    veh_ingress_date: new Date().toISOString(),
    veh_tax: overrides.veh_tax ?? '600',
    veh_version: 1,
  };
}

describe('vehicle.service', () => {
  beforeEach(() => {
    createTestDb();
  });

  describe('registerVehicle', () => {
    it('registers a new vehicle and returns id', () => {
      const result = registerVehicle(makeVehicleDto());
      expect(result.success).toBe(true);
      expect(result.id).toBeTypeOf('number');
    });

    it('blocks same plate when already active', () => {
      registerVehicle(makeVehicleDto({ veh_plate: 'ABC-123', veh_reference: 'REF-001' }));
      const result = registerVehicle(makeVehicleDto({ veh_plate: 'ABC-123', veh_reference: 'REF-002' }));
      expect(result.success).toBe(false);
      expect(result.message).toContain('ABC-123');
    });

    it('allows same plate after vehicle has checked out', () => {
      const first = registerVehicle(makeVehicleDto({ veh_plate: 'ZZZ-999', veh_reference: 'REF-A' }));
      vehicleCheckout(first.id!);

      const second = registerVehicle(makeVehicleDto({ veh_plate: 'ZZZ-999', veh_reference: 'REF-B' }));
      expect(second.success).toBe(true);
    });

    it('blocks duplicate reference', () => {
      registerVehicle(makeVehicleDto({ veh_reference: 'REF-DUPL' }));
      const result = registerVehicle(makeVehicleDto({ veh_plate: 'XYZ-001', veh_reference: 'REF-DUPL' }));
      expect(result.success).toBe(false);
      expect(result.message).toContain('REF-DUPL');
    });
  });

  describe('vehicleCheckout', () => {
    it('checks out an active vehicle', () => {
      const { id } = registerVehicle(makeVehicleDto());
      const result = vehicleCheckout(id!);
      expect(result.success).toBe(true);
    });

    it('fails when vehicle not found', () => {
      const result = vehicleCheckout(9999);
      expect(result.success).toBe(false);
      expect(result.message).toContain('no encontrado');
    });

    it('fails when vehicle already checked out', () => {
      const { id } = registerVehicle(makeVehicleDto());
      vehicleCheckout(id!);
      const result = vehicleCheckout(id!);
      expect(result.success).toBe(false);
      expect(result.message).toContain('ya registró');
    });

    it('accepts optional total override', () => {
      const { id } = registerVehicle(makeVehicleDto());
      const result = vehicleCheckout(id!, '1200');
      expect(result.success).toBe(true);
    });
  });

  describe('editVehicle', () => {
    it('updates vehicle owner', () => {
      const { id } = registerVehicle(makeVehicleDto());
      const result = editVehicle(id!, { veh_owner: 'Nuevo Dueño' });
      expect(result.success).toBe(true);
    });

    it('fails when vehicle not found', () => {
      const result = editVehicle(9999, { veh_owner: 'X' });
      expect(result.success).toBe(false);
    });

    it('blocks plate update when another active vehicle has the same plate', () => {
      const first = registerVehicle(makeVehicleDto({ veh_plate: 'MMM-001', veh_reference: 'A1' }));
      const second = registerVehicle(makeVehicleDto({ veh_plate: 'NNN-002', veh_reference: 'B2' }));
      const result = editVehicle(second.id!, { veh_plate: 'MMM-001' });
      expect(result.success).toBe(false);
      expect(first.success).toBe(true);
    });

    it('allows updating own plate to same value', () => {
      const { id } = registerVehicle(makeVehicleDto({ veh_plate: 'CCC-007' }));
      const result = editVehicle(id!, { veh_plate: 'CCC-007' });
      expect(result.success).toBe(true);
    });
  });

  describe('removeVehicle', () => {
    it('deletes existing vehicle', () => {
      const { id } = registerVehicle(makeVehicleDto());
      const result = removeVehicle(id!);
      expect(result.success).toBe(true);
    });

    it('fails when vehicle not found', () => {
      const result = removeVehicle(9999);
      expect(result.success).toBe(false);
    });
  });

  describe('getAllVehicles / getActiveVehicles', () => {
    it('returns all vehicles including checked-out ones', () => {
      const { id } = registerVehicle(makeVehicleDto({ veh_reference: 'R1' }));
      registerVehicle(makeVehicleDto({ veh_plate: 'DEF-456', veh_reference: 'R2' }));
      vehicleCheckout(id!);

      const all = getAllVehicles();
      expect(all.length).toBe(2);
    });

    it('getActiveVehicles returns only active', () => {
      const { id } = registerVehicle(makeVehicleDto({ veh_reference: 'R3' }));
      registerVehicle(makeVehicleDto({ veh_plate: 'GHI-789', veh_reference: 'R4' }));
      vehicleCheckout(id!);

      const active = getActiveVehicles();
      expect(active.every((v) => v.veh_status === 'P')).toBe(true);
      expect(active.length).toBe(1);
    });
  });
});
