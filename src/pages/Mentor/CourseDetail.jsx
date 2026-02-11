import { useState, useEffect } from 'react'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import supabase from '../../supabaseClient'
import '../../App.css'
import MentorLiveClassroom from './MentorLiveClassroom.jsx'
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
    return <MentorLiveClassroom course={courseDetails} onBack={() => setShowLiveClassroom(false)} />
  }

  if (!courseDetails) {
    return null
  }

  return (
    <div className="course-detail-page-v2">
      {/* V2 Header (Glass) */}
      <div className="course-detail-header-v2">
        <button className="back-btn-v2" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <span className="header-course-title-v2">{courseDetails.title}</span>
        <div style={{ flex: 1 }}></div>
      </div>

      <div className="course-detail-content-wrapper-v2">
        {/* V2 Hero Section (2-Column) */}
        <div className="course-hero-v2 single-column">
          <div className="hero-info-column">
            <div className="course-badges-v2">
              <span className="course-badge-v2 badge-category-v2">{courseDetails.category || 'General'}</span>
              <span className="course-badge-v2 badge-level-v2">{courseDetails.level || 'Expert'}</span>
              <span className="course-badge-v2 badge-type-v2">Live</span>
            </div>

            <h1 className="course-title-v2">{courseDetails.title}</h1>
            <p className="course-description-v2">{courseDetails.description}</p>

            {/* Meta Row: Stats, Progress, Action */}
            <div className="hero-actions-row-v2">
              <div className="hero-meta-group">
                <div className="course-rating-v2">
                  <span className="rating-star-icon-v2">★</span>
                  <span className="rating-value-v2">{courseDetails.rating || 4.8}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#64748b' }}>group</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{studentCount} Students</span>
                </div>
              </div>

              <div className="hero-progress-group" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="progress-info-v2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="progress-label-v2" style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Class Progress</span>
                  <span className="progress-percent-v2" style={{ fontSize: '12px', fontWeight: '700', color: '#0ea5e9' }}>{courseDetails.progress || 0}%</span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '3px',
                  width: '100%',
                  height: '18px',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  {[...Array(30)].map((_, i) => {
                    const isFilled = (courseDetails.progress || 0) >= ((i + 1) / 30) * 100;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          maxWidth: '8px',
                          height: '100%',
                          background: isFilled ? 'linear-gradient(180deg, #0ea5e9 0%, #06b6d4 100%)' : 'rgba(15, 23, 42, 0.05)',
                          borderRadius: '3px',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: isFilled ? 'scaleY(1)' : 'scaleY(0.7)',
                          boxShadow: isFilled ? '0 2px 8px rgba(14, 165, 233, 0.25)' : 'none',
                          opacity: isFilled ? 1 : 0.4
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <button className="enter-classroom-btn-v2" onClick={handleEnterClassroom}>
                Start Session
              </button>
            </div>
          </div>
        </div>

        {/* Course Statistics Grid */}
        <div className="course-grid-elegant">
          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Upcoming Section</h3>
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
            <h3 className="section-title-elegant">All Sections</h3>
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

