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
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
        className={`overflow-hidden ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900/60'}`}
      >
        <div
          className={`flex items-center justify-between border-b px-4 py-3 ${isLight ? 'border-stone-200' : 'border-white/10'}`}
        >
          <div>
            <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Vehículos en parqueo
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {activeVehicles.length} activo{activeVehicles.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="filled" size="sm" onClick={onQuickAddVehicle}>
              + Ingresar
            </Button>
            <Button type="button" variant="outlined" size="sm" onClick={onGoToVehicles}>
              Ver todos
            </Button>
          </div>
        </div>

        <div className="divide-y divide-inherit">
          {loadingVehicles ? (
            <div
              className={`px-4 py-8 text-center text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
            >
              {t('common.loading')}
            </div>
          ) : activeVehicles.length === 0 ? (
            <div
              className={`px-4 py-8 text-center text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
            >
              {t('vehicles.noVehicles')}
            </div>
          ) : (
            activeVehicles.slice(0, 5).map((vehicle) => (
              <div
                key={vehicle.veh_id}
                className={`flex items-center justify-between px-4 py-2.5 transition-colors hover:${isLight ? 'bg-stone-50' : 'bg-slate-800/40'}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${isLight ? 'bg-stone-100 text-slate-800' : 'bg-cyan-400/10 text-cyan-200'}`}
                  >
                    {vehicle.veh_plate}
                  </span>
                  <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {vehicle.veh_owner || vehicle.veh_reference || '-'}
                  </span>
                </div>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formatDateTime(vehicle.veh_ingress_date)}
                </span>
              </div>
            ))
          )}
        </div>

        {activeVehicles.length > 5 && (
          <div className={`border-t px-4 py-2 ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
            <button
              onClick={onGoToVehicles}
              className={`text-xs ${isLight ? 'text-cyan-700 hover:text-cyan-600' : 'text-cyan-300 hover:text-cyan-200'}`}
            >
              Ver {activeVehicles.length - 5} más →
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

export function Vehicles({
  theme = 'dark',
  triggerQuickAddToken,
  onQuickAddHandled,
}: DashboardProps) {
  return (
    <VehiclesTable
      theme={theme}
      triggerQuickAddToken={triggerQuickAddToken}
      onQuickAddHandled={onQuickAddHandled}
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
