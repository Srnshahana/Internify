import { useState, useEffect } from 'react'
import '../../App.css'
import CourseDetail from './CourseDetail.jsx'
import { SearchIcon } from '../../components/Icons.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function MyCourses({ courses: staticCourses, onBack, onEnterClassroom, onMentorClick, setIsCourseDetailActive }) {
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    if (setIsCourseDetailActive) {
      setIsCourseDetailActive(!!selectedCourse)
    }
  }, [selectedCourse, setIsCourseDetailActive])

  // Use global dashboard data from context
  const { enrolledCourses, loading } = useDashboardData()

  // Home Drawer state (reused logic for consistant design)
  const [isHomeDrawerExpanded, setIsHomeDrawerExpanded] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)

  const EXPAND_DISTANCE = 80

  const handleDrawerDragStart = (e) => {
    setIsDragging(true)
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setStartY(clientY)
  }

  const handleDrawerDragMove = (e) => {
    if (!isDragging) return
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const deltaY = clientY - startY

    if (!isHomeDrawerExpanded) {
      setDragY(Math.max(-EXPAND_DISTANCE, Math.min(0, deltaY)))
    } else {
      setDragY(Math.min(EXPAND_DISTANCE, Math.max(0, deltaY)))
    }
  }

  const handleDrawerDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = EXPAND_DISTANCE / 3

    if (!isHomeDrawerExpanded) {
      if (dragY < -threshold) setIsHomeDrawerExpanded(true)
    } else {
      if (dragY > threshold) setIsHomeDrawerExpanded(false)
    }
    setDragY(0)
  }

  const toggleHomeDrawer = () => setIsHomeDrawerExpanded(!isHomeDrawerExpanded)

  const getCourseStatus = (course) => {
    if (course.progress >= 100) return 'Completed'
    if (course.progress > 0) return 'In Progress'
    return 'Not Started'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#0ca5e9'
      case 'In Progress': return '#38bdf8'
      case 'Not Started': return '#94a3b8'
      default: return '#94a3b8'
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
    <div className="dashboard-page-new">
      {/* Top Section matching Home design */}
      <div className="home-top-section">
        <div className="welcome-header-new">
          <div className="welcome-text-container">
            <h1 className="welcome-title-new" style={{ marginTop: 0 }}>My Courses</h1>
            <p className="welcome-date-new">Manage your learning journey</p>
          </div>
        </div>
        <div className="home-search-section">
          <div className="home-search-bar">
            <SearchIcon className="search-icon-home" />
            <input
              type="text"
              placeholder="Search your courses..."
              className="home-search-input"
            />
          </div>
        </div>
      </div>

      {/* Main Content Drawer */}
      <div
        className={`home-main-content ${isHomeDrawerExpanded ? 'is-expanded' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={{
          transform: isDragging ? `translateY(${isHomeDrawerExpanded ? -EXPAND_DISTANCE + dragY : dragY}px)` : '',
          marginTop: '-35px' // Ensure overlap matches Home
        }}
        onMouseMove={handleDrawerDragMove}
        onMouseUp={handleDrawerDragEnd}
        onMouseLeave={handleDrawerDragEnd}
        onTouchMove={handleDrawerDragMove}
        onTouchEnd={handleDrawerDragEnd}
      >
        <div
          className="home-drawer-handle"
          onMouseDown={handleDrawerDragStart}
          onTouchStart={handleDrawerDragStart}
          onClick={(e) => {
            if (Math.abs(dragY) < 5) toggleHomeDrawer()
          }}
        >
          <div className="handle-line"></div>
        </div>

        <div className="classroom-container" style={{ padding: '0', marginTop: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading your courses...</div>
          ) : enrolledCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>You haven't enrolled in any courses yet.</p>
              <p style={{ fontSize: '14px' }}>Explore mentors to start your journey.</p>
            </div>
          ) : (
            <div className="courses-grid-elegant" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {enrolledCourses.map((course, index) => {
                const status = getCourseStatus(course)
                const statusColor = getStatusColor(status)

                return (
                  <div
                    key={course.id}
                    className="program-card"
                    onClick={() => setSelectedCourse(course)}
                    style={{ cursor: 'pointer', height: 'auto' }}
                  >
                    <div className="program-card-image-wrapper">
                      <img src={course.image} alt={course.title} className="program-card-image" />
                      <div className="program-card-gradient-overlay"></div>
                    </div>

                    <div className="program-card-content" style={{ flex: 1 }}>
                      <h3 className="program-card-title">{course.title}</h3>
                      <span className="program-card-mentor-name">by {course.mentor}</span>

                      <div className="program-card-details">
                        <div className="program-card-rating">
                          <span className="program-rating-star">★</span>
                          <span className="program-rating-value">{course.rating}</span>
                        </div>
                        <div className="program-card-meta">
                          <span className="program-card-level">{course.level}</span>
                          <span className="program-card-separator">•</span>
                          <span className="program-card-duration">
                            {course.progress}% Completed
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attached Coming Soon Footer */}
                    <div className="program-card-footer-coming-soon">
                      <span className="label">Ongoing Session</span>
                      <span className="content">
                        {course.sessions?.find(s => s.status === 'pending')?.title ||
                          course.sessions?.[0]?.title ||
                          'Module 1'}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyCourses

