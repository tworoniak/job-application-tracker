import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useInterviewReminders } from '../hooks/useInterviewReminders';
import {
  MetricCard,
  OutcomeChart,
  WeeklyChart,
  UpcomingInterviews,
  FunnelChart,
} from '../components';
import { Skeleton } from '@/components/ui';

export const DashboardPage = () => {
  const { metrics, loading } = useDashboardMetrics();
  const { permission, requestPermission, supported } = useInterviewReminders(
    metrics?.upcomingInterviews ?? [],
  );

  const activeCount =
    metrics?.byOutcome
      .filter(
        (o) =>
          ![
            'REJECTED',
            'WITHDRAWN',
            'NO_RESPONSE',
            'GHOSTED',
            'OFFER_ACCEPTED',
          ].includes(o.outcome),
      )
      .reduce((sum, o) => sum + o.count, 0) ?? 0;

  const responseRate =
    metrics && metrics.totalApplications > 0
      ? Math.round(
          (metrics.byOutcome
            .filter(
              (o) => !['APPLIED', 'NO_RESPONSE', 'GHOSTED'].includes(o.outcome),
            )
            .reduce((sum, o) => sum + o.count, 0) /
            metrics.totalApplications) *
            100,
        )
      : null;

  const sectionTitle = (text: string) => (
    <h2 className='font-display font-semibold text-xl text-gray-900 mb-4'>
      {text}
    </h2>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <h1 className='font-display font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl'>
        {/* Dashboard */}
        Welcome back, Thomas
      </h1>

      {/* Metric cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-28 rounded-xl' />
          ))
        ) : (
          <>
            <MetricCard
              label='Total'
              value={metrics?.totalApplications ?? 0}
              sub='applications'
              color='#0071e3'
            />
            <MetricCard
              label='Active'
              value={activeCount}
              sub='in progress'
              color='#00C49A'
            />
            <MetricCard
              label='Interviews'
              value={metrics?.upcomingInterviews.length ?? 0}
              sub='upcoming'
              color='#FB8F67'
            />
            <MetricCard
              label='Response Rate'
              value={responseRate !== null ? `${responseRate}%` : '—'}
              color='#D7263D'
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 rounded-xl p-6 shadow-sm bg-white'>
          {sectionTitle('By Status')}
          {loading ? (
            <Skeleton className='h-52 w-full' />
          ) : (
            <OutcomeChart data={metrics?.byOutcome ?? []} />
          )}
        </div>

        <div className='rounded-xl p-6 shadow-sm bg-white'>
          <div className='flex items-baseline justify-between mb-4'>
            <h2 className='font-display font-semibold text-xl text-gray-900'>
              Upcoming Interviews
            </h2>
            {supported && permission === 'default' && (
              <button
                onClick={requestPermission}
                className='text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300'
              >
                Enable reminders
              </button>
            )}
          </div>
          {loading ? (
            <div className='flex flex-col gap-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-12' />
              ))}
            </div>
          ) : (
            <UpcomingInterviews
              interviews={metrics?.upcomingInterviews ?? []}
            />
          )}
        </div>
      </div>

      {/* Conversion funnel + weekly activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='rounded-xl p-6 shadow-sm bg-white'>
          {sectionTitle('Applications per Week')}
          {loading ? (
            <Skeleton className='h-40 w-full' />
          ) : (
            <WeeklyChart data={metrics?.applicationsByWeek ?? []} />
          )}
        </div>

        <div className='rounded-xl p-6 shadow-sm bg-white'>
          {sectionTitle('Conversion Funnel')}
          {loading ? (
            <Skeleton className='h-40 w-full' />
          ) : (
            <FunnelChart
              data={metrics?.byOutcome ?? []}
              total={metrics?.totalApplications ?? 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};
