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
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function Home({ onNavigate, onMentorClick }) {
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

  // Classroom/My Classes state
  const [activeCourseIndex, setActiveCourseIndex] = useState(0)
  const [activeCourse, setActiveCourse] = useState(null)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [showMyCourses, setShowMyCourses] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const carouselRef = useRef(null)


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

  // Home Drawer state
  const [isHomeDrawerExpanded, setIsHomeDrawerExpanded] = useState(false)
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

  // Use global dashboard data from context
  const { studentProfile, enrolledCourses: liveEnrolledCourses, loading } = useDashboardData()

  // Map live enrolled courses for display (context already provides transformed data)
  const liveCourses = liveEnrolledCourses.map((enrollment, idx) => {
    return {
      id: enrollment.id || idx,
      title: enrollment.title || 'Unknown Course',
      mentor: enrollment.mentor || 'Expert Mentor',
      mentorImage: enrollment.mentorImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      image: enrollment.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      progress: enrollment.progress || 0,
      rating: enrollment.rating || 4.8,
      level: enrollment.level || 'Beginner',
      duration: 12,
      category: enrollment.category || 'General',
      classes: [],
      resources: [],
      assignments: [],
      assignmentsCount: 0
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
    <div className="dashboard-page-new">
      <div className="home-top-section">

        <div className="welcome-header-new">

          <img
            src={studentProfile?.profile_image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
            alt="User Profile"
            className="home-profile-pic"
          />
          <div className="welcome-text-container">
            {/* <h1 className="welcome-title-new">Welcome back, {studentProfile?.name?.split(' ')[0] || 'Student'}</h1> */}
            <p className="welcome-date-new">{currentDateFormatted}</p>
          </div>
        </div>
        <div className="home-search-section">
          <div className="home-search-bar">
            <SearchIcon className="search-icon-home" />
            <input
              type="text"
              placeholder="Search your courses, mentors or assignments..."
              className="home-search-input"
            />
          </div>
        </div>

      </div>

      <div
        className={`home-main-content ${isHomeDrawerExpanded ? 'is-expanded' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={{
          transform: isDragging ? `translateY(${isHomeDrawerExpanded ? -EXPAND_DISTANCE + dragY : dragY}px)` : ''
        }}
        onMouseMove={handleDrawerDragMove}
        onMouseUp={handleDrawerDragEnd}
        onMouseLeave={handleDrawerDragEnd}
        onTouchMove={handleDrawerDragMove}
        onTouchEnd={handleDrawerDragEnd}
      >
        <div
          className="home-drawer-handle"
          onMouseDown={handleDrawerDragStart}
          onTouchStart={handleDrawerDragStart}
          onClick={(e) => {
            // Only toggle if we didn't drag much
            if (Math.abs(dragY) < 5) toggleHomeDrawer()
          }}
        >
          <div className="handle-line"></div>
        </div>




        {/* top boxes */}
        <div className="welcome-calendar-row">
          <div className="welcome-left-column">
            <div className="dashboard-section progress-overview-section-new">
              {/* <div className="progress-overview-cards-new">
                <div
                  className="progress-overview-card"
                  onClick={() => {
                    setSelectedProgressCard('learning-hours')
                    setShowProgressModal(true)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="progress-card-content">
                    <h3 className="progress-card-title">Learning</h3>
                    <p className="progress-card-value">{Math.round(learningHours)}/{totalLearningHours}</p>
                    <div className="progress-card-bar">
                      <div className="progress-card-bar-fill" style={{ width: `${Math.min(learningHoursProgress, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div
                  className="progress-overview-card"
                  onClick={() => {
                    setSelectedProgressCard('assessment-status')
                    setShowProgressModal(true)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="progress-card-content">
                    <h3 className="progress-card-title">Assessments</h3>
                    <p className="progress-card-value">{completedAssessments}/{totalAssessments}</p>
                    <div className="progress-card-bar">
                      <div className="progress-card-bar-fill" style={{ width: `${Math.min(assessmentProgress, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                <div
                  className="progress-overview-card"
                  onClick={() => {
                    setSelectedProgressCard('registered-courses')
                    setShowProgressModal(true)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="progress-card-content">
                    <h3 className="progress-card-title">Courses</h3>
                    <p className="progress-card-value">{String(registeredCoursesCount).padStart(2, '0')}</p>
                  </div>
                </div>

                <div
                  className="progress-overview-card"
                  onClick={() => onNavigate('Calendar')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="progress-card-content">
                    <h3 className="progress-card-title">Upcoming</h3>
                    <p className="progress-card-value">{String(upcomingSessions.length).padStart(2, '0')}</p>
                  </div>
                </div>
              </div> */}




              {/* Ad Banner Section */}
              <section className="ad-banner-section dashboard-ads-new">
                <div className="ad-carousel-container" style={{ borderRadius: '16px' }}>
                  <div
                    className="ad-track"
                    onTransitionEnd={handleAdTransitionEnd}
                    style={{
                      transition: isAdTransitioning ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
                      transform: `translateX(-${currentAdIndex * 100}%)`,
                      display: 'flex',
                      width: '100%'
                    }}
                  >
                    {displayAds.map((ad, index) => {
                      const isActive = index === currentAdIndex
                      return (
                        <div
                          key={`${ad.id}-${index}`}
                          className={`ad-slide ${isActive ? 'active' : ''}`}
                          style={{ flex: '0 0 100%' }}
                        >
                          <img
                            src={ad.image}
                            alt={ad.title}
                            draggable="false"
                            style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '16px' }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>




              {/* High Fidelity Modal Triggers */}
              <div className="home-modal-triggers">
                <button className="home-full-width-btn" onClick={() => setShowUpcomingSessionsModal(true)}>
                  <div className="btn-left">
                    <div className="btn-icon-wrapper blue">
                      <CalendarIcon className="btn-icon-svg" />
                    </div>
                    <span>Upcoming Sessions</span>
                  </div>
                  <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                <button className="home-full-width-btn" onClick={() => setShowProgressGraphModal(true)}>
                  <div className="btn-left">
                    <div className="btn-icon-wrapper green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="20" x2="12" y2="10"></line>
                        <line x1="18" y1="20" x2="18" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="16"></line>
                      </svg>
                    </div>
                    <span>Learning Progress</span>
                  </div>
                  <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>








              <div className="my-classes-section">
                {/* <div className="section-header-with-button">
                  <h2 className="section-title">My Classes</h2>
                  <button className="view-all-btn-arrow" onClick={() => setShowMyCourses(true)} aria-label="View All">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div> */}
                <div className="classroom-carousel-section">
                  <div className="classroom-carousel" ref={carouselRef} onScroll={handleCarouselScroll}>
                    {enrolledCourses.map((course, index) => (
                      <div
                        key={course.id}
                        className={`classroom-carousel-card program-card ${index === activeCourseIndex ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCourse(course)
                          setShowCourseDetail(true)
                        }}
                      >
                        <div className="program-card-image-wrapper">
                          <img src={course.image} alt={course.title} className="program-card-image" />
                          <div className="program-card-gradient-overlay"></div>
                        </div>
                        <div className="program-card-content">
                          <h3 className="program-card-title">{course.title}</h3>
                          <span className="program-card-mentor-name">by {course.mentor}</span>

                          <div className="program-card-details">
                            <div className="program-card-rating">
                              <span className="program-rating-star">★</span>
                              <span className="program-rating-value">{course.rating}</span>
                            </div>
                            <div className="program-card-meta">
                              <span className="program-card-level">{course.level}</span>
                              <span className="program-card-separator">•</span>
                              <span className="program-card-duration">
                                {course.progress}% Completed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>




                {/* Fresher Jobs Banner */}
                <div className="fresher-jobs-banner" style={{ backgroundImage: `url(${bannerImage})` }}>
                  <div className="fresher-jobs-text">
                    {/* <h3>Ready for your first job?</h3> */}
                    {/* <p>Explore fresher-friendly jobs curated for you</p> */}
                    {/* <button className="fresher-jobs-btn">
                      Explore Jobs
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button> */}
                  </div>
                  <div className="fresher-jobs-lottie">
                    <Lottie animationData={educationJson} loop={true} style={{ height: 180 }} />
                  </div>
                </div>





                <div className="my-classes-actions">
                  <button className="compact-action-btn" onClick={handleViewCertifications}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <span>Certifications</span>
                  </button>
                  <button className="compact-action-btn" onClick={handleViewStudyMaterials}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Study Materials</span>
                  </button>
                </div>





                {pendingAssignments.length > 0 && (
                  <div className="dashboard-section assignments-section-home">
                    <div className="section-header-with-button">
                      <h2 className="section-title">Assignments & Tasks</h2>
                      <button className="view-all-btn-arrow" onClick={() => setShowMyCourses(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                    <div className="assignments-list-home">
                      {pendingAssignments.map((assignment) => (
                        <div key={`${assignment.courseTitle}-${assignment.id}`} className="assignment-card-home">
                          <div className="assignment-header-home">
                            <h3 className="assignment-title-home">{assignment.title}</h3>
                            <span className={`assignment-status-badge-home ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                              {assignment.status}
                            </span>
                          </div>
                          <p className="assignment-course-home">{assignment.courseTitle}</p>
                          {assignment.dueDate && (
                            <p className="assignment-due-home">
                              Due: {assignment.dueDate}
                            </p>
                          )}
                          <button
                            className="btn-secondary btn-small"
                            onClick={() => {
                              const course = enrolledCourses.find((c) => c.title === assignment.courseTitle)
                              if (course) {
                                setSelectedCourse(course)
                                setShowCourseDetail(true)
                              } else {
                                setShowMyCourses(true)
                              }
                            }}
                          >
                            Open
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


            </div>

            <div className="home-main-bottom-filler">
              {/* This area is simplified as logic moved to modals */}
            </div>
          </div>
        </div>

        <div className="dashboard-section featured-sessions-section">
          <h2 className="featured-sessions-title" style={{ paddingLeft: '16px' }}>Featured Sessions</h2>
          <div className="featured-sessions-carousel" ref={featuredSessionsRef}>
            <div className="featured-session-card">
              <h3 className="featured-session-title">Free Consultation</h3>
              <p className="featured-session-description">
                Get a free consultation with Internify on any confusion about the platform, course selection, career guidance, or how to get started.
              </p>
              <div className="featured-session-footer">
                <span className="featured-session-duration">Approx. 30 minutes</span>
                <span className="featured-session-price">Free</span>
              </div>
            </div>

          <div className="featured-session-card">
            <h3 className="featured-session-title">Work Review</h3>
            <p className="featured-session-description">
              In this session, a mentor will sit down with you, and give you some inputs to make your work better, be it a review, inputs on your design, or some inspiration.
            </p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">Approx. 45 minutes</span>
              <span className="featured-session-price">$89</span>
            </div>
          </div>

            <div className="featured-session-card">
              <h3 className="featured-session-title">Interview Preparation</h3>
              <p className="featured-session-description">
                Some big interviews coming up? In this 1-hour session, a mentor with hiring experience will act as a technical interviewer and ask you some standard hiring questions.
              </p>
              <div className="featured-session-footer">
                <span className="featured-session-duration">Approx. 60 minutes</span>
                <span className="featured-session-price">$99</span>
              </div>
            </div>
          </div>
          <div className="carousel-dots" style={{ marginTop: '16px' }}>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`carousel-dot ${index === currentFeaturedIndex ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>


      {/* Progress Overview Modal */}
      {
        showProgressModal && (
          <div className="progress-modal-overlay" onClick={() => setShowProgressModal(false)}>
            <div className="progress-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="progress-modal-header">
                <div className="progress-modal-title-section">
                  <div className="progress-modal-icon">
                    {selectedProgressCard === 'learning-hours' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    )}
                    {selectedProgressCard === 'assessment-status' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <polyline points="9 11 12 14 22 4"></polyline>
                      </svg>
                    )}
                    {selectedProgressCard === 'registered-courses' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                        <path d="M12 11l-2 2 2 2"></path>
                      </svg>
                    )}
                  </div>
                  <h2 className="progress-modal-title">
                    {selectedProgressCard === 'learning-hours' && 'Learning Hours'}
                    {selectedProgressCard === 'assessment-status' && 'Assessment Status'}
                    {selectedProgressCard === 'registered-courses' && 'Registered Courses'}
                  </h2>
                </div>
                <button className="progress-modal-close" onClick={() => setShowProgressModal(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="progress-modal-body">
                {selectedProgressCard === 'learning-hours' && (
                  <>
                    <div className="progress-modal-stat">
                      <div className="progress-modal-stat-value">{Math.round(learningHours)}/{totalLearningHours}</div>
                      <div className="progress-modal-stat-label">Hours Completed</div>
                      <div className="progress-modal-progress-bar">
                        <div className="progress-modal-progress-fill" style={{ width: `${Math.min(learningHoursProgress, 100)}%` }}></div>
                      </div>
                      <div className="progress-modal-stat-percentage">{learningHoursProgress}% Complete</div>
                    </div>
                    <div className="progress-modal-details">
                      <h3 className="progress-modal-details-title">Breakdown by Course</h3>
                      <div className="progress-modal-list">
                        {enrolledCourses.map((course) => {
                          const courseHours = course.classes
                            .filter(c => c.completed)
                            .reduce((sum, cls) => {
                              const match = cls.duration.match(/(\d+)/)
                              const minutes = match ? parseInt(match[1]) : 0
                              return sum + (minutes / 60)
                            }, 0)
                          return (
                            <div key={course.id} className="progress-modal-list-item">
                              <div className="progress-modal-list-item-header">
                                <span className="progress-modal-list-item-title">{course.title}</span>
                                <span className="progress-modal-list-item-value">{courseHours.toFixed(1)}h</span>
                              </div>
                              <div className="progress-modal-list-item-progress">
                                <div className="progress-modal-list-item-progress-fill" style={{ width: `${Math.min((courseHours / 50) * 100, 100)}%` }}></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="progress-modal-actions">
                      <button className="progress-modal-btn-primary" onClick={() => {
                        setShowProgressModal(false)
                        setShowMyCourses(true)
                      }}>
                        View All Courses
                      </button>
                    </div>
                  </>
                )}

                {selectedProgressCard === 'assessment-status' && (
                  <>
                    <div className="progress-modal-stat">
                      <div className="progress-modal-stat-value">{completedAssessments}/{totalAssessments}</div>
                      <div className="progress-modal-stat-label">Assessments Completed</div>
                      <div className="progress-modal-progress-bar">
                        <div className="progress-modal-progress-fill" style={{ width: `${Math.min(assessmentProgress, 100)}%` }}></div>
                      </div>
                      <div className="progress-modal-stat-percentage">{assessmentProgress}% Complete</div>
                    </div>
                    <div className="progress-modal-details">
                      <h3 className="progress-modal-details-title">Assessment Details</h3>
                      <div className="progress-modal-list">
                        {enrolledCourses.map((course) => (
                          <div key={course.id} className="progress-modal-list-item">
                            <div className="progress-modal-list-item-header">
                              <span className="progress-modal-list-item-title">{course.title}</span>
                              <span className="progress-modal-list-item-value">{course.assignments.length} assessments</span>
                            </div>
                            <div className="progress-modal-assessments-list">
                              {course.assignments.map((assignment) => (
                                <div key={assignment.id} className="progress-modal-assessment-item">
                                  <span className="progress-modal-assessment-title">{assignment.title}</span>
                                  <span className={`progress-modal-assessment-status ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                                    {assignment.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="progress-modal-actions">
                      <button className="progress-modal-btn-primary" onClick={() => {
                        setShowProgressModal(false)
                        if (onNavigate) onNavigate('Assessments')
                      }}>
                        View All Assessments
                      </button>
                    </div>
                  </>
                )}

                {selectedProgressCard === 'registered-courses' && (
                  <>
                    <div className="progress-modal-stat">
                      <div className="progress-modal-stat-value">{String(registeredCoursesCount).padStart(2, '0')}</div>
                      <div className="progress-modal-stat-label">Total Courses</div>
                    </div>
                    <div className="progress-modal-details">
                      <h3 className="progress-modal-details-title">Your Courses</h3>
                      <div className="progress-modal-list">
                        {enrolledCourses.map((course) => (
                          <div
                            key={course.id}
                            className="progress-modal-list-item progress-modal-course-item"
                            onClick={() => {
                              setSelectedCourse(course)
                              setShowProgressModal(false)
                              setShowCourseDetail(true)
                            }}
                          >
                            <div className="progress-modal-course-header">
                              <div className="progress-modal-course-info">
                                <h4 className="progress-modal-course-title">{course.title}</h4>
                                <p className="progress-modal-course-mentor">by {course.mentor}</p>
                              </div>
                              <div className="progress-modal-course-progress">
                                <span className="progress-modal-course-progress-value">{course.progress}%</span>
                              </div>
                            </div>
                            <div className="progress-modal-course-progress-bar">
                              <div className="progress-modal-course-progress-fill" style={{ width: `${course.progress}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="progress-modal-actions">
                      <button className="progress-modal-btn-primary" onClick={() => {
                        setShowProgressModal(false)
                        setShowMyCourses(true)
                      }}>
                        View All Courses
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      {/* Upcoming Sessions Modal */}
      {showUpcomingSessionsModal && (
        <div className="progress-modal-overlay" onClick={() => setShowUpcomingSessionsModal(false)}>
          <div className="progress-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="progress-modal-header">
              <h2 className="progress-modal-title">Upcoming Sessions</h2>
              <button className="progress-modal-close" onClick={() => setShowUpcomingSessionsModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="progress-modal-body">
              <div className="today-events-section">
                <h3 className="today-title">Today's Schedule</h3>
                <div className="today-events-list">
                  <div className="today-event-card">
                    <div className="event-icon sky-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                    </div>
                    <div className="event-details">
                      <p className="event-title">Design discussion</p>
                      <p className="event-time">10:30-11:15</p>
                    </div>
                  </div>
                  <div className="today-event-card">
                    <div className="event-icon sky-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div className="event-details">
                      <p className="event-title">Send demo to PM</p>
                      <p className="event-time">18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="upcoming-sessions-compact-new" style={{ marginTop: '24px' }}>
                <h3 className="today-title">All Sessions</h3>
                <div className="upcoming-sessions-list-compact">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="upcoming-session-item-compact">
                      <div className="session-time-compact">
                        <span className="session-time-value-compact">{session.time}</span>
                        <span className="session-time-period-compact">{session.period}</span>
                      </div>
                      <div className="session-info-compact">
                        <p className="session-course-compact">{session.course}</p>
                        <p className="session-mentor-compact">{session.mentor}</p>
                      </div>
                      <button className="btn-primary-compact" onClick={() => {
                        setShowUpcomingSessionsModal(false)
                        handleJoinUpcomingSession(session)
                      }}>Join</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Graph Modal */}
      {showProgressGraphModal && (
        <div className="progress-modal-overlay" onClick={() => setShowProgressGraphModal(false)}>
          <div className="progress-modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="progress-modal-header">
              <h2 className="progress-modal-title">Learning Progress</h2>
              <button className="progress-modal-close" onClick={() => setShowProgressGraphModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="progress-modal-body">
              <div className="dashboard-section progress-graph-section compact-graph" style={{ margin: 0, padding: 0, background: 'transparent', boxShadow: 'none' }}>
                <div className="progress-legend-buttons">
                  {progressLines.map((line) => {
                    const isActive = activeProgressLine === line.name
                    return (
                      <button
                        key={line.name}
                        className={`progress-legend-button ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          if (line.name === 'All') {
                            setActiveProgressLine('All')
                          } else {
                            if (activeProgressLine === line.name) {
                              setActiveProgressLine('All')
                            } else {
                              setActiveProgressLine(line.name)
                            }
                          }
                        }}
                      >
                        <div className="progress-legend-color" style={{ background: line.color }}></div>
                        <span className="progress-legend-label">{line.name}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="progress-chart-container">
                  <svg className="progress-chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
                    <defs>
                      {progressLines.map((line) => (
                        <linearGradient key={line.gradientId} id={line.gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={line.color} stopOpacity="0.2" />
                          <stop offset="100%" stopColor={line.color} stopOpacity="0.02" />
                        </linearGradient>
                      ))}
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((value) => {
                      const y = padding.top + graphHeight - (value / maxValue) * graphHeight
                      return (
                        <line
                          key={`grid-${value}`}
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + graphWidth}
                          y2={y}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          strokeDasharray="2 4"
                          opacity="0.4"
                        />
                      )
                    })}

                    {/* Y-axis labels */}
                    {[0, 25, 50, 75, 100].map((value) => {
                      const y = padding.top + graphHeight - (value / maxValue) * graphHeight
                      return (
                        <text
                          key={`label-${value}`}
                          x={padding.left - 12}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="11"
                          fill="#6b7280"
                          opacity="0.9"
                          fontWeight="400"
                        >
                          {value}%
                        </text>
                      )
                    })}

                    {/* Progress lines */}
                    {progressLines
                      .filter((line) => activeProgressLine === 'All' || activeProgressLine === line.name)
                      .map((line) => {
                        const points = line.data.map((d, i) => {
                          const x = padding.left + (i / (line.data.length - 1)) * graphWidth
                          const y = padding.top + graphHeight - (d.value / maxValue) * graphHeight
                          return { x, y, value: d.value }
                        })

                        const areaPath = `M ${points[0].x},${padding.top + graphHeight} ${points.map(p => `L ${p.x},${p.y}`).join(' ')} L ${points[points.length - 1].x},${padding.top + graphHeight} Z`
                        const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`

                        return (
                          <g key={line.name}>
                            <path d={areaPath} fill={`url(#${line.gradientId})`} className="progress-area" />
                            <path
                              d={linePath}
                              fill="none"
                              stroke={line.color}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="progress-line"
                              opacity="0.9"
                            />
                            {points.map((point, i) => (
                              <circle
                                key={`point-${line.name}-${i}`}
                                cx={point.x}
                                cy={point.y}
                                r="3.5"
                                fill={line.color}
                                className="progress-point"
                                opacity="1"
                              />
                            ))}
                          </g>
                        )
                      })}

                    {/* X-axis labels */}
                    {allProgressData.map((d, i) => {
                      const x = padding.left + (i / (allProgressData.length - 1)) * graphWidth
                      return (
                        <text
                          key={`xlabel-${i}`}
                          x={x}
                          y={chartHeight - padding.bottom + 20}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#6b7280"
                          opacity="0.9"
                          fontWeight="400"
                        >
                          {d.week}
                        </text>
                      )
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
