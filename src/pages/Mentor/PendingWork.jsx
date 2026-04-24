import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'
import Loading from '../../components/Loading'
import MessageModal from '../../components/shared/MessageModal.jsx'

function PendingWork({ onBack }) {
  const [selectedWorkId, setSelectedWorkId] = useState(null)
  const [pendingWork, setPendingWork] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')

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

  const mentorId = localStorage.getItem('auth_id')

  useEffect(() => {
    fetchPendingWork()
  }, [mentorId])

  const fetchPendingWork = async () => {
    try {
      setLoading(true)
      const { data: submissions, error: subError } = await supabase
        .from('assessment_submissions')
        .select(`
          *,
          assessments:assessment_id (
            title,
            description,
            due_date,
            courses (title, category)
          )
        `)
        .eq('status', 'submitted')

      if (subError) throw subError
      
      const studentIds = [...new Set(submissions?.map(s => s.student_id) || [])]
      const { data: students } = await supabase
        .from('student_details')
        .select('student_id, name, profile_image')
        .in('student_id', studentIds)

      const studentMap = new Map(students?.map(s => [s.student_id, s]) || [])
      const merged = submissions?.map(s => ({
        ...s,
        student_details: studentMap.get(s.student_id) || { name: `Student #${s.student_id}` }
      })) || []

      setPendingWork(merged)
    } catch (err) {
      console.error('Error fetching pending work:', err)
      showModal('Error', 'Failed to load submissions.', 'error')
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
          reviewed_at: new Date().toISOString(),
          mentor_feedback: feedback
        })
        .eq('id', submissionId)

      if (error) throw error
      showModal('Approved', 'Submission marked as complete!', 'success')
      setSelectedWorkId(null)
      setFeedback('')
      fetchPendingWork()
    } catch (err) {
      console.error('Error approving:', err)
      showModal('Error', 'Approval failed.', 'error')
    }
  }

  const handleReject = async (submissionId) => {
    if (!feedback) {
      alert('Please provide feedback for the student regarding the rejection.')
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
      showModal('Rejected', 'Sent back to student with feedback.', 'info')
      setSelectedWorkId(null)
      setFeedback('')
      fetchPendingWork()
    } catch (err) {
      console.error('Error rejecting:', err)
      showModal('Error', 'Rejection failed.', 'error')
    }
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now - past
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMins / 60)
    const diffDays = Math.round(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) return <Loading fullScreen={true} />

  const selectedWork = selectedWorkId ? pendingWork.find(w => w.id === selectedWorkId) : null

  return (
    <div className="dashboard-page-v2 font-sans animate-fade-in">
      <div className="dashboard-background-v2">
        <div className="grain-texture absolute inset-0"></div>
        <div className="dashboard-blob-1"></div>
        <div className="dashboard-blob-2"></div>
      </div>

      <header className="dashboard-header-v2" style={{ marginBottom: '24px' }}>
        <div className="dashboard-profile-group">
            <button 
              onClick={onBack}
              className="dashboard-card-icon-wrapper"
              style={{ padding: '8px', width: '40px', height: '40px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', borderRadius: '12px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="dashboard-welcome-text-v2" style={{ marginLeft: '16px' }}>
                <h1 style={{ fontSize: '24px' }}>Pending Reviews</h1>
                <p className="dashboard-date-v2">Review and give feedback on student submissions</p>
            </div>
        </div>
      </header>

      <div className="dashboard-content-v2" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {selectedWork ? (
          /* Glassmorphic Review View */
          <div className="animate-slide-up">
            <div className="dashboard-glass-card-v2" style={{ padding: '40px', cursor: 'default', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    {selectedWork.student_details?.profile_image ? (
                      <img src={selectedWork.student_details.profile_image} alt={selectedWork.student_details.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      selectedWork.student_details?.name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0' }}>{selectedWork.student_details?.name}</h2>
                    <p style={{ color: '#64748b', fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>
                      Submission for <strong style={{ color: '#0ea5e9' }}>{selectedWork.assessments?.title}</strong>
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedWorkId(null)} className="session-btn session-btn-secondary">Cancel Review</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission Content</h3>
                  <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <p style={{ margin: '0', fontSize: '16px', color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                      {selectedWork.text_submission || 'The student did not provide any text with this submission.'}
                    </p>
                    
                    {/* Placeholder for attachments if any */}
                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px dashed #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>attach_file</span>
                        <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>No attachments found for this submission.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Evaluation</h3>
                  <div style={{ background: 'rgba(15, 23, 42, 0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '10px' }}>Feedback for Student</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Great job! I noticed you focused on..."
                      style={{
                        width: '100%',
                        height: '180px',
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid #cbd5e1',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        outline: 'none',
                        background: '#ffffff',
                        marginBottom: '24px',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                      }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button 
                        onClick={() => handleApprove(selectedWork.id)}
                        className="session-btn session-btn-primary" 
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '16px' }}
                      >
                        Approve & Complete
                      </button>
                      <button 
                        onClick={() => handleReject(selectedWork.id)}
                        className="session-btn session-btn-secondary" 
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '16px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      >
                        Request Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Glassmorphic List View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '80px' }}>
            {pendingWork.length > 0 ? (
                <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
                        Active Submissions 
                        <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '600', color: '#0ea5e9', background: '#e0f2fe', padding: '4px 12px', borderRadius: '100px' }}>
                            {pendingWork.length} Submissions
                        </span>
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  {pendingWork.map((work) => (
                    <div 
                      key={work.id} 
                      className="dashboard-glass-card-v2 animate-slide-up"
                      onClick={() => setSelectedWorkId(work.id)}
                      style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                          {work.student_details?.profile_image ? (
                            <img src={work.student_details.profile_image} alt={work.student_details.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            work.student_details?.name?.charAt(0)
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0', fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>{work.student_details?.name}</h4>
                          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                            Submission for <strong style={{ color: '#0f172a' }}>{work.assessments?.title}</strong>
                          </p>
                        </div>

                        <div style={{ textAlign: 'right', marginRight: '40px' }}>
                          <p style={{ margin: '0', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>{getTimeAgo(work.submitted_at)}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>Submitted at {new Date(work.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="session-btn session-btn-primary" style={{ padding: '10px 24px', borderRadius: '14px', fontSize: '14px' }}>Review Now</button>
                      </div>
                    </div>
                  ))}
                </div>
                </>
            ) : (
              <div className="dashboard-glass-card-v2" style={{ textAlign: 'center', padding: '100px 40px', cursor: 'default' }}>
                <div className="dashboard-card-icon-wrapper" style={{ margin: '0 auto 24px', width: '64px', height: '64px', background: '#f8fafc', color: '#cbd5e1' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>task</span>
                </div>
                <h3 style={{ color: '#1e293b', fontSize: '20px', fontWeight: '700', margin: '0' }}>All Caught Up!</h3>
                <p style={{ color: '#64748b', marginTop: '8px' }}>There are no pending submissions to review at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

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

export default PendingWork
