import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'path';
import bcrypt from 'bcryptjs';
// ─── Instancia singleton de la DB ─────────────────────────────────────────────
let db;
export function getDatabase() {
    if (!db) {
        throw new Error('The database has not been initialized. Call initDatabase() first.');
    }
    return db;
}
// ─── Inicialización ───────────────────────────────────────────────────────────
export function initDatabase() {
    const DB_PATH = join(app.getPath('userData'), 'psm.db');
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations();
}
// ─── Migraciones ──────────────────────────────────────────────────────────────
function runMigrations() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS psm_migrations (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL UNIQUE,
      applied_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
    const migrations = {
        '001_create_parameters': () => db.exec(`
      CREATE TABLE IF NOT EXISTS psm_parameters (
        par_id       INTEGER PRIMARY KEY AUTOINCREMENT,
        par_quantity TEXT    NOT NULL,
        par_tax      TEXT    NOT NULL,
        version      INTEGER NOT NULL DEFAULT 1
      );
    `),
        '002_create_vehicles': () => db.exec(`
      CREATE TABLE IF NOT EXISTS psm_vehicles (
        veh_id           INTEGER PRIMARY KEY AUTOINCREMENT,
        veh_owner        TEXT,
        veh_reference    TEXT    NOT NULL UNIQUE,
        veh_plate        TEXT    NOT NULL UNIQUE,
        veh_ingress_date TEXT    NOT NULL,
        veh_egress_date  TEXT,
        veh_status       TEXT    NOT NULL DEFAULT 'P'
                                 CHECK (veh_status IN ('P', 'S')),
        veh_tax          TEXT    NOT NULL,
        veh_version      INTEGER NOT NULL DEFAULT 1
      );
    `),
        '003_create_users': () => db.exec(`
      CREATE TABLE IF NOT EXISTS psm_users (
        user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name      TEXT    NOT NULL,
        user_lastname  TEXT    NOT NULL,
        user_username  TEXT    NOT NULL UNIQUE,
        user_password  TEXT    NOT NULL,
        user_email     TEXT    NOT NULL UNIQUE,
        user_status    TEXT    NOT NULL DEFAULT 'A'
                               CHECK (user_status IN ('A', 'I')),
        user_version   INTEGER NOT NULL DEFAULT 1
      );
    `),
        '004_create_settings': () => db.exec(`
      CREATE TABLE IF NOT EXISTS psm_settings (
        set_id         INTEGER PRIMARY KEY AUTOINCREMENT,
        set_key        TEXT    NOT NULL UNIQUE,
        set_value      TEXT    NOT NULL,
        version        INTEGER NOT NULL DEFAULT 1
      );
    `),
        '005_parameter_tariffs_default': () => {
            db.exec(`
        ALTER TABLE psm_parameters ADD COLUMN par_name TEXT NOT NULL DEFAULT '';
        ALTER TABLE psm_parameters ADD COLUMN par_amount TEXT NOT NULL DEFAULT '0';
        ALTER TABLE psm_parameters ADD COLUMN par_is_default INTEGER NOT NULL DEFAULT 0
          CHECK (par_is_default IN (0, 1));
      `);
            db.exec(`
        UPDATE psm_parameters
        SET
          par_name = CASE
            WHEN par_name IS NULL OR TRIM(par_name) = '' THEN 'Tarifa general'
            ELSE par_name
          END,
          par_amount = CASE
            WHEN par_amount IS NULL OR TRIM(par_amount) = '' THEN
              CASE
                WHEN par_quantity IS NOT NULL AND TRIM(par_quantity) <> '' THEN par_quantity
                WHEN par_tax IS NOT NULL AND TRIM(par_tax) <> '' THEN par_tax
                ELSE '0'
              END
            ELSE par_amount
          END;
      `);
            const hasRows = db
                .prepare('SELECT EXISTS(SELECT 1 FROM psm_parameters) as has_rows')
                .get();
            if (!hasRows.has_rows) {
                db.prepare(`
          INSERT INTO psm_parameters
            (par_quantity, par_tax, par_name, par_amount, par_is_default, version)
          VALUES
            ('0', '0', 'Tarifa general', '0', 1, 1)
        `).run();
            }
            else {
                db.exec(`
          UPDATE psm_parameters SET par_is_default = 0;
          UPDATE psm_parameters
          SET par_is_default = 1
          WHERE par_id = (SELECT par_id FROM psm_parameters ORDER BY par_id ASC LIMIT 1);
        `);
            }
            db.exec(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_psm_parameters_single_default
        ON psm_parameters (par_is_default)
        WHERE par_is_default = 1;
      `);
        },
        '006_seed_admin_user': () => {
            const existing = db
                .prepare('SELECT user_id FROM psm_users WHERE user_username = ?')
                .get('admin');
            if (existing)
                return;
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.prepare(`
        INSERT INTO psm_users (user_name, user_lastname, user_username, user_password, user_email, user_status, user_version)
        VALUES ('Administrador', 'Sistema', 'admin', ?, 'admin@psm.local', 'A', 1)
      `).run(hashedPassword);
        },
        '007_add_user_role': () => {
            try {
                db.exec(`ALTER TABLE psm_users ADD COLUMN user_role TEXT NOT NULL DEFAULT 'user' CHECK (user_role IN ('admin', 'user'))`);
            }
            catch {
                // column already exists
            }
            db.exec(`UPDATE psm_users SET user_role = 'admin' WHERE user_username = 'admin'`);
        },
    };
    const applied = db.prepare('SELECT name FROM psm_migrations').all();
    const appliedNames = new Set(applied.map((r) => r.name));
    const insertMigration = db.prepare('INSERT INTO psm_migrations (name) VALUES (?)');
    for (const [name, migrate] of Object.entries(migrations)) {
        if (!appliedNames.has(name)) {
            migrate();
            insertMigration.run(name);
            console.log(`✓ Migration applied: ${name}`);
        }
    }
}
