interface MetricCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
}

export const MetricCard = ({ label, value, sub, color }: MetricCardProps) => (
  <div
    style={{
      borderColor: color || 'blue',
    }}
    className='bg-white rounded-xl px-6 py-4 border-l-4 shadow-sm hover:shadow-md transition-shadow duration-300'
  >
    <p className='tracking-wide text-sm font-semibold text-gray-500 uppercase'>
      {label}
    </p>
    <p className='leading-none text-4xl font-display font-semibold text-gray-900 mt-2'>
      {value}
    </p>
    {sub && <p className='text-xs text-gray-500 mt-1'>{sub}</p>}
  </div>
);
