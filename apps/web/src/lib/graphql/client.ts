import { ApolloClient, HttpLink, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { cache } from './cache'

export const AUTH_TOKEN_KEY = 'access_token'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL ?? '/graphql',
  credentials: 'include',
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    operation.setContext(({ headers = {} }) => ({
      headers: { ...headers, Authorization: `Bearer ${token}` },
    }))
  }
  return forward(operation)
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
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
  },
})
