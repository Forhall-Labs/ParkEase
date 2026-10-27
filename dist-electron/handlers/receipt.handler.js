import { BrowserWindow, ipcMain } from 'electron';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeRuntimeLog } from '../utils/runtime-log.js';
/**
 * Impresión del tiquete replicando lo que ya funcionaba en la versión Java:
 * página de 58 mm de ancho exacto, sin márgenes y a tamaño real (ACTUAL_SIZE),
 * enviada a la impresora predeterminada.
 *
 * Imprimir desde una ventana con diálogo dejaba que el driver decidiera el
 * tamaño de papel y Chromium escalaba la página para ajustarla, que es lo que
 * recortaba el tiquete por la derecha.
 *
 * Cada intento queda en runtime.log (impresoras detectadas, cuál se usó y el
 * motivo de la falla) porque la impresora solo se puede diagnosticar en el
 * equipo del parqueo. Si la impresión silenciosa falla se abre el diálogo del
 * sistema, para que el usuario nunca quede sin tiquete sin enterarse.
 */
const TICKET_WIDTH_MM = 58;
const MICRONS_PER_MM = 1000;
const MICRONS_PER_PX = 25400 / 96;
/** Holgura para que el contenido nunca se desborde a una segunda página. */
const HEIGHT_SLACK_MM = 4;
/**
 * Alto mínimo igual al del tiquete de entrada del branch java (58 x 150 mm):
 * es una medida que el driver de la térmica ya acepta. Un alto arbitrario
 * puede no corresponder a ningún formulario del driver y quedarse sin imprimir.
 */
const MIN_HEIGHT_MM = 150;
/** El trabajo se encola de forma asíncrona: no destruir la ventana de inmediato. */
const SPOOL_GRACE_MS = 1500;
/**
 * webContents.print() puede no invocar nunca su callback (impresora apagada,
 * en pausa o sin responder). Sin este tope la promesa quedaba colgada para
 * siempre: ni se imprimía, ni fallaba, ni se abría el respaldo.
 */
const SILENT_TIMEOUT_MS = 20000;
/** El diálogo del sistema espera al usuario, así que necesita mucho más margen. */
const DIALOG_TIMEOUT_MS = 180000;
export function registerReceiptHandlers() {
    ipcMain.handle('receipts:print', (_e, html) => printTicket(html));
}
async function printTicket(html) {
    const workDir = mkdtempSync(join(tmpdir(), 'parkease-receipt-'));
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
        const file = join(workDir, 'receipt.html');
        writeFileSync(file, html, 'utf8');
        await win.loadFile(file);
        // El alto va del contenido, no del documento: scrollHeight nunca baja del
        // alto del viewport de la ventana oculta y daba páginas de 200 mm.
        const contentHeightPx = (await win.webContents.executeJavaScript('document.fonts.ready.then(function () { return Math.ceil(document.body.getBoundingClientRect().height); })'));
        const pageHeight = Math.max(Math.round(contentHeightPx * MICRONS_PER_PX) + HEIGHT_SLACK_MM * MICRONS_PER_MM, MIN_HEIGHT_MM * MICRONS_PER_MM);
        const printers = await win.webContents.getPrintersAsync();
        const target = defaultPrinterName(printers);
        writeRuntimeLog(`print: impresoras=[${printers.map((printer) => printer.name).join(', ')}] ` +
            `destino=${target ?? '(predeterminada del sistema)'} alto=${contentHeightPx}px`);
        if (printers.length === 0) {
            writeRuntimeLog('print: no hay impresoras instaladas');
            return { success: false, message: 'No hay impresoras instaladas en el sistema.' };
        }
        try {
            await withTimeout(sendToPrinter(win, pageHeight, target, true), SILENT_TIMEOUT_MS, 'La impresora no respondió al trabajo de impresión.');
            writeRuntimeLog('print: tiquete enviado a la impresora');
            return { success: true, message: target };
        }
        catch (silentError) {
            writeRuntimeLog(`print: falló la impresión silenciosa: ${describe(silentError)}`);
            // Último intento dentro de la app: que el usuario elija impresora y papel.
            await withTimeout(sendToPrinter(win, pageHeight, target, false), DIALOG_TIMEOUT_MS, 'El diálogo de impresión no se completó.');
            writeRuntimeLog('print: tiquete enviado desde el diálogo del sistema');
            return { success: true, message: target };
        }
    }
    catch (error) {
        const reason = describe(error);
        writeRuntimeLog(`print: error al preparar el tiquete: ${reason}`);
        return { success: false, message: reason };
    }
    finally {
        setTimeout(() => {
            if (!win.isDestroyed()) {
                win.destroy();
            }
            rmSync(workDir, { recursive: true, force: true });
        }, SPOOL_GRACE_MS);
    }
}
/**
 * PrinterInfo ya no expone `isDefault`: en las plataformas que lo reportan
 * viene dentro de `options`. Si no se puede determinar, se omite `deviceName`
 * y Electron usa la impresora predeterminada del sistema.
 */
function defaultPrinterName(printers) {
    const flagged = printers.find((printer) => printer.options?.['printer-is-default'] === 'true');
    return flagged?.name;
}
function sendToPrinter(win, pageHeight, deviceName, silent) {
    return new Promise((resolve, reject) => {
        win.webContents.print({
            silent,
            ...(deviceName ? { deviceName } : {}),
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
            reject(new Error(failureReason || 'El trabajo de impresión no se pudo enviar.'));
        });
    });
}
function withTimeout(promise, ms, message) {
    return Promise.race([
        promise,
        new Promise((_resolve, reject) => {
            setTimeout(() => reject(new Error(message)), ms).unref?.();
        }),
    ]);
}
function describe(error) {
    return error instanceof Error ? error.message : String(error);
}
