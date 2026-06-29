import type { ChangeEventHandler } from 'react';

interface InputProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: 'text' | 'date' | 'password' | 'email' | 'number';
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
  max,
  disabled = false,
  autoComplete,
  className,
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      disabled={disabled}
      autoComplete={autoComplete}
      className={[
        'focus-ring w-full rounded-xl border px-4 py-2 text-sm outline-none transition duration-200 ease-out motion-reduce:transition-none',
        'border-[color:var(--color-border-default)] bg-[color:var(--color-surface-card)] text-[color:var(--color-text-primary)]',
        'placeholder:text-[color:var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-60',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export type { InputProps };
