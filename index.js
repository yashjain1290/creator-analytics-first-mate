require('dotenv').config()
const { runQuery } = require('./agent/queryRunner')
const { analyzeCreatorData } = require('./agent/gemini')

async function main() {
  console.log('🏴‍☠️ Creator Analytics First Mate starting...\n')

  console.log('📊 Fetching YouTube data...')
  const youtubeData = runQuery('SELECT id, title, published_at FROM youtube.videos LIMIT 10')
  
  console.log('🐦 Fetching Twitter data...')
  const twitterData = runQuery('SELECT text, like_count, impression_count, retweet_count FROM twitter.tweets LIMIT 10')
  
  console.log('💬 Fetching Discord data...')
  const discordData = runQuery('SELECT content, author_username, timestamp FROM discord.messages LIMIT 20')

  console.log('\n✅ Data fetched!')
  console.log(`YouTube: ${youtubeData.length} videos`)
  console.log(`Twitter: ${twitterData.length} tweets`)
  console.log(`Discord: ${discordData.length} messages`)

  console.log('\n🤖 Analyzing with Gemini AI...')
  const insights = await analyzeCreatorData(youtubeData, twitterData, discordData)

  console.log('\n🎯 INSIGHTS:')
  console.log(JSON.stringify(insights, null, 2))
}

main().catch(console.error)