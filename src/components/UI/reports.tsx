// @author AleLeonMarin

import { useEffect, useState } from 'react';
import { getLanguage, t } from '../../i18n';
import type { ReportPeriod, VehicleReportResult } from '../../types/electron-api';
import { Button, Card, Input, SectionHeader, StatusBadge } from '../primitives';
import { ConfirmModal } from './Modal';

interface ReportsProps {
  theme?: 'dark' | 'light';
}

const REPORT_PERIODS: ReportPeriod[] = ['daily', 'weekly', 'monthly', 'yearly'];
const REPORT_WINDOW_DAYS: Record<ReportPeriod, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

function getTodayInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateInputBounds(): { min?: string; max: string } {
  return {
    max: getTodayInputValue(),
  };
}

function shiftInputDate(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return getTodayInputValue();
  }

  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeInputDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return getTodayInputValue();
  }
  return date.toISOString().slice(0, 10);
}

function clampToToday(value: string): string {
  const safeDate = normalizeInputDate(value);
  const today = getTodayInputValue();

  return safeDate > today ? today : safeDate;
}

function getRangeFromEndDate(
  period: ReportPeriod,
  endDate: string
): { rangeStart: string; rangeEnd: string } {
  const rangeEnd = clampToToday(endDate);
  const windowDays = REPORT_WINDOW_DAYS[period];
  const rangeStart = shiftInputDate(rangeEnd, -(windowDays - 1));

  return {
    rangeStart,
    rangeEnd,
  };
}

function getRangeFromStartDate(
  period: ReportPeriod,
  startDate: string
): { rangeStart: string; rangeEnd: string } {
  const rangeStart = normalizeInputDate(startDate);
  const windowDays = REPORT_WINDOW_DAYS[period];
  const targetEnd = shiftInputDate(rangeStart, windowDays - 1);
  const rangeEnd = clampToToday(targetEnd);

  return getRangeFromEndDate(period, rangeEnd);
}

