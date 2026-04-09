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
      className={`group relative overflow-hidden p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-5 ${
        isLight
          ? 'border-stone-200 bg-linear-to-br from-stone-50 via-stone-100 to-stone-50 shadow-stone-200/20 hover:border-stone-300 hover:shadow-stone-300/25'
          : 'border-white/10 bg-linear-to-br from-slate-900/90 via-slate-900/70 to-slate-800/80 shadow-slate-950/30 hover:border-cyan-400/20 hover:shadow-slate-950/50'
      }`}
    >
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl border p-2 sm:h-12 sm:w-12 ${
            isLight
              ? 'border-stone-300 bg-white/80 text-slate-700'
              : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
          }`}
        >
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-contain" />
          ) : (
            <span
              className={`text-lg font-semibold ${isLight ? 'text-slate-700' : 'text-cyan-200'}`}
            >
              {fallbackLabel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
          >
            {title}
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h3
              className={`text-3xl font-semibold tracking-tight sm:text-4xl ${isLight ? 'text-slate-900' : 'text-white'}`}
            >
              {info}
            </h3>
          </div>
          {detail && (
            <p className={`mt-1 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {detail}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
