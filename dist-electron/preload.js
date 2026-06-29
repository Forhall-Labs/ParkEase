import { contextBridge as e, ipcRenderer as t } from "electron";
//#region electron/preload.ts
e.exposeInMainWorld("electronAPI", {
	users: {
		getAll: () => t.invoke("users:getAll"),
		getOne: (e) => t.invoke("users:getOne", e),
		login: (e) => t.invoke("users:login", e),
		create: (e) => t.invoke("users:create", e),
		update: (e, n) => t.invoke("users:update", e, n),
		changePassword: (e, n, r) => t.invoke("users:changePassword", e, n, r),
		deactivate: (e) => t.invoke("users:deactivate", e),
		delete: (e) => t.invoke("users:delete", e)
	},
	vehicles: {
		getAll: () => t.invoke("vehicles:getAll"),
		getActive: () => t.invoke("vehicles:getActive"),
		getOne: (e) => t.invoke("vehicles:getOne", e),
		create: (e) => t.invoke("vehicles:create", e),
		checkout: (e, n) => t.invoke("vehicles:checkout", e, n),
		update: (e, n) => t.invoke("vehicles:update", e, n),
		delete: (e) => t.invoke("vehicles:delete", e),
		getStats: () => t.invoke("vehicles:getStats"),
		getParkedCount: () => t.invoke("vehicles:getParkedCount"),
		getTodayRevenue: () => t.invoke("vehicles:getTodayRevenue"),
		getTodayVehicles: () => t.invoke("vehicles:getTodayVehicles"),
		getReport: (e, n) => t.invoke("vehicles:getReport", e, n)
	},
	parameters: {
		getAll: () => t.invoke("parameters:getAll"),
		getOne: (e) => t.invoke("parameters:getOne", e),
		getDefault: () => t.invoke("parameters:getDefault"),
		create: (e) => t.invoke("parameters:create", e),
		update: (e, n) => t.invoke("parameters:update", e, n),
		setDefault: (e) => t.invoke("parameters:setDefault", e)
	},
	session: {
		save: (e) => t.invoke("session:save", e),
		restore: () => t.invoke("session:restore"),
		clear: () => t.invoke("session:clear")
	},
	settings: {
		getAll: () => t.invoke("settings:getAll"),
		get: (e) => t.invoke("settings:get", e),
		save: (e, n) => t.invoke("settings:save", e, n)
	}
});
//#endregion

//# sourceMappingURL=preload.js.map