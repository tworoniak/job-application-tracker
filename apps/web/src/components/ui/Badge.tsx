import type { Outcome, RoleType, LocationType } from '@/features/applications/types'
import { OUTCOME_LABELS, ROLE_TYPE_LABELS, LOCATION_TYPE_LABELS } from '@/features/applications/types'

// Active pipeline: Apple Blue tint — signals "needs attention"
// Terminal positive (offers): near-black, semibold — signals achievement
// Terminal negative / inactive: tertiary gray — recedes visually
const outcomeStyles: Record<Outcome, { bg: string; color: string; weight?: string }> = {
  APPLIED:               { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
  PHONE_SCREEN:          { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
  INTERVIEW_SCHEDULED:   { bg: 'rgba(0,113,227,0.12)', color: '#0071e3', weight: '600' },
  INTERVIEW_COMPLETED:   { bg: 'rgba(0,113,227,0.08)', color: '#0071e3' },
  OFFER_RECEIVED:        { bg: 'rgba(29,29,31,0.08)', color: '#1d1d1f', weight: '600' },
  OFFER_ACCEPTED:        { bg: 'rgba(29,29,31,0.10)', color: '#1d1d1f', weight: '600' },
  REJECTED:              { bg: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.48)' },
  WITHDRAWN:             { bg: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.48)' },
  NO_RESPONSE:           { bg: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.40)' },
  GHOSTED:               { bg: 'rgba(0,0,0,0.03)', color: 'rgba(0,0,0,0.32)' },
}

export const OutcomeBadge = ({ outcome }: { outcome: Outcome }) => {
  const { bg, color, weight = '400' } = outcomeStyles[outcome]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '980px',
        fontSize: '12px',
        fontWeight: weight,
        lineHeight: '1.33',
        letterSpacing: '-0.12px',
        background: bg,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {OUTCOME_LABELS[outcome]}
    </span>
  )
}

export const RoleTypeBadge = ({ roleType }: { roleType: RoleType }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '980px',
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.33',
      letterSpacing: '-0.12px',
      background: 'rgba(0,0,0,0.05)',
      color: 'rgba(0,0,0,0.72)',
      whiteSpace: 'nowrap',
    }}
  >
    {ROLE_TYPE_LABELS[roleType]}
  </span>
)

export const LocationTypeBadge = ({ locationType }: { locationType: LocationType }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '980px',
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.33',
      letterSpacing: '-0.12px',
      background: 'rgba(0,0,0,0.05)',
      color: 'rgba(0,0,0,0.72)',
      whiteSpace: 'nowrap',
    }}
  >
    {LOCATION_TYPE_LABELS[locationType]}
  </span>
)
