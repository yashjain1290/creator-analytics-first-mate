require('dotenv').config()
const connectDB = require('./db/connect')
const { User, Analytics, InsightHistory } = require('./db/models')

// Connect to MongoDB
connectDB()
const youtubeAuth = require('./auth/youtube')
const discordAuth = require('./auth/discord')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo').default || require('connect-mongo')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { runQuery } = require('./agent/queryRunner')
const { analyzeCreatorData } = require('./agent/gemini')

const app = express()
app.set('trust proxy', 1)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
const path = require('path')

// Serve React frontend in production
const distPath = path.join(__dirname, 'frontend', 'dist')
console.log('Dist path:', distPath)
app.use(express.static(distPath))


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
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
  ? `${process.env.FRONTEND_URL}/api/auth/google/callback`
  : 'http://localhost:3000/api/auth/google/callback'
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
    const user = await User.findById(req.user.id)
    
    // Use real YouTube data if connected
    let youtubeData
    if (user?.platforms?.youtube?.connected) {
      youtubeData = await youtubeAuth.getVideos(
        user.platforms.youtube.accessToken,
        user.platforms.youtube.refreshToken
      )
    } else {
      youtubeData = runQuery('SELECT id, title, published_at FROM youtube.videos LIMIT 10')
    }

    const twitterData = runQuery('SELECT text, like_count, impression_count, retweet_count, reply_count FROM twitter.tweets LIMIT 10')
    const discordData = runQuery('SELECT content, author_username, timestamp FROM discord.messages LIMIT 20')
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

app.get('/api/youtube', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (user?.platforms?.youtube?.connected) {
      const videos = await youtubeAuth.getVideos(
        user.platforms.youtube.accessToken,
        user.platforms.youtube.refreshToken
      )
      return res.json({ success: true, data: videos, source: 'real' })
    }
    const data = runQuery('SELECT id, title, published_at, description FROM youtube.videos LIMIT 10')
    res.json({ success: true, data, source: 'mock' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/twitter', isAuth, (req, res) => {
  const data = runQuery('SELECT text, like_count, impression_count, retweet_count, reply_count FROM twitter.tweets LIMIT 10')
  res.json({ success: true, data })
})

app.get('/api/discord', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (user?.platforms?.discord?.connected) {
      const guilds = user.platforms.discord.guilds
      if (guilds && guilds.length > 0) {
        const channels = await discordAuth.getGuildChannels(
          guilds[0].id,
          process.env.DISCORD_BOT_TOKEN
        )
        if (channels && channels.length > 0) {
          const messages = await discordAuth.getMessages(
            channels[0].id,
            process.env.DISCORD_BOT_TOKEN
          )
          const data = messages.map(m => ({
            id: m.id,
            content: m.content,
            author_username: m.author?.username,
            timestamp: m.timestamp
          }))
          return res.json({ success: true, data, source: 'real' })
        }
      }
    }
    const data = runQuery('SELECT content, author_username, timestamp FROM discord.messages LIMIT 20')
    res.json({ success: true, data, source: 'mock' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

const PORT = 3000


// ── YOUTUBE OAUTH ROUTES ──
app.get('/api/auth/youtube', isAuth, (req, res) => {
  const url = youtubeAuth.getAuthUrl()
  res.redirect(url)
})

app.get('/api/auth/youtube/callback', isAuth, async (req, res) => {
  try {
    const { code } = req.query
    const tokens = await youtubeAuth.getTokens(code)
    const channel = await youtubeAuth.getChannel(tokens.access_token, tokens.refresh_token)

    // Save tokens to user in MongoDB
    await User.findByIdAndUpdate(req.user.id, {
      'platforms.youtube': {
        connected: true,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        channelId: channel?.id,
        channelName: channel?.snippet?.title
      }
    })

    // Update session
    req.user.platforms = {
      ...req.user.platforms,
      youtube: { connected: true, channelName: channel?.snippet?.title }
    }

    console.log('YouTube connected for:', req.user.email)
    res.redirect(process.env.FRONTEND_URL + '/connect?youtube=connected')
  } catch (err) {
    console.error('YouTube OAuth error:', err)
    res.redirect(process.env.FRONTEND_URL + '/dashboard?error=youtube_failed')
  }
})

// Get real YouTube data for logged in user
app.get('/api/youtube/real', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user.platforms.youtube.connected) {
      return res.json({ success: false, error: 'YouTube not connected' })
    }

    const videos = await youtubeAuth.getVideos(
      user.platforms.youtube.accessToken,
      user.platforms.youtube.refreshToken
    )

    res.json({ success: true, data: videos })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/history', isAuth, async (req, res) => {
  try {
    const history = await InsightHistory.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(10)
    res.json({ success: true, data: history })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ── DISCORD OAUTH ROUTES ──
app.get('/api/auth/discord', isAuth, (req, res) => {
  const url = discordAuth.getAuthUrl()
  res.redirect(url)
})

app.get('/api/auth/discord/callback', isAuth, async (req, res) => {
  try {
    const { code, error } = req.query
    
    if (error) {
      console.error('Discord callback error:', error)
      return res.redirect(process.env.FRONTEND_URL + '/connect?error=discord_denied')
    }
    
    if (!code) {
      console.error('No code in Discord callback')
      return res.redirect(process.env.FRONTEND_URL + '/connect?error=discord_failed')
    }

    console.log('Discord callback received, exchanging code...')
    const tokens = await discordAuth.getTokens(code)
    console.log('Discord tokens:', JSON.stringify(tokens))
    
    if (tokens.error) {
      console.error('Discord token error:', tokens.error)
      return res.redirect(process.env.FRONTEND_URL + '/connect?error=discord_failed')
    }

    const discordUser = await discordAuth.getDiscordUser(tokens.access_token)
    console.log('Discord user:', discordUser.username)
    
    const guilds = await discordAuth.getGuilds(tokens.access_token)
    console.log('Discord guilds:', guilds.length)

    await User.findByIdAndUpdate(req.user.id, {
      'platforms.discord': {
        connected: true,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        discordUserId: discordUser.id,
        username: discordUser.username,
        guilds: guilds.map(g => ({ id: g.id, name: g.name }))
      }
    })

    console.log('Discord connected for:', req.user.email)
    res.redirect(process.env.FRONTEND_URL + '/connect?discord=connected')
  } catch (err) {
    console.error('Discord OAuth error:', err.message)
    res.redirect(process.env.FRONTEND_URL + '/connect?error=discord_failed')
  }
})

// Get real Discord data
app.get('/api/discord/real', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user?.platforms?.discord?.connected) {
      return res.json({ success: false, error: 'Discord not connected' })
    }

    // Get channels from first guild
    const guilds = user.platforms.discord.guilds
    if (!guilds || guilds.length === 0) {
      return res.json({ success: false, error: 'No servers found' })
    }

    const firstGuildId = guilds[0].id
    const channels = await discordAuth.getGuildChannels(
      firstGuildId,
      process.env.DISCORD_BOT_TOKEN
    )

    if (!channels || channels.length === 0) {
      return res.json({ success: false, error: 'No channels found' })
    }

    // Get messages from first text channel
    const messages = await discordAuth.getMessages(
      channels[0].id,
      process.env.DISCORD_BOT_TOKEN
    )

    const formattedMessages = messages.map(m => ({
      id: m.id,
      content: m.content,
      author_username: m.author?.username,
      timestamp: m.timestamp
    }))

    res.json({ success: true, data: formattedMessages })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
app.get('/api/debug/session', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    sessionID: req.sessionID,
    user: req.user || null,
    mongoUri: !!process.env.MONGODB_URI,
    sessionSecret: !!process.env.SESSION_SECRET,
    nodeEnv: process.env.NODE_ENV
  })
})

// Catch-all route for React Router
app.get('/{*path}', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' })
  }
  const indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html')
  console.log('Serving index from:', indexPath)
  res.sendFile(indexPath)
})

app.listen(PORT, () => {
  console.log(`\n🏴‍☠️ Server running on http://localhost:${PORT}`)
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/google\n`)
})