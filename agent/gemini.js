const Groq = require('groq-sdk')
require('dotenv').config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function analyzeCreatorData(youtubeData, twitterData, discordData) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
        {
        role: 'system',
        content: 'You are a creator analytics expert. Always respond with valid JSON only. No markdown, no backticks, no explanation outside the JSON object.'
        },
      {
        role: 'user',
        content: `
You are a creator analytics expert. Analyze this data and provide insights.

YOUTUBE VIDEOS:
${JSON.stringify(youtubeData, null, 2)}

TWITTER ENGAGEMENT:
${JSON.stringify(twitterData, null, 2)}

DISCORD COMMUNITY:
${JSON.stringify(discordData, null, 2)}

Please provide:
1. CONTENT SCORE (0-100) for overall creator performance
2. TOP PERFORMING CONTENT based on the data
3. WHAT TO POST NEXT - 3 specific recommendations
4. BEST TIME TO POST based on engagement patterns
5. COMMUNITY HEALTH score (0-100) based on Discord activity

Format your response as JSON like this:
{
  "content_score": 85,
  "top_performing": "description of best content",
  "recommendations": ["rec1", "rec2", "rec3"],
  "best_time_to_post": "time and reason",
  "community_health": 75,
  "summary": "2-3 sentence overall summary"
}
        `
      }
    ],
    max_tokens: 1000
  })

  const text = completion.choices[0].message.content
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (e) {
    return { summary: text }
  }
}

module.exports = { analyzeCreatorData }