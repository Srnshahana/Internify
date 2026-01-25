import { useState, useEffect } from 'react'
import '../../App.css'
import CourseDetail from './CourseDetail.jsx'
import { SearchIcon } from '../../components/Icons.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function MyCourses({ onBack, onMentorClick, setIsCourseDetailActive }) {
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    if (setIsCourseDetailActive) {
      setIsCourseDetailActive(!!selectedCourse)
    }
  }, [selectedCourse, setIsCourseDetailActive])

  // Use global dashboard data from context
  const { enrolledCourses: taughtCourses, loading } = useDashboardData()

  // Unique the taught courses to avoid duplicates if multiple students are enrolled
  const uniqueTaughtCourses = taughtCourses ? Array.from(new Map(taughtCourses.map(c => [c.id, c])).values()) : []

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

  if (loading) {
    return (
      <div className="dashboard-page-new" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#0ea5e9', fontWeight: '500' }}>Loading courses...</p>
      </div>
    )
  }

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
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
            <p className="welcome-date-new">Manage and monitor your classrooms</p>
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
          {uniqueTaughtCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>You aren't teaching any courses yet.</p>
            </div>
          ) : (
            <div className="courses-grid-elegant" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {uniqueTaughtCourses.map((course, index) => {
                return (
                  <div
                    key={course.id}
                    className="program-card"
                    onClick={() => setSelectedCourse(course)}
                    style={{ cursor: 'pointer', height: 'auto' }}
                  >
                    <div className="program-card-image-wrapper">
                      <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'} alt={course.title} className="program-card-image" />
                      <div className="program-card-gradient-overlay"></div>
                    </div>

                    <div className="program-card-content" style={{ flex: 1 }}>
                      <h3 className="program-card-title">{course.title}</h3>
                      <span className="program-card-mentor-name">{course.category} • {course.level || 'Expert'}</span>

                      <div className="program-card-details">
                        <div className="program-card-rating">
                          <span className="program-rating-star">★</span>
                          <span className="program-rating-value">{course.rating || 4.8}</span>
                        </div>
                        <div className="program-card-meta">
                          <span className="program-card-level">Active</span>
                          <span className="program-card-separator">•</span>
                          <span className="program-card-duration">
                            Sessions: {course.sessions?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attached Mentor Action Footer */}
                    <div className="program-card-footer-coming-soon">
                      <span className="label">Status</span>
                      <span className="content">
                        {course.status || 'Active'}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="compact-action-btn-small" style={{ background: 'transparent', border: 'none', color: '#0ca5e9', fontWeight: 'bold' }}>View</button>
                      </div>
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

