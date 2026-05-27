const mongoose = require('mongoose')

// User Model
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },

  // Connected platform tokens
  platforms: {
    youtube: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      channelId: String,
      channelName: String
    },
    twitter: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      accessSecret: String,
      username: String
    },
    discord: {
      connected: { type: Boolean, default: false },
      botToken: String,
      serverId: String,
      serverName: String
    }
  }
})

// Analytics Cache Model (stores query results)
const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  youtubeData: [mongoose.Schema.Types.Mixed],
  twitterData: [mongoose.Schema.Types.Mixed],
  discordData: [mongoose.Schema.Types.Mixed],
  insights: mongoose.Schema.Types.Mixed,
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60 * 1000) } // 30 min cache
})

// Insights History Model
const insightHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  contentScore: Number,
  communityHealth: Number,
  topPerforming: String,
  recommendations: [String],
  bestTimeToPost: String,
  summary: String
})

const User = mongoose.model('User', userSchema)
const Analytics = mongoose.model('Analytics', analyticsSchema)
const InsightHistory = mongoose.model('InsightHistory', insightHistorySchema)

module.exports = { User, Analytics, InsightHistory }