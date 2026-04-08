import { app, BrowserWindow } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database/db.js';
import { registerUserHandlers } from './handlers/user.handler.js';
import { registerVehicleHandlers } from './handlers/vehicle.handler.js';
import { registerParameterHandlers } from './handlers/parameter.handler.js';
import { registerSessionHandlers } from './handlers/session.handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Ventana principal ────────────────────────────────────────────────────────

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: 'default',
    show: false,
  });

  win.once('ready-to-show', () => win.show());

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    win.loadURL(devServerUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'));
  }
}

// ─── Ciclo de vida ────────────────────────────────────────────────────────────

app
  .whenReady()
  .then(() => {
    initDatabase();

    registerUserHandlers();
    registerVehicleHandlers();
    registerParameterHandlers();
    registerSessionHandlers();

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err) => {
    console.error('Failed to start Electron app:', err);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