function formatDateValue(value: string): string {
  const language = getLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-CR';
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

function formatDateTimeValue(value: string): string {
  const language = getLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-CR';
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatCurrency(value: number): string {
  const language = getLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-CR';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function createEmptyReport(period: ReportPeriod, selectedDate: string): VehicleReportResult {
  return {
    period,
    rangeStart: selectedDate,
    rangeEnd: selectedDate,
    totalVehicles: 0,
    totalRevenue: 0,
    rows: [],
  };
}

export function Reports({ theme = 'dark' }: ReportsProps) {
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [selectedRange, setSelectedRange] = useState(() =>
    getRangeFromEndDate('daily', getTodayInputValue())
  );
  const [report, setReport] = useState<VehicleReportResult>(() =>
    createEmptyReport('daily', getTodayInputValue())
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isLight = theme === 'light';
  const dateBounds = getDateInputBounds();
  const hasRows = report.rows.length > 0;

  useEffect(() => {
    let isActive = true;

    const loadReport = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const data = await window.electronAPI.vehicles.getReport(period, selectedRange.rangeEnd);
        if (isActive) {
          setReport(data);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : t('reports.error'));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadReport();

    return () => {
      isActive = false;
    };
  }, [period, selectedRange.rangeEnd, refreshToken]);

  function handleRefreshReport() {
    setRefreshToken((current) => current + 1);
  }

  function handlePeriodChange(nextPeriod: ReportPeriod) {
    setPeriod(nextPeriod);
    setSelectedRange((currentRange) => getRangeFromEndDate(nextPeriod, currentRange.rangeEnd));
  }

  function handleStartDateChange(nextDate: string) {
    setSelectedRange(getRangeFromStartDate(period, nextDate || getTodayInputValue()));
  }

  function handleEndDateChange(nextDate: string) {
    setSelectedRange(getRangeFromEndDate(period, nextDate || getTodayInputValue()));
  }

  function handleResetFilters() {
    setShowResetConfirm(true);
  }

  function confirmResetFilters() {
    const today = getTodayInputValue();
    setPeriod('daily');
    setSelectedRange(getRangeFromEndDate('daily', today));
    setShowResetConfirm(false);
  }

  const summaryCards = [
    {
      id: 'range',
      title: t('reports.range'),
      info: `${formatDateValue(report.rangeStart)} - ${formatDateValue(report.rangeEnd)}`,
      detail: t(`reports.periods.${period}`),
      tone: 'sky' as const,
    },
    {
      id: 'vehicles',
      title: t('reports.totalVehicles'),
      info: report.totalVehicles.toString(),
      detail: t('reports.details'),
      tone: 'teal' as const,
    },
    {
      id: 'revenue',
      title: t('reports.totalRevenue'),
      info: formatCurrency(report.totalRevenue),
      detail: t('reports.refresh'),
      tone: 'amber' as const,
    },
  ];

  const tileToneClasses = {
    sky: isLight
      ? 'from-sky-100 via-white to-blue-100 border-sky-200/70 text-slate-900'
      : 'from-blue-950/80 via-slate-900/80 to-sky-950/70 border-sky-400/30 text-slate-100',
    teal: isLight
      ? 'from-teal-100 via-white to-emerald-100 border-emerald-200/70 text-slate-900'
      : 'from-teal-950/75 via-slate-900/80 to-emerald-950/70 border-emerald-400/30 text-slate-100',
    amber: isLight
      ? 'from-amber-100 via-white to-orange-100 border-amber-200/70 text-slate-900'
      : 'from-amber-950/70 via-slate-900/80 to-orange-950/60 border-amber-400/30 text-slate-100',
  };

  return (
    <div className="ui-font-sans ui-stack-lg">
      <Card
        variant="panel"
        className={`relative overflow-hidden ui-section-padding shadow-xl sm:p-6 ${isLight ? 'border-slate-200 bg-linear-to-br from-slate-50 via-white to-sky-50 shadow-slate-200/40' : 'border-slate-700/70 bg-linear-to-br from-slate-900 via-slate-900 to-blue-950/60 shadow-black/30'}`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-10 right-[-18%] h-56 w-56 rounded-full blur-3xl ${isLight ? 'bg-sky-200/60' : 'bg-blue-500/20'}`}
        />

        <div className="relative z-10 space-y-5">
          <div className="space-y-3">
            <SectionHeader
              label={t('reports.title')}
              title={t('reports.description')}
              badge={
                <div className="flex flex-wrap gap-2 pt-2">
                  <StatusBadge tone="info">{t(`reports.periods.${period}`)}</StatusBadge>
                  <StatusBadge tone="warning">
                    {report.totalVehicles} {t('reports.totalVehicles')}
                  </StatusBadge>
                </div>
              }
            />
          </div>

          <div
            className={`control-shell w-full ui-shell-padding sm:p-4 ${isLight ? 'border-slate-200 bg-white/95' : 'border-slate-700/80 bg-slate-950/40'}`}
          >
            <div className="grid gap-3 lg:grid-cols-12">
              <label className="space-y-2 lg:col-span-12">
                <span
                  className={`block text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                >
                  {t('reports.period')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {REPORT_PERIODS.map((candidatePeriod) => {
                    const active = period === candidatePeriod;
                    return (
                      <Button
                        key={candidatePeriod}
                        type="button"
                        onClick={() => handlePeriodChange(candidatePeriod)}
                        variant={active ? 'filled' : 'outlined'}
                        size="sm"
                        className={active ? 'shadow-lg shadow-sky-950/15' : ''}
                      >
                        {t(`reports.periods.${candidatePeriod}`)}
                      </Button>
                    );
                  })}
                </div>
              </label>

              <label className="space-y-2 sm:col-span-1 lg:col-span-4">
                <span
                  className={`block text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                >
                  {t('reports.startDate')}
                </span>
                <Input
                  type="date"
                  value={selectedRange.rangeStart}
                  onChange={(event) => handleStartDateChange(event.target.value)}
                  max={selectedRange.rangeEnd}
                  disabled={period === 'daily'}
                  className={
                    isLight
                      ? 'border-slate-300 bg-slate-50 text-slate-900 disabled:bg-slate-100 disabled:text-slate-400'
                      : 'border-slate-600/70 bg-slate-900/70 text-white disabled:bg-slate-800 disabled:text-slate-500'
                  }
                />
              </label>

              <label className="space-y-2 sm:col-span-1 lg:col-span-4">
                <span
                  className={`block text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                >
                  {t('reports.endDate')}
                </span>
                <Input
                  type="date"
                  value={selectedRange.rangeEnd}
                  onChange={(event) => handleEndDateChange(event.target.value)}
                  min={selectedRange.rangeStart}
                  max={dateBounds.max}
                  className={
                    isLight
                      ? 'border-slate-300 bg-slate-50 text-slate-900'
                      : 'border-slate-600/70 bg-slate-900/70 text-white'
                  }
                />
              </label>

              <div className="flex flex-wrap items-end justify-start gap-2 sm:justify-end lg:col-span-4">
                <Button
                  type="button"
                  onClick={handleRefreshReport}
                  variant="filled"
                  className="whitespace-nowrap hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  {t('reports.refresh')}
                </Button>
                <Button
                  type="button"
                  onClick={handleResetFilters}
                  variant="text"
                  className={`whitespace-nowrap ${isLight ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-slate-600/70 bg-slate-800/80 text-slate-300 hover:border-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                  {t('reports.reset')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div
          className={`space-y-3 rounded-3xl border p-5 ${isLight ? 'border-stone-200 bg-white' : 'border-white/10 bg-slate-900/70'}`}
        >
          <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('reports.loading')}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div
              className={`h-20 rounded-2xl animate-pulse motion-reduce:animate-none ${isLight ? 'bg-stone-100' : 'bg-white/10'}`}
            />
            <div
              className={`h-20 rounded-2xl animate-pulse motion-reduce:animate-none ${isLight ? 'bg-stone-100' : 'bg-white/10'}`}
            />
            <div
              className={`h-20 rounded-2xl animate-pulse motion-reduce:animate-none ${isLight ? 'bg-stone-100' : 'bg-white/10'}`}
            />
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div
              className={`rounded-3xl border px-4 py-3 text-sm ${isLight ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-rose-400/30 bg-rose-500/10 text-rose-200'}`}
            >
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => (
              <Card
                key={card.id}
                className={`bg-linear-to-br p-5 shadow-lg transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none ${tileToneClasses[card.tone]}`}
              >
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                >
                  {card.title}
                </p>
                <p
                  className={`mt-3 text-3xl leading-tight font-semibold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
                >
                  {card.info}
                </p>
                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {card.detail}
                </p>
              </Card>
            ))}
          </div>

          <Card
            className={`overflow-hidden rounded-3xl shadow-xl ${isLight ? 'border-slate-200 bg-white' : 'border-slate-700/80 bg-slate-900/70'}`}
          >
            <div
              className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-700/80 bg-slate-950/30'}`}
            >
              <h3 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t('reports.details')}
              </h3>
              <StatusBadge
                tone="neutral"
                className={
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-700/70 text-slate-200'
                }
              >
                {report.rows.length} {t('reports.totalVehicles')}
              </StatusBadge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className={isLight ? 'bg-slate-100' : 'bg-slate-950/95'}>
                    <th
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                    >
                      {t('reports.table.id')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                    >
                      {t('reports.table.plate')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                    >
                      {t('reports.table.owner')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                    >
                      {t('reports.table.ingress')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                    >
                      {t('reports.table.egress')}
                    </th>
                    <th
                      className={`px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.2em] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                    >
                      {t('reports.table.tax')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!hasRows ? (
                    <tr>
                      <td
                        colSpan={6}
                        className={`px-4 py-10 text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        <div className="mx-auto max-w-md space-y-2">
                          <h4
                            className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}
                          >
                            {t('reports.emptyTitle')}
                          </h4>
                          <p className="text-sm">{t('reports.emptyBody')}</p>
                          <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('reports.noDataHint')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    report.rows.map((row) => (
                      <tr
                        key={row.veh_id}
                        className={`border-t transition-colors duration-200 ease-out motion-reduce:transition-none ${isLight ? 'border-slate-200 odd:bg-white even:bg-slate-50/70 hover:bg-sky-50' : 'border-slate-800 odd:bg-slate-900/40 even:bg-slate-900/70 hover:bg-slate-800/70'}`}
                      >
                        <td
                          className={`px-4 py-3 text-sm font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
                        >
                          {row.veh_id}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-semibold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}
                        >
                          {row.veh_plate}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                        >
                          {row.veh_owner || '—'}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
                        >
                          {formatDateTimeValue(row.veh_ingress_date)}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
                        >
                          {formatDateTimeValue(row.veh_egress_date)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-amber-100'}`}
                        >
                          {formatCurrency(Number(row.veh_tax || 0))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <ConfirmModal
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmResetFilters}
        title={t('reports.reset')}
        message={t('reports.resetConfirm')}
        confirmText={t('reports.reset')}
        cancelText={t('common.cancel')}
        variant="warning"
      />
    </div>
  );
}
