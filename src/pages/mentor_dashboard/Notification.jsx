import { useState } from 'react'
import '../../App.css'
import { NotificationIcon } from '../../components/Icons.jsx'

const initialMentorNotifications = [
  {
    id: 1,
    type: 'session',
    title: 'New session booked',
    message: 'Sherin booked a 1:1 session for tomorrow at 7:00 PM',
    time: '1 hour ago',
    read: false,
    icon: '📅',
  },
  {
    id: 2,
    type: 'review',
    title: 'Work pending review',
    message: 'You have 3 project submissions waiting for feedback',
    time: '3 hours ago',
    read: false,
    icon: '📝',
  },
  {
    id: 3,
    type: 'message',
    title: 'New mentee message',
    message: 'Rahul sent you a follow-up question about system design',
    time: 'Yesterday',
    read: true,
    icon: '💬',
  },
  {
    id: 4,
    type: 'system',
    title: 'Payout processed',
    message: 'Your mentorship payout for this week has been processed',
    time: '2 days ago',
    read: true,
    icon: '💸',
  },
]

function MentorNotification() {
  const [notifications, setNotifications] = useState(initialMentorNotifications)
  const [filter, setFilter] = useState('all') // all, unread, read

  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read)

  return (
    <div className="dashboard-page notification-page">
      <div className="notification-header">
        <div>
          <h1>Mentor notifications</h1>
          <p className="lead">Stay on top of new bookings, pending reviews, and payout updates.</p>
        </div>
        <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className="notification-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read
        </button>
      </div>

      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <div className="empty-icon">
              <NotificationIcon />
            </div>
            <p>No notifications in this filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${notif.read ? 'read' : 'unread'}`}
              onClick={() => handleMarkAsRead(notif.id)}
            >
              <div className="notification-icon">{notif.icon}</div>
              <div className="notification-content">
                <div className="notification-header-item">
                  <h3 className="notification-title">{notif.title}</h3>
                  {!notif.read && <span className="unread-dot"></span>}
                </div>
                <p className="notification-message">{notif.message}</p>
                <span className="notification-time">{notif.time}</span>
              </div>
              <div className="notification-actions">
                <button
                  className="notification-action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(notif.id)
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MentorNotification


