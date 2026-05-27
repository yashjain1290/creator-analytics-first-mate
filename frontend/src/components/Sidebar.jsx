import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/youtube', icon: '📺', label: 'YouTube' },
  { path: '/twitter', icon: '𝕏', label: 'Twitter/X' },
  { path: '/discord', icon: '💬', label: 'Discord' },
  { path: '/insights', icon: '🤖', label: 'AI Insights' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  return (
    <aside style={{
      width: '220px', minHeight: '100vh', background: '#0d1512',
      borderRight: '1px solid rgba(29,233,160,0.12)', display: 'flex',
      flexDirection: 'column', padding: '24px 0', position: 'fixed',
      top: 0, left: 0, zIndex: 50
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(29,233,160,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#1de9a0',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '18px'
          }}>🏴‍☠️</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '13px', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
              Creator<span style={{ color: '#1de9a0' }}>Analytics</span>
            </div>
            <div style={{ fontSize: '10px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>
              First Mate
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px', marginBottom: '4px',
              background: pathname === item.path ? 'rgba(29,233,160,0.1)' : 'transparent',
              border: pathname === item.path ? '1px solid rgba(29,233,160,0.2)' : '1px solid transparent',
              color: pathname === item.path ? '#1de9a0' : '#7a9e90',
              fontSize: '13px', fontWeight: '600', fontFamily: 'Syne, sans-serif',
              transition: 'all 0.2s', cursor: 'pointer'
            }}
              onMouseEnter={e => { if (pathname !== item.path) e.currentTarget.style.color = '#e8f5f0' }}
              onMouseLeave={e => { if (pathname !== item.path) e.currentTarget.style.color = '#7a9e90' }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      {/* User profile */}
      {user && (
        <div style={{
          padding: '16px 20px', borderTop: '1px solid rgba(29,233,160,0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <img src={user.avatar} alt={user.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #1de9a0' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#e8f5f0', fontFamily: 'Syne, sans-serif' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '10px', color: '#7a9e90', fontFamily: 'Space Mono, monospace' }}>
                {user.email.substring(0, 16)}...
              </div>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '8px', background: 'transparent',
            border: '1px solid rgba(29,233,160,0.2)', borderRadius: '8px',
            color: '#7a9e90', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'Syne, sans-serif', fontWeight: '600',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b4a'; e.currentTarget.style.color = '#ff6b4a' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(29,233,160,0.2)'; e.currentTarget.style.color = '#7a9e90' }}
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  )
}