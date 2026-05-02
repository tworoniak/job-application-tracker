import { useEffect } from 'react'

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
) => {
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return

    const focusable = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
    focusable()[0]?.focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const els = focusable()
      if (e.shiftKey) {
        if (document.activeElement === els[0]) {
          e.preventDefault()
          els[els.length - 1]?.focus()
        }
      } else {
        if (document.activeElement === els[els.length - 1]) {
          e.preventDefault()
          els[0]?.focus()
        }
      }
    }

    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [ref, active])
}
