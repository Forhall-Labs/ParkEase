import type { MouseEventHandler, ReactNode } from 'react';

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'danger' | 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type TonalButtonVariant = 'filled' | 'outlined' | 'text' | 'danger';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const legacyVariantMap: Record<ButtonVariant, TonalButtonVariant> = {
  filled: 'filled',
  outlined: 'outlined',
  text: 'text',
  danger: 'danger',
  primary: 'filled',
  secondary: 'outlined',
  ghost: 'text',
};

const variantClasses: Record<TonalButtonVariant, string> = {
  filled: 'ui-button-filled',
  outlined: 'ui-button-outlined',
  text: 'ui-button-text',
  danger: 'ui-button-danger',
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
  const tonalVariant = legacyVariantMap[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'focus-ring inline-flex items-center justify-center rounded-xl border font-semibold transition duration-200 ease-out motion-reduce:transition-none',
        variantClasses[tonalVariant],
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
