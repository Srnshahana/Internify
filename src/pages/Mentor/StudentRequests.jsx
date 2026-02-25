import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'
import Loading from '../../components/Loading'
import MessageModal from '../../components/shared/MessageModal.jsx'

function StudentRequests({ onBack }) {
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const showModal = (title, message, type = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type
    })
  }

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const authId = localStorage.getItem('auth_id')
      if (!authId) return

      // Fetch classes_enrolled for this mentor
      const { data, error } = await supabase
        .from('classes_enrolled')
        .select(`
          *,
          courses(title),
          student_details(name, profile_image)
        `)
        .eq('mentor_id', authId)

      if (error) throw error

      const mappedRequests = data.map(req => {
        // Map DB status to UI status
        let uiStatus = 'Pending'
        if (req.status === 'active') uiStatus = 'Approved'
        if (req.status === 'rejected') uiStatus = 'Rejected'

        return {
          id: req.id,
          studentName: req.student_details?.name || 'Unknown Student',
          studentEmail: '', // Email not in student_details schema
          course: req.courses?.title || 'Unknown Course',
          requestedDate: new Date().toISOString().split('T')[0], // Enrollment date not currently in schema
          requestedTime: 'Enrolling',
          sessionType: 'Enrollment',
          topic: 'New Course Enrollment',
          status: uiStatus,
          requestedAt: new Date().toISOString(),
          studentProgress: 0,
          previousSessions: 0,
          profile_image: req.student_details?.profile_image
        }
      })

      setRequests(mappedRequests)
    } catch (err) {
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter((request) => {
    if (filter === 'all') return true
    return request.status.toLowerCase() === filter
  })

  const pendingCount = requests.filter(r => r.status === 'Pending').length
  const approvedCount = requests.filter(r => r.status === 'Approved').length
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length

  const handleApprove = async (requestId) => {
    try {
      const { error } = await supabase
        .from('classes_enrolled')
        .update({ status: 'active' })
        .eq('id', requestId)

      if (error) throw error

      setRequests(prev => prev.map(req =>
        req.id === requestId
          ? { ...req, status: 'Approved', approvedAt: new Date().toISOString() }
          : req
      ))
      showModal('Success', 'Request approved successfully!', 'success')
      setSelectedRequest(null)
    } catch (err) {
      console.error('Error approving request:', err)
      showModal('Error', 'Failed to approve request. Please try again.', 'error')
    }
  }

  const handleReject = async (requestId, reason) => {
    try {
      const { error } = await supabase
        .from('classes_enrolled')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      if (error) throw error

      setRequests(prev => prev.map(req =>
        req.id === requestId
          ? { ...req, status: 'Rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason }
          : req
      ))
      showModal('Success', 'Request rejected.', 'success')
      setSelectedRequest(null)
    } catch (err) {
      console.error('Error rejecting request:', err)
      showModal('Error', 'Failed to reject request. Please try again.', 'error')
    }
  }

  const handleReschedule = (requestId, newDate, newTime) => {
    // Note: Enrollment requests don't strictly have scheduling, but keeping UI parity
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

  // --- Sub-components for Views ---

  const renderContent = () => {
    if (loading) {
      return <Loading fullScreen={true} />
    }

    if (selectedRequest) {
      const request = requests.find(r => r.id === selectedRequest)
      if (!request) {
        setSelectedRequest(null)
        return null
      }

      return (
        <div className="dashboard-section">
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
                <div className="request-student-info">
                  <div className="student-avatar" style={{ width: '48px', height: '48px', marginRight: '16px' }}>
                    {request.profile_image ? (
                      <img src={request.profile_image} alt={request.studentName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span>{request.studentName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="request-student-name">{request.studentName}</h2>
                    <p className="request-student-email">{request.studentEmail || 'No email provided'}</p>
                  </div>
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
                <h3 className="section-title">Request Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Course</span>
                    <span className="info-value">{request.course}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Request Type</span>
                    <span className="info-value">{request.sessionType}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date Submitted</span>
                    <span className="info-value">{formatDate(request.requestedDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Time</span>
                    <span className="info-value">{request.requestedTime}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Topic</span>
                    <span className="info-value">{request.topic}</span>
                  </div>
                </div>
              </div>

              <div className="request-detail-section">
                <h3 className="section-title">Student Overview</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Current Progress</span>
                    <span className="info-value">{request.studentProgress}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Prior Interaction</span>
                    <span className="info-value">{request.previousSessions} sessions</span>
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
                      Approve Enrollment
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:', 'Course prerequisites not met')
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
                  <h3 className="section-title">Enrolled</h3>
                  <p className="approved-message">
                    This student is now enrolled and can access the classroom materials.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="dashboard-section">
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
        <div className="progress-overview-section" style={{ marginBottom: '24px' }}>
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

        {/* Filters and List */}
        <div className="section-header-with-button">
          <h2 className="section-title">Course Enrollment Requests</h2>
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
                        {request.profile_image ? (
                          <img src={request.profile_image} alt={request.studentName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <span>{request.studentName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="request-student-details">
                        <h3 className="request-student-name-small">{request.studentName}</h3>
                        <p className="request-student-email-small">{request.studentEmail || 'No email'}</p>
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
                        <span className="request-label">Status:</span>
                        <span className="request-value">{request.status}</span>
                      </div>
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
                            const reason = prompt('Enter rejection reason:', 'Prerequisites not met')
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
    )
  }

  return (
    <div className="dashboard-page-new">
      {renderContent()}

      <MessageModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  )
}

export default StudentRequests

