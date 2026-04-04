import { contextBridge, ipcRenderer } from "electron";
//#region electron/preload.ts
contextBridge.exposeInMainWorld("electronAPI", {
	parameters: {
		getAll: () => ipcRenderer.invoke("parameters:getAll"),
		getOne: (id) => ipcRenderer.invoke("parameters:getOne", id),
		create: (data) => ipcRenderer.invoke("parameters:create", data),
		update: (id, data) => ipcRenderer.invoke("parameters:update", id, data),
		delete: (id) => ipcRenderer.invoke("parameters:delete", id)
	},
	vehicles: {
		getAll: () => ipcRenderer.invoke("vehicles:getAll"),
		getActive: () => ipcRenderer.invoke("vehicles:getActive"),
		getOne: (id) => ipcRenderer.invoke("vehicles:getOne", id),
		create: (data) => ipcRenderer.invoke("vehicles:create", data),
		checkout: (id, egress_date) => ipcRenderer.invoke("vehicles:checkout", id, egress_date),
		delete: (id) => ipcRenderer.invoke("vehicles:delete", id)
	}
});
//#endregion

//# sourceMappingURL=preload.js.map