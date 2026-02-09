import { useState, useEffect } from 'react'
import '../../App.css'
import CourseDetail from './CourseDetail.jsx'
import { SearchIcon } from '../../components/Icons.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function MyCourses({ onBack, onMentorClick, setIsCourseDetailActive, onEnterClassroom, setIsLiveClassroomActive }) {
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Use global dashboard data from context
  // Aliasing enrolledCourses to taughtCourses for semantic clarity in Mentor context
  const { enrolledCourses: taughtCourses, loading, userProfile } = useDashboardData()

  // Unique the taught courses to avoid duplicates if multiple students are enrolled
  const uniqueTaughtCourses = taughtCourses ? Array.from(new Map(taughtCourses.map(c => [c.id, c])).values()) : []

  useEffect(() => {
    if (setIsCourseDetailActive) {
      setIsCourseDetailActive(!!selectedCourse)
    }
  }, [selectedCourse, setIsCourseDetailActive])

  // Format current date
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onMentorClick={onMentorClick}
        onEnterClassroom={(course) => {
          if (onEnterClassroom) onEnterClassroom(course)
        }}
      />
    )
  }

  return (
    <div className="dashboard-page-v2 font-sans">
      <div className="dashboard-background-v2">
        <div className="grain-texture absolute inset-0"></div>
        <div className="dashboard-blob-1"></div>
        <div className="dashboard-blob-2"></div>
      </div>

      {/* Header V2 */}
      <header className="dashboard-header-v2">
        <div className="dashboard-profile-group">
          <img
            src={userProfile?.profile_image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"}
            alt="Profile"
            className="dashboard-profile-img-v2"
          />
          <div className="dashboard-welcome-text-v2">
            <h1>My Classrooms</h1>
            <p className="dashboard-date-v2">Manage your teaching journey</p>
          </div>
        </div>
      </header>

      {/* Search V2 */}
      <section className="dashboard-search-container-v2">
        <div className="dashboard-search-pill-v2">
          <SearchIcon className="dashboard-search-icon-v2" />
          <input
            type="text"
            className="dashboard-search-input-v2"
            placeholder="Search your courses..."
          />
        </div>
      </section>

      {/* Course Grid V2 */}
      <section className="dashboard-course-grid-v2">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', gridColumn: '1 / -1' }}>
            Loading your courses...
          </div>
        ) : uniqueTaughtCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', gridColumn: '1 / -1' }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>You aren't teaching any courses yet.</p>
            <p style={{ fontSize: '14px' }}>Once assigned, your courses will appear here.</p>
          </div>
        ) : (
          uniqueTaughtCourses.map((course) => (
            <div
              key={course.id}
              className="dashboard-course-card-wrapper-v2"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="course-card-image-v2">
                <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} alt={course.title} />
                <div className="course-card-overlay-v2"></div>
                <div className="course-card-badges-v2">
                  <span className="course-badge-v2">{course.level || 'Course'}</span>
                </div>
              </div>

              <div className="course-card-content-v2">
                <h3 className="course-card-title-v2">{course.title}</h3>
                <div className="course-card-instructor-v2">
                  {/* For mentors, maybe show category or student count instead of mentor name (which is them) */}
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>category</span>
                  {course.category || 'Development'}
                </div>

                <div className="course-card-footer-v2">
                  <div className="course-rating-v2">
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>star</span>
                    {course.rating || '4.8'}
                  </div>
                  <span className="course-progress-text-v2">Active</span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export default MyCourses
