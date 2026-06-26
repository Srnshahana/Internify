import fs from 'fs'

const fileContent = fs.readFileSync('/Users/syncomtechnology/Documents/projects/Sherin/Internify/src/pages/Explore/Search.jsx', 'utf-8')
// Look at the filter logic and fetch logic
console.log("Found getMentorData:", fileContent.includes('const getMentorData = (mentor) =>'))
console.log("Found dbCourseIds logic:", fileContent.includes('const dbCourseIds = mentorCoursesData'))
