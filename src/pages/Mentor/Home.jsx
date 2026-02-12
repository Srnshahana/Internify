import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import MyCourses from './MyCourses.jsx'
import CourseDetail from './CourseDetail.jsx'
import StudentRequests from './StudentRequests.jsx'
import PendingWork from './PendingWork.jsx'
import Messages from './Messages.jsx'
import Assessments from './Assessments.jsx'
import MentorLiveClassroom from './MentorLiveClassroom.jsx'
import StudentProfileTemplate from '../../components/StudentProfileTemplate.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import supabase from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import educationJson from '../../assets/lottie/banner.json'
import landingIllustration from '../../assets/images/landingpage-illlustration.png'
import adds1 from '../../assets/images/adds1.png'
import adds2 from '../../assets/images/adds2.png'
import adds3 from '../../assets/images/adds3.png'
import { SearchIcon, CalendarIcon } from '../../components/Icons.jsx'

function MentorHome({ onNavigate, setIsCourseDetailActive, onEnterClassroom, setIsLiveClassroomActive }) {
  const { userProfile, enrolledCourses: taughtCourses, scheduledSessions, loading, refetch } = useDashboardData()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Overview')
  const [showMyCourses, setShowMyCourses] = useState(false)
  const [showStudentRequests, setShowStudentRequests] = useState(false)
  const [showPendingWork, setShowPendingWork] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showAssessments, setShowAssessments] = useState(false)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeCourse, setActiveCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (setIsCourseDetailActive) {
      setIsCourseDetailActive(showCourseDetail)
    }
  }, [showCourseDetail, setIsCourseDetailActive])

  // Unique the taught courses to avoid duplicates if multiple students are enrolled
  const uniqueTaughtCourses = taughtCourses ? Array.from(new Map(taughtCourses.map(c => [c.id, c])).values()) : []

  // Calculate metrics for summary
  const activeTaughtCourses = uniqueTaughtCourses.filter(c => c.status === 'active')
  const overallClassProgress = activeTaughtCourses.length > 0
    ? Math.round(activeTaughtCourses.reduce((acc, c) => acc + (c.progress || 0), 0) / activeTaughtCourses.length)
    : 0

  const totalStudents = Array.from(new Set(taughtCourses.map(c => c.student_id))).length

  // New Modal states
  const [showUpcomingSessionsModal, setShowUpcomingSessionsModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalCourse, setApprovalCourse] = useState(null)
  const [showStudentProfile, setShowStudentProfile] = useState(false)
  const [viewingStudent, setViewingStudent] = useState(null)
  const [studentProfileData, setStudentProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [classroomName, setClassroomName] = useState('')
  const [isApprovedSuccessfully, setIsApprovedSuccessfully] = useState(false)
  const [showProgressGraphModal, setShowProgressGraphModal] = useState(false)

  // Ad Banner state
  const ads = [
    { id: 1, image: adds1, title: 'Internify Ad 1' },
    { id: 2, image: adds2, title: 'Internify Ad 2' },
    { id: 3, image: adds3, title: 'Internify Ad 3' },
  ]
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [ads.length])

  // Sessions for stacked cards (Mentors see their schedule)
  const allScheduled = scheduledSessions || []
  const allCombinedSessions = allScheduled
    .filter(s => !s.completed)
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 10)

  // Calculate session completion progress
  const completedCount = allScheduled.filter(s => s.completed).length
  const totalCount = allScheduled.length
  const sessionProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0)
  const [startYSessions, setStartYSessions] = useState(0)

  // Featured items logic
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const featuredRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (featuredRef.current) {
        const scrollLeft = featuredRef.current.scrollLeft
        const width = featuredRef.current.offsetWidth
        const index = Math.round(scrollLeft / (width * 0.8))
        setCurrentFeaturedIndex(Math.min(index, 2))
      }
    }
    const ref = featuredRef.current
    if (ref) ref.addEventListener('scroll', handleScroll)
    return () => ref?.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      if (!viewingStudent?.id || !showStudentProfile) return
      setLoadingProfile(true)
      try {
        const { data, error } = await supabase
          .from('student_details')
          .select('*')
          .eq('student_id', viewingStudent.id)
          .maybeSingle()

        if (error) throw error
        setStudentProfileData(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [viewingStudent, showStudentProfile])

  useEffect(() => {
    async function checkTable() {
      try {
        const { data, error } = await supabase.from('classes_enrolled').select('*').limit(1);
        if (data && data[0]) {
          console.log('📊 classes_enrolled columns:', Object.keys(data[0]));
          console.log('📊 Sample data:', data[0]);
        } else if (error) {
          console.error('📊 Error checking classes_enrolled table:', error);
        }
      } catch (e) {
        console.error('📊 Unexpected error checking table:', e);
      }
    }
    checkTable();
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page-v2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#0ea5e9', fontWeight: '500' }}>Loading dashboard...</p>
      </div>
    )
  }

  if (showStudentRequests) return <StudentRequests onBack={() => setShowStudentRequests(false)} />
  if (showPendingWork) return <PendingWork onBack={() => setShowPendingWork(false)} />
  if (showMessages) return <Messages onBack={() => setShowMessages(false)} />
  if (activeCourse) return (
    <MentorLiveClassroom
      course={activeCourse}
      onBack={() => {
        setActiveCourse(null)
        if (setIsLiveClassroomActive) setIsLiveClassroomActive(false)
      }}
    />
  )
  if (showAssessments) return <Assessments onBack={() => setShowAssessments(false)} />
  if (showMyCourses) return <MyCourses onBack={() => setShowMyCourses(false)} setIsCourseDetailActive={setIsCourseDetailActive} />

  if (showCourseDetail && selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => {
          setShowCourseDetail(false)
          setSelectedCourse(null)
        }}
        onEnterClassroom={(course) => {
          setActiveCourse(course)
          setShowCourseDetail(false)
          setSelectedCourse(null)
          if (onEnterClassroom) onEnterClassroom()
        }}
        onNavigate={(pageName) => {
          if (pageName === 'Assessments') {
            setShowAssessments(true)
            setShowCourseDetail(false)
            setSelectedCourse(null)
          } else if (onNavigate) {
            onNavigate(pageName)
          }
        }}
      />
    )
  }

  // Format current date for the header
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  // Ad Banner handlers
  const handleNextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      // Implement search logic if needed
      console.log('Search:', searchTerm)
    }
  }

  return (
    <div className="dashboard-page-v2 font-sans">
      <div className="dashboard-background-v2">
        <div className="grain-texture absolute inset-0"></div>
        <div className="dashboard-blob-1"></div>
        <div className="dashboard-blob-2"></div>
      </div>

      <header className="dashboard-header-v2">
        <div className="dashboard-profile-group">
          <img
            src={userProfile?.profile_image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"}
            alt="Profile"
            className="dashboard-profile-img-v2"
          />
          <div className="dashboard-welcome-text-v2">
            <h1>Hi, {userProfile?.name?.split(' ')[0] || 'Mentor'}</h1>
            <p className="dashboard-date-v2">{currentDateFormatted}</p>
          </div>
        </div>
      </header>

      <section className="dashboard-search-container-v2">
        <div className="dashboard-search-pill-v2">
          <SearchIcon className="dashboard-search-icon-v2" />
          <input
            type="text"
            className="dashboard-search-input-v2"
            placeholder="Search students, courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </section>

      <section className="dashboard-ad-section-v2">
        <div className="dashboard-ad-card-v2">
          <div className="ad-code-banner">
            <div className="ad-content-side">
              <div className="ad-text-group">
                <h2 className="ad-banner-text">Provide Mentorship to aspiring developers</h2>
                <button className="ad-banner-cta">View Requets</button>
              </div>
            </div>
            <div className="ad-image-side">
              <img src={landingIllustration} alt="Opportunity" />
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-actions-grid-v2">
        <div className="dashboard-glass-card-v2" onClick={() => setShowUpcomingSessionsModal(true)}>
          <div className="dashboard-card-icon-wrapper icon-sky-v2">
            <CalendarIcon />
          </div>
          <h3 className="dashboard-card-title-v2">Your<br />Schedule</h3>
          <span className="material-symbols-outlined dashboard-card-arrow">arrow_outward</span>
        </div>

        <div className="dashboard-glass-card-v2" onClick={() => setShowPendingWork(true)}>
          <div className="dashboard-card-icon-wrapper icon-orange-v2" style={{ background: '#fff7ed', color: '#ea580c' }}>
            <span className="material-symbols-outlined">assignment_turned_in</span>
          </div>
          <h3 className="dashboard-card-title-v2">Pending<br />Work</h3>
          <span className="material-symbols-outlined dashboard-card-arrow">arrow_outward</span>
        </div>

        <div className="dashboard-glass-card-v2" onClick={() => setShowProgressGraphModal(true)}>
          <div className="dashboard-card-icon-wrapper icon-green-v2">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <h3 className="dashboard-card-title-v2">Class<br />Progress</h3>
          <span className="material-symbols-outlined dashboard-card-arrow">arrow_outward</span>
        </div>
      </section>

      <section className="dashboard-courses-section-v2">
        <div className="dashboard-section-header-v2">
          <h2 className="dashboard-section-title-v2">Taught Courses</h2>
          <span className="dashboard-view-all-v2" onClick={() => setShowMyCourses(true)}>View All</span>
        </div>

        <div className="dashboard-carousel-v2">
          {uniqueTaughtCourses && uniqueTaughtCourses.length > 0 ? (
            uniqueTaughtCourses.map((course) => (
              <div
                key={course.id}
                className="dashboard-course-card-v2"
                onClick={() => {
                  if (course.status === 'pending') {
                    setApprovalCourse(course);
                    setClassroomName('');
                    setIsApprovedSuccessfully(false);
                    setShowApprovalModal(true);
                  } else {
                    setSelectedCourse(course);
                    setShowCourseDetail(true);
                  }
                }}
              >
                <div className="course-card-v2" style={{ cursor: 'pointer' }}>
                  <div className="course-thumb-v2" style={{ height: '160px' }}>
                    <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} alt={course.title} />
                    <div className="course-tag-v2">{course.level || 'Expert'}</div>
                    {course.status === 'pending' && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(245, 158, 11, 0.9)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        zIndex: 2,
                        backdropFilter: 'blur(4px)'
                      }}>
                        Pending
                      </div>
                    )}
                  </div>
                  <div className="course-content-v2">
                    <h3 className="course-name-v2" style={{ fontSize: '1.1rem' }}>{course.title}</h3>
                    <div className="course-meta-v2">
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>★ {course.rating || 4.8} Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '0 20px', color: '#64748b' }}>No courses taught yet.</div>
          )}
        </div>
      </section>

      <div className="dashboard-section dashboard-featured-section-v2">
        <h2 className="dashboard-section-title-v2" style={{ marginBottom: '1rem' }}>Mentor Resources</h2>
        <div className="featured-sessions-carousel" ref={featuredRef} style={{ background: 'transparent' }}>
          <div className="featured-session-card" style={{ background: 'white' }}>
            <h3 className="featured-session-title">Teaching Guide</h3>
            <p className="featured-session-description">Best practices for hosting engaging live sessions and providing effective feedback.</p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">PDF • 2MB</span>
            </div>
          </div>
          <div className="featured-session-card" style={{ background: 'white' }}>
            <h3 className="featured-session-title">Platform Updates</h3>
            <p className="featured-session-description">New features for mentors to track student progress and manage attendance.</p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">Article • 5m read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions Modal */}
      {showUpcomingSessionsModal && (
        <div className="modal-overlay" onClick={() => setShowUpcomingSessionsModal(false)}>
          <div className="modal-content-centered" onClick={(e) => e.stopPropagation()}>
            <div className="progress-modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Upcoming Sessions</h2>
              <button className="progress-modal-close" onClick={() => setShowUpcomingSessionsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Progress Graph Section */}
            <div className="modal-stats-summary">
              <div className="mini-stat-circle">
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#0ea5e9' }}>calendar_today</span>
              </div>
              <div className="modal-summary-text">
                <h4>{allCombinedSessions.length} sessions upcoming</h4>
                <p>Scheduled for the next few days</p>
              </div>
            </div>

            <div className="sessions-list-elegant">
              {allCombinedSessions.length > 0 ? (
                allCombinedSessions.map((session) => (
                  <div key={session.id} className="session-card-elegant">
                    <div className="session-main-content">
                      <div className="session-time-box">
                        <span className="time-main">
                          {session.scheduled_date
                            ? new Date(session.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'TBA'}
                        </span>
                        <span className="time-sub">
                          {session.scheduled_date
                            ? new Date(session.scheduled_date).toLocaleDateString([], { month: 'short', day: 'numeric' })
                            : ''}
                        </span>
                      </div>

                      <div className="session-info-elegant">
                        <h4 style={{ margin: 0 }}>{session.title}</h4>
                        <div className="session-meta-elegant">
                          <span style={{ fontWeight: '600', color: '#0ea5e9' }}>{session.student_details?.name || 'Batch'}</span>
                          <span style={{ margin: '0 8px', opacity: 0.3 }}>•</span>
                          <span>{session.courses?.title || session.courseTitle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="session-actions-buttons" style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        className="session-btn session-btn-primary"
                        onClick={() => session.meeting_link && window.open(session.meeting_link, '_blank')}
                        disabled={!session.meeting_link}
                        style={{ padding: '8px 16px', fontSize: '14px', opacity: session.meeting_link ? 1 : 0.5 }}
                      >
                        {session.meeting_link ? 'Start Session' : 'TBA'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>event_busy</span>
                  <p>No upcoming sessions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Student Approval Modal */}
      {showApprovalModal && approvalCourse && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal-content-centered" onClick={(e) => e.stopPropagation()}>
            <div className="progress-modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="progress-modal-title" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Enrollment Request</h2>
              <button className="progress-modal-close" onClick={() => setShowApprovalModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {isApprovedSuccessfully ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Approved!</h3>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5', margin: '0 0 24px' }}>
                  Student has been enrolled in <br /><strong style={{ color: '#0f172a' }}>{classroomName || approvalCourse.title}</strong>
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div
                  className="mentor-card-elegant"
                  onClick={() => {
                    setViewingStudent({
                      id: approvalCourse.student_id,
                      name: approvalCourse.student_name,
                      image: approvalCourse.student_image
                    })
                    setShowStudentProfile(true)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '24px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                >
                  <img
                    src={approvalCourse.student_image || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop"}
                    alt={approvalCourse.student_name || 'Student'}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{approvalCourse.student_name || 'Student'}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                      Requesting access to: <strong style={{ color: '#0f172a' }}>{approvalCourse.title}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Assign Classroom Name</label>
                  <input
                    type="text"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                    placeholder="e.g. React Mastery - Batch A"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#f8fafc'
                    }}
                  />
                  <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>This will help you and the student identify this classroom.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from('classes_enrolled')
                          .update({
                            status: 'active',
                            classroom_name: classroomName
                          })
                          .eq('id', Number(approvalCourse.id))

                        if (error) throw error
                        setIsApprovedSuccessfully(true)
                      } catch (err) {
                        console.error('Error approving:', err)
                        alert('Failed to approve request: ' + (err.message || 'Unknown error'))
                      }
                    }}
                    style={{
                      flex: 1,
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Are you sure you want to reject this request?')) return;
                      try {
                        const { error } = await supabase
                          .from('classes_enrolled')
                          .update({ status: 'rejected' })
                          .eq('id', Number(approvalCourse.id))

                        if (error) throw error
                        alert('Request rejected.')
                        setShowApprovalModal(false)
                        setApprovalCourse(null)
                        window.location.reload()
                      } catch (err) {
                        console.error('Error rejecting:', err)
                        alert('Failed to reject request: ' + (err.message || 'Unknown error'))
                      }
                    }}
                    style={{
                      flex: 1,
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    Reject
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Student Profile Detail Modal */}
      {showStudentProfile && viewingStudent && (
        <div className="modal-overlay" onClick={() => setShowStudentProfile(false)}>
          <div className="modal-content-centered" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="progress-modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Student Profile</h2>
              <button className="progress-modal-close" onClick={() => setShowStudentProfile(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            {loadingProfile ? (
              <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ color: '#64748b' }}>Loading student profile...</p>
              </div>
            ) : (
              <StudentProfileTemplate
                profileData={{ ...viewingStudent, ...studentProfileData }}
                onClose={() => setShowStudentProfile(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* Class Progress Graph Modal */}
      {showProgressGraphModal && (
        <div className="modal-overlay" onClick={() => setShowProgressGraphModal(false)}>
          <div className="modal-content-centered" onClick={(e) => e.stopPropagation()}>
            <div className="progress-modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Classroom Progress</h2>
              <button className="progress-modal-close" onClick={() => setShowProgressGraphModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Actual Visual Graph Section */}
            <div className="svg-graph-container">
              <svg className="graph-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="graphGradientMentor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Stylized Progress Curve */}
                <path
                  className="graph-area"
                  style={{ fill: 'url(#graphGradientMentor)' }}
                  d={`M 0 120 L 0 100 C 100 90, 200 ${110 - (overallClassProgress * 0.8)}, 400 ${100 - (overallClassProgress * 0.9)} L 400 120 Z`}
                />
                <path
                  className="graph-path"
                  d={`M 0 100 C 100 90, 200 ${110 - (overallClassProgress * 0.8)}, 400 ${100 - (overallClassProgress * 0.9)}`}
                />

                {/* Data Points */}
                <circle className="graph-point" cx="0" cy="100" r="4" style={{ animationDelay: '0.1s' }} />
                <circle className="graph-point" cx="200" cy={110 - (overallClassProgress * 0.8)} r="4" style={{ animationDelay: '0.3s' }} />
                <circle className="graph-point" cx="400" cy={100 - (overallClassProgress * 0.9)} r="4" style={{ animationDelay: '0.5s' }} />
              </svg>

              <div style={{ position: 'absolute', top: '15px', right: '20px', textAlign: 'right' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#0ea5e9', display: 'block' }}>{overallClassProgress}%</span>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Mastery</span>
              </div>
            </div>

            {/* Overall Progress List Section */}
            <div className="comparison-chart-container">
              <div className="modal-summary-text" style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '700' }}>Overall Progress</h4>
                <p>Average {overallClassProgress}% completion across active classes</p>
              </div>
              {activeTaughtCourses.length > 0 ? (
                activeTaughtCourses.map((course, idx) => (
                  <div key={course.id || idx} className="chart-row">
                    <div className="chart-info">
                      <span className="chart-label">{course.title}</span>
                      <span className="chart-value">{course.progress || 0}%</span>
                    </div>
                    <div className="chart-bar-wrapper">
                      <div className="chart-fill" style={{ width: `${course.progress || 0}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '14px' }}>
                  No active classes to display.
                </div>
              )}
            </div>

            <div className="graph-container" style={{ padding: '0 0 20px' }}>
              <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', fontWeight: '600' }}>Detailed Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {uniqueTaughtCourses.filter(c => c.status === 'active').map((course, idx) => {
                  const progress = course.progress || 0;
                  return (
                    <div key={course.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{course.title}</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#0ea5e9' }}>{progress}%</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '3px',
                        width: '100%',
                        height: '24px',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        {[...Array(40)].map((_, i) => {
                          const isFilled = progress >= ((i + 1) / 40) * 100;
                          return (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                maxWidth: '6px',
                                height: '100%',
                                background: isFilled ? 'linear-gradient(180deg, #0ea5e9 0%, #06b6d4 100%)' : '#f1f5f9',
                                borderRadius: '3px',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isFilled ? 'scaleY(1)' : 'scaleY(0.6)',
                                boxShadow: isFilled ? '0 2px 8px rgba(14, 165, 233, 0.25)' : 'none',
                                opacity: isFilled ? 1 : 0.4
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MentorHome
