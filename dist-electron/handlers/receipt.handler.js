import { BrowserWindow, ipcMain } from 'electron';
/**
 * Impresión del tiquete replicando lo que ya funcionaba en la versión Java:
 * página de 58 mm de ancho exacto, sin márgenes y a tamaño real (ACTUAL_SIZE),
 * enviada directo a la impresora predeterminada.
 *
 * Imprimir desde una ventana con diálogo dejaba que el driver decidiera el
 * tamaño de papel y Chromium escalaba la página para ajustarla, que es lo que
 * recortaba el tiquete por la derecha.
 */
const TICKET_WIDTH_MM = 58;
const MICRONS_PER_MM = 1000;
const MICRONS_PER_PX = 25400 / 96;
/** Holgura para que el contenido nunca se desborde a una segunda página. */
const HEIGHT_SLACK_MM = 4;
export function registerReceiptHandlers() {
    ipcMain.handle('receipts:print', async (_e, html) => {
        const win = new BrowserWindow({
            show: false,
            width: Math.round((TICKET_WIDTH_MM * 96) / 25.4),
            height: 800,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: true,
            },
        });
        try {
            await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
            const contentHeightPx = (await win.webContents.executeJavaScript('document.documentElement.scrollHeight'));
            const pageHeight = Math.round(contentHeightPx * MICRONS_PER_PX) + HEIGHT_SLACK_MM * MICRONS_PER_MM;
            await printPage(win, pageHeight);
            return { success: true };
        }
        catch (error) {
            return { success: false, message: error instanceof Error ? error.message : String(error) };
        }
        finally {
            win.destroy();
        }
    });
}
function printPage(win, pageHeight) {
    return new Promise((resolve, reject) => {
        win.webContents.print({
            silent: true,
            printBackground: false,
            margins: { marginType: 'none' },
            pageSize: { width: TICKET_WIDTH_MM * MICRONS_PER_MM, height: pageHeight },
            scaleFactor: 100,
            copies: 1,
        }, (success, failureReason) => {
            if (success) {
                resolve();
                return;
            }
            reject(new Error(failureReason || 'No se pudo imprimir el tiquete.'));
        });
    });
}
