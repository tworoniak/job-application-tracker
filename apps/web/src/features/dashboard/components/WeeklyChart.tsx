import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ week: string; count: number }>
}

// Returns the Monday of an ISO week string like "2026-W14"
const isoWeekToMonday = (isoWeek: string): Date => {
  const [yearStr, weekStr] = isoWeek.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7 // Sunday (0) → 7
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - (jan4Day - 1) + (week - 1) * 7)
  return monday
}

const formatWeekLabel = (isoWeek: string): string => {
  const monday = isoWeekToMonday(isoWeek)
  return monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatWeekTooltip = (isoWeek: string): string => {
  const monday = isoWeekToMonday(isoWeek)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}

export const WeeklyChart = ({ data }: Props) => {
  if (!data.length) {
    return <div className="flex items-center justify-center h-32 text-sm text-gray-400">No data yet</div>
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ left: 0, right: 0 }}>
        <XAxis dataKey="week" tick={{ fontSize: 10 }} tickFormatter={formatWeekLabel} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
        <Tooltip
          formatter={(v: number) => [v, 'Applications']}
          labelFormatter={formatWeekTooltip}
          contentStyle={{ fontSize: 12, borderRadius: 6 }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
