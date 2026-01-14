import { useState } from 'react'
import '../../App.css'
import { mentors, calendarSessions } from '../../data/staticData.js'

// Adapt student calendar sessions to mentor view (show as mentee sessions)
const mentorCalendarSessions = calendarSessions.map((s, index) => ({
  ...s,
  id: s.id || index + 1,
  title: s.title || 'Mentorship session',
  mentee: s.mentor || 'Student',
  joinLink: `https://meet.google.com/session-${s.id || index + 1}`,
}))

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddListForm, setShowAddListForm] = useState(false)
  const [clickedDate, setClickedDate] = useState(null)

  const sessions = mentorCalendarSessions

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekDaysFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Get current week dates
  const getCurrentWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = getCurrentWeekDates()
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM
  const timelineDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] // Full week for timeline

  // Sample data for timeline tasks
  const timelineTasks = [
    { id: 1, day: 'Monday', timeSlot: 14, title: 'React Advanced Patterns - Review', type: 'mentorship', mentee: 'Sherin', color: 'purple' },
    { id: 2, day: 'Tuesday', timeSlot: 10, title: 'UI/UX Design Feedback', type: 'review', mentee: 'Rahul', color: 'orange' },
    { id: 3, day: 'Wednesday', timeSlot: 13, title: 'DSA Practice Session', type: 'mentorship', mentee: 'Fatima', color: 'blue' },
    { id: 4, day: 'Thursday', timeSlot: 16, title: 'Portfolio Review', type: 'review', mentee: 'Priya', color: 'purple' },
    { id: 5, day: 'Friday', timeSlot: 14, title: 'Career Guidance', type: 'mentorship', mentee: 'Amit', color: 'purple' },
  ]

  // Map sessions to timeline grid
  const getSessionForSlot = (dayIndex, timeSlot) => {
    const dayName = timelineDays[dayIndex]
    const task = timelineTasks.find(t => t.day === dayName && t.timeSlot === timeSlot)
    return task ? { ...task, title: task.title, mentee: task.mentee } : null
  }

  const handleReschedule = (sessionId) => {
    console.log('Reschedule session:', sessionId)
  }

  const handleCancel = (sessionId) => {
    if (window.confirm('Are you sure you want to cancel this class?')) {
      console.log('Cancel session:', sessionId)
    }
  }

  const handleJoin = (sessionId) => {
    console.log('Join session:', sessionId)
  }

  return (
    <div className="calendar-dashboard-wrapper" >
      <div className="calendar-glass-card">
        <div className="calendar-header-elegant">
          <h2 className="calendar-month-title">{currentMonth}</h2>
          <div className="calendar-nav-actions">
            <button className="calendar-nav-btn-elegant" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="calendar-nav-btn-elegant" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div className="calendar-grid-section">
          <div className="calendar-weekdays-elegant">
            {weekDays.map(day => (
              <div key={day} className="calendar-weekday-label">{day}</div>
            ))}
          </div>

          <div className="calendar-grid-elegant">
            {(() => {
              const year = selectedDate.getFullYear()
              const month = selectedDate.getMonth()
              const firstDay = new Date(year, month, 1).getDay()
              const daysInMonth = new Date(year, month + 1, 0).getDate()
              const days = []

              for (let i = 0; i < firstDay; i++) days.push(null)
              for (let date = 1; date <= daysInMonth; date++) days.push(date)

              return days.map((date, index) => {
                if (date === null) return <div key={`empty-${index}`} className="calendar-day-elegant empty"></div>

                const isToday = date === new Date().getDate() &&
                  month === new Date().getMonth() &&
                  year === new Date().getFullYear()
                const hasEvent = [15, 16, 22, 23, 27].includes(date)
                const isSelected = clickedDate && date === clickedDate.getDate() &&
                  month === clickedDate.getMonth() &&
                  year === clickedDate.getFullYear()

                return (
                  <div
                    key={date}
                    className={`calendar-day-elegant ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setClickedDate(new Date(year, month, date))}
                  >
                    {date}
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>

      <div className="sessions-section-elegant">
        <h3 className="sessions-title-elegant">Upcoming Mentorship Sessions</h3>
        <div className="sessions-list-elegant">
          {sessions.map((session) => (
            <div key={session.id} className="session-card-elegant">
              <div className="session-main-content">
                <div className="session-time-box">
                  <span className="time-main">{session.time.split(' - ')[0]}</span>
                  <span className="time-sub">{session.time.split(' - ')[1]}</span>
                </div>

                <div className="session-info-elegant">
                  <h4>{session.course}</h4>
                  <div className="session-meta-elegant">
                    <span>{session.date}</span>
                    <span>• Mentee: {session.mentee}</span>
                  </div>
                </div>

                <div className="session-badge-wrapper">
                  <span className={`session-badge-elegant badge-${session.type}`}>
                    {session.type}
                  </span>
                </div>
              </div>

              <div className="session-actions-buttons">
                <button className="session-btn session-btn-secondary" onClick={() => handleReschedule(session.id)}>
                  Reschedule
                </button>
                <button className="session-btn session-btn-danger" onClick={() => handleCancel(session.id)}>
                  Cancel
                </button>
                <button className="session-btn session-btn-primary" onClick={() => handleJoin(session.id)}>
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar


