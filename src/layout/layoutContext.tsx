import { createContext, useContext, useEffect, useState } from 'react';

interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  layoutWidth: number;
  setLayoutWidth: (width: number) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setLayoutWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <LayoutContext.Provider
      value={{ sidebarCollapsed, setSidebarCollapsed, layoutWidth, setLayoutWidth }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === null) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
