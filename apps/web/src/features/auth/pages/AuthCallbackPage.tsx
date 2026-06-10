import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_TOKEN_KEY } from '@/lib/graphql/client'

export const AuthCallbackPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const params = new URLSearchParams(hash)
    const token = params.get('token')

    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      window.history.replaceState(null, '', window.location.pathname)
    }

    navigate('/dashboard', { replace: true })
  }, [navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.08)', borderTopColor: '#0071e3', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}
