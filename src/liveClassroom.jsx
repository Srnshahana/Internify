import { useState, useRef, useEffect } from 'react'
import './App.css'

function LiveClassroom({ course, onBack }) {
  const [activeSessionId, setActiveSessionId] = useState(2)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'mentor',
      type: 'text',
      content: "Welcome to today's session. We will focus on building reusable components.",
      time: '10:00 AM',
      sectionId: 2,
    },
    {
      id: 2,
      from: 'learner',
      type: 'text',
      content: 'Should we use function components only, or class components as well?',
      time: '10:02 AM',
      sectionId: 2,
    },
    {
      id: 3,
      from: 'mentor',
      type: 'file',
      fileName: 'session-2-components.pdf',
      fileSize: '2.1 MB',
      time: '10:05 AM',
      sectionId: 2,
    },
    {
      id: 4,
      from: 'mentor',
      type: 'link',
      linkLabel: 'Zoom meeting link',
      url: 'https://zoom.us/j/123-456',
      time: '10:10 AM',
      sectionId: 2,
    },
    {
      id: 5,
      from: 'learner',
      type: 'text',
      content: 'I have pushed my latest changes to GitHub. Please review when possible.',
      time: '10:20 AM',
      sectionId: 2,
    },
  ])
  const chatFeedRef = useRef(null)

  const classroom = course || {
    title: 'React App Development – Batch 1',
    mentor: 'Sarah Chen',
  }

  const sessions = [
    { id: 1, title: 'Introduction & Setup', status: 'completed' },
    { id: 2, title: 'Components & Props', status: 'current' },
    { id: 3, title: 'State & Hooks', status: 'upcoming' },
    { id: 4, title: 'Routing & Navigation', status: 'upcoming' },
    { id: 5, title: 'Project Wrap-up', status: 'upcoming' },
  ]

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[1]
  const visibleMessages = messages.filter((m) => m.sectionId === activeSession.id)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight
    }
  }, [visibleMessages])

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const newMessage = {
      id: messages.length + 1,
      from: 'learner',
      type: 'text',
      content: messageInput.trim(),
      time: getCurrentTime(),
      sectionId: activeSessionId,
    }

    setMessages([...messages, newMessage])
    setMessageInput('')
  }

  return (
    <div className="live-classroom-page">
      {/* Main chat + section header */}
      <div className="live-main live-main-full">
        <div className="live-section-header">
          <div className="live-section-header-top">
            <button className="live-back-btn" type="button" onClick={onBack} aria-label="Go back">
              ← Back
            </button>
            <div className="live-section-header-content">
              <div className="live-section-title">{activeSession.title}</div>
              <p className="live-section-description">
                Structured discussion and code review for this part of the course. All messages, files, and links here
                stay attached to this session.
              </p>
              <div className="live-section-meta">
                <span className="live-section-progress">
                  Session {sessions.indexOf(activeSession) + 1} of {sessions.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="live-chat-area">
          <div className="live-chat-feed" ref={chatFeedRef}>
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`live-message ${message.from === 'mentor' ? 'from-mentor' : 'from-learner'}`}
              >
                <div className="live-message-bubble">
                  {message.type === 'text' && <p>{message.content}</p>}
                  {message.type === 'file' && (
                    <div className="live-file-card">
                      <div className="live-file-icon">DOC</div>
                      <div className="live-file-info">
                        <div className="live-file-name">{message.fileName}</div>
                        <div className="live-file-meta">{message.fileSize}</div>
                      </div>
                    </div>
                  )}
                  {message.type === 'link' && (
                    <a href={message.url} className="live-link-card" target="_blank" rel="noreferrer">
                      <div className="live-link-label">{message.linkLabel}</div>
                      <div className="live-link-url">{message.url}</div>
                    </a>
                  )}
                </div>
                <div className="live-message-time">{message.time}</div>
              </div>
            ))}
          </div>

          <form className="live-message-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="live-message-input"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button type="submit" className="live-send-btn" disabled={!messageInput.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Sessions bar at bottom */}
      <div className="live-sessions-bar">
        {sessions.map((session) => (
          <button
            key={session.id}
            type="button"
            className={`live-session-chip ${
              session.status === 'completed'
                ? 'completed'
                : session.id === activeSessionId
                ? 'current'
                : 'upcoming'
            }`}
            onClick={() => setActiveSessionId(session.id)}
          >
            <span className="live-session-title">{session.title}</span>
            {session.status === 'completed' && <span className="live-session-status">Completed</span>}
            {session.status === 'current' && <span className="live-session-status">In progress</span>}
            {session.status === 'upcoming' && <span className="live-session-status">Upcoming</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LiveClassroom


