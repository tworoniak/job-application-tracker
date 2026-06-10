import type { Outcome } from '@/features/applications/types';
import { OUTCOME_LABELS, OUTCOME_STYLES } from '@/features/applications/types';

interface Props {
  data: Array<{ outcome: Outcome; count: number }>;
}

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

  const max = chartData[0].count;

  return (
    <div
      role='img'
      aria-label='Applications by outcome, bar chart'
      className='flex flex-col gap-3'
    >
      {chartData.map((entry) => (
        <div key={entry.outcome}>
          <div className='flex items-baseline justify-between mb-1'>
            <span className='text-[13px] text-[rgba(0,0,0,0.72)] tracking-[-0.12px]'>
              {entry.label}
            </span>
            <span className='text-[13px] font-medium text-apple-text-tertiary tracking-[-0.12px] tabular-nums'>
              {entry.count}
            </span>
          </div>
          <div className='h-2.5 md:h-5 w-full rounded-full bg-[rgba(0,0,0,0.06)]'>
            <div
              className='h-2.5 md:h-5 rounded-full transition-all duration-500'
              style={{
                width: `${(entry.count / max) * 100}%`,
                backgroundColor: OUTCOME_STYLES[entry.outcome].color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
