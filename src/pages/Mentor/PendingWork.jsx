import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'

function PendingWork({ onBack }) {
  const [filter, setFilter] = useState('all')
  const [selectedWorkId, setSelectedWorkId] = useState(null)
  const [pendingWork, setPendingWork] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')

  const mentorId = localStorage.getItem('auth_id')

  useEffect(() => {
    fetchPendingWork()
  }, [mentorId])

  const fetchPendingWork = async () => {
    try {
      setLoading(true)
      // 1. Fetch submissions with assessment and course info
      const { data: submissions, error: subError } = await supabase
        .from('assessment_submissions')
        .select(`
          *,
          assessments:assessment_id (
            title,
            description,
            due_date,
            courses (title)
          )
        `)
        .eq('status', 'submitted')

      if (subError) throw subError
      if (!submissions || submissions.length === 0) {
        setPendingWork([])
        return
      }

      // 2. Fetch student details for all unique student_ids in the submissions
      const studentIds = [...new Set(submissions.map(s => s.student_id))]
      const { data: students, error: studentError } = await supabase
        .from('student_details')
        .select('student_id, name, profile_image')
        .in('student_id', studentIds)

      if (studentError) {
        console.error('Error fetching student details:', studentError)
      }

      // 3. Merge student data into submissions
      const studentMap = new Map(students?.map(s => [s.student_id, s]) || [])
      const merged = submissions.map(s => ({
        ...s,
        student_details: studentMap.get(s.student_id) || { name: `Student #${s.student_id}` }
      }))

      setPendingWork(merged)
    } catch (err) {
      console.error('Error fetching pending work:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId) => {
    try {
      const { error } = await supabase
        .from('assessment_submissions')
        .update({
          status: 'completed',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId)

      if (error) throw error
      alert('Work approved successfully!')
      setSelectedWorkId(null)
      fetchPendingWork()
    } catch (err) {
      console.error('Error approving work:', err)
      alert('Failed to approve: ' + err.message)
    }
  }

  const handleReject = async (submissionId) => {
    if (!feedback) {
      alert('Please enter feedback before rejecting.')
      return
    }

    try {
      const { error } = await supabase
        .from('assessment_submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          mentor_feedback: feedback
        })
        .eq('id', submissionId)

      if (error) throw error
      alert('Work rejected with feedback.')
      setSelectedWorkId(null)
      setFeedback('')
      fetchPendingWork()
    } catch (err) {
      console.error('Error rejecting work:', err)
      alert('Failed to reject: ' + err.message)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredWork = pendingWork.filter((work) => {
    if (filter === 'all') return true
    // Assessments don't have a 'type' field in the schema, but we can treat them all as assessments for now
    return true
  })

  if (loading) {
    return <div className="dashboard-page" style={{ padding: '100px', textAlign: 'center' }}>Loading pending work...</div>
  }

  if (selectedWorkId) {
    const work = pendingWork.find(w => w.id === selectedWorkId)
    if (!work) {
      setSelectedWorkId(null)
      return null
    }

    return (
      <div className="dashboard-page">
        <div className="course-detail-header">
          <button className="back-button" onClick={() => setSelectedWorkId(null)}>
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
                <div className="work-type-badge" style={{ backgroundColor: `#3b82f620`, color: '#3b82f6', borderColor: '#3b82f6' }}>
                  Assessment
                </div>
                <h2 className="work-title">{work.assessments?.title}</h2>
                <p className="work-course">{work.assessments?.courses?.title}</p>
              </div>
            </div>

            <div className="work-student-info">
              <div className="student-avatar">
                {work.student_details?.profile_image ? (
                  <img src={work.student_details.profile_image} alt={work.student_details.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <span>{work.student_details?.name?.charAt(0)}</span>
                )}
              </div>
              <div className="work-student-details">
                <h3 className="work-student-name">{work.student_details?.name}</h3>
                <p className="work-student-email">Student ID: {work.student_id}</p>
              </div>
            </div>

            <div className="work-details-section">
              <h3 className="section-title">Submission Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Submitted:</span>
                  <span className="info-value">{formatDate(work.submitted_at)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Due Date:</span>
                  <span className="info-value">{formatDate(work.assessments?.due_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{work.status}</span>
                </div>
              </div>
            </div>

            <div className="work-description-section">
              <h3 className="section-title">Student Notes</h3>
              <p className="work-description">{work.text_submission || 'No notes provided.'}</p>
            </div>

            {/* In a real app, we would fetch attachments from assessment_attachments table here */}

            <div className="work-review-actions">
              <h3 className="section-title">Review Actions</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Feedback / Notes</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter feedback for the student..."
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div className="review-actions-grid">
                <button
                  className="btn-success"
                  onClick={() => {
                    if (confirm('Approve this work?')) handleApprove(work.id)
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Approve
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (confirm('Reject this work? Feedback is required.')) handleReject(work.id)
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

      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">Submissions ({pendingWork.length})</h2>
        </div>

        <div className="pending-work-list">
          {pendingWork.length === 0 ? (
            <div className="empty-state">
              <p>No pending work found.</p>
            </div>
          ) : (
            pendingWork.map((work) => {
              return (
                <div key={work.id} className="work-card">
                  <div className="work-card-header">
                    <div className="work-card-info">
                      <div className="work-type-badge" style={{ backgroundColor: `#3b82f620`, color: '#3b82f6', borderColor: '#3b82f6' }}>
                        Assessment
                      </div>
                      <div>
                        <h3 className="work-card-title">{work.assessments?.title}</h3>
                        <p className="work-card-course">{work.assessments?.courses?.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="work-card-student">
                    <div className="student-avatar-small">
                      {work.student_details?.profile_image ? (
                        <img src={work.student_details.profile_image} alt={work.student_details.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      ) : (
                        <span>{work.student_details?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="work-card-student-name">{work.student_details?.name}</p>
                      <p className="work-card-student-email">ID: {work.student_id}</p>
                    </div>
                  </div>

                  <div className="work-card-meta">
                    <div className="work-meta-item">
                      <span className="meta-label">Submitted:</span>
                      <span className="meta-value">{formatDate(work.submitted_at)}</span>
                    </div>
                  </div>

                  <p className="work-card-description">{work.text_submission || 'No text provided.'}</p>

                  <div className="work-card-actions">
                    <button
                      className="btn-primary"
                      onClick={() => setSelectedWorkId(work.id)}
                    >
                      Review Work
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


