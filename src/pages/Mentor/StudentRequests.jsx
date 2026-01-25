import { useState } from 'react'
import '../../App.css'

const studentRequests = [
  {
    id: 1,
    studentName: 'John Doe',
    studentEmail: 'john@example.com',
    course: 'React Advanced Patterns',
    requestedDate: '2024-03-25',
    requestedTime: '10:00 AM',
    sessionType: '1:1',
    topic: 'Code review and best practices',
    status: 'Pending',
    requestedAt: '2024-03-15T10:30:00',
    studentProgress: 65,
    previousSessions: 3,
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    studentEmail: 'jane@example.com',
    course: 'UI/UX Design Principles',
    requestedDate: '2024-03-26',
    requestedTime: '2:00 PM',
    sessionType: 'Career',
    topic: 'Portfolio review and feedback',
    status: 'Pending',
    requestedAt: '2024-03-15T14:20:00',
    studentProgress: 40,
    previousSessions: 1,
  },
  {
    id: 3,
    studentName: 'Mike Johnson',
    studentEmail: 'mike@example.com',
    course: 'DSA Mastery',
    requestedDate: '2024-03-27',
    requestedTime: '4:00 PM',
    sessionType: 'Mock interview',
    topic: 'Algorithm problem solving',
    status: 'Pending',
    requestedAt: '2024-03-16T09:15:00',
    studentProgress: 85,
    previousSessions: 5,
  },
  {
    id: 4,
    studentName: 'Sarah Williams',
    studentEmail: 'sarah@example.com',
    course: 'System Design Fundamentals',
    requestedDate: '2024-03-28',
    requestedTime: '11:00 AM',
    sessionType: '1:1',
    topic: 'System architecture discussion',
    status: 'Pending',
    requestedAt: '2024-03-16T11:45:00',
    studentProgress: 30,
    previousSessions: 0,
  },
  {
    id: 5,
    studentName: 'David Brown',
    studentEmail: 'david@example.com',
    course: 'React Advanced Patterns',
    requestedDate: '2024-03-29',
    requestedTime: '3:30 PM',
    sessionType: '1:1',
    topic: 'Performance optimization',
    status: 'Approved',
    requestedAt: '2024-03-14T16:00:00',
    approvedAt: '2024-03-14T18:30:00',
    studentProgress: 75,
    previousSessions: 4,
  },
  {
    id: 6,
    studentName: 'Emily Davis',
    studentEmail: 'emily@example.com',
    course: 'UI/UX Design Principles',
    requestedDate: '2024-03-30',
    requestedTime: '1:00 PM',
    sessionType: 'Career',
    topic: 'Design system implementation',
    status: 'Rejected',
    requestedAt: '2024-03-13T10:20:00',
    rejectedAt: '2024-03-13T15:00:00',
    rejectionReason: 'Time slot not available',
    studentProgress: 50,
    previousSessions: 2,
  },
]

