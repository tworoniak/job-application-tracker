import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ week: string; count: number }>
}

export const WeeklyChart = ({ data }: Props) => {
  if (!data.length) {
    return <div className="flex items-center justify-center h-32 text-sm text-gray-400">No data yet</div>
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ left: 0, right: 0 }}>
        <XAxis dataKey="week" tick={{ fontSize: 10 }} tickFormatter={(w) => w.split('-W')[1] ? `W${w.split('-W')[1]}` : w} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
        <Tooltip
          formatter={(v: number) => [v, 'Applications']}
          contentStyle={{ fontSize: 12, borderRadius: 6 }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
