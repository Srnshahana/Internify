import { useState } from 'react'
import '../../App.css'

// Simple static data for mentor dashboard
const mentorName = 'Alex (Mentor)'

const todayStats = [
  { label: 'Mentees today', value: '3' },
  { label: 'Sessions this week', value: '8' },
  { label: 'Pending reviews', value: '4' },
  { label: 'Unread messages', value: '6' },
]

const upcomingMentorSessions = [
  {
    id: 1,
    time: '10:00 AM',
    mentee: 'Sherin',
    topic: 'React project review',
    type: '1:1',
  },
  {
    id: 2,
    time: '2:30 PM',
    mentee: 'Rahul',
    topic: 'DSA practice',
    type: 'Mock interview',
  },
  {
    id: 3,
    time: '6:00 PM',
    mentee: 'Fatima',
    topic: 'Portfolio feedback',
    type: 'Career',
  },
]

function MentorHome() {
  const [selectedSessionId, setSelectedSessionId] = useState(upcomingMentorSessions[0]?.id || null)

  const selectedSession = upcomingMentorSessions.find((s) => s.id === selectedSessionId) || upcomingMentorSessions[0]

  return (
    <div className="dashboard-page desktop-layout">
      {/* Top Row: Welcome + Quick Actions */}
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="welcome-title">Welcome back, {mentorName}</h1>
          <p className="welcome-subtitle">Here’s a quick snapshot of your mentees and sessions</p>
        </div>
        <div className="dashboard-quick-actions">
          <button className="quick-action-btn">
            <span>Open next session</span>
          </button>
          <button className="quick-action-btn">
            <span>Review pending work</span>
          </button>
          <button className="quick-action-btn">
            <span>Message mentees</span>
          </button>
        </div>
      </div>

      {/* Mentor Stats Row */}
      <div className="dashboard-section progress-overview-section">
        <div className="progress-overview-cards">
          {todayStats.map((stat) => (
            <div key={stat.label} className="progress-overview-card">
              <div className="progress-card-content">
                <h3 className="progress-card-title">{stat.label}</h3>
                <p className="progress-card-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two column layout: Today’s sessions + Session details */}
      <div className="dashboard-main-grid">
        <div className="dashboard-main-content">
          <div className="dashboard-section">
            <h2 className="section-title">Today’s mentee sessions</h2>
            <div className="sessions-list">
              {upcomingMentorSessions.map((session) => (
                <div
                  key={session.id}
                  className={`session-card-inline ${session.id === selectedSessionId ? 'active' : ''}`}
                  onClick={() => setSelectedSessionId(session.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="session-card-inline-header">
                    <div>
                      <p className="session-card-inline-course">{session.topic}</p>
                      <p className="session-card-inline-mentor">With {session.mentee}</p>
                    </div>
                    <div className="session-card-inline-time">{session.time}</div>
                  </div>
                  <p className="session-card-inline-location">{session.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="dashboard-section sidebar-section">
            <h2 className="section-title">Selected session</h2>
            {selectedSession ? (
              <div className="info-card">
                <div className="info-item">
                  <span className="info-label">Mentee</span>
                  <span className="info-value">{selectedSession.mentee}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time</span>
                  <span className="info-value">{selectedSession.time}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Topic</span>
                  <span className="info-value">{selectedSession.topic}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Type</span>
                  <span className="info-value">{selectedSession.type}</span>
                </div>
              </div>
            ) : (
              <p className="page-subtitle">Select a session from the left to see details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorHome


