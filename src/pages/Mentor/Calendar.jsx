import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'
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

  const currentUserId = localStorage.getItem('auth_id')

  useEffect(() => {
    const fetchScheduledClasses = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('scheduled_classes')
          .select('*, courses(title), reschedule_request, reschedule_role, rescheduled_date, reschedule_reason, is_complete')
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
            scheduled_date: session.scheduled_date,
            reschedule_request: session.reschedule_request,
            reschedule_role: session.reschedule_role,
            rescheduled_date: session.rescheduled_date,
            reschedule_reason: session.reschedule_reason,
            is_complete: session.is_complete,
            mentee: 'Batch',
            course_id: session.course_id,
            session_id: session.session_id,
            type: 'upcoming',
            joinLink: session.meeting_link
          }))

          // Sort: Upcoming (is_complete: false) first, then Completed (is_complete: true)
          mappedSessions.sort((a, b) => {
            if (a.is_complete === b.is_complete) return 0;
            return a.is_complete ? 1 : -1;
          });

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

  // Auto-open reschedule modal if session ID is in localStorage
  useEffect(() => {
    if (!loading && sessions.length > 0) {
      const sessionIdToOpen = localStorage.getItem('open_reschedule_session_id');
      if (sessionIdToOpen) {
        const session = sessions.find(s => String(s.id) === String(sessionIdToOpen));
        if (session && session.reschedule_request) {
          if (session.reschedule_role === 'student') {
            handleResponseClick(session);
          } else {
            handleRescheduleClick(session);
          }
        }
        localStorage.removeItem('open_reschedule_session_id');
      }
    }
  }, [loading, sessions]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonth = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const handleJoin = (link) => {
    if (link) window.open(link, '_blank')
  }

  const handleRescheduleClick = (session) => {
    setSelectedSession(session)
    setShowRescheduleModal(true)
  }

  const handleMarkComplete = async (session) => {
    if (!window.confirm('Mark this session as complete? This will remove it from the upcoming list for you and the student.')) return

    try {
      const { error } = await supabase
        .from('scheduled_classes')
        .update({ is_complete: true })
        .eq('id', session.id)

      if (error) throw error

      setSessions(prev => {
        const updated = prev.map(s => s.id === session.id ? { ...s, is_complete: true } : s);
        return [...updated].sort((a, b) => {
          if (a.is_complete === b.is_complete) return 0;
          return a.is_complete ? 1 : -1;
        });
      });
      alert('Session marked as complete!')
    } catch (err) {
      console.error('Error marking session as complete:', err)
      alert('Failed to mark session as complete.')
    }
  }

  const handleRescheduleConfirm = async ({ newDate, newTime, reason }) => {
    if (!selectedSession) return

    try {
      const currentUserId = localStorage.getItem('auth_id')

      // For mentors, we need to find which chat to post this to.
      // If it's a batch class, we might need to post to all enrollments or a course-wide chat.
      // Given the implementation of StudentLiveClassroom, we'll try to find an enrollment for this course.
      const { data: enrollments, error: enrollError } = await supabase
        .from('classes_enrolled')
        .select('id')
        .eq('course_id', selectedSession.course_id)
        .eq('mentor_id', currentUserId)

      if (enrollError) throw enrollError

      if (!enrollments || enrollments.length === 0) {
        alert('No students found for this course to send the request to.')
        return
      }

      const rescheduleData = {
        original_session_id: selectedSession.id,
        new_date: newDate,
        new_time: newTime,
        reason: reason,
        status: 'pending',
        proposed_by: 'mentor'
      }

      // Propose to the first enrollment found (assuming 1-on-1 or batch leader?)
      // Implementation detail: we'll send it to ALL enrolled chats if it's a batch class.
      const insertPromises = enrollments.map(enroll => (
        supabase
          .from('messages')
          .insert([{
            chat_id: enroll.id,
            session_id: selectedSession.id,
            role: 'mentor',
            sender_id: Number(currentUserId),
            content: JSON.stringify(rescheduleData),
            type: 'reschedule_request',
            read: false
          }])
      ))

      await Promise.all(insertPromises)

      // Update the scheduled_classes table to set reschedule_request = true, reschedule_role = 'mentor', and store proposed date
      const { error: updateError } = await supabase
        .from('scheduled_classes')
        .update({
          reschedule_request: true,
          reschedule_role: 'mentor',
          rescheduled_date: `${newDate}T${newTime}`,
          reschedule_reason: reason
        })
        .eq('id', selectedSession.id)

      if (updateError) throw updateError

      // Update local state
      setSessions(prev => prev.map(s => s.id === selectedSession.id ? {
        ...s,
        reschedule_request: true,
        reschedule_role: 'mentor',
        rescheduled_date: `${newDate}T${newTime}`,
        reschedule_reason: reason
      } : s))

      alert('Reschedule request sent to students!')
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
        const updatedData = { ...requestData, status: isApproved ? 'approved' : 'rejected' };

        await supabase
          .from('messages')
          .update({ content: JSON.stringify(updatedData) })
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

      // 3. Send a confirmation message to all students in the course
      const currentUserId = localStorage.getItem('auth_id');
      const { data: enrollments } = await supabase
        .from('classes_enrolled')
        .select('id')
        .eq('course_id', session.course_id);

      if (enrollments && enrollments.length > 0) {
        const confirmationMsg = {
          session_id: session.id,
          role: 'mentor',
          sender_id: Number(currentUserId),
          content: isApproved
            ? `Reschedule approved. The session is now set for ${new Date(session.rescheduled_date).toLocaleDateString()} at ${new Date(session.rescheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
            : `Reschedule request rejected.`,
          type: 'text',
          read: false
        };

        const insertPromises = enrollments.map(enroll => (
          supabase
            .from('messages')
            .insert([{ ...confirmationMsg, chat_id: enroll.id }])
        ));
        await Promise.all(insertPromises);
      }

      // 4. Update local state
      setSessions(prev => {
        const updated = prev.map(s => {
          if (s.id === session.id) {
            return {
              ...s,
              reschedule_request: false,
              reschedule_role: null,
              rescheduled_date: null,
              reschedule_reason: null,
              date: isApproved ? new Date(session.rescheduled_date).toLocaleDateString() : s.date,
              time: isApproved ? new Date(session.rescheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : s.time,
              scheduled_date: isApproved ? session.rescheduled_date : s.scheduled_date
            }
          }
          return s;
        });

        // Re-sort sessions after update
        return [...updated].sort((a, b) => {
          if (a.is_complete === b.is_complete) return 0;
          return a.is_complete ? 1 : -1;
        });
      });

      setIsResponseModalOpen(false);
      alert(`Reschedule request ${action}d successfully!`);

    } catch (err) {
      console.error('Error handling reschedule response:', err);
      alert('Failed to process reschedule action.');
    }
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
              <div
                key={session.id}
                className="session-card-elegant"
                style={session.is_complete ? { opacity: 0.5, filter: 'grayscale(0.5)' } : {}}
              >
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
                      {session.is_complete ? 'completed' : session.type}
                    </span>
                  </div>
                </div>

                <div className="session-actions-buttons">
                  {!session.is_complete && (
                    <>
                      {session.reschedule_request ? (
                        session.reschedule_role === 'mentor' ? (
                          <button
                            className="session-btn session-btn-secondary"
                            disabled
                            style={{ marginRight: '8px', opacity: 0.7, cursor: 'not-allowed' }}
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
                              gap: '6px',
                              marginRight: '8px'
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
                            marginRight: '8px',
                            background: '#f1f5f9',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                          </svg>
                          Reschedule
                        </button>
                      )}
                      {!session.is_complete && (
                        <button
                          className="session-btn"
                          onClick={() => handleMarkComplete(session)}
                          style={{
                            marginRight: '8px',
                            background: '#10b981',
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Mark Complete
                        </button>
                      )}
                      <button
                        className="session-btn"
                        onClick={() => handleJoin(session.joinLink)}
                        style={{
                          background: session.reschedule_request && session.reschedule_role !== 'mentor' ? '#fff' : '#0ea5e9',
                          color: session.reschedule_request && session.reschedule_role !== 'mentor' ? '#0ea5e9' : '#fff',
                          border: session.reschedule_request && session.reschedule_role !== 'mentor' ? '1px solid #0ea5e9' : 'none',
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
            ))}
          </div>
        )}
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


