import { contextBridge as e, ipcRenderer as t } from "electron";
//#region electron/preload.ts
e.exposeInMainWorld("electronAPI", {
	parameters: {
		getAll: () => t.invoke("parameters:getAll"),
		getOne: (e) => t.invoke("parameters:getOne", e),
		create: (e) => t.invoke("parameters:create", e),
		update: (e, n) => t.invoke("parameters:update", e, n),
		delete: (e) => t.invoke("parameters:delete", e)
	},
	vehicles: {
		getAll: () => t.invoke("vehicles:getAll"),
		getActive: () => t.invoke("vehicles:getActive"),
		getOne: (e) => t.invoke("vehicles:getOne", e),
		create: (e) => t.invoke("vehicles:create", e),
		checkout: (e, n) => t.invoke("vehicles:checkout", e, n),
		delete: (e) => t.invoke("vehicles:delete", e)
	}
});
//#endregion

//# sourceMappingURL=preload.js.map