import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  type LocationType,
  LOCATION_TYPE_LABELS,
  LOCATION_TYPE_COLORS,
} from '@/features/applications/types';

interface Props {
  data: Array<{ locationType: LocationType; count: number }>;
}

export const LocationTypeChart = ({ data }: Props) => {
  const filtered = data.filter((d) => d.count > 0);
  const total = filtered.reduce((sum, d) => sum + d.count, 0);

  if (filtered.length === 0 || total === 0) {
    return (
      <p
        style={{
          fontSize: '13px',
          color: 'rgba(0,0,0,0.40)',
          textAlign: 'center',
          padding: '32px 0',
        }}
      >
        No data yet
      </p>
    );
  }

  const chartData = filtered.map((d) => ({
    name: LOCATION_TYPE_LABELS[d.locationType],
    value: d.count,
    color: LOCATION_TYPE_COLORS[d.locationType],
    pct: Math.round((d.count / total) * 100),
  }));

  return (
    <div role='img' aria-label='Applications by location type'>
      <ResponsiveContainer width='100%' height={180}>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            innerRadius={50}
            outerRadius={75}
            dataKey='value'
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => {
              const item = chartData.find((d) => d.name === name);
              return [`${value} (${item?.pct ?? 0}%)`, name];
            }}
            contentStyle={{
              fontSize: '12px',
              fontFamily: 'var(--font-sans,-apple-system)',
              letterSpacing: '-0.12px',
              borderRadius: '8px',
              border: 'none',
              boxShadow: 'rgba(0,0,0,0.16) 0px 4px 16px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginTop: '8px',
        }}
      >
        {chartData.map((entry) => (
          <div
            key={entry.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'rgba(0,0,0,0.72)',
              letterSpacing: '-0.12px',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: entry.color,
                flexShrink: 0,
              }}
            />
            {entry.name}{' '}
            <span style={{ color: 'rgba(0,0,0,0.40)' }}>{entry.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
