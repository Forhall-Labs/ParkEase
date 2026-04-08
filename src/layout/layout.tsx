// @author AleLeonMarin

import type { ReactNode } from 'react';
import { Sidebar, type Section } from '../components/UI/sidebar';
import Clock from '../components/clock';

const defaultSections: Section[] = [
  { label: 'Usuarios', path: '/usuarios' },
  { label: 'Vehículos', path: '/vehiculos' },
  { label: 'Parámetros', path: '/parametros' },
];

interface LayoutProps {
  children?: ReactNode;
  asideContent?: ReactNode;
  userName?: string;
  title?: string;
  subtitle?: string;
  sections?: Section[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

export function Layout({
  children,
  asideContent,
  userName,
  title,
  subtitle,
  sections = defaultSections,
  activePath,
  onNavigate,
  theme = 'dark',
  onToggleTheme,
  onLogout,
}: LayoutProps) {
  const isLight = theme === 'light';

  return (
    <main
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
        <div className="w-full lg:w-[320px] lg:flex-none">
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

        <section className="relative flex min-h-screen flex-1 flex-col gap-4 p-3 sm:gap-6 sm:p-6 lg:p-8">
          <div
            className={`rounded-4xl border p-5 shadow-2xl backdrop-blur-xl sm:p-6 ${
              isLight
                ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
                : 'border-white/10 bg-white/8 shadow-slate-950/40'
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <h1
                  className={`text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl ${isLight ? 'text-slate-900' : 'text-white'}`}
                >
                  Bienvenido a {title ?? 'ParkEase'},<span>{userName}</span> !
                </h1>
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

                <button
                  type="button"
                  onClick={onToggleTheme}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    isLight
                      ? 'border-stone-300 bg-stone-600 text-white hover:bg-stone-500'
                      : 'border-white/10 bg-slate-950/40 text-slate-100 hover:bg-slate-900/80'
                  }`}
                >
                  {isLight ? 'Modo oscuro' : 'Modo claro'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <div
              className={`min-w-0 rounded-4xl border p-4 shadow-xl backdrop-blur-xl sm:p-6 ${
                isLight
                  ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
                  : 'border-white/10 bg-slate-900/70 shadow-slate-950/30'
              }`}
            >
              {children}
            </div>

            <aside
              className={`rounded-4xl border p-4 shadow-xl backdrop-blur-xl sm:p-6 xl:max-h-[calc(100vh-13rem)] xl:overflow-y-auto ${
                isLight
                  ? 'border-stone-200 bg-stone-50 shadow-stone-200/20'
                  : 'border-white/10 bg-white/8 shadow-slate-950/30'
              }`}
            >
              {asideContent}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
