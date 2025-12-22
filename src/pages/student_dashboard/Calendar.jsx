import { useState } from 'react'
import '../../App.css'
import { calendarSessions } from '../../Data.jsx'

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const sessions = calendarSessions

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const handleReschedule = (sessionId) => {
    // Handle reschedule logic
    console.log('Reschedule session:', sessionId)
    // You can add a modal or navigation here
  }

  const handleCancel = (sessionId) => {
    // Handle cancel logic
    if (window.confirm('Are you sure you want to cancel this class?')) {
      console.log('Cancel session:', sessionId)
      // You can add API call here to cancel the session
    }
  }

  const handleJoin = (sessionId) => {
    // Handle join logic
    console.log('Join session:', sessionId)
    // You can add navigation to live classroom here
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <p className="page-subtitle">Manage your sessions and important dates</p>
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
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days-mini">
              {Array.from({ length: 35 }, (_, i) => {
                const date = i + 1
                const isToday = date === new Date().getDate()
                return (
                  <div
                    key={i}
                    className={`calendar-day-mini ${isToday ? 'today' : ''}`}
                  >
                    {date <= 31 ? date : ''}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="calendar-events">
          <h2>Upcoming Sessions</h2>
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
                  {session.mentor && (
                    <p className="session-mentor">with {session.mentor}</p>
                  )}
                  <div className="session-type-badge">{session.type}</div>
                </div>
                <div className="session-actions">
                  {session.type !== 'deadline' && (
                    <>
                      <button className="session-action-btn session-btn-secondary" onClick={() => handleReschedule(session.id)}>
                        Reschedule
                      </button>
                      <button className="session-action-btn session-btn-danger" onClick={() => handleCancel(session.id)}>
                        Cancel Class
                      </button>
                      <button className="session-action-btn session-btn-primary" onClick={() => handleJoin(session.id)}>
                        Join Now
                      </button>
                    </>
                  )}
                  {session.type === 'deadline' && (
                    <button className="session-action-btn session-btn-primary">
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
