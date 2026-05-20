import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { client } from '@/lib/graphql/client'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      id
      email
    }
  }
`

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
  </svg>
)

export const LoginPage = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [serverError, setServerError] = useState<string | null>(null)

  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION)
  const [register, { loading: registerLoading }] = useMutation(REGISTER_MUTATION)
  const loading = loginLoading || registerLoading

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setServerError(null)
    try {
      if (mode === 'login') {
        await login({ variables: { email, password } })
      } else {
        await register({ variables: { email, password } })
      }
      await client.resetStore()
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const msg = err?.graphQLErrors?.[0]?.message ?? 'Something went wrong'
      setServerError(msg)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 20px' }}>
        {/* Logo / wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1d1d1f', letterSpacing: '-0.4px' }}>
            JobTracker
          </p>
          <p style={{ marginTop: '4px', fontSize: '14px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.12px' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.12px' }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                {...formRegister('email')}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: '14px', color: '#1d1d1f',
                  background: '#f5f5f7', border: errors.email ? '1px solid #ff3b30' : '1px solid transparent',
                  borderRadius: '9px', outline: 'none', letterSpacing: '-0.12px', boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <p role="alert" style={{ marginTop: '4px', fontSize: '12px', color: '#ff3b30', letterSpacing: '-0.12px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.12px' }}>
                Password
              </label>
              <input
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                {...formRegister('password')}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: '14px', color: '#1d1d1f',
                  background: '#f5f5f7', border: errors.password ? '1px solid #ff3b30' : '1px solid transparent',
                  borderRadius: '9px', outline: 'none', letterSpacing: '-0.12px', boxSizing: 'border-box',
                }}
              />
              {errors.password && (
                <p role="alert" style={{ marginTop: '4px', fontSize: '12px', color: '#ff3b30', letterSpacing: '-0.12px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p role="alert" style={{ fontSize: '13px', color: '#ff3b30', letterSpacing: '-0.12px', textAlign: 'center' }}>
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px', fontSize: '15px', fontWeight: '500',
                color: '#ffffff', background: loading ? 'rgba(0,113,227,0.5)' : '#0071e3',
                border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.2px', marginTop: '4px',
              }}
            >
              {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
            <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.36)', letterSpacing: '-0.12px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/auth/google`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '11px', fontSize: '15px', fontWeight: '500', marginTop: '12px',
              color: '#1d1d1f', background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '10px', cursor: 'pointer', textDecoration: 'none', letterSpacing: '-0.2px',
              boxSizing: 'border-box',
            }}
          >
            <GoogleIcon />
            Continue with Google
          </a>
        </div>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'rgba(0,0,0,0.48)', letterSpacing: '-0.12px' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setServerError(null) }}
            style={{ color: '#0071e3', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '-0.12px' }}
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
