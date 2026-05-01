import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'

interface Props {
  onEdit: () => void
  onDelete: () => void
}

export const RowMenu = ({ onEdit, onDelete }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Application options"
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '7px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(0,0,0,0.40)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '4px',
            background: '#ffffff', borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.08)',
            zIndex: 30, minWidth: '120px', overflow: 'hidden',
          }}
        >
          <button
            onMouseDown={(e) => { e.stopPropagation(); onEdit(); setOpen(false) }}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '9px 14px', fontSize: '13px', color: '#0071e3',
              background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,113,227,0.06)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
          >
            Edit
          </button>
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete(); setOpen(false) }}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '9px 14px', fontSize: '13px', color: 'rgba(0,0,0,0.48)',
              background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
