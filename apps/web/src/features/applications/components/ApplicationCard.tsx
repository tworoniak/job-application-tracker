import { RoleTypeBadge, LocationTypeBadge, Checkbox } from '@/components/ui'
import { RowMenu } from './RowMenu'
import { formatDate } from '../lib/formatters'
import { OUTCOMES, OUTCOME_LABELS } from '../types'
import type { JobApplication, Outcome } from '../types'

export const outcomeSelectStyle = (outcome: Outcome): React.CSSProperties => {
  const styles: Record<Outcome, { bg: string; color: string }> = {
    APPLIED:              { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
    PHONE_SCREEN:         { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
    INTERVIEW_SCHEDULED:  { bg: 'rgba(0,113,227,0.12)', color: '#0071e3' },
    INTERVIEW_COMPLETED:  { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
    OFFER_RECEIVED:       { bg: 'rgba(29,29,31,0.08)',  color: '#1d1d1f' },
    OFFER_ACCEPTED:       { bg: 'rgba(29,29,31,0.10)',  color: '#1d1d1f' },
    REJECTED:             { bg: 'rgba(0,0,0,0.04)',     color: 'rgba(0,0,0,0.48)' },
    WITHDRAWN:            { bg: 'rgba(0,0,0,0.04)',     color: 'rgba(0,0,0,0.48)' },
    NO_RESPONSE:          { bg: 'rgba(0,0,0,0.04)',     color: 'rgba(0,0,0,0.40)' },
    GHOSTED:              { bg: 'rgba(0,0,0,0.03)',     color: 'rgba(0,0,0,0.32)' },
  }
  const { bg, color } = styles[outcome]
  return {
    background: bg, color, border: 'none', borderRadius: '980px',
    padding: '2px 8px', fontSize: '12px', letterSpacing: '-0.12px',
    cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', outline: 'none',
  }
}

interface Props {
  app: JobApplication
  selected: boolean
  onSelect: () => void
  onRowClick: () => void
  onEdit: () => void
  onDelete: () => void
  onOutcomeChange: (outcome: Outcome) => void
}

export const ApplicationCard = ({
  app, selected, onSelect, onRowClick, onEdit, onDelete, onOutcomeChange,
}: Props) => (
  <div
    onClick={onRowClick}
    style={{
      background: selected ? 'rgba(0,113,227,0.04)' : '#ffffff',
      borderRadius: '12px', padding: '14px 16px', marginBottom: '8px',
      boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px 0px', cursor: 'pointer',
      border: selected ? '1px solid rgba(0,113,227,0.20)' : '1px solid transparent',
      transition: 'background 0.1s, border-color 0.1s',
    }}
  >
    {/* Row 1: Company + status select */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {app.companyName}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.48)', marginTop: '2px', letterSpacing: '-0.12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {app.positionTitle}
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0 }}>
        <select
          value={app.outcome}
          style={outcomeSelectStyle(app.outcome)}
          onChange={(e) => onOutcomeChange(e.target.value as Outcome)}
        >
          {OUTCOMES.map((o) => (
            <option key={o} value={o}>{OUTCOME_LABELS[o]}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Row 2: Badges + date */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
      <RoleTypeBadge roleType={app.roleType} />
      <LocationTypeBadge locationType={app.locationType} />
      <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(0,0,0,0.36)', letterSpacing: '-0.12px', whiteSpace: 'nowrap' }}>
        {formatDate(app.dateApplied)}
      </span>
    </div>

    {/* Row 3: Checkbox + 3-dot menu */}
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ display: 'flex', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)' }}
    >
      <Checkbox checked={selected} onChange={onSelect} />
      <div style={{ marginLeft: 'auto' }}>
        <RowMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  </div>
)
