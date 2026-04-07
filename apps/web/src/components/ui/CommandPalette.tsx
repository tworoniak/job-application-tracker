import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

interface Command {
  id: string
  label: string
  hint?: string
  action: () => void
}

interface Props {
  open: boolean
  onClose: () => void
}

export const CommandPalette = ({ open, onClose }: Props) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    {
      id: 'new-app',
      label: 'New Application',
      hint: 'N',
      action: () => { navigate('/applications/new'); onClose() },
    },
    {
      id: 'go-apps',
      label: 'Go to Applications',
      action: () => { navigate('/applications'); onClose() },
    },
    {
      id: 'go-dash',
      label: 'Go to Dashboard',
      action: () => { navigate('/dashboard'); onClose() },
    },
  ]

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      // defer so the element is visible before focus
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        filtered[selectedIndex].action()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, filtered, selectedIndex, onClose])

  if (!open) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '20vh',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '480px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0px',
          overflow: 'hidden',
        }}
      >
        {/* Search input */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '17px',
              color: '#1d1d1f',
              letterSpacing: '-0.374px',
            }}
          />
        </div>

        {/* Command list */}
        <div style={{ padding: '6px 0', maxHeight: '320px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <p
              style={{
                padding: '20px 16px',
                fontSize: '14px',
                color: 'rgba(0,0,0,0.40)',
                letterSpacing: '-0.224px',
                textAlign: 'center',
                margin: 0,
              }}
            >
              No commands found
            </p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 16px',
                  background: i === selectedIndex ? 'rgba(0,113,227,0.08)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.08s',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: i === selectedIndex ? '#0071e3' : '#1d1d1f',
                    letterSpacing: '-0.224px',
                  }}
                >
                  {cmd.label}
                </span>
                {cmd.hint && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(0,0,0,0.40)',
                      background: '#f5f5f7',
                      border: '1px solid rgba(0,0,0,0.10)',
                      borderRadius: '4px',
                      padding: '1px 6px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {cmd.hint}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            gap: '16px',
          }}
        >
          {[['↵', 'select'], ['↑↓', 'navigate'], ['esc', 'close']].map(([key, label]) => (
            <span key={key} style={{ fontSize: '11px', color: 'rgba(0,0,0,0.40)', letterSpacing: '-0.08px' }}>
              <span style={{ fontFamily: 'monospace' }}>{key}</span> {label}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
