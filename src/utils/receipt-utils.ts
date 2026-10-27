import { getLanguage, t } from '../i18n';

export interface ReceiptLine {
  label: string;
  value: string;
  /** Resalta la línea (se usa para el monto pagado). */
  emphasis?: boolean;
}

export interface PrintOutcome {
  success: boolean;
  message?: string;
}

export interface ReceiptContent {
  parkingName: string;
  title: string;
  /** Cada grupo se imprime separado por una línea punteada. */
  groups: ReceiptLine[][];
  thankYou: string;
  keepReceipt: string;
  footerLines: string[];
}

/**
 * El tiquete replica el formato de la versión Java, que imprime bien en la
 * térmica: página de 58 mm, todo centrado y cada dato en dos renglones
 * (etiqueta arriba, valor abajo) en lugar de etiqueta y valor en la misma
 * línea. Así ninguna línea se acerca al borde del área imprimible (48 mm) y
 * no queda nada cortado, sea cual sea el margen físico del cabezal.
 */
const PAGE_WIDTH_MM = 58;
/** Margen lateral: deja el contenido en los 46 mm centrales de los 58 mm. */
const SIDE_PADDING_MM = 6;

export function buildReceiptHtml(content: ReceiptContent, autoPrint = false): string {
  const body = content.groups
    .map((group) => group.map(renderLine).join('\n'))
    .join('\n        <div class="divider"></div>\n');

  const footer = content.footerLines.filter(Boolean).map(escapeHtml).join('<br/>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(content.title)}</title>
  <style>
    @page { size: ${PAGE_WIDTH_MM}mm auto; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${PAGE_WIDTH_MM}mm; }
    body {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 13px;
      line-height: 1.25;
      padding: 3mm ${SIDE_PADDING_MM}mm;
      text-align: center;
      color: #000;
      overflow-wrap: anywhere;
    }
    .logo { font-size: 15px; font-weight: 800; }
    .title { font-size: 14px; font-weight: 700; margin-top: 1.5mm; }
    .divider { width: 80%; border-bottom: 1px dashed #000; margin: 2.5mm auto; }
    .field { margin: 1.8mm 0; }
    .field-label { font-weight: 700; }
    .field-value { font-weight: 400; }
    .field.total .field-label,
    .field.total .field-value { font-size: 15px; font-weight: 800; }
    .footer { margin-top: 3mm; font-size: 10px; line-height: 1.4; }
    .footer-thanks { font-weight: 700; margin-bottom: 1mm; }
    .footer-info { margin-top: 2mm; }
  </style>
</head>
<body>
  <div class="logo">${escapeHtml(content.parkingName)}</div>
  <div class="title">${escapeHtml(content.title)}</div>
  <div class="divider"></div>
${body}
  <div class="divider"></div>
  <div class="footer">
    <div class="footer-thanks">${escapeHtml(content.thankYou)}</div>
    <div>${escapeHtml(content.keepReceipt)}</div>
    ${footer ? `<div class="footer-info">${footer}</div>` : ''}
  </div>
${autoPrint ? '  <script>window.onload = function () { window.print(); };</script>\n' : ''}</body>
</html>
`;
}

/**
 * Imprime por el proceso principal (tamaño real, sin diálogo, como el Java).
 * Si eso falla —por ejemplo sin impresoras instaladas— abre la ventana con el
 * diálogo del sistema y devuelve el motivo, que la vista muestra al usuario:
 * una impresión que falla en silencio parece que el botón no hace nada.
 */
export async function printReceipt(content: ReceiptContent): Promise<PrintOutcome> {
  let reason = 'La impresión directa no está disponible.';

  try {
    const result = await window.electronAPI?.receipts?.print(buildReceiptHtml(content));

    if (result?.success) {
      return { success: true, message: result.message };
    }

    if (result?.message) {
      reason = result.message;
    }
  } catch (error) {
    reason = error instanceof Error ? error.message : String(error);
  }

  openPrintWindow(buildReceiptHtml(content, true));

  return { success: false, message: `${t('receipt.printFailed')}: ${reason}` };
}

function openPrintWindow(html: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank', 'width=260,height=600');

  if (printWindow) {
    printWindow.addEventListener('beforeunload', () => URL.revokeObjectURL(url));
  }
}

// ─── Datos del parqueo y armado de los dos tiquetes ───────────────────────────

export interface ParkingInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface EntryReceiptData {
  plate: string;
  owner?: string | null;
  reference: string;
  ingressDate: string;
  tax?: string;
}

export interface ExitReceiptData {
  plate: string;
  owner?: string | null;
  reference: string;
  ingressDate: string;
  egressDate: string;
  total: string;
}

const DEFAULT_PARKING_NAME = 'ParkEase';

export async function getParkingInfo(): Promise<ParkingInfo> {
  try {
    const [name, address, phone, email] = await Promise.all([
      window.electronAPI?.settings?.get('parking_name'),
      window.electronAPI?.settings?.get('parking_address'),
      window.electronAPI?.settings?.get('parking_phone'),
      window.electronAPI?.settings?.get('parking_email'),
    ]);

    return {
      name: name || DEFAULT_PARKING_NAME,
      address: address ?? '',
      phone: phone ?? '',
      email: email ?? '',
    };
  } catch {
    return { name: DEFAULT_PARKING_NAME, address: '', phone: '', email: '' };
  }
}

export function buildEntryReceipt(data: EntryReceiptData, parking: ParkingInfo): ReceiptContent {
  return {
    parkingName: parking.name || DEFAULT_PARKING_NAME,
    title: t('receipt.entryTitle'),
    groups: [
      [
        { label: t('receipt.plate'), value: data.plate },
        { label: t('receipt.owner'), value: data.owner || t('receipt.notAvailable') },
        { label: t('receipt.entryDate'), value: formatDate(data.ingressDate) },
        { label: t('receipt.entryTime'), value: formatTime(data.ingressDate) },
        {
          label: t('receipt.rate'),
          value: data.tax ? formatAmount(data.tax) : t('receipt.notAvailable'),
        },
        { label: t('receipt.reference'), value: data.reference },
      ],
      [{ label: t('receipt.exitTime'), value: t('receipt.exitPending') }],
    ],
    ...commonFooter(parking),
  };
}

export function buildExitReceipt(data: ExitReceiptData, parking: ParkingInfo): ReceiptContent {
  return {
    parkingName: parking.name || DEFAULT_PARKING_NAME,
    title: t('receipt.exitTitle'),
    groups: [
      [
        { label: t('receipt.plate'), value: data.plate },
        { label: t('receipt.owner'), value: data.owner || t('receipt.notAvailable') },
        { label: t('receipt.reference'), value: data.reference },
        { label: t('receipt.entry'), value: formatDateTime(data.ingressDate) },
        { label: t('receipt.exit'), value: formatDateTime(data.egressDate) },
      ],
      [{ label: t('receipt.amountPaid'), value: formatAmount(data.total), emphasis: true }],
    ],
    ...commonFooter(parking),
  };
}

export function printEntryReceipt(data: EntryReceiptData): Promise<PrintOutcome> {
  return getParkingInfo().then((parking) => printReceipt(buildEntryReceipt(data, parking)));
}

export function printExitReceipt(data: ExitReceiptData): Promise<PrintOutcome> {
  return getParkingInfo().then((parking) => printReceipt(buildExitReceipt(data, parking)));
}

function commonFooter(
  parking: ParkingInfo
): Pick<ReceiptContent, 'thankYou' | 'keepReceipt' | 'footerLines'> {
  return {
    thankYou: t('receipt.thankYou'),
    keepReceipt: t('receipt.keepReceipt'),
    footerLines: [
      parking.name || DEFAULT_PARKING_NAME,
      parking.address,
      parking.phone ? `${t('receipt.phone')} ${parking.phone}` : '',
      parking.email,
    ],
  };
}

function locale(): string {
  return getLanguage() === 'en' ? 'en-US' : 'es-CR';
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(locale());
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(value: string): string {
  return `${formatDate(value)} ${formatTime(value)}`;
}

function formatAmount(value: string): string {
  const amount = parseFloat(value);

  return Number.isFinite(amount)
    ? amount.toLocaleString(locale(), { style: 'currency', currency: 'CRC' })
    : value;
}

function renderLine(line: ReceiptLine): string {
  return `  <div class="field${line.emphasis ? ' total' : ''}">
    <div class="field-label">${escapeHtml(line.label)}</div>
    <div class="field-value">${escapeHtml(line.value)}</div>
  </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
