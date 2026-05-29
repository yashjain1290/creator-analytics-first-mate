import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

export default function Connect() {
  const { user } = useAuth()
  const [status, setStatus] = useState({ youtube: false, twitter: false, discord: false })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('youtube') === 'connected') {
      setStatus(s => ({ ...s, youtube: true }))
    }
    if (params.get('discord') === 'connected') {
      setStatus(s => ({ ...s, discord: true }))
    }
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c0b' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          🔌 Connect <span style={{ color: '#1de9a0' }}>Platforms</span>
        </h1>
        <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '32px' }}>
          Connect your accounts to see real data
        </p>

        <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>

          {/* YouTube */}
          <div style={{
            background: '#0d1512', border: '1px solid rgba(255,107,74,0.2)',
            borderRadius: '16px', padding: '24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '48px', height: '48px', background: 'rgba(255,107,74,0.15)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>📺</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>YouTube</div>
              <div style={{ fontSize: '12px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>
                Connect to see real video analytics
              </div>
            </div>
            <button onClick={() => window.location.href = '/api/auth/youtube'} style={{
              background: status.youtube ? '#1de9a0' : 'rgba(255,107,74,0.15)',
              color: status.youtube ? '#080c0b' : '#ff6b4a',
              border: `1px solid ${status.youtube ? '#1de9a0' : 'rgba(255,107,74,0.3)'}`,
              padding: '10px 20px', borderRadius: '10px',
              fontFamily: 'Syne, sans-serif', fontWeight: '700',
              fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {status.youtube ? '✓ Connected' : 'Connect'}
            </button>
          </div>

          {/* Twitter */}
          <div style={{
            background: '#0d1512', border: '1px solid rgba(77,184,255,0.2)',
            borderRadius: '16px', padding: '24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '48px', height: '48px', background: 'rgba(77,184,255,0.15)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>𝕏</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Twitter/X</div>
              <div style={{ fontSize: '12px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>
                Requires paid API credits ($5 minimum)
              </div>
            </div>
            <button style={{
              background: 'rgba(77,184,255,0.05)',
              color: '#7a9e90',
              border: '1px solid rgba(77,184,255,0.1)',
              padding: '10px 20px', borderRadius: '10px',
              fontFamily: 'Syne, sans-serif', fontWeight: '700',
              fontSize: '13px', cursor: 'not-allowed'
            }}>
              Coming Soon
            </button>
          </div>

          {/* Discord */}
          <div style={{
            background: '#0d1512', border: '1px solid rgba(155,127,255,0.2)',
            borderRadius: '16px', padding: '24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '48px', height: '48px', background: 'rgba(155,127,255,0.15)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>💬</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Discord</div>
              <div style={{ fontSize: '12px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>
                Connect to track your community activity
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/api/auth/discord'}
              style={{
                background: status.discord ? '#1de9a0' : 'rgba(155,127,255,0.15)',
                color: status.discord ? '#080c0b' : '#9b7fff',
                border: `1px solid ${status.discord ? '#1de9a0' : 'rgba(155,127,255,0.3)'}`,
                padding: '10px 20px', borderRadius: '10px',
                fontFamily: 'Syne, sans-serif', fontWeight: '700',
                fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
              }}>
              {status.discord ? '✓ Connected' : 'Connect'}
            </button>
          </div>

        </div> {/* ← closes the grid div */}

        {/* Note */}
        <div style={{
          marginTop: '32px', maxWidth: '600px',
          background: 'rgba(29,233,160,0.05)', border: '1px solid rgba(29,233,160,0.1)',
          borderRadius: '12px', padding: '16px'
        }}>
          <div style={{ fontSize: '12px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', lineHeight: '1.7' }}>
            💡 Your API tokens are stored securely in MongoDB and never shared. Twitter/X OAuth coming in the next version.
          </div>
        </div>

      </main>
    </div>
  )
}