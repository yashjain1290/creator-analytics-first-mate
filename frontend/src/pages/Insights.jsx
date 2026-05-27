import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'

export default function Insights() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/insights', { withCredentials: true })
      .then(res => setData(res.data.data.insights))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c0b' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          🤖 <span style={{ color: '#1de9a0' }}>AI</span> Insights
        </h1>
        <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '24px' }}>
          Powered by Groq · LLaMA 3.3 70B
        </p>

        {loading ? (
          <div style={{ color: '#1de9a0', fontFamily: 'Space Mono, monospace' }}>Analyzing with AI...</div>
        ) : data ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Content Score', value: data.content_score, color: '#1de9a0', max: 100 },
                { label: 'Community Health', value: data.community_health, color: '#9b7fff', max: 100 },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#0d1512', border: '1px solid rgba(29,233,160,0.12)',
                  borderRadius: '16px', padding: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', marginBottom: '8px' }}>{s.label}</div>
                  <div style={{ fontSize: '48px', fontWeight: '800', color: s.color, marginBottom: '8px' }}>{s.value}</div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: s.value + '%', background: s.color, borderRadius: '3px', transition: 'width 1s' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Performing */}
            <div style={{ background: '#0d1512', border: '1px solid rgba(29,233,160,0.12)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontWeight: '700', marginBottom: '10px' }}>🏆 Top Performing Content</div>
              <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', lineHeight: '1.7' }}>{data.top_performing}</p>
            </div>

            {/* Best Time */}
            <div style={{ background: '#0d1512', border: '1px solid rgba(240,165,0,0.2)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontWeight: '700', marginBottom: '10px' }}>⏰ Best Time to Post</div>
              <p style={{ color: '#f0a500', fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: '700' }}>{data.best_time_to_post}</p>
            </div>

            {/* Recommendations */}
            <div style={{ background: '#0d1512', border: '1px solid rgba(29,233,160,0.12)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontWeight: '700', marginBottom: '14px' }}>🎯 Recommendations</div>
              {data.recommendations?.map((r, i) => (
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
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{r}</div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1512 0%, rgba(29,233,160,0.05) 100%)',
              border: '1px solid rgba(29,233,160,0.2)', borderRadius: '16px', padding: '20px'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '10px' }}>📝 Full Analysis</div>
              <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', lineHeight: '1.8', fontStyle: 'italic' }}>
                "{data.summary}"
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}