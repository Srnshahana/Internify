import { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import '../../App.css'
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import RescheduleModal from '../../components/RescheduleModal'
import RescheduleResponseModal from '../../components/RescheduleResponseModal'

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [clickedDate, setClickedDate] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
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

        const authId = Number(localStorage.getItem('auth_id'))
        const { data, error } = await supabase
          .from('scheduled_classes')
          .select('*, courses(title), mentors_details(name), reschedule_request, reschedule_role, rescheduled_date, reschedule_reason, is_complete')
          .in('course_id', courseIds)
          .eq('student_id', authId)
          .order('scheduled_date', { ascending: true })

        if (error) throw error

        if (data) {
          const mappedSessions = data.map(session => {
            const match = (enrolledCourses || []).find(e => String(e.course_id) === String(session.course_id))
            return {
              id: session.id,
              title: session.title,
              classroom_name: match?.classroom_name,
              course: match?.classroom_name || session.courses?.title || 'Live Class',
              mentor: session.mentors_details?.name || 'Mentor',
              mentor_id: session.mentor_id,
              course_id: session.course_id,
              date: new Date(session.scheduled_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: new Date(session.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              scheduled_date: session.scheduled_date,
              reschedule_request: session.reschedule_request,
              reschedule_role: session.reschedule_role,
              rescheduled_date: session.rescheduled_date,
              reschedule_reason: session.reschedule_reason,
              is_complete: session.is_complete,
              type: 'upcoming',
              joinLink: session.meeting_link
            }
          })

          // Sort: Upcoming (is_complete: false) first, then Completed (is_complete: true)
          mappedSessions.sort((a, b) => {
            if (a.is_complete === b.is_complete) return 0;
            return a.is_complete ? 1 : -1;
          });

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

  // Auto-open reschedule modal if session ID is in localStorage
  useEffect(() => {
    if (!loading && sessions.length > 0) {
      const sessionIdToOpen = localStorage.getItem('open_reschedule_session_id');
      if (sessionIdToOpen) {
        const session = sessions.find(s => String(s.id) === String(sessionIdToOpen));
        if (session && session.reschedule_request) {
          if (session.reschedule_role === 'mentor') {
            handleResponseClick(session);
          } else {
            handleRescheduleClick(session);
          }
        }
        localStorage.removeItem('open_reschedule_session_id');
      }
    }
  }, [loading, sessions]);

  const handleJoin = (link) => {
    if (link) window.open(link, '_blank')
  }

  const handleRescheduleClick = (session) => {
    setSelectedSession(session)
    setShowRescheduleModal(true)
  }

  const handleRescheduleConfirm = async ({ newDate, newTime, reason }) => {
    if (!selectedSession) return

    try {
      const currentUserId = localStorage.getItem('auth_id')
      const scheduledDateTime = new Date(`${newDate}T${newTime}`)

      // Find the enrollment to get the chat_id
      const enrollment = enrolledCourses.find(c => c.course_id === selectedSession.course_id)
      const chatId = enrollment?.id || selectedSession.course_id // Fallback to course_id if enrollment matching is loose

      const rescheduleData = {
        original_session_id: selectedSession.id,
        new_date: newDate,
        new_time: newTime,
        reason: reason,
        status: 'pending',
        proposed_by: 'student'
      }

      // Send a message of type 'reschedule_request'
      const { error } = await supabase
        .from('messages')
        .insert([{
          chat_id: Number(chatId),
          session_id: selectedSession.id,
          role: 'student',
          sender_id: Number(currentUserId),
          content: JSON.stringify(rescheduleData),
          type: 'reschedule_request',
          read: false
        }])

      if (error) throw error

      // Update the scheduled_classes table to set reschedule_request = true, reschedule_role = 'student', and store proposed date
      const { error: updateError } = await supabase
        .from('scheduled_classes')
        .update({
          reschedule_request: true,
          reschedule_role: 'student',
          rescheduled_date: `${newDate}T${newTime}`
        })
        .eq('id', selectedSession.id)

      if (updateError) throw updateError

      // Update local state
      setSessions(prev => prev.map(s => s.id === selectedSession.id ? {
        ...s,
        reschedule_request: true,
        reschedule_role: 'student',
        rescheduled_date: `${newDate}T${newTime}`
      } : s))

      alert('Reschedule request sent to mentor!')
    } catch (err) {
      console.error('Error sending reschedule request:', err)
      alert('Failed to send reschedule request. Please try again.')
    }
  }

  const handleResponseClick = (session) => {
    setSelectedSession(session);
    setIsResponseModalOpen(true);
  }

  const handleRescheduleResponse = async (session, action) => {
    try {
      const isApproved = action === 'approve';

      // 1. Find and update the pending reschedule message
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', session.id)
        .eq('type', 'reschedule_request')
        .order('created_at', { ascending: false })
        .limit(1);

      if (msgError) throw msgError;

      if (messages && messages.length > 0) {
        const message = messages[0];
        const requestData = JSON.parse(message.content);
        const updatedContent = { ...requestData, status: isApproved ? 'approved' : 'rejected' };

        await supabase
          .from('messages')
          .update({ content: JSON.stringify(updatedContent) })
          .eq('id', message.id);
      }

      // 2. Update scheduled_classes
      const updatePayload = {
        reschedule_request: false,
        reschedule_role: null,
        rescheduled_date: null,
        reschedule_reason: null
      };

      if (isApproved && session.rescheduled_date) {
        updatePayload.scheduled_date = session.rescheduled_date;
      }

      const { error: schedError } = await supabase
        .from('scheduled_classes')
        .update(updatePayload)
        .eq('id', session.id);

      if (schedError) throw schedError;

      // 3. Send confirmation message
      const currentUserId = localStorage.getItem('auth_id');
      const enrollment = enrolledCourses.find(c => c.course_id === session.course_id);
      const chatId = enrollment?.id || session.course_id;

      const confirmationMsg = {
        chat_id: Number(chatId),
        session_id: session.id,
        role: 'student',
        sender_id: Number(currentUserId),
        content: isApproved
          ? `Reschedule approved. The session is now set for ${new Date(session.rescheduled_date).toLocaleDateString()} at ${new Date(session.rescheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
          : `Reschedule request rejected.`,
        type: 'text',
        read: false
      };

      await supabase.from('messages').insert([confirmationMsg]);

      // 4. Update local state
      setSessions(prev => prev.map(s => {
        if (s.id === session.id) {
          return {
            ...s,
            reschedule_request: false,
            reschedule_role: null,
            rescheduled_date: null,
            reschedule_reason: null,
            date: isApproved ? new Date(session.rescheduled_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : s.date,
            time: isApproved ? new Date(session.rescheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : s.time,
            scheduled_date: isApproved ? session.rescheduled_date : s.scheduled_date
          }
        }
        return s;
      }));

      setIsResponseModalOpen(false);
      alert(`Reschedule request ${action}d successfully!`);

    } catch (err) {
      console.error('Error handling reschedule response:', err);
      alert('Failed to process reschedule action.');
    }
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

  if (loading) {
    return <Loading fullScreen={true} />
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
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="session-card-elegant"
                style={session.is_complete ? { opacity: 0.5, filter: 'grayscale(0.5)' } : {}}
              >
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
                      {session.is_complete ? 'completed' : session.type}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="session-actions-buttons">
                  {session.type !== 'deadline' && !session.is_complete && (
                    <>
                      {session.reschedule_request ? (
                        session.reschedule_role === 'student' ? (
                          <button
                            className="session-btn session-btn-secondary"
                            disabled
                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px' }}>schedule</span>
                            Request Sent
                          </button>
                        ) : (
                          <button
                            className="session-btn"
                            onClick={() => handleResponseClick(session)}
                            style={{
                              background: '#0ea5e9',
                              color: 'white',
                              border: 'none',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>schedule</span>
                            Requested Reschedule
                          </button>
                        )
                      ) : (
                        <button
                          className="session-btn session-btn-secondary"
                          onClick={() => handleRescheduleClick(session)}
                          style={{
                            background: '#f1f5f9',
                            color: '#64748b',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                          </svg>
                          Reschedule
                        </button>
                      )}
                      <button
                        className="session-btn"
                        onClick={() => handleJoin(session.joinLink)}
                        style={{
                          background: session.reschedule_request && session.reschedule_role !== 'student' ? '#fff' : '#0ea5e9',
                          color: session.reschedule_request && session.reschedule_role !== 'student' ? '#0ea5e9' : '#fff',
                          border: session.reschedule_request && session.reschedule_role !== 'student' ? '1px solid #0ea5e9' : 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: 0.8
                        }}
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
            ))
          ) : (
            <div className="calendar-empty-state">
              <div className="empty-state-icon">
                <span className="material-symbols-outlined">event_busy</span>
              </div>
              <p>No upcoming sessions.</p>
            </div>
          )}
        </div>
      </div>

      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleRescheduleConfirm}
        sessionDetails={selectedSession}
      />

      <RescheduleResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        sessionDetails={selectedSession}
        onApprove={(session) => handleRescheduleResponse(session, 'approve')}
        onReject={(session) => handleRescheduleResponse(session, 'reject')}
      />

    </div>
  )
}

export default Calendar 