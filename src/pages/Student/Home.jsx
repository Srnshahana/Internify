import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import LiveClassroom from '../Learning/LiveClassroom.jsx'
import CourseDetail from './CourseDetail.jsx'
import MyCourses from './MyCourses.jsx'
import {
  staticEnrolledCourses,
  homeProgressData,
  homeUpcomingSessions
} from '../../data/staticData.js'

import { SearchIcon, CalendarIcon } from '../../components/Icons.jsx'
import adds1 from '../../assets/images/adds1.png'
import adds2 from '../../assets/images/adds2.png'
import adds3 from '../../assets/images/adds3.png'
import bannerImage from '../../assets/images/banner.png'
import Lottie from 'lottie-react'
import educationJson from '../../assets/lottie/banner.json'
import landingIllustration from '../../assets/images/landingpage-illlustration.png'
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import { useNavigate } from 'react-router-dom' // Added this import for useNavigate

function Home({ onNavigate, onMentorClick, setIsCourseDetailActive, setSearchQuery }) {
  const [activeTab, setActiveTab] = useState('My Classes')
  const { userProfile, studentProfile, enrolledCourses: liveEnrolledCourses, loading } = useDashboardData()
  const navigate = useNavigate()

  // Search state
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      if (setSearchQuery) {
        setSearchQuery(searchTerm.trim())
      }
      if (onNavigate) {
        onNavigate('Explore')
      }
    }
  }

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      if (setSearchQuery) {
        setSearchQuery(searchTerm.trim())
      }
      if (onNavigate) {
        onNavigate('Explore')
      }
    }
  }

  // Classroom/My Classes state
  const [activeCourseIndex, setActiveCourseIndex] = useState(0)
  const [activeCourse, setActiveCourse] = useState(null)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [showMyCourses, setShowMyCourses] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    if (setIsCourseDetailActive) {
      setIsCourseDetailActive(showCourseDetail)
    }
  }, [showCourseDetail, setIsCourseDetailActive])
  // Upcoming sessions data
  // Upcoming sessions data
  const upcomingSessions = homeUpcomingSessions

  // MERGED DATA for Stacked Cards:
  const allCombinedSessions = [
    { id: 't1', title: 'Design discussion', time: '10:30', period: 'AM', mentor: 'Sarah Chen', isToday: true, course: 'UI/UX Design' },
    { id: 't2', title: 'Send demo to PM', time: '06:00', period: 'PM', mentor: 'Mike Ross', isToday: true, course: 'Project Mgmt' },
    ...upcomingSessions.map(s => ({ ...s, isToday: false }))
  ]

  // Progress data - create data for 3 lines: All, Classroom 1, Classroom 2
  const allProgressData = homeProgressData.map(d => ({ week: d.week, value: d.completion }))

  // Generate progress data for Classroom 1 (React Advanced Patterns - currently at 65%)
  const classroom1ProgressData = [
    { week: 'W1', value: 15 },
    { week: 'W2', value: 25 },
    { week: 'W3', value: 35 },
    { week: 'W4', value: 45 },
    { week: 'W5', value: 52 },
    { week: 'W6', value: 58 },
    { week: 'W7', value: 62 },
    { week: 'W8', value: 65 },
  ]

  // Generate progress data for Classroom 2 (UI/UX Design Principles - currently at 40%)
  const classroom2ProgressData = [
    { week: 'W1', value: 8 },
    { week: 'W2', value: 15 },
    { week: 'W3', value: 22 },
    { week: 'W4', value: 28 },
    { week: 'W5', value: 32 },
    { week: 'W6', value: 35 },
    { week: 'W7', value: 38 },
    { week: 'W8', value: 40 },
  ]

  const progressLines = [
    { name: 'All', data: allProgressData, color: '#64748b', gradientId: 'progressGradient' },
    { name: 'Classroom 1', data: classroom1ProgressData, color: '#0ca5e9', gradientId: 'progressGradient1' },
    { name: 'Classroom 2', data: classroom2ProgressData, color: '#bae6fd', gradientId: 'progressGradient2' },
  ]

  const maxValue = 100
  const chartHeight = 180
  const chartWidth = 600
  const padding = { top: 15, right: 20, bottom: 35, left: 40 }
  const graphWidth = chartWidth - padding.left - padding.right
  const graphHeight = chartHeight - padding.top - padding.bottom

  // Upcoming Sessions state
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0)
  const [isDraggingSessions, setIsDraggingSessions] = useState(false)
  const [startYSessions, setStartYSessions] = useState(0)
  const [currentYSessions, setCurrentYSessions] = useState(0)
  const sessionsContainerRef = useRef(null)

  // Featured Sessions Carousel state
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const featuredSessionsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (featuredSessionsRef.current) {
        const scrollLeft = featuredSessionsRef.current.scrollLeft
        const width = featuredSessionsRef.current.offsetWidth
        const index = Math.round(scrollLeft / (width * 0.8)) // approx 80% width per card
        setCurrentFeaturedIndex(Math.min(index, 2)) // clamp to 0-2
      }
    }

    const ref = featuredSessionsRef.current
    if (ref) {
      ref.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Ad Banner state
  const ads = [
    { id: 1, image: adds1, title: 'Internify Ad 1' },
    { id: 2, image: adds2, title: 'Internify Ad 2' },
    { id: 3, image: adds3, title: 'Internify Ad 3' },
  ]
  const displayAds = [ads[ads.length - 1], ...ads, ads[0]]
  const [currentAdIndex, setCurrentAdIndex] = useState(1)
  const [isAdTransitioning, setIsAdTransitioning] = useState(true)
  const adCarouselTimerRef = useRef(null)




  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddListForm, setShowAddListForm] = useState(false)
  const [clickedDate, setClickedDate] = useState(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [dateEvents, setDateEvents] = useState([])
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Progress graph state - track active line(s)
  const [activeProgressLine, setActiveProgressLine] = useState('All') // 'All' shows all lines, otherwise shows only that line

  // Progress Overview Modal state
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [selectedProgressCard, setSelectedProgressCard] = useState(null) // 'learning-hours', 'assessment-status', 'registered-courses'

  // Home Drawer state (Starts collapsed, then expands)
  const [isHomeDrawerExpanded, setIsHomeDrawerExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHomeDrawerExpanded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)

  // New Modal states
  const [showUpcomingSessionsModal, setShowUpcomingSessionsModal] = useState(false)
  const [showProgressGraphModal, setShowProgressGraphModal] = useState(false)

  const EXPAND_DISTANCE = 80 // Reduced to ensure handle stays reachable

  const handleDrawerDragStart = (e) => {
    setIsDragging(true)
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setStartY(clientY)
  }

  const handleDrawerDragMove = (e) => {
    if (!isDragging) return
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const deltaY = clientY - startY

    // Calculate new drag position with bounds
    // If collapsed: can only drag up (negative deltaY)
    // If expanded: can only drag down (positive deltaY)
    if (!isHomeDrawerExpanded) {
      // Collapsed state: deltaY should be <= 0, but no more than -EXPAND_DISTANCE
      setDragY(Math.max(-EXPAND_DISTANCE, Math.min(0, deltaY)))
    } else {
      // Expanded state: deltaY should be >= 0, but no more than EXPAND_DISTANCE
      setDragY(Math.min(EXPAND_DISTANCE, Math.max(0, deltaY)))
    }
  }

  const handleDrawerDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = EXPAND_DISTANCE / 3

    if (!isHomeDrawerExpanded) {
      // If we dragged up enough, expand
      if (dragY < -threshold) {
        setIsHomeDrawerExpanded(true)
      }
    } else {
      // If we dragged down enough, collapse
      if (dragY > threshold) {
        setIsHomeDrawerExpanded(false)
      }
    }
    setDragY(0)
  }

  const toggleHomeDrawer = () => setIsHomeDrawerExpanded(!isHomeDrawerExpanded)

  // Map live enrolled courses via context data

  // Map live enrolled courses for display (context already provides transformed data)
  const liveCourses = liveEnrolledCourses.map((enrollment, idx) => {
    return {
      ...enrollment,
      id: enrollment.id || idx,
      classes: enrollment.sessions || [], // Alias sessions to classes for components expecting both
      assignmentsCount: enrollment.assignments?.length || 0
    }
  })

  const enrolledCourses = liveCourses.length > 0 ? liveCourses : staticEnrolledCourses
  const registeredCoursesCount = enrolledCourses.length

  // Calculate metrics for overview cards
  const learningHours = enrolledCourses.reduce((total, course) => {
    const hours = (course.classes || []).filter(c => c.completed).reduce((sum, cls) => {
      const match = cls.duration && typeof cls.duration === 'string' ? cls.duration.match(/(\d+)/) : null
      const minutes = match ? parseInt(match[1]) : 0
      return sum + (minutes / 60)
    }, 0)
    return total + hours
  }, 0)
  const totalLearningHours = 20
  const learningHoursProgress = Math.round((learningHours / totalLearningHours) * 100)

  const totalAssessments = enrolledCourses.reduce((total, course) => total + (course.assignmentsCount || 0), 0)
  const completedAssessments = enrolledCourses.reduce((total, course) => {
    const completed = (course.assignments || []).filter(a => a.status === 'Completed' || a.status === 'In Progress').length
    return total + completed
  }, 0)
  const assessmentProgress = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0

  // Ad Banner handlers
  const handleNextAd = () => {
    setIsAdTransitioning(true)
    setCurrentAdIndex((prev) => prev + 1)
  }

  const handlePrevAd = () => {
    setIsAdTransitioning(true)
    setCurrentAdIndex((prev) => prev - 1)
  }

  const handleAdTransitionEnd = () => {
    if (currentAdIndex >= displayAds.length - 1) {
      setIsAdTransitioning(false)
      setCurrentAdIndex(1)
    } else if (currentAdIndex <= 0) {
      setIsAdTransitioning(false)
      setCurrentAdIndex(displayAds.length - 2)
    }
  }

  useEffect(() => {
    adCarouselTimerRef.current = setInterval(() => {
      handleNextAd()
    }, 4000)
    return () => {
      if (adCarouselTimerRef.current) clearInterval(adCarouselTimerRef.current)
    }
  }, [currentAdIndex])


  // Upcoming Sessions handlers
  const handleSessionsTouchStart = (e) => {
    setIsDraggingSessions(true)
    setStartYSessions(e.touches[0].clientY)
    setCurrentYSessions(e.touches[0].clientY)
  }

  const handleSessionsTouchMove = (e) => {
    if (!isDraggingSessions) return
    setCurrentYSessions(e.touches[0].clientY)
  }

  const handleSessionsTouchEnd = () => {
    if (!isDraggingSessions) return
    const diff = startYSessions - currentYSessions
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSessionIndex < upcomingSessions.length - 1) {
        setCurrentSessionIndex(prev => prev + 1)
      } else if (diff < 0 && currentSessionIndex > 0) {
        setCurrentSessionIndex(prev => prev - 1)
      }
    }
    setIsDraggingSessions(false)
    setStartYSessions(0)
    setCurrentYSessions(0)
  }

  // Classroom carousel handlers - simple slider
  const handleCarouselScroll = (e) => {
    const container = e.target
    const scrollLeft = container.scrollLeft
    const containerWidth = container.offsetWidth
    const cardWidth = containerWidth / 3.2 // Approximate card width (33.33% minus gap)
    const gap = 16
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    const clampedIndex = Math.max(0, Math.min(newIndex, enrolledCourses.length - 1))
    if (clampedIndex !== activeCourseIndex) {
      setActiveCourseIndex(clampedIndex)
    }
  }

  const scrollToCard = (index) => {
    if (carouselRef.current) {
      const container = carouselRef.current
      const containerWidth = container.offsetWidth
      const cardWidth = containerWidth / 3.2
      const gap = 16
      const scrollPosition = index * (cardWidth + gap)
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' })
    }
  }



  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    return Array(5).fill('☆').map((star, i) => {
      if (i < full) return '★'
      if (i === full && half) return '½'
      return '☆'
    }).join('')
  }

  // Quick action handlers
  const handleBookSession = () => {
    if (onNavigate) {
      onNavigate('Calendar')
    }
  }

  const handleContinueLearning = () => {
    if (enrolledCourses.length > 0) {
      const courseToContinue = enrolledCourses[activeCourseIndex] || enrolledCourses[0]
      setActiveCourse(courseToContinue)
    }
  }

  const handleGiveFeedback = () => {
    if (onNavigate) {
      onNavigate('Notification')
    }
  }

  const handleViewCertifications = () => {
    if (onNavigate) {
      onNavigate('Profile')
    }
  }

  const handleViewStudyMaterials = () => {
    setShowMyCourses(true)
  }

  const handleJoinUpcomingSession = (session) => {
    // Try to find a matching enrolled course by title
    const matchedCourse = enrolledCourses.find((course) => {
      const courseTitle = course.title.toLowerCase()
      const sessionCourse = (session.course || '').toLowerCase()
      return courseTitle.includes(sessionCourse) || sessionCourse.includes(courseTitle)
    })

    if (matchedCourse) {
      setActiveCourse(matchedCourse)
    } else if (onNavigate) {
      // Fallback: open full calendar view
      onNavigate('Calendar')
    }
  }

  // Flatten assignments for a compact Tasks view
  const allAssignments = enrolledCourses.flatMap((course) =>
    (course.assignments || []).map((assignment) => ({
      ...assignment,
      courseTitle: course.title,
    })),
  )

  const pendingAssignments = allAssignments
    .filter((a) => a.status !== 'Completed')
    .slice(0, 3)

  // Function to get events for a specific date
  const getEventsForDate = (date) => {
    const events = []
    const dateStr = date.toISOString().split('T')[0] // Format: YYYY-MM-DD
    const dayOfMonth = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    // Check assignments with due dates
    allAssignments.forEach((assignment) => {
      if (assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate)
        if (
          dueDate.getDate() === dayOfMonth &&
          dueDate.getMonth() === month &&
          dueDate.getFullYear() === year
        ) {
          events.push({
            type: 'assignment',
            title: assignment.title,
            course: assignment.courseTitle,
            dueDate: assignment.dueDate,
            status: assignment.status,
            time: '11:59 PM', // Default deadline time
          })
        }
      }
    })

    // Check upcoming sessions (sample dates: 14, 19, 22, 23, 24)
    // In a real app, sessions would have actual dates
    if ([14, 19, 22, 23, 24].includes(dayOfMonth)) {
      if (dayOfMonth === 14) {
        events.push({
          type: 'session',
          title: 'React Advanced Patterns',
          mentor: 'Sarah Chen',
          time: '2:00 PM - 3:00 PM',
          location: 'Classroom 208',
        })
      } else if (dayOfMonth === 19) {
        events.push({
          type: 'session',
          title: 'UI/UX Design Review',
          mentor: 'Michael Torres',
          time: '10:00 AM - 11:00 AM',
          location: 'Classroom 105',
        })
      } else if (dayOfMonth >= 22 && dayOfMonth <= 24) {
        events.push({
          type: 'session',
          title: 'Mobile Application Development',
          mentor: 'Amelie Griffith',
          time: '10:00 AM - 11:30 AM',
          location: 'Classroom 208',
        })
      }
    }

    return events
  }

  // If My Courses screen is shown
  if (showMyCourses) {
    return (
      <MyCourses
        courses={enrolledCourses}
        onBack={() => setShowMyCourses(false)}
        onEnterClassroom={(course) => {
          setActiveCourse(course)
          setShowMyCourses(false)
        }}
        onMentorClick={onMentorClick}
      />
    )
  }

  // If course detail is shown
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
        }}
        onMentorClick={onMentorClick}
      />
    )
  }

  // If active course is selected, show LiveClassroom
  if (activeCourse) {
    return <LiveClassroom course={activeCourse} onBack={() => setActiveCourse(null)} userRole="student" />
  }
  // Format current date for the header
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  // Drawer state
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false)
  const [drawerTouchStart, setDrawerTouchStart] = useState(null)

  const handleDrawerTouchStart = (e) => {
    setDrawerTouchStart(e.touches[0].clientY)
  }

  const handleDrawerTouchEnd = (e) => {
    if (!drawerTouchStart) return
    const touchEnd = e.changedTouches[0].clientY
    const diff = drawerTouchStart - touchEnd

    // Dragged up -> Expand
    if (diff > 50) {
      setIsDrawerExpanded(true)
    }
    // Dragged down -> Collapse
    else if (diff < -50) {
      setIsDrawerExpanded(false)
    }
    setDrawerTouchStart(null)
  }

  const toggleDrawer = () => {
    setIsDrawerExpanded(!isDrawerExpanded)
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
            src={studentProfile?.profile_image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
            alt="Profile"
            className="dashboard-profile-img-v2"
          />
          <div className="dashboard-welcome-text-v2">
            <h1>Hi, {studentProfile?.name?.split(' ')[0] || 'Student'}</h1>
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
            placeholder="Search courses, mentors..."
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
                <h2 className="ad-banner-text">Let Internify match you with the right opportunity</h2>
                <button className="ad-banner-cta">Explore Now</button>
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
          <h3 className="dashboard-card-title-v2">Upcoming<br />Sessions</h3>
          <span className="material-symbols-outlined dashboard-card-arrow">arrow_outward</span>
        </div>

        <div className="dashboard-glass-card-v2" onClick={() => setShowProgressGraphModal(true)}>
          <div className="dashboard-card-icon-wrapper icon-green-v2">
            <span className="material-symbols-outlined">bar_chart</span>
          </div>
          <h3 className="dashboard-card-title-v2">Learning<br />Progress</h3>
          <span className="material-symbols-outlined dashboard-card-arrow">arrow_outward</span>
        </div>
      </section>



      <section className="dashboard-courses-section-v2">
        <div className="dashboard-section-header-v2">
          <h2 className="dashboard-section-title-v2">My Classes</h2>
          <span className="dashboard-view-all-v2" onClick={() => setShowMyCourses(true)}>View All</span>
        </div>

        <div className="dashboard-carousel-v2">
          {enrolledCourses.map((course, index) => (
            <div
              key={course.id}
              className="dashboard-course-card-v2"
              onClick={() => { setSelectedCourse(course); setShowCourseDetail(true); }}
            >
              <div className="course-card-v2" style={{ cursor: 'pointer' }}>
                <div className="course-thumb-v2" style={{ height: '160px' }}>
                  <img src={course.image} alt={course.title} />
                  <div className="course-tag-v2">{course.level || 'Course'}</div>
                </div>
                <div className="course-content-v2">
                  <h3 className="course-name-v2" style={{ fontSize: '1.1rem' }}>{course.title}</h3>
                  <div className="course-meta-v2">
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{course.progress}% Complete</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {pendingAssignments.length > 0 && (
        <section className="dashboard-section-v2" style={{ padding: '0 5% 2rem' }}>
          <div className="dashboard-section-header-v2">
            <h2 className="dashboard-section-title-v2">Assignments</h2>
          </div>
          <div className="assignments-list-home">
            {pendingAssignments.map((assignment) => (
              <div key={`${assignment.courseTitle}-${assignment.id}`} className="assignment-card-home" style={{ background: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div className="assignment-header-home">
                  <h3 className="assignment-title-home">{assignment.title}</h3>
                  <span className={`assignment-status-badge-home ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                    {assignment.status}
                  </span>
                </div>
                <p className="assignment-course-home">{assignment.courseTitle}</p>
                {assignment.dueDate && <p className="assignment-due-home">Due: {assignment.dueDate}</p>}
                <button
                  className="btn-secondary btn-small"
                  onClick={() => {
                    const course = enrolledCourses.find((c) => c.title === assignment.courseTitle)
                    if (course) { setSelectedCourse(course); setShowCourseDetail(true); }
                    else { setShowMyCourses(true); }
                  }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Sessions */}
      <div className="dashboard-section dashboard-featured-section-v2">
        <h2 className="dashboard-section-title-v2" style={{ marginBottom: '1rem' }}>Featured Sessions</h2>
        <div className="featured-sessions-carousel" ref={featuredSessionsRef} style={{ background: 'transparent' }}>
          <div className="featured-session-card" style={{ background: 'white' }}>
            <h3 className="featured-session-title">Free Consultation</h3>
            <p className="featured-session-description">Get a free consultation with Internify on any confusion about the platform.</p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">30 min</span>
              <span className="featured-session-price">Free</span>
            </div>
          </div>
          <div className="featured-session-card" style={{ background: 'white' }}>
            <h3 className="featured-session-title">Work Review</h3>
            <p className="featured-session-description">Get inputs to make your work better, be it a review or design inspiration.</p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">45 min</span>
              <span className="featured-session-price">$89</span>
            </div>
          </div>
          <div className="featured-session-card" style={{ background: 'white' }}>
            <h3 className="featured-session-title">Interview Prep</h3>
            <p className="featured-session-description">A mentor with hiring experience will act as a technical interviewer.</p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">60 min</span>
              <span className="featured-session-price">$99</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpcomingSessionsModal && (
        <div className="modal-overlay" onClick={() => setShowUpcomingSessionsModal(false)}>
          <div className="modal-content-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle-bar"></div>
            <h2 className="modal-title">Upcoming Sessions</h2>
            <div className="upcoming-sessions-list-modal">
              {homeUpcomingSessions.map((session) => (
                <div key={session.id} className="upcoming-session-card-modal">
                  <div className="session-time-badge">
                    <span className="session-time">{session.time}</span>
                    <span className="session-period">{session.period}</span>
                  </div>
                  <div className="session-info">
                    <h3 className="session-title">{session.title}</h3>
                    <p className="session-mentor">with {session.mentor}</p>
                  </div>
                  <button className="join-btn-small" onClick={() => handleJoinUpcomingSession(session)}>
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showProgressGraphModal && (
        <div className="modal-overlay" onClick={() => setShowProgressGraphModal(false)}>
          <div className="modal-content-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle-bar"></div>
            <h2 className="modal-title">Learning Progress</h2>
            <div className="graph-container">
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                <p style={{ color: '#94a3b8' }}>Progress Visualization</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home
