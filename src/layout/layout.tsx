// @author AleLeonMarin

import type { ReactNode } from 'react';
import { Sidebar, type Section } from '../components/UI/sidebar';
import Clock from '../components/clock';
import { t } from '../i18n';

const defaultSections: Section[] = [
  { label: t('nav.vehicles'), path: '/vehiculos' },
  { label: t('nav.reports'), path: '/reportes' },
  { label: t('nav.users'), path: '/usuarios' },
  { label: t('nav.settings'), path: '/configuracion' },
];

interface LayoutProps {
  children?: ReactNode;
  asideContent?: ReactNode;
  showWelcomeBanner?: boolean;
  userName?: string;
  title?: string;
  subtitle?: string;
  sections?: Section[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  theme?: 'dark' | 'light';
  onLogout?: () => void;
}

export function Layout({
  children,
  asideContent,
  showWelcomeBanner = true,
  userName,
  title,
  subtitle,
  sections = defaultSections,
  activePath,
  onNavigate,
  theme = 'dark',
  onLogout,
}: LayoutProps) {
  const isLight = theme === 'light';

  return (
    <main
      id="main-content"
      className={`relative min-h-screen overflow-hidden ${isLight ? 'bg-stone-50 text-slate-900' : 'bg-slate-950 text-white'}`}
    >
      <div
        className={`absolute inset-0 ${
          isLight
            ? 'bg-[radial-gradient(circle_at_top_left,rgba(120,113,108,0.04),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(168,162,158,0.04),transparent_46%),linear-gradient(135deg,#fafaf9_0%,#f5f5f4_55%,#e7e5e4_100%)]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]'
        }`}
      />
      <div
        className={`absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[42px_42px] ${
          isLight ? 'opacity-25' : 'opacity-25'
        }`}
      />

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <div className="w-full lg:sticky lg:top-0 lg:h-screen lg:w-[296px] lg:flex-none xl:w-[312px]">
          <Sidebar
            userName={userName}
            title={title}
            subtitle={subtitle}
            sections={sections}
            activePath={activePath}
            onNavigate={onNavigate}
            onLogout={onLogout}
            theme={theme}
          />
        </div>

        <section className="relative flex min-h-screen flex-1 flex-col p-3 sm:p-6 lg:p-8">
          <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-4 sm:gap-6">
            {showWelcomeBanner && (
              <div
                className={`rounded-4xl border p-5 shadow-2xl backdrop-blur-xl sm:p-6 ${
                  isLight
                    ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
                    : 'border-white/10 bg-white/8 shadow-slate-950/40'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <p
                      className={`text-xs uppercase tracking-[0.2em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                      Panel principal
                    </p>
                    <h1
                      className={`text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl ${isLight ? 'text-slate-900' : 'text-white'}`}
                    >
                      Bienvenido,{' '}
                      <span className={isLight ? 'text-cyan-700' : 'text-cyan-300'}>
                        {userName}
                      </span>
                    </h1>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      {title ?? 'ParkEase'} listo para gestionar tus movimientos del dia.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div
                      className={`rounded-2xl border px-4 py-3 ${
                        isLight ? 'border-stone-200 bg-stone-50' : 'border-white/10 bg-slate-950/40'
                      }`}
                    >
                      <p
                        className={`mt-1 text-sm font-medium ${isLight ? 'text-cyan-700' : 'text-cyan-200'}`}
                      >
                        <Clock />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`grid gap-4 ${asideContent ? 'xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]' : 'xl:grid-cols-[1fr]'}`}
            >
              <div
                className={`min-w-0 rounded-4xl border p-4 shadow-xl backdrop-blur-xl sm:p-6 ${
                  isLight
                    ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
                    : 'border-white/10 bg-slate-900/70 shadow-slate-950/30'
                }`}
              >
                {children}
              </div>

              {asideContent && (
                <aside
                  className={`rounded-4xl border p-4 shadow-xl backdrop-blur-xl sm:p-6 xl:max-h-[calc(100vh-13rem)] xl:overflow-y-auto ${
                    isLight
                      ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
                      : 'border-white/10 bg-white/8 shadow-slate-950/30'
                  }`}
                >
                  {asideContent}
                </aside>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
