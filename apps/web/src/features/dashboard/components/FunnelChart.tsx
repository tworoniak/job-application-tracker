import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import type { Outcome } from '@/features/applications/types';

interface Props {
  data: Array<{ outcome: Outcome; count: number }>;
  total: number;
}

const STAGES = [
  {
    label: 'Applied',
    outcomes: [
      'APPLIED',
      'PHONE_SCREEN',
      'INTERVIEW_SCHEDULED',
      'INTERVIEW_COMPLETED',
      'OFFER_RECEIVED',
      'OFFER_ACCEPTED',
      'REJECTED',
      'WITHDRAWN',
      'NO_RESPONSE',
      'GHOSTED',
    ] as Outcome[],
    color: '#5ac8fa',
  },
  {
    label: 'Responded',
    outcomes: [
      'PHONE_SCREEN',
      'INTERVIEW_SCHEDULED',
      'INTERVIEW_COMPLETED',
      'OFFER_RECEIVED',
      'OFFER_ACCEPTED',
      'REJECTED',
      'WITHDRAWN',
    ] as Outcome[],
    color: '#00C49A',
  },
  {
    label: 'Interview',
    outcomes: [
      'INTERVIEW_SCHEDULED',
      'INTERVIEW_COMPLETED',
      'OFFER_RECEIVED',
      'OFFER_ACCEPTED',
    ] as Outcome[],
    color: '#0071e3',
  },
  {
    label: 'Offer',
    outcomes: ['OFFER_RECEIVED', 'OFFER_ACCEPTED'] as Outcome[],
    color: '#1d1d1f',
  },
];

export const FunnelChart = ({ data, total }: Props) => {
  if (!total) {
    return (
      <div className='flex items-center justify-center h-30 text-sm text-[rgba(0,0,0,0.40)] tracking-[-0.224px]'>
        No data yet
      </div>
    );
  }

  const countFor = (outcomes: Outcome[]) =>
    data
      .filter((d) => outcomes.includes(d.outcome))
      .reduce((s, d) => s + d.count, 0);

  const chartData = STAGES.map((stage) => ({
    label: stage.label,
    count: countFor(stage.outcomes),
    color: stage.color,
    pct: total > 0 ? Math.round((countFor(stage.outcomes) / total) * 100) : 0,
  }));

  return (
    <ResponsiveContainer width='100%' height={160}>
      <BarChart
        data={chartData}
        layout='vertical'
        margin={{ left: 8, right: 48, top: 0, bottom: 0 }}
      >
        <XAxis type='number' hide domain={[0, total]} />
        <YAxis
          type='category'
          dataKey='label'
          width={80}
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
          formatter={(
            value: number,
            _name: string,
            props: { payload?: { pct: number } },
          ) => [`${value} (${props.payload?.pct ?? 0}%)`, 'Applications']}
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
          <LabelList
            dataKey='pct'
            position='right'
            formatter={(v: number) => `${v}%`}
            style={{
              fontSize: 11,
              fill: 'rgba(0,0,0,0.40)',
              fontFamily: 'var(--font-sans,-apple-system)',
              letterSpacing: '-0.12px',
            }}
          />
          {chartData.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
