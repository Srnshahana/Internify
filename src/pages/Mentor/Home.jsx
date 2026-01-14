import { useState, useRef } from 'react'
import '../../App.css'
import MyCourses from './MyCourses.jsx'
import CourseDetail from './CourseDetail.jsx'
import StudentRequests from './StudentRequests.jsx'
import PendingWork from './PendingWork.jsx'
import Messages from './Messages.jsx'
import Assessments from './Assessments.jsx'
import LiveClassroom from '../Learning/LiveClassroom.jsx'

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
    <div className="landing-page-wrapper" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* 1. Hero Section - Welcome */}
      <section className="light-theme-hero-section" style={{
        padding: '60px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="page-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="light-theme-hero-badge" style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: '#e0f2fe',
            color: '#0284c7',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            Welcome Back
          </div>
          <h1 className="light-theme-hero-title" style={{
            fontSize: '36px',
            lineHeight: '1.2',
            color: '#0f172a',
            marginBottom: '16px'
          }}>
            Hello, <span className="highlight-text-blue" style={{ color: '#0ea5e9' }}>{mentorName}</span>
          </h1>
          <p className="light-theme-hero-description" style={{
            fontSize: '18px',
            color: '#64748b',
            marginBottom: '32px'
          }}>
            You have {activeClassrooms.length} active classes and {upcomingMentorSessions.filter(s => s.date === 'Today').length} sessions scheduled for today.
          </p>

          <div className="light-theme-hero-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="light-theme-btn-primary"
              onClick={() => setShowMyCourses(true)}
              style={{ padding: '16px', borderRadius: '12px', background: '#0ea5e9', color: 'white', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Manage Courses
            </button>
            <button className="light-theme-btn-outline"
              onClick={() => setShowStudentRequests(true)}
              style={{ padding: '16px', borderRadius: '12px', background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              View Requests {mentorStats.find(s => s.label === 'Student Requests')?.value > 0 && `(${mentorStats.find(s => s.label === 'Student Requests')?.value})`}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Stats Section (Vertical Stack for Mobile) */}
      <section className="light-theme-stats-section" style={{ padding: '40px 20px' }}>
        <div className="page-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="stats-container" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {mentorStats.slice(0, 4).map((stat, index) => (
              <div key={index} className="stat-item" style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Upcoming Sessions (Vertical Cards) */}
      <section className="light-theme-section" style={{ padding: '40px 20px' }}>
        <div className="page-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 className="light-theme-section-title" style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Upcoming Sessions</h2>
            <p className="section-subtitle" style={{ color: '#64748b' }}>Your schedule for the next few days</p>
          </div>

          <div className="programs-grid-elegant" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {upcomingMentorSessions.slice(0, 3).map((session) => {
              const course = mentorCourses.find(c => c.title === session.course)
              return (
                <div className="program-card" key={session.id} style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                }}>
                  <div className="program-card-image-wrapper" style={{ height: '200px', position: 'relative' }}>
                    <img
                      src={course?.mentorImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                      alt={session.course}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="program-card-category" style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'rgba(255,255,255,0.9)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0f172a'
                    }}>
                      {session.type}
                    </div>
                  </div>
                  <div className="program-card-content" style={{ padding: '24px' }}>
                    <div className="program-card-rating" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#64748b', fontSize: '14px' }}>
                      <span>📅 {session.date}</span>
                      <span>•</span>
                      <span>⏰ {session.time}</span>
                    </div>
                    <h3 className="program-card-title" style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{session.topic}</h3>
                    <p className="program-card-description" style={{ color: '#64748b', marginBottom: '24px' }}>
                      Mentee: {session.mentee} • Course: {session.course}
                    </p>
                    <button
                      className="light-theme-btn-primary"
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        background: '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleJoinSession(session.joinLink)}
                    >
                      Join Session
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="light-theme-btn-outline"
            onClick={() => onNavigate && onNavigate('Calendar')}
            style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}
          >
            View Full Calendar
          </button>
        </div>
      </section>

      {/* 4. Active Classrooms (Vertical Stack) */}
      <section className="light-theme-section" style={{ padding: '40px 20px', background: '#f1f5f9' }}>
        <div className="page-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 className="light-theme-section-title" style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Active Classrooms</h2>
            <p className="section-subtitle" style={{ color: '#64748b' }}>Manage your active courses</p>
          </div>

          <div className="simple-testimonials-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeClassrooms.map((classroom) => (
              <div key={classroom.id} className="simple-testimonial-card" style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h4 className="simple-testimonial-name" style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{classroom.courseTitle}</h4>
                  {classroom.status === 'live' && (
                    <span style={{ background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>LIVE</span>
                  )}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500', marginBottom: '4px' }}>Session: {classroom.sessionTitle}</p>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>{classroom.activeStudents}/{classroom.studentsCount} Students Active • {classroom.duration}</p>
                </div>

                {classroom.status === 'live' ? (
                  <button className="light-theme-btn-primary"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0ea5e9', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => handleJoinSession(classroom.joinLink)}
                  >
                    Enter Classroom
                  </button>
                ) : (
                  <button className="light-theme-btn-outline"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => setShowCourseDetail(true)}
                  >
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MentorHome
