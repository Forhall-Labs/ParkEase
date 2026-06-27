export interface PlateValidationResult {
  isValid: boolean;
  vehicleType: 'Regular' | 'Motorcycle' | 'Light truck' | null;
  errorMessage: string | null;
}

export function autoFormatPlate(raw: string): string {
  const upper = raw.toUpperCase();
  return upper.replace(/^([A-Z]+)(\d)/, '$1-$2');
}

export function validatePlate(plate: string): PlateValidationResult {
  if (!plate || plate.trim() === '') {
    return { isValid: false, vehicleType: null, errorMessage: 'La placa es requerida' };
  }

  const regularRegex = /^[A-Z]{3}-\d{1,3}$/;
  const motorcycleRegex = /^MOT-\d{1,6}$/;
  const lightTruckRegex = /^CL-\d{1,6}$/;
  const numericRegex = /^\d{1,6}$/;

  if (regularRegex.test(plate)) {
    return { isValid: true, vehicleType: 'Regular', errorMessage: null };
  }
  if (motorcycleRegex.test(plate)) {
    return { isValid: true, vehicleType: 'Motorcycle', errorMessage: null };
  }
  if (lightTruckRegex.test(plate)) {
    return { isValid: true, vehicleType: 'Light truck', errorMessage: null };
  }
  if (numericRegex.test(plate)) {
    return { isValid: true, vehicleType: 'Regular', errorMessage: null };
  }

  return {
    isValid: false,
    vehicleType: null,
    errorMessage: 'Formato de placa inválido',
  };
}
