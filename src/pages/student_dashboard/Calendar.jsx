import { useState } from 'react'
import '../../App.css'
import { calendarSessions } from '../../Data.jsx'

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [clickedDate, setClickedDate] = useState(null)

  const sessions = calendarSessions || []

  // Clean data-driven arrays
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Calendar Grid Logic
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of current month
    for (let date = 1; date <= daysInMonth; date++) {
      days.push(date)
    }

    return days
  }

  const days = getDaysInMonth()

  const handleMonthChange = (direction) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction))
  }

  // Session action handlers
  const handleReschedule = (sessionId) => {
    console.log('Reschedule session:', sessionId)
  }

  const handleCancel = (sessionId) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      console.log('Cancel session:', sessionId)
    }
  }

  const handleJoin = (sessionId) => {
    console.log('Join session:', sessionId)
  }

  return (
    <div className="calendar-dashboard-wrapper" style={{ background: '#ffffff' }}>
      <div className="calendar-glass-card">


        <div className="calendar-header-elegant">
          <h2 className="calendar-month-title">{currentMonth}</h2>
          <div className="calendar-nav-actions">
            <button className="calendar-nav-btn-elegant" onClick={() => handleMonthChange(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="calendar-nav-btn-elegant" onClick={() => handleMonthChange(1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Section 2: Calendar Grid */}
        <div className="calendar-grid-section">
          <div className="calendar-weekdays-elegant">
            {weekDays.map(day => (
              <div key={day} className="calendar-weekday-label">{day}</div>
            ))}
          </div>

          <div className="calendar-grid-elegant">
            {days.map((date, index) => {
              if (date === null) return <div key={`empty-${index}`} className="calendar-day-elegant empty"></div>

              const isToday = date === new Date().getDate() &&
                selectedDate.getMonth() === new Date().getMonth() &&
                selectedDate.getFullYear() === new Date().getFullYear()

              // Mock Events logic for demo
              const hasEvent = [14, 19, 22].includes(date)
              const isSelected = clickedDate === date

              return (
                <div
                  key={date}
                  className={`calendar-day-elegant ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setClickedDate(date)}
                >
                  {date}
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 3: Upcoming Sessions List */}
        <div className="sessions-section-elegant">
          <h3 className="sessions-title-elegant">
            Upcoming Sessions
          </h3>

          <div className="sessions-list-elegant">
            {sessions.map((session) => (
              <div key={session.id} className="session-card-elegant">
                <div className="session-main-content">
                  <div className="session-time-box">
                    <span className="time-main">
                      {session.time && session.time.includes(' - ') ? session.time.split(' - ')[0] : session.time}
                    </span>
                    <span className="time-sub">
                      {session.time && session.time.includes(' - ') ? session.time.split(' - ')[1] : ''}
                    </span>
                  </div>

                  <div className="session-info-elegant">
                    <h4>{session.title}</h4>
                    <div className="session-meta-elegant">
                      <span>{session.date}</span>
                      {session.mentor && <span>• with {session.mentor}</span>}
                    </div>
                  </div>

                  <div className="session-badge-wrapper">
                    <span className={`session-badge-elegant badge-${session.type}`}>
                      {session.type}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="session-actions-buttons">
                  {session.type !== 'deadline' && (
                    <>
                      <button
                        className="session-btn session-btn-secondary"
                        onClick={() => handleReschedule(session.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Reschedule
                      </button>
                      <button
                        className="session-btn session-btn-danger"
                        onClick={() => handleCancel(session.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        Cancel
                      </button>
                      <button
                        className="session-btn session-btn-primary"
                        onClick={() => handleJoin(session.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                          <polyline points="10 17 15 12 10 7"></polyline>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        Join
                      </button>
                    </>
                  )}
                  {session.type === 'deadline' && (
                    <button className="session-btn session-btn-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
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
