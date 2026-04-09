// @author AleLeonMarin

import type { ReactNode } from 'react';

interface ModalShellProps {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
  maxWidthClassName?: string;
  className?: string;
}

export function ModalShell({
  open,
  children,
  onClose,
  maxWidthClassName = 'max-w-md',
  className = '',
}: ModalShellProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthClassName} rounded-2xl border shadow-2xl ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'success' | 'default';
  showCancel?: boolean;
}

export function Modal({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'default',
  showCancel = true,
}: ModalProps) {
  const confirmButtonStyles = {
    danger: 'bg-rose-500 hover:bg-rose-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    default: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950',
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      className="animate-in fade-in zoom-in-95 border-slate-200 bg-white p-6 duration-200 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>

      <div className="mb-6 text-slate-600 dark:text-slate-300">{children}</div>

      <div className="flex justify-end gap-3">
        {showCancel && (
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {cancelText}
          </button>
        )}
        {onConfirm && (
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl px-4 py-2 font-semibold transition ${confirmButtonStyles[confirmVariant]}`}
          >
            {confirmText}
          </button>
        )}
      </div>
    </ModalShell>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'default';
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={variant}
    >
      {message}
    </Modal>
  );
}