function StudentRequests({ onBack }) {
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requests, setRequests] = useState(studentRequests)

  const filteredRequests = requests.filter((request) => {
    if (filter === 'all') return true
    return request.status.toLowerCase() === filter
  })

  const pendingCount = requests.filter(r => r.status === 'Pending').length
  const approvedCount = requests.filter(r => r.status === 'Approved').length
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length

  const handleApprove = (requestId) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? { ...req, status: 'Approved', approvedAt: new Date().toISOString() }
        : req
    ))
    setSelectedRequest(null)
  }

  const handleReject = (requestId, reason) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? { ...req, status: 'Rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason }
        : req
    ))
    setSelectedRequest(null)
  }

  const handleReschedule = (requestId, newDate, newTime) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId
        ? { ...req, requestedDate: newDate, requestedTime: newTime }
        : req
    ))
    setSelectedRequest(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#f59e0b'
      case 'Approved':
        return '#22c55e'
      case 'Rejected':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (selectedRequest) {
    const request = requests.find(r => r.id === selectedRequest)
    if (!request) {
      setSelectedRequest(null)
      return null
    }

    return (
      <div className="dashboard-page">
        <div className="course-detail-header">
          <button className="back-button" onClick={() => setSelectedRequest(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Request Details</h1>
        </div>

        <div className="request-detail-container">
          <div className="request-detail-card">
            <div className="request-detail-header">
              <div>
                <h2 className="request-student-name">{request.studentName}</h2>
                <p className="request-student-email">{request.studentEmail}</p>
              </div>
              <span
                className="request-status-badge"
                style={{
                  backgroundColor: `${getStatusColor(request.status)}20`,
                  color: getStatusColor(request.status),
                  borderColor: getStatusColor(request.status)
                }}
              >
                {request.status}
              </span>
            </div>

            <div className="request-detail-section">
              <h3 className="section-title">Session Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Course</span>
                  <span className="info-value">{request.course}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Session Type</span>
                  <span className="info-value">{request.sessionType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Requested Date</span>
                  <span className="info-value">{formatDate(request.requestedDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Requested Time</span>
                  <span className="info-value">{request.requestedTime}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Topic</span>
                  <span className="info-value">{request.topic}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Requested At</span>
                  <span className="info-value">{formatDateTime(request.requestedAt)}</span>
                </div>
              </div>
            </div>

            <div className="request-detail-section">
              <h3 className="section-title">Student Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Progress in Course</span>
                  <span className="info-value">{request.studentProgress}%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Previous Sessions</span>
                  <span className="info-value">{request.previousSessions}</span>
                </div>
              </div>
              <div className="progress-bar" style={{ marginTop: '12px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${request.studentProgress}%` }}
                ></div>
              </div>
            </div>

            {request.status === 'Rejected' && request.rejectionReason && (
              <div className="request-detail-section">
                <h3 className="section-title">Rejection Reason</h3>
                <p className="rejection-reason">{request.rejectionReason}</p>
              </div>
            )}

            {request.status === 'Pending' && (
              <div className="request-actions-section">
                <h3 className="section-title">Actions</h3>
                <div className="request-actions">
                  <button
                    className="btn-primary"
                    onClick={() => handleApprove(request.id)}
                  >
                    Approve Request
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      const newDate = prompt('Enter new date (YYYY-MM-DD):', request.requestedDate)
                      const newTime = prompt('Enter new time (e.g., 2:00 PM):', request.requestedTime)
                      if (newDate && newTime) {
                        handleReschedule(request.id, newDate, newTime)
                      }
                    }}
                  >
                    Reschedule
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:', 'Time slot not available')
                      if (reason) {
                        handleReject(request.id, reason)
                      }
                    }}
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            )}

            {request.status === 'Approved' && (
              <div className="request-actions-section">
                <h3 className="section-title">Session Approved</h3>
                <p className="approved-message">
                  This session has been approved. You can reschedule if needed.
                </p>
                <div className="request-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      const newDate = prompt('Enter new date (YYYY-MM-DD):', request.requestedDate)
                      const newTime = prompt('Enter new time (e.g., 2:00 PM):', request.requestedTime)
                      if (newDate && newTime) {
                        handleReschedule(request.id, newDate, newTime)
                      }
                    }}
                  >
                    Reschedule
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      const reason = prompt('Enter cancellation reason:', '')
                      if (reason) {
                        handleReject(request.id, reason)
                      }
                    }}
                  >
                    Cancel Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="course-detail-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <h1 className="page-title">Student Requests / Bookings</h1>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-section progress-overview-section">
        <div className="progress-overview-cards">
          <div className="progress-overview-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>⏳</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Pending</h3>
              <p className="progress-card-value" style={{ color: '#f59e0b', fontSize: '28px', fontWeight: '700' }}>
                {pendingCount}
              </p>
            </div>
          </div>
          <div className="progress-overview-card" style={{ borderTop: '4px solid #22c55e' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>✅</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Approved</h3>
              <p className="progress-card-value" style={{ color: '#22c55e', fontSize: '28px', fontWeight: '700' }}>
                {approvedCount}
              </p>
            </div>
          </div>
          <div className="progress-overview-card" style={{ borderTop: '4px solid #ef4444' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>❌</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Rejected</h3>
              <p className="progress-card-value" style={{ color: '#ef4444', fontSize: '28px', fontWeight: '700' }}>
                {rejectedCount}
              </p>
            </div>
          </div>
          <div className="progress-overview-card" style={{ borderTop: '4px solid #3b82f6' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>📋</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Total Requests</h3>
              <p className="progress-card-value" style={{ color: '#3b82f6', fontSize: '28px', fontWeight: '700' }}>
                {requests.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">Session Requests</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({requests.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({approvedCount})
            </button>
            <button
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="requests-list">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <p>No requests found matching your criteria.</p>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const statusColor = getStatusColor(request.status)

              return (
                <div key={request.id} className="request-card">
                  <div className="request-card-header">
                    <div className="request-student-info">
                      <div className="student-avatar">
                        <span>{request.studentName.charAt(0)}</span>
                      </div>
                      <div className="request-student-details">
                        <h3 className="request-student-name-small">{request.studentName}</h3>
                        <p className="request-student-email-small">{request.studentEmail}</p>
                      </div>
                    </div>
                    <span
                      className="request-status-badge"
                      style={{
                        backgroundColor: `${statusColor}20`,
                        color: statusColor,
                        borderColor: statusColor
                      }}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="request-card-content">
                    <div className="request-info-row">
                      <div className="request-info-item">
                        <span className="request-label">Course:</span>
                        <span className="request-value">{request.course}</span>
                      </div>
                      <div className="request-info-item">
                        <span className="request-label">Type:</span>
                        <span className="request-value">{request.sessionType}</span>
                      </div>
                    </div>
                    <div className="request-info-row">
                      <div className="request-info-item">
                        <span className="request-label">Date:</span>
                        <span className="request-value">{formatDate(request.requestedDate)}</span>
                      </div>
                      <div className="request-info-item">
                        <span className="request-label">Time:</span>
                        <span className="request-value">{request.requestedTime}</span>
                      </div>
                    </div>
                    <div className="request-topic">
                      <span className="request-label">Topic:</span>
                      <span className="request-value">{request.topic}</span>
                    </div>
                    <div className="request-student-stats">
                      <span className="request-stat">Progress: {request.studentProgress}%</span>
                      <span className="request-stat">Previous Sessions: {request.previousSessions}</span>
                    </div>
                  </div>

                  <div className="request-card-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      View Details
                    </button>
                    {request.status === 'Pending' && (
                      <>
                        <button
                          className="btn-primary"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:', 'Time slot not available')
                            if (reason) {
                              handleReject(request.id, reason)
                            }
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentRequests

