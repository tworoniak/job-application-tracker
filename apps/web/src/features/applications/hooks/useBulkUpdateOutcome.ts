import { gql, useMutation } from '@apollo/client'
import type { Outcome } from '../types'

const BULK_UPDATE_OUTCOME = gql`
  mutation BulkUpdateOutcome($ids: [ID!]!, $outcome: Outcome!) {
    updateJobApplicationsOutcome(ids: $ids, outcome: $outcome)
  }
`

export const useBulkUpdateOutcome = () => {
  const [mutate, { loading, error }] = useMutation(BULK_UPDATE_OUTCOME, {
    refetchQueries: ['DashboardMetrics'],
  })

  const bulkUpdateOutcome = (ids: string[], outcome: Outcome) =>
    mutate({
      variables: { ids, outcome },
      // Write the new outcome directly into each cached object — no refetch needed for the list
      update(cache) {
        for (const id of ids) {
          cache.modify({
            id: cache.identify({ __typename: 'JobApplication', id }),
            fields: {
              outcome: () => outcome,
            },
          })
        }
      },
    })

  return { bulkUpdateOutcome, loading, error }
}
