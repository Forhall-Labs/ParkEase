import Database from 'better-sqlite3';
import { _setDatabaseForTest } from '../../electron/database/db.js';

export function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE psm_parameters (
      par_id       INTEGER PRIMARY KEY AUTOINCREMENT,
      par_quantity TEXT    NOT NULL DEFAULT '',
      par_tax      TEXT    NOT NULL DEFAULT '',
      par_name     TEXT    NOT NULL DEFAULT '',
      par_amount   TEXT    NOT NULL DEFAULT '0',
      par_is_default INTEGER NOT NULL DEFAULT 0 CHECK (par_is_default IN (0, 1)),
      version      INTEGER NOT NULL DEFAULT 1
    );

    CREATE UNIQUE INDEX idx_psm_parameters_single_default
    ON psm_parameters (par_is_default)
    WHERE par_is_default = 1;

    CREATE TABLE psm_vehicles (
      veh_id           INTEGER PRIMARY KEY AUTOINCREMENT,
      veh_owner        TEXT,
      veh_reference    TEXT    NOT NULL UNIQUE,
      veh_plate        TEXT    NOT NULL,
      veh_ingress_date TEXT    NOT NULL,
      veh_egress_date  TEXT,
      veh_status       TEXT    NOT NULL DEFAULT 'P' CHECK (veh_status IN ('P', 'S')),
      veh_tax          TEXT    NOT NULL,
      veh_version      INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE psm_users (
      user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name      TEXT    NOT NULL,
      user_lastname  TEXT    NOT NULL,
      user_username  TEXT    NOT NULL UNIQUE,
      user_password  TEXT    NOT NULL,
      user_email     TEXT    NOT NULL UNIQUE,
      user_status    TEXT    NOT NULL DEFAULT 'A' CHECK (user_status IN ('A', 'I')),
      user_role      TEXT    NOT NULL DEFAULT 'user' CHECK (user_role IN ('admin', 'user')),
      user_version   INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE psm_settings (
      set_id   INTEGER PRIMARY KEY AUTOINCREMENT,
      set_key  TEXT    NOT NULL UNIQUE,
      set_value TEXT   NOT NULL,
      version  INTEGER NOT NULL DEFAULT 1
    );
  `);

  _setDatabaseForTest(db);
  return db;
}
