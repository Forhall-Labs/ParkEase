import { useState } from 'react';
import type { SafeUser } from '../types/electron-api';

export interface LoginForm {
  user_username: string;
  user_password: string;
}

const INITIAL_FORM: LoginForm = {
  user_username: '',
  user_password: '',
};

export function useLogin() {
  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);

  function setField<K extends keyof LoginForm>(field: K, value: LoginForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submitLogin() {
    if (!form.user_username.trim() || !form.user_password.trim()) {
      setError('Debes ingresar usuario y contraseña.');
      return;
    }

    if (!window.electronAPI?.users?.login) {
      setError('No se detectó Electron API. Ejecuta la app en Electron, no solo en navegador.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await window.electronAPI.users.login(form);

      if (!response.success || !response.user) {
        setCurrentUser(null);
        setError(response.message ?? 'No se pudo iniciar sesión.');
        return;
      }

      setCurrentUser(response.user);
      setForm(INITIAL_FORM);
    } catch (err) {
      setCurrentUser(null);
      const message = err instanceof Error ? err.message : String(err);
      setError(`Ocurrió un error al iniciar sesión: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await window.electronAPI?.session?.clear();
    } catch {
      // Session clear failed - ignore
    }
    setCurrentUser(null);
    setForm(INITIAL_FORM);
  }

  return {
    form,
    isLoading,
    error,
    currentUser,
    setField,
    submitLogin,
    logout,
  };
}
