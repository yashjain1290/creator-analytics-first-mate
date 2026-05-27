require('dotenv').config()
const connectDB = require('./db/connect')
const { User, Analytics, InsightHistory } = require('./db/models')

// Connect to MongoDB
connectDB()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo').default || require('connect-mongo')
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
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 
  }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id })
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      })
      console.log('New user created:', user.email)
    } else {
      user.lastLogin = new Date()
      await user.save()
    }
    return done(null, {
      id: user._id,
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      platforms: user.platforms
    })
  } catch (err) {
    return done(err, null)
  }
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
    const youtubeData = runQuery('...')
    const twitterData = runQuery('...')
    const discordData = runQuery('...')
    const insights = await analyzeCreatorData(youtubeData, twitterData, discordData)

    // Save to history
    try {
      await InsightHistory.create({
        userId: req.user.id,
        contentScore: insights.content_score,
        communityHealth: insights.community_health,
        topPerforming: insights.top_performing,
        recommendations: insights.recommendations,
        bestTimeToPost: insights.best_time_to_post,
        summary: insights.summary
      })
    } catch (histErr) {
      console.log('History save failed:', histErr.message)
    }

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
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'))
})
app.listen(PORT, () => {
  console.log(`\n🏴‍☠️ Server running on http://localhost:${PORT}`)
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/google\n`)
})