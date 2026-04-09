import { useEffect, useState } from 'react';
import { VehiclesTable } from '../../components/vehiclesResumeTable';
import { DashboardCard } from '../dashboardCard';
import { t } from '../../i18n';
import { Card, SectionHeader, StatusBadge } from '../primitives';

interface DashboardStats {
  parkedCount: number;
  todayRevenue: number;
  todayVehicles: number;
}

interface DashboardProps {
  theme?: 'dark' | 'light';
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

export function Dashboard({ theme = 'dark' }: DashboardProps) {
  const isLight = theme === 'light';

  return (
    <div className="space-y-5 sm:space-y-6">
      <Card
        variant="panel"
        className={`ui-section-padding ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700/70 bg-slate-900/70'}`}
      >
        <SectionHeader
          label={t('dashboard.dashboard')}
          title={t('dashboard.currentStatus')}
          subtitle={t('dashboard.closedExits')}
          badge={<StatusBadge tone="info">{t('dashboard.parkedVehicles')}</StatusBadge>}
        />
      </Card>
      <VehiclesTable theme={theme} />
    </div>
  );
}

export function DashboardCardsPanel({ theme = 'dark' }: DashboardProps) {
  const stats = useDashboardStats();

  const cards = [
    {
      title: t('dashboard.parkedVehicles'),
      info: stats.parkedCount.toString(),
      detail: t('dashboard.currentStatus'),
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
