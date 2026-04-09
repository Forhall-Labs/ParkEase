// @author AleLeonMarin

import { useState, useEffect } from 'react';
import type { SafeUser, CreateUserDto, UpdateUserDto } from '../../types/electron-api';
import { t } from '../../i18n';
import { Button, Card, SectionHeader } from '../primitives';
import { ConfirmModal, ModalShell } from './Modal';

interface UsersProps {
  theme?: 'dark' | 'light';
}

export function Users({ theme = 'dark' }: UsersProps) {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SafeUser | null>(null);
  const [formData, setFormData] = useState<CreateUserDto>({
    user_name: '',
    user_lastname: '',
    user_username: '',
    user_password: '',
    user_email: '',
  });
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);

  const isLight = theme === 'light';

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await window.electronAPI?.users?.getAll();
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingUser?.user_id) {
        const updateDto: UpdateUserDto = {
          user_name: formData.user_name,
          user_lastname: formData.user_lastname,
          user_username: formData.user_username,
          user_email: formData.user_email,
        };
        await window.electronAPI?.users?.update(editingUser.user_id, updateDto);
      } else {
        await window.electronAPI?.users?.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar usuario');
    }
  }

  async function handleDelete(id: number) {
    try {
      await window.electronAPI?.users?.delete(id);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    }
  }

  function openEditModal(user: SafeUser) {
    setEditingUser(user);
    setFormData({
      user_name: user.user_name,
      user_lastname: user.user_lastname,
      user_username: user.user_username,
      user_password: '',
      user_email: user.user_email,
    });
    setShowModal(true);
  }

  function openNewModal() {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      user_name: '',
      user_lastname: '',
      user_username: '',
      user_password: '',
      user_email: '',
    });
    setEditingUser(null);
  }

  return (
    <div className="space-y-4">
      <Card
        variant="panel"
        className={`ui-section-padding ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900/60'}`}
      >
        <SectionHeader
          label={t('users.title')}
          title={t('users.title')}
          subtitle={t('users.description')}
          action={
            <Button type="button" onClick={openNewModal} variant="filled">
              + {t('users.addUser')}
            </Button>
          }
        />
      </Card>

      {error && (
        <div
          className={`rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-rose-400/30 bg-rose-500/10 text-rose-200'}`}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className={`text-center py-8 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          {t('common.loading')}
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900/50'}`}
        >
          <table className="w-full">
            <thead className={isLight ? 'bg-stone-100' : 'bg-slate-800/50'}>
              <tr>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('users.username')}
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('users.name')}
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('users.email')}
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('users.status')}
                </th>
                <th
                  className={`px-4 py-3 text-right text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  {t('users.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-4 py-8 text-center ${isLight ? 'text-slate-500' : 'text-slate-500'}`}
                  >
                    {t('users.noUsers')}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.user_id}
                    className={`border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}
                  >
                    <td className={`px-4 py-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {user.user_username}
                    </td>
                    <td className={`px-4 py-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {user.user_name} {user.user_lastname}
                    </td>
                    <td className={`px-4 py-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {user.user_email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          user.user_status === 'A'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.user_status === 'A' ? t('users.active') : t('users.inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        onClick={() => openEditModal(user)}
                        variant="outlined"
                        size="sm"
                        className="mr-2"
                      >
                        {t('users.edit')}
                      </Button>
                      <Button
                        onClick={() => setDeleteCandidateId(user.user_id ?? null)}
                        variant="danger"
                        size="sm"
                      >
                        {t('users.delete')}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalShell
        open={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        className={`p-6 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
      >
        <h3 className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {editingUser ? t('userForm.editTitle') : t('userForm.newTitle')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('userForm.name')}
              </label>
              <input
                type="text"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                required
                className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
              >
                {t('userForm.lastname')}
              </label>
              <input
                type="text"
                value={formData.user_lastname}
                onChange={(e) => setFormData({ ...formData, user_lastname: e.target.value })}
                required
                className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
              />
            </div>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              {t('userForm.username')}
            </label>
            <input
              type="text"
              value={formData.user_username}
              onChange={(e) => setFormData({ ...formData, user_username: e.target.value })}
              required
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              {t('userForm.password')} {editingUser && t('userForm.passwordHint')}
            </label>
            <input
              type="password"
              value={formData.user_password}
              onChange={(e) => setFormData({ ...formData, user_password: e.target.value })}
              required={!editingUser}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              {t('userForm.email')}
            </label>
            <input
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
              required
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${isLight ? 'border-stone-200 bg-white text-slate-900' : 'border-white/10 bg-slate-800 text-white'}`}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              variant="text"
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="filled">
              {editingUser ? t('userForm.save') : t('userForm.create')}
            </Button>
          </div>
        </form>
      </ModalShell>

      <ConfirmModal
        open={deleteCandidateId !== null}
        onClose={() => setDeleteCandidateId(null)}
        onConfirm={() => {
          if (deleteCandidateId !== null) {
            void handleDelete(deleteCandidateId);
          }
          setDeleteCandidateId(null);
        }}
        title={t('users.deleteUser')}
        message="¿Está seguro de eliminar este usuario?"
        confirmText={t('users.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
      />
    </div>
  );
}
