import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zupzvpepzkjeaelxczlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ'
)

async function fetchAllData() {
  const [mentorsRes, coursesRes, mentorCoursesRes] = await Promise.all([
    supabase
      .from('mentors_details')
      .select('id, mentor_id, name, profile_image, category, about, address, is_verified, is_platformAssured, coursesOffered, rating'),
    supabase.from('courses').select('course_id, title, image, description, estimated_time, career_field, price_range').order('title', { ascending: true }),
    supabase.from('mentor_courses').select('mentor_id, course_id')
  ])

  const mentorsData = mentorsRes.data
  const coursesData = coursesRes.data
  const mentorCoursesData = mentorCoursesRes.data

  console.log("coursesData count:", coursesData?.length)
  console.log("mentorCoursesData count:", mentorCoursesData?.length)

  const resolvedMentors = mentorsData.map(mentorItem => {
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

    if (mentorItem.name?.toLowerCase().includes('shahira')) {
      console.log('DEBUG Shahira mapping:', { id: mentorItem.id, mentor_id: mentorItem.mentor_id, dbCourseIds, fullCoursesCount: fullCourses.length })
      console.log('Courses Offered will be:', fullCourses)
    }

    return {
      ...mentorItem,
      mentor_id: mentorItem.mentor_id || mentorItem.id,
      id: mentorItem.id || mentorItem.mentor_id,
      coursesOffered: fullCourses
    }
  })

  // Filter test
  const selectedCourseId = "1"
  const shahira = resolvedMentors.find(m => m.name?.toLowerCase().includes('shahira'))
  
  const mentorCourses = shahira.coursesOffered || []
  const matches = mentorCourses.some(course => {
    const cId = typeof course === 'object' ? (course.course_id || course.id) : course
    const cTitle = typeof course === 'object' ? course.title : course
    const selectedCourse = coursesData.find(c => String(c.course_id || c.id) === String(selectedCourseId))
    
    const matchById = String(cId) === String(selectedCourseId)
    const matchByTitle = selectedCourse && cTitle && String(cTitle).toLowerCase() === String(selectedCourse.title).toLowerCase()
    
    return matchById || matchByTitle
  })

  console.log("Shahira match for selectedCourseId 1:", matches)
}
fetchAllData()
