import fs from 'fs'

// Read the actual file and run it through a syntax checker or just log what might fail
const code = fs.readFileSync('/Users/syncomtechnology/Documents/projects/Sherin/Internify/src/pages/Explore/Search.jsx', 'utf-8')
console.log("Syntax length:", code.length)
