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
        return '#22c55e'
      case 'In Progress':
        return '#3b82f6'
      case 'Not Started':
        return '#6b7280'
      default:
        return '#6b7280'
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
    <div className="dashboard-page">
      <div className="course-detail-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <h1 className="page-title">My Courses</h1>
      </div>

      <div className="my-courses-container">
        <div className="my-courses-list">
          {courses.map((course) => {
            const status = getCourseStatus(course)
            const statusColor = getStatusColor(status)
            
            return (
              <div
                key={course.id}
                className="my-course-card"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="my-course-card-content">
                  <div className="my-course-header">
                    <div className="my-course-info">
                      <div className="my-course-mentor-section">
                        <div className="my-course-mentor-avatar">
                          <img src={course.mentorImage} alt={course.mentor} />
                        </div>
                        <div className="my-course-mentor-details">
                          <h3 className="my-course-title">{course.title}</h3>
                          <p className="my-course-mentor-name">{course.mentor}</p>
                        </div>
                      </div>
                      <div className="my-course-status-badge" style={{ backgroundColor: `${statusColor}20`, color: statusColor, borderColor: statusColor }}>
                        {status}
                      </div>
                    </div>
                  </div>

                  <div className="my-course-details">
                    <div className="my-course-meta">
                      <span className="my-course-category">{course.category}</span>
                      <span className="my-course-level">{course.level}</span>
                      <span className="my-course-type">{course.type}</span>
                    </div>
                    <div className="my-course-rating">
                      <span className="rating-stars">{renderStars(course.rating || 4.0)}</span>
                      <span className="rating-value">{course.rating || 4.0}</span>
                    </div>
                  </div>

                  <div className="my-course-progress-section">
                    <div className="my-course-progress-header">
                      <span className="progress-label">Progress</span>
                      <span className="progress-percentage">{course.progress}%</span>
                    </div>
                    <div className="my-course-progress-bar">
                      <div
                        className="my-course-progress-fill"
                        style={{ width: `${course.progress}%`, backgroundColor: statusColor }}
                      ></div>
                    </div>
                  </div>

                  <div className="my-course-footer">
                    <div className="my-course-stats">
                      <div className="my-course-stat-item">
                        <span className="stat-label">Sessions</span>
                        <span className="stat-value">{course.classes?.length || 0}</span>
                      </div>
                      <div className="my-course-stat-item">
                        <span className="stat-label">Assignments</span>
                        <span className="stat-value">{course.assignmentsCount || course.assignments?.length || 0}</span>
                      </div>
                      <div className="my-course-stat-item">
                        <span className="stat-label">Next Session</span>
                        <span className="stat-value">{course.nextSession || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="my-course-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
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

