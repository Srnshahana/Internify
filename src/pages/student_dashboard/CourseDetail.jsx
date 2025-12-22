import { useState } from 'react'
import '../../App.css'
import LiveClassroom from '../../liveClassroom.jsx'

function CourseDetail({ course, onBack, onEnterClassroom, onMentorClick }) {
  const [showLiveClassroom, setShowLiveClassroom] = useState(false)

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    return Array(5).fill(0).map((_, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  const handleEnterClassroom = () => {
    if (onEnterClassroom) {
      onEnterClassroom(course)
    } else {
      setShowLiveClassroom(true)
    }
  }

  const handleMentorClick = () => {
    if (onMentorClick && course) {
      // Create mentor object from course data
      const mentor = {
        name: course.mentor,
        image: course.mentorImage,
        role: 'Mobile Application Developer', // You can make this dynamic
        rating: course.rating || 4.0,
        focus: course.description,
      }
      onMentorClick(mentor)
    }
  }

  if (showLiveClassroom) {
    return <LiveClassroom course={course} onBack={() => setShowLiveClassroom(false)} />
  }

  if (!course) {
    return null
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
        <h1 className="page-title">Course Details</h1>
      </div>

      <div className="course-detail-container">
        {/* Course Header Section */}
        <div className="course-detail-hero">
          <div className="course-detail-hero-content">
            <div className="course-detail-badges">
              <span className="course-badge category">{course.category}</span>
              <span className="course-badge level">{course.level}</span>
              <span className="course-badge type">{course.type}</span>
            </div>
            <h2 className="course-detail-title">{course.title}</h2>
            <p className="course-detail-description">{course.description}</p>
            <div className="course-detail-rating">
              <span className="rating-stars">{renderStars(course.rating || 4.0)}</span>
              <span className="rating-value">{course.rating || 4.0}</span>
            </div>
          </div>
          <div className="course-detail-progress-section">
            <div className="course-detail-progress">
              <div className="progress-info">
                <span className="progress-label">Progress</span>
                <span className="progress-percentage">{course.progress}%</span>
              </div>
              <div className="progress-bar-large">
                <div 
                  className="progress-bar-fill-large" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            <button className="enter-classroom-btn" onClick={handleEnterClassroom}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Enter Classroom
            </button>
          </div>
        </div>

        {/* Mentor Section */}
        <div className="course-detail-section">
          <h3 className="section-title">Mentor</h3>
          <div className="mentor-card-detail clickable" onClick={handleMentorClick} style={{ cursor: 'pointer' }}>
            <div className="mentor-avatar-large">
              <img src={course.mentorImage} alt={course.mentor} />
            </div>
            <div className="mentor-info-detail">
              <h4 className="mentor-name-detail">{course.mentor}</h4>
              <p className="mentor-role-detail">Mobile Application Developer</p>
              <div className="mentor-rating-detail">
                <span className="rating-stars">{renderStars(course.rating || 4.0)}</span>
                <span className="rating-text">{course.rating || 4.0} Rating</span>
              </div>
            </div>
            <div className="mentor-view-profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div className="course-detail-grid">
          <div className="course-detail-section">
            <h3 className="section-title">Upcoming Session</h3>
            <div className="info-card">
              <div className="info-item">
                <span className="info-label">Next Session:</span>
                <span className="info-value">{course.nextSession}</span>
              </div>
            </div>
          </div>

          <div className="course-detail-section">
            <h3 className="section-title">Course Stats</h3>
            <div className="info-card">
              <div className="info-item">
                <span className="info-label">Assignments:</span>
                <span className="info-value">{course.assignmentsCount || course.assignments?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Classes:</span>
                <span className="info-value">{course.classes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Sessions List */}
        {course.classes && course.classes.length > 0 && (
          <div className="course-detail-section">
            <h3 className="section-title">All Sessions</h3>
            <div className="classes-list">
              {course.classes.map((cls) => (
                <div key={cls.id} className={`class-item ${cls.completed ? 'completed' : ''}`}>
                  <div className="class-item-content">
                    <div className="class-item-header">
                      <h4 className="class-item-title">{cls.title}</h4>
                      <span className={`class-status ${cls.completed ? 'completed' : 'pending'}`}>
                        {cls.completed ? '✓ Completed' : '○ Pending'}
                      </span>
                    </div>
                    <div className="class-item-meta">
                      <span className="class-duration">{cls.duration}</span>
                      <span className="class-type">{cls.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments List */}
        {course.assignments && course.assignments.length > 0 && (
          <div className="course-detail-section">
            <h3 className="section-title">Assignments</h3>
            <div className="assignments-list">
              {course.assignments.map((assignment) => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-item-content">
                    <div className="assignment-item-header">
                      <h4 className="assignment-item-title">{assignment.title}</h4>
                      <span className={`assignment-status ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                        {assignment.status}
                      </span>
                    </div>
                    {assignment.dueDate && (
                      <p className="assignment-due-date">Due: {assignment.dueDate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {course.resources && course.resources.length > 0 && (
          <div className="course-detail-section">
            <h3 className="section-title">Resources</h3>
            <div className="resources-list">
              {course.resources.map((resource) => (
                <div key={resource.id} className="resource-item">
                  <div className="resource-icon">
                    {resource.type === 'PDF' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    )}
                    {resource.type === 'Link' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    )}
                    {resource.type === 'Figma' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    )}
                  </div>
                  <div className="resource-content">
                    <h4 className="resource-title">{resource.title}</h4>
                    <p className="resource-meta">
                      {resource.type}
                      {resource.size && ` • ${resource.size}`}
                    </p>
                  </div>
                  {resource.url && (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetail

