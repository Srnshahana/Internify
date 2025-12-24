import { useState } from 'react'
import '../../App.css'

const pendingWork = [
  {
    id: 1,
    studentName: 'Sherin',
    studentEmail: 'sherin@example.com',
    course: 'React Advanced Patterns',
    assignmentTitle: 'Build Custom Hook Library',
    submissionDate: '2024-03-15T10:30:00',
    dueDate: '2024-03-20',
    status: 'Submitted',
    type: 'Assignment',
    description: 'Create a library of reusable custom hooks including useLocalStorage, useFetch, and useDebounce.',
    attachments: [
      { name: 'hooks-library.zip', type: 'zip', size: '2.4 MB' },
      { name: 'README.md', type: 'markdown', size: '12 KB' },
    ],
    studentProgress: 65,
  },
  {
    id: 2,
    studentName: 'Rahul',
    studentEmail: 'rahul@example.com',
    course: 'DSA Mastery',
    assignmentTitle: 'Algorithm Problem Set #5',
    submissionDate: '2024-03-14T15:20:00',
    dueDate: '2024-03-18',
    status: 'Submitted',
    type: 'Assignment',
    description: 'Solve problems on dynamic programming and graph algorithms.',
    attachments: [
      { name: 'solutions.py', type: 'python', size: '45 KB' },
    ],
    studentProgress: 85,
  },
  {
    id: 3,
    studentName: 'Fatima',
    studentEmail: 'fatima@example.com',
    course: 'UI/UX Design Principles',
    assignmentTitle: 'Design System Implementation',
    submissionDate: '2024-03-13T09:15:00',
    dueDate: '2024-03-18',
    status: 'Submitted',
    type: 'Project',
    description: 'Create a complete design system with components, colors, typography, and spacing guidelines.',
    attachments: [
      { name: 'design-system.figma', type: 'figma', size: '8.2 MB' },
      { name: 'documentation.pdf', type: 'pdf', size: '1.5 MB' },
    ],
    studentProgress: 40,
  },
  {
    id: 4,
    studentName: 'Priya',
    studentEmail: 'priya@example.com',
    course: 'React Advanced Patterns',
    assignmentTitle: 'Code Review Request',
    submissionDate: '2024-03-12T14:45:00',
    dueDate: 'N/A',
    status: 'Submitted',
    type: 'Code Review',
    description: 'Please review my React component refactoring. Looking for feedback on performance optimization.',
    attachments: [
      { name: 'components-refactored.zip', type: 'zip', size: '1.8 MB' },
    ],
    studentProgress: 75,
  },
  {
    id: 5,
    studentName: 'Amit',
    studentEmail: 'amit@example.com',
    course: 'System Design Fundamentals',
    assignmentTitle: 'System Architecture Design',
    submissionDate: '2024-03-11T11:30:00',
    dueDate: '2024-03-15',
    status: 'Submitted',
    type: 'Project',
    description: 'Design a scalable e-commerce system architecture with database schema and API design.',
    attachments: [
      { name: 'architecture-diagram.pdf', type: 'pdf', size: '3.2 MB' },
      { name: 'api-documentation.md', type: 'markdown', size: '28 KB' },
    ],
    studentProgress: 55,
  },
]

