import { gql, useMutation } from '@apollo/client'
import type { ApplicationFormValues } from '../schemas/application.schema'
import type { JobApplication } from '../types'

const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($id: ID!, $input: UpdateApplicationInput!) {
    updateJobApplication(id: $id, input: $input) {
      id
      companyName
      positionTitle
      roleType
      locationType
      outcome
      dateApplied
      interviewDate
      salaryType
      salaryMin
      salaryMax
      contactName
      contactInfo
      notes
      updatedAt
    }
  }
`

export const useUpdateApplication = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_APPLICATION, {
    // Apollo normalizes by __typename + id, so all referencing queries update automatically.
    // Refetch dashboard since metrics are derived.
    refetchQueries: ['DashboardMetrics'],
  })

  const updateApplication = (
    id: string,
    values: Partial<ApplicationFormValues>,
    currentApplication?: JobApplication,
  ) => {
    const input = {
      ...values,
      salaryType: values.salaryType ?? undefined,
      salaryMin: values.salaryMin ?? undefined,
      salaryMax: values.salaryMax ?? undefined,
      interviewDate: values.interviewDate || undefined,
    }

    const optimisticResponse = currentApplication
      ? {
          updateJobApplication: {
            __typename: 'JobApplication' as const,
            ...currentApplication,
            ...input,
            dateApplied: values.dateApplied
              ? new Date(values.dateApplied).toISOString()
              : currentApplication.dateApplied,
            interviewDate: values.interviewDate
              ? new Date(values.interviewDate).toISOString()
              : (input.interviewDate === undefined ? currentApplication.interviewDate : null),
            updatedAt: new Date().toISOString(),
          },
        }
      : undefined

    return mutate({ variables: { id, input }, optimisticResponse })
  }

  return { updateApplication, loading, error }
}
