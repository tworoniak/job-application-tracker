import { gql, useMutation } from '@apollo/client'
import type { ApplicationFormValues } from '../schemas/application.schema'

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

  const updateApplication = (id: string, values: Partial<ApplicationFormValues>) =>
    mutate({
      variables: {
        id,
        input: {
          ...values,
          salaryMin: values.salaryMin ?? undefined,
          salaryMax: values.salaryMax ?? undefined,
          interviewDate: values.interviewDate || undefined,
        },
      },
    })

  return { updateApplication, loading, error }
}
