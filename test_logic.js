const mentorItem = { id: 50, mentor_id: 842996, coursesOffered: [] }
const mentorCoursesData = [{ mentor_id: 842996, course_id: 1 }]
const coursesData = [{ course_id: 1, title: 'Mobile application development' }]
const selectedCourseId = 1

// fetchAllData mapping logic
const dbCourseIds = mentorCoursesData 
  ? mentorCoursesData.filter(mc => String(mc.mentor_id) === String(mentorItem.mentor_id || mentorItem.id)).map(mc => String(mc.course_id))
  : []

const fallbackCourseIds = Array.isArray(mentorItem.coursesOffered)
  ? mentorItem.coursesOffered.map(String)
  : []

const combinedIdsOrTitles = [...new Set([...dbCourseIds, ...fallbackCourseIds])]

const fullCourses = coursesData 
  ? coursesData.filter(c => {
      const matchById = combinedIdsOrTitles.includes(String(c.course_id));
      const matchByTitle = combinedIdsOrTitles.some(mc => String(mc).toLowerCase() === String(c.title).toLowerCase());
      return matchById || matchByTitle;
    })
  : []

const apiMentor = {
  ...mentorItem,
  mentor_id: mentorItem.mentor_id || mentorItem.id,
  id: mentorItem.id || mentorItem.mentor_id,
  coursesOffered: fullCourses
}

console.log("apiMentor:", JSON.stringify(apiMentor, null, 2))

// filter logic
const result = [apiMentor].filter(mentor => {
  const mentorCourses = mentor.coursesOffered || []
  return mentorCourses.some(course => {
    const cId = typeof course === 'object' ? (course.course_id || course.id) : course
    return String(cId) === String(selectedCourseId)
  })
})

console.log("Filter result:", JSON.stringify(result, null, 2))
