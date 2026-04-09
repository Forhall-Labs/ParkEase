// @author AleLeonMarin

import type React from 'react';

export interface SideBarSubItem {
  label: string;
  path: string;
}

interface SideBarItemsProps {
  label: string;
  image?: string;
  path: string;
  isActive?: boolean;
  subMenu?: SideBarSubItem[];
  onSelect?: (path: string) => void;
  theme?: 'dark' | 'light';
}

export const SideBarItems: React.FC<SideBarItemsProps> = ({
  label,
  image,
  path,
  isActive = false,
  subMenu,
  onSelect,
  theme = 'dark',
}) => {
  const subMenuItems = subMenu ?? [];
  const hasSubMenu = subMenuItems.length > 0;

  function getPathIcon(targetPath: string) {
    const iconClass = 'h-5 w-5';

    if (targetPath === '/vehiculos') {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={iconClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 10h18" />
          <path d="M5 10V6h14v4" />
          <path d="M4 10l1 7h14l1-7" />
          <circle cx="8" cy="18" r="1.5" />
          <circle cx="16" cy="18" r="1.5" />
        </svg>
      );
    }

    if (targetPath === '/reportes') {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={iconClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19h16" />
          <path d="M7 15v-4" />
          <path d="M12 15V9" />
          <path d="M17 15V6" />
        </svg>
      );
    }

    if (targetPath === '/usuarios') {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={iconClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
      );
    }

    if (targetPath === '/configuracion') {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={iconClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.08V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-.4-1.08 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.08-.4H2.8a2 2 0 1 1 0-4h.12A1.7 1.7 0 0 0 4 9.2a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.08V2.8a2 2 0 1 1 4 0v.12a1.7 1.7 0 0 0 .4 1.08 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.29.3.48.65.6 1 .08.33.1.67.1 1s-.02.67-.1 1a1.7 1.7 0 0 0-.6 1z" />
        </svg>
      );
    }

    return null;
  }

  const pathIcon = getPathIcon(path);

  return (
    <li className="space-y-2">
      <button
        type="button"
        onClick={() => onSelect?.(path)}
        className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-200 ${
          isActive
            ? theme === 'light'
              ? 'border-stone-300 bg-stone-50 text-slate-900 shadow-lg shadow-stone-200/20'
              : 'border-cyan-400/40 bg-cyan-400/10 text-white shadow-lg shadow-cyan-950/25'
            : theme === 'light'
              ? 'border-stone-300 bg-stone-100 text-slate-800 hover:border-stone-400 hover:bg-stone-200 hover:text-slate-900'
              : 'border-white/8 bg-white/5 text-slate-300 hover:border-white/15 hover:bg-white/10 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
            isActive
              ? theme === 'light'
                ? 'border-stone-400 bg-stone-100'
                : 'border-cyan-400/40 bg-cyan-400/15'
              : theme === 'light'
                ? 'border-stone-300 bg-stone-100 group-hover:border-stone-400'
                : 'border-white/10 bg-slate-950/40 group-hover:border-cyan-400/25'
          }`}
        >
          {image ? (
            <img src={image} alt={label} className="h-5 w-5 object-contain" />
          ) : pathIcon ? (
            pathIcon
          ) : (
            <span
              className={`text-sm font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-cyan-200'}`}
            >
              {label.slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold tracking-wide">{label}</span>
        </span>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 transition ${
            isActive
              ? theme === 'light'
                ? 'text-cyan-600'
                : 'text-cyan-300'
              : theme === 'light'
                ? 'text-slate-500 group-hover:text-slate-700'
                : 'text-slate-500 group-hover:text-slate-300'
          }`}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {hasSubMenu && (
        <div
          className={`ml-6 space-y-2 border-l pl-4 ${theme === 'light' ? 'border-slate-400' : 'border-white/10'}`}
        >
          {subMenuItems.map((item) => (
            <button
              key={`${item.label}-${item.path}`}
              type="button"
              onClick={() => onSelect?.(item.path)}
              className={`block w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm transition ${
                theme === 'light'
                  ? 'text-slate-700 hover:border-stone-400 hover:bg-stone-100 hover:text-slate-900'
                  : 'text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </li>
  );
};
