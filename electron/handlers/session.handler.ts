import { ipcMain } from 'electron';
import { getDatabase } from '../database/db.js';
import type { SafeUser } from '../models/user.model.js';

// ─── Crear tabla de sesiones si no existe ───────────────────────────────────────

function ensureSessionTable(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS psm_sessions (
      id          INTEGER PRIMARY KEY,
      user_id     INTEGER NOT NULL,
      user_name   TEXT    NOT NULL,
      user_lastname TEXT  NOT NULL,
      user_username TEXT  NOT NULL,
      user_email   TEXT   NOT NULL,
      user_status  TEXT   NOT NULL,
      user_role    TEXT   NOT NULL DEFAULT 'user',
      user_version INTEGER NOT NULL,
      saved_at     TEXT   NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// ─── Handlers ───────────────────────────────────────────────────────────────────

export function registerSessionHandlers(): void {
  ensureSessionTable();

  // Guardar sesión
  ipcMain.handle('session:save', (_e, user: SafeUser) => {
    const db = getDatabase();

    // Limpiar sesiones anteriores
    db.prepare('DELETE FROM psm_sessions').run();

    // Insertar nueva sesión
    db.prepare(
      `
      INSERT INTO psm_sessions
        (user_id, user_name, user_lastname, user_username, user_email, user_status, user_role, user_version, saved_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `
    ).run(
      user.user_id,
      user.user_name,
      user.user_lastname,
      user.user_username,
      user.user_email,
      user.user_status,
      user.user_role,
      user.user_version
    );

    return { success: true };
  });

  // Restaurar sesión
  ipcMain.handle('session:restore', (): SafeUser | null => {
    const db = getDatabase();

    const session = db
      .prepare(
        `
      SELECT user_id, user_name, user_lastname, user_username, user_email, user_status, user_role, user_version
      FROM psm_sessions
      LIMIT 1
    `
      )
      .get() as
      | {
          user_id: number;
          user_name: string;
          user_lastname: string;
          user_username: string;
          user_email: string;
          user_status: 'A' | 'I';
          user_role: 'admin' | 'user';
          user_version: number;
        }
      | undefined;

    if (!session) {
      return null;
    }

    return {
      user_id: session.user_id,
      user_name: session.user_name,
      user_lastname: session.user_lastname,
      user_username: session.user_username,
      user_email: session.user_email,
      user_status: session.user_status,
      user_role: session.user_role,
      user_version: session.user_version,
    };
  });

  // Limpiar sesión
  ipcMain.handle('session:clear', () => {
    const db = getDatabase();
    db.prepare('DELETE FROM psm_sessions').run();
    return { success: true };
  });
}
