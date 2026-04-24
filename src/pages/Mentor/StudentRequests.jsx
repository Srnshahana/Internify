import { useState, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'
import Loading from '../../components/Loading'
import MessageModal from '../../components/shared/MessageModal.jsx'

function StudentRequests({ onBack }) {
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [selectedRequestId, setSelectedRequestId] = useState(null)
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

      const { data, error } = await supabase
        .from('classes_enrolled')
        .select(`
          *,
          courses(title, category, image),
          student_details(name, profile_image)
        `)
        .eq('mentor_id', authId)
        .order('id', { ascending: false })

      if (error) throw error

      const mappedRequests = data.map(req => ({
        id: req.id,
        studentName: req.student_details?.name || 'Unknown Student',
        studentEmail: req.student_email || 'No email provided',
        course: req.courses?.title || 'Unknown Course',
        courseCategory: req.courses?.category || 'Professional',
        courseImage: req.courses?.image,
        status: req.status === 'active' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending',
        requestedAt: req.created_at || new Date().toISOString(),
        topic: req.topic || 'Mentorship Program Enrollment',
        profile_image: req.student_details?.profile_image,
        rejectionReason: req.rejection_reason || ''
      }))

      setRequests(mappedRequests)
      
      // AUTO-SELECT the first pending request if available, otherwise just the first one
      if (mappedRequests.length > 0) {
        const firstPending = mappedRequests.find(r => r.status === 'Pending')
        setSelectedRequestId(firstPending ? firstPending.id : mappedRequests[0].id)
      }
    } catch (err) {
      console.error('Error fetching requests:', err)
      showModal('Fetch Error', 'Failed to load requests. Please try again.', 'error')
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

  // Re-sync selectedRequest when filter changes if the currently selected one is filtered out
  useEffect(() => {
    if (filteredRequests.length > 0) {
        const isCurrentlySelectedInFilter = filteredRequests.some(r => r.id === selectedRequestId)
        if (!isCurrentlySelectedInFilter) {
            setSelectedRequestId(filteredRequests[0].id)
        }
    } else {
        setSelectedRequestId(null)
    }
  }, [filter, requests])

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length
  }

  const handleApprove = async (requestId) => {
    try {
      const { error } = await supabase
        .from('classes_enrolled')
        .update({ status: 'active' })
        .eq('id', requestId)

      if (error) throw error

      setRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status: 'Approved' } : req
      ))
      showModal('Success', 'Enrollment approved!', 'success')
      // Don't deselect, just let the UI update
    } catch (err) {
      console.error('Error approving:', err)
      showModal('Error', 'Failed to approve enrollment.', 'error')
    }
  }

  const handleReject = async (requestId) => {
    const reason = prompt('Please enter a reason for rejection (optional):')
    if (reason === null) return // Cancelled

    try {
      const { error } = await supabase
        .from('classes_enrolled')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', requestId)

      if (error) throw error

      setRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status: 'Rejected', rejectionReason: reason } : req
      ))
      showModal('Rejected', 'Request has been rejected.', 'info')
    } catch (err) {
      console.error('Error rejecting:', err)
      showModal('Error', 'Failed to reject request.', 'error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b'
      case 'Approved': return '#10b981'
      case 'Rejected': return '#ef4444'
      default: return '#64748b'
    }
  }

  if (loading) return <Loading fullScreen={true} />

  const selectedRequest = selectedRequestId ? requests.find(r => r.id === selectedRequestId) : null

  return (
    <div className="dashboard-page-v2 font-sans animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
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
                <h1 style={{ fontSize: '24px' }}>Student Requests</h1>
                <p className="dashboard-date-v2">Manage your course enrollments</p>
            </div>
        </div>
      </header>

      <div className="dashboard-content-v2" style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: '0 24px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 120px)' }}>
        
        {/* Left Side: Request List / Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.5)', padding: '4px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)' }}>
                {['all', 'pending'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      background: filter === type ? '#0ea5e9' : 'transparent',
                      color: filter === type ? '#ffffff' : '#64748b',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {type}
                  </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingPr: '8px' }}>
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(req => (
                        <div 
                            key={req.id}
                            onClick={() => setSelectedRequestId(req.id)}
                            className="dashboard-glass-card-v2"
                            style={{ 
                                padding: '16px', 
                                cursor: 'pointer', 
                                borderLeft: `4px solid ${req.id === selectedRequestId ? '#0ea5e9' : getStatusColor(req.status)}`,
                                transition: 'all 0.2s',
                                background: req.id === selectedRequestId ? 'rgba(14, 165, 233, 0.05)' : 'rgba(255,255,255,0.4)',
                                scale: req.id === selectedRequestId ? '1.02' : '1'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    {req.profile_image ? <img src={req.profile_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : req.studentName.charAt(0)}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.studentName}</h4>
                                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.course}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: '14px' }}>No requests found</div>
                )}
            </div>
        </div>

        {/* Right Side: Detailed View (The main focus) */}
        <div style={{ minWidth: 0 }}>
            {selectedRequest ? (
                <div className="animate-slide-up">
                    <div className="dashboard-glass-card-v2" style={{ padding: '40px', cursor: 'default', display: 'block', height: '100%', minHeight: '500px' }}>
                        
                        {/* Header Part as per Image */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                                <div style={{ width: '110px', height: '110px', borderRadius: '28px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                                    {selectedRequest.profile_image ? (
                                        <img src={selectedRequest.profile_image} alt={selectedRequest.studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        selectedRequest.studentName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0' }}>{selectedRequest.studentName}</h2>
                                    <p style={{ color: '#0ea5e9', fontWeight: '700', fontSize: '18px', marginTop: '6px' }}>{selectedRequest.studentEmail}</p>
                                    <div style={{ marginTop: '16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '900', color: '#ffffff', background: getStatusColor(selectedRequest.status), padding: '6px 16px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {selectedRequest.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <button onClick={onBack} className="session-btn session-btn-secondary" style={{ padding: '12px 24px', borderRadius: '16px', fontSize: '14px', fontWeight: '700' }}>Close Details</button>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.04)', margin: '0 0 40px 0' }}></div>

                        {/* Content Body Part as per Image */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '60px' }}>
                            <div className="detail-info-block">
                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#0ea5e9' }}>info</span>
                                    Enrollment Information
                                </h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Target Program</label>
                                        <p style={{ margin: '0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{selectedRequest.course}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Application Date</label>
                                        <p style={{ margin: '0', fontSize: '18px', color: '#475569', fontWeight: '600' }}>{new Date(selectedRequest.requestedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(selectedRequest.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Mentorship Goal</label>
                                        <p style={{ margin: '0', fontSize: '17px', color: '#475569', lineHeight: '1.7', fontWeight: '500' }}>{selectedRequest.topic}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="detail-action-block">
                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#0ea5e9' }}>bolt</span>
                                    Quick Actions
                                </h3>
                                
                                {selectedRequest.status === 'Pending' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <button 
                                            onClick={() => handleApprove(selectedRequest.id)}
                                            className="session-btn" 
                                            style={{ 
                                                width: '100%', 
                                                padding: '20px', 
                                                borderRadius: '20px', 
                                                fontSize: '18px', 
                                                fontWeight: '800',
                                                background: '#41568c', 
                                                color: '#ffffff',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '12px',
                                                boxShadow: '0 10px 20px -5px rgba(65, 86, 140, 0.3)'
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>check_circle</span>
                                            Approve Enrollment
                                        </button>
                                        <button 
                                            onClick={() => handleReject(selectedRequest.id)}
                                            className="session-btn" 
                                            style={{ 
                                                width: '100%', 
                                                padding: '20px', 
                                                borderRadius: '20px', 
                                                fontSize: '18px', 
                                                fontWeight: '800',
                                                color: '#ef4444', 
                                                background: '#fff1f1',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '12px'
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>cancel</span>
                                            Decline Application
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ padding: '32px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.04)', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: getStatusColor(selectedRequest.status), marginBottom: '16px' }}>
                                            {selectedRequest.status === 'Approved' ? 'verified' : 'block'}
                                        </span>
                                        <h4 style={{ margin: '0', fontSize: '18px', color: '#1e293b', fontWeight: '800' }}>
                                            Enrollment {selectedRequest.status}
                                        </h4>
                                        {selectedRequest.rejectionReason && (
                                            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '16px', fontStyle: 'italic', lineHeight: '1.6' }}>
                                                "{selectedRequest.rejectionReason}"
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="dashboard-glass-card-v2" style={{ textAlign: 'center', padding: '100px 40px', cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <div className="dashboard-card-icon-wrapper" style={{ margin: '0 auto 24px', width: '80px', height: '80px', background: '#f8fafc', color: '#cbd5e1' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>person_search</span>
                    </div>
                    <h3 style={{ color: '#1e293b', fontSize: '24px', fontWeight: '800', margin: '0' }}>Select a Request</h3>
                    <p style={{ color: '#64748b', marginTop: '12px', fontSize: '16px' }}>Choose an application from the sidebar to review details.</p>
                </div>
            )}
        </div>
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

export default StudentRequests
