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
      className={['flex flex-wrap items-end justify-between gap-3', className ?? ''].join(' ')}
    >
      <div className="space-y-1.5">
        {label && <p className="text-section-label">{label}</p>}
        <h2 className="text-heading-lg">{title}</h2>
        {subtitle && <p className="text-body">{subtitle}</p>}
      </div>
      {(badge || action) && (
        <div className="flex flex-wrap items-center gap-2">
          {badge}
          {action}
        </div>
      )}
    </header>
  );
}

export type { SectionHeaderProps };
