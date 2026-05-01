import { useRef, useEffect } from 'react'

interface Props {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
}

export const Checkbox = ({ checked, indeterminate, onChange }: Props) => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ width: '15px', height: '15px', accentColor: '#0071e3', cursor: 'pointer' }}
    />
  )
}
