import { useState } from 'react'
import '../../App.css'
import { calendarSessions } from '../../Data.jsx'

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
    <div className="calendar-page-inspiration">
      {/* Left Panel - Timeline Grid */}
      <div className="calendar-timeline-panel">
        <div className="timeline-header">
          <h1 className="timeline-title">Calendar</h1>
          <div className="timeline-header-icons">
            <button className="timeline-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button className="timeline-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button className="timeline-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <button className="timeline-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="timeline-grid">
          {/* Row Headers (Time Slots) */}
          <div className="timeline-row-headers">
            {timeSlots.map((hour) => (
              <div key={hour} className="timeline-time-slot">
                {hour}
              </div>
            ))}
          </div>

          {/* Grid Content */}
          <div className="timeline-grid-content">
            {weekDaysFull.slice(0, 4).map((day, dayIndex) => (
              <div key={day} className="timeline-column">
                <div className="timeline-column-header">{day}</div>
                <div className="timeline-column-cells">
                  {timeSlots.map((hour) => {
                    const session = getSessionForSlot(dayIndex, hour)
                    const isCurrentTime = dayIndex === 0 && hour === 14 // Example: Monday 2 PM
                    
                    return (
                      <div 
                        key={`${day}-${hour}`} 
                        className={`timeline-cell ${isCurrentTime ? 'current-time' : ''}`}
                      >
                        {session && (
                          <div className={`timeline-task-card task-${session.type || 'mentorship'}`}>
                            <div className="task-color-bar"></div>
                            <div className="task-content">
                              <h4 className="task-title">{session.title}</h4>
                              {session.mentee && (
                                <div className="task-avatars">
                                  <div className="task-avatar"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Time Indicator */}
        <div className="timeline-current-indicator"></div>
      </div>

      {/* Right Panel - Calendar & Add New List */}
      <div className="calendar-panel-inspiration">
        {/* Search Bar */}
        <div className="calendar-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Search" className="calendar-search-input" />
        </div>

        {/* Monthly Calendar */}
        <div className="calendar-month-header">
          <h3 className="calendar-month-name">{currentMonth}</h3>
          <div className="calendar-nav-buttons">
            <button 
              className="calendar-nav-btn" 
              onClick={() => {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))
                setShowAddListForm(false)
                setClickedDate(null)
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              className="calendar-nav-btn" 
              onClick={() => {
                setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))
                setShowAddListForm(false)
                setClickedDate(null)
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
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
            if (days.length > 35 && days.length < 42) {
              while (days.length < 42) {
                days.push(null)
              }
            }

            return days.map((date, i) => {
              if (date === null) {
                return <div key={i} className="calendar-day-new empty"></div>
              }
              
              const isToday = date === new Date().getDate() && 
                             month === new Date().getMonth() && 
                             year === new Date().getFullYear()
              const hasEvent = [15, 16, 22, 23, 27].includes(date)
              const isSelected = clickedDate && date === clickedDate.getDate() && 
                                month === clickedDate.getMonth() && 
                                year === clickedDate.getFullYear()
              
              return (
                <div 
                  key={i} 
                  className={`calendar-day-new ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    const clickedDateObj = new Date(year, month, date)
                    setClickedDate(clickedDateObj)
                    setShowAddListForm(true)
                  }}
                >
                  <span className="calendar-day-number">{date}</span>
                  {hasEvent && !isToday && <span className="event-dot"></span>}
                </div>
              )
            })
          })()}
        </div>

        {/* Add New List Form */}
        {showAddListForm && clickedDate && (
          <div className="calendar-add-list-form">
            <div className="add-list-header">
              <h3 className="add-list-title">Add new session</h3>
              <button 
                className="add-list-menu-btn"
                onClick={() => {
                  setShowAddListForm(false)
                  setClickedDate(null)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="add-list-inputs">
              <input type="text" placeholder="Title" className="add-list-input" />
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
              }}
            >
              Submit Session
            </button>
          </div>
        )}

        {/* Sessions List */}
        <div className="calendar-sessions-list">
          <h2 className="sessions-list-title">Upcoming Sessions</h2>
          <div className="sessions-list-content">
            {sessions.map((session) => (
              <div key={session.id} className={`session-card-inspiration ${session.type}`}>
                <div className="session-time-inspiration">
                  <div className="session-time-main">{session.time.split(' - ')[0]}</div>
                  <div className="session-time-end">{session.time.split(' - ')[1]}</div>
                </div>
                <div className="session-content-inspiration">
                  <div className="session-header-inspiration">
                    <h4>{session.title}</h4>
                    <span className="session-date-badge">{session.date}</span>
                  </div>
                  {session.mentee && (
                    <p className="session-mentor">with {session.mentee}</p>
                  )}
                  <div className="session-type-badge">{session.type}</div>
                </div>
                <div className="session-actions-inspiration">
                  {session.type !== 'deadline' && (
                    <>
                      <button className="session-action-btn session-btn-secondary" onClick={() => handleReschedule(session.id)}>
                        Reschedule
                      </button>
                      <button className="session-action-btn session-btn-danger" onClick={() => handleCancel(session.id)}>
                        Cancel
                      </button>
                      <button className="session-action-btn session-btn-primary" onClick={() => handleJoin(session.id)}>
                        Join
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


