import { useRef, useEffect } from 'react'
import type { ApplicationFilters, Outcome, RoleType, LocationType } from '../types'
import { ROLE_TYPE_LABELS, LOCATION_TYPE_LABELS } from '../types'

type DatePreset = 'any' | '7d' | '30d' | '90d'

interface Props {
  filters: ApplicationFilters
  onFiltersChange: (filters: ApplicationFilters) => void
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const OUTCOMES: Outcome[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
  'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED',
]
const ROLE_TYPES: RoleType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']
const LOCATION_TYPES: LocationType[] = ['ON_SITE', 'HYBRID', 'REMOTE']

const STATUS_LABELS: Record<Outcome, string> = {
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Screen',
  INTERVIEW_SCHEDULED: 'Scheduled',
  INTERVIEW_COMPLETED: 'Done',
  OFFER_RECEIVED: 'Offer',
  OFFER_ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  NO_RESPONSE: 'No reply',
  GHOSTED: 'Ghosted',
}

const STATUS_DOT: Record<Outcome, string> = {
  APPLIED: '#0071e3',
  PHONE_SCREEN: '#0071e3',
  INTERVIEW_SCHEDULED: '#34c759',
  INTERVIEW_COMPLETED: '#34c759',
  OFFER_RECEIVED: '#1d1d1f',
  OFFER_ACCEPTED: '#1d1d1f',
  REJECTED: '#ff3b30',
  WITHDRAWN: '#ff9500',
  NO_RESPONSE: 'rgba(0,0,0,0.40)',
  GHOSTED: 'rgba(0,0,0,0.28)',
}

const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  any: 'Any time',
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
}

function getDatePreset(filters: ApplicationFilters): DatePreset {
  if (!filters.dateAppliedFrom) return 'any'
  const [y, m, d] = filters.dateAppliedFrom.split('-').map(Number)
  const from = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((today.getTime() - from.getTime()) / 86_400_000)
  if (diff <= 7) return '7d'
  if (diff <= 30) return '30d'
  if (diff <= 90) return '90d'
  return 'any'
}

function datePresetToFilter(preset: DatePreset): Pick<ApplicationFilters, 'dateAppliedFrom' | 'dateAppliedTo'> {
  if (preset === 'any') return { dateAppliedFrom: undefined, dateAppliedTo: undefined }
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - days)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return { dateAppliedFrom: `${yyyy}-${mm}-${dd}`, dateAppliedTo: undefined }
}

const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '600',
  color: 'rgba(0,0,0,0.40)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '10px',
}

export const FilterPanel = ({ filters, onFiltersChange, onClose, triggerRef }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return
      if (triggerRef.current?.contains(e.target as Node)) return
      onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef])

  const toggle = <T extends string>(
    key: 'outcomes' | 'roleTypes' | 'locationTypes',
    value: T,
  ) => {
    const current = (filters[key] as T[] | undefined) ?? []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onFiltersChange({ ...filters, [key]: next.length ? next : undefined })
  }

  const clearAll = () =>
    onFiltersChange({ search: filters.search })

  const datePreset = getDatePreset(filters)

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        width: '340px',
        background: '#ffffff',
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.08)',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.3px' }}>Filters</span>
        <button onClick={clearAll} style={{ fontSize: '13px', color: '#0071e3', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px', padding: 0 }}>
          Reset
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', maxHeight: 'calc(100dvh - 240px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Status */}
        <div>
          <p style={sectionLabel}>Status</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
            {OUTCOMES.map((o) => (
              <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={filters.outcomes?.includes(o) ?? false}
                  onChange={() => toggle('outcomes', o)}
                  style={{ width: '14px', height: '14px', accentColor: '#0071e3', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_DOT[o], flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#1d1d1f', letterSpacing: '-0.12px' }}>{STATUS_LABELS[o]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Role Type */}
        <div>
          <p style={sectionLabel}>Role Type</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
            {ROLE_TYPES.map((rt) => (
              <label key={rt} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={filters.roleTypes?.includes(rt) ?? false}
                  onChange={() => toggle('roleTypes', rt)}
                  style={{ width: '14px', height: '14px', accentColor: '#0071e3', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '13px', color: '#1d1d1f', letterSpacing: '-0.12px' }}>{ROLE_TYPE_LABELS[rt]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <p style={sectionLabel}>Location</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {LOCATION_TYPES.map((lt) => (
              <label key={lt} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={filters.locationTypes?.includes(lt) ?? false}
                  onChange={() => toggle('locationTypes', lt)}
                  style={{ width: '14px', height: '14px', accentColor: '#0071e3', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '13px', color: '#1d1d1f', letterSpacing: '-0.12px' }}>{LOCATION_TYPE_LABELS[lt]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Applied */}
        <div>
          <p style={sectionLabel}>Date Applied</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['any', '7d', '30d', '90d'] as DatePreset[]).map((p) => {
              const active = datePreset === p
              return (
                <button
                  key={p}
                  onClick={() => onFiltersChange({ ...filters, ...datePresetToFilter(p) })}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: active ? '1.5px solid #0071e3' : '1px solid rgba(0,0,0,0.16)',
                    background: active ? 'rgba(0,113,227,0.06)' : 'transparent',
                    color: active ? '#0071e3' : 'rgba(0,0,0,0.72)',
                    cursor: 'pointer',
                    letterSpacing: '-0.12px',
                    fontWeight: active ? '600' : '400',
                  }}
                >
                  {DATE_PRESET_LABELS[p]}
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={clearAll}
          style={{ fontSize: '13px', color: 'rgba(0,0,0,0.48)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px' }}
        >
          Clear all
        </button>
        <button
          onClick={onClose}
          style={{ padding: '6px 16px', fontSize: '13px', color: '#ffffff', background: '#0071e3', border: 'none', borderRadius: '8px', cursor: 'pointer', letterSpacing: '-0.12px' }}
        >
          Done
        </button>
      </div>
    </div>
  )
}
