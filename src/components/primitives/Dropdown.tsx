import { useState, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  placement?: 'bottom' | 'right' | 'bottom-end';
}

export function Dropdown({
  children,
  trigger,
  triggerClassName = '',
  contentClassName = '',
  placement = 'bottom',
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          setOpen((prev) => !prev);
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) setOpen(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) setOpen(true);
          break;
      }
    },
    [open]
  );

  // Close on Escape key when dropdown is open
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <div
        className={`inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-ring ${triggerClassName}`}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
      >
        {trigger}
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </div>

      {open && (
        <div
          className={`origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${placement === 'right' ? 'left-auto right-0' : placement === 'bottom-end' ? '-ml-px' : 'ml-0'} ${contentClassName}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          {children}
        </div>
      )}
    </div>
  );
}
