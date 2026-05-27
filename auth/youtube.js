const { google } = require('googleapis')
const { User } = require('../db/models')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.YOUTUBE_CALLBACK_URL
)

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly'
]

// Generate auth URL
function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
}

// Exchange code for tokens
async function getTokens(code) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

// Get user's YouTube channel
async function getChannel(accessToken, refreshToken) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client })
  const res = await youtube.channels.list({
    part: 'snippet,statistics',
    mine: true
  })
  return res.data.items[0]
}

// Get user's videos with real stats
async function getVideos(accessToken, refreshToken) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

  // Get uploads playlist
  const channelRes = await youtube.channels.list({
    part: 'contentDetails',
    mine: true
  })

  const uploadsPlaylistId = channelRes.data.items[0]
    ?.contentDetails?.relatedPlaylists?.uploads

  if (!uploadsPlaylistId) return []

  // Get videos from uploads playlist
  const playlistRes = await youtube.playlistItems.list({
    part: 'snippet',
    playlistId: uploadsPlaylistId,
    maxResults: 10
  })

  const videoIds = playlistRes.data.items
    .map(item => item.snippet.resourceId.videoId)
    .join(',')

  // Get video statistics
  const statsRes = await youtube.videos.list({
    part: 'snippet,statistics',
    id: videoIds
  })

  return statsRes.data.items.map(video => ({
    id: video.id,
    title: video.snippet.title,
    published_at: video.snippet.publishedAt,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails?.medium?.url,
    view_count: video.statistics.viewCount,
    like_count: video.statistics.likeCount,
    comment_count: video.statistics.commentCount
  }))
}

module.exports = { getAuthUrl, getTokens, getChannel, getVideos, oauth2Client }