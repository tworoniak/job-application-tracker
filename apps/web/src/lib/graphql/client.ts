import { ApolloClient, HttpLink } from '@apollo/client'
import { cache } from './cache'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql',
  }),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
  },
})
