import { useLazyQuery } from '@apollo/client'
import { LIST_APPLICATIONS } from './useApplications'
import type { JobApplicationConnection } from '../types'

const SALARY_TYPE_LABELS: Record<string, string> = { ANNUAL: 'Annual', HOURLY: 'Hourly' }
const ROLE_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract',
  FREELANCE: 'Freelance', INTERNSHIP: 'Internship',
}
const LOCATION_TYPE_LABELS: Record<string, string> = {
  ON_SITE: 'On-site', HYBRID: 'Hybrid', REMOTE: 'Remote',
}
const OUTCOME_LABELS: Record<string, string> = {
  APPLIED: 'Applied', PHONE_SCREEN: 'Phone Screen',
  INTERVIEW_SCHEDULED: 'Interview Scheduled', INTERVIEW_COMPLETED: 'Interview Completed',
  OFFER_RECEIVED: 'Offer Received', OFFER_ACCEPTED: 'Offer Accepted',
  REJECTED: 'Rejected', WITHDRAWN: 'Withdrawn', NO_RESPONSE: 'No Response', GHOSTED: 'Ghosted',
}

const esc = (val: unknown) => {
  const s = val == null ? '' : String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { timeZone: 'UTC' }) : ''

export const useExportCsv = () => {
  const [fetchAll, { loading }] = useLazyQuery<{ jobApplications: JobApplicationConnection }>(
    LIST_APPLICATIONS,
    { fetchPolicy: 'network-only' },
  )

  const exportCsv = async () => {
    const result = await fetchAll({ variables: { first: 10000 } })
    const applications = result.data?.jobApplications.edges.map((e) => e.node) ?? []

    const headers = [
      'Company', 'Position', 'Role Type', 'Location', 'Status',
      'Date Applied', 'Interview Date', 'Salary Type', 'Salary Min', 'Salary Max',
      'Contact Name', 'Contact Info', 'Notes',
    ]

    const rows = applications.map((a) => [
      esc(a.companyName),
      esc(a.positionTitle),
      esc(ROLE_TYPE_LABELS[a.roleType] ?? a.roleType),
      esc(LOCATION_TYPE_LABELS[a.locationType] ?? a.locationType),
      esc(OUTCOME_LABELS[a.outcome] ?? a.outcome),
      esc(formatDate(a.dateApplied)),
      esc(formatDate(a.interviewDate)),
      esc(a.salaryType ? (SALARY_TYPE_LABELS[a.salaryType] ?? a.salaryType) : ''),
      esc(a.salaryMin),
      esc(a.salaryMax),
      esc(a.contactName),
      esc(a.contactInfo),
      esc(a.notes),
    ].join(','))

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { exportCsv, loading }
}
