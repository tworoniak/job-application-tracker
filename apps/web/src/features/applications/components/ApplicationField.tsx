interface Props {
  label: string
  value: React.ReactNode
}

export const ApplicationField = ({ label, value }: Props) => (
  <div>
    <dt style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(0,0,0,0.40)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </dt>
    <dd style={{ marginTop: '4px', fontSize: '14px', color: value ? '#1d1d1f' : 'rgba(0,0,0,0.30)', letterSpacing: '-0.224px' }}>
      {value ?? '—'}
    </dd>
  </div>
)
