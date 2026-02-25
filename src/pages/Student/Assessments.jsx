import { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import '../../App.css'
import supabase from '../../supabaseClient'
import MessageModal from '../../components/shared/MessageModal.jsx'

function StudentAssessments({ onBack }) {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submissionData, setSubmissionData] = useState({
    textSubmission: '',
    attachments: [],
  })

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
          assessment_submissions (
            *,
            assessment_attachments (*)
          )
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false })

      if (assessError) throw assessError

      // 3. Process to find MY submission
      const processed = assessmentsData.map(a => {
        // Safe check for studentId
        const studentSubmissions = a.assessment_submissions || []
        const mySubmission = studentId && studentSubmissions.find(s => s.student_id?.toString() === studentId.toString())
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
      showModal('Submission Error', 'Please provide either text submission or attach files', 'error')
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

      showModal('Success', 'Assessment Submitted Successfully!', 'success')
      setSubmissionData({ textSubmission: '', attachments: [] })
      setShowSubmitForm(false)
      fetchAssessments() // Refresh to show submitted status

    } catch (error) {
      console.error('Error submitting assessment:', error)
      showModal('Error', 'Submission failed: ' + error.message, 'error')
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

  // --- Helper to clean legacy file links from submission text ---
  const cleanSubmissionText = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text
      .split('\n')
      .filter(line => !line.trim().startsWith('File Attachment:'))
      .join('\n')
      .trim();
  };

  // --- Helper to extract attachments from text ---
  const extractAttachmentsFromText = (text) => {
    if (!text || typeof text !== 'string') return [];

    // Match standard URLs
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const matches = text.match(urlRegex) || [];

    return matches.map(url => {
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      // Try to get a clean name from the URL
      const fileName = url.split('/').pop().split('?')[0] || 'Attached File';
      return {
        file_url: url,
        file_name: decodeURIComponent(fileName),
        file_type: isImage ? 'image/jpeg' : 'application/octet-stream', // Generic
        is_extracted: true
      };
    });
  };

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

    const isSubmitted = ['submitted', 'completed', 'graded'].includes(safeStatus.toLowerCase())

    return (
      <div className="live-assessment-modal-overlay" onClick={closeAssessmentModal} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
      }}>
        <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()} style={{
          background: 'white',
          padding: 0,
          borderRadius: '16px',
          width: '95%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Standardized Header */}
          <div className="assessment-modal-header" style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            padding: '24px 32px',
            borderBottom: '1px solid #f1f5f9',
            background: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <span className="material-symbols-outlined">assignment</span>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>{safeTitle}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{String(safeCourse)}</span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#cbd5e1' }}></span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Due: {formatDate(assessment.due_date)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`assessment-status ${safeStatus}`} style={{
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                padding: '4px 10px',
                borderRadius: '6px',
                background: safeStatus === 'submitted' ? '#dcfce7' : '#fef3c7',
                color: safeStatus === 'submitted' ? '#166534' : '#92400e'
              }}>
                {safeStatus}
              </span>
              <button
                className="assessment-modal-close-btn"
                onClick={closeAssessmentModal}
                title="Close"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>
          </div>

          <div style={{ padding: '32px', overflowY: 'auto' }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', color: '#475569', lineHeight: '1.6', border: '1px solid #f1f5f9' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h4>
              {safeDesc}
            </div>

            {isSubmitted ? (
              <div className="work-description-section" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#3b82f6' }}>history_edu</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1e293b' }}>Your Submission</h3>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  {(() => {
                    const text = assessment.submission?.text_submission
                    if (!text) return <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>No text submission provided.</p>

                    const cleanedText = cleanSubmissionText(text)
                    // Split by Markdown links/images first
                    const parts = cleanedText.split(/(\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))/)

                    return (
                      <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                        {parts.map((part, index) => {
                          const markdownMatch = part.match(/\!\[(.*?)\]\((.*?)\)/) || part.match(/\[(.*?)\]\((.*?)\)/)
                          if (markdownMatch) {
                            const [_, alt, url] = markdownMatch
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
                            if (isImage) {
                              return (
                                <div key={index} style={{ margin: '16px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                  <img
                                    src={url}
                                    alt={alt}
                                    style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block' }}
                                  />
                                </div>
                              )
                            }
                            return <a key={index} href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: '500' }}>{alt || url}</a>
                          }

                          // For non-markdown parts, handle raw URLs
                          const subParts = part.split(/(https?:\/\/[^\s]+)/g)
                          return (
                            <span key={index}>
                              {subParts.map((subPart, subIndex) => {
                                if (subPart.match(/^https?:\/\//)) {
                                  const isImageUrl = /\.(jpg|jpeg|png|gif|webp)$/i.test(subPart)
                                  if (isImageUrl) {
                                    return (
                                      <div key={subIndex} style={{ margin: '16px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <img
                                          src={subPart}
                                          alt="Submission Image"
                                          style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block', backgroundColor: '#fff' }}
                                        />
                                      </div>
                                    )
                                  }
                                  return (
                                    <a
                                      key={subIndex}
                                      href={subPart}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: '#3b82f6',
                                        textDecoration: 'none',
                                        background: '#eff6ff',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontWeight: '600',
                                        wordBreak: 'break-all',
                                        display: 'inline-block',
                                        margin: '2px 0'
                                      }}
                                    >
                                      <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>link</span>
                                      Open Attachment
                                    </a>
                                  )
                                }
                                return <span key={subIndex} style={{ whiteSpace: 'pre-wrap' }}>{subPart}</span>
                              })}
                            </span>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>

                <div className="attachments-section" style={{ marginTop: '24px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>attach_file</span>
                    Attachments
                  </h4>

                  {(() => {
                    const dbAttachments = assessment.submission.assessment_attachments || [];
                    const extractedAttachments = extractAttachmentsFromText(assessment.submission.text_submission);

                    // Filter out extracted URLs that might already be in dbAttachments (by URL)
                    const uniqueExtracted = extractedAttachments.filter(ext =>
                      !dbAttachments.some(db => db.file_url === ext.file_url)
                    );

                    const allAttachments = [...dbAttachments, ...uniqueExtracted];

                    if (allAttachments.length > 0) {
                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                          {allAttachments.map((att, idx) => {
                            const isImage = att.file_url && (att.file_url.toLowerCase().includes('png') || att.file_url.toLowerCase().includes('jpg') || att.file_url.toLowerCase().includes('jpeg'));
                            return (
                              <div key={idx} className="attachment-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{
                                  background: 'white',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '12px',
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'all 0.2s ease',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                    <div style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '10px',
                                      background: '#f1f5f9',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#64748b',
                                      flexShrink: 0
                                    }}>
                                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                        {isImage ? 'image' : 'description'}
                                      </span>
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {att.file_name}
                                      </p>
                                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                                        {att.file_size ? `${(att.file_size / 1024).toFixed(1)} KB` : (att.is_extracted ? 'Text Link' : 'Attached File')}
                                      </p>
                                    </div>
                                  </div>
                                  <a
                                    href={att.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      padding: '8px 14px',
                                      background: '#eff6ff',
                                      color: '#3b82f6',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      textDecoration: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    View
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                                  </a>
                                </div>

                                {isImage && (
                                  <div style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    background: '#fff'
                                  }}>
                                    <img
                                      src={att.file_url}
                                      alt={att.file_name}
                                      style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', display: 'block' }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <div style={{
                          padding: '32px 24px',
                          textAlign: 'center',
                          background: '#f8fafc',
                          border: '1px dashed #e2e8f0',
                          borderRadius: '16px',
                          color: '#94a3b8',
                          fontSize: '13px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#cbd5e1' }}>cloud_off</span>
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#64748b' }}>No files attached</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>This submission contains only text</p>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>

                <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    <strong>Submitted on:</strong> {formatDate(assessment.submission.submitted_at)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="submission-form">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#3b82f6' }}>add_task</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1e293b' }}>Submit Your Work</h3>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#475569' }}>Text Response</label>
                  <textarea
                    className="form-textarea"
                    rows="6"
                    placeholder="Type your answer, explain your approach, or provide additional context..."
                    value={submissionData.textSubmission}
                    onChange={(e) => setSubmissionData({ ...submissionData, textSubmission: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Attachments</label>
                    <label htmlFor="file-upload" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
                      Attach Files
                    </label>
                  </div>
                  <input id="file-upload" type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />

                  {submissionData.attachments.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                      {submissionData.attachments.map((att, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#f1f5f9',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '13px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>description</span>
                            <span style={{ fontWeight: '600', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveAttachment(i)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '32px', textAlign: 'center', background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: '12px', color: '#94a3b8', fontSize: '13px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>cloud_upload</span>
                      No files selected
                    </div>
                  )}
                </div>

                <div className="work-review-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '24px 0 0 0', borderTop: '1px solid #f1f5f9' }}>
                  <button onClick={closeAssessmentModal} style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>Cancel</button>
                  <button
                    onClick={handleSubmitAssessment}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#3b82f6',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    Submit Assignment
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

        <MessageModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
        />
      </div>
    </div>
  )
}

export default StudentAssessments
