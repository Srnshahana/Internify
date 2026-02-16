import { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import '../../App.css'
import supabase from '../../supabaseClient'

function StudentAssessments({ onBack }) {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submissionData, setSubmissionData] = useState({
    textSubmission: '',
    attachments: [],
  })

  // Student ID
  const studentId = localStorage.getItem('auth_id')

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      setLoading(true)

      // 1. Get enrolled courses
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', studentId)

      if (enrollError) throw enrollError

      const courseIds = enrollments.map(e => e.course_id)

      if (courseIds.length === 0) {
        setAssessments([])
        return
      }

      // 2. Get assessments for these courses
      const { data: assessmentsData, error: assessError } = await supabase
        .from('assessments')
        .select(`
          *,
          courses (title),
          assessment_submissions (*)
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false })

      if (assessError) throw assessError

      // 3. Process to find MY submission
      const processed = assessmentsData.map(a => {
        // Safe check for studentId
        const mySubmission = studentId && a.assessment_submissions?.find(s => s.student_id?.toString() === studentId.toString())
        return {
          ...a,
          submission: mySubmission || null, // Attach my submission if exists
          status: mySubmission ? mySubmission.status : 'pending'
        }
      })

      console.log('✅ Processed assessments:', processed)

      setAssessments(processed)

    } catch (error) {
      console.error('Error fetching student assessments:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmitAssessment = async () => {
    if (!submissionData.textSubmission && submissionData.attachments.length === 0) {
      alert('Please provide either text submission or attach files')
      return
    }

    try {
      // 1. Create Submission Record
      const { data: submission, error: subError } = await supabase
        .from('assessment_submissions')
        .insert({
          assessment_id: selectedAssessment,
          student_id: studentId,
          text_submission: submissionData.textSubmission,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single()

      if (subError) throw subError

      // 2. Upload and Link Attachments
      if (submissionData.attachments.length > 0) {
        for (const att of submissionData.attachments) {
          const fileName = `${submission.id}/${Date.now()}_${att.name.replace(/\s+/g, '_')}`

          // Upload
          const { error: uploadError } = await supabase.storage
            .from('course-files') // Reusing course-files bucket
            .upload(fileName, att.file)

          if (uploadError) {
            console.error('Upload failed for', att.name, uploadError)
            continue
          }

          const { data: { publicUrl } } = supabase.storage
            .from('course-files')
            .getPublicUrl(fileName)

          // Insert Attachment Record
          await supabase
            .from('assessment_attachments')
            .insert({
              assessment_id: selectedAssessment,
              submission_id: submission.id,
              uploaded_by: studentId,
              file_name: att.name,
              file_url: publicUrl,
              file_type: att.type,
              created_at: new Date().toISOString()
            })
        }
      }

      alert('Assessment Submitted Successfully!')
      setSubmissionData({ textSubmission: '', attachments: [] })
      setShowSubmitForm(false)
      fetchAssessments() // Refresh to show submitted status

    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('Submission failed: ' + error.message)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch (e) {
      console.error('Error formatting date:', dateString, e)
      return 'Invalid Date'
    }
  }

  // --- Views ---

  // --- Helper to clear selection ---
  const closeAssessmentModal = () => {
    setSelectedAssessment(null)
    setSubmissionData({ textSubmission: '', attachments: [] })
  }

  // --- Render Modal Content ---
  const renderModalContent = () => {
    if (!selectedAssessment) return null
    const assessment = assessments.find(a => a.id === selectedAssessment)
    if (!assessment) return null

    const safeTitle = String(assessment.title || 'Untitled Assessment')
    const safeDesc = String(assessment.description || 'No description provided.')
    const safeCourse = assessment.courses
      ? (Array.isArray(assessment.courses) ? assessment.courses[0]?.title : assessment.courses.title)
      : 'Course'
    const safeStatus = String(assessment.status || 'pending')

    const isSubmitted = safeStatus === 'submitted'

    return (
      <div className="live-assessment-modal-overlay" onClick={closeAssessmentModal} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
      }}>
        <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()} style={{
          background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px',
          maxHeight: '90vh', overflowY: 'auto', position: 'relative'
        }}>
          <button
            onClick={closeAssessmentModal}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>

          <div className="assessment-header" style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1e293b' }}>{safeTitle}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>{String(safeCourse)}</span>
              <span className={`assessment-status ${safeStatus}`} style={{ fontSize: '12px' }}>{safeStatus}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Due: {formatDate(assessment.due_date)}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', color: '#334155', whiteSpace: 'pre-wrap' }}>
            {safeDesc}
          </div>

          {isSubmitted ? (
            <div className="work-description-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Your Submission</h3>
              <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <p style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '14px' }}>
                  {typeof assessment.submission.text_submission === 'string'
                    ? assessment.submission.text_submission
                    : (assessment.submission.text_submission ? JSON.stringify(assessment.submission.text_submission) : 'No text submission')}
                </p>
              </div>
              <p className="submission-date" style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                Submitted on {formatDate(assessment.submission.submitted_at)}
              </p>
            </div>
          ) : (
            <div className="submission-form">
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Submit Your Work</h3>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Text Response</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Type your answer here..."
                  value={submissionData.textSubmission}
                  onChange={(e) => setSubmissionData({ ...submissionData, textSubmission: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>Attachments</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <label htmlFor="file-upload" className="btn-secondary" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
                    background: '#e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                  }}>
                    <span style={{ fontSize: '16px' }}>📎</span> Attach Files
                  </label>
                  <input id="file-upload" type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                </div>

                <div className="attachments-list">
                  {submissionData.attachments.map((att, i) => (
                    <div key={i} className="attachment-item" style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', marginBottom: '4px', fontSize: '13px'
                    }}>
                      <span>{att.name} <span style={{ color: '#94a3b8' }}>({att.size})</span></span>
                      <button onClick={() => handleRemoveAttachment(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="work-review-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn-secondary" onClick={closeAssessmentModal} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmitAssessment}>Submit Assignment</button>
              </div>
            </div>
          )}
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
          <h1 className="page-title">My Assessments</h1>
        </div>

        {/* Stats */}
        <div className="progress-overview-cards" style={{ marginBottom: '24px' }}>
          <div className="progress-overview-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <h3>Pending</h3>
            <p className="progress-card-value" style={{ color: '#f59e0b' }}>{assessments.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="progress-overview-card" style={{ borderTop: '4px solid #22c55e' }}>
            <h3>Submitted</h3>
            <p className="progress-card-value" style={{ color: '#22c55e' }}>{assessments.filter(a => a.status === 'submitted').length}</p>
          </div>
        </div>

        <div className="assessments-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Loading size="100px" />
              <p style={{ color: '#64748b' }}>Loading assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <p>No assessments assigned.</p>
          ) : assessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <div>
                  <h3 className="assessment-title">{assessment.title}</h3>
                  <p className="assessment-course">{assessment.courses?.title}</p>
                </div>
                <span className={`assessment-status ${assessment.status}`}>{assessment.status}</span>
              </div>
              <div className="assessment-actions">
                <button className="btn-primary" onClick={() => setSelectedAssessment(assessment.id)}>
                  {assessment.status === 'submitted' ? 'View Submission' : 'Start Assessment'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Render */}
        {renderModalContent()}

      </div>
    </div>
  )
}

export default StudentAssessments
