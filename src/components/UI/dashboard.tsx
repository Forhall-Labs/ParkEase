import { useEffect, useState } from 'react';
import { VehiclesTable } from '../../components/vehiclesResumeTable';
import { DashboardCard } from '../dashboardCard';
import { t } from '../../i18n';
import { Button, Card, SectionHeader } from '../primitives';
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

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Card
          variant="panel"
          className={`min-w-0 overflow-hidden ${isLight ? 'border-stone-200 bg-white' : 'border-slate-700/70 bg-slate-900/60'}`}
        >
          <div className="p-4 pb-3">
            <SectionHeader
              label="Monitoreo"
              title="Vehículos en parqueo"
              subtitle={`${activeVehicles.length} activo${activeVehicles.length !== 1 ? 's' : ''}`}
              className="mb-0"
            />
          </div>

          <div className={`border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
            <table className="w-full table-fixed text-xs">
              <colgroup>
                <col className="w-24" />
                <col className="w-32" />
                <col className="w-28" />
                <col className="w-28" />
              </colgroup>
              <thead className={isLight ? 'bg-stone-50' : 'bg-slate-950/60'}>
                <tr>
                  <th
                    className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wide ${isLight ? 'text-slate-600' : 'text-cyan-200'}`}
                  >
                    {t('vehicles.plate')}
                  </th>
                  <th
                    className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wide ${isLight ? 'text-slate-600' : 'text-cyan-200'}`}
                  >
                    {t('vehicles.owner')}
                  </th>
                  <th
                    className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wide ${isLight ? 'text-slate-600' : 'text-cyan-200'}`}
                  >
                    {t('vehicles.reference')}
                  </th>
                  <th
                    className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wide ${isLight ? 'text-slate-600' : 'text-cyan-200'}`}
                  >
                    {t('vehicles.ingressTime')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {loadingVehicles ? (
                  <tr>
                    <td
                      colSpan={4}
                      className={`px-3 py-8 text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                      {t('common.loading')}
                    </td>
                  </tr>
                ) : visibleVehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className={`px-3 py-8 text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                      {t('vehicles.noVehicles')}
                    </td>
                  </tr>
                ) : (
                  visibleVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.veh_id}
                      className={`transition-colors ${isLight ? 'hover:bg-stone-50' : 'hover:bg-slate-800/40'}`}
                    >
                      <td
                        className={`truncate px-3 py-2.5 font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}
                      >
                        {vehicle.veh_plate}
                      </td>
                      <td
                        className={`truncate px-3 py-2.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                      >
                        {vehicle.veh_owner || '-'}
                      </td>
                      <td
                        className={`truncate px-3 py-2.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                      >
                        {vehicle.veh_reference}
                      </td>
                      <td
                        className={`truncate px-3 py-2.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                      >
                        {formatDateTime(vehicle.veh_ingress_date)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {activeVehicles.length > 8 && (
            <div
              className={`border-t px-4 py-3 ${isLight ? 'border-stone-200' : 'border-white/10'}`}
            >
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Mostrando 8 de {activeVehicles.length} vehículos. Ver todos en el módulo de
                vehículos.
              </p>
            </div>
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
              Acciones rápidas
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button type="button" variant="filled" onClick={onQuickAddVehicle}>
                + Ingresar vehículo
              </Button>
              <Button type="button" variant="outlined" onClick={onGoToVehicles}>
                Ver módulo de vehículos
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
