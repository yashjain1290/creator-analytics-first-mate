import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

export default function YouTube() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/youtube', { withCredentials: true })
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c0b' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          📺 <span style={{ color: '#ff6b4a' }}>YouTube</span> Analytics
        </h1>
        <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '24px' }}>
          Your video performance data via Coral SQL
        </p>
        {loading ? (
          <div style={{ color: '#1de9a0', fontFamily: 'Space Mono, monospace' }}>Loading YouTube data...</div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {data.map((v, i) => (
              <div key={i} style={{
                background: '#0d1512', border: '1px solid rgba(255,107,74,0.2)',
                borderRadius: '12px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '16px'
              }}>
                <div style={{
                  width: '40px', height: '40px', background: 'rgba(255,107,74,0.15)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '20px', flexShrink: 0
                }}>📺</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{v.title}</div>
                  <div style={{ fontSize: '11px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>
                    {v.published_at?.substring(0, 10)} · {v.id}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#ff6b4a', fontFamily: 'Space Mono, monospace', fontWeight: '700' }}>
                  #{i + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}