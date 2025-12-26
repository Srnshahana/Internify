import { useState, useRef } from 'react'
import '../../App.css'
import MyCourses from './MyCourses.jsx'
import CourseDetail from './CourseDetail.jsx'
import StudentRequests from './StudentRequests.jsx'
import PendingWork from './PendingWork.jsx'
import Messages from './Messages.jsx'
import Assessments from './Assessments.jsx'
import LiveClassroom from '../../liveClassroom.jsx'

// Simple static data for mentor dashboard
const mentorName = 'Alex (Mentor)'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Stats cards data
const mentorStats = [
  { 
    label: 'Total Students', 
    value: '45',
    icon: '👥',
    color: '#3b82f6'
  },
  { 
    label: 'Active Courses', 
    value: '8',
    icon: '📚',
    color: '#8b5cf6'
  },
  { 
    label: 'Completed Sessions', 
    value: '234',
    icon: '✅',
    color: '#22c55e'
  },
  { 
    label: 'Average Rating', 
    value: '4.8',
    icon: '⭐',
    color: '#f59e0b'
  },
  { 
    label: 'Student Requests', 
    value: '5',
    icon: '📝',
    color: '#ec4899',
    clickable: true
  },
]

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (date) => {
  return date.toISOString().split('T')[0]
}

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

const upcomingMentorSessions = [
  {
    id: 1,
    time: '10:00 AM',
    date: 'Today',
    dateValue: new Date(), // Today
    mentee: 'Sherin',
    course: 'React Advanced Patterns',
    topic: 'React project review',
    type: '1:1',
    joinLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 2,
    time: '2:30 PM',
    date: 'Today',
    dateValue: new Date(), // Today
    mentee: 'Rahul',
    course: 'DSA Mastery',
    topic: 'DSA practice',
    type: 'Mock interview',
    joinLink: 'https://meet.google.com/xyz-uvwx-rst',
  },
  {
    id: 3,
    time: '6:00 PM',
    date: 'Tomorrow',
    dateValue: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    mentee: 'Fatima',
    course: 'UI/UX Design',
    topic: 'Portfolio feedback',
    type: 'Career',
    joinLink: 'https://meet.google.com/mno-pqrs-tuv',
  },
  {
    id: 4,
    time: '11:00 AM',
    date: '2024-03-20',
    dateValue: new Date('2024-03-20'),
    mentee: 'Priya',
    course: 'React Advanced Patterns',
    topic: 'Code review',
    type: '1:1',
    joinLink: 'https://meet.google.com/priya-session',
  },
  {
    id: 5,
    time: '3:00 PM',
    date: '2024-03-20',
    dateValue: new Date('2024-03-20'),
    mentee: 'Amit',
    course: 'DSA Mastery',
    topic: 'Algorithm practice',
    type: 'Mock interview',
    joinLink: 'https://meet.google.com/amit-session',
  },
  {
    id: 6,
    time: '4:00 PM',
    date: '2024-03-22',
    dateValue: new Date('2024-03-22'),
    mentee: 'Sara',
    course: 'UI/UX Design',
    topic: 'Design critique',
    type: 'Career',
    joinLink: 'https://meet.google.com/sara-session',
  },
]

