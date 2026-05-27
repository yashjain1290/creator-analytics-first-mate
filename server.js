require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { runQuery } = require('./agent/queryRunner')
const { analyzeCreatorData } = require('./agent/gemini')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
const path = require('path')

// Serve React frontend in production
app.use(express.static(path.join(__dirname, 'frontend/dist')))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}))
app.use(passport.initialize())
app.use(passport.session())

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    avatar: profile.photos[0].value
  }
  return done(null, user)
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

// Auth middleware
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ error: 'Not authenticated' })
}

// ── AUTH ROUTES ──
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + '/dashboard')
  }
)

app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.json({ user: null })
  }
})

app.get('/api/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true })
  })
})

// ── DATA ROUTES (protected) ──
app.get('/api/insights', isAuth, async (req, res) => {
  try {
    const youtubeData = runQuery('SELECT id, title, published_at FROM youtube.videos LIMIT 10')
    const twitterData = runQuery('SELECT text, like_count, impression_count, retweet_count, reply_count FROM twitter.tweets LIMIT 10')
    const discordData = runQuery('SELECT content, author_username, timestamp FROM discord.messages LIMIT 20')
    const insights = await analyzeCreatorData(youtubeData, twitterData, discordData)
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: { youtube: youtubeData, twitter: twitterData, discord: discordData, insights }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/youtube', isAuth, (req, res) => {
  const data = runQuery('SELECT id, title, published_at, description FROM youtube.videos LIMIT 10')
  res.json({ success: true, data })
})

app.get('/api/twitter', isAuth, (req, res) => {
  const data = runQuery('SELECT text, like_count, impression_count, retweet_count, reply_count FROM twitter.tweets LIMIT 10')
  res.json({ success: true, data })
})

app.get('/api/discord', isAuth, (req, res) => {
  const data = runQuery('SELECT content, author_username, timestamp FROM discord.messages LIMIT 20')
  res.json({ success: true, data })
})

const PORT = 3000
// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'))
})
app.listen(PORT, () => {
  console.log(`\n🏴‍☠️ Server running on http://localhost:${PORT}`)
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/google\n`)
})