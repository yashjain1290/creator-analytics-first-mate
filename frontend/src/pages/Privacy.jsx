import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c0b', color: '#e8f5f0', fontFamily: 'Syne, sans-serif', padding: '60px 40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#1de9a0', fontFamily: 'Space Mono, monospace', fontSize: '12px', textDecoration: 'none' }}>← Back to home</Link>
      
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '24px', marginBottom: '8px' }}>Privacy Policy</h1>
      <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '32px' }}>Last updated: May 28, 2026</p>

      {[
        { title: '1. Information We Collect', content: 'We collect information you provide when you sign in with Google, including your name, email address, and profile picture. When you connect YouTube, we collect an OAuth access token to read your video analytics. We do not collect passwords.' },
        { title: '2. How We Use Your Information', content: 'We use your information solely to provide the Creator Analytics First Mate service — displaying your YouTube, Twitter, and Discord analytics in a unified dashboard powered by AI insights. We never sell your data to third parties.' },
        { title: '3. Data Storage', content: 'Your data is stored securely in MongoDB Atlas. OAuth tokens are encrypted and stored per-user. Session data is stored in MongoDB with a 24-hour expiry.' },
        { title: '4. YouTube Data', content: 'When you connect YouTube, we access your video statistics (views, likes, comments) using the YouTube Data API v3 with read-only scope. We never modify, delete, or upload content to your YouTube channel.' },
        { title: '5. Third Party Services', content: 'We use Google OAuth for authentication, MongoDB Atlas for data storage, Railway for hosting, and Groq AI for generating analytics insights. Each service has its own privacy policy.' },
        { title: '6. Data Deletion', content: 'You can disconnect your accounts and delete your data at any time by contacting yashjain99052@gmail.com. We will delete all your data within 30 days of request.' },
        { title: '7. Contact', content: 'For privacy concerns, contact: yashjain99052@gmail.com' },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1de9a0', marginBottom: '8px' }}>{section.title}</h2>
          <p style={{ fontSize: '14px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', lineHeight: '1.8' }}>{section.content}</p>
        </div>
      ))}
    </div>
  )
}