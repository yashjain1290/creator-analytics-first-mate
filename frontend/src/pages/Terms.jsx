import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c0b', color: '#e8f5f0', fontFamily: 'Syne, sans-serif', padding: '60px 40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#1de9a0', fontFamily: 'Space Mono, monospace', fontSize: '12px', textDecoration: 'none' }}>← Back to home</Link>

      <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '24px', marginBottom: '8px' }}>Terms of Service</h1>
      <p style={{ color: '#7a9e90', fontFamily: 'Space Mono, monospace', fontSize: '12px', marginBottom: '32px' }}>Last updated: May 28, 2026</p>

      {[
        { title: '1. Acceptance of Terms', content: 'By accessing Creator Analytics First Mate, you agree to these Terms of Service. If you do not agree, please do not use the service.' },
        { title: '2. Description of Service', content: 'Creator Analytics First Mate is a personal analytics tool that aggregates data from YouTube, Twitter/X, and Discord to provide AI-powered insights for content creators.' },
        { title: '3. User Accounts', content: 'You must sign in with a valid Google account to use this service. You are responsible for maintaining the security of your account.' },
        { title: '4. Acceptable Use', content: 'You agree to use this service only for lawful purposes. You may not use the service to violate any platform\'s terms of service, including YouTube, Twitter/X, or Discord.' },
        { title: '5. API Usage', content: 'This service uses third-party APIs including YouTube Data API v3. Your use of connected platforms is subject to their respective terms of service and API policies.' },
        { title: '6. Disclaimer', content: 'This service is provided "as is" without warranties of any kind. AI-generated insights are for informational purposes only and should not be considered professional advice.' },
        { title: '7. Limitation of Liability', content: 'Creator Analytics First Mate shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.' },
        { title: '8. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.' },
        { title: '9. Contact', content: 'For questions about these terms, contact: yashjain99052@gmail.com' },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1de9a0', marginBottom: '8px' }}>{section.title}</h2>
          <p style={{ fontSize: '14px', color: '#7a9e90', fontFamily: 'Space Mono, monospace', lineHeight: '1.8' }}>{section.content}</p>
        </div>
      ))}
    </div>
  )
}