import { useState } from 'react'
import '../../App.css'
import LiveClassroom from '../Learning/LiveClassroom.jsx'
import Assessments from './Assessments.jsx'

function CourseDetail({ course, onBack, onEnterClassroom, onNavigate }) {
  const [showLiveClassroom, setShowLiveClassroom] = useState(false)
  const [showAssessments, setShowAssessments] = useState(false)

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

  if (showAssessments) {
    return <Assessments onBack={() => setShowAssessments(false)} />
  }

  if (showLiveClassroom) {
    return <LiveClassroom course={course} onBack={() => setShowLiveClassroom(false)} userRole="mentor" />
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
                <span className="progress-label">Overall Progress</span>
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

        {/* Course Stats Section */}
        <div className="course-detail-section">
          <h3 className="section-title">Course Statistics</h3>
          <div className="course-stats-grid">
            <div className="course-stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-label">Total Students</span>
                <span className="stat-value">{course.students || 0}</span>
              </div>
            </div>
            <div className="course-stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <span className="stat-label">Enrollments</span>
                <span className="stat-value">{course.enrollments || 0}</span>
              </div>
            </div>
            <div className="course-stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{course.completed || 0}</span>
              </div>
            </div>
            <div className="course-stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-label">Sessions</span>
                <span className="stat-value">{course.sessionsCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Sessions/Classes */}
        {course.classes && course.classes.length > 0 && (
          <div className="course-detail-section">
            <h3 className="section-title">All Sessions</h3>
            <div className="classes-list">
              {course.classes.map((classItem) => (
                <div key={classItem.id} className="class-item">
                  <div className="class-item-header">
                    <h4 className="class-item-title">{classItem.title}</h4>
                    <div className="class-item-meta">
                      <span className="class-item-duration">{classItem.duration}</span>
                      <span className={`class-item-type ${classItem.type.toLowerCase()}`}>
                        {classItem.type}
                      </span>
                    </div>
                  </div>
                  <div className="class-item-status">
                    {classItem.completed ? (
                      <span className="status-badge completed">Completed</span>
                    ) : (
                      <span className="status-badge pending">Upcoming</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Enrolled */}
        {course.enrolledStudents && course.enrolledStudents.length > 0 && (
          <div className="course-detail-section">
            <h3 className="section-title">Enrolled Students</h3>
            <div className="students-list">
              {course.enrolledStudents.slice(0, 5).map((student) => (
                <div key={student.id} className="student-item">
                  <div className="student-avatar">
                    <img src={student.image || 'https://via.placeholder.com/40'} alt={student.name} />
                  </div>
                  <div className="student-info">
                    <h4 className="student-name">{student.name}</h4>
                    <p className="student-progress">Progress: {student.progress || 0}%</p>
                  </div>
                  <div className="student-actions">
                    <button className="btn-secondary btn-small">View Progress</button>
                  </div>
                </div>
              ))}
              {course.enrolledStudents.length > 5 && (
                <div className="view-all-students">
                  <button className="btn-secondary">View All {course.enrolledStudents.length} Students</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assessments Section */}
        <div className="course-detail-section">
          <div className="section-header-with-button">
            <h3 className="section-title">Assessments</h3>
          </div>
          <p className="section-subtitle">Create and manage assessments for students in this course.</p>
          <div className="course-detail-actions">
            <button
              className="btn-primary"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('Assessments')
                } else {
                  setShowAssessments(true)
                }
              }}
            >
              Manage Assessments
            </button>
          </div>
        </div>

        {/* Assignments */}
        {course.assignments && course.assignments.length > 0 && (
          <div className="course-detail-section">
            <h3 className="section-title">Assignments</h3>
            <div className="assignments-list">
              {course.assignments.map((assignment) => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-header">
                    <h4 className="assignment-title">{assignment.title}</h4>
                    <span className={`assignment-status ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                      {assignment.status}
                    </span>
                  </div>
                  {assignment.dueDate && (
                    <p className="assignment-due">Due: {assignment.dueDate}</p>
                  )}
                  <div className="assignment-actions">
                    <button className="btn-secondary btn-small">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {course.resources && course.resources.length > 0 && (
          <div className="course-detail-section">
            <h3 className="section-title">Course Resources</h3>
            <div className="resources-list">
              {course.resources.map((resource) => (
                <div key={resource.id} className="resource-item">
                  <div className="resource-icon">
                    {resource.type === 'PDF' ? '📄' : '🔗'}
                  </div>
                  <div className="resource-info">
                    <h4 className="resource-title">{resource.title}</h4>
                    <p className="resource-meta">
                      {resource.type}
                      {resource.size && ` • ${resource.size}`}
                    </p>
                  </div>
                  <button className="btn-secondary btn-small">View</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Actions */}
        <div className="course-detail-actions">
          <button className="btn-primary">Edit Course</button>
          <button className="btn-secondary">View All Enrollments</button>
          <button className="btn-secondary">Manage Sessions</button>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail

