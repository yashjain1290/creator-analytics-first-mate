-- Query 1: YouTube Videos Performance
SELECT id, title, published_at, description
FROM youtube.videos
ORDER BY published_at DESC
LIMIT 10;

-- Query 2: Twitter Engagement Metrics
SELECT id, text, like_count, impression_count, retweet_count, reply_count
FROM twitter.tweets
ORDER BY like_count DESC
LIMIT 10;

-- Query 3: Discord Community Activity
SELECT id, content, author_username, timestamp
FROM discord.messages
ORDER BY timestamp DESC
LIMIT 20;

-- Query 4: Cross-source overview (cross join for demo)
SELECT 
  y.title AS video_title,
  t.like_count AS tweet_likes,
  t.impression_count AS tweet_impressions,
  d.content AS discord_message
FROM youtube.videos y, twitter.tweets t, discord.messages d
LIMIT 5;