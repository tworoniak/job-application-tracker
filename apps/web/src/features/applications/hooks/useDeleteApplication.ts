import { gql, useMutation } from '@apollo/client'

const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: ID!) {
    deleteJobApplication(id: $id)
  }
`

export const useDeleteApplication = () => {
  const [mutate, { loading, error }] = useMutation(DELETE_APPLICATION, {
    refetchQueries: ['ListApplications', 'DashboardMetrics'],
  })

  const deleteApplication = (id: string) =>
    mutate({
      variables: { id },
      // Optimistically remove from cache
      update(cache) {
        cache.evict({ id: cache.identify({ __typename: 'JobApplication', id }) })
        cache.gc()
      },
    })

  return { deleteApplication, loading, error }
}
