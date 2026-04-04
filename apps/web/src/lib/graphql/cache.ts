import { InMemoryCache } from '@apollo/client'

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        jobApplications: {
          // Different filters/sort = separate paginated lists in cache
          keyArgs: ['filters', 'sort'],
          merge(existing, incoming, { args }) {
            // If no cursor (fresh query or filter/sort change), replace entirely
            if (!args?.after) return incoming
            // Append pages for fetchMore
            return {
              ...incoming,
              edges: [...(existing?.edges ?? []), ...incoming.edges],
            }
          },
        },
      },
    },
  },
})
