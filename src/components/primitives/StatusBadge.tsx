import type { ReactNode } from 'react';

type StatusBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

interface StatusBadgeProps {
  tone?: StatusBadgeTone;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<StatusBadgeTone, string> = {
  neutral:
    'border-[color:var(--color-border-default)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)]',
  info: 'border-[color:var(--color-feedback-info)]/40 bg-[color:var(--color-feedback-info)]/15 text-[color:var(--color-feedback-info)]',
  success:
    'border-[color:var(--color-feedback-success)]/40 bg-[color:var(--color-feedback-success)]/15 text-[color:var(--color-feedback-success)]',
  warning:
    'border-[color:var(--color-feedback-warning)]/40 bg-[color:var(--color-feedback-warning)]/15 text-[color:var(--color-feedback-warning)]',
  danger:
    'border-[color:var(--color-feedback-danger)]/40 bg-[color:var(--color-feedback-danger)]/15 text-[color:var(--color-feedback-danger)]',
};

export function StatusBadge({ tone = 'neutral', children, className }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]',
        toneClasses[tone],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

export type { StatusBadgeProps, StatusBadgeTone };
