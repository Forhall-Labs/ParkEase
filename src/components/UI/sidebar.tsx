// @author AleLeonMarin

import { SideBarItems, type SideBarSubItem } from '../sidebarItems';

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
      className={`relative flex h-full min-h-screen w-full flex-col overflow-hidden border-r backdrop-blur-xl ${
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

      <div className="relative flex h-full flex-col gap-6 p-5 sm:p-6">
        <div
          className={`rounded-3xl border p-5 shadow-2xl backdrop-blur-xl ${
            isLight
              ? 'border-stone-300 bg-stone-50 shadow-stone-200/20'
              : 'border-white/10 bg-white/8 shadow-slate-950/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-3xl border shadow-lg ${
                isLight
                  ? 'border-slate-400/40 bg-stone-100 text-slate-800 shadow-stone-200/20'
                  : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-cyan-950/20'
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-7 w-7"
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
                className={`truncate text-2xl font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
              >
                {title}
              </h1>
            </div>
          </div>
        </div>

        <nav
          className={`flex-1 rounded-3xl border p-3 shadow-inner ${
            isLight
              ? 'border-stone-300 bg-stone-50 shadow-stone-200/20'
              : 'border-white/10 bg-slate-950/40 shadow-slate-950/20'
          }`}
        >
          <ul className="mt-2 space-y-2">
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
          className={`w-full rounded-3xl border p-4 text-sm font-semibold shadow-lg transition ${
            isLight
              ? 'border-stone-300 bg-stone-100 text-slate-700 hover:bg-stone-200'
              : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-50 hover:bg-cyan-400/20 shadow-cyan-950/20'
          }`}
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
