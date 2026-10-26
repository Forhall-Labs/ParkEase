/**
 * Las fechas de ingreso y salida se guardan como instantes UTC (toISOString),
 * pero el día operativo del parqueo cierra a la medianoche LOCAL del equipo.
 * Comparar con DATE(veh_egress_date) usaba el día UTC, por lo que en Costa Rica
 * (UTC-6) los totales del día se reiniciaban a las 6:00 p.m.
 *
 * Estas utilidades traducen un día local (YYYY-MM-DD) al rango de instantes UTC
 * [start, end) que le corresponde, para filtrar por rango en SQL.
 */

export interface DayRange {
  /** Instante ISO inclusivo del inicio del rango. */
  start: string;
  /** Instante ISO exclusivo del final del rango. */
  end: string;
}

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Día local del equipo en formato YYYY-MM-DD. */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** Valida un YYYY-MM-DD recibido del renderer; si no es válido usa el día de hoy. */
export function normalizeDateKey(value?: string): string {
  const parsed = parseDateKey(value);

  return parsed ? toDateKey(parsed) : toDateKey();
}

/** Desplaza un día local la cantidad de días indicada (puede ser negativa). */
export function shiftDateKey(value: string, days: number): string {
  const date = parseDateKey(value) ?? new Date();

  date.setDate(date.getDate() + days);

  return toDateKey(date);
}

/** Rango de instantes UTC que cubre los días locales startKey..endKey (ambos inclusive). */
export function localDayRange(startKey: string, endKey: string = startKey): DayRange {
  const start = parseDateKey(startKey) ?? startOfLocalDay(new Date());
  const end = parseDateKey(endKey) ?? startOfLocalDay(new Date());

  end.setDate(end.getDate() + 1);

  return { start: start.toISOString(), end: end.toISOString() };
}

function parseDateKey(value?: string): Date | null {
  const match = value ? DATE_KEY_PATTERN.exec(value) : null;

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);

  if (Number.isNaN(date.getTime()) || date.getMonth() !== Number(month) - 1) {
    return null;
  }

  return date;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}
