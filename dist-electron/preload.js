import { contextBridge, ipcRenderer } from "electron";
//#region electron/preload.ts
contextBridge.exposeInMainWorld("electronAPI", {
	users: {
		getAll: () => ipcRenderer.invoke("users:getAll"),
		getOne: (id) => ipcRenderer.invoke("users:getOne", id),
		login: (dto) => ipcRenderer.invoke("users:login", dto),
		create: (dto) => ipcRenderer.invoke("users:create", dto),
		update: (id, dto) => ipcRenderer.invoke("users:update", id, dto),
		changePassword: (id, currentPassword, newPassword) => ipcRenderer.invoke("users:changePassword", id, currentPassword, newPassword),
		deactivate: (id) => ipcRenderer.invoke("users:deactivate", id),
		delete: (id) => ipcRenderer.invoke("users:delete", id)
	},
	vehicles: {
		getAll: () => ipcRenderer.invoke("vehicles:getAll"),
		getActive: () => ipcRenderer.invoke("vehicles:getActive"),
		getOne: (id) => ipcRenderer.invoke("vehicles:getOne", id),
		create: (dto) => ipcRenderer.invoke("vehicles:create", dto),
		checkout: (id, total) => ipcRenderer.invoke("vehicles:checkout", id, total),
		update: (id, dto) => ipcRenderer.invoke("vehicles:update", id, dto),
		delete: (id) => ipcRenderer.invoke("vehicles:delete", id),
		getStats: () => ipcRenderer.invoke("vehicles:getStats"),
		getParkedCount: () => ipcRenderer.invoke("vehicles:getParkedCount"),
		getTodayRevenue: () => ipcRenderer.invoke("vehicles:getTodayRevenue"),
		getTodayVehicles: () => ipcRenderer.invoke("vehicles:getTodayVehicles"),
		getReport: (period, selectedDate) => ipcRenderer.invoke("vehicles:getReport", period, selectedDate)
	},
	parameters: {
		getAll: () => ipcRenderer.invoke("parameters:getAll"),
		getOne: (id) => ipcRenderer.invoke("parameters:getOne", id),
		getDefault: () => ipcRenderer.invoke("parameters:getDefault"),
		create: (dto) => ipcRenderer.invoke("parameters:create", dto),
		update: (id, dto) => ipcRenderer.invoke("parameters:update", id, dto),
		setDefault: (id) => ipcRenderer.invoke("parameters:setDefault", id)
	},
	session: {
		save: (user) => ipcRenderer.invoke("session:save", user),
		restore: () => ipcRenderer.invoke("session:restore"),
		clear: () => ipcRenderer.invoke("session:clear")
	},
	settings: {
		getAll: () => ipcRenderer.invoke("settings:getAll"),
		get: (key) => ipcRenderer.invoke("settings:get", key),
		save: (key, value) => ipcRenderer.invoke("settings:save", key, value)
	}
});
//#endregion

//# sourceMappingURL=preload.js.map