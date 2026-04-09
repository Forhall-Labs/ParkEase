// @author AleLeonMarin

import { SideBarItems, type SideBarSubItem } from '../sidebarItems';
import { t } from '../../i18n';

export interface Section {
  label: string;
  image?: string;
  path: string;
  subMenu?: SideBarSubItem[];
}

interface SidebarProps {
  userName?: string;
  title?: string;
  subtitle?: string;
  sections: Section[];
  activePath?: string;
  onNavigate?: (path: string) => void;
  theme?: 'dark' | 'light';
  onLogout?: () => void;
}

export function Sidebar({
  title = 'ParkEase',
  sections,
  activePath,
  onNavigate,
  theme = 'dark',
  onLogout,
}: SidebarProps) {
  const isLight = theme === 'light';

  return (
    <aside
      className={`relative flex h-full w-full flex-col overflow-hidden border-r backdrop-blur-xl lg:h-screen ${
        isLight
          ? 'border-stone-300 bg-stone-100 text-slate-900'
          : 'border-white/10 bg-slate-950/80 text-white'
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isLight
            ? 'bg-[radial-gradient(circle_at_top,rgba(120,113,108,0.05),transparent_56%),linear-gradient(180deg,rgba(245,245,244,0.98)_0%,rgba(231,229,228,0.98)_100%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(2,6,23,0.98)_100%)]'
        }`}
      />
      <div
        className={`absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[40px_40px] ${
          isLight ? 'opacity-25' : 'opacity-20'
        }`}
      />

      <div className="relative flex h-full min-h-0 flex-col gap-4 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => onNavigate?.('/dashboard')}
          className={`w-full rounded-3xl border px-4 py-4 text-left shadow-xl backdrop-blur-xl transition ${
            isLight
              ? 'border-stone-300 bg-stone-50 shadow-stone-200/20 hover:bg-stone-100'
              : 'border-white/10 bg-white/8 shadow-slate-950/30 hover:bg-white/12'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-lg ${
                isLight
                  ? 'border-slate-400/40 bg-stone-100 text-slate-800 shadow-stone-200/20'
                  : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-cyan-950/20'
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 10h18" />
                <path d="M5 10V6h14v4" />
                <path d="M4 10l1 10h14l1-10" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </div>

            <div className="min-w-0">
              <h1
                className={`truncate text-xl font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
              >
                {title}
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Ir al dashboard
              </p>
            </div>
          </div>
        </button>

        <nav
          className={`flex min-h-0 flex-1 flex-col rounded-3xl border p-3 shadow-inner ${
            isLight
              ? 'border-stone-300 bg-stone-50 shadow-stone-200/20'
              : 'border-white/10 bg-slate-950/40 shadow-slate-950/20'
          }`}
        >
          <p
            className={`px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Navegacion
          </p>
          <ul className="mt-1 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {sections.map((section) => (
              <SideBarItems
                key={section.path}
                label={section.label}
                image={section.image}
                path={section.path}
                subMenu={section.subMenu}
                isActive={activePath === section.path}
                onSelect={onNavigate}
                theme={theme}
              />
            ))}
          </ul>
        </nav>

        <button
          onClick={onLogout}
          className={`mt-auto w-full rounded-3xl border p-4 text-sm font-semibold shadow-lg transition ${
            isLight
              ? 'border-stone-300 bg-stone-100 text-slate-700 hover:bg-stone-200'
              : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-50 hover:bg-cyan-400/20 shadow-cyan-950/20'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 3v18" />
            </svg>
            {t('common.logout')}
          </span>
        </button>
      </div>
    </aside>
  );
}
