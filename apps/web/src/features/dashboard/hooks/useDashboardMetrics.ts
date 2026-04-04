import { gql, useQuery } from '@apollo/client'
import type { Outcome, RoleType, LocationType, JobApplication } from '@/features/applications/types'

export interface DashboardMetrics {
  totalApplications: number
  byOutcome: Array<{ outcome: Outcome; count: number }>
  byRoleType: Array<{ roleType: RoleType; count: number }>
  byLocationType: Array<{ locationType: LocationType; count: number }>
  upcomingInterviews: Pick<JobApplication, 'id' | 'companyName' | 'positionTitle' | 'interviewDate'>[]
  applicationsByWeek: Array<{ week: string; count: number }>
}

const DASHBOARD_METRICS = gql`
  query DashboardMetrics {
    dashboardMetrics {
      totalApplications
      byOutcome {
        outcome
        count
      }
      byRoleType {
        roleType
        count
      }
      byLocationType {
        locationType
        count
      }
      upcomingInterviews {
        id
        companyName
        positionTitle
        interviewDate
      }
      applicationsByWeek {
        week
        count
      }
    }
  }
`

export const useDashboardMetrics = () => {
  const { data, loading, error } = useQuery<{ dashboardMetrics: DashboardMetrics }>(
    DASHBOARD_METRICS,
    { fetchPolicy: 'cache-and-network' },
  )

  return { metrics: data?.dashboardMetrics ?? null, loading, error }
}
