import { useEffect, useState } from 'react';
import { VehiclesTable } from '../../components/vehiclesResumeTable';
import { DashboardCard } from '../dashboardCard';
import { t } from '../../i18n';
import { Button, Card } from '../primitives';
import type { Vehicle } from '../../types/electron-api';

interface DashboardStats {
  parkedCount: number;
  todayRevenue: number;
  todayVehicles: number;
}

interface DashboardProps {
  theme?: 'dark' | 'light';
  onGoToVehicles?: () => void;
  onQuickAddVehicle?: () => void;
  triggerQuickAddToken?: number;
  onQuickAddHandled?: () => void;
  isAdmin?: boolean;
}

function useDashboardStats() {
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

    fetchStats();
    const intervalId = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return stats;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function Dashboard({ theme = 'dark', onGoToVehicles, onQuickAddVehicle }: DashboardProps) {
  const isLight = theme === 'light';
  const stats = useDashboardStats();
  const [activeVehicles, setActiveVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    const loadActiveVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const data = await window.electronAPI.vehicles.getActive();
        setActiveVehicles(data || []);
      } catch (error) {
        console.error('Error fetching active vehicles:', error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadActiveVehicles();
  }, []);

  function formatDateTime(dateValue: string): string {
    return new Date(dateValue).toLocaleString('es-CR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title={t('dashboard.parkedVehicles')}
          info={stats.parkedCount.toString()}
          detail="En este momento"
          theme={theme}
        />
        <DashboardCard
          title={t('dashboard.todayRevenue')}
          info={formatCurrency(stats.todayRevenue)}
          detail={t('dashboard.colonesAccumulated')}
          theme={theme}
        />
        <DashboardCard
          title={t('dashboard.todayVehicles')}
          info={stats.todayVehicles.toString()}
          detail={t('dashboard.closedExits')}
          theme={theme}
        />
      </div>

      <Card
        variant="panel"
        className={`overflow-hidden p-0 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900/60'}`}
      >
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${isLight ? 'border-stone-200 bg-stone-50/50' : 'border-white/10 bg-slate-950/40'}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${isLight ? 'bg-cyan-100' : 'bg-cyan-400/20'}`}
            >
              <svg
                className={`h-5 w-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h8m-8 0V3m0 4v4m0-4h8m-8 0v4m0-4a2 2 0 012-2 2v2a2 2 0 002 2v2m0-4H8"
                />
              </svg>
            </div>
            <div>
              <h3
                className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
              >
                Vehículos en parqueo
              </h3>
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {activeVehicles.length} activo{activeVehicles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="filled" size="sm" onClick={onQuickAddVehicle}>
              + Nuevo
            </Button>
            <Button type="button" variant="outlined" size="sm" onClick={onGoToVehicles}>
              Ver todos
            </Button>
          </div>
        </div>

        <div className="divide-y divide-inherit">
          {loadingVehicles ? (
            <div
              className={`px-5 py-8 text-center text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
            >
              {t('common.loading')}
            </div>
          ) : activeVehicles.length === 0 ? (
            <div
              className={`px-5 py-8 text-center text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
            >
              {t('vehicles.noVehicles')}
            </div>
          ) : (
            activeVehicles.slice(0, 6).map((vehicle, index) => (
              <div
                key={vehicle.veh_id}
                className={`flex items-center justify-between px-5 py-3 transition-colors ${isLight ? 'hover:bg-stone-50' : 'hover:bg-slate-800/30'}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-cyan-300'}`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-sm font-bold tracking-wide ${isLight ? 'bg-slate-900 text-white' : 'bg-cyan-400/20 text-cyan-300'}`}
                    >
                      {vehicle.veh_plate}
                    </span>
                    <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      {vehicle.veh_owner || vehicle.veh_reference || '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {formatDateTime(vehicle.veh_ingress_date)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onGoToVehicles}
                    className={
                      isLight
                        ? 'text-cyan-600 hover:bg-cyan-50'
                        : 'text-cyan-400 hover:bg-cyan-400/10'
                    }
                  >
                    →
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {activeVehicles.length > 6 && (
          <button
            onClick={onGoToVehicles}
            className={`flex w-full items-center justify-center gap-2 border-t px-5 py-3 text-sm font-medium transition-colors ${isLight ? 'border-stone-200 text-cyan-600 hover:bg-stone-50' : 'border-white/10 text-cyan-400 hover:bg-slate-800/30'}`}
          >
            Ver {activeVehicles.length - 6} vehículos más
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7-7m0 0v14"
              />
            </svg>
          </button>
        )}
      </Card>
    </div>
  );
}

export function Vehicles({
  theme = 'dark',
  triggerQuickAddToken,
  onQuickAddHandled,
  isAdmin = false,
}: DashboardProps) {
  return (
    <VehiclesTable
      theme={theme}
      triggerQuickAddToken={triggerQuickAddToken}
      onQuickAddHandled={onQuickAddHandled}
      isAdmin={isAdmin}
    />
  );
}

export function DashboardCardsPanel({ theme = 'dark' }: DashboardProps) {
  const stats = useDashboardStats();

  const cards = [
    {
      title: t('dashboard.parkedVehicles'),
      info: stats.parkedCount.toString(),
    },
    {
      title: t('dashboard.todayRevenue'),
      info: formatCurrency(stats.todayRevenue),
      detail: t('dashboard.colonesAccumulated'),
    },
    {
      title: t('dashboard.todayVehicles'),
      info: stats.todayVehicles.toString(),
      detail: t('dashboard.closedExits'),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            info={card.info}
            detail={card.detail}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
