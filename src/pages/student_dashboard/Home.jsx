import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import LiveClassroom from '../../liveClassroom.jsx'
import CourseDetail from './CourseDetail.jsx'
import MyCourses from './MyCourses.jsx'
import { 
  homeProgressData,
  homeUpcomingSessions
} from '../../Data.jsx'

function Home({ onNavigate, onMentorClick }) {
  // Upcoming sessions data
  const upcomingSessions = homeUpcomingSessions
  
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
    { name: 'All', data: allProgressData, color: '#6b7280', gradientId: 'progressGradient' },
    { name: 'Classroom 1', data: classroom1ProgressData, color: '#3b82f6', gradientId: 'progressGradient1' },
    { name: 'Classroom 2', data: classroom2ProgressData, color: '#8b5cf6', gradientId: 'progressGradient2' },
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

  // Classroom/My Classes state
  const [activeCourseIndex, setActiveCourseIndex] = useState(0)
  const [activeCourse, setActiveCourse] = useState(null)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [showMyCourses, setShowMyCourses] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const carouselRef = useRef(null)


  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })


  // Enrolled courses (from Classroom)
  const enrolledCourses = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      mentor: 'James Smith',
      mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      progress: 65,
      nextSession: 'Tomorrow, 2:00 PM',
      assignmentsCount: 3,
      category: 'Programming',
      level: 'Advanced',
      type: 'Live',
      rating: 4.0,
      description: 'Master advanced React patterns including hooks, context, and performance optimization.',
      classes: [
        { id: 1, title: 'Introduction to Advanced Patterns', duration: '45 min', type: 'Video', completed: true },
        { id: 2, title: 'Custom Hooks Deep Dive', duration: '60 min', type: 'Live', completed: true },
        { id: 3, title: 'Context API & State Management', duration: '50 min', type: 'Video', completed: false },
      ],
      resources: [
        { id: 1, title: 'React Patterns Guide', type: 'PDF', size: '2.4 MB' },
        { id: 2, title: 'Code Examples Repository', type: 'Link', url: 'https://github.com' },
      ],
      assignments: [
        { id: 1, title: 'Build Custom Hook Library', dueDate: '2024-01-15', status: 'In Progress' },
        { id: 2, title: 'Optimize React App Performance', dueDate: '2024-01-20', status: 'Pending' },
      ],
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      mentor: 'Michael Torres',
      mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      progress: 40,
      nextSession: 'Friday, 10:00 AM',
      assignmentsCount: 2,
      category: 'Design',
      level: 'Beginner',
      type: 'Hybrid',
      rating: 4.5,
      description: 'Learn user-centered design principles, create stunning interfaces, and build a portfolio.',
      classes: [
        { id: 1, title: 'Design Fundamentals', duration: '40 min', type: 'Video', completed: true },
        { id: 2, title: 'User Research Methods', duration: '50 min', type: 'Live', completed: false },
      ],
      resources: [
        { id: 1, title: 'Design System Guide', type: 'PDF', size: '1.8 MB' },
      ],
      assignments: [
        { id: 1, title: 'Create Design System', dueDate: '2024-01-18', status: 'In Progress' },
      ],
    },
  ]

  // Calculate metrics for overview cards
  const learningHours = enrolledCourses.reduce((total, course) => {
    const completedClasses = course.classes.filter(c => c.completed)
    const hours = completedClasses.reduce((sum, cls) => {
      // Extract minutes from duration string like "45 min" or "60 min"
      const match = cls.duration.match(/(\d+)/)
      const minutes = match ? parseInt(match[1]) : 0
      return sum + (minutes / 60)
    }, 0)
    return total + hours
  }, 0)
  const totalLearningHours = 200
  const learningHoursProgress = Math.round((learningHours / totalLearningHours) * 100)

  const totalAssessments = enrolledCourses.reduce((total, course) => total + course.assignmentsCount, 0)
  const completedAssessments = enrolledCourses.reduce((total, course) => {
    const completed = course.assignments.filter(a => a.status === 'Completed' || a.status === 'In Progress').length
    return total + completed
  }, 0)
  const assessmentProgress = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0

  const registeredCoursesCount = enrolledCourses.length


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

  return (
    <div className="dashboard-page-new">
      {/* Welcome Card with Illustration */}
      <div className="welcome-card-new">
        <div className="welcome-card-content">
          <h1 className="welcome-title-new">Welcome back, Sherin</h1>
          <p className="welcome-subtitle-new">Here's what's happening with your learning today</p>
          <div className="welcome-card-actions">
            <button className="welcome-card-btn" onClick={() => onNavigate && onNavigate('Explore')}>
              Explore more courses
            </button>
            <button className="welcome-card-btn" onClick={handleBookSession}>
              Book Session
            </button>
            <button className="welcome-card-btn" onClick={handleContinueLearning}>
              Continue Learning
            </button>
            <button className="welcome-card-btn" onClick={handleGiveFeedback}>
              Give Feedback
            </button>
          </div>
        </div>
        <div className="welcome-card-illustration">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Person on laptop */}
            <circle cx="100" cy="80" r="25" fill="rgba(255,255,255,0.3)" />
            <rect x="70" y="105" width="60" height="40" rx="5" fill="rgba(255,255,255,0.2)" />
            <rect x="75" y="110" width="50" height="30" rx="2" fill="rgba(255,255,255,0.4)" />
            {/* Books stack */}
            <rect x="30" y="140" width="40" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="35" y="148" width="30" height="8" rx="2" fill="rgba(255,255,255,0.25)" />
            <rect x="40" y="156" width="20" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
            {/* Abstract shapes */}
            <circle cx="160" cy="60" r="15" fill="rgba(255,255,255,0.15)" />
            <circle cx="170" cy="150" r="20" fill="rgba(255,255,255,0.1)" />
            <rect x="140" y="120" width="30" height="30" rx="5" fill="rgba(255,255,255,0.12)" transform="rotate(45 155 135)" />
          </svg>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="dashboard-section progress-overview-section-new">
        <div className="progress-overview-cards-new">
          {/* Learning Hours Card */}
          <div className="progress-overview-card">
            <div className="progress-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Learning hours</h3>
              <p className="progress-card-value">{Math.round(learningHours)}/{totalLearningHours}</p>
              <div className="progress-card-bar">
                <div className="progress-card-bar-fill" style={{ width: `${Math.min(learningHoursProgress, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Assessment Status Card */}
          <div className="progress-overview-card">
            <div className="progress-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <polyline points="9 11 12 14 22 4"></polyline>
              </svg>
            </div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Assessment status</h3>
              <p className="progress-card-value">{completedAssessments}/{totalAssessments}</p>
              <div className="progress-card-bar">
                <div className="progress-card-bar-fill" style={{ width: `${Math.min(assessmentProgress, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Registered Courses Card */}
          <div className="progress-overview-card">
            <div className="progress-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
                <path d="M12 11l-2 2 2 2"></path>
              </svg>
            </div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Registered courses</h3>
              <p className="progress-card-value">{String(registeredCoursesCount).padStart(2, '0')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (My Classes + Progress Graph) | Right (Calendar + Sessions) */}
      <div className="dashboard-main-grid-new">
        {/* Left Column: My Classes + Progress Graph */}
        <div className="dashboard-main-content">
          {/* My Classes Section */}
          <div className="my-classes-section">
            <div className="section-header-with-button">
              <h2 className="section-title">My Classes</h2>
              <button className="view-all-btn" onClick={() => setShowMyCourses(true)}>
                View All
              </button>
            </div>
            <div className="classroom-carousel-section">
              <div
                className="classroom-carousel"
                ref={carouselRef}
                onScroll={handleCarouselScroll}
              >
                {enrolledCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className={`classroom-carousel-card ${index === activeCourseIndex ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCourse(course)
                      setShowCourseDetail(true)
                    }}
                  >
                    <div className="carousel-card-content">
                      <div className="carousel-header-section">
                        <div className="carousel-mentor-photo">
                          <img src={course.mentorImage} alt={course.mentor} />
                        </div>
                        <div className="carousel-header-info">
                          <p className="carousel-mentor-name">{course.mentor}</p>
                          <p className="carousel-mentor-role">Mobile Application developer</p>
                        </div>
                      </div>
                      <div className="carousel-details-section">
                        <h3 className="carousel-course-title">{course.title}</h3>
                        <div className="carousel-rating">
                          <span className="carousel-stars">{renderStars(course.rating || 4.0)}</span>
                        </div>
                        <div className="carousel-course-meta">
                          <span className="carousel-category">{course.category}</span>
                          <span className="carousel-level">{course.level}</span>
                        </div>
                        <div className="carousel-session-info">
                          <span className="carousel-session-label">Next Session:</span>
                          <span className="carousel-session-time">{course.nextSession}</span>
                        </div>
                        <div className={`carousel-type-tag ${course.type.toLowerCase()}`}>{course.type}</div>
                      </div>
                      <div className="carousel-progress-container">
                        <div className="carousel-progress-bar">
                          <div
                            className="carousel-progress-fill"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="carousel-progress-text">{course.progress}%</span>
                      </div>
                      <div className="carousel-card-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Certifications and Study Materials as Small Buttons */}
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
          </div>

          {/* Progress Graph Section - Smaller */}
          <div className="dashboard-section progress-graph-section compact-graph">
            <div className="section-header-with-button">
              <h2 className="section-title">Your Learning Progress</h2>
              <button className="view-all-btn">View details</button>
            </div>
            <div className="progress-graph-wrapper">
              {/* Legend as Buttons */}
              <div className="progress-legend-buttons">
                {progressLines.map((line) => (
                  <button key={line.name} className="progress-legend-button">
                    <div className="progress-legend-color" style={{ background: line.color }}></div>
                    <span className="progress-legend-label">{line.name}</span>
                  </button>
                ))}
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
                  
                  {/* Progress lines - render each line */}
                  {progressLines.map((line) => {
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

        {/* Right Sidebar: Upcoming Sessions (Left) + Calendar (Right) */}
        <div className="dashboard-sidebar">
          <div className="sidebar-content-grid">
            {/* Upcoming Sessions - Left */}
            <div className="dashboard-section sidebar-section sidebar-sessions-compact">
              <div className="section-header-with-button">
                <h2 className="section-title">Upcoming Sessions</h2>
                <button className="view-all-btn" onClick={() => onNavigate && onNavigate('Calendar')}>
                  View all
                </button>
              </div>
              <div className="sidebar-sessions-list">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="sidebar-session-card">
                    <div className="sidebar-session-time">
                      <span className="sidebar-session-time-value">{session.time}</span>
                      <span className="sidebar-session-time-period">{session.period}</span>
                    </div>
                    <div className="sidebar-session-details">
                      <p className="sidebar-session-course">{session.course}</p>
                      <p className="sidebar-session-mentor">{session.mentor}</p>
                      <p className="sidebar-session-location">{session.location}</p>
                    </div>
                    <div className="sidebar-session-actions">
                      <button
                        className="btn-primary btn-small"
                        onClick={() => handleJoinUpcomingSession(session)}
                      >
                        Join Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Calendar - Right */}
            <div className="dashboard-section sidebar-section compact-calendar">
              <h2 className="section-title">Calendar</h2>
              <div className="calendar-mini">
                <div className="calendar-month-selector">
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>←</button>
                  <h3>{currentMonth}</h3>
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>→</button>
                </div>
                <div className="calendar-weekdays">
                  {weekDays.map((day) => (
                    <div key={day} className="calendar-weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days-mini">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = i + 1
                    const isToday = date === new Date().getDate()
                    return (
                      <div key={i} className={`calendar-day-mini ${isToday ? 'today' : ''}`}>
                        {date <= 31 ? date : ''}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Assignments / Tasks Section - Below Calendar and Sessions */}
          {pendingAssignments.length > 0 && (
            <div className="dashboard-section sidebar-section assignments-section">
              <div className="section-header-with-button">
                <h2 className="section-title">Assignments & Tasks</h2>
                <button className="view-all-btn" onClick={() => setShowMyCourses(true)}>
                  View all
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

      {/* Featured Sessions Section - At Bottom */}
      <div className="dashboard-section featured-sessions-section">
        <h2 className="featured-sessions-title">Featured Sessions</h2>
        <div className="featured-sessions-grid">
          <div className="featured-session-card">
            <h3 className="featured-session-title">Intro Call</h3>
            <p className="featured-session-description">
              If you're looking for a mentor, and you're just not sure about how this all works - this should be for you.
            </p>
            <div className="featured-session-footer">
              <span className="featured-session-duration">Approx. 30 minutes</span>
              <span className="featured-session-price">$39</span>
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
      </div>
    </div>
  )
}

export default Home
