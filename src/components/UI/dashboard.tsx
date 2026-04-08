import { useState, useEffect } from 'react';
import { VehiclesTable } from '../vehiclesResumeTable';
import { DashboardCard } from '../dashboardCard';

interface DashboardStats {
  parkedCount: number;
  todayRevenue: number;
  todayVehicles: number;
}

interface DashboardProps {
  theme?: 'dark' | 'light';
}

export function Dashboard({ theme = 'dark' }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    parkedCount: 0,
    todayRevenue: 0,
    todayVehicles: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await window.electronAPI.vehicles.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    // Fetch immediately on mount
    fetchStats();

    // Set up 30-second auto-refresh
    const intervalId = setInterval(fetchStats, 30000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format currency as Costa Rican colones
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    { title: 'Vehículos Parqueados', info: stats.parkedCount.toString() },
    { title: 'Ingresos de Hoy', info: formatCurrency(stats.todayRevenue) },
    { title: 'Vehículos Atendidos', info: stats.todayVehicles.toString() },
  ];

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}
            >
              Panel
            </p>
            <h2
              className={`mt-1 text-sm font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
            >
              Resumen rápido
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {cards.map((card) => (
            <DashboardCard key={card.title} title={card.title} info={card.info} theme={theme} />
          ))}
        </div>
      </div>
      <VehiclesTable theme={theme} />
    </>
  );
}

export function DashboardCardsPanel({ theme = 'dark' }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    parkedCount: 0,
    todayRevenue: 0,
    todayVehicles: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await window.electronAPI.vehicles.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    // Fetch immediately on mount
    fetchStats();

    // Set up 30-second auto-refresh
    const intervalId = setInterval(fetchStats, 30000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format currency as Costa Rican colones
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    { title: 'Vehículos Parqueados', info: stats.parkedCount.toString() },
    { title: 'Ingresos de Hoy', info: formatCurrency(stats.todayRevenue) },
    { title: 'Vehículos Atendidos', info: stats.todayVehicles.toString() },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}
          >
            Panel
          </p>
          <h2
            className={`mt-1 text-sm font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
          >
            Resumen rápido
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {cards.map((card) => (
          <DashboardCard key={card.title} title={card.title} info={card.info} theme={theme} />
        ))}
      </div>
    </div>
  );
}
