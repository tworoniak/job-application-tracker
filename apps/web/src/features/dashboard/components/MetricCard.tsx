interface MetricCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
}

export const MetricCard = ({ label, value, sub, color }: MetricCardProps) => (
  <div
    style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px 24px',
      boxShadow: 'rgba(0,0,0,0.08) 0px 2px 12px 0px',
      borderLeftWidth: '4px',
      borderColor: color || 'blue',
    }}
  >
    <p
      style={{
        fontSize: '12px',
        fontWeight: '600',
        color: 'rgba(0,0,0,0.48)',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        lineHeight: '1.33',
      }}
    >
      {label}
    </p>
    <p
      style={{
        marginTop: '8px',
        fontFamily: 'var(--font-display, -apple-system)',
        fontSize: '40px',
        fontWeight: '600',
        color: '#1d1d1f',
        lineHeight: '1.07',
        letterSpacing: '-0.28px',
      }}
    >
      {value}
    </p>
    {sub && (
      <p
        style={{
          marginTop: '4px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.40)',
          letterSpacing: '-0.12px',
        }}
      >
        {sub}
      </p>
    )}
  </div>
);
