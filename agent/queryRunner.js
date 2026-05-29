const { execSync } = require('child_process')

function runQuery(sql) {
  if (!isCoralAvailable()) {
    const sqlLower = sql.toLowerCase()
    if (sqlLower.includes('youtube')) return MOCK_DATA.youtube
    if (sqlLower.includes('twitter')) return MOCK_DATA.twitter
    if (sqlLower.includes('discord')) return MOCK_DATA.discord
    return []
  }
  // ... rest of function
}

function parseCoralOutput(output) {
  const lines = output.split('\n').filter(line => line.trim())
  const dataLines = lines.filter(line => 
    line.startsWith('|') && 
    !line.startsWith('+') &&
    !line.includes('---')
  )
  
  if (dataLines.length < 2) return []
  
  const headers = dataLines[0]
    .split('|')
    .filter(h => h.trim())
    .map(h => h.trim())
  
  const rows = dataLines.slice(1).map(line => {
    const values = line
      .split('|')
      .filter(v => v.trim() !== undefined)
      .slice(1, -1)
      .map(v => v.trim())
    
    const row = {}
    headers.forEach((header, i) => {
      row[header] = values[i] || ''
    })
    return row
  })
  
  return rows
}

module.exports = { runQuery }