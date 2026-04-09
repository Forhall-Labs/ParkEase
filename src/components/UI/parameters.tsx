import { useState, useEffect } from 'react';
import type { Parameter, CreateParameterDto, UpdateParameterDto } from '../../types/electron-api';
import { t } from '../../i18n';

interface ParametersProps {
  theme?: 'dark' | 'light';
}

export function Parameters({ theme = 'dark' }: ParametersProps) {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingParam, setEditingParam] = useState<Parameter | null>(null);
  const [formData, setFormData] = useState<CreateParameterDto>({
    par_quantity: '',
    par_tax: '',
    version: 1,
  });

  const isLight = theme === 'light';

  useEffect(() => {
    loadParameters();
  }, []);

  async function loadParameters() {
    try {
      setLoading(true);
      const data = await window.electronAPI?.parameters?.getAll();
      setParameters(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar parámetros');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingParam?.par_id) {
        const updateDto: UpdateParameterDto = {
          par_quantity: formData.par_quantity,
          par_tax: formData.par_tax,
        };
        await window.electronAPI?.parameters?.update(editingParam.par_id, updateDto);
      } else {
        await window.electronAPI?.parameters?.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadParameters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar parámetro');
    }
  }

  async function handleDelete(id: number) {
    if (confirm('¿Está seguro de eliminar este parámetro?')) {
      try {
        await window.electronAPI?.parameters?.delete(id);
        loadParameters();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar parámetro');
      }
    }
  }

  function openEditModal(param: Parameter) {
    setEditingParam(param);
    setFormData({
      par_quantity: param.par_quantity,
      par_tax: param.par_tax,
      version: param.version + 1,
    });
    setShowModal(true);
  }

  function openNewModal() {
    setEditingParam(null);
    resetForm();
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      par_quantity: '',
      par_tax: '',
      version: 1,
    });
    setEditingParam(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t('parameters.title')}
          </h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('settings.description')}
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          + {t('parameters.addParam')}
        </button>
      </div>

      {error && (
        <p
          className={`rounded-xl border px-3 py-2 text-sm ${
            isLight
              ? 'border-rose-300 bg-rose-50 text-rose-700'
              : 'border-rose-400/30 bg-rose-500/10 text-rose-200'
          }`}
        >
          {error}
        </p>
      )}

      <div
        className={`overflow-hidden rounded-3xl border shadow-xl ${
          isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'
        }`}
      >
        {loading ? (
          <div className="p-6 text-center text-slate-400">{t('common.loading')}</div>
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
                    {t('parameters.hourlyRate')}
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold ${
                      isLight ? 'text-slate-700' : 'text-cyan-200'
                    }`}
                  >
                    {t('parameters.firstHour')}
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
                {parameters.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className={`px-4 py-6 text-center text-sm ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {t('parameters.noParams')}
                    </td>
                  </tr>
                ) : (
                  parameters.map((param) => (
                    <tr
                      key={param.par_id}
                      className={isLight ? 'border-t border-stone-200' : 'border-t border-white/5'}
                    >
                      <td
                        className={`px-4 py-3 text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}
                      >
                        {param.par_quantity}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
                      >
                        {param.par_tax}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        v{param.version}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(param)}
                            className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                              isLight
                                ? 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100'
                                : 'border-blue-500/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                            }`}
                          >
                            {t('parameters.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(param.par_id!)}
                            className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                              isLight
                                ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'border-red-500/30 bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            }`}
                          >
                            {t('parameters.delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'
            }`}
          >
            <h3
              className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
            >
              {editingParam ? t('paramForm.editTitle') : t('paramForm.newTitle')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('paramForm.hourlyRate')}
                </label>
                <input
                  type="number"
                  value={formData.par_quantity}
                  onChange={(e) => setFormData({ ...formData, par_quantity: e.target.value })}
                  required
                  placeholder="1000"
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
                  {t('paramForm.firstHour')}
                </label>
                <input
                  type="number"
                  value={formData.par_tax}
                  onChange={(e) => setFormData({ ...formData, par_tax: e.target.value })}
                  placeholder="500"
                  className={`mt-1 w-full rounded-xl border px-3 py-2 ${
                    isLight
                      ? 'border-stone-200 bg-white text-slate-900'
                      : 'border-white/10 bg-slate-800 text-white'
                  }`}
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
                  className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  {editingParam ? t('common.save') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
