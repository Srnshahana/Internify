const mentorData = {
  name: "shahira",
  coursesOffered: [
    {
      course_id: 1,
      title: "Mobile application development"
    }
  ]
}

const query = "Mobile application development"
const lowerQuery = query.toLowerCase()

const name = String(mentorData.name || '').toLowerCase()
const offeredCourses = (mentorData.coursesOffered || []).map(c => typeof c === 'object' ? c.title : String(c)).join(' ').toLowerCase()

console.log("name:", name)
console.log("offeredCourses:", offeredCourses)
console.log("matches name:", name.includes(lowerQuery))
console.log("matches offeredCourses:", offeredCourses.includes(lowerQuery))
