import { useEffect, useState } from 'react';
import { VehiclesTable } from '../../components/vehiclesResumeTable';
import { DashboardCard } from '../dashboardCard';
import { t } from '../../i18n';
import { Button, Card, SectionHeader, StatusBadge } from '../primitives';
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
  const visibleVehicles = activeVehicles.slice(0, 8);

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
    <div className="space-y-5 sm:space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card
          variant="panel"
          className={`ui-section-padding min-w-0 ${isLight ? 'border-stone-200 bg-white' : 'border-slate-700/70 bg-slate-900/60'}`}
        >
          <SectionHeader
            label="Monitoreo"
            title="Vehiculos actualmente en parqueo"
            subtitle="Vista rapida de los ingresos activos"
            action={<StatusBadge tone="info">{activeVehicles.length} activos</StatusBadge>}
            className="mb-4"
          />

          <div
            className={`overflow-hidden rounded-2xl border ${isLight ? 'border-stone-200' : 'border-white/10'}`}
          >
            <div className="max-h-[520px] overflow-y-auto">
              <table className="w-full table-fixed text-sm">
                <thead className={isLight ? 'bg-stone-100' : 'bg-slate-950/60'}>
                  <tr>
                    <th
                      className={`w-[18%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${isLight ? 'text-slate-700' : 'text-cyan-200'}`}
                    >
                      {t('vehicles.plate')}
                    </th>
                    <th
                      className={`w-[25%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${isLight ? 'text-slate-700' : 'text-cyan-200'}`}
                    >
                      {t('vehicles.owner')}
                    </th>
                    <th
                      className={`w-[26%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${isLight ? 'text-slate-700' : 'text-cyan-200'}`}
                    >
                      {t('vehicles.reference')}
                    </th>
                    <th
                      className={`w-[31%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${isLight ? 'text-slate-700' : 'text-cyan-200'}`}
                    >
                      {t('vehicles.ingressTime')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingVehicles ? (
                    <tr>
                      <td
                        colSpan={4}
                        className={`px-4 py-6 text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        {t('common.loading')}
                      </td>
                    </tr>
                  ) : visibleVehicles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className={`px-4 py-6 text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        {t('vehicles.noVehicles')}
                      </td>
                    </tr>
                  ) : (
                    visibleVehicles.map((vehicle) => (
                      <tr
                        key={vehicle.veh_id}
                        className={`border-t ${isLight ? 'border-stone-200' : 'border-white/10'} ${isLight ? 'hover:bg-stone-50' : 'hover:bg-slate-800/40'}`}
                      >
                        <td
                          className={`truncate px-4 py-3 font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}
                          title={vehicle.veh_plate}
                        >
                          {vehicle.veh_plate}
                        </td>
                        <td
                          className={`truncate px-4 py-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                          title={vehicle.veh_owner || '-'}
                        >
                          {vehicle.veh_owner || '-'}
                        </td>
                        <td
                          className={`truncate px-4 py-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                          title={vehicle.veh_reference}
                        >
                          {vehicle.veh_reference}
                        </td>
                        <td
                          className={`px-4 py-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                        >
                          {formatDateTime(vehicle.veh_ingress_date)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {activeVehicles.length > 8 && (
            <p className={`mt-3 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Mostrando 8 de {activeVehicles.length} vehiculos activos. Usa "Ver modulo de
              vehiculos" para ver todos.
            </p>
          )}
        </Card>

        <div className="space-y-4">
          <Card
            variant="panel"
            className={`ui-section-padding ${isLight ? 'border-stone-200 bg-white' : 'border-slate-700/70 bg-slate-900/60'}`}
          >
            <p
              className={`text-xs uppercase tracking-[0.2em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
            >
              Atajos rapidos
            </p>
            <p
              className={`mt-2 text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
            >
              Accede rapido al modulo de Vehiculos para ingresar carros y gestionar salidas.
            </p>
            <div className="mt-4 grid gap-2">
              <Button type="button" variant="filled" onClick={onQuickAddVehicle}>
                + Ingresar carro
              </Button>
              <Button type="button" variant="outlined" onClick={onGoToVehicles}>
                Ver modulo de vehiculos
              </Button>
            </div>
          </Card>
        </div>
      </div>
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
    <div className="space-y-3 sm:space-y-4">
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
