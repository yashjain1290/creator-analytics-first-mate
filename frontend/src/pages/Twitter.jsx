import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

export default function Twitter() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/twitter', { withCredentials: true })
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c0b' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          𝕏 <span style={{ color: '#4db8ff' }}>Twitter/X</span> Analytics
        </h1>
        <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '24px' }}>
          Tweet engagement data via Coral SQL
        </p>
        {loading ? (
          <div style={{ color: '#1de9a0', fontFamily: 'Space Mono, monospace' }}>Loading Twitter data...</div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {data.map((t, i) => (
              <div key={i} style={{
                background: '#0d1512', border: '1px solid rgba(77,184,255,0.2)',
                borderRadius: '12px', padding: '16px 20px'
              }}>
                <div style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>{t.text}</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {[
                    { label: '❤ Likes', value: t.like_count, color: '#ff6b4a' },
                    { label: '👁 Impressions', value: Number(t.impression_count).toLocaleString(), color: '#4db8ff' },
                    { label: '🔁 Retweets', value: t.retweet_count, color: '#1de9a0' },
                    { label: '💬 Replies', value: t.reply_count, color: '#9b7fff' },
                  ].map(stat => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '10px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}