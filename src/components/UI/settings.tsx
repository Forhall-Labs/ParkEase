import { useState, useEffect, useRef } from 'react';
import type { Parameter, CreateParameterDto, UpdateParameterDto } from '../../types/electron-api';
import { t, setLanguage } from '../../i18n';
import { Button, Card, SectionHeader } from '../primitives';
import { ModalShell } from './Modal';

interface SettingsProps {
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
}

export function Settings({ theme = 'dark', onThemeChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'parking' | 'parameters'>('general');
  const [parkingInfo, setParkingInfo] = useState({
    name: 'ParkEase',
    address: 'San Marcos, Costa Rica',
    phone: '',
    email: '',
  });
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parkingSaved, setParkingSaved] = useState(false);
  const parkingSavedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingParam, setEditingParam] = useState<Parameter | null>(null);
  const [formData, setFormData] = useState<CreateParameterDto>({
    par_name: '',
    par_amount: '',
    par_is_default: 0,
    version: 1,
  });

  const isLight = theme === 'light';

  useEffect(() => {
    loadParameters();
    loadParkingInfo();
    const savedLang = localStorage.getItem('app-language');
    if (savedLang === 'es' || savedLang === 'en') {
      setLanguage(savedLang as 'es' | 'en');
    }
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
        address: address ?? 'San Marcos, Costa Rica',
        phone: phone ?? '',
        email: email ?? '',
      });
    } catch (err) {
      console.error('Error loading parking info:', err);
    }
  }

  async function loadParameters() {
    try {
      setLoading(true);
      const data = await window.electronAPI?.parameters?.getAll();
      setParameters(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar parámetros');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitParameter(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (editingParam?.par_id) {
        const updateDto: UpdateParameterDto = {
          par_name: formData.par_name,
          par_amount: formData.par_amount,
          par_is_default: formData.par_is_default,
        };
        await window.electronAPI?.parameters?.update(editingParam.par_id, updateDto);
      } else {
        await window.electronAPI?.parameters?.create(formData);
      }
      setShowModal(false);
      resetParameterForm();
      await loadParameters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar parámetro');
    }
  }

  async function handleSetDefaultParameter(id: number) {
    try {
      await window.electronAPI?.parameters?.setDefault(id);
      await loadParameters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al establecer tarifa general');
    }
  }

  function openEditParameterModal(param: Parameter) {
    setEditingParam(param);
    setFormData({
      par_name: param.par_name,
      par_amount: param.par_amount,
      par_is_default: param.par_is_default,
      version: param.version + 1,
    });
    setShowModal(true);
  }

  function openNewParameterModal() {
    setEditingParam(null);
    resetParameterForm();
    setShowModal(true);
  }

  function resetParameterForm() {
    setFormData({
      par_name: '',
      par_amount: '',
      par_is_default: 0,
      version: 1,
    });
    setEditingParam(null);
  }

  function formatCurrency(amount: string): string {
    const value = Number(amount);
    if (!Number.isFinite(value)) {
      return amount;
    }

    return value.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
  }

  function handleLanguageChange(lang: string) {
    setLanguage(lang as 'es' | 'en');
    window.location.reload();
  }

  async function handleSaveParkingInfo() {
    try {
      await window.electronAPI?.settings?.save('parking_name', parkingInfo.name);
      await window.electronAPI?.settings?.save('parking_address', parkingInfo.address);
      await window.electronAPI?.settings?.save('parking_phone', parkingInfo.phone);
      await window.electronAPI?.settings?.save('parking_email', parkingInfo.email);
      setParkingSaved(true);
      if (parkingSavedTimer.current) clearTimeout(parkingSavedTimer.current);
      parkingSavedTimer.current = setTimeout(() => setParkingSaved(false), 3000);
    } catch (err) {
      console.error('Error saving parking info:', err);
    }
  }

  const tabs = [
    { id: 'general', label: t('settings.tabs.general') },
    { id: 'parking', label: t('settings.tabs.parking') },
    { id: 'parameters', label: t('settings.tabs.rates') },
  ];

  const headerAction =
    activeTab === 'parameters' ? (
      <Button type="button" onClick={openNewParameterModal} variant="filled">
        + {t('parameters.addTariff')}
      </Button>
    ) : activeTab === 'parking' ? (
      <Button type="button" onClick={handleSaveParkingInfo} variant="filled">
        {t('settings.save')}
      </Button>
    ) : (
      <Button type="button" onClick={() => setActiveTab('parking')} variant="filled">
        {t('settings.tabs.parking')}
      </Button>
    );

  return (
    <div className="space-y-4">
      <Card
        variant="panel"
        className={`ui-section-padding ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900/60'}`}
      >
        <SectionHeader
          label={t('settings.title')}
          title={t('settings.title')}
          subtitle={t('settings.description')}
          action={headerAction}
        />
      </Card>

      <div className="flex gap-2 border-b border-slate-600">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? isLight
                  ? 'border-b-2 border-cyan-500 text-cyan-600'
                  : 'border-b-2 border-cyan-400 text-cyan-200'
                : isLight
                  ? 'text-slate-500 hover:text-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div
          className={`rounded-2xl border p-6 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
        >
          <h3 className={`mb-4 text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t('settings.theme.label')}
          </h3>

          <div className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('settings.theme.label')}
              </label>
              <div className="mt-2 flex gap-3">
                <Button
                  onClick={() => onThemeChange?.('light')}
                  variant={isLight ? 'filled' : 'outlined'}
                  className="flex items-center gap-2"
                >
                  ☀️ {t('settings.theme.light')}
                </Button>
                <Button
                  onClick={() => onThemeChange?.('dark')}
                  variant={!isLight ? 'filled' : 'outlined'}
                  className="flex items-center gap-2"
                >
                  🌙 {t('settings.theme.dark')}
                </Button>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('settings.language.label')}
              </label>
              <select
                onChange={(e) => handleLanguageChange(e.target.value)}
                defaultValue={localStorage.getItem('app-language') || 'es'}
                className={`mt-2 w-full max-w-xs rounded-xl border px-3 py-2 ${
                  isLight
                    ? 'border-stone-200 bg-white text-slate-900'
                    : 'border-white/10 bg-slate-800 text-white'
                }`}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'parking' && (
        <div
          className={`rounded-2xl border p-6 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
        >
          <h3 className={`mb-4 text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t('settings.parking.title')}
          </h3>

          {parkingSaved && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all ${
                isLight
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              <span>✓</span>
              <span>{t('settings.parking.saved')}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('settings.parking.name')}
              </label>
              <input
                type="text"
                value={parkingInfo.name}
                onChange={(e) => setParkingInfo({ ...parkingInfo, name: e.target.value })}
                className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                  isLight
                    ? 'border-stone-200 bg-white text-slate-900'
                    : 'border-white/10 bg-slate-800 text-white'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('settings.parking.address')}
              </label>
              <input
                type="text"
                value={parkingInfo.address}
                onChange={(e) => setParkingInfo({ ...parkingInfo, address: e.target.value })}
                className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                  isLight
                    ? 'border-stone-200 bg-white text-slate-900'
                    : 'border-white/10 bg-slate-800 text-white'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('settings.parking.phone')}
              </label>
              <input
                type="text"
                value={parkingInfo.phone}
                onChange={(e) => setParkingInfo({ ...parkingInfo, phone: e.target.value })}
                className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                  isLight
                    ? 'border-stone-200 bg-white text-slate-900'
                    : 'border-white/10 bg-slate-800 text-white'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('settings.parking.email')}
              </label>
              <input
                type="email"
                value={parkingInfo.email}
                onChange={(e) => setParkingInfo({ ...parkingInfo, email: e.target.value })}
                className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                  isLight
                    ? 'border-stone-200 bg-white text-slate-900'
                    : 'border-white/10 bg-slate-800 text-white'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'parameters' && (
        <div
          className={`rounded-2xl border p-6 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
        >
          <div className="mb-4">
            <h3 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {t('parameters.title')}
            </h3>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {t('parameters.tariffsDescription')}
            </p>
          </div>

          {error && (
            <p
              className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
                isLight
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-rose-400/30 bg-rose-500/10 text-rose-200'
              }`}
            >
              {error}
            </p>
          )}

          {loading ? (
            <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>{t('common.loading')}</p>
          ) : parameters.length === 0 ? (
            <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              {t('parameters.noTariffs')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={isLight ? 'bg-stone-100' : 'bg-slate-950/50'}>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${
                        isLight ? 'text-slate-700' : 'text-cyan-200'
                      }`}
                    >
                      {t('parameters.name')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${
                        isLight ? 'text-slate-700' : 'text-cyan-200'
                      }`}
                    >
                      {t('parameters.amount')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${
                        isLight ? 'text-slate-700' : 'text-cyan-200'
                      }`}
                    >
                      {t('parameters.default')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-sm font-semibold ${
                        isLight ? 'text-slate-700' : 'text-cyan-200'
                      }`}
                    >
                      {t('parameters.version')}
                    </th>
                    <th
                      className={`px-4 py-3 text-right text-sm font-semibold ${
                        isLight ? 'text-slate-700' : 'text-cyan-200'
                      }`}
                    >
                      {t('parameters.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param) => (
                    <tr
                      key={param.par_id}
                      className={isLight ? 'border-t border-stone-200' : 'border-t border-white/5'}
                    >
                      <td
                        className={`px-4 py-3 text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}
                      >
                        {param.par_name}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
                      >
                        {formatCurrency(param.par_amount)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
                      >
                        {param.par_is_default ? t('common.yes') : t('common.no')}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        v{param.version}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            onClick={() => openEditParameterModal(param)}
                            variant="outlined"
                            size="sm"
                          >
                            {t('parameters.edit')}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleSetDefaultParameter(param.par_id!)}
                            disabled={param.par_is_default === 1}
                            variant="text"
                            size="sm"
                          >
                            {t('parameters.setDefault')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ModalShell
            open={showModal}
            onClose={() => {
              setShowModal(false);
              resetParameterForm();
            }}
            className={`p-6 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
          >
            <h3
              className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
            >
              {editingParam ? t('paramForm.editTariffTitle') : t('paramForm.newTariffTitle')}
            </h3>

            <form onSubmit={handleSubmitParameter} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('paramForm.tariffName')}
                </label>
                <input
                  type="text"
                  value={formData.par_name}
                  onChange={(event) => setFormData({ ...formData, par_name: event.target.value })}
                  required
                  placeholder={t('paramForm.tariffNamePlaceholder')}
                  className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                    isLight
                      ? 'border-stone-200 bg-white text-slate-900'
                      : 'border-white/10 bg-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('paramForm.tariffAmount')}
                </label>
                <input
                  type="number"
                  value={formData.par_amount}
                  onChange={(event) => setFormData({ ...formData, par_amount: event.target.value })}
                  required
                  min="1"
                  placeholder="600"
                  className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                    isLight
                      ? 'border-stone-200 bg-white text-slate-900'
                      : 'border-white/10 bg-slate-800 text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetParameterForm();
                  }}
                  variant="text"
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" variant="filled">
                  {editingParam ? t('common.save') : t('common.create')}
                </Button>
              </div>
            </form>
          </ModalShell>
        </div>
      )}
    </div>
  );
}
