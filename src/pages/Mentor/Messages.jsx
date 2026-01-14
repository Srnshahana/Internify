import { useState } from 'react'
import '../../App.css'

const mentees = [
  {
    id: 1,
    name: 'Sherin',
    email: 'sherin@example.com',
    avatar: 'S',
    course: 'React Advanced Patterns',
    lastMessage: 'Thank you for the feedback on my assignment!',
    lastMessageTime: '2 hours ago',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: 'Rahul',
    email: 'rahul@example.com',
    avatar: 'R',
    course: 'DSA Mastery',
    lastMessage: 'Can we schedule a session to discuss the algorithm problems?',
    lastMessageTime: '5 hours ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 3,
    name: 'Fatima',
    email: 'fatima@example.com',
    avatar: 'F',
    course: 'UI/UX Design Principles',
    lastMessage: 'I have a question about the design system assignment.',
    lastMessageTime: '1 day ago',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 4,
    name: 'Priya',
    email: 'priya@example.com',
    avatar: 'P',
    course: 'React Advanced Patterns',
    lastMessage: 'The code review was very helpful, thank you!',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 5,
    name: 'Amit',
    email: 'amit@example.com',
    avatar: 'A',
    course: 'System Design Fundamentals',
    lastMessage: 'I need help understanding the database schema design.',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
    isOnline: false,
  },
]

const messageHistory = {
  1: [
    {
      id: 1,
      sender: 'Sherin',
      message: 'Hi! I submitted my assignment yesterday. Could you please review it when you get a chance?',
      timestamp: '2024-03-14T10:30:00',
      isMentor: false,
    },
    {
      id: 2,
      sender: 'You',
      message: 'Hi Sherin! I\'ve received your submission. I\'ll review it today and get back to you with feedback.',
      timestamp: '2024-03-14T11:00:00',
      isMentor: true,
    },
    {
      id: 3,
      sender: 'Sherin',
      message: 'Thank you so much! Looking forward to your feedback.',
      timestamp: '2024-03-14T11:15:00',
      isMentor: false,
    },
    {
      id: 4,
      sender: 'You',
      message: 'I\'ve reviewed your work. Great job on the custom hooks! I\'ve left some suggestions for improvement in the feedback section.',
      timestamp: '2024-03-15T09:00:00',
      isMentor: true,
    },
    {
      id: 5,
      sender: 'Sherin',
      message: 'Thank you for the feedback on my assignment!',
      timestamp: '2024-03-15T11:00:00',
      isMentor: false,
    },
  ],
  2: [
    {
      id: 1,
      sender: 'Rahul',
      message: 'Hi mentor! I\'m stuck on problem 5 of the algorithm set. Can you help?',
      timestamp: '2024-03-14T14:00:00',
      isMentor: false,
    },
    {
      id: 2,
      sender: 'You',
      message: 'Hi Rahul! Of course. Can you share which specific part you\'re stuck on?',
      timestamp: '2024-03-14T14:30:00',
      isMentor: true,
    },
    {
      id: 3,
      sender: 'Rahul',
      message: 'It\'s the dynamic programming approach. I understand the concept but can\'t figure out the state transition.',
      timestamp: '2024-03-14T15:00:00',
      isMentor: false,
    },
    {
      id: 4,
      sender: 'You',
      message: 'Let\'s schedule a quick session to go through it. How about tomorrow at 4 PM?',
      timestamp: '2024-03-14T15:30:00',
      isMentor: true,
    },
    {
      id: 5,
      sender: 'Rahul',
      message: 'Can we schedule a session to discuss the algorithm problems?',
      timestamp: '2024-03-14T16:00:00',
      isMentor: false,
    },
  ],
}

function Messages({ onBack }) {
  const [selectedMentee, setSelectedMentee] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState(messageHistory)

  const selectedMenteeData = mentees.find(m => m.id === selectedMentee)
  const currentMessages = messages[selectedMentee] || []

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedMentee) return

    const newMessage = {
      id: Date.now(),
      sender: 'You',
      message: messageText,
      timestamp: new Date().toISOString(),
      isMentor: true,
    }

    setMessages(prev => ({
      ...prev,
      [selectedMentee]: [...(prev[selectedMentee] || []), newMessage]
    }))

    setMessageText('')
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="dashboard-page messages-page">
      <div className="course-detail-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <h1 className="page-title">Message Mentees</h1>
      </div>

      <div className="messages-container">
        {/* Mentees List */}
        <div className="mentees-sidebar">
          <div className="mentees-header">
            <h2>Mentees</h2>
            <div className="mentees-count">{mentees.length}</div>
          </div>
          <div className="mentees-list">
            {mentees.map((mentee) => (
              <div
                key={mentee.id}
                className={`mentee-item ${selectedMentee === mentee.id ? 'active' : ''}`}
                onClick={() => setSelectedMentee(mentee.id)}
              >
                <div className="mentee-avatar-wrapper">
                  <div className="mentee-avatar">
                    <span>{mentee.avatar}</span>
                  </div>
                  {mentee.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="mentee-info">
                  <div className="mentee-name-row">
                    <h3 className="mentee-name">{mentee.name}</h3>
                    {mentee.unreadCount > 0 && (
                      <span className="unread-badge">{mentee.unreadCount}</span>
                    )}
                  </div>
                  <p className="mentee-course">{mentee.course}</p>
                  <p className="mentee-last-message">{mentee.lastMessage}</p>
                  <p className="mentee-time">{mentee.lastMessageTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-main">
          {selectedMentee ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="mentee-avatar-wrapper">
                    <div className="mentee-avatar-large">
                      <span>{selectedMenteeData.avatar}</span>
                    </div>
                    {selectedMenteeData.isOnline && <div className="online-indicator-large"></div>}
                  </div>
                  <div>
                    <h3 className="chat-mentee-name">{selectedMenteeData.name}</h3>
                    <p className="chat-mentee-course">{selectedMenteeData.course}</p>
                    <p className="chat-mentee-status">
                      {selectedMenteeData.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button className="btn-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  View Profile
                </button>
              </div>

              {/* Messages List */}
              <div className="messages-list">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.isMentor ? 'mentor-message' : 'student-message'}`}
                  >
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">{formatMessageTime(msg.timestamp)}</span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="message-input-area">
                <div className="message-input-wrapper">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="message-input"
                  />
                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <h3>Select a mentee to start messaging</h3>
              <p>Choose a mentee from the list to view and send messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages

