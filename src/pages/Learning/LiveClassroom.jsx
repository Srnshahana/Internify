import { useState, useRef, useEffect } from 'react'
import '../../App.css'

function LiveClassroom({ course, onBack, userRole = 'student' }) {
  // Use course.sessions (new) or course.classes (legacy)
  const initialSessions = course?.sessions || course?.classes || [
    { id: 1, title: 'Introduction & Setup', status: 'completed' },
    { id: 2, title: 'Components & Props', status: 'upcoming' },
    { id: 3, title: 'State & Hooks', status: 'upcoming' },
  ]

  // Find first pending or default to first session ID
  const firstPendingId = initialSessions.find(s => s.status === 'pending' || s.status === 'upcoming')?.id ||
    initialSessions.find(s => s.sessionId)?.sessionId ||
    initialSessions[0]?.id || 1

  const [activeSessionId, setActiveSessionId] = useState(firstPendingId)
  const [messageInput, setMessageInput] = useState('')
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    dueDate: '',
  })
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
      from: userRole === 'mentor' ? 'mentor' : 'learner',
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
      from: userRole === 'mentor' ? 'mentor' : 'learner',
      type: 'text',
      content: 'I have pushed my latest changes to GitHub. Please review when possible.',
      time: '10:20 AM',
      sectionId: 2,
      highlightColor: null,
      selfNote: '',
    },
    {
      id: 6,
      from: 'mentor',
      type: 'assessment',
      assessmentTitle: 'React Hooks Implementation Assignment',
      assessmentDescription: 'Create a custom hook for managing form state with validation. Your hook should handle:\n\n1. Form field values and updates\n2. Validation rules for each field\n3. Error messages\n4. Form submission handling\n\nSubmit your code file and a brief explanation of your implementation approach.',
      assessmentDueDate: '2024-03-25',
      assessmentId: 1001,
      time: '10:25 AM',
      sectionId: 2,
      highlightColor: null,
      selfNote: '',
    },
  ])
  const chatFeedRef = useRef(null)
  const docInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const assessmentFileInputRef = useRef(null)

  const classroom = course || {
    title: 'React App Development – Batch 1',
    mentor: 'Sarah Chen',
  }

  const [sessions, setSessions] = useState(initialSessions)

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[1]
  const visibleMessages = messages.filter((m) => m.sectionId === activeSession.id)

  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [showAttachOptions, setShowAttachOptions] = useState(false)
  const [noteEditingId, setNoteEditingId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [assessmentSubmission, setAssessmentSubmission] = useState({
    textSubmission: '',
    attachments: [],
  })

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
      from: userRole === 'mentor' ? 'mentor' : 'learner',
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
      from: userRole === 'mentor' ? 'mentor' : 'learner',
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
      from: userRole === 'mentor' ? 'mentor' : 'learner',
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
      from: userRole === 'mentor' ? 'mentor' : 'learner',
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
      from: userRole === 'mentor' ? 'mentor' : 'learner',
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

  const handleSendAssessment = () => {
    if (!newAssessment.title || !newAssessment.description || !newAssessment.dueDate) {
      alert('Please fill in all fields')
      return
    }

    const assessmentMessage = {
      id: messages.length + 1,
      from: 'mentor',
      type: 'assessment',
      assessmentTitle: newAssessment.title,
      assessmentDescription: newAssessment.description,
      assessmentDueDate: newAssessment.dueDate,
      assessmentId: Date.now(), // Simple ID generation
      time: getCurrentTime(),
      sectionId: activeSessionId,
      highlightColor: null,
      selfNote: '',
    }

    setMessages((prev) => [...prev, assessmentMessage])
    setNewAssessment({ title: '', description: '', dueDate: '' })
    setShowAssessmentForm(false)
    setShowAttachOptions(false)
  }

  const handleViewAssessment = (assessmentMessage) => {
    setSelectedAssessment(assessmentMessage)
    // Reset submission form when opening assessment
    setAssessmentSubmission({ textSubmission: '', attachments: [] })
  }

  const handleAssessmentFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.name.split('.').pop(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file: file,
    }))
    setAssessmentSubmission({
      ...assessmentSubmission,
      attachments: [...assessmentSubmission.attachments, ...newAttachments],
    })
  }

  const handleRemoveAssessmentAttachment = (index) => {
    setAssessmentSubmission({
      ...assessmentSubmission,
      attachments: assessmentSubmission.attachments.filter((_, i) => i !== index),
    })
  }

  const handleSubmitAssessment = () => {
    if (!assessmentSubmission.textSubmission && assessmentSubmission.attachments.length === 0) {
      alert('Please provide either text submission or attach files')
      return
    }

    // Create a submission confirmation message
    const submissionMessage = {
      id: messages.length + 1,
      from: 'learner',
      type: 'text',
      content: `✅ Submitted assessment: "${selectedAssessment.assessmentTitle}"\n\n${assessmentSubmission.textSubmission || 'Files attached: ' + assessmentSubmission.attachments.map(a => a.name).join(', ')}`,
      time: getCurrentTime(),
      sectionId: activeSessionId,
      highlightColor: null,
      selfNote: '',
    }

    setMessages((prev) => [...prev, submissionMessage])

    // Mark assessment as submitted (you could add a submitted flag to the assessment)
    alert('Assessment submitted successfully!')

    setSelectedAssessment(null)
    setAssessmentSubmission({ textSubmission: '', attachments: [] })
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
        <div className="live-topbar-title">{classroom.title}</div>
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
                  className={`live-message-bubble ${message.highlightColor ? `highlight-${message.highlightColor}` : ''
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
                  {message.type === 'assessment' && (
                    <div
                      className="live-assessment-card"
                      onClick={() => userRole === 'student' && handleViewAssessment(message)}
                      style={{ cursor: userRole === 'student' ? 'pointer' : 'default' }}
                    >
                      <div className="assessment-card-header">
                        <div className="assessment-icon">📝</div>
                        <div className="assessment-badge">Assessment</div>
                      </div>
                      <h4 className="assessment-card-title">{message.assessmentTitle}</h4>
                      <p className="assessment-card-description">{message.assessmentDescription}</p>
                      <div className="assessment-card-footer">
                        <span className="assessment-due-date">Due: {new Date(message.assessmentDueDate).toLocaleDateString()}</span>
                        {userRole === 'student' && (
                          <button className="assessment-view-btn">View & Submit</button>
                        )}
                      </div>
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
              {userRole === 'mentor' && (
                <button type="button" onClick={() => {
                  setShowAssessmentForm(true)
                  setShowAttachOptions(false)
                }}>
                  📝 Send Assessment
                </button>
              )}
            </div>
          )}

          {/* Assessment Form Modal */}
          {showAssessmentForm && (
            <div className="live-assessment-modal-overlay" onClick={() => setShowAssessmentForm(false)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header">
                  <h2>Create Assessment</h2>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowAssessmentForm(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="assessment-modal-content">
                  <div className="form-group">
                    <label className="form-label">Assessment Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., React Hooks Implementation"
                      value={newAssessment.title}
                      onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Instructions / What to Do</label>
                    <textarea
                      className="form-textarea"
                      rows="6"
                      placeholder="Describe what students need to do for this assessment..."
                      value={newAssessment.description}
                      onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newAssessment.dueDate}
                      onChange={(e) => setNewAssessment({ ...newAssessment, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="assessment-modal-actions">
                  <button
                    className="btn-primary"
                    onClick={handleSendAssessment}
                  >
                    Send Assessment
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setShowAssessmentForm(false)
                      setNewAssessment({ title: '', description: '', dueDate: '' })
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assessment View Modal for Students */}
          {selectedAssessment && userRole === 'student' && (
            <div className="live-assessment-modal-overlay" onClick={() => setSelectedAssessment(null)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header">
                  <h2>Assessment</h2>
                  <button
                    className="modal-close-btn"
                    onClick={() => setSelectedAssessment(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="assessment-modal-content">
                  <div className="assessment-view-header">
                    <h3>{selectedAssessment.assessmentTitle}</h3>
                    <p className="assessment-view-course">{course?.title || 'Course'}</p>
                  </div>
                  <div className="assessment-view-details">
                    <div className="info-item">
                      <span className="info-label">Due Date:</span>
                      <span className="info-value">
                        {new Date(selectedAssessment.assessmentDueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="assessment-view-description">
                    <h4>Instructions</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedAssessment.assessmentDescription}</p>
                  </div>

                  {/* Submission Form */}
                  <div className="assessment-submission-form">
                    <h4>Your Submission</h4>

                    <div className="form-group">
                      <label className="form-label">Write your response / description</label>
                      <textarea
                        className="form-textarea"
                        rows="8"
                        placeholder="Describe your work, explain your approach, or provide any additional context..."
                        value={assessmentSubmission.textSubmission}
                        onChange={(e) => setAssessmentSubmission({ ...assessmentSubmission, textSubmission: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Attach Files / Documents</label>
                      <div className="file-upload-area">
                        <input
                          type="file"
                          id="assessment-file-upload"
                          multiple
                          className="file-input"
                          ref={assessmentFileInputRef}
                          onChange={handleAssessmentFileUpload}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="assessment-file-upload" className="file-upload-label">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          Click to upload files or drag and drop
                        </label>
                      </div>

                      {assessmentSubmission.attachments.length > 0 && (
                        <div className="attachments-list" style={{ marginTop: '12px' }}>
                          {assessmentSubmission.attachments.map((attachment, idx) => (
                            <div key={idx} className="attachment-item">
                              <div className="attachment-icon">
                                {attachment.type === 'pdf' && '📄'}
                                {attachment.type === 'js' && '📜'}
                                {attachment.type === 'ts' && '📘'}
                                {attachment.type === 'figma' && '🎨'}
                                {attachment.type === 'zip' && '📦'}
                                {!['pdf', 'js', 'ts', 'figma', 'zip'].includes(attachment.type) && '📎'}
                              </div>
                              <div className="attachment-info">
                                <span className="attachment-name">{attachment.name}</span>
                                <span className="attachment-size">{attachment.size}</span>
                              </div>
                              <button
                                className="btn-danger btn-small"
                                onClick={() => handleRemoveAssessmentAttachment(idx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="assessment-view-actions">
                      <button
                        className="btn-primary btn-full"
                        onClick={handleSubmitAssessment}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Submit Assessment
                      </button>
                      <button
                        className="btn-secondary btn-full"
                        onClick={() => {
                          setSelectedAssessment(null)
                          setAssessmentSubmission({ textSubmission: '', attachments: [] })
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
              className={`live-session-chip ${session.status} ${session.id === activeSessionId ? 'current' : ''
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


