import { app, BrowserWindow, screen } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { initDatabase } from './database/db.js';
import { registerUserHandlers } from './handlers/user.handler.js';
import { registerVehicleHandlers } from './handlers/vehicle.handler.js';
import { registerParameterHandlers } from './handlers/parameter.handler.js';
import { registerSessionHandlers } from './handlers/session.handler.js';
import { registerSettingHandlers } from './handlers/setting.handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function writeRuntimeLog(message: string): void {
  try {
    const logDir = app.getPath('userData');
    mkdirSync(logDir, { recursive: true });
    const logPath = join(logDir, 'runtime.log');
    appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`, 'utf8');
  } catch {
    // Do not crash the app if logging fails
  }
}

// ─── Ventana principal ────────────────────────────────────────────────────────

function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    maximizable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: 'default',
    show: false,
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.setZoomFactor(1);
    writeRuntimeLog('Renderer finished load successfully.');
  });

  win.webContents.on(
    'did-fail-load',
    (_event: unknown, errorCode: number, errorDescription: string, validatedURL: string) => {
      writeRuntimeLog(
        `did-fail-load: code=${errorCode} description=${errorDescription} url=${validatedURL}`
      );
    }
  );

  win.webContents.on(
    'render-process-gone',
    (_event: unknown, details: { reason: string; exitCode: number }) => {
      writeRuntimeLog(`render-process-gone: reason=${details.reason} exitCode=${details.exitCode}`);
    }
  );

  win.webContents.on(
    'console-message',
    (_event: unknown, level: number, message: string, line: number, sourceId: string) => {
      if (level >= 2) {
        writeRuntimeLog(`renderer-console(level=${level}): ${message} (${sourceId}:${line})`);
      }
    }
  );

  win.once('ready-to-show', () => win.show());

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    win.loadURL(devServerUrl);
    win.webContents.openDevTools();
  } else {
    const resourceIndexPath = join(
      process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(),
      'resources',
      'dist',
      'index.html'
    );
    const bundledIndexPath = join(__dirname, '../dist/index.html');
    const indexPath = existsSync(resourceIndexPath) ? resourceIndexPath : bundledIndexPath;

    writeRuntimeLog(
      `Loading production renderer from: ${indexPath} (resourceExists=${existsSync(resourceIndexPath)}, bundledExists=${existsSync(bundledIndexPath)})`
    );

    void win.loadFile(indexPath).catch((error: unknown) => {
      writeRuntimeLog(`loadFile failed: ${error instanceof Error ? error.message : String(error)}`);
    });
  }
}

// ─── Ciclo de vida ────────────────────────────────────────────────────────────

app
  .whenReady()
  .then(() => {
    writeRuntimeLog(`App ready. version=${app.getVersion()} packaged=${app.isPackaged}`);
    initDatabase();

    registerUserHandlers();
    registerVehicleHandlers();
    registerParameterHandlers();
    registerSessionHandlers();
    registerSettingHandlers();

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err: unknown) => {
    writeRuntimeLog(
      `Startup failure: ${err instanceof Error ? err.stack || err.message : String(err)}`
    );
    console.error('Failed to start Electron app:', err);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
