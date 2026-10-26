import { describe, it, expect } from 'vitest';
import {
  buildEntryReceipt,
  buildExitReceipt,
  buildReceiptHtml,
  type ReceiptContent,
} from '../receipt-utils';

const content: ReceiptContent = {
  parkingName: 'Parqueo Don Pepe',
  title: 'Recibo de Parqueo',
  groups: [
    [
      { label: 'Placa', value: '513608' },
      { label: 'Propietario', value: 'gris terios' },
    ],
    [{ label: 'Monto Pagado', value: '₡700', emphasis: true }],
  ],
  thankYou: '¡Gracias por su visita!',
  keepReceipt: 'Conserve este recibo',
  footerLines: ['Parqueo Don Pepe', '', 'Tel: 87057301', 'parqueodonpepe26@gmail.com'],
};

describe('buildReceiptHtml', () => {
  it('uses the 58mm page and centered margins proven on the thermal printer', () => {
    const html = buildReceiptHtml(content);

    expect(html).toContain('@page { size: 58mm auto; margin: 0; }');
    expect(html).toContain('padding: 3mm 6mm');
    expect(html).toContain('text-align: center');
  });

  it('stacks each field as label over value instead of one shared line', () => {
    const html = buildReceiptHtml(content);

    expect(html).toContain('<div class="field-label">Placa</div>');
    expect(html).toContain('<div class="field-value">513608</div>');
    expect(html).toContain('class="field total"');
    // Encabezado, separación entre grupos y pie.
    expect(html.match(/class="divider"/g)).toHaveLength(3);
    expect(html).toContain('Tel: 87057301<br/>parqueodonpepe26@gmail.com');
  });

  it('only auto-prints on the fallback window path', () => {
    expect(buildReceiptHtml(content)).not.toContain('window.print()');
    expect(buildReceiptHtml(content, true)).toContain('window.print()');
  });

  it('escapes values coming from settings and user input', () => {
    const html = buildReceiptHtml({
      ...content,
      groups: [[{ label: 'Placa', value: '<img src=x>' }]],
    });

    expect(html).toContain('&lt;img src=x&gt;');
  });
});

describe('buildExitReceipt', () => {
  const parking = {
    name: 'Parqueo Don Pepe',
    address: 'San Marcos, Costa Rica',
    phone: '87057301',
    email: 'parqueodonpepe26@gmail.com',
  };

  const exitData = {
    plate: '513608',
    owner: 'gris terios',
    reference: 'VEH-86312',
    ingressDate: '2026-08-13T16:10:00.000Z',
    egressDate: '2026-08-13T18:40:00.000Z',
    total: '700',
  };

  it('lists the exit fields and highlights the amount paid', () => {
    const receipt = buildExitReceipt(exitData, parking);

    expect(receipt.title).toBe('Recibo de Salida');
    expect(receipt.groups[0].map((line) => line.label)).toEqual([
      'Placa',
      'Propietario',
      'Referencia',
      'Ingreso',
      'Salida',
    ]);
    expect(receipt.groups[1]).toEqual([
      { label: 'Monto Pagado', value: expect.stringContaining('700'), emphasis: true },
    ]);
  });

  it('falls back to N/A when the vehicle has no owner', () => {
    const receipt = buildExitReceipt({ ...exitData, owner: null }, parking);

    expect(receipt.groups[0][1]).toEqual({ label: 'Propietario', value: 'N/A' });
  });

  it('keeps the parking data in the footer', () => {
    const receipt = buildExitReceipt(exitData, parking);

    expect(receipt.footerLines).toEqual([
      'Parqueo Don Pepe',
      'San Marcos, Costa Rica',
      'Tel: 87057301',
      'parqueodonpepe26@gmail.com',
    ]);
  });
});

describe('buildEntryReceipt', () => {
  it('leaves the exit time pending', () => {
    const receipt = buildEntryReceipt(
      {
        plate: '513608',
        owner: 'gris terios',
        reference: 'VEH-86312',
        ingressDate: '2026-08-13T16:10:00.000Z',
        tax: '700',
      },
      { name: 'Parqueo Don Pepe', address: '', phone: '', email: '' }
    );

    expect(receipt.title).toBe('Recibo de Parqueo');
    expect(receipt.groups[1]).toEqual([{ label: 'Hora de Salida', value: 'Por definir' }]);
    expect(receipt.footerLines.filter(Boolean)).toEqual(['Parqueo Don Pepe']);
  });
});
