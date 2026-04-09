import type { MouseEventHandler, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'ui-button-primary border-[color:var(--color-border-default)] bg-[color:var(--color-feedback-warning)] text-[color:var(--color-accent-contrast)] hover:brightness-105',
  secondary:
    'ui-button-secondary border-[color:var(--color-border-default)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)] hover:brightness-110',
  ghost:
    'border border-[color:var(--color-border-default)] bg-transparent text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]',
  danger:
    'border border-transparent bg-[color:var(--color-feedback-danger)] text-white hover:brightness-110',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
};

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'focus-ring inline-flex items-center justify-center rounded-xl font-semibold transition duration-200 ease-out motion-reduce:transition-none',
        variantClasses[variant],
        sizeClasses[size],
        disabled ? 'cursor-not-allowed opacity-60' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}

export type { ButtonProps, ButtonSize, ButtonVariant };
