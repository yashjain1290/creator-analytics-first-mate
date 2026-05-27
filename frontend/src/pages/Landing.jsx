import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { user } = useAuth()

  return (
    <div style={{
      minHeight: '100vh', background: '#080c0b', color: '#e8f5f0',
      fontFamily: 'Syne, sans-serif', overflow: 'hidden', position: 'relative'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.4,
        backgroundImage: 'linear-gradient(rgba(29,233,160,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(29,233,160,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none'
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,233,160,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(29,233,160,0.12)',
        background: 'rgba(8,12,11,0.8)', backdropFilter: 'blur(20px)',
        padding: '16px 40px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#1de9a0',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>🏴‍☠️</div>
          <span style={{ fontWeight: '800', fontSize: '16px' }}>
            Creator<span style={{ color: '#1de9a0' }}>Analytics</span> First Mate
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="https://github.com/yashjain1290/creator-analytics-first-mate"
            target="_blank" rel="noreferrer"
            style={{ color: '#7a9e90', fontSize: '13px', textDecoration: 'none' }}>
            GitHub
          </a>
          {user ? (
            <Link to="/dashboard">
              <button style={{
                background: '#1de9a0', color: '#080c0b', border: 'none',
                padding: '8px 20px', borderRadius: '8px', fontWeight: '700',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'Syne, sans-serif'
              }}>Go to Dashboard →</button>
            </Link>
          ) : (
            <Link to="/login">
              <button style={{
                background: '#1de9a0', color: '#080c0b', border: 'none',
                padding: '8px 20px', borderRadius: '8px', fontWeight: '700',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'Syne, sans-serif'
              }}>Get Started →</button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-block', fontFamily: 'Space Mono, monospace',
          fontSize: '11px', color: '#1de9a0', background: 'rgba(29,233,160,0.1)',
          border: '1px solid rgba(29,233,160,0.3)', padding: '4px 14px',
          borderRadius: '20px', marginBottom: '24px', letterSpacing: '0.1em'
        }}>
          🏴‍☠️ PIRATES OF THE CORAL-BEAN HACKATHON
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '800',
          letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '20px',
          background: 'linear-gradient(135deg, #e8f5f0 0%, #1de9a0 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Your Entire Creator<br />Presence, One Query
        </h1>

        <p style={{
          fontSize: '16px', color: '#7a9e90', lineHeight: '1.7',
          marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px',
          fontFamily: 'Space Mono, monospace'
        }}>
          Query YouTube, Twitter/X, and Discord as SQL tables via Coral.<br />
          Get AI-powered insights from Groq in seconds.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <Link to="/login">
            <button style={{
              background: '#1de9a0', color: '#080c0b', border: 'none',
              padding: '14px 32px', borderRadius: '10px', fontWeight: '800',
              fontSize: '15px', cursor: 'pointer', fontFamily: 'Syne, sans-serif'
            }}>
              Start Analyzing Free →
            </button>
          </Link>
          <a href="https://github.com/yashjain1290/creator-analytics-first-mate" target="_blank" rel="noreferrer">
            <button style={{
              background: 'transparent', color: '#e8f5f0',
              border: '1px solid rgba(29,233,160,0.3)',
              padding: '14px 32px', borderRadius: '10px', fontWeight: '700',
              fontSize: '15px', cursor: 'pointer', fontFamily: 'Syne, sans-serif'
            }}>
              View on GitHub
            </button>
          </a>
        </div>

        {/* Code preview */}
        <div style={{
          background: '#0d1512', border: '1px solid rgba(29,233,160,0.15)',
          borderRadius: '16px', padding: '24px', textAlign: 'left',
          fontFamily: 'Space Mono, monospace', fontSize: '13px',
          lineHeight: '1.8', marginBottom: '60px'
        }}>
          <div style={{ color: '#7a9e90', marginBottom: '8px' }}>-- One query across all your platforms</div>
          <div><span style={{ color: '#1de9a0', fontWeight: '700' }}>SELECT </span>
            y.title, t.like_count, t.impression_count, d.content</div>
          <div><span style={{ color: '#1de9a0', fontWeight: '700' }}>FROM </span>
            <span style={{ color: '#ff6b4a' }}>youtube.videos</span> y,</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#4db8ff' }}>twitter.tweets</span> t,</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#9b7fff' }}>discord.messages</span> d</div>
          <div><span style={{ color: '#1de9a0', fontWeight: '700' }}>LIMIT</span> 5;</div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { icon: '⚡', title: 'Coral SQL Engine', desc: 'Query any API as a SQL table. No ETL, no glue code.' },
            { icon: '🤖', title: 'Groq AI Insights', desc: 'LLaMA 3.3 70B analyzes your data and recommends next steps.' },
            { icon: '📊', title: 'Unified Dashboard', desc: 'YouTube + Twitter + Discord in one beautiful view.' },
            { icon: '🔐', title: 'Google Auth', desc: 'Secure login with your Google account. Your data stays yours.' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#0d1512', border: '1px solid rgba(29,233,160,0.12)',
              borderRadius: '12px', padding: '20px', textAlign: 'left'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{f.icon}</div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '12px', color: '#7a9e90', lineHeight: '1.5', fontFamily: 'Space Mono, monospace' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(29,233,160,0.12)', padding: '20px 40px',
        textAlign: 'center', fontFamily: 'Space Mono, monospace',
        fontSize: '11px', color: '#7a9e90', position: 'relative', zIndex: 1
      }}>
        🏴‍☠️ Creator Analytics First Mate · Pirates of the Coral-bean Hackathon · Built by <span style={{ color: '#1de9a0' }}>@yashjain1290</span>
      </footer>
    </div>
  )
}