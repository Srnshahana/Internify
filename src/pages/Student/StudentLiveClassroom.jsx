import { useState, useRef, useEffect } from 'react'
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import RescheduleModal from '../../components/RescheduleModal.jsx'
import RescheduleResponseModal from '../../components/RescheduleResponseModal.jsx'
import MessageModal from '../../components/shared/MessageModal.jsx'


function StudentLiveClassroom({ course, onBack, onNavigate }) {
  const userRole = 'student'
  const { refetch } = useDashboardData()

  // Define chatId from the enrollment
  const chatId = course?.id  // enrollment ID

  // Current user ID from local storage
  const currentUserId = localStorage.getItem('auth_id')
  const userid = localStorage.getItem('auth_user_id')

  // Use course.sessions (new) or course.classes (legacy)
  const initialSessions = course?.sessions || course?.classes || [
    { id: 1, title: 'Introduction & Setup', status: 'upcoming' },
    { id: 2, title: 'Components & Props', status: 'upcoming' },
    { id: 3, title: 'State & Hooks', status: 'upcoming' },
  ]

  // Find first pending or default to first session ID
  const firstPendingId = initialSessions.find(s => s.status === 'pending' || s.status === 'upcoming')?.id ||
    initialSessions.find(s => s.sessionId)?.sessionId ||
    initialSessions[0]?.id || 1

  const [activeSessionId, setActiveSessionId] = useState(firstPendingId)
  const [subscriptionStatus, setSubscriptionStatus] = useState('connecting')

  // EFFECT: Sync activeSessionId with real data when course.sessions arrives
  useEffect(() => {
    if (course?.sessions?.length > 0) {
      const realFirstId = course.sessions.find(s => s.status === 'pending' || s.status === 'upcoming')?.id ||
                         course.sessions[0]?.id
      if (realFirstId && realFirstId !== activeSessionId) {
        console.log('🎯 [Student] Syncing activeSessionId to real database ID:', realFirstId)
        setActiveSessionId(realFirstId)
      }
    }
  }, [course?.sessions])
  const [messageInput, setMessageInput] = useState('')

  // Removed mentor assessment creation state
  const [showAssessmentListModal, setShowAssessmentListModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [courseSessions, setCourseSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const channelRef = useRef(null)
  const chatFeedRef = useRef(null)
  const docInputRef = useRef(null)

  const imageInputRef = useRef(null)
  // Removed study material ref
  const assessmentFileInputRef = useRef(null)

  const [dbAssessments, setDbAssessments] = useState([])
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

  useEffect(() => {
    fetchDbAssessments()
  }, [])

  useEffect(() => {
    if (showAssessmentListModal) {
      fetchDbAssessments()
    }
  }, [showAssessmentListModal])

  useEffect(() => {
    if (showSessionsModal) {
      fetchCourseSessions()
    }
  }, [showSessionsModal])

  const fetchCourseSessions = async () => {
    try {
      setLoadingSessions(true)
      const courseId = course?.course_id || course?.id
      const { data, error } = await supabase
        .from('scheduled_classes')
        .select('*, courses(title), reschedule_request, reschedule_role, rescheduled_date, reschedule_reason, is_complete')
        .eq('student_id', currentUserId) // ISOLATION: Only show sessions for this student
        .eq('course_id', courseId) // ISOLATION: Only show sessions for this course
        .order('scheduled_date', { ascending: true })

      if (error) throw error

      if (data) {
        const mapped = data.map(session => ({
          ...session,
          date: new Date(session.scheduled_date).toLocaleDateString(),
          time: new Date(session.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))

        // Sort: Upcoming (is_complete: false) first, then Completed (is_complete: true)
        mapped.sort((a, b) => {
          if (a.is_complete === b.is_complete) return 0;
          return a.is_complete ? 1 : -1;
        });

        setCourseSessions(mapped)
      }
    } catch (err) {
      console.error('Error fetching course sessions:', err)
    } finally {
      setLoadingSessions(false)
    }
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

  const fetchDbAssessments = async () => {
    try {
      // 1. Fetch Assessments
      const { data: assessments, error: asmError } = await supabase
        .from('assessments')
        .select('*')
        .eq('student_id', currentUserId) // ISOLATION: Only show assessments for this student
        .order('created_at', { ascending: false })

      if (asmError) throw asmError

      // 2. Fetch User's Submissions for these assessments
      if (assessments?.length > 0) {
        console.log('🔍 Fetching submissions for student:', currentUserId)
        const { data: submissions, error: subError } = await supabase
          .from('assessment_submissions')
          .select('*, assessment_attachments(*)')
          .eq('student_id', currentUserId)
          .in('assessment_id', assessments.map(a => a.id))

        if (subError) console.warn('Error fetching submissions:', subError)
        console.log('📥 Fetched Submissions:', submissions)

        // 3. Merge Data
        const merged = assessments.map(assessment => {
          // Robust comparison: String() ensures we match mismatching types (number vs string)
          const mySub = submissions?.find(s => String(s.assessment_id) === String(assessment.id))
          return {
            ...assessment,
            mySubmission: mySub || null
          }
        })
        console.log('✨ Merged Assessments with robust match:', merged)
        setDbAssessments(merged)
      } else {
        setDbAssessments([])
      }
    } catch (err) {
      console.error('Error fetching assessments:', err)
    }
  }

  const classroom = course || {
    title: 'React App Development – Batch 1',
    mentor: 'Sarah Chen',
  }

  // Debug: Track course data
  useEffect(() => {
    console.log('📦 LiveClassroom course data:', course)
    console.log('🔑 Current chatId being used:', chatId)
  }, [course, chatId])

  // Debug: Monitor messages state changes
  useEffect(() => {
    console.log('📈 Current messages count:', messages.length)
    console.log('📝 Messages list:', messages)
  }, [messages])

  // 1. Fetch initial message history
  useEffect(() => {
    if (!chatId) {
      console.warn('⚠️ fetchMessages skipped: chatId is missing')
      return
    }

    const fetchMessages = async () => {
      console.log('🔍 Fetching messages for chatId:', chatId)
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('❌ Supabase fetch error:', error)
          throw error
        }

        console.log('📥 Raw data from Supabase:', data)

        if (data) {
          const mapped = data.map(m => {
            let inferredType = m.type || 'text'
            // Infer type logic
            if (!m.type && m.file_url) {
              const ext = m.file_url.split('.').pop().toLowerCase()
              if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) inferredType = 'image'
              else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) inferredType = 'file'
            } else if (!m.type && (m.content || '').match(/^https?:\/\//)) {
              inferredType = 'link'
            }

            if (m.type === 'assessment') {
              try {
                const details = JSON.parse(m.content)
                Object.assign(m, details)
              } catch (e) { }
            }
            
            let replyToObj = null
            if (m.reply_to_id) {
               const repliedMsg = data.find(orig => String(orig.id) === String(m.reply_to_id))
               if (repliedMsg) replyToObj = { ...repliedMsg } 
            }

            return {
              ...m,
              from: m.sender_id.toString() === currentUserId?.toString() ? 'learner' : 'mentor',
              type: inferredType,
              time: m.created_at ? new Date(m.created_at + (m.created_at.includes('Z') || m.created_at.includes('+') ? '' : 'Z')).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : getCurrentTime(),
              highlightColor: m.student_highlight || null,
              selfNote: m.student_note || '',
              replyTo: replyToObj
            }
          })
          setMessages(prev => {
            const fetchedIds = new Set(data.map(m => String(m.id)))
            const pendingRealtime = prev.filter(m => !fetchedIds.has(String(m.id)))
            
            const combined = [...mapped, ...pendingRealtime].sort((a, b) => {
              const dateA = a.created_at ? new Date(a.created_at).getTime() : (typeof a.id === 'number' ? a.id : 0)
              const dateB = b.created_at ? new Date(b.created_at).getTime() : (typeof b.id === 'number' ? b.id : 0)
              return dateA - dateB
            })
            
            console.log(`🔄 Merged ${mapped.length} fetched with ${pendingRealtime.length} pending messages for Student`)
            return combined
          })
        }
      } catch (err) {
        console.error('❌ Catch block fetching chat history:', err)
      }
    }

    fetchMessages()
  }, [chatId])

  // 2. Real-time Subscription
  useEffect(() => {
    if (!chatId) return

    console.log('📡 Setting up student subscription for chatId:', chatId)
    const channel = supabase
      .channel(`chat:${chatId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: currentUserId }
        }
      })
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new || payload.old
        if (String(newMessage?.chat_id) !== String(chatId)) return

        setMessages((prev) => {
          // Deduplicate by database ID or temp trace ID
          if (prev.some(m => String(m.id) === String(newMessage.id) || (m.tempId && m.tempId === newMessage.tempId))) {
            return prev.map(m => (m.tempId === newMessage.tempId || String(m.id) === String(newMessage.id)) ? { ...m, ...newMessage, tempId: undefined } : m)
          }

          if (payload.eventType === 'INSERT') {
            let replyToObj = null
            if (newMessage.reply_to_id) {
               const repliedMsg = prev.find(orig => String(orig.id) === String(newMessage.reply_to_id))
               if (repliedMsg) replyToObj = { ...repliedMsg }
            }
            const msgForState = {
              ...newMessage,
              from: newMessage.sender_id.toString() === currentUserId?.toString() ? 'learner' : 'mentor',
              type: newMessage.type || 'text',
              time: newMessage.created_at ? new Date(newMessage.created_at + (newMessage.created_at.includes('Z') || newMessage.created_at.includes('+') ? '' : 'Z')).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : getCurrentTime(),
              replyTo: replyToObj
            }
            return [...prev, msgForState].sort((a, b) => new Date(a.created_at || a.id) - new Date(b.created_at || b.id))
          }
          return prev
        })
      })
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        console.log('🚀 Student Broadcast received:', payload)
        setMessages((prev) => {
          if (prev.some(m => (m.tempId && m.tempId === payload.tempId) || String(m.id) === String(payload.id))) return prev
          return [...prev, payload].sort((a, b) => new Date(a.created_at || a.id) - new Date(b.created_at || b.id))
        })
      })
      .subscribe((status) => {
        console.log(`🔌 Student Subscription status for chat ${chatId}:`, status)
        setSubscriptionStatus(status)
      })

    channelRef.current = channel

    return () => {
      console.log('🔌 Student Cleaning up subscription for chatId:', chatId)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [chatId])


  // Subscription for assessment status changes
  useEffect(() => {
    const channel = supabase
      .channel('assessment-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assessment_submissions',
          filter: `student_id=eq.${currentUserId}`
        },
        (payload) => {
          console.log('🔄 Assessment status updated/inserted:', payload.new)
          setDbAssessments(prev => prev.map(assessment => {
            // Robust comparison
            if (String(assessment.id) === String(payload.new.assessment_id)) {
              return {
                ...assessment,
                mySubmission: {
                  ...(assessment.mySubmission || {}),
                  ...payload.new
                }
              }
            }
            return assessment
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  const [sessions, setSessions] = useState(initialSessions)

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[1]
  // Filter messages by activeSessionId
  const visibleMessages = messages.filter(m =>
    String(m.session_id) === String(activeSessionId)
  )

  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null)

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuMessageId !== null) {
        setActiveMenuMessageId(null)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [activeMenuMessageId])

  const [replyTo, setReplyTo] = useState(null)
  const [showAttachOptions, setShowAttachOptions] = useState(false)
  const [noteEditingId, setNoteEditingId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [selectedAttachment, setSelectedAttachment] = useState(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [assessmentSubmission, setAssessmentSubmission] = useState({
    textSubmission: '',
  })


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight
    }
  }, [messages.length, activeSessionId])

  // Fetch initial progress from course_session_progress
  useEffect(() => {
    const fetchProgress = async () => {
      const courseId = course?.course_id || course?.id
      // Ensure we have correct IDs based on role
      const mentorId = userRole === 'mentor' ? localStorage.getItem('auth_id') : (course?.mentor_id || course?.mentor_details?.mentor_id)
      const studentId = userRole === 'student' ? localStorage.getItem('auth_id') : course?.student_id

      if (!courseId || !mentorId || !studentId) {
        console.warn('Missing context IDs for progress fetch:', { courseId, mentorId, studentId })
        return
      }

      try {
        const { data, error } = await supabase
          .from('course_session_progress')
          .select('session_id, is_completed')
          .eq('course_id', courseId)
          .eq('mentor_id', mentorId)
          .eq('student_id', studentId)

        if (error) {
          console.error('Error fetching session progress:', error)
          return
        }

        if (data && data.length > 0) {
          const progressMap = new Map(data.map(p => [String(p.session_id), p.is_completed]))

          setSessions(prev => prev.map(session => {
            const sid = String(session.id || session.sessionId)
            const isCompleted = progressMap.get(sid)
            return {
              ...session,
              status: isCompleted ? 'completed' : 'upcoming'
            }
          }))
          console.log(`📊 Loaded progress for ${data.length} sessions`)
        }
      } catch (err) {
        console.error('Unexpected error fetching session progress:', err)
      }
    }

    fetchProgress()
  }, [course, userRole])

  const handleRescheduleAction = async (message, action) => {
    try {
      const data = JSON.parse(message.content);
      const isApproved = action === 'approve';

      // 1. Update the message content to reflect the new status
      const updatedData = { ...data, status: isApproved ? 'approved' : 'rejected' };

      const { error: msgError } = await supabase
        .from('messages')
        .update({ content: JSON.stringify(updatedData) })
        .eq('id', message.id);

      if (msgError) throw msgError;

      // 2. If approved, update the scheduled_classes table
      if (isApproved) {
        const { error: schedError } = await supabase
          .from('scheduled_classes')
          .update({
            scheduled_date: `${data.new_date}T${data.new_time}`
          })
          .eq('id', data.original_session_id);

        if (schedError) throw schedError;

        // Reset all reschedule flags regardless of approval/rejection (it's handled now)
        await supabase
          .from('scheduled_classes')
          .update({
            reschedule_request: false,
            reschedule_role: null,
            rescheduled_date: null,
            reschedule_reason: null
          })
          .eq('id', data.original_session_id);

        // 3. Send a confirmation message
        const confirmationMsg = {
          chat_id: chatId,
          session_id: activeSessionId,
          role: 'student',
          sender_id: currentUserId,
          content: `Reschedule ${action}d. The session is now set for ${new Date(data.new_date).toLocaleDateString()} at ${data.new_time}.`,
          type: 'text',
          read: false
        }

        await supabase.from('messages').insert([confirmationMsg]);
      } else {
        // Send rejection message
        const rejectionMsg = {
          chat_id: chatId,
          session_id: activeSessionId,
          role: 'student',
          sender_id: currentUserId,
          content: `Reschedule request rejected.`,
          type: 'text',
          read: false
        }
        await supabase.from('messages').insert([rejectionMsg]);

        // Reset the reschedule_request flag
        await supabase
          .from('scheduled_classes')
          .update({ reschedule_request: false, reschedule_role: null, rescheduled_date: null })
          .eq('id', data.original_session_id);
      }

      showModal('Success', `Reschedule ${action}d successfully!`, 'success');
    } catch (err) {
      console.error('Error handling reschedule action:', err);
      showModal('Error', 'Failed to process reschedule action.', 'error');
    }
  }

  const handleRescheduleConfirm = async ({ newDate, newTime, reason }) => {
    try {
      if (!selectedSession) return;

      const rescheduleData = {
        original_session_id: selectedSession.id,
        new_date: newDate,
        new_time: newTime,
        reason: reason,
        status: 'pending',
        proposed_by: 'student'
      }

      // Send to the current chat
      await supabase
        .from('messages')
        .insert([{
          chat_id: chatId,
          session_id: selectedSession.id,
          role: 'student',
          sender_id: currentUserId,
          content: JSON.stringify(rescheduleData),
          type: 'reschedule_request',
          read: false
        }])

      // Update the scheduled_classes table
      const { error: updateError } = await supabase
        .from('scheduled_classes')
        .update({
          reschedule_request: true,
          reschedule_role: 'student',
          rescheduled_date: `${newDate}T${newTime}`,
          reschedule_reason: reason
        })
        .eq('id', selectedSession.id)

      if (updateError) throw updateError

      showModal('Success', 'Reschedule request sent to mentor!', 'success')
      setShowRescheduleModal(false)
      if (showSessionsModal) fetchCourseSessions() // Refresh sessions if modal open
    } catch (err) {
      console.error('Error sending reschedule request:', err)
      showModal('Error', 'Failed to send reschedule request.', 'error')
    }
  }

  const handleRescheduleResponse = async (session, action) => {
    try {
      const isApproved = action === 'approve'

      // Find the reschedule request message
      const { data: messages, error: msgFetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .eq('session_id', session.id)
        .eq('type', 'reschedule_request')
        .order('created_at', { ascending: false })
        .limit(1)

      if (msgFetchError) throw msgFetchError

      if (messages && messages.length > 0) {
        await handleRescheduleAction(messages[0], action)
      } else {
        // Fallback if message not found - still update the session
        if (isApproved) {
          await supabase
            .from('scheduled_classes')
            .update({
              scheduled_date: session.rescheduled_date,
              reschedule_request: false,
              reschedule_role: null,
              rescheduled_date: null,
              reschedule_reason: null
            })
            .eq('id', session.id)
        } else {
          await supabase
            .from('scheduled_classes')
            .update({
              reschedule_request: false,
              reschedule_role: null,
              rescheduled_date: null,
              reschedule_reason: null
            })
            .eq('id', session.id)
        }
        showModal('Success', `Reschedule ${action}d successfully.`, 'success')
      }

      setIsResponseModalOpen(false)
      fetchCourseSessions() // Refresh list
    } catch (err) {
      console.error('Error in handleRescheduleResponse:', err)
      showModal('Error', 'Failed to process response.', 'error')
    }
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim() && !selectedAttachment) {
      console.warn('❌ Cannot send empty message')
      return
    }

    const trimmedInput = messageInput.trim()
    if (trimmedInput.includes('meet.google.com')) {
      setMessageInput('')
      showModal('Action Resticted', 'Only mentors can schedule and share meeting links through the official classroom scheduler.', 'warning')
      return
    }

    if (!chatId) {
      showModal('Entry Error', 'Chat session not found. Please re-enter the classroom.', 'error')
      return
    }

    let finalFileUrl = null
    let finalFileName = null
    let finalType = 'text'

    if (selectedAttachment) {
      const file = selectedAttachment.file
      finalType = selectedAttachment.type
      finalFileName = file.name

      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${activeSessionId}/${finalType}s/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-files')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('course-files')
          .getPublicUrl(fileName)
        
        finalFileUrl = publicUrl

        const courseId = course?.course_id || course?.id
        const { error: attachmentError } = await supabase
          .from('attachments')
          .insert({
            course_id: courseId,
            session_id: activeSessionId,
            uploaded_by: currentUserId,
            type: finalType,
            file_name: finalFileName,
            file_url: finalFileUrl,
            description: `${finalType === 'image' ? 'Image' : 'Document'} Attachment`,
            created_at: new Date().toISOString()
          })

        if (attachmentError) throw attachmentError

      } catch (err) {
        console.error('Error uploading attachment:', err)
        showModal('Error', 'Failed to upload attachment: ' + err.message, 'error')
        return
      }
    }

    const tempId = Date.now().toString()
    const pendingMsg = {
      chat_id: chatId,
      session_id: activeSessionId,
      role: userRole === 'mentor' ? 'mentor' : 'student',
      sender_id: currentUserId,
      content: trimmedInput || finalFileName,
      file_url: finalFileUrl,
      type: finalType,
      read: false,
      reply_to_id: replyTo ? replyTo.id : null,
      tempId: tempId
    }

    // Optimistically update the UI 
    const optimisticMsg = {
      ...pendingMsg,
      id: tempId, 
      from: 'learner', 
      type: finalType,   
      time: getCurrentTime(),
      replyTo: replyTo ? { ...replyTo } : null
    }
    setMessages(prev => [...prev, optimisticMsg])
    setMessageInput('')
    setSelectedAttachment(null)

    // 1. BROADCAST (Instant Path)
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'chat-message',
        payload: { ...optimisticMsg, from: 'mentor' } 
      })
    }

    // 2. SUPABASE DB (Persistent Path)
    const { tempId: _temp, ...dbMsg } = pendingMsg
    const { error } = await supabase
      .from('messages')
      .insert([dbMsg])

    if (error) {
      console.error('❌ Error sending message to Supabase:', error)
      showModal('Error', 'Failed to send message: ' + error.message, 'error')
      return
    }

    console.log('✅ Message sent successfully')
    setReplyTo(null)
    setShowAttachOptions(false)
  }

  const handleToggleHighlight = async (id) => {
    const currentMsg = messages.find(m => String(m.id) === String(id))
    if (!currentMsg) return
    const nextColor = currentMsg.highlightColor ? null : 'yellow'
    
    setMessages((prev) =>
      prev.map((m) => (String(m.id) === String(id) ? { ...m, highlightColor: nextColor } : m))
    )
    setActiveMenuMessageId(null)
    
    try {
      await supabase.from('messages').update({ student_highlight: nextColor }).eq('id', id)
    } catch (err) {
      console.error('Error updating highlight:', err)
    }
  }

  const handleSetHighlightColor = async (id, color) => {
    const currentMsg = messages.find(m => String(m.id) === String(id))
    if (!currentMsg) return
    const nextColor = currentMsg.highlightColor === color ? null : color
    
    setMessages((prev) =>
      prev.map((m) => (String(m.id) === String(id) ? { ...m, highlightColor: nextColor } : m))
    )
    setActiveMenuMessageId(null)
    
    try {
      await supabase.from('messages').update({ student_highlight: nextColor }).eq('id', id)
    } catch (err) {
      console.error('Error updating highlight:', err)
    }
  }

  const handleAddSelfNote = (id) => {
    const current = messages.find((m) => String(m.id) === String(id))
    setNoteDraft(current && current.selfNote ? current.selfNote : '')
    setNoteEditingId(id)
    setActiveMenuMessageId(null)
  }

  const handleReplyTo = (message) => {
    setReplyTo(message)
    setActiveMenuMessageId(null)
  }

  console.log('💾 [Step 3] Saving to Attachments Table, Course ID:', currentUserId)
  const handleAttachDocument = () => {
    console.log('👆 [Start] "Document" button clicked')
    if (docInputRef.current) {
      docInputRef.current.click()
    } else {
      console.error('❌ docInputRef is missing')
    }
  }

  const handleAttachImage = () => {
    if (imageInputRef.current) imageInputRef.current.click()
  }

  const handleDocSelected = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setSelectedAttachment({ file, type: 'file' })
    e.target.value = ''
    setShowAttachOptions(false)
  }

  const handleImageSelected = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setSelectedAttachment({ file, type: 'image' })
    e.target.value = ''
    setShowAttachOptions(false)
  }

  const handleAttachLink = async () => {
    const url = window.prompt('Paste a link to share:')
    if (!url || !url.trim()) return

    const linkUrl = url.trim() // Normalized URL

    try {
      console.log('🔗 [Step 1] Processing Link:', linkUrl)

      const courseId = course?.course_id || course?.id

      // Optional: Save to attachments if you want a repository of links
      console.log('💾 [Step 2] Saving Link to Attachments')
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('attachments')
        .insert({
          course_id: courseId,
          session_id: activeSessionId,
          uploaded_by: userid,
          type: 'link',
          file_name: linkUrl, // Using URL as name for links
          file_url: linkUrl,
          description: 'Shared Link',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (attachmentError) {
        console.error('❌ Link Attachment Error:', attachmentError)
        // Non-blocking for links
      }

      console.log('💬 [Step 3] Sending Link Message')
      const messagePayload = {
        chat_id: chatId,
        session_id: activeSessionId,
        role: userRole === 'mentor' ? 'mentor' : 'learner',
        sender_id: currentUserId,
        content: linkUrl, // URL as content
        file_url: linkUrl, // Use file_url for link too? Or just content. Let's use file_url for consistency if schema allows text there.
        read: false
        // Removed: type, linkLabel, url
      }

      const { error: msgError } = await supabase
        .from('messages')
        .insert([messagePayload])

      if (msgError) throw msgError

      console.log('✅ Link Sent Successfully')

      const newMessage = {
        ...messagePayload,
        id: Date.now(),
        from: userRole === 'mentor' ? 'mentor' : 'learner',
        time: getCurrentTime(),
        session_id: activeSessionId,
        highlightColor: null,
        selfNote: '',
      }
      setMessages((prev) => [...prev, newMessage])
      setShowAttachOptions(false)

    } catch (err) {
      console.error('❌ Error sharing link:', err)
      showModal('Error', 'Failed to share link: ' + err.message, 'error')
    }
  }







  const handleViewAssessment = (assessmentMessage) => {
    const assessmentId = assessmentMessage.assessmentId || assessmentMessage.id

    // Find full assessment from state (includes submission and attachments)
    const fullAssessment = dbAssessments.find(a => String(a.id) === String(assessmentId))

    if (fullAssessment) {
      // Merge: Take instructions from message (often up to date in chat), 
      // but take submission details from dbAssessments
      setSelectedAssessment({
        ...assessmentMessage,
        id: fullAssessment.id,
        assessmentTitle: assessmentMessage.assessmentTitle || fullAssessment.title,
        assessmentDescription: assessmentMessage.assessmentDescription || fullAssessment.description,
        assessmentDueDate: assessmentMessage.assessmentDueDate || fullAssessment.due_date,
        mySubmission: fullAssessment.mySubmission
      })
    } else {
      setSelectedAssessment(assessmentMessage)
    }

    // Reset submission form when opening assessment
    setAssessmentSubmission({ textSubmission: '', attachments: [] })
  }

  const handleAssessmentFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map(file => ({
      name: file.name,
      type: file.name.split('.').pop(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file: file,
    }))
    setAssessmentSubmission({
      ...assessmentSubmission,
      attachments: [...assessmentSubmission.attachments, ...newAttachments],
    })
  }

  const handleRemoveAssessmentAttachment = (index) => {
    setAssessmentSubmission({
      ...assessmentSubmission,
      attachments: assessmentSubmission.attachments.filter((_, i) => i !== index),
    })
  }

  const handleSubmitAssessment = async () => {
    if (!assessmentSubmission.textSubmission && assessmentSubmission.attachments.length === 0) {
      showModal('Submission Error', 'Please provide either text submission or attach files', 'error')
      return
    }

    try {
      console.log('🚀 Submitting Assessment:', selectedAssessment.id)

      const uploadedAttachments = []

      // 1. Upload Attachments if any
      if (assessmentSubmission.attachments.length > 0) {
        console.log('📤 Uploading attachments...')
        for (const attachment of assessmentSubmission.attachments) {
          const file = attachment.file
          const fileName = `assessments/${selectedAssessment.id}/${currentUserId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`

          const { error: uploadError } = await supabase.storage
            .from('course-files')
            .upload(fileName, file)

          if (uploadError) {
            console.error('❌ Attachment Upload Error:', uploadError)
            continue // Skip failed uploads or throw? Let's skip for resilience
          }

          const { data: { publicUrl } } = supabase.storage
            .from('course-files')
            .getPublicUrl(fileName)

          uploadedAttachments.push({
            name: file.name,
            url: publicUrl,
            type: attachment.type,
            size: attachment.size
          })
        }
      }

      // 2. Insert into assessment_submissions table
      console.log('💾 Saving submission to DB...')

      const finalSubmissionText = assessmentSubmission.textSubmission || ''

      const submissionPayload = {
        assessment_id: selectedAssessment.id,
        student_id: currentUserId,
        text_submission: finalSubmissionText, // Using text column to store everything
        // attachments: uploadedAttachments, // REMOVED: Column does not exist
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      }

      // Try inserting. If submission_text also fails, we will need to know the correct column name.
      const { data: submissionData, error: dbError } = await supabase
        .from('assessment_submissions')
        .insert([submissionPayload])
        .select()
        .single()

      if (dbError) {
        console.error('❌ DB Submission Error:', dbError)
        throw dbError
      }

      console.log('✅ Submission Saved!', submissionData)

      // 2.5 Insert Attachments into assessment_attachments table if any
      if (uploadedAttachments.length > 0 && submissionData) {
        console.log('💾 Saving attachments to DB...')
        const attachmentInserts = uploadedAttachments.map(att => ({
          submission_id: submissionData.id,
          file_name: att.name,
          file_url: att.url,
          file_size: att.size,
          file_type: att.type,
          created_at: new Date().toISOString()
        }))

        const { error: attError } = await supabase
          .from('assessment_attachments')
          .insert(attachmentInserts)

        if (attError) {
          console.warn('⚠️ Error saving to assessment_attachments:', attError)
          // We don't throw here as the main submission is already saved
        } else {
          console.log('✅ Attachments Saved!')
        }
      }

      // 3. Post confirmation to Chat
      const submissionMessage = {
        chat_id: chatId,
        session_id: activeSessionId,
        role: 'student',
        sender_id: currentUserId,
        type: 'text',
        content: `✅ Submitted assessment: "${selectedAssessment.assessmentTitle}"\n\n${assessmentSubmission.textSubmission ? 'Note: ' + assessmentSubmission.textSubmission : ''}\n${uploadedAttachments.length > 0 ? '📎 ' + uploadedAttachments.length + ' file(s) attached' : ''}`,
        read: false
      }

      const { error: msgError } = await supabase.from('messages').insert([submissionMessage])
      if (msgError) console.error('Error posting submission msg:', msgError)

      // Optimistic Chat Update
      const optimisticMsg = {
        ...submissionMessage,
        id: Date.now(),
        from: 'learner',
        time: getCurrentTime(),
        highlightColor: null,
        selfNote: ''
      }
      setMessages((prev) => [...prev, optimisticMsg])

      showModal('Success', 'Assessment submitted successfully!', 'success')
      setSelectedAssessment(null)
      setAssessmentSubmission({ textSubmission: '', attachments: [] })
      setShowAssessmentListModal(false)
      fetchDbAssessments() // Refresh list to show 'submitted' status

    } catch (err) {
      console.error('❌ Submission Failed:', err)
      showModal('Error', 'Failed to submit assessment: ' + err.message, 'error')
    }
  }

  const handleCompleteSession = async () => {
    // 1. Locally update the UI state
    const currentSession = sessions.find((s) => s.id === activeSessionId)
    const isCurrentlyCompleted = currentSession?.status === 'completed'
    const newCompletionStatus = !isCurrentlyCompleted

    setSessions((prev) => {
      if (!prev.length) return prev

      if (isCurrentlyCompleted) {
        return prev.map((s) => (s.id === activeSessionId ? { ...s, status: 'upcoming' } : s))
      }

      const updated = prev.map((s) => (s.id === activeSessionId ? { ...s, status: 'completed' } : s))
      const currentIndex = updated.findIndex((s) => s.id === activeSessionId)
      if (currentIndex !== -1) {
        const nextIndex = updated.findIndex((_, i) => i > currentIndex)
        if (nextIndex !== -1) setActiveSessionId(updated[nextIndex].id)
      }
      return updated
    })

    // 2. Persist to course_session_progress table if mentor
    if (userRole === 'mentor') {
      try {
        const mentorId = localStorage.getItem('auth_id')
        const courseId = course?.course_id || course?.id
        const sessionId = activeSessionId
        // student_id might be in the course object if it's an enrollment record
        const studentId = course?.student_id || null
        console.log("studentId", studentId)
        console.log("mentorId", mentorId)
        console.log("sessionId", sessionId)
        console.log("courseId", courseId)
        if (!courseId || !sessionId || !mentorId) {
          console.warn('Missing required IDs for progress update:', { courseId, sessionId, mentorId })
          return
        }

        const { error } = await supabase
          .from('course_session_progress')
          .upsert({
            course_id: courseId,
            session_id: sessionId,
            mentor_id: mentorId,
            student_id: studentId,
            is_completed: newCompletionStatus
          }, {
            onConflict: 'course_id,session_id,mentor_id,student_id'
          })

        if (error) {
          console.error('Error updating session progress:', error)
        } else {
          console.log(`✅ Session ${sessionId} progress updated to ${newCompletionStatus}`)
          if (refetch) refetch()
        }
      } catch (err) {
        console.error('Unexpected error updating session progress:', err)
      }
    }
  }

  const formatExternalLink = (url) => {
    if (!url || url === '#') return '#';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="live-classroom-page">
      {/* Minimal top bar like inspo */}
      {/* V2 Glass Header */}
      <header className="live-classroom-header-v2">
        <button className="live-back-btn-v2" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="live-header-title-v2">{classroom.classroom_name || classroom.title}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          <button
            className="live-complete-btn-v2"
            onClick={() => setShowSessionsModal(true)}
            title="Upcoming Sessions"
            style={{ background: 'rgba(42, 126, 255, 0.1)', color: '#2a7eff', border: '1px solid rgba(42, 126, 255, 0.2)' }}
          >
            <span className="material-symbols-outlined">event_list</span>
          </button>
          {userRole === 'mentor' && (
            <>
              <button
                className="live-complete-btn-v2"
                onClick={() => {
                  setShowAssessmentForm(true)
                  setShowAttachOptions(false)
                }}
                title="Create Assessment"
                style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}
              >
                <span className="material-symbols-outlined">assignment</span>
              </button>
              <button
                className="live-complete-btn-v2"
                onClick={handleAttachStudyMaterial}
                title="Upload Study Material"
                style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)' }}
              >
                <span className="material-symbols-outlined">folder_open</span>
              </button>
            </>
          )}
          {userRole === 'student' && (
            <button
              className="live-complete-btn-v2"
              onClick={() => setShowAssessmentListModal(true)}
              title="View All Assessments"
              style={{ background: 'rgba(42, 126, 255, 0.1)', color: '#2a7eff', border: '1px solid rgba(42, 126, 255, 0.2)' }}
            >
              <span className="material-symbols-outlined">assignment_ind</span>
            </button>
          )}

          <div
            className={`live-complete-btn-v2 ${activeSession.status === 'completed' ? 'completed' : ''}`}
            style={{ cursor: 'default' }}
          >
            <span className="material-symbols-outlined">
              {activeSession.status === 'completed' ? 'check_circle' : 'hourglass_empty'}
            </span>
            {activeSession.status === 'completed' ? 'Completed' : 'Pending'}
          </div>
        </div>
      </header>

      {/* Main chat area */}
      <div className="live-main live-main-full">
        <div className="live-session-label">{activeSession.title}</div>

        <div className="live-chat-area">
          <div className="live-chat-feed" ref={chatFeedRef}>
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`live-message ${message.from === 'mentor' ? 'from-mentor' : 'from-learner'}`}
              >
                <div
                  className={`live-message-bubble ${message.highlightColor ? `highlight-${message.highlightColor}` : ''
                    }`}
                >
                  {message.replyTo && (
                    <div className="live-reply-bubble-preview" style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', marginBottom: '8px', borderLeft: '3px solid #64748b', fontSize: '12px' }}>
                      <strong style={{ display: 'block', marginBottom: '2px', color: 'inherit', opacity: 0.8 }}>Replying to</strong>
                      <span style={{ opacity: 0.9 }}>{message.replyTo.content || message.replyTo.fileName || message.replyTo.linkLabel || message.replyTo.type}</span>
                    </div>
                  )}
                  {message.type === 'text' && <p>{message.content}</p>}
                  {message.type === 'file' && (
                    <div className="live-file-card">
                      <div className="live-file-icon">DOC</div>
                      <div className="live-file-info">
                        <div className="live-file-name">{message.fileName || message.content}</div>
                        {message.fileSize && <div className="live-file-meta">{message.fileSize}</div>}
                      </div>
                      <a
                        href={message.file_url || message.fileUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="live-file-download-btn"
                        style={{ marginLeft: 'auto', color: '#64748b' }}
                      >
                        <span className="material-symbols-outlined">download</span>
                      </a>
                    </div>
                  )}
                  {message.type === 'image' && (
                    <div className="live-image-card">
                      <img
                        src={message.imageUrl || message.file_url}
                        alt={message.fileName || message.content || 'Image'}
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  {message.type === 'link' && (
                    <a href={message.url} className="live-link-card" target="_blank" rel="noreferrer">
                      <div className="live-link-label">{message.linkLabel}</div>
                      <div className="live-link-url">{message.url}</div>
                    </a>
                  )}
                  {message.type === 'voice' && (
                    <VoiceMessage src={message.file_url || message.fileUrl} duration={message.duration || '0:00'} />
                  )}
                  {message.type === 'study_material' && (
                    <div className="live-study-material-card">
                      <div className="study-material-icon">
                        <span className="material-symbols-outlined">folder_open</span>
                      </div>
                      <div className="study-material-info">
                        <div className="study-material-label">Study Material</div>
                        <div className="study-material-name">{message.fileName || message.content}</div>
                        {message.fileSize && <div className="study-material-meta">{message.fileSize}</div>}
                      </div>
                      <a href={message.file_url || message.url} target="_blank" rel="noreferrer" className="study-material-download-btn">
                        <span className="material-symbols-outlined">download</span>
                      </a>
                    </div>
                  )}
                  {message.type === 'assessment' && (
                    <div
                      className="live-assessment-card"
                      onClick={() => userRole === 'student' && handleViewAssessment(message)}
                      style={{ cursor: userRole === 'student' ? 'pointer' : 'default' }}
                    >
                      <div className="assessment-card-header">
                        <div className="assessment-icon">📝</div>
                        <div className="assessment-badge">Assessment</div>
                      </div>
                      <h4 className="assessment-card-title">{message.assessmentTitle}</h4>
                      <p className="assessment-card-description">{message.assessmentDescription}</p>
                      <div className="assessment-card-footer">
                        <span className="assessment-due-date">Due: {new Date(message.assessmentDueDate).toLocaleDateString()}</span>
                        {userRole === 'student' && (
                          <button className="assessment-view-btn">View & Submit</button>
                        )}
                      </div>
                    </div>
                  )}
                  {message.type === 'scheduled_class' && (
                    <div className="live-assessment-card" style={{ borderColor: '#2a7eff', background: '#eff6ff' }}>
                      <div className="assessment-card-header">
                        <div className="assessment-icon">📅</div>
                        <div className="assessment-badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>Scheduled Class</div>
                      </div>
                      <h4 className="assessment-card-title">{message.classTitle || (message.content && (() => { try { return JSON.parse(message.content).title } catch (e) { return 'Live Class' } })())}</h4>
                      <div className="assessment-card-footer" style={{ marginTop: '8px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>event</span>
                          {new Date(message.classDate || (message.content && (() => { try { return JSON.parse(message.content).scheduled_date } catch (e) { return Date.now() } })())).toLocaleString()}
                        </div>
                        <a
                          href={formatExternalLink(message.classLink || (message.content && (() => { try { return JSON.parse(message.content).meeting_link } catch (e) { return '#' } })()))}
                          target="_blank"
                          rel="noreferrer"
                          className="assessment-view-btn"
                          style={{ width: '100%', textAlign: 'center', textDecoration: 'none', background: '#2a7eff' }}
                        >
                          Join Class
                        </a>
                      </div>
                    </div>
                  )}
                  {message.type === 'reschedule_request' && (() => {
                    try {
                      const data = JSON.parse(message.content);
                      if (data.status !== 'pending') return null;
                      return (
                        <div
                          className="live-assessment-card"
                          style={{
                            borderLeft: '4px solid #f59e0b',
                            background: '#fffef3',
                            minWidth: '240px',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            const data = JSON.parse(message.content);
                            setSelectedSession({ id: message.session_id, ...data });
                            setIsResponseModalOpen(true);
                          }}
                        >
                          <div className="assessment-card-header">
                            <div className="assessment-icon">⏳</div>
                            <div className="assessment-badge" style={{ background: '#fef3c7', color: '#92400e' }}>Reschedule Request</div>
                          </div>
                          <h4 className="assessment-card-title">New Proposed Time</h4>
                          <div className="assessment-card-footer" style={{ marginTop: '8px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ fontSize: '14px', color: '#475569' }}>
                              <strong>Date:</strong> {new Date(data.new_date).toLocaleDateString()}
                            </div>
                            <div style={{ fontSize: '14px', color: '#475569' }}>
                              <strong>Time:</strong> {data.new_time}
                            </div>
                            {data.reason && (
                              <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', background: '#f8fafc', padding: '6px', borderRadius: '4px', width: '100%' }}>
                                "{data.reason}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    } catch (e) {
                      return null;
                    }
                  })()}
                  {noteEditingId === message.id ? (
                    <div className="live-self-note-editor">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Type your private note..."
                      />
                      <div className="self-note-actions">
                        <button
                          type="button"
                          onClick={async () => {
                            const trimmed = noteDraft.trim()
                            if (trimmed) {
                              setMessages((prev) =>
                                prev.map((m) =>
                                  String(m.id) === String(message.id) ? { ...m, selfNote: trimmed } : m
                                )
                              )
                              
                              try {
                                await supabase.from('messages').update({ student_note: trimmed }).eq('id', message.id)
                              } catch (err) {
                                console.error('Error updating note:', err)
                              }
                            }
                            setNoteEditingId(null)
                            setNoteDraft('')
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNoteEditingId(null)
                            setNoteDraft('')
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    message.selfNote && (
                      <div className="live-self-note">
                        <span className="self-note-label">Note:</span> {message.selfNote}
                      </div>
                    )
                  )}
                  {message.type !== 'scheduled_class' && (
                    <>
                      <button
                        type="button"
                        className="live-message-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuMessageId(
                            activeMenuMessageId === message.id ? null : message.id
                          )
                        }}
                        aria-label="Message options"
                      >
                        ⋮
                      </button>
                      {activeMenuMessageId === message.id && (
                        <>
                          <div className="live-message-menu" onClick={(e) => e.stopPropagation()}>
                          <button type="button" onClick={() => handleToggleHighlight(message.id)}>
                            {message.highlightColor ? 'Remove highlight' : 'Highlight'}
                          </button>
                          <div className="live-message-menu-section">
                            <span className="live-menu-label">Highlight color</span>
                            <div className="live-highlight-colors">
                              <button
                                type="button"
                                className="live-highlight-color-btn yellow"
                                onClick={() => handleSetHighlightColor(message.id, 'yellow')}
                                aria-label="Highlight yellow"
                              />
                              <button
                                type="button"
                                className="live-highlight-color-btn red"
                                onClick={() => handleSetHighlightColor(message.id, 'red')}
                                aria-label="Highlight red"
                              />
                              <button
                                type="button"
                                className="live-highlight-color-btn green"
                                onClick={() => handleSetHighlightColor(message.id, 'green')}
                                aria-label="Highlight green"
                              />
                            </div>
                          </div>
                          <button type="button" onClick={() => handleAddSelfNote(message.id)}>
                            Add self note
                          </button>
                          <button type="button" onClick={() => handleReplyTo(message)}>
                            Reply
                          </button>
                        </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className="live-message-time">{message.time}</div>
              </div>
            ))}
          </div>

          {selectedAttachment && (
            <div className="selectedAttachmentPreview" style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined">{selectedAttachment.type === 'image' ? 'image' : 'description'}</span>
                <span style={{ fontSize: '14px', color: '#334155', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedAttachment.file.name}</span>
              </div>
              <button type="button" onClick={() => setSelectedAttachment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>
          )}
          <form className="live-message-input-container" onSubmit={handleSendMessage}>
            <button
              type="button"
              className="live-attach-btn"
              aria-label="Add message attachment"
              onClick={() => setShowAttachOptions((prev) => !prev)}
            >
              +
            </button>
            {replyTo && (
              <div className="live-reply-indicator">
                <span className="reply-label">Replying to</span>
                <span className="reply-preview">
                  {replyTo.content || replyTo.fileName || replyTo.linkLabel || replyTo.type}
                </span>
                <button
                  type="button"
                  className="reply-cancel-btn"
                  onClick={() => setReplyTo(null)}
                  aria-label="Cancel reply"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="text"
              className="live-message-input"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button type="submit" className="live-send-btn" disabled={!messageInput.trim()}>
              ➤
            </button>
          </form>
          {showAttachOptions && (
            <>
              <div 
                className="attach-options-overlay" 
                onClick={() => setShowAttachOptions(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 45,
                  background: 'transparent'
                }}
              />
              <div className="live-attach-sheet-v2" style={{ zIndex: 50 }}>
                <button 
                  type="button"
                  className="attach-close-btn" 
                  onClick={() => setShowAttachOptions(false)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                </button>

                <button className="attach-option-btn" onClick={handleAttachDocument}>
                  <div className="attach-icon-circle purple">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <span className="attach-label">Document</span>
                </button>

                <button className="attach-option-btn" onClick={handleAttachImage}>
                  <div className="attach-icon-circle pink">
                    <span className="material-symbols-outlined">image</span>
                  </div>
                  <span className="attach-label">Gallery</span>
                </button>
              </div>
            </>
          )}

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={docInputRef}
            onChange={handleDocSelected}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.txt"
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageSelected}
            style={{ display: 'none' }}
            accept="image/*"
          />




          {/* Assessment View Modal for Students */}
          {selectedAssessment && userRole === 'student' && (
            <div className="live-assessment-modal-overlay" onClick={() => setSelectedAssessment(null)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header" style={{
                  background: 'linear-gradient(to right, #ffffff, #f8fafc)',
                  padding: '24px 32px',
                  borderBottom: '1px solid #e2e8f0',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
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
                      color: '#2a7eff'
                    }}>
                      <span className="material-symbols-outlined">assignment</span>
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Assessment Details</h2>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Check instructions and submit your work</p>
                    </div>
                  </div>
                  <button
                    className="assessment-modal-close-btn"
                    onClick={() => setSelectedAssessment(null)}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="assessment-modal-content" style={{ padding: '32px' }}>
                  <div className="assessment-view-header" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>{selectedAssessment.assessmentTitle}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>school</span>
                        {course?.title || 'Course'}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#ef4444',
                        background: '#fef2f2',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>event</span>
                        Due: {selectedAssessment.assessmentDueDate ? new Date(selectedAssessment.assessmentDueDate).toLocaleDateString() : 'To be announced'}
                      </span>
                    </div>
                  </div>

                  <div className="assessment-view-description" style={{
                    background: '#f8fafc',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '32px'
                  }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0', color: '#1e293b' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#64748b' }}>info</span>
                      Instructions
                    </h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {selectedAssessment.assessmentDescription}
                    </p>
                  </div>

                  {/* Submission Form OR Status View */}
                  {selectedAssessment.mySubmission && ['submitted', 'completed', 'graded'].includes(selectedAssessment.mySubmission.status?.toLowerCase()) ? (
                    <div className="assessment-submission-form disabled-submission" style={{ opacity: 0.9 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0 }}>Your Submission</h4>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: selectedAssessment.mySubmission.status === 'completed' ? '#166534' : '#1e40af',
                          background: selectedAssessment.mySubmission.status === 'completed' ? '#dcfce7' : '#dbeafe',
                          padding: '4px 12px',
                          borderRadius: '12px'
                        }}>
                          {selectedAssessment.mySubmission.status === 'completed' ? '✓ Completed' : '✓ Submitted'}
                        </span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Write your response / description</label>
                        <div style={{
                          background: '#f8fafc',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          minHeight: '200px'
                        }}>
                          {(() => {
                            const rawText = selectedAssessment.mySubmission.text_submission || selectedAssessment.mySubmission.submission_text || ''
                            if (!rawText) return <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>No text submission provided.</p>

                            const cleanedText = cleanSubmissionText(rawText)
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
                                            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', display: 'block', backgroundColor: '#fff' }}
                                          />
                                        </div>
                                      )
                                    }
                                    return <a key={index} href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#2a7eff', textDecoration: 'underline', fontWeight: '500' }}>{alt || url}</a>
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
                                                color: '#2a7eff',
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
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>attach_file</span>
                          Submitted Attachments
                        </label>

                        {(() => {
                          const dbAttachments = selectedAssessment.mySubmission.assessment_attachments || [];
                          const extractedAttachments = extractAttachmentsFromText(selectedAssessment.mySubmission.text_submission);

                          // Filter out extracted URLs that might already be in dbAttachments (by URL)
                          const uniqueExtracted = extractedAttachments.filter(ext =>
                            !dbAttachments.some(db => db.file_url === ext.file_url)
                          );

                          const allAttachments = [...dbAttachments, ...uniqueExtracted];

                          if (allAttachments.length > 0) {
                            return (
                              <div className="attachments-list" style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(0, 1fr)',
                                gap: '12px',
                                marginTop: '8px'
                              }}>
                                {allAttachments.map((attachment, idx) => (
                                  <div key={idx} className="attachment-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className="attachment-item" style={{
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
                                            {attachment.file_url && (attachment.file_url.toLowerCase().includes('png') || attachment.file_url.toLowerCase().includes('jpg') || attachment.file_url.toLowerCase().includes('jpeg')) ? 'image' : 'description'}
                                          </span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {attachment.file_name}
                                          </p>
                                          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                                            {attachment.file_size ? `${(attachment.file_size / 1024).toFixed(1)} KB` : (attachment.is_extracted ? 'Text Link' : 'Attached File')}
                                          </p>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <a
                                          href={attachment.file_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            padding: '8px 16px',
                                            background: '#eff6ff',
                                            color: '#2a7eff',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s ease'
                                          }}
                                        >
                                          View
                                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                                        </a>
                                      </div>
                                    </div>

                                    {/* Inline Image Preview */}
                                    {attachment.file_url && (attachment.file_url.toLowerCase().includes('png') || attachment.file_url.toLowerCase().includes('jpg') || attachment.file_url.toLowerCase().includes('jpeg')) && (
                                      <div style={{
                                        marginTop: '12px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        background: '#fff'
                                      }}>
                                        <img
                                          src={attachment.file_url}
                                          alt={attachment.file_name}
                                          style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain', display: 'block' }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
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

                      <div className="assessment-view-actions">
                        <button
                          className="btn-secondary btn-full"
                          disabled
                          style={{
                            opacity: 1,
                            background: '#e2e8f0',
                            color: '#475569',
                            cursor: 'not-allowed',
                            fontWeight: '600',
                            border: '1px solid #cbd5e1',
                            height: '44px' // Ensure normal height
                          }}
                        >
                          Already Submitted
                        </button>
                        <button
                          className="btn-secondary btn-full"
                          style={{ pointerEvents: 'auto', opacity: 1, cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedAssessment(null)
                            setAssessmentSubmission({ textSubmission: '', attachments: [] })
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="assessment-submission-form">
                      <h4>Your Submission</h4>

                      <div className="form-group">
                        <label className="form-label">Write your response / description</label>
                        <textarea
                          className="form-textarea"
                          rows="8"
                          placeholder="Describe your work, explain your approach, or provide any additional context..."
                          value={assessmentSubmission.textSubmission}
                          onChange={(e) => setAssessmentSubmission({ ...assessmentSubmission, textSubmission: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Attach Files / Documents</label>
                        <div className="file-upload-area">
                          <input
                            type="file"
                            id="assessment-file-upload"
                            multiple
                            className="file-input"
                            ref={assessmentFileInputRef}
                            onChange={handleAssessmentFileUpload}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="assessment-file-upload" className="file-upload-label">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Click to upload files or drag and drop
                          </label>
                        </div>

                        {assessmentSubmission.attachments.length > 0 && (
                          <div className="attachments-list" style={{ marginTop: '12px' }}>
                            {assessmentSubmission.attachments.map((attachment, idx) => (
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
                                  onClick={() => handleRemoveAssessmentAttachment(idx)}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="assessment-view-actions">
                        <button
                          className="btn-primary btn-full"
                          onClick={handleSubmitAssessment}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                          Submit Assessment
                        </button>
                        <button
                          className="btn-secondary btn-full"
                          onClick={() => {
                            setSelectedAssessment(null)
                            setAssessmentSubmission({ textSubmission: '', attachments: [] })
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Assessment List Modal for Students */}
          {showAssessmentListModal && (
            <div className="live-assessment-modal-overlay" onClick={() => setShowAssessmentListModal(false)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header" style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  display: 'flex',
                  padding: '24px 32px'
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
                      color: '#2a7eff'
                    }}>
                      <span className="material-symbols-outlined">assignment</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>All Assessments</h2>
                  </div>
                  <button
                    className="assessment-modal-close-btn"
                    onClick={() => setShowAssessmentListModal(false)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                  </button>
                </div>
                <div className="assessment-modal-content">
                  <div className="assessment-list-container">
                    {dbAssessments.length > 0 ? (
                      dbAssessments.map((assessment, idx) => (
                        <div
                          key={assessment.id || idx}
                          className="assessment-list-item"
                          onClick={() => {
                            console.log(' [DEBUG] Assessment Clicked:', assessment)

                            // 1. Reset submission state FIRST to avoid stale data conflicts
                            setAssessmentSubmission({ textSubmission: '', attachments: [] })
                            console.log('🔄 [DEBUG] assessmentSubmission state reset')

                            const mapped = {
                              id: assessment.id,
                              assessmentTitle: assessment.title || 'Untitled Assessment',
                              assessmentDescription: assessment.description || '',
                              assessmentDueDate: assessment.due_date || assessment.created_at,
                              mySubmission: assessment.mySubmission // Critical: Pass submission status
                            }
                            console.log('✨ [DEBUG] Setting selectedAssessment:', mapped)

                            setSelectedAssessment(mapped)
                            setShowAssessmentListModal(false)
                          }}
                          style={{
                            padding: '16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            background: '#fff',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2a7eff'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{assessment.title}</h4>
                            <span style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: assessment.mySubmission?.status === 'completed' ? '#dcfce7' : assessment.mySubmission?.status === 'submitted' ? '#dbeafe' : '#f1f5f9',
                              color: assessment.mySubmission?.status === 'completed' ? '#166534' : assessment.mySubmission?.status === 'submitted' ? '#1e40af' : '#64748b'
                            }}>
                              {assessment.mySubmission?.status ? (assessment.mySubmission.status.charAt(0).toUpperCase() + assessment.mySubmission.status.slice(1)) : 'Pending'}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {assessment.description}
                          </p>
                          <div style={{ alignSelf: 'flex-end', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                            {/* Due: {new Date(assessment.due_date).toLocaleDateString()} */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                        No assessments available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Sessions Modal */}
          {showSessionsModal && (
            <div className="live-assessment-modal-overlay" style={{ zIndex: 10001 }} onClick={() => setShowSessionsModal(false)}>
              <div className="live-assessment-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header" style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  display: 'flex',
                  padding: '24px 32px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#f0f9ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2a7eff'
                    }}>
                      <span className="material-symbols-outlined">event_list</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Upcoming Sessions</h2>
                  </div>
                  <button
                    className="assessment-modal-close-btn"
                    onClick={() => setShowSessionsModal(false)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                  </button>
                </div>

                <div className="assessment-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
                  {loadingSessions ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }}>sync</span>
                      <p>Loading sessions...</p>
                    </div>
                  ) : courseSessions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>event_busy</span>
                      <p>No sessions scheduled for this course.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {courseSessions.map((session) => (
                        <div
                          key={session.id}
                          className="session-card-elegant"
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '16px',
                            opacity: session.is_complete ? 0.6 : 1,
                            filter: session.is_complete ? 'grayscale(0.5)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{session.title}</h4>
                              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#64748b' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span>
                                  {session.date}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                                  {session.time}
                                </span>
                              </div>
                            </div>
                            <span style={{
                              padding: '4px 10px',
                              background: session.is_complete ? '#dcfce7' : (new Date().getTime() > new Date(session.scheduled_date).getTime() ? '#fef2f2' : '#e0f2fe'),
                              color: session.is_complete ? '#166534' : (new Date().getTime() > new Date(session.scheduled_date).getTime() ? '#991b1b' : '#0369a1'),
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '600',
                              textTransform: 'uppercase'
                            }}>
                              {session.is_complete ? 'Completed' : (new Date().getTime() > new Date(session.scheduled_date).getTime() ? 'Missed' : 'Upcoming')}
                            </span>
                          </div>

                          {!session.is_complete && session.reschedule_request && (
                            <div style={{
                              marginTop: '12px',
                              background: '#fffef3',
                              border: '1px solid #fde68a',
                              borderRadius: '8px',
                              padding: '12px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#f59e0b' }}>history_toggle_off</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#92400e' }}>Reschedule Requested</span>
                              </div>

                              <div style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                                <strong>Proposed:</strong> {new Date(session.rescheduled_date).toLocaleString()}
                                {session.reschedule_reason && (
                                  <div style={{ marginTop: '4px', fontStyle: 'italic', fontSize: '12px' }}>
                                    "{session.reschedule_reason}"
                                  </div>
                                )}
                              </div>

                              {session.reschedule_role === 'mentor' ? (
                                <button
                                  className="btn-primary"
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    fontSize: '12px',
                                    background: '#2a7eff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                  }}
                                  onClick={() => {
                                    localStorage.setItem('open_reschedule_session_id', session.id);
                                    setSelectedSession(session);
                                    setIsResponseModalOpen(true);
                                    setShowSessionsModal(false);
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>history_toggle_off</span>
                                  Respond to Request
                                </button>
                              ) : (
                                <button
                                  className="btn-secondary"
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    fontSize: '12px',
                                    background: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    color: '#475569',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                  }}
                                  onClick={() => {
                                    localStorage.setItem('open_reschedule_session_id', session.id);
                                    setSelectedSession(session);
                                    setShowRescheduleModal(true);
                                    setShowSessionsModal(false);
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit_calendar</span>
                                  Edit My Request
                                </button>
                              )}
                            </div>
                          )}

                          {!session.is_complete && !session.reschedule_request && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              {session.meeting_link && (
                                <a
                                  href={formatExternalLink(session.meeting_link)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-primary"
                                  style={{
                                    flex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none', padding: '8px 16px', fontSize: '13px',
                                    ...(new Date().getTime() < new Date(session.scheduled_date).getTime() - 10 * 60000 ? { pointerEvents: 'none', opacity: 0.5 } : {})
                                  }}
                                  onClick={(e) => {
                                    if (new Date().getTime() < new Date(session.scheduled_date).getTime() - 10 * 60000) {
                                      e.preventDefault();
                                      showModal('Too Early', 'You can only join the meeting 10 minutes before the scheduled time.', 'info');
                                    }
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>video_call</span>
                                  {new Date().getTime() < new Date(session.scheduled_date).getTime() - 10 * 60000 ? 'Not Yet Started' : 'Join Meeting'}
                                </a>
                              )}
                              <button
                                className="btn-secondary"
                                style={{
                                  flex: 1,
                                  padding: '8px',
                                  fontSize: '12px',
                                  background: 'white',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  color: '#64748b',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px'
                                }}
                                onClick={() => {
                                  localStorage.setItem('open_reschedule_session_id', session.id);
                                  setSelectedSession(session);
                                  setShowRescheduleModal(true);
                                  setShowSessionsModal(false);
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                                Reschedule
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            style={{ display: 'none' }}
            onChange={handleDocSelected}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelected}
          />
          {/* Recording Overlay UI */}
        </div>

        {/* Bottom sessions bar */}
        <div className="live-sessions-bar">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`live-session-chip ${session.status} ${session.id === activeSessionId ? 'current' : ''
                }`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span className="live-session-title">{session.title}</span>
              <span className="live-session-status">
                {session.status === 'current'
                  ? 'Now'
                  : session.status === 'completed'
                    ? 'Completed'
                    : 'Upcoming'}
              </span>
            </button>
          ))}
          <div
            className="live-course-complete-btn"
            style={{ cursor: 'default', opacity: 0.8 }}
          >
            <span className="live-session-title">Course Complete</span>
          </div>


        </div>

        {/* Course Completion Modal */}
        {showCompletionModal && (
          <div className="live-completion-modal-overlay" onClick={() => setShowCompletionModal(false)}>
            <div className="live-completion-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="live-completion-modal-title">Course Completed!</h2>
              <p className="live-completion-modal-description">
                Great job on completing this course. You've taken an important step forward in your learning journey.
                <br /><br />
                You can now close this classroom and access your progress and next steps from your dashboard.
              </p>
              <div className="live-completion-modal-info">
                <p>• Your completion will be recorded</p>
                <p>• You can revisit course materials anytime</p>
              </div>
              <div className="live-completion-modal-actions">
                <button
                  type="button"
                  className="live-completion-modal-primary"
                  onClick={onBack}
                >
                  ✅ Close Classroom
                </button>
                <button
                  type="button"
                  className="live-completion-modal-secondary"
                  onClick={() => {
                    setShowCompletionModal(false)
                    // Navigate to dashboard - you may need to adjust this based on your routing
                    if (onBack) onBack()
                  }}
                >
                  ⬅️ Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleRescheduleConfirm}
        sessionDetails={selectedSession}
      />

      <RescheduleResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        sessionDetails={selectedSession}
        onApprove={(s) => handleRescheduleResponse(s, 'approve')}
        onReject={(s) => handleRescheduleResponse(s, 'reject')}
      />

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

export default StudentLiveClassroom
