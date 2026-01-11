import { useState } from 'react'
import '../../App.css'
import CourseDetail from './CourseDetail.jsx'

function MyCourses({ courses, onBack, onEnterClassroom, onMentorClick }) {
  const [selectedCourse, setSelectedCourse] = useState(null)

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
        {/* <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button> */}
        <h1 className="page-title">My Courses</h1>
      </div>

      <div className="classroom-container">
        <div className="classroom-grid">
          {courses.map((course) => {
            const status = getCourseStatus(course)
            const statusColor = getStatusColor(status)

            return (
              <div
                key={course.id}
                className="classroom-card"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="classroom-card-image-wrapper">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    className="classroom-card-image"
                  />
                  <div className="classroom-status-pill" style={{ backgroundColor: statusColor }}>
                    {status}
                  </div>
                </div>

                <div className="classroom-card-content">
                  <div className="classroom-card-header">
                    <span className="classroom-category">{course.category}</span>
                    <div className="classroom-rating">
                      <span className="star-icon">★</span>
                      <span>{course.rating || 4.8}</span>
                    </div>
                  </div>

                  <h3 className="classroom-title">{course.title}</h3>
                  <p className="classroom-mentor">by {course.mentor}</p>

                  <div className="classroom-progress-section">
                    <div className="classroom-progress-info">
                      <span className="progress-label">Progress</span>
                      <span className="progress-value">{course.progress}%</span>
                    </div>
                    <div className="classroom-progress-track">
                      <div
                        className="classroom-progress-fill"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="classroom-footer">
                    <button className="classroom-btn">
                      Continue Learning
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyCourses

