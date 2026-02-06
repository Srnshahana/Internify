import { useState, useEffect } from 'react'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import supabase from '../../supabaseClient'
import '../../App.css'
import StudentLiveClassroom from './StudentLiveClassroom.jsx'

function CourseDetail({ course, onBack, onEnterClassroom, onMentorClick }) {
  const [showLiveClassroom, setShowLiveClassroom] = useState(false)
  const { enrolledCourses } = useDashboardData()

  // Try to find the latest data from context, fallback to prop
  const contextCourse = enrolledCourses?.find(c => c.id === course?.id)
  const [courseDetails, setCourseDetails] = useState(contextCourse || course)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If context has the data (especially sessions), use it immediately
    if (contextCourse) {
      setCourseDetails(prev => ({ ...prev, ...contextCourse }))
    }

    const fetchCourseDetails = async () => {
      if (!course?.id) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('course_details')
          .select('*')
          .eq('course_id', course.id)
          .single()

        if (error) {
          console.log('Fetching detailed info from Supabase (optional)...')
        } else if (data) {
          setCourseDetails(prev => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetails()
  }, [course, contextCourse])

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

  const handleMentorClick = () => {
    if (onMentorClick && course) {
      const mentor = {
        name: course.mentor,
        image: course.mentorImage,
        role: 'Mobile Application Developer',
        rating: course.rating || 4.0,
        focus: course.description,
      }
      onMentorClick(mentor)
    }
  }

  if (showLiveClassroom) {
    return <StudentLiveClassroom course={courseDetails} onBack={() => setShowLiveClassroom(false)} />
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
              <span className="course-badge-v2 badge-category-v2">{courseDetails.category}</span>
              <span className="course-badge-v2 badge-level-v2">{courseDetails.level}</span>
              <span className="course-badge-v2 badge-type-v2">{courseDetails.type}</span>
            </div>

            <h1 className="course-title-v2">{courseDetails.title}</h1>
            <p className="course-description-v2">{courseDetails.description}</p>

            {/* Meta Row: Mentor, Rating, Progress, Action */}
            <div className="hero-actions-row-v2">
              <div className="hero-meta-group">
                {/* <div className="mentor-mini-profile-v2">
                  <img src={courseDetails.mentorImage} alt={courseDetails.mentor} />
                  <div className="mentor-text">
                    <span className="mentor-label">Mentor</span>
                    <span className="mentor-name">{courseDetails.mentor}</span>
                  </div>
                </div> */}
                <div className="course-rating-v2">
                  <span className="rating-star-icon-v2">★</span>
                  <span className="rating-value-v2">{courseDetails.rating || 4.0}</span>
                </div>
              </div>

              <div className="hero-progress-group">
                <div className="progress-info-v2">
                  <span className="progress-label-v2">Your Progress</span>
                  <span className="progress-percent-v2">{courseDetails.progress}%</span>
                </div>
                <div className="progress-bar-v2-container">
                  <div className="progress-bar-v2-fill" style={{ width: `${courseDetails.progress}%` }}></div>
                </div>
              </div>

              <button className="enter-classroom-btn-v2" onClick={handleEnterClassroom}>
                Enter Classroom
              </button>
            </div>
          </div>
        </div>

        {/* Mentor Section */}
        <div className="course-section-elegant">
          <h3 className="section-title-elegant">Your Mentor</h3>
          <div className="mentor-card-elegant" onClick={handleMentorClick}>
            <div className="mentor-avatar-elegant">
              <img src={courseDetails.mentorImage} alt={courseDetails.mentor} />
            </div>
            <div className="mentor-info-elegant">
              <h4 className="mentor-name-elegant">{courseDetails.mentor}</h4>
              <p className="mentor-role-elegant">Mobile Application Developer</p>
              <div className="mentor-rating-elegant">
                <span className="rating-stars-elegant">{renderStars(courseDetails.rating || 4.0)}</span>
                <span>{courseDetails.rating || 4.0} Rating</span>
              </div>
            </div>
            <div className="mentor-view-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Course Information Grid */}
        <div className="course-grid-elegant">
          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Upcoming Session</h3>
            <div className="info-card-elegant">
              <div className="info-item-elegant">
                <span className="info-label-elegant">Next Session:</span>
                <span className="info-value-elegant">
                  {courseDetails.sessions?.find(s => s.status === 'pending')?.title ||
                    courseDetails.sessions?.[0]?.title ||
                    courseDetails.nextSession ||
                    'Coming Soon'}
                </span>
              </div>
            </div>
          </div>

          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Course Stats</h3>
            <div className="info-card-elegant">
              <div className="info-item-elegant">
                <span className="info-label-elegant">Assignments:</span>
                <span className="info-value-elegant">{courseDetails.assignmentsCount || courseDetails.assignments?.length || 0}</span>
              </div>
              <div className="info-item-elegant">
                <span className="info-label-elegant">Classes:</span>
                <span className="info-value-elegant">{courseDetails.classes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Sessions List (Support both 'sessions' and legacy 'classes') */}
        {(courseDetails.sessions || courseDetails.classes) && (
          <div className="course-section-elegant">
            <h3 className="section-title-elegant">All Sessions</h3>
            {(courseDetails.sessions || courseDetails.classes).map((session, index) => (
              <div key={session.sessionId || session.id || index} className={`session-item-elegant ${session.completed ? 'completed' : ''}`}>
                <div className="session-header-elegant">
                  <h4 className="session-title-elegant">{session.title}</h4>
                  <span className={`session-status-elegant ${session.completed ? 'status-completed' : 'status-pending'}`}>
                    {session.completed ? '✓ Completed' : '○ Pending'}
                  </span>
                </div>

                {session.topics && session.topics.length > 0 && (
                  <div className="session-topics-list">
                    {session.topics.map((topic, i) => (
                      <span key={i} className="session-topic-tag">{typeof topic === 'string' ? topic : topic.name}</span>
                    ))}
                  </div>
                )}

                {session.description && (
                  <p className="session-description-elegant" style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                    {session.description}
                  </p>
                )}

                {/* Legacy Fallback */}
                {session.duration && (
                  <div className="session-meta-elegant">
                    <span>{session.duration}</span>
                    <span>•</span>
                    <span>{session.type}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Assignments List */}
        {courseDetails.assignments && courseDetails.assignments.length > 0 && (
          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Assignments</h3>
            {courseDetails.assignments.map((assignment) => (
              <div key={assignment.id} className="assignment-item-elegant">
                <div className="assignment-header-elegant">
                  <h4 className="assignment-title-elegant">{assignment.title}</h4>
                  <span className={`assignment-status-elegant status-${assignment.status.toLowerCase().replace(' ', '-')}`}>
                    {assignment.status}
                  </span>
                </div>
                {assignment.dueDate && (
                  <p className="assignment-due-date-elegant">Due: {assignment.dueDate}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Resources */}
        {courseDetails.resources && courseDetails.resources.length > 0 && (
          <div className="course-section-elegant">
            <h3 className="section-title-elegant">Resources</h3>
            {courseDetails.resources.map((resource) => (
              <div key={resource.id} className="resource-item-elegant">
                <div className="resource-icon-elegant">
                  {resource.type === 'PDF' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                  {resource.type === 'Link' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  )}
                  {resource.type === 'Figma' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  )}
                </div>
                <div className="resource-content-elegant">
                  <h4 className="resource-title-elegant">{resource.title}</h4>
                  <p className="resource-meta-elegant">
                    {resource.type}
                    {resource.size && ` • ${resource.size}`}
                  </p>
                </div>
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link-elegant">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetail
