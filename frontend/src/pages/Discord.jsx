import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

export default function Discord() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/discord', { withCredentials: true })
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const uniqueUsers = [...new Set(data.map(m => m.author_username).filter(Boolean))]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c0b' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          💬 <span style={{ color: '#9b7fff' }}>Discord</span> Community
        </h1>
        <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '24px' }}>
          {data.length} messages · {uniqueUsers.length} active members · live data
        </p>

        {/* Members */}
        <div style={{
          background: '#0d1512', border: '1px solid rgba(155,127,255,0.2)',
          borderRadius: '12px', padding: '16px 20px', marginBottom: '20px'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '12px' }}>👥 Active Members</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {uniqueUsers.map(u => (
              <div key={u} style={{
                background: 'rgba(155,127,255,0.1)', border: '1px solid rgba(155,127,255,0.2)',
                borderRadius: '20px', padding: '4px 12px',
                fontSize: '12px', color: '#9b7fff', fontFamily: 'Space Mono, monospace'
              }}>{u}</div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {loading ? (
          <div style={{ color: '#1de9a0', fontFamily: 'Space Mono, monospace' }}>Loading Discord data...</div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {data.filter(m => m.content).slice(0, 10).map((m, i) => (
              <div key={i} style={{
                background: '#0d1512', border: '1px solid rgba(155,127,255,0.15)',
                borderRadius: '10px', padding: '12px 16px',
                display: 'flex', gap: '12px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '32px', height: '32px', background: 'rgba(155,127,255,0.15)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '14px', flexShrink: 0
                }}>👤</div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9b7fff', fontFamily: 'Space Mono, monospace', marginBottom: '4px', fontWeight: '700' }}>
                    {m.author_username}
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{m.content}</div>
                  <div style={{ fontSize: '10px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', marginTop: '4px' }}>
                    {m.timestamp?.substring(0, 16).replace('T', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}