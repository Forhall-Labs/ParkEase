import { BrowserWindow as e, app as t, ipcMain as n } from "electron";
import { join as r } from "path";
import i from "better-sqlite3";
//#region electron/main.ts
var a = r(t.getPath("userData"), "psm.db"), o;
function s() {
	o = new i(a), o.pragma("journal_mode = WAL"), o.pragma("foreign_keys = ON"), o.exec("\n    CREATE TABLE IF NOT EXISTS psm_parameters (\n      par_id       INTEGER PRIMARY KEY AUTOINCREMENT,\n      par_quantity TEXT    NOT NULL,\n      par_tax      TEXT    NOT NULL,\n      version      INTEGER NOT NULL DEFAULT 1\n    );\n\n    CREATE TABLE IF NOT EXISTS psm_vehicles (\n      veh_id           INTEGER PRIMARY KEY AUTOINCREMENT,\n      veh_owner        TEXT,\n      veh_reference    TEXT    NOT NULL UNIQUE,\n      veh_plate        TEXT    NOT NULL UNIQUE,\n      veh_ingress_date TEXT    NOT NULL,\n      veh_egress_date  TEXT,\n      veh_status       TEXT    NOT NULL DEFAULT 'P'\n                               CHECK (veh_status IN ('P', 'S')),\n      veh_tax          TEXT    NOT NULL,\n      veh_version      INTEGER NOT NULL DEFAULT 1\n    );\n  ");
}
function c() {
	let n = new e({
		width: 1280,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: r(t.getAppPath(), "dist-electron", "preload.js"),
			contextIsolation: !0,
			nodeIntegration: !1
		},
		titleBarStyle: "default",
		show: !1
	});
	n.once("ready-to-show", () => n.show()), process.env.NODE_ENV === "development" ? (n.loadURL("http://localhost:5173"), n.webContents.openDevTools()) : n.loadFile(r(t.getAppPath(), "dist", "index.html"));
}
t.whenReady().then(() => {
	s(), c(), t.on("activate", () => {
		e.getAllWindows().length === 0 && c();
	});
}), t.on("window-all-closed", () => {
	o?.close(), process.platform !== "darwin" && t.quit();
}), n.handle("parameters:getAll", () => o.prepare("SELECT * FROM psm_parameters").all()), n.handle("parameters:getOne", (e, t) => o.prepare("SELECT * FROM psm_parameters WHERE par_id = ?").get(t)), n.handle("parameters:create", (e, t) => ({ id: o.prepare("\n    INSERT INTO psm_parameters (par_quantity, par_tax, version)\n    VALUES (@par_quantity, @par_tax, @version)\n  ").run(t).lastInsertRowid })), n.handle("parameters:update", (e, t, n) => ({ changes: o.prepare("\n    UPDATE psm_parameters\n    SET par_quantity = @par_quantity,\n        par_tax      = @par_tax,\n        version      = @version\n    WHERE par_id = @par_id\n  ").run({
	...n,
	par_id: t
}).changes })), n.handle("parameters:delete", (e, t) => ({ changes: o.prepare("DELETE FROM psm_parameters WHERE par_id = ?").run(t).changes })), n.handle("vehicles:getAll", () => o.prepare("SELECT * FROM psm_vehicles ORDER BY veh_ingress_date DESC").all()), n.handle("vehicles:getActive", () => o.prepare("\n    SELECT * FROM psm_vehicles\n    WHERE veh_status = 'P'\n    ORDER BY veh_ingress_date DESC\n  ").all()), n.handle("vehicles:getOne", (e, t) => o.prepare("SELECT * FROM psm_vehicles WHERE veh_id = ?").get(t)), n.handle("vehicles:create", (e, t) => ({ id: o.prepare("\n    INSERT INTO psm_vehicles\n      (veh_owner, veh_reference, veh_plate, veh_ingress_date, veh_tax, veh_version)\n    VALUES\n      (@veh_owner, @veh_reference, @veh_plate, @veh_ingress_date, @veh_tax, @veh_version)\n  ").run(t).lastInsertRowid })), n.handle("vehicles:checkout", (e, t, n) => ({ changes: o.prepare("\n    UPDATE psm_vehicles\n    SET veh_status      = 'S',\n        veh_egress_date = @egress_date,\n        veh_version     = veh_version + 1\n    WHERE veh_id = @id AND veh_status = 'P'\n  ").run({
	egress_date: n,
	id: t
}).changes })), n.handle("vehicles:delete", (e, t) => ({ changes: o.prepare("DELETE FROM psm_vehicles WHERE veh_id = ?").run(t).changes }));
//#endregion

//# sourceMappingURL=main.js.map