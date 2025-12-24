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

function MentorHome({ onNavigate }) {
  const [selectedSessionId, setSelectedSessionId] = useState(upcomingMentorSessions[0]?.id || null)
  const [showMyCourses, setShowMyCourses] = useState(false)
  const [showStudentRequests, setShowStudentRequests] = useState(false)
  const [showPendingWork, setShowPendingWork] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showAssessments, setShowAssessments] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null)
  
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

  return (
    <div className="dashboard-page desktop-layout">
      {/* Top Row: Welcome + Quick Actions */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="welcome-title">Welcome back, {mentorName}</h1>
          <p className="welcome-subtitle">Here's a quick snapshot of your mentees and sessions</p>
        </div>
        <div className="dashboard-quick-actions">
          <button className="quick-action-btn" onClick={() => setShowMyCourses(true)}>
            <span>My Courses</span>
          </button>
          <button className="quick-action-btn" onClick={() => {
            if (onNavigate) {
              onNavigate('Assessments')
            } else {
              setShowAssessments(true)
            }
          }}>
            <span>Assessments</span>
          </button>
          <button className="quick-action-btn" onClick={() => setShowPendingWork(true)}>
            <span>Review pending work</span>
          </button>
          <button className="quick-action-btn" onClick={() => setShowMessages(true)}>
            <span>Message mentees</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="dashboard-section progress-overview-section">
        <div className="progress-overview-cards">
          {mentorStats.map((stat) => (
            <div 
              key={stat.label} 
              className={`progress-overview-card ${stat.clickable ? 'clickable' : ''}`}
              style={{ borderTop: `4px solid ${stat.color}` }}
              onClick={stat.clickable ? () => setShowStudentRequests(true) : undefined}
            >
              <div className="progress-card-icon" style={{ fontSize: '32px' }}>
                {stat.icon}
              </div>
              <div className="progress-card-content">
                <h3 className="progress-card-title">{stat.label}</h3>
                <p className="progress-card-value" style={{ color: stat.color, fontSize: '28px', fontWeight: '700' }}>
                  {stat.value}
                </p>
              </div>
              {stat.clickable && (
                <div className="progress-card-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Left (My Classes + Sessions) | Right (Session Details) */}
      <div className="dashboard-main-grid">
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
                {mentorCourses.map((course, index) => (
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
                          <p className="carousel-mentor-role">Mentor</p>
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
                        <div className="carousel-students-info">
                          <span className="carousel-students-label">Students:</span>
                          <span className="carousel-students-count">{course.students}</span>
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
                <span>Assessments</span>
              </button>
              <button className="compact-action-btn" onClick={() => setShowMyCourses(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Manage Courses</span>
              </button>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="dashboard-section">
            <div className="section-header-with-button">
              <h2 className="section-title">Upcoming Sessions</h2>
              <button className="view-all-btn">View all</button>
            </div>
            <div className="sessions-list">
              {upcomingMentorSessions.map((session) => (
                <div
                  key={session.id}
                  className={`session-card-inline ${session.id === selectedSessionId ? 'active' : ''}`}
                  onClick={() => setSelectedSessionId(session.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="session-card-inline-header">
                    <div>
                      <p className="session-card-inline-course">{session.course}</p>
                      <p className="session-card-inline-mentor">With {session.mentee}</p>
                    </div>
                    <div className="session-card-inline-time">
                      <div>{session.time}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{session.date}</div>
                    </div>
                  </div>
                  <p className="session-card-inline-location">{session.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Session Details */}
        <div className="dashboard-sidebar">
          <div className="dashboard-section sidebar-section">
            <h2 className="section-title">Session Details</h2>
            {selectedSession ? (
              <div className="info-card">
                <div className="info-item">
                  <span className="info-label">Mentee</span>
                  <span className="info-value">{selectedSession.mentee}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Course</span>
                  <span className="info-value">{selectedSession.course}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time</span>
                  <span className="info-value">{selectedSession.time}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date</span>
                  <span className="info-value">{selectedSession.date}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Topic</span>
                  <span className="info-value">{selectedSession.topic}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Type</span>
                  <span className="info-value">{selectedSession.type}</span>
                </div>
                {selectedSession.joinLink && (
                  <div className="session-join-section">
                    <button 
                      className="btn-primary btn-full"
                      onClick={() => handleJoinSession(selectedSession.joinLink)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Join Session
                    </button>
                    <a 
                      href={selectedSession.joinLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="join-link-text"
                    >
                      {selectedSession.joinLink}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="page-subtitle">Select a session from the left to see details.</p>
            )}
          </div>

          {/* Calendar Section */}
          <div className="dashboard-section sidebar-section compact-calendar">
            <h2 className="section-title">Calendar</h2>
            <div className="calendar-mini">
              <div className="calendar-month-selector">
                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
                  ←
                </button>
                <h3>{currentMonth}</h3>
                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
                  →
                </button>
              </div>
              <div className="calendar-weekdays">
                {weekDays.map((day) => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
              </div>
              <div className="calendar-days-mini">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="calendar-day-mini empty"></div>
                  }
                  
                  const isToday = day === new Date().getDate() && 
                                  selectedDate.getMonth() === new Date().getMonth() &&
                                  selectedDate.getFullYear() === new Date().getFullYear()
                  
                  const hasSession = datesWithSessions.has(day)
                  
                  const dayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
                  const isSelected = selectedCalendarDate && isSameDay(dayDate, selectedCalendarDate)
                  
                  return (
                    <div
                      key={day}
                      className={`calendar-day-mini ${isToday ? 'today' : ''} ${hasSession ? 'has-session' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleDateClick(day)}
                      style={{ cursor: 'pointer' }}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Selected Date Sessions */}
          {selectedCalendarDate && selectedDateSessions.length > 0 && (
            <div className="dashboard-section sidebar-section">
              <h2 className="section-title">
                Sessions for {selectedCalendarDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </h2>
              <div className="date-sessions-list">
                {selectedDateSessions.map((session) => (
                  <div key={session.id} className="date-session-card">
                    <div className="date-session-header">
                      <div>
                        <h4 className="date-session-time">{session.time}</h4>
                        <p className="date-session-mentee">With {session.mentee}</p>
                        <p className="date-session-course">{session.course}</p>
                      </div>
                    </div>
                    <div className="date-session-topic">
                      <span className="session-type-badge">{session.type}</span>
                      <span>{session.topic}</span>
                    </div>
                    <div className="date-session-actions">
                      <button 
                        className="btn-secondary btn-small"
                        onClick={() => handleViewClassroom(session)}
                      >
                        View Classroom
                      </button>
                      <button 
                        className="btn-secondary btn-small"
                        onClick={() => handleReschedule(session.id)}
                      >
                        Reschedule
                      </button>
                      <button 
                        className="btn-danger btn-small"
                        onClick={() => handleCancel(session.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedCalendarDate && selectedDateSessions.length === 0 && (
            <div className="dashboard-section sidebar-section">
              <p className="page-subtitle" style={{ textAlign: 'center', padding: '16px' }}>
                No sessions scheduled for this date.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MentorHome
