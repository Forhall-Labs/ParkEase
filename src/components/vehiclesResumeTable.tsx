import { useMemo, useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@mui/material';
import type { Vehicle, CreateVehicleDto } from '../types/electron-api';
import { t } from '../i18n';

interface PlateValidationResult {
  isValid: boolean;
  vehicleType: 'Regular' | 'Motorcycle' | 'Light truck' | null;
  errorMessage: string | null;
}

function validatePlate(plate: string): PlateValidationResult {
  if (!plate || plate.trim() === '') {
    return { isValid: false, vehicleType: null, errorMessage: t('validation.plateRequired') };
  }

  // Regular vehicle: 3 uppercase letters + "-" + 1-3 digits (e.g., BNX-799, ABC-123)
  const regularRegex = /^[A-Z]{3}-\d{1,3}$/;
  // Motorcycle: "MOT-" + 1-6 digits (e.g., MOT-123456)
  const motorcycleRegex = /^MOT-\d{1,6}$/;
  // Light truck: "CL-" + 1-6 digits (e.g., CL-123456)
  const lightTruckRegex = /^CL-\d{1,6}$/;

  if (regularRegex.test(plate)) {
    return { isValid: true, vehicleType: 'Regular', errorMessage: null };
  }

  if (motorcycleRegex.test(plate)) {
    return { isValid: true, vehicleType: 'Motorcycle', errorMessage: null };
  }

  if (lightTruckRegex.test(plate)) {
    return { isValid: true, vehicleType: 'Light truck', errorMessage: null };
  }

  return {
    isValid: false,
    vehicleType: null,
    errorMessage: t('validation.plateFormat'),
  };
}

interface VehiclesTableProps {
  theme?: 'dark' | 'light';
}

export function VehiclesTable({ theme = 'dark' }: VehiclesTableProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateVehicleDto>({
    veh_plate: '',
    veh_reference: '',
    veh_owner: '',
    veh_ingress_date: new Date().toISOString(),
    veh_tax: '',
    veh_version: 1,
  });

  function generateReference(): string {
    const num = Math.floor(Math.random() * 90000) + 10000;
    return `VEH-${num}`;
  }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultRate, setDefaultRate] = useState('');
  const [checkoutModal, setCheckoutModal] = useState<{
    open: boolean;
    vehicle: Vehicle | null;
    customTotal?: string;
  }>({
    open: false,
    vehicle: null,
  });
  const [plateValidation, setPlateValidation] = useState<PlateValidationResult | null>(null);

  const isLight = theme === 'light';

  useEffect(() => {
    loadVehicles();
    loadParameters();
  }, []);

  async function loadParameters() {
    try {
      const params = await window.electronAPI?.parameters?.getAll();
      if (params && params.length > 0) {
        setDefaultRate(params[0].par_quantity);
      }
    } catch (err) {
      console.error('Error loading parameters:', err);
    }
  }

  async function loadVehicles() {
    try {
      setLoading(true);
      const data = await window.electronAPI?.vehicles?.getActive();
      setVehicles(data || []);
    } catch (err) {
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  }

  useMemo(() => {
    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = searchFilter.trim().toLowerCase();

    if (!normalizedSearch) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => {
      const matchesPlate = vehicle.veh_plate?.toLowerCase().includes(normalizedSearch);
      const matchesReference = vehicle.veh_reference?.toLowerCase().includes(normalizedSearch);
      const matchesOwner = vehicle.veh_owner?.toLowerCase().includes(normalizedSearch);

      return matchesPlate || matchesReference || matchesOwner;
    });
  }, [searchFilter, vehicles]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const result = await window.electronAPI?.vehicles?.create(formData);
      if (result?.success) {
        setShowModal(false);
        resetForm();
        loadVehicles();
        printReceipt(formData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar vehículo');
    } finally {
      setSaving(false);
    }
  }

  function printReceipt(data: CreateVehicleDto) {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo de Parqueo</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; padding: 20px; width: 280px; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #0891b2; }
          .title { font-size: 18px; font-weight: bold; margin-top: 10px; }
          .subtitle { font-size: 12px; color: #64748b; margin-bottom: 20px; }
          .divider { border-bottom: 1px dashed #ccc; margin: 15px 0; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 12px; }
          .label { color: #64748b; }
          .value { font-weight: bold; }
          .total { font-size: 16px; font-weight: bold; color: #0891b2; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🅿️ ParkEase</div>
          <div class="title">Recibo de Ingreso</div>
          <div class="subtitle">Parqueo Parroquial San Marcos</div>
        </div>
        <div class="divider"></div>
        <div class="row">
          <span class="label">Placa:</span>
          <span class="value">${data.veh_plate}</span>
        </div>
        <div class="row">
          <span class="label">Propietario:</span>
          <span class="value">${data.veh_owner || 'N/A'}</span>
        </div>
        <div class="row">
          <span class="label">Fecha Ingreso:</span>
          <span class="value">${new Date(data.veh_ingress_date).toLocaleDateString('es-CR')}</span>
        </div>
        <div class="row">
          <span class="label">Hora Ingreso:</span>
          <span class="value">${new Date(data.veh_ingress_date).toLocaleTimeString('es-CR')}</span>
        </div>
        <div class="row">
          <span class="label">Tarifa:</span>
          <span class="value">${data.veh_tax ? parseFloat(data.veh_tax).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' }) : 'N/A'}</span>
        </div>
        <div class="row">
          <span class="label">Referencia:</span>
          <span class="value">${data.veh_reference}</span>
        </div>
        <div class="divider"></div>
        <div class="row">
          <span class="label">Hora de Salida:</span>
          <span class="value">Por definir</span>
        </div>
        <div class="footer">
          Gracias por usar ParkEase<br/>
          Conserve este recibo
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  }

  async function handleCheckout(id: number) {
    const vehicle = vehicles.find((v) => v.veh_id === id);
    if (vehicle) {
      const rate = vehicle.veh_tax || defaultRate;
      const total = calculateTotalValue(vehicle.veh_ingress_date, rate);
      setCheckoutModal({ open: true, vehicle, customTotal: total.toString() });
    }
  }

  async function confirmCheckout() {
    if (!checkoutModal.vehicle?.veh_id) return;
    try {
      await window.electronAPI?.vehicles?.checkout(
        checkoutModal.vehicle.veh_id,
        checkoutModal.customTotal
      );
      setCheckoutModal({ open: false, vehicle: null });
      loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al dar salida');
    }
  }

  function calculateTotalValue(ingressDate: string, tax: string): number {
    const ingress = new Date(ingressDate);
    const now = new Date();
    const hours = Math.ceil((now.getTime() - ingress.getTime()) / (1000 * 60 * 60));
    const rate = parseFloat(tax) || 0;
    return hours * rate;
  }

  function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('es-CR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  function resetForm() {
    setFormData({
      veh_plate: '',
      veh_reference: '',
      veh_owner: '',
      veh_ingress_date: new Date().toISOString(),
      veh_tax: '',
      veh_version: 1,
    });
  }

  function openNewModal() {
    resetForm();
    setFormData((prev: CreateVehicleDto) => ({
      ...prev,
      veh_ingress_date: new Date().toISOString(),
      veh_reference: generateReference(),
      veh_tax: defaultRate,
    }));
    setShowModal(true);
  }

  return (
    <>
      <div
        className={`overflow-hidden rounded-3xl border p-4 shadow-xl backdrop-blur-xl sm:p-6 ${
          isLight
            ? 'border-stone-300 bg-stone-50 shadow-stone-200/20'
            : 'border-white/10 bg-slate-900/70 shadow-slate-950/30'
        }`}
      >
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className={`text-lg font-semibold sm:text-xl ${isLight ? 'text-slate-900' : 'text-white'}`}
          >
            {t('vehicles.title')}
          </h2>
          <button
            onClick={openNewModal}
            className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            + {t('vehicles.addVehicle')}
          </button>
        </div>

        <div className="mb-4">
          <label className="block">
            <span
              className={`mb-1 block text-xs font-medium uppercase tracking-wide ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
            >
              {t('vehicles.searchFilter')}
            </span>
            <input
              type="text"
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
              placeholder="Búsqueda"
              className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 ${
                isLight
                  ? 'border-stone-300 bg-stone-50 text-slate-900 placeholder:text-slate-400'
                  : 'border-white/10 bg-slate-950/50 text-white placeholder:text-slate-500'
              }`}
            />
          </label>
        </div>

        <Paper
          className={`border! shadow-none! ${isLight ? 'bg-stone-50! border-stone-300!' : 'bg-slate-900/50! border-white/10!'}`}
        >
          <TableContainer className="max-w-full overflow-x-auto">
            <Table className="min-w-230">
              <TableHead>
                <TableRow
                  className={
                    isLight
                      ? 'bg-stone-100! hover:bg-stone-100!'
                      : 'bg-slate-950/50! hover:bg-slate-950/50!'
                  }
                >
                  <TableCell
                    className={
                      isLight
                        ? 'text-slate-700! font-semibold! border-b! border-stone-300!'
                        : 'text-cyan-200! font-semibold! border-b! border-white/10!'
                    }
                  >
                    {t('vehicles.plate')}
                  </TableCell>
                  <TableCell
                    className={
                      isLight
                        ? 'text-slate-700! font-semibold! border-b! border-stone-300!'
                        : 'text-cyan-200! font-semibold! border-b! border-white/10!'
                    }
                  >
                    {t('vehicles.owner')}
                  </TableCell>
                  <TableCell
                    className={
                      isLight
                        ? 'text-slate-700! font-semibold! border-b! border-stone-300!'
                        : 'text-cyan-200! font-semibold! border-b! border-white/10!'
                    }
                  >
                    {t('vehicles.reference')}
                  </TableCell>
                  <TableCell
                    className={
                      isLight
                        ? 'text-slate-700! font-semibold! border-b! border-stone-300!'
                        : 'text-cyan-200! font-semibold! border-b! border-white/10!'
                    }
                  >
                    {t('vehicles.ingressTime')}
                  </TableCell>
                  <TableCell
                    className={
                      isLight
                        ? 'text-slate-700! font-semibold! border-b! border-stone-300! text-center'
                        : 'text-cyan-200! font-semibold! border-b! border-white/10! text-center'
                    }
                  >
                    {t('vehicles.actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="border-b! border-white/5! py-6! text-center text-sm text-slate-400!"
                    >
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className={
                        isLight
                          ? 'border-b! border-stone-200! py-6! text-center text-sm text-slate-500!'
                          : 'border-b! border-white/5! py-6! text-center text-sm text-slate-400!'
                      }
                    >
                      {t('vehicles.noVehicles')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle.veh_id}
                      className={
                        isLight
                          ? 'hover:bg-stone-100! transition-colors'
                          : 'hover:bg-slate-800/50! transition-colors'
                      }
                    >
                      <TableCell
                        className={
                          isLight
                            ? 'text-slate-900! border-b! border-stone-200! py-4!'
                            : 'text-white! border-b! border-white/5! py-4!'
                        }
                      >
                        <span
                          className={`inline-block rounded-lg px-3 py-1 text-sm font-medium ${isLight ? 'bg-stone-100 text-slate-800' : 'bg-cyan-400/10 text-cyan-200'}`}
                        >
                          {vehicle.veh_plate}
                        </span>
                      </TableCell>
                      <TableCell
                        className={
                          isLight
                            ? 'text-slate-700! border-b! border-stone-200! py-4!'
                            : 'text-slate-200! border-b! border-white/5! py-4!'
                        }
                      >
                        {vehicle.veh_owner || '-'}
                      </TableCell>
                      <TableCell
                        className={
                          isLight
                            ? 'text-slate-700! border-b! border-stone-200! py-4!'
                            : 'text-slate-200! border-b! border-white/5! py-4!'
                        }
                      >
                        {vehicle.veh_reference}
                      </TableCell>
                      <TableCell
                        className={
                          isLight
                            ? 'text-slate-600! border-b! border-stone-200! py-4! text-sm'
                            : 'text-slate-300! border-b! border-white/5! py-4! text-sm'
                        }
                      >
                        {vehicle.veh_ingress_date
                          ? new Date(vehicle.veh_ingress_date).toLocaleString('es-ES')
                          : '-'}
                      </TableCell>
                      <TableCell
                        className={
                          isLight
                            ? 'border-b! border-stone-200! py-4!'
                            : 'border-b! border-white/5! py-4!'
                        }
                      >
                        <div className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
                          <button
                            onClick={() => handleCheckout(vehicle.veh_id!)}
                            className={`rounded-lg border px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                              isLight
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'border-green-500/30 bg-green-500/20 text-green-300 hover:bg-green-500/30'
                            }`}
                          >
                            {t('vehicles.checkout')}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
          >
            <h3
              className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
            >
              {t('vehicles.addVehicleTitle')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p
                  className={`rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-rose-400/30 bg-rose-500/10 text-rose-200'}`}
                >
                  {error}
                </p>
              )}
              <div>
                <label
                  className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('vehicles.plateLabel')} *
                </label>
                <input
                  type="text"
                  value={formData.veh_plate}
                  onChange={(e) => {
                    const plate = e.target.value.toUpperCase();
                    setFormData({ ...formData, veh_plate: plate });
                    setPlateValidation(validatePlate(plate));
                  }}
                  onBlur={() => {
                    if (formData.veh_plate) {
                      setPlateValidation(validatePlate(formData.veh_plate));
                    }
                  }}
                  required
                  placeholder="ABC-123"
                  className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                    plateValidation && !plateValidation.isValid
                      ? 'border-rose-400 bg-rose-500/10'
                      : isLight
                        ? 'border-stone-200 bg-white text-slate-900'
                        : 'border-white/10 bg-slate-800 text-white'
                  }`}
                />
                {plateValidation && !plateValidation.isValid && (
                  <p className="mt-1 text-sm text-rose-400">{plateValidation.errorMessage}</p>
                )}
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('vehicles.ownerLabel')}
                </label>
                <input
                  type="text"
                  value={formData.veh_owner}
                  onChange={(e) => setFormData({ ...formData, veh_owner: e.target.value })}
                  placeholder="Nombre del propietario"
                  className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className={`rounded-xl border px-4 py-2 font-medium transition ${
                    isLight
                      ? 'border-stone-200 text-slate-700 hover:bg-stone-100'
                      : 'border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving || (plateValidation ? !plateValidation.isValid : false)}
                  className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                  {saving ? t('vehicles.registering') : t('vehicles.register')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {checkoutModal.open && checkoutModal.vehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'
            }`}
          >
            <h3
              className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
            >
              Confirmar Salida
            </h3>

            <div
              className={`mb-4 rounded-xl border p-4 ${isLight ? 'border-stone-200 bg-stone-50' : 'border-white/10 bg-slate-800/50'}`}
            >
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('vehicles.plate')}
              </p>
              <p className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {checkoutModal.vehicle.veh_plate}
              </p>
            </div>

            <div className="mb-4 space-y-3">
              <div
                className={`rounded-xl border p-4 ${isLight ? 'border-stone-200 bg-stone-50' : 'border-white/10 bg-slate-800/50'}`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  {t('vehicles.ingressTime')}
                </p>
                <p
                  className={`mt-1 text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}
                >
                  {formatDateTime(checkoutModal.vehicle.veh_ingress_date)}
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 ${isLight ? 'border-stone-200 bg-stone-50' : 'border-white/10 bg-slate-800/50'}`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  {t('vehicles.exitTime')}
                </p>
                <p
                  className={`mt-1 text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}
                >
                  {formatDateTime(new Date().toISOString())}
                </p>
              </div>

              <div className={`rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4`}>
                <p className={`text-xs font-medium uppercase tracking-wide text-cyan-200`}>
                  {t('vehicles.totalToPay')}
                </p>
                <input
                  type="number"
                  value={checkoutModal.customTotal || ''}
                  onChange={(e) =>
                    setCheckoutModal({ ...checkoutModal, customTotal: e.target.value })
                  }
                  className={`mt-1 w-full rounded-lg border border-cyan-400/30 bg-slate-900 px-3 py-2 text-2xl font-bold text-cyan-400 outline-none focus:border-cyan-400`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCheckoutModal({ open: false, vehicle: null })}
                className={`rounded-xl border px-4 py-2 font-medium transition ${
                  isLight
                    ? 'border-stone-200 text-slate-700 hover:bg-stone-100'
                    : 'border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmCheckout}
                className="rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                {t('vehicles.confirmCheckout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
