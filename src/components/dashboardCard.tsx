import React from 'react';
import { Card } from './primitives';

interface CardProps {
  title: string;
  info: string;
  image?: string;
  detail?: string;
  theme?: 'dark' | 'light';
}

export const DashboardCard: React.FC<CardProps> = ({
  title,
  info,
  image,
  detail,
  theme = 'dark',
}) => {
  const fallbackLabel = title.slice(0, 1).toUpperCase();
  const isLight = theme === 'light';

  return (
    <Card
      className={`group relative overflow-hidden p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:duration-0 sm:p-5 ${
        isLight
          ? 'border-stone-200 bg-linear-to-br from-stone-50 via-stone-100 to-stone-50 shadow-[var(--shadow-card)] hover:border-stone-300 hover:shadow-[var(--shadow-card)]'
          : 'border-white/10 bg-linear-to-br from-slate-900/90 via-slate-900/70 to-slate-800/80 shadow-[var(--shadow-card)] hover:border-cyan-400/20 hover:shadow-[var(--shadow-card)]'
      }`}
    >
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl border p-2 sm:h-12 sm:w-12 ${
            isLight
              ? 'border-stone-300 bg-[color:var(--color-surface-card)] text-[color:var(--color-text-secondary)]'
              : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
          }`}
        >
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-contain" />
          ) : (
            <span
              className={`text-lg font-semibold ${isLight ? 'text-[color:var(--color-text-secondary)]' : 'text-cyan-200'}`}
            >
              {fallbackLabel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-[color:var(--color-text-muted)]' : 'text-slate-400'}`}
          >
            {title}
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h3
              className={`text-3xl font-semibold tracking-tight ${isLight ? 'text-[color:var(--color-text-primary)]' : 'text-white'}`}
            >
              {info}
            </h3>
          </div>
          {detail && (
            <p
              className={`mt-1 text-xs ${isLight ? 'text-[color:var(--color-text-muted)]' : 'text-slate-400'}`}
            >
              {detail}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
