import { useCallback, useMemo, useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import type { Vehicle, CreateVehicleDto, Parameter } from '../types/electron-api';
import { t } from '../i18n';
import { ConfirmModal, ModalShell } from './UI/Modal';
import { Button, Card, Input, SectionHeader } from './primitives';
import { autoFormatPlate, validatePlate, type PlateValidationResult } from '../utils/plate-utils';

interface VehiclesTableProps {
  theme?: 'dark' | 'light';
  triggerQuickAddToken?: number;
  onQuickAddHandled?: () => void;
  isAdmin?: boolean;
}

export function VehiclesTable({
  theme = 'dark',
  triggerQuickAddToken,
  onQuickAddHandled,
  isAdmin = false,
}: VehiclesTableProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
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
  const [tariffs, setTariffs] = useState<Parameter[]>([]);
  const [selectedTariffId, setSelectedTariffId] = useState('');
  const [defaultTariffId, setDefaultTariffId] = useState<number | null>(null);
  const [defaultRate, setDefaultRate] = useState('');
  const [checkoutModal, setCheckoutModal] = useState<{
    open: boolean;
    vehicle: Vehicle | null;
    customTotal?: string;
    breakdown?: {
      entryTime: Date;
      exitTime: Date;
      durationMinutes: number;
      firstHourCost: number;
      additionalMinutes: number;
      additionalCost: number;
      subtotal: number;
      roundedTotal: number;
    };
  }>({
    open: false,
    vehicle: null,
  });
  const [plateValidation, setPlateValidation] = useState<PlateValidationResult | null>(null);
  const [parkingInfo, setParkingInfo] = useState({
    name: 'ParkEase',
    address: '',
    phone: '',
    email: '',
  });

  const isLight = theme === 'light';

  useEffect(() => {
    loadVehicles();
    loadParameters();
    loadParkingInfo();
  }, []);

  async function loadParkingInfo() {
    try {
      const [name, address, phone, email] = await Promise.all([
        window.electronAPI?.settings?.get('parking_name'),
        window.electronAPI?.settings?.get('parking_address'),
        window.electronAPI?.settings?.get('parking_phone'),
        window.electronAPI?.settings?.get('parking_email'),
      ]);
      setParkingInfo({
        name: name ?? 'ParkEase',
        address: address ?? '',
        phone: phone ?? '',
        email: email ?? '',
      });
    } catch {
      // keep defaults
    }
  }

  async function loadParameters() {
    try {
      const [params, defaultTariff] = await Promise.all([
        window.electronAPI?.parameters?.getAll(),
        window.electronAPI?.parameters?.getDefault(),
      ]);

      const allTariffs = params || [];
      setTariffs(allTariffs);

      if (defaultTariff?.par_id) {
        setDefaultTariffId(defaultTariff.par_id);
        setDefaultRate(defaultTariff.par_amount);
      } else {
        setDefaultTariffId(null);
        setDefaultRate('');
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

      const selectedTariff = tariffs.find((tariff) => String(tariff.par_id) === selectedTariffId);
      const fallbackTariff = defaultTariffId
        ? tariffs.find((tariff) => tariff.par_id === defaultTariffId)
        : undefined;
      const finalTariff = selectedTariff || fallbackTariff;

      if (!finalTariff) {
        setError(t('vehicles.noDefaultTariff'));
        return;
      }

      const payload: CreateVehicleDto = {
        ...formData,
        veh_tax: finalTariff.par_amount,
      };

      const result = await window.electronAPI?.vehicles?.create(payload);
      if (result?.success) {
        setShowAddModal(false);
        resetForm();
        setSelectedTariffId('');
        loadVehicles();
        printReceipt(payload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar vehículo');
    } finally {
      setSaving(false);
    }
  }

  function printReceipt(data: CreateVehicleDto) {
    const lang = localStorage.getItem('app-language') || 'es';
    const isEnglish = lang === 'en';

    const labels = {
      title: isEnglish ? 'Parking Receipt' : 'Recibo de Parqueo',
      plate: isEnglish ? 'Plate' : 'Placa',
      owner: isEnglish ? 'Owner' : 'Propietario',
      entryDate: isEnglish ? 'Entry Date' : 'Fecha Ingreso',
      entryTime: isEnglish ? 'Entry Time' : 'Hora Ingreso',
      rate: isEnglish ? 'Rate' : 'Tarifa',
      reference: isEnglish ? 'Reference' : 'Referencia',
      exitTime: isEnglish ? 'Exit Time' : 'Hora de Salida',
      exitTimeValue: isEnglish ? 'To be defined' : 'Por definir',
      thankYou: isEnglish ? 'Thank you for your visit!' : '¡Gracias por su visita!',
      keepReceipt: isEnglish ? 'Keep this receipt' : 'Conserve este recibo',
    };

    const parkingName = parkingInfo.name || 'ParkEase';
    const footerLines = [
      parkingName,
      parkingInfo.address,
      parkingInfo.phone
        ? isEnglish
          ? `Tel: ${parkingInfo.phone}`
          : `Tel: ${parkingInfo.phone}`
        : '',
      parkingInfo.email,
    ]
      .filter(Boolean)
      .join('\n');

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${labels.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; padding: 20px; width: 280px; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #0891b2; }
          .title { font-size: 18px; font-weight: bold; margin-top: 10px; }
          .divider { border-bottom: 1px dashed #ccc; margin: 15px 0; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 12px; }
          .label { color: #64748b; }
          .value { font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px dashed #ccc; font-size: 10px; color: #64748b; white-space: pre-line; line-height: 1.6; }
          .footer-thanks { font-size: 11px; font-weight: bold; color: #0891b2; margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🅿️ ${parkingName}</div>
          <div class="title">${labels.title}</div>
        </div>
        <div class="divider"></div>
        <div class="row">
          <span class="label">${labels.plate}:</span>
          <span class="value">${data.veh_plate}</span>
        </div>
        <div class="row">
          <span class="label">${labels.owner}:</span>
          <span class="value">${data.veh_owner || 'N/A'}</span>
        </div>
        <div class="row">
          <span class="label">${labels.entryDate}:</span>
          <span class="value">${new Date(data.veh_ingress_date).toLocaleDateString('es-CR')}</span>
        </div>
        <div class="row">
          <span class="label">${labels.entryTime}:</span>
          <span class="value">${new Date(data.veh_ingress_date).toLocaleTimeString('es-CR')}</span>
        </div>
        <div class="row">
          <span class="label">${labels.rate}:</span>
          <span class="value">${data.veh_tax ? parseFloat(data.veh_tax).toLocaleString('es-CR', { style: 'currency', currency: 'CRC' }) : 'N/A'}</span>
        </div>
        <div class="row">
          <span class="label">${labels.reference}:</span>
          <span class="value">${data.veh_reference}</span>
        </div>
        <div class="divider"></div>
        <div class="row">
          <span class="label">${labels.exitTime}:</span>
          <span class="value">${labels.exitTimeValue}</span>
        </div>
        <div class="footer">
          <div class="footer-thanks">${labels.thankYou}</div>
          <div>${labels.keepReceipt}</div>
          ${footerLines ? `<div style="margin-top:8px">${footerLines.replace(/\n/g, '<br/>')}</div>` : ''}
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank', 'width=400,height=650');
    if (printWindow) {
      printWindow.addEventListener('beforeunload', () => URL.revokeObjectURL(url));
    }
  }

  function printVehicleReceipt(vehicle: Vehicle) {
    printReceipt({
      veh_plate: vehicle.veh_plate,
      veh_reference: vehicle.veh_reference,
      veh_owner: vehicle.veh_owner || '',
      veh_ingress_date: vehicle.veh_ingress_date,
      veh_tax: vehicle.veh_tax,
      veh_version: vehicle.veh_version,
    });
  }

  async function handleCheckout(id: number) {
    const vehicle = vehicles.find((v) => v.veh_id === id);
    if (vehicle) {
      const rate = parseFloat(vehicle.veh_tax || defaultRate) || 0;
      const breakdown = calculateFeeBreakdown(vehicle.veh_ingress_date, rate);
      setCheckoutModal({
        open: true,
        vehicle,
        customTotal: breakdown.roundedTotal.toString(),
        breakdown,
      });
    }
  }

  async function handleDeleteVehicle(id: number) {
    setVehicleToDelete(id);
    setShowDeleteModal(true);
  }

  async function confirmDeleteVehicle() {
    if (vehicleToDelete === null) return;
    try {
      await window.electronAPI?.vehicles?.delete(vehicleToDelete);
      loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    }
    setShowDeleteModal(false);
    setVehicleToDelete(null);
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

  function calculateFeeBreakdown(
    ingressDate: string,
    hourlyRate: number
  ): {
    entryTime: Date;
    exitTime: Date;
    durationMinutes: number;
    firstHourCost: number;
    additionalMinutes: number;
    additionalCost: number;
    subtotal: number;
    roundedTotal: number;
  } {
    const entryTime = new Date(ingressDate);
    const exitTime = new Date();
    const totalMinutes = Math.ceil((exitTime.getTime() - entryTime.getTime()) / (1000 * 60));
    const durationMinutes = Math.max(1, totalMinutes);

    const firstHourCost = hourlyRate;
    const additionalMinutes = Math.max(0, durationMinutes - 60);
    const additionalCost = additionalMinutes * 10;
    const subtotal = firstHourCost + additionalCost;
    const roundedTotal = Math.ceil(subtotal / 50) * 50;

    return {
      entryTime,
      exitTime,
      durationMinutes,
      firstHourCost,
      additionalMinutes,
      additionalCost,
      subtotal,
      roundedTotal,
    };
  }

  function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('es-CR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  const resetForm = useCallback(() => {
    setFormData({
      veh_plate: '',
      veh_reference: '',
      veh_owner: '',
      veh_ingress_date: new Date().toISOString(),
      veh_tax: '',
      veh_version: 1,
    });
  }, []);

  const openNewModal = useCallback(() => {
    resetForm();
    setFormData((prev: CreateVehicleDto) => ({
      ...prev,
      veh_ingress_date: new Date().toISOString(),
      veh_reference: generateReference(),
      veh_tax: defaultRate,
    }));
    setSelectedTariffId(defaultTariffId ? String(defaultTariffId) : '');
    setShowAddModal(true);
  }, [defaultRate, defaultTariffId, resetForm]);

  useEffect(() => {
    if (!triggerQuickAddToken) {
      return;
    }

    openNewModal();
    onQuickAddHandled?.();
  }, [triggerQuickAddToken, openNewModal, onQuickAddHandled]);

  function formatTariffOption(tariff: Parameter): string {
    const amount = Number(tariff.par_amount);
    const formatted = Number.isFinite(amount)
      ? amount.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })
      : tariff.par_amount;

    return `${tariff.par_name} - ${formatted}`;
  }

  return (
    <>
      <Card
        variant="panel"
        className={`ui-section-padding shadow-xl ${
          isLight ? 'border-stone-300 bg-stone-50' : 'border-white/10 bg-slate-900/70'
        }`}
      >
        <SectionHeader
          label={t('vehicles.title')}
          title={t('vehicles.title')}
          subtitle={t('vehicles.description')}
          action={
            <Button type="button" onClick={openNewModal} variant="filled">
              + {t('vehicles.addVehicle')}
            </Button>
          }
          className="mb-4"
        />

        <div className="mb-4">
          <label className="block">
            <span
              className={`mb-1 block text-xs font-medium uppercase tracking-wide ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
            >
              {t('vehicles.searchFilter')}
            </span>
            <Input
              type="text"
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
              placeholder="Búsqueda"
              className={
                isLight
                  ? 'border-stone-300 bg-white text-slate-900 placeholder:text-slate-400'
                  : 'border-white/10 bg-slate-950/50 text-white placeholder:text-slate-500'
              }
            />
          </label>
        </div>

        <Paper
          className={`overflow-hidden border! shadow-none! ${isLight ? 'bg-white! border-stone-200!' : 'bg-slate-900/50! border-white/10!'}`}
        >
          <div className="divide-y divide-inherit">
            {loading ? (
              <div
                className={`px-4 py-8 text-center text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
              >
                {t('common.loading')}
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div
                className={`px-4 py-8 text-center text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
              >
                {t('vehicles.noVehicles')}
              </div>
            ) : (
              filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.veh_id}
                  className={`flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${isLight ? 'hover:bg-stone-50' : 'hover:bg-slate-800/40'}`}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <span
                      className={`inline-flex shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${isLight ? 'bg-stone-100 text-slate-800' : 'bg-cyan-400/10 text-cyan-200'}`}
                    >
                      {vehicle.veh_plate}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`truncate text-xs ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
                      >
                        {vehicle.veh_owner || vehicle.veh_reference || '-'}
                      </p>
                      <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {vehicle.veh_ingress_date
                          ? new Date(vehicle.veh_ingress_date).toLocaleString('es-ES')
                          : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleCheckout(vehicle.veh_id!)}
                      variant="filled"
                      size="sm"
                    >
                      {t('vehicles.checkout')}
                    </Button>
                    <Button
                      onClick={() => printVehicleReceipt(vehicle)}
                      variant="outlined"
                      size="sm"
                    >
                      {t('vehicles.reprint')}
                    </Button>
                    {isAdmin && (
                      <Button
                        onClick={() => handleDeleteVehicle(vehicle.veh_id!)}
                        variant="danger"
                        size="sm"
                      >
                        {t('vehicles.delete')}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Paper>
      </Card>

      <ModalShell
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        className={`p-6 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
      >
        <h3 className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
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
                const plate = autoFormatPlate(e.target.value);
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
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
            />
            {plateValidation && !plateValidation.isValid && (
              <p className="mt-1 text-xs text-rose-500">{plateValidation.errorMessage}</p>
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
          <div>
            <label
              className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              {t('vehicles.tariffLabel')}
            </label>
            <select
              value={selectedTariffId}
              onChange={(e) => setSelectedTariffId(e.target.value)}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
            >
              <option value="">{t('vehicles.tariffAutoDefault')}</option>
              {tariffs.map((tariff) => (
                <option key={tariff.par_id} value={String(tariff.par_id)}>
                  {formatTariffOption(tariff)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              variant="text"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={saving || (plateValidation ? !plateValidation.isValid : false)}
              variant="filled"
            >
              {saving ? t('vehicles.registering') : t('vehicles.register')}
            </Button>
          </div>
        </form>
      </ModalShell>

      <ModalShell
        open={checkoutModal.open && Boolean(checkoutModal.vehicle)}
        onClose={() => setCheckoutModal({ open: false, vehicle: null, breakdown: undefined })}
        className={`p-6 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
      >
        <h3 className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {t('vehicles.confirmCheckout')}
        </h3>

        <div
          className={`mb-4 rounded-xl border p-4 ${isLight ? 'border-stone-200 bg-stone-50' : 'border-white/10 bg-slate-800/50'}`}
        >
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('vehicles.plate')}
          </p>
          <p className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {checkoutModal.vehicle?.veh_plate ?? '-'}
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
            <p className={`mt-1 text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {checkoutModal.vehicle?.veh_ingress_date
                ? formatDateTime(checkoutModal.vehicle.veh_ingress_date)
                : '-'}
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
            <p className={`mt-1 text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {checkoutModal.breakdown
                ? formatDateTime(checkoutModal.breakdown.exitTime.toISOString())
                : formatDateTime(new Date().toISOString())}
            </p>
          </div>

          {checkoutModal.breakdown && (
            <div
              className={`rounded-xl border p-4 ${isLight ? 'border-stone-200 bg-stone-50' : 'border-white/10 bg-slate-800/50'}`}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    {t('vehicles.duration') || 'Duración'}
                  </span>
                  <span className={isLight ? 'text-slate-900' : 'text-white'}>
                    {checkoutModal.breakdown.durationMinutes} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    {t('vehicles.firstHour') || 'Primera hora'}
                  </span>
                  <span className={isLight ? 'text-slate-900' : 'text-white'}>
                    ₡{checkoutModal.breakdown.firstHourCost.toLocaleString()}
                  </span>
                </div>
                {checkoutModal.breakdown.additionalMinutes > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        {t('vehicles.additionalMinutes') || 'Minutos adicionales'}
                      </span>
                      <span className={isLight ? 'text-slate-900' : 'text-white'}>
                        {checkoutModal.breakdown.additionalMinutes} × ₡10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        {t('vehicles.additionalCost') || 'Costo adicional'}
                      </span>
                      <span className={isLight ? 'text-slate-900' : 'text-white'}>
                        ₡{checkoutModal.breakdown.additionalCost.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
                <div
                  className={`border-t ${isLight ? 'border-stone-200' : 'border-white/10'} pt-2 flex justify-between`}
                >
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    {t('vehicles.subtotal') || 'Subtotal'}
                  </span>
                  <span className={isLight ? 'text-slate-900' : 'text-white'}>
                    ₡{checkoutModal.breakdown.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-cyan-200">
                    {t('vehicles.totalRounded') || 'Total (redondeado)'}
                  </span>
                  <span className="text-cyan-400">
                    ₡{checkoutModal.breakdown.roundedTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={`rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4`}>
            <p className={`text-xs font-medium uppercase tracking-wide text-cyan-200`}>
              {t('vehicles.totalToPay')}
            </p>
            <input
              type="number"
              value={checkoutModal.customTotal || ''}
              onChange={(e) => setCheckoutModal({ ...checkoutModal, customTotal: e.target.value })}
              className={`mt-1 w-full rounded-lg border border-cyan-400/30 bg-slate-900 px-3 py-2 text-2xl font-bold text-cyan-400 outline-none focus:border-cyan-400`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={() => setCheckoutModal({ open: false, vehicle: null, breakdown: undefined })}
            variant="text"
          >
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={confirmCheckout} variant="filled">
            {t('vehicles.confirmCheckout')}
          </Button>
        </div>
      </ModalShell>

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setVehicleToDelete(null);
        }}
        onConfirm={confirmDeleteVehicle}
        title={t('vehicles.deleteVehicle')}
        message={t('vehicles.confirmDeleteMessage')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
      />
    </>
  );
}
