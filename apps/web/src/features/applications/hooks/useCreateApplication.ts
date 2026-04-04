import { gql, useMutation } from '@apollo/client'
import type { ApplicationFormValues } from '../schemas/application.schema'

const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: CreateApplicationInput!) {
    createJobApplication(input: $input) {
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
      createdAt
      updatedAt
    }
  }
`

export const useCreateApplication = () => {
  const [mutate, { loading, error }] = useMutation(CREATE_APPLICATION, {
    refetchQueries: ['ListApplications', 'DashboardMetrics'],
  })

  const createApplication = (values: ApplicationFormValues) =>
    mutate({
      variables: {
        input: {
          ...values,
          salaryType: values.salaryType ?? undefined,
          salaryMin: values.salaryMin ?? undefined,
          salaryMax: values.salaryMax ?? undefined,
          interviewDate: values.interviewDate || undefined,
        },
      },
    })

  return { createApplication, loading, error }
}
