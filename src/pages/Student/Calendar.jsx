import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [clickedDate, setClickedDate] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { enrolledCourses } = useDashboardData()

  useEffect(() => {
    const fetchStudentSessions = async () => {
      try {
        setLoading(true)
        if (!enrolledCourses || enrolledCourses.length === 0) {
          setSessions([])
          return
        }

        const courseIds = enrolledCourses.map(c => c.course_id)

        const { data, error } = await supabase
          .from('scheduled_classes')
          .select('*, courses(title), mentors_details(name)')
          .in('course_id', courseIds)
          .order('scheduled_date', { ascending: true })

        if (error) throw error

        if (data) {
          const mappedSessions = data.map(session => ({
            id: session.id,
            title: session.title,
            course: session.courses?.title || 'Live Class',
            mentor: session.mentors_details?.name || 'Mentor',
            date: new Date(session.scheduled_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(session.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'upcoming',
            joinLink: session.meeting_link
          }))
          setSessions(mappedSessions)
        }
      } catch (err) {
        console.error('Error fetching student sessions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentSessions()
  }, [enrolledCourses])

  const handleJoin = (link) => {
    if (link) window.open(link, '_blank')
  }

  // Restore Clean data-driven arrays
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

  return (
    <div className="calendar-dashboard-wrapper" >
      <div className="calendar-glass-card">
        {/* Header - synced with mentor style */}
        <header className="live-classroom-header-v2" style={{
          background: 'linear-gradient(to right, #eff6ff, #dbeafe)',
          marginBottom: '24px',
          borderRadius: '16px'
        }}>
          <div className="live-header-title-v2" style={{ fontSize: '18px' }}>{currentMonth}</div>
          <div className="calendar-nav-actions">
            <button className="live-back-btn-v2" onClick={() => handleMonthChange(-1)}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="live-back-btn-v2" onClick={() => handleMonthChange(1)}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </header>

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

              const year = selectedDate.getFullYear()
              const month = selectedDate.getMonth()
              const isToday = date === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()

              // Check live events from sessions
              const hasEvent = sessions.some(s => {
                const sDate = new Date(s.date)
                return sDate.getDate() === date &&
                  sDate.getMonth() === month &&
                  sDate.getFullYear() === year
              })

              const isSelected = clickedDate &&
                clickedDate.getDate() === date &&
                clickedDate.getMonth() === month &&
                clickedDate.getFullYear() === year

              return (
                <div
                  key={date}
                  className={`calendar-day-elegant ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setClickedDate(new Date(year, month, date))}
                >
                  {date}
                </div>
              )
            })}
          </div>
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
                    {session.time}
                  </span>
                  <span className="time-sub">
                    {session.date}
                  </span>
                </div>

                <div className="session-info-elegant">
                  <h4>{session.title}</h4>
                  <div className="session-meta-elegant">
                    <span>{session.course}</span>
                    <span>• with {session.mentor}</span>
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
                      onClick={() => console.log('Reschedule requested for:', session.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                      Reschedule
                    </button>
                    <button
                      className="session-btn session-btn-primary"
                      onClick={() => handleJoin(session.joinLink)}
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
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Calendar
