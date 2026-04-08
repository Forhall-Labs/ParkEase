// @author AleLeonMarin

import { useState, useEffect } from 'react';
import type { SafeUser, CreateUserDto, UpdateUserDto } from '../../types/electron-api';

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
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await window.electronAPI?.users?.delete(id);
        loadUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Gestión de Usuarios
          </h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Administra los usuarios del sistema
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          + Nuevo Usuario
        </button>
      </div>

      {error && (
        <div
          className={`rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-rose-400/30 bg-rose-500/10 text-rose-200'}`}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className={`text-center py-8 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Cargando...
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
                  Usuario
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  Nombre
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  Email
                </th>
                <th
                  className={`px-4 py-3 text-left text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  Estado
                </th>
                <th
                  className={`px-4 py-3 text-right text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                >
                  Acciones
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
                    No hay usuarios registrados
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
                        {user.user_status === 'A' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(user)}
                        className={`mr-2 rounded-lg px-3 py-1 text-sm transition ${
                          isLight
                            ? 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => user.user_id && handleDelete(user.user_id)}
                        className="rounded-lg bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900'}`}
          >
            <h3
              className={`mb-4 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
            >
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                  >
                    Nombre
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
                    Apellido
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
                  Usuario
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
                  Contraseña {editingUser && '(dejar vacío para mantener)'}
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
                  Email
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
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className={`rounded-xl border px-4 py-2 font-semibold transition ${isLight ? 'border-stone-200 text-slate-700 hover:bg-stone-100' : 'border-white/10 text-white hover:bg-white/10'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  {editingUser ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
