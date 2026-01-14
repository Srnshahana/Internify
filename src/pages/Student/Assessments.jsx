import { useState } from 'react'
import '../../App.css'

// Sample assessments assigned to student
const studentAssessments = [
  {
    id: 1,
    title: 'React Hooks Implementation',
    description: 'Create a custom hook for managing form state with validation. Submit your code and a brief explanation.',
    course: 'React Advanced Patterns',
    dueDate: '2024-03-25',
    assignedDate: '2024-03-15',
    status: 'pending',
    submission: null,
  },
  {
    id: 2,
    title: 'Design System Components',
    description: 'Design and implement 5 reusable UI components for a design system. Include documentation.',
    course: 'UI/UX Design Principles',
    dueDate: '2024-03-28',
    assignedDate: '2024-03-18',
    status: 'submitted',
    submission: {
      submittedDate: '2024-03-24T09:20:00',
      textSubmission: 'I designed Button, Input, Card, Modal, and Dropdown components with proper documentation.',
      attachments: [
        { name: 'components.figma', type: 'figma', size: '12.5 MB' },
        { name: 'documentation.pdf', type: 'pdf', size: '2.1 MB' },
      ],
      status: 'submitted',
    },
  },
  {
    id: 3,
    title: 'Algorithm Problem Set',
    description: 'Solve the following problems: Binary Tree Traversal, Graph DFS, and Dynamic Programming basics.',
    course: 'DSA Mastery',
    dueDate: '2024-03-30',
    assignedDate: '2024-03-20',
    status: 'pending',
    submission: null,
  },
]

