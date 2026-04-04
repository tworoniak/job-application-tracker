import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
import { MetricCard, OutcomeChart, WeeklyChart, UpcomingInterviews } from '../components'
import { Skeleton } from '@/components/ui'

export const DashboardPage = () => {
  const { metrics, loading } = useDashboardMetrics()

  const activeCount = metrics?.byOutcome
    .filter((o) => !['REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED', 'OFFER_ACCEPTED'].includes(o.outcome))
    .reduce((sum, o) => sum + o.count, 0) ?? 0

  const responseRate = metrics && metrics.totalApplications > 0
    ? Math.round(
        (metrics.byOutcome
          .filter((o) => !['APPLIED', 'NO_RESPONSE', 'GHOSTED'].includes(o.outcome))
          .reduce((sum, o) => sum + o.count, 0) /
          metrics.totalApplications) * 100,
      )
    : null

  const sectionTitle = (text: string) => (
    <h2 style={{ fontFamily: 'var(--font-display,-apple-system)', fontSize: '21px', fontWeight: '600', color: '#1d1d1f', lineHeight: '1.19', letterSpacing: '-0.28px', marginBottom: '16px' }}>
      {text}
    </h2>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <h1 style={{ fontFamily: 'var(--font-display,-apple-system)', fontSize: '40px', fontWeight: '600', color: '#1d1d1f', lineHeight: '1.10', letterSpacing: '-0.28px' }}>
        Dashboard
      </h1>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <MetricCard label="Total" value={metrics?.totalApplications ?? 0} />
            <MetricCard label="Active" value={activeCount} sub="in progress" />
            <MetricCard label="Interviews" value={metrics?.upcomingInterviews.length ?? 0} sub="upcoming" />
            <MetricCard
              label="Response Rate"
              value={responseRate !== null ? `${responseRate}%` : '—'}
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2"
          style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px' }}
        >
          {sectionTitle('By Status')}
          {loading ? <Skeleton className="h-52 w-full" /> : <OutcomeChart data={metrics?.byOutcome ?? []} />}
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px' }}>
          {sectionTitle('Upcoming Interviews')}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : (
            <UpcomingInterviews interviews={metrics?.upcomingInterviews ?? []} />
          )}
        </div>
      </div>

      {/* Weekly activity */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px' }}>
        {sectionTitle('Applications per Week')}
        {loading ? <Skeleton className="h-40 w-full" /> : <WeeklyChart data={metrics?.applicationsByWeek ?? []} />}
      </div>
    </div>
  )
}
