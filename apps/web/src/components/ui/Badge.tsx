import type {
  Outcome,
  RoleType,
  LocationType,
} from '@/features/applications/types';
import {
  OUTCOME_STYLES,
  OUTCOME_LABELS,
  ROLE_TYPE_LABELS,
  LOCATION_TYPE_LABELS,
} from '@/features/applications/types';

export const OutcomeBadge = ({ outcome }: { outcome: Outcome }) => {
  const { bg, color, weight = '400' } = OUTCOME_STYLES[outcome];
  return (
    <span
      className='inline-flex items-center px-2 py-0.5 rounded-full text-xs leading-[1.33] tracking-[-0.12px] whitespace-nowrap'
      style={{ background: bg, color, fontWeight: weight }}
    >
      {OUTCOME_LABELS[outcome]}
    </span>
  );
};

export const RoleTypeBadge = ({ roleType }: { roleType: RoleType }) => (
  <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-normal leading-[1.33] tracking-[-0.12px] bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.72)] whitespace-nowrap'>
    {ROLE_TYPE_LABELS[roleType]}
  </span>
);

export const LocationTypeBadge = ({
  locationType,
}: {
  locationType: LocationType;
}) => (
  <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-normal leading-[1.33] tracking-[-0.12px] bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.72)] whitespace-nowrap'>
    {LOCATION_TYPE_LABELS[locationType]}
  </span>
);
