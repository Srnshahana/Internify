import { useState } from 'react'
import '../App.css'
import { NotificationIcon } from '../components/Icons.jsx'

function Notification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'session',
      title: 'Upcoming Session Reminder',
      message: 'Your session with Sarah Johnson is scheduled for tomorrow at 2:00 PM',
      time: '2 hours ago',
      read: false,
      icon: '📅',
    },
    {
      id: 2,
      type: 'course',
      title: 'New Course Material Available',
      message: 'New lecture videos have been added to your React Fundamentals course',
      time: '5 hours ago',
      read: false,
      icon: '📚',
    },
    {
      id: 3,
      type: 'mentor',
      title: 'Message from Your Mentor',
      message: 'Alex Chen sent you feedback on your latest project submission',
      time: '1 day ago',
      read: true,
      icon: '💬',
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Course Completed!',
      message: 'Congratulations! You have successfully completed the JavaScript Basics course',
      time: '2 days ago',
      read: true,
      icon: '🎉',
    },
    {
      id: 5,
      type: 'assignment',
      title: 'Assignment Due Soon',
      message: 'Your assignment for "Building a Todo App" is due in 3 days',
      time: '3 days ago',
      read: false,
      icon: '📝',
    },
    {
      id: 6,
      type: 'system',
      title: 'System Update',
      message: 'New features have been added to your dashboard. Check them out!',
      time: '1 week ago',
      read: true,
      icon: '⚙️',
    },
  ])

  const [filter, setFilter] = useState('all') // all, unread, read

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
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

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="dashboard-page notification-page">
      <div className="notification-header">
        <div>
          <h1>Notifications</h1>
          <p className="lead">
            Stay updated with your courses, sessions, and messages
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <NotificationIcon className="empty-icon" />
            <h3>No notifications</h3>
            <p>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
            >
              <div className="notification-icon">{notification.icon}</div>
              <div className="notification-content">
                <div className="notification-header-item">
                  <h3 className="notification-title">{notification.title}</h3>
                  {!notification.read && <span className="unread-dot"></span>}
                </div>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button
                    className="notification-action-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkAsRead(notification.id)
                    }}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="notification-action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(notification.id)
                  }}
                  title="Delete"
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

export default Notification

