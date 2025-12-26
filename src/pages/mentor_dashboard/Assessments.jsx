import { useState } from 'react'
import '../../App.css'

// Sample students data for sending assessments
const availableStudents = [
  { id: 1, name: 'Sherin', email: 'sherin@example.com', course: 'React Advanced Patterns' },
  { id: 2, name: 'Rahul', email: 'rahul@example.com', course: 'React Advanced Patterns' },
  { id: 3, name: 'Fatima', email: 'fatima@example.com', course: 'UI/UX Design Principles' },
  { id: 4, name: 'Priya', email: 'priya@example.com', course: 'React Advanced Patterns' },
  { id: 5, name: 'Amit', email: 'amit@example.com', course: 'UI/UX Design Principles' },
  { id: 6, name: 'Sara', email: 'sara@example.com', course: 'DSA Mastery' },
]

// Sample assessments data
const initialAssessments = [
  {
    id: 1,
    title: 'React Hooks Implementation',
    description: 'Create a custom hook for managing form state with validation. Submit your code and a brief explanation.',
    course: 'React Advanced Patterns',
    dueDate: '2024-03-25',
    createdDate: '2024-03-15',
    status: 'active',
    sentTo: [1, 2, 4], // Student IDs who received this assessment
    submissions: [
      {
        id: 1,
        studentName: 'Sherin',
        studentEmail: 'sherin@example.com',
        submittedDate: '2024-03-20T10:30:00',
        status: 'submitted',
        textSubmission: 'I created a useForm hook that handles validation and state management.',
        attachments: [
          { name: 'useForm.js', type: 'javascript', size: '5.2 KB' },
          { name: 'example-usage.js', type: 'javascript', size: '3.1 KB' },
        ],
      },
      {
        id: 2,
        studentName: 'Rahul',
        studentEmail: 'rahul@example.com',
        submittedDate: '2024-03-22T14:15:00',
        status: 'submitted',
        textSubmission: 'Here is my implementation with TypeScript support.',
        attachments: [
          { name: 'useForm.ts', type: 'typescript', size: '6.8 KB' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Design System Components',
    description: 'Design and implement 5 reusable UI components for a design system. Include documentation.',
    course: 'UI/UX Design Principles',
    dueDate: '2024-03-28',
    createdDate: '2024-03-18',
    status: 'active',
    sentTo: [3, 5], // Student IDs who received this assessment
    submissions: [
      {
        id: 3,
        studentName: 'Fatima',
        studentEmail: 'fatima@example.com',
        submittedDate: '2024-03-24T09:20:00',
        status: 'submitted',
        textSubmission: 'I designed Button, Input, Card, Modal, and Dropdown components.',
        attachments: [
          { name: 'components.figma', type: 'figma', size: '12.5 MB' },
          { name: 'documentation.pdf', type: 'pdf', size: '2.1 MB' },
        ],
      },
    ],
  },
]

function Assessments({ onBack }) {
  const [assessments, setAssessments] = useState(initialAssessments)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showSendForm, setShowSendForm] = useState(false)
  const [assessmentToSend, setAssessmentToSend] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
  })

  const handleCreateAssessment = () => {
    if (!newAssessment.title || !newAssessment.description || !newAssessment.course || !newAssessment.dueDate) {
      alert('Please fill in all fields')
      return
    }

    const assessment = {
      id: assessments.length + 1,
      ...newAssessment,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
      sentTo: [], // No students sent to yet
      submissions: [],
    }

    setAssessments([...assessments, assessment])
    setNewAssessment({ title: '', description: '', course: '', dueDate: '' })
    setShowCreateForm(false)
    // Automatically open send form after creating
    setAssessmentToSend(assessment.id)
    setShowSendForm(true)
  }

  const handleOpenSendForm = (assessmentId) => {
    const assessment = assessments.find(a => a.id === assessmentId)
    if (assessment) {
      setAssessmentToSend(assessmentId)
      setSelectedStudents(assessment.sentTo || [])
      setShowSendForm(true)
    }
  }

  const handleSendAssessment = () => {
    if (!assessmentToSend || selectedStudents.length === 0) {
      alert('Please select at least one student')
      return
    }

    setAssessments(assessments.map(assessment => {
      if (assessment.id === assessmentToSend) {
        return {
          ...assessment,
          sentTo: [...new Set([...(assessment.sentTo || []), ...selectedStudents])], // Merge and remove duplicates
        }
      }
      return assessment
    }))

    alert(`Assessment sent to ${selectedStudents.length} student(s)!`)
    setShowSendForm(false)
    setAssessmentToSend(null)
    setSelectedStudents([])
  }

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId)
      } else {
        return [...prev, studentId]
      }
    })
  }

  const getStudentsForCourse = (courseName) => {
    return availableStudents.filter(student => student.course === courseName)
  }

  const handleMarkComplete = (assessmentId, submissionId) => {
    setAssessments(assessments.map(assessment => {
      if (assessment.id === assessmentId) {
        return {
          ...assessment,
          submissions: assessment.submissions.map(sub => 
            sub.id === submissionId 
              ? { ...sub, status: 'completed' }
              : sub
          ),
        }
      }
      return assessment
    }))
    setSelectedSubmission(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (showSendForm && assessmentToSend) {
    const assessment = assessments.find(a => a.id === assessmentToSend)
    if (!assessment) {
      setShowSendForm(false)
      setAssessmentToSend(null)
      return null
    }

    const courseStudents = getStudentsForCourse(assessment.course)
    const sentToIds = assessment.sentTo || []

    return (
      <div className="dashboard-page-new">
        <div className="dashboard-section">
          <div className="course-detail-header">
            <button className="back-button" onClick={() => {
              setShowSendForm(false)
              setAssessmentToSend(null)
              setSelectedStudents([])
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back
            </button>
            <h1 className="page-title">Send Assessment</h1>
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
              <h3 className="section-title">Select Students</h3>
              <p className="section-subtitle">Choose which students should receive this assessment</p>
              
              {courseStudents.length === 0 ? (
                <div className="empty-state">
                  <p>No students enrolled in this course yet.</p>
                </div>
              ) : (
                <div className="students-selection-list">
                  {courseStudents.map((student) => {
                    const isSelected = selectedStudents.includes(student.id)
                    const alreadySent = sentToIds.includes(student.id)
                    
                    return (
                      <div 
                        key={student.id} 
                        className={`student-selection-item ${isSelected ? 'selected' : ''} ${alreadySent ? 'already-sent' : ''}`}
                        onClick={() => !alreadySent && toggleStudentSelection(student.id)}
                        style={{ cursor: alreadySent ? 'not-allowed' : 'pointer' }}
                      >
                        <div className="student-selection-checkbox">
                          {alreadySent ? (
                            <span className="sent-badge">✓ Sent</span>
                          ) : (
                            <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                              {isSelected && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="student-selection-info">
                          <h4 className="student-selection-name">{student.name}</h4>
                          <p className="student-selection-email">{student.email}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="work-review-actions" style={{ marginTop: '24px' }}>
                <button 
                  className="btn-primary btn-full"
                  onClick={handleSendAssessment}
                  disabled={selectedStudents.length === 0}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Send to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                </button>
                <button 
                  className="btn-secondary btn-full"
                  onClick={() => {
                    setShowSendForm(false)
                    setAssessmentToSend(null)
                    setSelectedStudents([])
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedSubmission) {
    const assessment = assessments.find(a => 
      a.submissions.some(s => s.id === selectedSubmission)
    )
    const submission = assessment?.submissions.find(s => s.id === selectedSubmission)

    if (!submission) {
      setSelectedSubmission(null)
      return null
    }

    return (
      <div className="dashboard-page-new">
        <div className="dashboard-section">
          <div className="course-detail-header">
            <button className="back-button" onClick={() => setSelectedSubmission(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Review Submission</h1>
        </div>

        <div className="work-review-container">
          <div className="work-review-card">
            <div className="work-review-header">
              <div>
                <h2 className="work-title">{assessment.title}</h2>
                <p className="work-course">{assessment.course}</p>
              </div>
              {submission.status === 'completed' && (
                <span className="reviewed-badge">✓ Completed</span>
              )}
            </div>

            <div className="work-student-info">
              <div className="student-avatar">
                <span>{submission.studentName.charAt(0)}</span>
              </div>
              <div className="work-student-details">
                <h3 className="work-student-name">{submission.studentName}</h3>
                <p className="work-student-email">{submission.studentEmail}</p>
                <div className="work-student-progress">
                  <span>Submitted: {formatDate(submission.submittedDate)}</span>
                </div>
              </div>
            </div>

            <div className="work-description-section">
              <h3 className="section-title">Student Submission</h3>
              <div className="submission-text">
                {submission.textSubmission || 'No text submission provided.'}
              </div>
            </div>

            {submission.attachments && submission.attachments.length > 0 && (
              <div className="work-attachments-section">
                <h3 className="section-title">Attachments</h3>
                <div className="attachments-list">
                  {submission.attachments.map((attachment, idx) => (
                    <div key={idx} className="attachment-item">
                      <div className="attachment-icon">
                        {attachment.type === 'pdf' && '📄'}
                        {attachment.type === 'javascript' && '📜'}
                        {attachment.type === 'typescript' && '📘'}
                        {attachment.type === 'figma' && '🎨'}
                        {attachment.type === 'zip' && '📦'}
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
            )}

            {submission.status !== 'completed' && (
              <div className="work-review-actions">
                <button 
                  className="btn-success btn-full"
                  onClick={() => handleMarkComplete(assessment.id, submission.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Mark as Complete
                </button>
              </div>
            )}

            {submission.status === 'completed' && (
              <div className="reviewed-message">
                <p>✓ This assessment has been marked as complete.</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    )
  }

  if (selectedAssessment) {
    const assessment = assessments.find(a => a.id === selectedAssessment)
    if (!assessment) {
      setSelectedAssessment(null)
      return null
    }

    return (
      <div className="dashboard-page-new">
        <div className="dashboard-section">
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
              <span className={`work-type-badge ${assessment.status === 'active' ? 'active' : 'completed'}`}>
                {assessment.status}
              </span>
            </div>

            <div className="work-description-section">
              <h3 className="section-title">Instructions</h3>
              <p className="work-description">{assessment.description}</p>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">{formatDate(assessment.createdDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Due Date:</span>
                <span className="info-value">{formatDate(assessment.dueDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Submissions:</span>
                <span className="info-value">{assessment.submissions.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Completed:</span>
                <span className="info-value">
                  {assessment.submissions.filter(s => s.status === 'completed').length}
                </span>
              </div>
            </div>

            {assessment.submissions.length > 0 && (
              <div className="work-attachments-section">
                <h3 className="section-title">Student Submissions</h3>
                <div className="submissions-list">
                  {assessment.submissions.map((submission) => (
                    <div key={submission.id} className="submission-item">
                      <div className="submission-header">
                        <div>
                          <h4 className="submission-student-name">{submission.studentName}</h4>
                          <p className="submission-date">Submitted: {formatDate(submission.submittedDate)}</p>
                        </div>
                        <span className={`submission-status ${submission.status}`}>
                          {submission.status === 'completed' ? '✓ Completed' : 'Pending Review'}
                        </span>
                      </div>
                      <p className="submission-preview">{submission.textSubmission?.substring(0, 100)}...</p>
                      <button 
                        className="btn-primary btn-small"
                        onClick={() => setSelectedSubmission(submission.id)}
                      >
                        Review Submission
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {assessment.submissions.length === 0 && (
              <div className="empty-state">
                <p>No submissions yet.</p>
              </div>
            )}

            <div className="work-review-actions" style={{ marginTop: '24px' }}>
              <button 
                className="btn-primary btn-full"
                onClick={() => handleOpenSendForm(assessment.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                {assessment.sentTo && assessment.sentTo.length > 0 ? 'Send to More Students' : 'Send Assessment'}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

  if (showCreateForm) {
    return (
      <div className="dashboard-page-new">
        <div className="dashboard-section">
          <div className="course-detail-header">
          <button className="back-button" onClick={() => setShowCreateForm(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Create Assessment</h1>
        </div>

        <div className="work-review-container">
          <div className="work-review-card">
            <div className="work-description-section">
              <h3 className="section-title">Assessment Details</h3>
              
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., React Hooks Implementation"
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., React Advanced Patterns"
                  value={newAssessment.course}
                  onChange={(e) => setNewAssessment({ ...newAssessment, course: e.target.value })}
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

              <div className="form-group">
                <label className="form-label">Instructions / What to Do</label>
                <textarea
                  className="form-textarea"
                  rows="8"
                  placeholder="Describe what students need to do for this assessment. Include requirements, deliverables, and any specific instructions..."
                  value={newAssessment.description}
                  onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                />
              </div>

              <div className="work-review-actions">
                <button 
                  className="btn-primary btn-full"
                  onClick={handleCreateAssessment}
                >
                  Create & Send Assessment
                </button>
                <button 
                  className="btn-secondary btn-full"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page-new">
      <div className="dashboard-section">
        <div className="course-detail-header">
          <button className="back-button" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Assessments</h1>
        </div>
        <div className="section-header-with-button">
          <h2 className="section-title">All Assessments</h2>
          <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Assessment
          </button>
        </div>

        <div className="assessments-list">
          {assessments.length === 0 ? (
            <div className="empty-state">
              <p>No assessments created yet. Create your first assessment to get started.</p>
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
                    {assessment.status}
                  </span>
                </div>
                
                <p className="assessment-description">{assessment.description}</p>
                
                <div className="assessment-meta">
                  <div className="meta-item">
                    <span className="meta-label">Due:</span>
                    <span className="meta-value">{formatDate(assessment.dueDate)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Sent To:</span>
                    <span className="meta-value">
                      {assessment.sentTo ? assessment.sentTo.length : 0} student{(assessment.sentTo?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Submissions:</span>
                    <span className="meta-value">{assessment.submissions.length}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Completed:</span>
                    <span className="meta-value">
                      {assessment.submissions.filter(s => s.status === 'completed').length}
                    </span>
                  </div>
                </div>

                <div className="assessment-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setSelectedAssessment(assessment.id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleOpenSendForm(assessment.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    {assessment.sentTo && assessment.sentTo.length > 0 ? 'Send to More' : 'Send'}
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

export default Assessments

