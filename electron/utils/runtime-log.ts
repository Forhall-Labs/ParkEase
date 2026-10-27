import { app } from 'electron';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

/** Log de diagnóstico en userData/runtime.log (en Windows: %APPDATA%/ParkEase). */
export function writeRuntimeLog(message: string): void {
  try {
    const logDir = app.getPath('userData');
    mkdirSync(logDir, { recursive: true });
    appendFileSync(join(logDir, 'runtime.log'), `[${new Date().toISOString()}] ${message}\n`, 'utf8');
  } catch {
    // Nunca tumbar la app por no poder escribir el log
  }
}
