import { useState } from 'react'
import '../../App.css'

import { calendarSessions as baseSessions } from '../../Data.jsx'

// Adapt student calendar sessions to mentor view (show as mentee sessions)
const mentorCalendarSessions = baseSessions.map((s, index) => ({
  ...s,
  id: s.id || index + 1,
  title: s.title || 'Mentorship session',
  mentee: s.mentor || 'Student',
  joinLink: `https://meet.google.com/session-${s.id || index + 1}`,
}))

function MentorCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const sessions = mentorCalendarSessions

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const handleJoin = (sessionId, joinLink) => {
    if (joinLink) {
      window.open(joinLink, '_blank')
    } else {
      console.log('Mentor join session:', sessionId)
    }
  }

  const handleReschedule = (sessionId) => {
    console.log('Mentor reschedule session:', sessionId)
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Mentor Calendar</h1>
        <p className="page-subtitle">See all your mentee sessions and important dates</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-sidebar">
          <div className="calendar-month-selector">
            <button>←</button>
            <h3>{currentMonth}</h3>
            <button>→</button>
          </div>

          <div className="calendar-mini">
            <div className="calendar-weekdays">
              {weekDays.map((day) => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
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

        <div className="calendar-events">
          <h2>Upcoming mentee sessions</h2>
          <div className="sessions-list">
            {sessions.map((session) => (
              <div key={session.id} className={`session-card ${session.type}`}>
                <div className="session-time">
                  <div className="session-time-main">{session.time.split(' - ')[0]}</div>
                  <div className="session-time-end">{session.time.split(' - ')[1]}</div>
                </div>
                <div className="session-content">
                  <div className="session-header">
                    <h4>{session.title}</h4>
                    <span className="session-date-badge">{session.date}</span>
                  </div>
                  {session.mentee && <p className="session-mentor">With {session.mentee}</p>}
                  <div className="session-type-badge">{session.type}</div>
                </div>
                <div className="session-actions">
                  <button
                    className="session-action-btn session-btn-secondary"
                    onClick={() => handleReschedule(session.id)}
                  >
                    Reschedule
                  </button>
                  <button 
                    className="session-action-btn session-btn-primary" 
                    onClick={() => handleJoin(session.id, session.joinLink)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Join now
                  </button>
                </div>
                {session.joinLink && (
                  <div className="session-join-link">
                    <a 
                      href={session.joinLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="join-link-text"
                    >
                      {session.joinLink}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorCalendar


