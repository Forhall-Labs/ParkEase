import { BrowserWindow, app, ipcMain } from "electron";
import { join } from "path";
import Database from "better-sqlite3";
//#region electron/main.ts
var DB_PATH = join(app.getPath("userData"), "psm.db");
var db;
function initDatabase() {
	db = new Database(DB_PATH);
	db.pragma("journal_mode = WAL");
	db.pragma("foreign_keys = ON");
	db.exec(`
    CREATE TABLE IF NOT EXISTS psm_parameters (
      par_id       INTEGER PRIMARY KEY AUTOINCREMENT,
      par_quantity TEXT    NOT NULL,
      par_tax      TEXT    NOT NULL,
      version      INTEGER NOT NULL DEFAULT 1
    );

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
  `);
}
function createWindow() {
	const win = new BrowserWindow({
		width: 1280,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: join(app.getAppPath(), "dist-electron", "preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		},
		titleBarStyle: "default",
		show: false
	});
	win.once("ready-to-show", () => win.show());
	if (process.env.NODE_ENV === "development") {
		win.loadURL("http://localhost:5173");
		win.webContents.openDevTools();
	} else win.loadFile(join(app.getAppPath(), "dist", "index.html"));
}
app.whenReady().then(() => {
	initDatabase();
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on("window-all-closed", () => {
	db?.close();
	if (process.platform !== "darwin") app.quit();
});
ipcMain.handle("parameters:getAll", () => {
	return db.prepare("SELECT * FROM psm_parameters").all();
});
ipcMain.handle("parameters:getOne", (_e, id) => {
	return db.prepare("SELECT * FROM psm_parameters WHERE par_id = ?").get(id);
});
ipcMain.handle("parameters:create", (_e, data) => {
	return { id: db.prepare(`
    INSERT INTO psm_parameters (par_quantity, par_tax, version)
    VALUES (@par_quantity, @par_tax, @version)
  `).run(data).lastInsertRowid };
});
ipcMain.handle("parameters:update", (_e, id, data) => {
	return { changes: db.prepare(`
    UPDATE psm_parameters
    SET par_quantity = @par_quantity,
        par_tax      = @par_tax,
        version      = @version
    WHERE par_id = @par_id
  `).run({
		...data,
		par_id: id
	}).changes };
});
ipcMain.handle("parameters:delete", (_e, id) => {
	return { changes: db.prepare("DELETE FROM psm_parameters WHERE par_id = ?").run(id).changes };
});
ipcMain.handle("vehicles:getAll", () => {
	return db.prepare("SELECT * FROM psm_vehicles ORDER BY veh_ingress_date DESC").all();
});
ipcMain.handle("vehicles:getActive", () => {
	return db.prepare(`
    SELECT * FROM psm_vehicles
    WHERE veh_status = 'P'
    ORDER BY veh_ingress_date DESC
  `).all();
});
ipcMain.handle("vehicles:getOne", (_e, id) => {
	return db.prepare("SELECT * FROM psm_vehicles WHERE veh_id = ?").get(id);
});
ipcMain.handle("vehicles:create", (_e, data) => {
	return { id: db.prepare(`
    INSERT INTO psm_vehicles
      (veh_owner, veh_reference, veh_plate, veh_ingress_date, veh_tax, veh_version)
    VALUES
      (@veh_owner, @veh_reference, @veh_plate, @veh_ingress_date, @veh_tax, @veh_version)
  `).run(data).lastInsertRowid };
});
ipcMain.handle("vehicles:checkout", (_e, id, egress_date) => {
	return { changes: db.prepare(`
    UPDATE psm_vehicles
    SET veh_status      = 'S',
        veh_egress_date = @egress_date,
        veh_version     = veh_version + 1
    WHERE veh_id = @id AND veh_status = 'P'
  `).run({
		egress_date,
		id
	}).changes };
});
ipcMain.handle("vehicles:delete", (_e, id) => {
	return { changes: db.prepare("DELETE FROM psm_vehicles WHERE veh_id = ?").run(id).changes };
});
//#endregion

//# sourceMappingURL=main.js.map