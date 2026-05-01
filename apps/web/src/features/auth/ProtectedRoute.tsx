import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.08)', borderTopColor: '#0071e3', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
