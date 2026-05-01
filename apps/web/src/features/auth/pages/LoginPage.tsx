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
