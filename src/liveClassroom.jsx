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
      highlightColor: null,
      selfNote: '',
    },
    {
      id: 2,
      from: 'learner',
      type: 'text',
      content: 'Should we use function components only, or class components as well?',
      time: '10:02 AM',
      sectionId: 2,
      highlightColor: null,
      selfNote: '',
    },
    {
      id: 3,
      from: 'mentor',
      type: 'file',
      fileName: 'session-2-components.pdf',
      fileSize: '2.1 MB',
      time: '10:05 AM',
      sectionId: 2,
      highlightColor: null,
      selfNote: '',
    },
    {
      id: 4,
      from: 'mentor',
      type: 'link',
      linkLabel: 'Zoom meeting link',
      url: 'https://zoom.us/j/123-456',
      time: '10:10 AM',
      sectionId: 2,
      highlightColor: null,
      selfNote: '',
    },
    {
      id: 5,
      from: 'learner',
      type: 'text',
      content: 'I have pushed my latest changes to GitHub. Please review when possible.',
      time: '10:20 AM',
      sectionId: 2,
      highlightColor: null,
      selfNote: '',
    },
  ])
  const chatFeedRef = useRef(null)
  const docInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const classroom = course || {
    title: 'React App Development – Batch 1',
    mentor: 'Sarah Chen',
  }

  const [sessions, setSessions] = useState([
    { id: 1, title: 'Introduction & Setup', status: 'completed' },
    { id: 2, title: 'Components & Props', status: 'upcoming' },
    { id: 3, title: 'State & Hooks', status: 'upcoming' },
    { id: 4, title: 'Routing & Navigation', status: 'upcoming' },
    { id: 5, title: 'Project Wrap-up', status: 'upcoming' },
  ])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[1]
  const visibleMessages = messages.filter((m) => m.sectionId === activeSession.id)

  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [showAttachOptions, setShowAttachOptions] = useState(false)
  const [noteEditingId, setNoteEditingId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [showCompletionModal, setShowCompletionModal] = useState(false)

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

    const base = {
      id: messages.length + 1,
      from: 'learner',
      type: 'text',
      content: messageInput.trim(),
      time: getCurrentTime(),
      sectionId: activeSessionId,
      highlightColor: null,
      selfNote: '',
      replyTo: replyTo
        ? {
            id: replyTo.id,
            preview:
              replyTo.content ||
              replyTo.fileName ||
              replyTo.linkLabel ||
              replyTo.type.toUpperCase(),
          }
        : null,
    }

    setMessages([...messages, base])
    setMessageInput('')
    setReplyTo(null)
    setShowAttachOptions(false)
  }

  const handleToggleHighlight = (id) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const nextColor = m.highlightColor ? null : 'yellow'
        return { ...m, highlightColor: nextColor }
      })
    )
    setActiveMenuMessageId(null)
  }

  const handleSetHighlightColor = (id, color) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const nextColor = m.highlightColor === color ? null : color
        return { ...m, highlightColor: nextColor }
      })
    )
    setActiveMenuMessageId(null)
  }

  const handleAddSelfNote = (id) => {
    const current = messages.find((m) => m.id === id)
    setNoteDraft(current && current.selfNote ? current.selfNote : '')
    setNoteEditingId(id)
    setActiveMenuMessageId(null)
  }

  const handleReplyTo = (message) => {
    setReplyTo(message)
    setActiveMenuMessageId(null)
  }

  const handleAttachDocument = () => {
    if (docInputRef.current) docInputRef.current.click()
  }

  const handleAttachImage = () => {
    if (imageInputRef.current) imageInputRef.current.click()
  }

  const handleDocSelected = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const newMessage = {
      id: messages.length + 1,
      from: 'learner',
      type: 'file',
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      time: getCurrentTime(),
      sectionId: activeSessionId,
      highlightColor: null,
      selfNote: '',
    }
    setMessages((prev) => [...prev, newMessage])
    e.target.value = ''
    setShowAttachOptions(false)
  }

  const handleImageSelected = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const newMessage = {
      id: messages.length + 1,
      from: 'learner',
      type: 'image',
      imageUrl: url,
      fileName: file.name,
      time: getCurrentTime(),
      sectionId: activeSessionId,
      highlightColor: null,
      selfNote: '',
    }
    setMessages((prev) => [...prev, newMessage])
    e.target.value = ''
    setShowAttachOptions(false)
  }

  const handleAttachVoice = () => {
    const newMessage = {
      id: messages.length + 1,
      from: 'learner',
      type: 'voice',
      duration: '0:15',
      time: getCurrentTime(),
      sectionId: activeSessionId,
      highlightColor: null,
      selfNote: '',
    }
    setMessages((prev) => [...prev, newMessage])
    setShowAttachOptions(false)
  }

  const handleAttachLink = () => {
    const url = window.prompt('Paste a link to share:')
    if (!url || !url.trim()) return
    const newMessage = {
      id: messages.length + 1,
      from: 'learner',
      type: 'link',
      linkLabel: 'Link',
      url: url.trim(),
      time: getCurrentTime(),
      sectionId: activeSessionId,
      highlightColor: null,
      selfNote: '',
    }
    setMessages((prev) => [...prev, newMessage])
    setShowAttachOptions(false)
  }

  const handleCompleteSession = () => {
    setSessions((prev) => {
      if (!prev.length) return prev

      const currentSession = prev.find((s) => s.id === activeSessionId)
      const isCurrentlyCompleted = currentSession?.status === 'completed'

      if (isCurrentlyCompleted) {
        // Toggle: uncomplete (back to upcoming), keep it the active one
        return prev.map((s) => {
          if (s.id === activeSessionId) {
            return { ...s, status: 'upcoming' }
          }
          return s
        })
      }

      // Mark current active session as completed and move to next session
      const updated = prev.map((s) =>
        s.id === activeSessionId ? { ...s, status: 'completed' } : s
      )

      const currentIndex = updated.findIndex((s) => s.id === activeSessionId)
      if (currentIndex === -1) return updated

      // Find the next session in order (by index)
      const nextIndex = updated.findIndex((_, i) => i > currentIndex)
      if (nextIndex !== -1) {
        setActiveSessionId(updated[nextIndex].id)
      }

      return updated
    })
  }

  return (
    <div className="live-classroom-page">
      {/* Minimal top bar like inspo */}
      <header className="live-simple-topbar">
        <button
          type="button"
          className="live-topbar-avatars"
          onClick={onBack}
          aria-label="Back to classroom"
        >
          <div className="live-avatar-circle"></div>
          <div className="live-avatar-circle second"></div>
        </button>
        <div className="live-topbar-title">Classroom name</div>
        <button
          type="button"
          className="live-topbar-chat"
          onClick={handleCompleteSession}
          aria-label={activeSession.status === 'completed' ? 'Uncomplete session' : 'Complete session'}
        >
          <span
            className={`live-check-icon ${activeSession.status === 'completed' ? 'checked' : ''}`}
          />
        </button>
      </header>

      {/* Main chat area */}
      <div className="live-main live-main-full">
        <div className="live-session-label">{activeSession.title}</div>

        <div className="live-chat-area">
          <div className="live-chat-feed" ref={chatFeedRef}>
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`live-message ${message.from === 'mentor' ? 'from-mentor' : 'from-learner'}`}
              >
                <div
                  className={`live-message-bubble ${
                    message.highlightColor ? `highlight-${message.highlightColor}` : ''
                  }`}
                >
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
                  {message.type === 'image' && (
                    <div className="live-image-card">
                      <img src={message.imageUrl} alt={message.fileName || 'Image'} />
                    </div>
                  )}
                  {message.type === 'link' && (
                    <a href={message.url} className="live-link-card" target="_blank" rel="noreferrer">
                      <div className="live-link-label">{message.linkLabel}</div>
                      <div className="live-link-url">{message.url}</div>
                    </a>
                  )}
                  {message.type === 'voice' && (
                    <div className="live-voice-card">
                      <div className="voice-icon">●</div>
                      <div className="voice-meta">Voice note • {message.duration}</div>
                    </div>
                  )}
                  {noteEditingId === message.id ? (
                    <div className="live-self-note-editor">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Type your private note..."
                      />
                      <div className="self-note-actions">
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = noteDraft.trim()
                            if (trimmed) {
                              setMessages((prev) =>
                                prev.map((m) =>
                                  m.id === message.id ? { ...m, selfNote: trimmed } : m
                                )
                              )
                            }
                            setNoteEditingId(null)
                            setNoteDraft('')
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNoteEditingId(null)
                            setNoteDraft('')
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    message.selfNote && (
                      <div className="live-self-note">
                        <span className="self-note-label">Note:</span> {message.selfNote}
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="live-message-menu-btn"
                    onClick={() =>
                      setActiveMenuMessageId(
                        activeMenuMessageId === message.id ? null : message.id
                      )
                    }
                    aria-label="Message options"
                  >
                    ⋮
                  </button>
                  {activeMenuMessageId === message.id && (
                    <div className="live-message-menu">
                      <button type="button" onClick={() => handleToggleHighlight(message.id)}>
                        {message.highlightColor ? 'Remove highlight' : 'Highlight'}
                      </button>
                      <div className="live-message-menu-section">
                        <span className="live-menu-label">Highlight color</span>
                        <div className="live-highlight-colors">
                          <button
                            type="button"
                            className="live-highlight-color-btn yellow"
                            onClick={() => handleSetHighlightColor(message.id, 'yellow')}
                            aria-label="Highlight yellow"
                          />
                          <button
                            type="button"
                            className="live-highlight-color-btn red"
                            onClick={() => handleSetHighlightColor(message.id, 'red')}
                            aria-label="Highlight red"
                          />
                          <button
                            type="button"
                            className="live-highlight-color-btn green"
                            onClick={() => handleSetHighlightColor(message.id, 'green')}
                            aria-label="Highlight green"
                          />
                        </div>
                      </div>
                      <button type="button" onClick={() => handleAddSelfNote(message.id)}>
                        Add self note
                      </button>
                      <button type="button" onClick={() => handleReplyTo(message)}>
                        Reply
                      </button>
                    </div>
                  )}
                </div>
                <div className="live-message-time">{message.time}</div>
              </div>
            ))}
          </div>

          <form className="live-message-input-container" onSubmit={handleSendMessage}>
            <button
              type="button"
              className="live-attach-btn"
              aria-label="Add message attachment"
              onClick={() => setShowAttachOptions((prev) => !prev)}
            >
              +
            </button>
            {replyTo && (
              <div className="live-reply-indicator">
                <span className="reply-label">Replying to</span>
                <span className="reply-preview">
                  {replyTo.content || replyTo.fileName || replyTo.linkLabel || replyTo.type}
                </span>
                <button
                  type="button"
                  className="reply-cancel-btn"
                  onClick={() => setReplyTo(null)}
                  aria-label="Cancel reply"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="text"
              className="live-message-input"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button type="submit" className="live-send-btn" disabled={!messageInput.trim()}>
              ➤
            </button>
          </form>
          {showAttachOptions && (
            <div className="live-attach-sheet">
              <button type="button" onClick={handleAttachDocument}>
                Document
              </button>
              <button type="button" onClick={handleAttachImage}>
                Image
              </button>
              <button type="button" onClick={handleAttachVoice}>
                Voice note
              </button>
              <button type="button" onClick={handleAttachLink}>
                Send link
              </button>
            </div>
          )}

          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            style={{ display: 'none' }}
            onChange={handleDocSelected}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelected}
          />
        </div>

        {/* Bottom sessions bar */}
        <div className="live-sessions-bar">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`live-session-chip ${session.status} ${
                session.id === activeSessionId ? 'current' : ''
              }`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span className="live-session-title">{session.title}</span>
              <span className="live-session-status">
                {session.status === 'current'
                  ? 'Now'
                  : session.status === 'completed'
                  ? 'Completed'
                  : 'Upcoming'}
              </span>
            </button>
          ))}
          <button
            type="button"
            className="live-course-complete-btn"
            onClick={() => setShowCompletionModal(true)}
          >
            <span className="live-session-title">Course Complete</span>
          </button>
        </div>
        
        {/* Course Completion Modal */}
        {showCompletionModal && (
          <div className="live-completion-modal-overlay" onClick={() => setShowCompletionModal(false)}>
            <div className="live-completion-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="live-completion-modal-title">Course Completed!</h2>
              <p className="live-completion-modal-description">
                Great job on completing this course. You've taken an important step forward in your learning journey.
                <br /><br />
                You can now close this classroom and access your progress and next steps from your dashboard.
              </p>
              <div className="live-completion-modal-info">
                <p>• Your completion will be recorded</p>
                <p>• You can revisit course materials anytime</p>
              </div>
              <div className="live-completion-modal-actions">
                <button
                  type="button"
                  className="live-completion-modal-primary"
                  onClick={onBack}
                >
                  ✅ Close Classroom
                </button>
                <button
                  type="button"
                  className="live-completion-modal-secondary"
                  onClick={() => {
                    setShowCompletionModal(false)
                    // Navigate to dashboard - you may need to adjust this based on your routing
                    if (onBack) onBack()
                  }}
                >
                  ⬅️ Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveClassroom


