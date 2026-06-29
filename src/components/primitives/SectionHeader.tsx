import type { ReactNode } from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  action,
  badge,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={[
        'flex items-start justify-between gap-4',
        'flex-col sm:flex-row sm:items-start',
        className ?? '',
      ].join(' ')}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        {label && <p className="text-section-label">{label}</p>}
        <h2 className="text-heading-lg">{title}</h2>
        {subtitle && <p className="text-body">{subtitle}</p>}
      </div>
      {(badge || action) && (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:ml-4">
          {badge}
          {action}
        </div>
      )}
    </header>
  );
}

export type { SectionHeaderProps };
