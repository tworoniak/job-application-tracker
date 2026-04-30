export type SalaryType = 'ANNUAL' | 'HOURLY'
export type RoleType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP'
export type LocationType = 'ON_SITE' | 'HYBRID' | 'REMOTE'
export type Outcome =
  | 'APPLIED'
  | 'PHONE_SCREEN'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'NO_RESPONSE'
  | 'GHOSTED'

export type SortField =
  | 'DATE_APPLIED'
  | 'COMPANY_NAME'
  | 'POSITION_TITLE'
  | 'OUTCOME'
  | 'SALARY_MIN'

export type SortDirection = 'ASC' | 'DESC'

export interface JobApplication {
  id: string
  companyName: string
  positionTitle: string
  roleType: RoleType
  locationType: LocationType
  outcome: Outcome
  dateApplied: string
  interviewDate: string | null
  salaryType: SalaryType | null
  salaryMin: number | null
  salaryMax: number | null
  contactName: string | null
  contactInfo: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface JobApplicationConnection {
  edges: Array<{ cursor: string; node: JobApplication }>
  pageInfo: PageInfo
  totalCount: number
}

export interface ApplicationFilters {
  outcomes?: Outcome[]
  roleTypes?: RoleType[]
  locationTypes?: LocationType[]
  dateAppliedFrom?: string
  dateAppliedTo?: string
  search?: string
}

export interface ApplicationSort {
  field: SortField
  direction: SortDirection
}

export const OUTCOMES: Outcome[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED',
  'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN', 'NO_RESPONSE', 'GHOSTED',
]

export const OUTCOME_DOT_COLORS: Record<Outcome, string> = {
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

export const OUTCOME_LABELS: Record<Outcome, string> = {
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  INTERVIEW_COMPLETED: 'Interview Completed',
  OFFER_RECEIVED: 'Offer Received',
  OFFER_ACCEPTED: 'Offer Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
  NO_RESPONSE: 'No Response',
  GHOSTED: 'Ghosted',
}

export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Internship',
}

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  ON_SITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
}