// Mentor's courses with full details
const mentorCourses = [
  {
    id: 1,
    title: 'React Advanced Patterns',
    mentor: 'Alex (Mentor)',
    mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    students: 12,
    progress: 75,
    enrollments: 15,
    completed: 8,
    status: 'Active',
    category: 'Programming',
    level: 'Advanced',
    type: 'Live',
    rating: 4.8,
    description: 'Master advanced React patterns including hooks, context, and performance optimization.',
    nextSession: 'Tomorrow, 2:00 PM',
    sessionsCount: 12,
    classes: [
      { id: 1, title: 'Introduction to Advanced Patterns', duration: '45 min', type: 'Video', completed: true },
      { id: 2, title: 'Custom Hooks Deep Dive', duration: '60 min', type: 'Live', completed: true },
      { id: 3, title: 'Context API & State Management', duration: '50 min', type: 'Video', completed: false },
      { id: 4, title: 'Performance Optimization', duration: '55 min', type: 'Live', completed: false },
    ],
    enrolledStudents: [
      { id: 1, name: 'Sherin', progress: 85, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      { id: 2, name: 'Rahul', progress: 70, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { id: 3, name: 'Fatima', progress: 60, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
    ],
    assignments: [
      { id: 1, title: 'Build Custom Hook Library', dueDate: '2024-01-15', status: 'In Progress' },
      { id: 2, title: 'Optimize React App Performance', dueDate: '2024-01-20', status: 'Pending' },
    ],
    resources: [
      { id: 1, title: 'React Patterns Guide', type: 'PDF', size: '2.4 MB' },
      { id: 2, title: 'Code Examples Repository', type: 'Link', url: 'https://github.com' },
    ],
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    mentor: 'Alex (Mentor)',
    mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    students: 8,
    progress: 60,
    enrollments: 10,
    completed: 5,
    status: 'Active',
    category: 'Design',
    level: 'Beginner',
    type: 'Hybrid',
    rating: 4.5,
    description: 'Learn user-centered design principles, create stunning interfaces, and build a portfolio.',
    nextSession: 'Friday, 10:00 AM',
    sessionsCount: 8,
    classes: [
      { id: 1, title: 'Design Fundamentals', duration: '40 min', type: 'Video', completed: true },
      { id: 2, title: 'User Research Methods', duration: '50 min', type: 'Live', completed: false },
    ],
    enrolledStudents: [
      { id: 1, name: 'Priya', progress: 65, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      { id: 2, name: 'Amit', progress: 55, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    ],
    assignments: [
      { id: 1, title: 'Create Design System', dueDate: '2024-01-18', status: 'In Progress' },
    ],
    resources: [
      { id: 1, title: 'Design System Guide', type: 'PDF', size: '1.8 MB' },
    ],
  },
  {
    id: 3,
    title: 'DSA Mastery',
    mentor: 'Alex (Mentor)',
    mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    students: 20,
    progress: 85,
    enrollments: 25,
    completed: 15,
    status: 'Active',
    category: 'Programming',
    level: 'Intermediate',
    type: 'Live',
    rating: 4.9,
    description: 'Master data structures and algorithms with hands-on practice and interview preparation.',
    nextSession: 'Monday, 3:00 PM',
    sessionsCount: 15,
    classes: [
      { id: 1, title: 'Arrays and Strings', duration: '60 min', type: 'Live', completed: true },
      { id: 2, title: 'Linked Lists', duration: '55 min', type: 'Video', completed: true },
      { id: 3, title: 'Trees and Graphs', duration: '65 min', type: 'Live', completed: false },
    ],
    enrolledStudents: [
      { id: 1, name: 'Sara', progress: 90, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
      { id: 2, name: 'John', progress: 80, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    ],
    assignments: [
      { id: 1, title: 'Implement Binary Tree', dueDate: '2024-01-22', status: 'Pending' },
    ],
    resources: [
      { id: 1, title: 'DSA Cheat Sheet', type: 'PDF', size: '3.2 MB' },
    ],
  },
]

const recentCourses = mentorCourses.map(c => ({
  id: c.id,
  title: c.title,
  students: c.students,
  progress: c.progress,
  enrollments: c.enrollments,
  status: c.status,
}))

// Active/ongoing classrooms
const activeClassrooms = [
  {
    id: 1,
    courseTitle: 'React Advanced Patterns',
    sessionTitle: 'Custom Hooks Deep Dive',
    studentsCount: 12,
    activeStudents: 8,
    startTime: '2:00 PM',
    duration: '60 min',
    status: 'live',
    joinLink: 'https://meet.google.com/react-session',
    courseId: 1,
  },
  {
    id: 2,
    courseTitle: 'DSA Mastery',
    sessionTitle: 'Trees and Graphs',
    studentsCount: 20,
    activeStudents: 15,
    startTime: '3:00 PM',
    duration: '65 min',
    status: 'live',
    joinLink: 'https://meet.google.com/dsa-session',
    courseId: 3,
  },
  {
    id: 3,
    courseTitle: 'UI/UX Design Principles',
    sessionTitle: 'User Research Methods',
    studentsCount: 8,
    activeStudents: 6,
    startTime: '10:00 AM',
    duration: '50 min',
    status: 'scheduled',
    joinLink: 'https://meet.google.com/design-session',
    courseId: 2,
  },
]

function MentorHome({ onNavigate }) {
  const [selectedSessionId, setSelectedSessionId] = useState(upcomingMentorSessions[0]?.id || null)
  const [showMyCourses, setShowMyCourses] = useState(false)
  const [showStudentRequests, setShowStudentRequests] = useState(false)
  const [showPendingWork, setShowPendingWork] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showAssessments, setShowAssessments] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null)
  
  // Calendar state for event details
  const [clickedDate, setClickedDate] = useState(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [dateEvents, setDateEvents] = useState([])
  const [showAddListForm, setShowAddListForm] = useState(false)
  
  // Course/Classroom state
  const [activeCourseIndex, setActiveCourseIndex] = useState(0)
  const [activeCourse, setActiveCourse] = useState(null)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const carouselRef = useRef(null)

  const selectedSession = upcomingMentorSessions.find((s) => s.id === selectedSessionId) || upcomingMentorSessions[0]
  
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  
  // Get sessions for a specific date
  const getSessionsForDate = (date) => {
    if (!date) return []
    return upcomingMentorSessions.filter(session => {
      if (!session.dateValue) return false
      return isSameDay(session.dateValue, date)
    })
  }
  
  // Get dates that have sessions
  const getDatesWithSessions = () => {
    const dates = new Set()
    upcomingMentorSessions.forEach(session => {
      if (session.dateValue) {
        dates.add(session.dateValue.getDate())
      }
    })
    return dates
  }
  
  const datesWithSessions = getDatesWithSessions()
  
  // Get sessions for selected calendar date
  const selectedDateSessions = selectedCalendarDate ? getSessionsForDate(selectedCalendarDate) : []
  
  // Generate calendar days
  const getCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }
  
  const calendarDays = getCalendarDays()
  
  const handleDateClick = (day) => {
    if (day === null) return
    const clickedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
    setSelectedCalendarDate(clickedDate)
  }
  
  const handleReschedule = (sessionId) => {
    console.log('Reschedule session:', sessionId)
    // Add reschedule logic here
  }
  
  const handleCancel = (sessionId) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      console.log('Cancel session:', sessionId)
      // Add cancel logic here
    }
  }
  
  const handleViewClassroom = (session) => {
    console.log('View classroom for session:', session.id)
    // Navigate to classroom or open in new tab
    if (session.joinLink) {
      window.open(session.joinLink, '_blank')
    }
  }

  const handleJoinSession = (joinLink) => {
    if (joinLink) {
      window.open(joinLink, '_blank')
    }
  }

  // Classroom carousel handlers
  const handleCarouselScroll = (e) => {
    const container = e.target
    const scrollLeft = container.scrollLeft
    const containerWidth = container.offsetWidth
    const cardWidth = containerWidth / 3.2
    const gap = 16
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    const clampedIndex = Math.max(0, Math.min(newIndex, mentorCourses.length - 1))
    if (clampedIndex !== activeCourseIndex) {
      setActiveCourseIndex(clampedIndex)
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

  if (showStudentRequests) {
    return <StudentRequests onBack={() => setShowStudentRequests(false)} />
  }

  if (showPendingWork) {
    return <PendingWork onBack={() => setShowPendingWork(false)} />
  }

  if (showMessages) {
    return <Messages onBack={() => setShowMessages(false)} />
  }

  if (activeCourse) {
    return <LiveClassroom course={activeCourse} onBack={() => setActiveCourse(null)} userRole="mentor" />
  }

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

  if (showAssessments) {
    return <Assessments onBack={() => setShowAssessments(false)} />
  }

  if (showMyCourses) {
    return <MyCourses onBack={() => setShowMyCourses(false)} />
  }

  // Function to get events for a specific date (mentor sessions)
  const getEventsForDate = (date) => {
    const events = []
    const dayOfMonth = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    // Check upcoming sessions
    upcomingMentorSessions.forEach((session) => {
      if (session.dateValue) {
        const sessionDate = session.dateValue
        if (
          sessionDate.getDate() === dayOfMonth &&
          sessionDate.getMonth() === month &&
          sessionDate.getFullYear() === year
        ) {
          events.push({
            type: 'session',
            title: session.course,
            mentee: session.mentee,
            time: session.time,
            topic: session.topic,
            sessionType: session.type,
            joinLink: session.joinLink,
          })
        }
      }
    })

    return events
  }

  return (
    <div className="dashboard-page-new">
      {/* Welcome Card and Calendar Row */}
      <div className="welcome-calendar-row">
        {/* Left Column: Welcome Card + Stats Cards + My Classes + Pending Work */}
        <div className="welcome-left-column">
          {/* Welcome Card with Illustration */}
          <div className="welcome-card-new">
            <div className="welcome-card-content">
              <h1 className="welcome-title-new">Welcome back, {mentorName}</h1>
              <p className="welcome-subtitle-new">Here's what's happening with your mentoring today</p>
              <div className="welcome-card-actions">
                <button className="welcome-card-btn" onClick={() => setShowMyCourses(true)}>
                  Manage Courses
                </button>
                <button className="welcome-card-btn" onClick={() => setShowStudentRequests(true)}>
                  View Requests
                </button>
                <button className="welcome-card-btn" onClick={() => setShowPendingWork(true)}>
                  Review Work
                </button>
                <button className="welcome-card-btn" onClick={() => setShowMessages(true)}>
                  Messages
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

          {/* Stats Overview Cards */}
          <div className="dashboard-section progress-overview-section-new">
            <div className="progress-overview-cards-new">
              {mentorStats.map((stat) => (
                <div 
                  key={stat.label} 
                  className="progress-overview-card"
                  onClick={stat.clickable ? () => setShowStudentRequests(true) : undefined}
                  style={{ cursor: stat.clickable ? 'pointer' : 'default' }}
                >
                  <div className="progress-card-icon">
                    <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                  </div>
                  <div className="progress-card-content">
                    <h3 className="progress-card-title">{stat.label}</h3>
                    <p className="progress-card-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classrooms Section - Active/Ongoing */}
          <div className="my-classes-section">
            <div className="section-header-with-button">
              <h2 className="section-title">Classrooms</h2>
              <button className="view-all-btn-arrow" onClick={() => setShowMyCourses(true)} aria-label="View All">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            <div className="classroom-carousel-section">
              <div
                className="classroom-carousel"
                ref={carouselRef}
                onScroll={handleCarouselScroll}
              >
                {activeClassrooms.map((classroom, index) => {
                  const course = mentorCourses.find(c => c.id === classroom.courseId)
                  return (
                    <div
                      key={classroom.id}
                      className={`classroom-carousel-card ${index === activeCourseIndex ? 'active' : ''}`}
                      onClick={() => {
                        if (course) {
                          setSelectedCourse(course)
                          setShowCourseDetail(true)
                        }
                      }}
                    >
                      <div className="carousel-card-content">
                        <div className="carousel-header-section">
                          <div className="carousel-mentor-photo">
                            {course && <img src={course.mentorImage} alt={course.mentor} />}
                          </div>
                          <div className="carousel-header-info">
                            <p className="carousel-mentor-name">{course?.mentor || 'Mentor'}</p>
                            <p className="carousel-mentor-role">Mentor</p>
                          </div>
                          {classroom.status === 'live' && (
                            <div className="live-indicator">
                              <span className="live-dot"></span>
                              <span>Live</span>
                            </div>
                          )}
                        </div>
                        <div className="carousel-details-section">
                          <h3 className="carousel-course-title">{classroom.courseTitle}</h3>
                          <div className="carousel-session-info">
                            <span className="carousel-session-label">Session:</span>
                            <span className="carousel-session-time">{classroom.sessionTitle}</span>
                          </div>
                          <div className="carousel-session-info">
                            <span className="carousel-session-label">Time:</span>
                            <span className="carousel-session-time">{classroom.startTime} • {classroom.duration}</span>
                          </div>
                          <div className="carousel-students-info">
                            <span className="carousel-students-label">Active:</span>
                            <span className="carousel-students-count">{classroom.activeStudents}/{classroom.studentsCount} students</span>
                          </div>
                          <div className={`carousel-type-tag ${classroom.status}`}>
                            {classroom.status === 'live' ? 'Live Now' : 'Scheduled'}
                          </div>
                        </div>
                        <div className="carousel-actions-section">
                          {classroom.status === 'live' && (
                            <button
                              className="join-classroom-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (classroom.joinLink) {
                                  window.open(classroom.joinLink, '_blank')
                                } else if (course) {
                                  setActiveCourse(course)
                                }
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                              Join Classroom
                            </button>
                          )}
                          {classroom.status === 'scheduled' && (
                            <button
                              className="view-classroom-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (course) {
                                  setSelectedCourse(course)
                                  setShowCourseDetail(true)
                                }
                              }}
                            >
                              View Details
                            </button>
                          )}
                        </div>
                        <div className="carousel-card-arrow">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="my-classes-actions">
              <button className="compact-action-btn" onClick={() => {
                if (onNavigate) {
                  onNavigate('Assessments')
                } else {
                  setShowAssessments(true)
                }
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Assessments
              </button>
              <button className="compact-action-btn" onClick={() => setShowMyCourses(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Manage Courses
              </button>
            </div>
          </div>

          {/* Pending Work Section */}
          {mentorStats.find(s => s.label === 'Student Requests')?.value > 0 && (
            <div className="dashboard-section assignments-section-home">
              <div className="section-header-with-button">
                <h2 className="section-title">Student Requests</h2>
                <button className="view-all-btn-arrow" onClick={() => setShowStudentRequests(true)} aria-label="View All">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              <div className="assignments-list-home">
                <div className="assignment-card-home">
                  <div className="assignment-header-home">
                    <h3 className="assignment-title-home">New student enrollment requests</h3>
                    <span className="assignment-status-badge-home in-progress">
                      {mentorStats.find(s => s.label === 'Student Requests')?.value} pending
                    </span>
                  </div>
                  <p className="assignment-course-home">Review and approve student requests</p>
                  <button
                    className="btn-secondary btn-small"
                    onClick={() => setShowStudentRequests(true)}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Calendar + Today + Upcoming Sessions */}
        <div className="calendar-assignments-column">
          {/* Calendar */}
          <div className="dashboard-section compact-calendar-new welcome-calendar calendar-inspiration">
            <div className="calendar-month-header">
              <button
                className="calendar-nav-btn"
                onClick={() => {
                  setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))
                  setShowAddListForm(false)
                  setShowEventDetails(false)
                  setClickedDate(null)
                  setDateEvents([])
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <h3 className="calendar-month-name">{currentMonth}</h3>
              <button
                className="calendar-nav-btn"
                onClick={() => {
                  setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))
                  setShowAddListForm(false)
                  setShowEventDetails(false)
                  setClickedDate(null)
                  setDateEvents([])
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            <div className="calendar-weekdays-new">
              {weekDays.map((day) => (
                <div key={day} className="calendar-weekday-new">{day}</div>
              ))}
            </div>
            <div className="calendar-days-grid-new">
              {(() => {
                const year = selectedDate.getFullYear()
                const month = selectedDate.getMonth()
                const firstDay = new Date(year, month, 1).getDay()
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                const days = []
                
                for (let i = 0; i < firstDay; i++) {
                  days.push(null)
                }
                
                for (let date = 1; date <= daysInMonth; date++) {
                  days.push(date)
                }
                
                while (days.length < 35) {
                  days.push(null)
                }
                
                return days.map((date, i) => {
                  if (date === null) {
                    return <div key={i} className="calendar-day-new empty"></div>
                  }
                  
                  const isToday = date === new Date().getDate() && 
                                 month === new Date().getMonth() && 
                                 year === new Date().getFullYear()
                  
                  const dayDate = new Date(year, month, date)
                  const hasEvent = datesWithSessions.has(date)
                  const isEventRange = false
                  const isSelected = clickedDate && clickedDate.getDate() === date && 
                                    clickedDate.getMonth() === month && 
                                    clickedDate.getFullYear() === year
                  
                  return (
                    <div 
                      key={i} 
                      className={`calendar-day-new ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${isEventRange ? 'event-range' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        const clickedDateObj = new Date(year, month, date)
                        setClickedDate(clickedDateObj)
                        const events = getEventsForDate(clickedDateObj)
                        if (events.length > 0) {
                          setDateEvents(events)
                          setShowEventDetails(true)
                          setShowAddListForm(false)
                        } else {
                          setShowEventDetails(false)
                          setShowAddListForm(true)
                        }
                      }}
                    >
                      <span className="calendar-day-number">{date}</span>
                      {hasEvent && !isEventRange && <span className="event-dot"></span>}
                    </div>
                  )
                })
              })()}
            </div>

            {/* Event Details Modal - Shown when clicking a date with events */}
            {showEventDetails && clickedDate && dateEvents.length > 0 && (
              <div className="calendar-event-details-modal">
                <div className="calendar-event-details-header">
                  <div className="calendar-event-details-title-section">
                    <h3 className="calendar-event-details-title">
                      {clickedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                    <span className="calendar-event-details-count">{dateEvents.length} {dateEvents.length === 1 ? 'session' : 'sessions'}</span>
                  </div>
                  <button 
                    className="calendar-event-details-close"
                    onClick={() => {
                      setShowEventDetails(false)
                      setClickedDate(null)
                      setDateEvents([])
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="calendar-event-details-list">
                  {dateEvents.map((event, index) => (
                    <div key={index} className="calendar-event-details-item">
                      <div className="calendar-event-icon session-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div className="calendar-event-content">
                        <h4 className="calendar-event-item-title">{event.title}</h4>
                        <div className="calendar-event-meta">
                          <span className="calendar-event-time">{event.time}</span>
                          {event.mentee && <span className="calendar-event-mentor">with {event.mentee}</span>}
                          {event.topic && <span className="calendar-event-location">{event.topic}</span>}
                        </div>
                      </div>
                      <button 
                        className="calendar-event-action-btn"
                        onClick={() => event.joinLink && handleJoinSession(event.joinLink)}
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New List Form - Only shown when a date is clicked without events */}
            {showAddListForm && clickedDate && !showEventDetails && (
              <div className="calendar-add-list-form">
                <div className="add-list-header">
                  <h3 className="add-list-title">Add new session</h3>
                  <button 
                    className="add-list-menu-btn"
                    onClick={() => {
                      setShowAddListForm(false)
                      setClickedDate(null)
                      setDateEvents([])
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="add-list-inputs">
                  <input type="text" placeholder="Session title" className="add-list-input" />
                  <div className="add-list-input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Date" 
                      className="add-list-input" 
                      value={clickedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      readOnly
                    />
                  </div>
                  <div className="add-list-input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <input type="text" placeholder="Time" className="add-list-input" />
                  </div>
                  <input type="text" placeholder="Student name" className="add-list-input" />
                </div>
                <button 
                  className="add-list-submit-btn"
                  onClick={() => {
                    setShowAddListForm(false)
                    setClickedDate(null)
                    setDateEvents([])
                  }}
                >
                  Submit Session
                </button>
              </div>
            )}
          </div>

          {/* Today's Sessions Section */}
          <div className="today-events-section">
            <h3 className="today-title">Today</h3>
            <div className="today-events-list">
              {upcomingMentorSessions
                .filter(session => {
                  if (!session.dateValue) return false
                  return isSameDay(session.dateValue, new Date())
                })
                .slice(0, 2)
                .map((session) => (
                  <div key={session.id} className="today-event-card">
                    <div className="event-icon purple-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div className="event-details">
                      <p className="event-title">{session.course}</p>
                      <p className="event-time">{session.time} - {session.mentee}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Upcoming Sessions Below Calendar */}
          <div className="upcoming-sessions-compact-new">
            <div className="section-header-with-button">
              <h2 className="section-title-small">Upcoming Sessions</h2>
              <button className="view-all-btn-small" onClick={() => onNavigate && onNavigate('Calendar')}>
                View all
              </button>
            </div>
            <div className="upcoming-sessions-list-compact">
              {upcomingMentorSessions.slice(0, 2).map((session) => (
                <div key={session.id} className="upcoming-session-item-compact">
                  <div className="session-time-compact">
                    <span className="session-time-value-compact">{session.time}</span>
                    <span className="session-time-period-compact">{session.date}</span>
                  </div>
                  <div className="session-info-compact">
                    <p className="session-course-compact">{session.course}</p>
                    <p className="session-mentor-compact">with {session.mentee}</p>
                  </div>
                  <button
                    className="btn-primary-compact"
                    onClick={() => session.joinLink && handleJoinSession(session.joinLink)}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorHome
