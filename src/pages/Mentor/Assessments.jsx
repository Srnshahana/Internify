import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'

function Assessments({ onBack }) {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
  })

  // Mentor ID from auth
  const mentorId = localStorage.getItem('auth_id')

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          assessment_submissions (count),
          courses (title)
        `)
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setAssessments(data)
      }
    } catch (error) {
      console.error('Error fetching assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssessment = async () => {
    if (!newAssessment.title || !newAssessment.description || !newAssessment.course_id || !newAssessment.due_date) {
      alert('Please fill in all fields')
      return
    }

    try {
      const { error } = await supabase
        .from('assessments')
        .insert({
          title: newAssessment.title,
          description: newAssessment.description,
          course_id: newAssessment.course_id, // Assuming course_id is passed/selected
          mentor_id: mentorId,
          due_date: newAssessment.due_date,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      alert('Assessment created successfully!')
      setNewAssessment({ title: '', description: '', course_id: '', due_date: '' })
      setShowCreateForm(false)
      fetchAssessments() // Refresh list
    } catch (error) {
      console.error('Error creating assessment:', error)
      alert('Failed to create assessment: ' + error.message)
    }
  }

  const fetchSubmissions = async (assessmentId) => {
    try {
      // Fetch submissions with student details
      // Note: schema provided doesn't explicitly link student_details, assuming 'student_id' links to 'students' table or 'users'
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select(`
          *,
          student:student_id (name, email), 
          assessment_attachments (*)
        `)
        .eq('assessment_id', assessmentId)

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    }
  }

  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment)
    fetchSubmissions(assessment.id)
  }

  const handleMarkComplete = async (submissionId) => {
    try {
      const { error } = await supabase
        .from('assessment_submissions')
        .update({ status: 'completed', reviewed_at: new Date().toISOString() })
        .eq('id', submissionId)

      if (error) throw error

      // Update local state
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'completed' } : s))
      alert('Marked as complete!')
    } catch (error) {
      console.error('Error marking submission complete:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // --- Sub-components for Views ---

  if (selectedSubmission) {
    const submission = submissions.find(s => s.id === selectedSubmission)
    if (!submission) return null

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
              <div className="work-student-info">
                <div className="student-avatar">
                  <span>{submission.student?.name?.charAt(0) || 'S'}</span>
                </div>
                <div className="work-student-details">
                  <h3 className="work-student-name">{submission.student?.name || 'Student'}</h3>
                  <p className="work-student-email">{submission.student?.email || 'No Email'}</p>
                  <div className="work-student-progress">
                    <span>Submitted: {formatDate(submission.submitted_at)}</span>
                  </div>
                </div>
              </div>

              <div className="work-description-section">
                <h3 className="section-title">Text Submission</h3>
                <p className="submission-text">{submission.text_submission || 'No text provided.'}</p>
              </div>

              {submission.assessment_attachments && submission.assessment_attachments.length > 0 && (
                <div className="work-attachments-section">
                  <h3 className="section-title">Attachments</h3>
                  <div className="attachments-list">
                    {submission.assessment_attachments.map((att) => (
                      <div key={att.id} className="attachment-item">
                        <div className="attachment-icon">📎</div>
                        <div className="attachment-info">
                          <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="attachment-name">{att.file_name}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submission.status !== 'completed' && (
                <div className="work-review-actions">
                  <button className="btn-success btn-full" onClick={() => handleMarkComplete(submission.id)}>
                    Mark as Complete
                  </button>
                </div>
              )}
              {submission.status === 'completed' && <p className="reviewed-message">✓ Completed</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedAssessment) {
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
                  <h2 className="work-title">{selectedAssessment.title}</h2>
                  <p className="work-course">{selectedAssessment.courses?.title || `Course ID: ${selectedAssessment.course_id}`}</p>
                </div>

                <p className="work-description">{selectedAssessment.description}</p>
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">Due:</span> {formatDate(selectedAssessment.due_date)}</div>
                  <div className="info-item"><span className="info-label">Submissions:</span> {submissions.length}</div>
                </div>

                <div className="work-attachments-section">
                  <h3 className="section-title">Student Submissions</h3>
                  {submissions.length === 0 ? <p>No submissions yet.</p> : (
                    <div className="submissions-list">
                      {submissions.map(sub => (
                        <div key={sub.id} className="submission-item">
                          <div className="submission-header">
                            <h4>{sub.student?.name || `Student #${sub.student_id}`}</h4>
                            <span className={`submission-status ${sub.status}`}>{sub.status}</span>
                          </div>
                          <button className="btn-primary btn-small" onClick={() => setSelectedSubmission(sub.id)}>Review</button>
                        </div>
                      ))}
                    </div>
                  )}
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
          {/* Create button could invoke a modal or redirect, simplified here as we usually create via Live Class */}
        </div>

        {loading ? <p>Loading assessments...</p> : (
          <div className="assessments-list">
            {assessments.length === 0 ? <p>No active assessments.</p> : assessments.map(assessment => (
              <div key={assessment.id} className="assessment-card">
                <div className="assessment-header">
                  <div>
                    <h3 className="assessment-title">{assessment.title}</h3>
                    <p className="assessment-course">{assessment.courses?.title || 'General'}</p>
                  </div>
                </div>
                <div className="assessment-meta">
                  <div className="meta-item"><span className="meta-label">Due:</span> {formatDate(assessment.due_date)}</div>
                  <div className="meta-item"><span className="meta-label">Submissions:</span> {assessment.assessment_submissions?.[0]?.count || 0}</div>
                </div>
                <div className="assessment-actions">
                  <button className="btn-primary" onClick={() => handleViewAssessment(assessment)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Assessments