function StudentAssessments({ onBack }) {
  const [assessments, setAssessments] = useState(studentAssessments)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submissionData, setSubmissionData] = useState({
    textSubmission: '',
    attachments: [],
  })

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.name.split('.').pop(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file: file,
    }))
    setSubmissionData({
      ...submissionData,
      attachments: [...submissionData.attachments, ...newAttachments],
    })
  }

  const handleRemoveAttachment = (index) => {
    setSubmissionData({
      ...submissionData,
      attachments: submissionData.attachments.filter((_, i) => i !== index),
    })
  }

  const handleSubmitAssessment = () => {
    if (!submissionData.textSubmission && submissionData.attachments.length === 0) {
      alert('Please provide either text submission or attach files')
      return
    }

    const updatedAssessments = assessments.map(assessment => {
      if (assessment.id === selectedAssessment) {
        return {
          ...assessment,
          status: 'submitted',
          submission: {
            submittedDate: new Date().toISOString(),
            textSubmission: submissionData.textSubmission,
            attachments: submissionData.attachments.map(a => ({
              name: a.name,
              type: a.type,
              size: a.size,
            })),
            status: 'submitted',
          },
        }
      }
      return assessment
    })

    setAssessments(updatedAssessments)
    setSubmissionData({ textSubmission: '', attachments: [] })
    setShowSubmitForm(false)
    setSelectedAssessment(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (showSubmitForm && selectedAssessment) {
    const assessment = assessments.find(a => a.id === selectedAssessment)
    if (!assessment) {
      setShowSubmitForm(false)
      setSelectedAssessment(null)
      return null
    }

    return (
      <div className="dashboard-page">
        <div className="course-detail-header">
          <button className="back-button" onClick={() => {
            setShowSubmitForm(false)
            setSubmissionData({ textSubmission: '', attachments: [] })
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Submit Assessment</h1>
        </div>

        <div className="work-review-container">
          <div className="work-review-card">
            <div className="work-review-header">
              <div>
                <h2 className="work-title">{assessment.title}</h2>
                <p className="work-course">{assessment.course}</p>
              </div>
            </div>

            <div className="work-description-section">
              <h3 className="section-title">Instructions</h3>
              <p className="work-description">{assessment.description}</p>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Due Date:</span>
                <span className="info-value">{formatDate(assessment.dueDate)}</span>
              </div>
            </div>

            <div className="work-description-section">
              <h3 className="section-title">Your Submission</h3>
              
              <div className="form-group">
                <label className="form-label">Text Response / Description</label>
                <textarea
                  className="form-textarea"
                  rows="8"
                  placeholder="Describe your work, explain your approach, or provide any additional context..."
                  value={submissionData.textSubmission}
                  onChange={(e) => setSubmissionData({ ...submissionData, textSubmission: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attach Files / Documents</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    className="file-input"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Click to upload files or drag and drop
                  </label>
                </div>

                {submissionData.attachments.length > 0 && (
                  <div className="attachments-list">
                    {submissionData.attachments.map((attachment, idx) => (
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
                          onClick={() => handleRemoveAttachment(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="work-review-actions">
                <button 
                  className="btn-primary btn-full"
                  onClick={handleSubmitAssessment}
                >
                  Submit Assessment
                </button>
                <button 
                  className="btn-secondary btn-full"
                  onClick={() => {
                    setShowSubmitForm(false)
                    setSubmissionData({ textSubmission: '', attachments: [] })
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedAssessment && !showSubmitForm) {
    const assessment = assessments.find(a => a.id === selectedAssessment)
    if (!assessment) {
      setSelectedAssessment(null)
      return null
    }

    return (
      <div className="dashboard-page">
        <div className="course-detail-header">
          <button className="back-button" onClick={() => setSelectedAssessment(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Assessment Details</h1>
        </div>

        <div className="work-review-container">
          <div className="work-review-card">
            <div className="work-review-header">
              <div>
                <h2 className="work-title">{assessment.title}</h2>
                <p className="work-course">{assessment.course}</p>
              </div>
              <span className={`assessment-status ${assessment.status}`}>
                {assessment.status === 'submitted' ? 'Submitted' : 'Pending'}
              </span>
            </div>

            <div className="work-description-section">
              <h3 className="section-title">Instructions</h3>
              <p className="work-description">{assessment.description}</p>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Assigned:</span>
                <span className="info-value">{formatDate(assessment.assignedDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Due Date:</span>
                <span className="info-value">{formatDate(assessment.dueDate)}</span>
              </div>
            </div>

            {assessment.submission && (
              <div className="work-description-section">
                <h3 className="section-title">Your Submission</h3>
                <div className="submission-text">
                  {assessment.submission.textSubmission}
                </div>
                {assessment.submission.attachments && assessment.submission.attachments.length > 0 && (
                  <div className="work-attachments-section">
                    <h4 className="section-subtitle">Attachments</h4>
                    <div className="attachments-list">
                      {assessment.submission.attachments.map((attachment, idx) => (
                        <div key={idx} className="attachment-item">
                          <div className="attachment-icon">
                            {attachment.type === 'pdf' && '📄'}
                            {attachment.type === 'figma' && '🎨'}
                          </div>
                          <div className="attachment-info">
                            <span className="attachment-name">{attachment.name}</span>
                            <span className="attachment-size">{attachment.size}</span>
                          </div>
                          <button className="btn-secondary btn-small">View</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="submission-status-info">
                  <p>Submitted on: {formatDate(assessment.submission.submittedDate)}</p>
                  <p>Status: {assessment.submission.status === 'completed' ? '✓ Completed by Mentor' : 'Pending Review'}</p>
                </div>
              </div>
            )}

            {!assessment.submission && (
              <div className="work-review-actions">
                <button 
                  className="btn-primary btn-full"
                  onClick={() => setShowSubmitForm(true)}
                >
                  Submit Assessment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const pendingCount = assessments.filter(a => a.status === 'pending').length
  const submittedCount = assessments.filter(a => a.status === 'submitted').length

  return (
    <div className="dashboard-page">
      <div className="course-detail-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>
        <h1 className="page-title">My Assessments</h1>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-section progress-overview-section">
        <div className="progress-overview-cards">
          <div className="progress-overview-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="progress-card-icon" style={{ fontSize: '32px' }}>📝</div>
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
              <h3 className="progress-card-title">Submitted</h3>
              <p className="progress-card-value" style={{ color: '#22c55e', fontSize: '28px', fontWeight: '700' }}>
                {submittedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">All Assessments</h2>
        <div className="assessments-list">
          {assessments.length === 0 ? (
            <div className="empty-state">
              <p>No assessments assigned yet.</p>
            </div>
          ) : (
            assessments.map((assessment) => (
              <div key={assessment.id} className="assessment-card">
                <div className="assessment-header">
                  <div>
                    <h3 className="assessment-title">{assessment.title}</h3>
                    <p className="assessment-course">{assessment.course}</p>
                  </div>
                  <span className={`assessment-status ${assessment.status}`}>
                    {assessment.status === 'submitted' ? 'Submitted' : 'Pending'}
                  </span>
                </div>
                
                <p className="assessment-description">{assessment.description}</p>
                
                <div className="assessment-meta">
                  <div className="meta-item">
                    <span className="meta-label">Due:</span>
                    <span className="meta-value">{formatDate(assessment.dueDate)}</span>
                  </div>
                  {assessment.submission && (
                    <div className="meta-item">
                      <span className="meta-label">Submitted:</span>
                      <span className="meta-value">{formatDate(assessment.submission.submittedDate)}</span>
                    </div>
                  )}
                </div>

                <div className="assessment-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setSelectedAssessment(assessment.id)}
                  >
                    {assessment.submission ? 'View Submission' : 'Start Assessment'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentAssessments

