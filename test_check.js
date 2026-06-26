import fs from 'fs'
const code = fs.readFileSync('/Users/syncomtechnology/Documents/projects/Sherin/Internify/src/pages/Explore/Search.jsx', 'utf-8')
const lines = code.split('\n')
lines.forEach((line, i) => {
  if (line.includes('.course_id') && !line.includes('?.course_id')) {
    console.log(`Line ${i + 1}: ${line.trim()}`)
  }
})
