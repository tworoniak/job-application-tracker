import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Outcome } from '@/features/applications/types';
import { OUTCOME_LABELS } from '@/features/applications/types';

interface Props {
  data: Array<{ outcome: Outcome; count: number }>;
}

// Monochromatic Apple Blue palette — active pipeline full opacity,
// terminal positive darkened, inactive/negative muted gray
const OUTCOME_COLORS: Record<Outcome, string> = {
  APPLIED: '#5ac8fa',
  PHONE_SCREEN: '#00C49A',
  INTERVIEW_SCHEDULED: '#0071e3',
  INTERVIEW_COMPLETED: '#0071e3',
  OFFER_RECEIVED: '#1d1d1f',
  OFFER_ACCEPTED: '#1d1d1f',
  REJECTED: 'rgba(0,0,0,0.20)',
  WITHDRAWN: 'rgba(0,0,0,0.16)',
  NO_RESPONSE: 'rgba(0,0,0,0.12)',
  GHOSTED: 'rgba(0,0,0,0.08)',
};

export const OutcomeChart = ({ data }: Props) => {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({ ...d, label: OUTCOME_LABELS[d.outcome] }))
    .sort((a, b) => b.count - a.count);

  if (!chartData.length) {
    return (
      <div className='flex items-center justify-center h-40 text-sm text-[rgba(0,0,0,0.40)] tracking-[-0.224px]'>
        No data yet
      </div>
    );
  }

  return (
    <div role='img' aria-label='Applications by outcome, bar chart'>
      <ResponsiveContainer width='100%' height={chartData.length * 50}>
        <BarChart
          data={chartData}
          layout='vertical'
          margin={{ left: 8, right: 24, top: 0, bottom: 0 }}
        >
          <XAxis
            type='number'
            allowDecimals={false}
            tick={{
              fontSize: 11,
              fill: 'rgba(0,0,0,0.40)',
              fontFamily: 'var(--font-sans,-apple-system)',
              letterSpacing: '-0.12px',
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type='category'
            dataKey='label'
            width={148}
            tick={{
              fontSize: 12,
              fill: 'rgba(0,0,0,0.72)',
              fontFamily: 'var(--font-sans,-apple-system)',
              letterSpacing: '-0.12px',
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [value, 'Applications']}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: 'none',
              boxShadow: 'rgba(0,0,0,0.16) 0px 4px 16px',
              fontFamily: 'var(--font-sans,-apple-system)',
              letterSpacing: '-0.12px',
            }}
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          />
          <Bar dataKey='count' radius={[0, 4, 4, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.outcome} fill={OUTCOME_COLORS[entry.outcome]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