function PendingWork({ onBack }) {
  const [filter, setFilter] = useState('all') // all, assignment, project, code-review
  const [selectedWork, setSelectedWork] = useState(null)
  const [reviewedWork, setReviewedWork] = useState(new Set())

  const filteredWork = pendingWork.filter((work) => {
    if (filter === 'all') return true
    return work.type.toLowerCase().replace(' ', '-') === filter
  })

  const handleApprove = (workId) => {
    setReviewedWork(prev => new Set([...prev, workId]))
    setSelectedWork(null)
  }

  const handleRequestRevision = (workId, feedback) => {
    setReviewedWork(prev => new Set([...prev, workId]))
    setSelectedWork(null)
  }

  const handleReject = (workId, reason) => {
    setReviewedWork(prev => new Set([...prev, workId]))
    setSelectedWork(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Assignment':
        return '#3b82f6'
      case 'Project':
        return '#8b5cf6'
      case 'Code Review':
        return '#22c55e'
      default:
        return '#6b7280'
    }
  }

  if (selectedWork) {
    const work = pendingWork.find(w => w.id === selectedWork)
    if (!work) {
      setSelectedWork(null)
      return null
    }

    const isReviewed = reviewedWork.has(work.id)
    const typeColor = getTypeColor(work.type)

    return (
      <div className="dashboard-page">
        <div className="course-detail-header">
          <button className="back-button" onClick={() => setSelectedWork(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Review Work</h1>
        </div>

        <div className="work-review-container">
          <div className="work-review-card">
            <div className="work-review-header">
              <div>
                <div className="work-type-badge" style={{ backgroundColor: `${typeColor}20`, color: typeColor, borderColor: typeColor }}>
                  {work.type}
                </div>
                <h2 className="work-title">{work.assignmentTitle}</h2>
                <p className="work-course">{work.course}</p>
              </div>
              {isReviewed && (
                <span className="reviewed-badge">
                  ✓ Reviewed
                </span>
              )}
            </div>

            <div className="work-student-info">
              <div className="student-avatar">
                <span>{work.studentName.charAt(0)}</span>
              </div>
              <div className="work-student-details">
                <h3 className="work-student-name">{work.studentName}</h3>
                <p className="work-student-email">{work.studentEmail}</p>
                <div className="work-student-progress">
                  <span>Progress: {work.studentProgress}%</span>
                </div>
              </div>
            </div>

            <div className="work-details-section">
              <h3 className="section-title">Assignment Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Submitted:</span>
                  <span className="info-value">{formatDate(work.submissionDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Due Date:</span>
                  <span className="info-value">{work.dueDate === 'N/A' ? 'N/A' : formatDate(work.dueDate)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{work.status}</span>
                </div>
              </div>
            </div>

            <div className="work-description-section">
              <h3 className="section-title">Description</h3>
              <p className="work-description">{work.description}</p>
            </div>

            <div className="work-attachments-section">
              <h3 className="section-title">Attachments</h3>
              <div className="attachments-list">
                {work.attachments.map((attachment, idx) => (
                  <div key={idx} className="attachment-item">
                    <div className="attachment-icon">
                      {attachment.type === 'pdf' && '📄'}
                      {attachment.type === 'zip' && '📦'}
                      {attachment.type === 'figma' && '🎨'}
                      {attachment.type === 'python' && '🐍'}
                      {attachment.type === 'markdown' && '📝'}
                    </div>
                    <div className="attachment-info">
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">{attachment.size}</span>
                    </div>
                    <button className="btn-secondary btn-small">Download</button>
                  </div>
                ))}
              </div>
            </div>

            {!isReviewed && (
              <div className="work-review-actions">
                <h3 className="section-title">Review Actions</h3>
                <div className="review-actions-grid">
                  <button 
                    className="btn-success"
                    onClick={() => handleApprove(work.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Approve
                  </button>
                  <button 
                    className="btn-warning"
                    onClick={() => {
                      const feedback = prompt('Enter revision feedback:', '')
                      if (feedback) {
                        handleRequestRevision(work.id, feedback)
                      }
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Request Revision
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:', '')
                      if (reason) {
                        handleReject(work.id, reason)
                      }
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            )}

            {isReviewed && (
              <div className="reviewed-message">
                <p>✓ This work has been reviewed.</p>
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
        <h1 className="page-title">Review Pending Work</h1>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-section progress-overview-section">
        <div className="progress-overview-cards">
          <div className="progress-overview-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>⏳</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Pending Review</h3>
              <p className="progress-card-value" style={{ color: '#f59e0b', fontSize: '28px', fontWeight: '700' }}>
                {pendingWork.length - reviewedWork.size}
              </p>
            </div>
          </div>
          <div className="progress-overview-card" style={{ borderTop: '4px solid #22c55e' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>✅</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Reviewed</h3>
              <p className="progress-card-value" style={{ color: '#22c55e', fontSize: '28px', fontWeight: '700' }}>
                {reviewedWork.size}
              </p>
            </div>
          </div>
          <div className="progress-overview-card" style={{ borderTop: '4px solid #3b82f6' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>📋</div>
            <div className="progress-card-content">
              <h3 className="progress-card-title">Total Submissions</h3>
              <p className="progress-card-value" style={{ color: '#3b82f6', fontSize: '28px', fontWeight: '700' }}>
                {pendingWork.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">Pending Work</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({pendingWork.length})
            </button>
            <button
              className={`filter-btn ${filter === 'assignment' ? 'active' : ''}`}
              onClick={() => setFilter('assignment')}
            >
              Assignments ({pendingWork.filter(w => w.type === 'Assignment').length})
            </button>
            <button
              className={`filter-btn ${filter === 'project' ? 'active' : ''}`}
              onClick={() => setFilter('project')}
            >
              Projects ({pendingWork.filter(w => w.type === 'Project').length})
            </button>
            <button
              className={`filter-btn ${filter === 'code-review' ? 'active' : ''}`}
              onClick={() => setFilter('code-review')}
            >
              Code Reviews ({pendingWork.filter(w => w.type === 'Code Review').length})
            </button>
          </div>
        </div>

        {/* Work List */}
        <div className="pending-work-list">
          {filteredWork.length === 0 ? (
            <div className="empty-state">
              <p>No pending work found matching your criteria.</p>
            </div>
          ) : (
            filteredWork.map((work) => {
              const typeColor = getTypeColor(work.type)
              const isReviewed = reviewedWork.has(work.id)
              
              return (
                <div key={work.id} className={`work-card ${isReviewed ? 'reviewed' : ''}`}>
                  <div className="work-card-header">
                    <div className="work-card-info">
                      <div className="work-type-badge" style={{ backgroundColor: `${typeColor}20`, color: typeColor, borderColor: typeColor }}>
                        {work.type}
                      </div>
                      <div>
                        <h3 className="work-card-title">{work.assignmentTitle}</h3>
                        <p className="work-card-course">{work.course}</p>
                      </div>
                    </div>
                    {isReviewed && (
                      <span className="reviewed-badge-small">✓ Reviewed</span>
                    )}
                  </div>

                  <div className="work-card-student">
                    <div className="student-avatar-small">
                      <span>{work.studentName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="work-card-student-name">{work.studentName}</p>
                      <p className="work-card-student-email">{work.studentEmail}</p>
                    </div>
                  </div>

                  <div className="work-card-meta">
                    <div className="work-meta-item">
                      <span className="meta-label">Submitted:</span>
                      <span className="meta-value">{formatDate(work.submissionDate)}</span>
                    </div>
                    <div className="work-meta-item">
                      <span className="meta-label">Due:</span>
                      <span className="meta-value">{work.dueDate === 'N/A' ? 'N/A' : formatDate(work.dueDate)}</span>
                    </div>
                    <div className="work-meta-item">
                      <span className="meta-label">Attachments:</span>
                      <span className="meta-value">{work.attachments.length} file(s)</span>
                    </div>
                  </div>

                  <p className="work-card-description">{work.description}</p>

                  <div className="work-card-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => setSelectedWork(work.id)}
                    >
                      Review Work
                    </button>
                    <button className="btn-secondary">
                      Message Student
                    </button>
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

export default PendingWork

