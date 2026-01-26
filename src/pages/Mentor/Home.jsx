import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import MyCourses from './MyCourses.jsx'
import CourseDetail from './CourseDetail.jsx'
import StudentRequests from './StudentRequests.jsx'
import PendingWork from './PendingWork.jsx'
import Messages from './Messages.jsx'
import Assessments from './Assessments.jsx'
import LiveClassroom from '../Learning/LiveClassroom.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import educationJson from '../../assets/lottie/banner.json'
import bannerImage from '../../assets/images/banner.png'
import adds1 from '../../assets/images/adds1.png'
import adds2 from '../../assets/images/adds2.png'
import adds3 from '../../assets/images/adds3.png'
import { SearchIcon, CalendarIcon } from '../../components/Icons.jsx'

function MentorHome({ onNavigate, setIsCourseDetailActive, onEnterClassroom, setIsLiveClassroomActive }) {
  const { userProfile, enrolledCourses: taughtCourses, loading } = useDashboardData()
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

  useEffect(() => {
    if (setIsCourseDetailActive) {
      setIsCourseDetailActive(showCourseDetail)
    }
  }, [showCourseDetail, setIsCourseDetailActive])

  // Unique the taught courses to avoid duplicates if multiple students are enrolled
  const uniqueTaughtCourses = taughtCourses ? Array.from(new Map(taughtCourses.map(c => [c.id, c])).values()) : []

  // New Modal states
  const [showUpcomingSessionsModal, setShowUpcomingSessionsModal] = useState(false)
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

  // Mock sessions for stacked cards (Mentors see their schedule)
  const allCombinedSessions = [
    { id: 's1', title: 'React Project Review', time: '10:00', period: 'AM', mentee: 'Sherin', isToday: true, course: 'React Advanced Patterns' },
    { id: 's2', title: 'Mock Interview', time: '02:30', period: 'PM', mentee: 'Rahul', isToday: true, course: 'DSA Mastery' },
    { id: 's3', title: 'Portfolio Feedback', time: '06:00', period: 'PM', mentee: 'Fatima', isToday: false, course: 'UI/UX Design' },
  ]
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

  if (loading) {
    return (
      <div className="dashboard-page-new" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#0ea5e9', fontWeight: '500' }}>Loading dashboard...</p>
      </div>
    )
  }

  if (showStudentRequests) return <StudentRequests onBack={() => setShowStudentRequests(false)} />
  if (showPendingWork) return <PendingWork onBack={() => setShowPendingWork(false)} />
  if (showMessages) return <Messages onBack={() => setShowMessages(false)} />
  if (activeCourse) return (
    <LiveClassroom
      course={activeCourse}
      onBack={() => {
        setActiveCourse(null)
        if (setIsLiveClassroomActive) setIsLiveClassroomActive(false)
      }}
      userRole="mentor"
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

  // Ad Banner handlers
  const handleNextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length)
  }

  const handleAdTransitionEnd = () => {
    // Basic cyclic transition for now to keep it simple and fix vertical stack
  }

  return (
    <div className="dashboard-page-new">
      <div
        className="home-main-content"
        style={{ paddingTop: '32px' }}
      >
        <div className="welcome-calendar-row">
          <div className="welcome-left-column">
            <section className="ad-banner-section dashboard-ads-new">
              <div className="ad-carousel-container" style={{ borderRadius: '16px' }}>
                <div
                  className="ad-track"
                  style={{
                    transform: `translateX(-${currentAdIndex * 100}%)`,
                    display: 'flex',
                    transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                    width: '100%'
                  }}
                >
                  {ads.map((ad, index) => (
                    <div key={`${ad.id}-${index}`} className="ad-slide" style={{ flex: '0 0 100%' }}>
                      <img src={ad.image} alt={ad.title} draggable="false" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px' }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="home-modal-triggers" style={{ marginTop: '24px' }}>
              <button className="home-full-width-btn" onClick={() => setShowUpcomingSessionsModal(true)}>
                <div className="btn-left">
                  <div className="btn-icon-wrapper blue">
                    <CalendarIcon className="btn-icon-svg" />
                  </div>
                  <span>Your Schedule</span>
                </div>
                <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <button className="home-full-width-btn" onClick={() => setShowStudentRequests(true)}>
                <div className="btn-left">
                  <div className="btn-icon-wrapper green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </div>
                  <span>Student Requests</span>
                </div>
                <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div className="my-classes-section">
              <div className="section-header-with-button">
                <p className="section-title">my Courses</p>
                <button className="view-all-btn-arrow" onClick={() => setShowMyCourses(true)} aria-label="View All">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

              <div className="classroom-carousel">
                {uniqueTaughtCourses && uniqueTaughtCourses.length > 0 ? (
                  uniqueTaughtCourses.map((course) => (
                    <div key={course.id} className="classroom-carousel-card program-card" onClick={() => { setSelectedCourse(course); setShowCourseDetail(true); }}>
                      <div className="program-card-image-wrapper">
                        <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} alt={course.title} className="program-card-image" />
                      </div>
                      <div className="program-card-content">
                        <h3 className="program-card-title">{course.title}</h3>
                        <div className="program-card-details">
                          <div className="program-card-rating">
                            <span className="program-rating-star">★</span>
                            <span className="program-rating-value">{course.rating || 4.8}</span>
                          </div>
                          <div className="program-card-meta">
                            <span className="program-card-level">{course.level || 'Expert'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', color: '#64748b' }}>No courses taught yet.</div>
                )}
              </div>

              <div className="fresher-jobs-banner" style={{ backgroundImage: `url(${bannerImage})`, marginTop: '32px' }}>
                <div className="fresher-jobs-text"></div>
                <div className="fresher-jobs-lottie">
                  <Lottie animationData={educationJson} loop={true} style={{ height: 150, paddingTop: '5px' }} />
                </div>
              </div>

              <div className="my-classes-actions">
                <button className="compact-action-btn" onClick={() => setShowPendingWork(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span>Pending Work</span>
                </button>
                <button className="compact-action-btn" onClick={() => setShowMessages(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Messages</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section featured-sessions-section">
        <h2 className="featured-sessions-title" style={{ paddingLeft: '16px' }}>Mentor Resources</h2>
        <div className="featured-sessions-carousel" ref={featuredRef}>
          <div className="featured-session-card">
            <h3 className="featured-session-title">Teaching Guide</h3>
            <p className="featured-session-description">Best practices for hosting engaging live sessions and providing effective feedback.</p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">PDF • 2MB</span>
            </div>
          </div>
          <div className="featured-session-card">
            <h3 className="featured-session-title">Platform Updates</h3>
            <p className="featured-session-description">New features for mentors to track student progress and manage attendance.</p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">Article • 5m read</span>
            </div>
          </div>
        </div>
        <div className="carousel-dots" style={{ marginTop: '16px' }}>
          {[0, 1].map((index) => (
            <div key={index} className={`carousel-dot ${index === currentFeaturedIndex ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions Modal */}
      {showUpcomingSessionsModal && (
        <div className="progress-modal-overlay" onClick={() => setShowUpcomingSessionsModal(false)}>
          <div className="progress-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="progress-modal-header">
              <h2 className="progress-modal-title">Your Schedule</h2>
              <button className="progress-modal-close" onClick={() => setShowUpcomingSessionsModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="progress-modal-body">
              <div className="stacked-sessions-wrapper">
                <div className="stacked-sessions-container"
                  onTouchStart={(e) => setStartYSessions(e.touches[0].clientY)}
                  onTouchEnd={(e) => {
                    const diff = startYSessions - e.changedTouches[0].clientY
                    if (Math.abs(diff) > 50) setCurrentSessionIndex(prev => (prev + (diff > 0 ? 1 : -1) + allCombinedSessions.length) % allCombinedSessions.length)
                  }}
                >
                  {allCombinedSessions.map((session, index) => {
                    let pos = 'hidden';
                    const diff = (index - currentSessionIndex + allCombinedSessions.length) % allCombinedSessions.length
                    if (diff === 0) pos = 'active'
                    else if (diff === 1) pos = 'next'
                    else if (diff === 2) pos = 'next-2'
                    return (
                      <div key={session.id} className={`stacked-session-card ${pos} ${session.isToday ? 'is-today' : ''}`}>
                        <div className="stacked-card-header">
                          <span className="stacked-card-label">{session.isToday ? 'Today' : 'Upcoming'}</span>
                          <span className="stacked-card-time">{session.time} {session.period}</span>
                        </div>
                        <h3 className="stacked-card-title">{session.title}</h3>
                        <p className="stacked-card-mentor">with {session.mentee}</p>
                        {pos === 'active' && <button className="stacked-card-join-btn">Start Session</button>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default MentorHome
