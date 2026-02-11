import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [clickedDate, setClickedDate] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const currentUserId = localStorage.getItem('auth_id')

  useEffect(() => {
    const fetchScheduledClasses = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('scheduled_classes')
          .select('*, courses(title)')
          .eq('mentor_id', currentUserId)
          .order('scheduled_date', { ascending: true })

        if (error) throw error

        if (data) {
          const mappedSessions = data.map(session => ({
            id: session.id,
            title: session.title,
            course: session.courses?.title || 'Live Class',
            date: new Date(session.scheduled_date).toLocaleDateString(),
            time: new Date(session.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mentee: 'Batch',
            type: 'upcoming',
            joinLink: session.meeting_link
          }))
          setSessions(mappedSessions)
        }
      } catch (error) {
        console.error('Error fetching scheduled classes:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentUserId) {
      fetchScheduledClasses()
    } else {
      setLoading(false)
    }
  }, [currentUserId])

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const handleJoin = (link) => {
    if (link) window.open(link, '_blank')
  }

  return (
    <div className="calendar-dashboard-wrapper" >
      <div className="calendar-glass-card">
        {/* Header - V2 Glass Style */}
        <header className="live-classroom-header-v2" style={{ background: 'linear-gradient(to right, #eff6ff, #dbeafe)', marginBottom: '24px', borderRadius: '16px' }}>
          <div className="live-header-title-v2" style={{ fontSize: '18px' }}>{currentMonth}</div>
          <div className="calendar-nav-actions">
            <button className="live-back-btn-v2" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="live-back-btn-v2" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </header>

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

                // Check if any session falls on this day
                const hasEvent = sessions.some(s => {
                  const sDate = new Date(s.date)
                  return sDate.getDate() === date && sDate.getMonth() === month && sDate.getFullYear() === year
                })

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
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }}>sync</span>
            <p style={{ marginTop: '10px' }}>Loading schedule...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '12px' }}>event_busy</span>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>No upcoming sessions</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Schedule a class from the Live Classroom</p>
          </div>
        ) : (
          <div className="sessions-list-elegant">
            {sessions.map((session) => (
              <div key={session.id} className="session-card-elegant">
                <div className="session-main-content">
                  <div className="session-time-box">
                    <span className="time-main">{session.time}</span>
                    <span className="time-sub">{session.date}</span>
                  </div>

                  <div className="session-info-elegant">
                    <h4>{session.title}</h4>
                    <div className="session-meta-elegant">
                      <span>{session.course}</span>
                    </div>
                  </div>

                  <div className="session-badge-wrapper">
                    <span className={`session-badge-elegant badge-${session.type}`}>
                      {session.type}
                    </span>
                  </div>
                </div>

                <div className="session-actions-buttons">
                  <button
                    className="session-btn session-btn-secondary"
                    onClick={() => console.log('Reschedule requested for:', session.id)}
                    style={{ marginRight: '8px' }}
                  >
                    Reschedule Request
                  </button>
                  <button className="session-btn session-btn-primary" onClick={() => handleJoin(session.joinLink)}>
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendar


