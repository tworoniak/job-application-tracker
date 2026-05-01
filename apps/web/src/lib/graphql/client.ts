import { ApolloClient, HttpLink, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { cache } from './cache'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql',
  credentials: 'include',
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const is401 =
    (networkError as any)?.statusCode === 401 ||
    graphQLErrors?.some((e) => (e.extensions as any)?.statusCode === 401)

  if (is401 && window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
})

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
  },
})
