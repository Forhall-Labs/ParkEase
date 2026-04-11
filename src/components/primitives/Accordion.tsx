import { useState, useCallback, useEffect } from 'react';

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  defaultOpen?: boolean;
  title: string;
}

export function Accordion({
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  defaultOpen = false,
  title,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setOpen((prev) => !prev);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setOpen((prev) => !prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setOpen((prev) => !prev);
        break;
    }
  }, []);

  // Close on Escape key when accordion is open
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
    <div className={className}>
      <div
        className={`flex w-full items-center justify-between p-4 border-b border-gray-200 bg-white cursor-pointer text-left focus-ring hover:bg-gray-50 ${headerClassName}`}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-controls="accordion-content"
      >
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={open ? 'M19 9l-7 7-7-7' : 'M9 5l6 6 6-6'}
          />
        </svg>
      </div>

      {open && <div className={contentClassName}>{children}</div>}
    </div>
  );
}
