import type { ReactNode } from 'react';

type CardVariant = 'default' | 'panel' | 'muted';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'surface-card',
  panel: 'surface-panel',
  muted:
    'rounded-3xl border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]',
};

export function Card({ children, variant = 'default', className }: CardProps) {
  return (
    <article className={[variantClasses[variant], className ?? ''].filter(Boolean).join(' ')}>
      {children}
    </article>
  );
}

export type { CardProps, CardVariant };
