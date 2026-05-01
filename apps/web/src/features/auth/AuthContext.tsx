import { createContext, useContext, useCallback } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { client } from '@/lib/graphql/client'

interface AuthUser {
  id: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
    }
  }
`

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading } = useQuery<{ me: AuthUser | null }>(ME_QUERY, {
    fetchPolicy: 'network-only',
  })
  const [logoutMutation] = useMutation(LOGOUT_MUTATION)

  const logout = useCallback(async () => {
    await logoutMutation()
    await client.clearStore()
    window.location.href = '/login'
  }, [logoutMutation])

  return (
    <AuthContext.Provider value={{ user: data?.me ?? null, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
