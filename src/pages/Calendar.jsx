import { useState } from 'react'
import '../App.css'

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const sessions = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      mentor: 'Sarah Chen',
      time: '2:00 PM - 3:00 PM',
      date: 'Today',
      type: 'mentorship',
    },
    {
      id: 2,
      title: 'UI/UX Design Review',
      mentor: 'Michael Torres',
      time: '10:00 AM - 11:00 AM',
      date: 'Tomorrow',
      type: 'review',
    },
    {
      id: 3,
      title: 'Data Science Office Hours',
      mentor: 'Emily Johnson',
      time: '4:00 PM - 5:00 PM',
      date: 'Today',
      type: 'office-hours',
    },
    {
      id: 4,
      title: 'Assignment Deadline',
      time: '11:59 PM',
      date: 'Friday',
      type: 'deadline',
    },
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

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
                <button className="session-action-btn">
                  {session.type === 'deadline' ? 'View' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
