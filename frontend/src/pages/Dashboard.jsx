import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/insights', { withCredentials: true })
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c0b' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ color: '#1de9a0' }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginTop: '4px' }}>
            Here's your creator analytics overview
          </p>
        </div>

        {loading ? (
          <div style={{ color: '#1de9a0', fontFamily: 'Space Mono, monospace' }}>Fetching data from all sources...</div>
        ) : data ? (
          <>
            {/* Score Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Content Score', value: data.insights?.content_score + '/100', color: '#1de9a0' },
                { label: 'Community Health', value: data.insights?.community_health + '/100', color: '#9b7fff' },
                { label: 'YouTube Videos', value: data.youtube?.length, color: '#ff6b4a' },
                { label: 'Tweets', value: data.twitter?.length, color: '#4db8ff' },
                { label: 'Discord Messages', value: data.discord?.length, color: '#f0a500' },
              ].map(card => (
                <div key={card.label} style={{
                  background: '#0d1512', border: '1px solid rgba(29,233,160,0.12)',
                  borderRadius: '16px', padding: '20px'
                }}>
                  <div style={{ fontSize: '11px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', marginBottom: '8px' }}>{card.label}</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: card.color }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* AI Summary */}
            <div style={{
              background: '#0d1512', border: '1px solid rgba(29,233,160,0.2)',
              borderRadius: '16px', padding: '20px', marginBottom: '24px'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🤖 AI Summary <span style={{ fontSize: '11px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontWeight: '400' }}>Groq · LLaMA 3.3 70B</span>
              </div>
              <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', lineHeight: '1.8', fontStyle: 'italic' }}>
                "{data.insights?.summary}"
              </p>
            </div>

            {/* Recommendations */}
            <div style={{
              background: '#0d1512', border: '1px solid rgba(29,233,160,0.12)',
              borderRadius: '16px', padding: '20px'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '14px' }}>🎯 What to Post Next</div>
              {data.insights?.recommendations?.map((rec, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', padding: '12px',
                  background: '#111c18', borderRadius: '10px', marginBottom: '8px'
                }}>
                  <div style={{
                    width: '24px', height: '24px', background: 'rgba(29,233,160,0.1)',
                    border: '1px solid rgba(29,233,160,0.3)', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#1de9a0', fontSize: '11px', fontWeight: '700',
                    fontFamily: 'Space Mono, monospace', flexShrink: 0
                  }}>{i + 1}</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{rec}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ color: '#ff6b4a', fontFamily: 'Space Mono, monospace' }}>Failed to load data</div>
        )}
      </main>
    </div>
  )
}