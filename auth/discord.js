const { User } = require('../db/models')

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL

// Generate Discord OAuth URL
function getAuthUrl() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_CALLBACK_URL,
    response_type: 'code',
    scope: 'identify guilds bot',
    permissions: '68608'
  })
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

// Exchange code for token
async function getTokens(code) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_CALLBACK_URL
    })
  })
  return response.json()
}

// Get user's Discord info
async function getDiscordUser(accessToken) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return response.json()
}

// Get user's Discord servers
async function getGuilds(accessToken) {
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return response.json()
}

// Get messages from a channel using bot token
async function getMessages(channelId, botToken) {
  const response = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages?limit=50`,
    { headers: { Authorization: `Bot ${botToken}` } }
  )
  return response.json()
}

// Get channels from a guild using bot token
async function getGuildChannels(guildId, botToken) {
  const response = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/channels`,
    { headers: { Authorization: `Bot ${botToken}` } }
  )
  const channels = await response.json()
  return channels.filter(c => c.type === 0) // text channels only
}

module.exports = { getAuthUrl, getTokens, getDiscordUser, getGuilds, getMessages, getGuildChannels }