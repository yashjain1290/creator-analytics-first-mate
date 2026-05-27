import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  return (
    <div style={{
      minHeight: '100vh', background: '#080c0b', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(29,233,160,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(29,233,160,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none'
      }} />

      <div style={{
        background: '#0d1512', border: '1px solid rgba(29,233,160,0.2)',
        borderRadius: '20px', padding: '48px 40px', width: '100%',
        maxWidth: '400px', textAlign: 'center', position: 'relative', zIndex: 1
      }}>
        <div style={{
          width: '60px', height: '60px', background: '#1de9a0',
          borderRadius: '14px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px'
        }}>🏴‍☠️</div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#e8f5f0' }}>
          Welcome Back
        </h1>
        <p style={{
          fontSize: '13px', color: '#7a9e90', marginBottom: '32px',
          fontFamily: 'Space Mono, monospace', lineHeight: '1.6'
        }}>
          Sign in to access your creator analytics dashboard
        </p>

        <button onClick={login} style={{
          width: '100%', padding: '14px', background: 'white',
          border: 'none', borderRadius: '10px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          cursor: 'pointer', fontSize: '14px', fontWeight: '700',
          fontFamily: 'Syne, sans-serif', color: '#333', transition: 'all 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{
          marginTop: '24px', padding: '16px',
          background: 'rgba(29,233,160,0.05)', borderRadius: '10px',
          border: '1px solid rgba(29,233,160,0.1)'
        }}>
          <div style={{ fontSize: '11px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', lineHeight: '1.6' }}>
            🔐 Secure Google OAuth · Your data stays private · No passwords stored
          </div>
        </div>

        <div style={{ marginTop: '20px', fontSize: '11px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>
          Pirates of the Coral-bean Hackathon 🏴‍☠️
        </div>
      </div>
    </div>
  )
}