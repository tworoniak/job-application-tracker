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
      className='fixed inset-0 z-9999 flex items-start justify-center pt-[20vh] bg-[rgba(0,0,0,0.4)]'
      style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='w-120 bg-white rounded-xl shadow-(--shadow-apple-card) overflow-hidden'
      >
        {/* Search input */}
        <div className='px-4 py-3.5 border-b border-[rgba(0,0,0,0.06)]'>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            className='w-full bg-transparent border-none outline-none text-[17px] text-apple-text tracking-[-0.374px]'
          />
        </div>

        {/* Command list */}
        <div className='py-1.5 max-h-80 overflow-y-auto'>
          {filtered.length === 0 ? (
            <p className='px-4 py-5 text-sm text-[rgba(0,0,0,0.40)] tracking-[-0.224px] text-center m-0'>
              No commands found
            </p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(i)}
                className='flex items-center justify-between w-full px-4 py-2.5 border-none cursor-pointer text-left transition-[background] duration-80'
                style={{
                  background: i === selectedIndex ? 'rgba(0,113,227,0.08)' : 'transparent',
                }}
              >
                <span
                  className='text-sm tracking-[-0.224px]'
                  style={{ color: i === selectedIndex ? '#0071e3' : '#1d1d1f' }}
                >
                  {cmd.label}
                </span>
                {cmd.hint && (
                  <span className='text-[11px] text-[rgba(0,0,0,0.40)] bg-apple-gray border border-[rgba(0,0,0,0.10)] rounded px-1.5 py-px font-mono'>
                    {cmd.hint}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className='px-4 py-2 border-t border-[rgba(0,0,0,0.06)] flex gap-4'>
          {[['↵', 'select'], ['↑↓', 'navigate'], ['esc', 'close']].map(([key, label]) => (
            <span key={key} className='text-[11px] text-[rgba(0,0,0,0.40)] tracking-[-0.08px]'>
              <span className='font-mono'>{key}</span> {label}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
