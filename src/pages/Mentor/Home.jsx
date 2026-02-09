import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import MyCourses from './MyCourses.jsx'
import CourseDetail from './CourseDetail.jsx'
import StudentRequests from './StudentRequests.jsx'
import PendingWork from './PendingWork.jsx'
import Messages from './Messages.jsx'
import Assessments from './Assessments.jsx'
import MentorLiveClassroom from './MentorLiveClassroom.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import educationJson from '../../assets/lottie/banner.json'
import landingIllustration from '../../assets/images/landingpage-illlustration.png'
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
  const [searchTerm, setSearchTerm] = useState('')

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
          <div className="dashboard-card-icon-wrapper icon-blue-v2">
            <CalendarIcon />
          </div>
          <h3 className="dashboard-card-title-v2">Your<br />Schedule</h3>
          <span className="material-symbols-outlined dashboard-card-arrow">arrow_outward</span>
        </div>

        <div className="dashboard-glass-card-v2" onClick={() => setShowStudentRequests(true)}>
          <div className="dashboard-card-icon-wrapper icon-green-v2">
            <span className="material-symbols-outlined">group_add</span>
          </div>
          <h3 className="dashboard-card-title-v2">Student<br />Requests</h3>
          <span className="material-symbols-outlined dashboard-card-arrow">arrow_outward</span>
        </div>

        <div className="dashboard-glass-card-v2" onClick={() => setShowPendingWork(true)}>
          <div className="dashboard-card-icon-wrapper icon-orange-v2" style={{ background: '#fff7ed', color: '#ea580c' }}>
            <span className="material-symbols-outlined">assignment_turned_in</span>
          </div>
          <h3 className="dashboard-card-title-v2">Pending<br />Work</h3>
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
                onClick={() => { setSelectedCourse(course); setShowCourseDetail(true); }}
              >
                <div className="course-card-v2" style={{ cursor: 'pointer' }}>
                  <div className="course-thumb-v2" style={{ height: '160px' }}>
                    <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} alt={course.title} />
                    <div className="course-tag-v2">{course.level || 'Expert'}</div>
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
