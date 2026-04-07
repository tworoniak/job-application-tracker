import { gql, useMutation } from '@apollo/client'

const BULK_DELETE = gql`
  mutation BulkDeleteApplications($ids: [ID!]!) {
    deleteJobApplications(ids: $ids)
  }
`

export const useBulkDeleteApplications = () => {
  const [mutate, { loading, error }] = useMutation(BULK_DELETE, {
    refetchQueries: ['DashboardMetrics'],
  })

  const bulkDelete = (ids: string[]) =>
    mutate({
      variables: { ids },
      update(cache) {
        for (const id of ids) {
          cache.evict({ id: cache.identify({ __typename: 'JobApplication', id }) })
        }
        cache.gc()
      },
    })

  return { bulkDelete, loading, error }
}
