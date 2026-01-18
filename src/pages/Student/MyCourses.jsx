import { useState, useEffect } from 'react'
import supabase from '../../supabaseClient'
import { getAuthenticatedUser } from '../../utils/auth.js'
import '../../App.css'
import CourseDetail from './CourseDetail.jsx'

function MyCourses({ courses: staticCourses, onBack, onEnterClassroom, onMentorClick }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchEnrolledCourses() {
      try {
        setLoading(true)

        const studentId = localStorage.getItem('auth_id');

        // if (!studentId) {
        //   console.log("No user logged in")
        //   setLoading(false)
        //   return
        // }

        // 1. Fetch enrollments
        const { data: enrollments, error: enrollError } = await supabase
          .from('classes_enrolled')
          .select('course_id, mentor_id')
          .eq('student_id', studentId)

        if (enrollError) throw enrollError
        if (!enrollments || enrollments.length === 0) {
          setEnrolledCourses([])
          setLoading(false)
          return
        }

        // 2. Fetch course details and mentor details
        const courseIds = enrollments.map(e => e.course_id)
        const mentorIds = enrollments.map(e => e.mentor_id)

        const [coursesRes, mentorsRes] = await Promise.all([
          supabase.from('courses').select('*').in('course_id', courseIds),
          supabase.from('mentors_details').select('mentor_id, name').in('mentor_id', mentorIds)
        ])

        if (coursesRes.error) throw coursesRes.error
        if (mentorsRes.error) throw mentorsRes.error

        const coursesMap = new Map(coursesRes.data.map(c => [c.course_id, c]))
        const mentorsMap = new Map(mentorsRes.data.map(m => [m.mentor_id, m]))

        // 3. Merge data
        const mergedData = enrollments.map(enrollment => {
          const course = coursesMap.get(enrollment.course_id)
          const mentor = mentorsMap.get(enrollment.mentor_id)

          return {
            id: enrollment.course_id, // UI expects 'id'
            course_id: enrollment.course_id,
            mentor_id: enrollment.mentor_id,
            title: course?.title || 'Unknown Course',
            category: course?.category || 'General',
            image: course?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: course?.rating || 4.8,
            level: course?.skill_level || course?.level || 'Beginner',
            mentor: mentor?.name || 'Expert Mentor',
            progress: 0, // Default to 0 as progress tracking isn't in schema yet
            status: enrollment.status || 'active',
            nextSession: 'Coming Soon' // Placeholder
          }
        })

        setEnrolledCourses(mergedData)
      } catch (err) {
        console.error('Error fetching enrolled courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolledCourses()
  }, [])

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    return Array(5).fill(0).map((_, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  const getCourseStatus = (course) => {
    if (course.progress >= 100) return 'Completed'
    if (course.progress > 0) return 'In Progress'
    return 'Not Started'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#0ca5e9' // Sky Blue
      case 'In Progress':
        return '#38bdf8' // Lighter Sky Blue
      case 'Not Started':
        return '#94a3b8' // Slate 400
      default:
        return '#94a3b8'
    }
  }

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onEnterClassroom={onEnterClassroom}
        onMentorClick={onMentorClick}
      />
    )
  }

  return (
    <div className="classroom-page-wrapper">
      <div className="course-detail-header">
        <h1 className="page-title">My Courses</h1>
      </div>

      <div className="classroom-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading your courses...</div>
        ) : enrolledCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>You haven't enrolled in any courses yet.</p>
            <p style={{ fontSize: '14px' }}>Explore mentors to start your journey.</p>
          </div>
        ) : (
          <div className="courses-grid-elegant">
            {enrolledCourses.map((course) => {
              const status = getCourseStatus(course)
              const statusColor = getStatusColor(status)

              return (
                <div
                  key={course.id}
                  className="course-card-elegant"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="course-image-wrapper-elegant">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="course-image-elegant"
                    />
                    <div className="course-status-pill-elegant" style={{ backgroundColor: statusColor }}>
                      {course.progress}%
                    </div>
                  </div>

                  <div className="course-content-elegant">
                    <div className="course-header-elegant">
                      <span className="course-category-elegant">{course.category}</span>
                      <div className="course-rating-box">
                        <span className="star-icon">★</span>
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="course-title-elegant">{course.title}</h3>
                    <p className="course-mentor-elegant">by {course.mentor}</p>

                    {/* Current Session Info */}
                    <div className="course-current-session-box">
                      <span className="session-label">Up Next</span>
                      <h4 className="session-name">{course.nextSession}</h4>
                      <span className="session-time">Check Schedule</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCourses

