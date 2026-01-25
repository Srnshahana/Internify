import { useState, useEffect } from 'react'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import supabase from '../../supabaseClient'
import '../../App.css'
import LiveClassroom from '../Learning/LiveClassroom.jsx'
import Assessments from './Assessments.jsx'

function CourseDetail({ course, onBack, onEnterClassroom, onNavigate }) {
  const [showLiveClassroom, setShowLiveClassroom] = useState(false)
  const [showAssessments, setShowAssessments] = useState(false)
  const { enrolledCourses } = useDashboardData()

  // Try to find matching course in context (taughtCourses)
  const contextCourse = enrolledCourses?.find(c => c.course_id === course?.course_id || c.id === course?.id)
  const [courseDetails, setCourseDetails] = useState(contextCourse || course)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (contextCourse) {
      setCourseDetails(prev => ({ ...prev, ...contextCourse }))
    }
  }, [contextCourse])

  const studentCount = enrolledCourses?.filter(e => String(e.course_id) === String(courseDetails.course_id || courseDetails.id)).length || 0

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
    setShowLiveClassroom(true)
  }

  if (showAssessments) {
    return <Assessments onBack={() => setShowAssessments(false)} />
  }

  if (showLiveClassroom) {
    return <LiveClassroom course={courseDetails} onBack={() => setShowLiveClassroom(false)} userRole="mentor" />
  }

  if (!courseDetails) {
    return null
  }

  return (
    <div className="course-detail-page-elegant">
      {/* Header */}
      <div className="course-detail-header-elegant">
        <button className="back-btn-elegant" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <h1 className="course-detail-page-title">Course Management</h1>
      </div>

      <div className="course-detail-content-wrapper">
        {/* Hero Section */}
        <div className="course-hero-elegant">
          <div className="course-badges-elegant">
            <span className="course-badge-elegant badge-category">{courseDetails.category || 'General'}</span>
            <span className="course-badge-elegant badge-level">{courseDetails.level || 'Expert'}</span>
            <span className="course-badge-elegant badge-type">Live</span>
          </div>

          <h2 className="course-title-elegant">{courseDetails.title}</h2>
          <p className="course-description-elegant">{courseDetails.description}</p>

          <div className="course-rating-elegant">
            <span className="rating-stars-elegant">{renderStars(courseDetails.rating || 4.8)}</span>
            <span className="rating-value-elegant">{courseDetails.rating || 4.8}</span>
          </div>

          <div className="course-progress-section-elegant">
            <div className="course-progress-box-elegant">
              <div className="progress-header-elegant">
                <span className="progress-label-elegant">Batch Progress</span>
                <span className="progress-percentage-elegant">{courseDetails.progress || 0}%</span>
              </div>
              <div className="progress-bar-elegant-large">
                <div
                  className="progress-fill-elegant-large"
                  style={{ width: `${courseDetails.progress || 0}%` }}
                ></div>
              </div>
            </div>

            <button className="enter-classroom-btn-elegant" onClick={handleEnterClassroom}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Start Session
            </button>
          </div>
        </div>

        {/* Course Statistics Grid */}
        <div className="course-grid-elegant">
          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Next Module</h3>
            <div className="info-card-elegant">
              <div className="info-item-elegant">
                <span className="info-label-elegant">Scheduled:</span>
                <span className="info-value-elegant">
                  {courseDetails.sessions?.find(s => s.status === 'pending')?.title || 'Check Calendar'}
                </span>
              </div>
            </div>
          </div>

          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Course Analytics</h3>
            <div className="info-card-elegant">
              <div className="info-item-elegant">
                <span className="info-label-elegant">Active Students:</span>
                <span className="info-value-elegant">{studentCount}</span>
              </div>
              <div className="info-item-elegant">
                <span className="info-label-elegant">Modules:</span>
                <span className="info-value-elegant">{courseDetails.sessions?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {courseDetails.sessions && (
          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Curriculum</h3>
            {courseDetails.sessions.map((session, index) => (
              <div key={session.id || index} className={`session-item-elegant ${session.completed ? 'completed' : ''}`}>
                <div className="session-header-elegant">
                  <h4 className="session-title-elegant">{session.title}</h4>
                  <span className={`session-status-elegant ${session.completed ? 'status-completed' : 'status-pending'}`}>
                    {session.completed ? '✓ Done' : '○ Pending'}
                  </span>
                </div>
                {session.description && (
                  <p className="session-description-elegant" style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                    {session.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Manage Work Section */}
        <div className="course-section-elegant">
          <h3 className="section-title-elegant">Quick Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="compact-action-btn" onClick={() => onNavigate && onNavigate('Assessments')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              <span>Assessments</span>
            </button>
            <button className="compact-action-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Student List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail

