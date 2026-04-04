import { gql, useQuery } from '@apollo/client'
import type { ApplicationFilters, ApplicationSort, JobApplicationConnection } from '../types'

const LIST_APPLICATIONS = gql`
  query ListApplications(
    $filters: ApplicationFiltersInput
    $sort: ApplicationSortInput
    $first: Int
    $after: String
  ) {
    jobApplications(filters: $filters, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          companyName
          positionTitle
          roleType
          locationType
          outcome
          dateApplied
          interviewDate
          salaryMin
          salaryMax
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

export const useApplications = (filters?: ApplicationFilters, sort?: ApplicationSort) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<{
    jobApplications: JobApplicationConnection
  }>(LIST_APPLICATIONS, {
    variables: { filters, sort, first: 30 },
  })

  const loadMore = () => {
    const endCursor = data?.jobApplications.pageInfo.endCursor
    const hasNextPage = data?.jobApplications.pageInfo.hasNextPage
    if (!hasNextPage || !endCursor) return
    fetchMore({ variables: { after: endCursor } })
  }

  return {
    applications: data?.jobApplications.edges.map((e) => e.node) ?? [],
    totalCount: data?.jobApplications.totalCount ?? 0,
    hasNextPage: data?.jobApplications.pageInfo.hasNextPage ?? false,
    loading,
    error,
    loadMore,
    refetch,
  }
}

export { LIST_APPLICATIONS }
