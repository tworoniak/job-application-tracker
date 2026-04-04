import { gql, useQuery } from '@apollo/client'
import type { JobApplication } from '../types'

export const GET_APPLICATION = gql`
  query GetApplication($id: ID!) {
    jobApplication(id: $id) {
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
      contactName
      contactInfo
      notes
      createdAt
      updatedAt
    }
  }
`

export const useApplication = (id: string) => {
  const { data, loading, error } = useQuery<{ jobApplication: JobApplication | null }>(
    GET_APPLICATION,
    { variables: { id }, skip: !id },
  )

  return { application: data?.jobApplication ?? null, loading, error }
}
