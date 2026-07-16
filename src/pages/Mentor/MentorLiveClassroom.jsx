import { useState, useRef, useEffect, useMemo } from 'react'
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'
import RescheduleModal from '../../components/RescheduleModal.jsx'
import RescheduleResponseModal from '../../components/RescheduleResponseModal.jsx'
import MessageModal from '../../components/shared/MessageModal.jsx'

function MentorLiveClassroom({ course, onBack, onNavigate }) {
  const userRole = 'mentor'
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
  const [messageInput, setMessageInput] = useState('')
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [showAssessmentListModal, setShowAssessmentListModal] = useState(false)
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    dueDate: '',
  })
  const [showScheduleClassModal, setShowScheduleClassModal] = useState(false)
  const [scheduleClassData, setScheduleClassData] = useState({
    title: '',
    scheduled_date: '',
    meeting_link: ''
  })
  const [messages, setMessages] = useState([])
  const chatFeedRef = useRef(null)
  const docInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const studyMaterialInputRef = useRef(null)
  const assessmentFileInputRef = useRef(null)
  const channelRef = useRef(null)

  const [dbAssessments, setDbAssessments] = useState([])
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [sessions, setSessions] = useState(initialSessions)
  const [courseSessions, setCourseSessions] = useState([])
  const [scheduledClasses, setScheduledClasses] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)

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
    if (showAssessmentListModal) {
      fetchDbAssessments()
    }
  }, [showAssessmentListModal])

  useEffect(() => {
    if (course?.course_id || course?.id) {
      fetchCourseSessions()
      fetchScheduledClasses()
    }
  }, [course?.course_id, course?.id])

  const fetchCourseSessions = async () => {
    try {
      setLoadingSessions(true)
      const courseId = course?.course_id || course?.id
      const { data, error } = await supabase
        .from('course_sessions')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (error) throw error

      if (data) {
        setCourseSessions(data)

        // Also sync the local sessions state so the bottom bar and activeSession update instantly without reload
        setSessions(data.map(session => ({
          ...session,
          status: 'upcoming'
        })))
      }
    } catch (err) {
      console.error('Error fetching course sessions:', err)
    } finally {
      setLoadingSessions(false)
    }
  }

  const fetchScheduledClasses = async () => {
    try {
      const courseId = course?.course_id || course?.id
      const { data, error } = await supabase
        .from('scheduled_classes')
        .select('*, courses(title), reschedule_request, reschedule_role, rescheduled_date, reschedule_reason, is_complete')
        .eq('course_id', courseId)
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
        setScheduledClasses(mapped)
      }
    } catch (err) {
      console.error('Error fetching scheduled classes:', err)
    }
  }

  // --- Dynamic Imminent Class Time Tick ---
  const [timeTick, setTimeTick] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTimeTick(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

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
      const { data, error } = await supabase
        .from('assessments')
        .select('*, assessment_submissions(count)')
        .eq('course_id', course?.course_id || course?.id)
        .eq('student_id', Number(course?.student_id)) // ISOLATION: Only show assessments for this student
        .order('created_at', { ascending: false })

      if (error) throw error
      setDbAssessments(data || [])
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
          .eq('chat_id', Number(chatId))
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
            if (m.type === 'assessment') {
              try {
                const details = typeof m.content === 'string' && m.content.startsWith('{')
                  ? JSON.parse(m.content)
                  : m.content
                Object.assign(m, details)
              } catch (e) {
                console.warn('Failed to parse assessment content:', e)
              }
            }
            if (!m.type && m.file_url) {
              const ext = m.file_url.split('.').pop().toLowerCase()
              if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) inferredType = 'image'
              else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) inferredType = 'file'
            } else if (!m.type && (m.content || '').match(/^https?:\/\//)) {
              inferredType = 'link'
            }

            let replyToObj = null
            if (m.reply_to_id) {
               const repliedMsg = data.find(orig => String(orig.id) === String(m.reply_to_id))
               if (repliedMsg) replyToObj = { ...repliedMsg } 
            }

            return {
              ...m,
              from: m.sender_id.toString() === currentUserId?.toString() ? 'mentor' : 'learner',
              type: inferredType,
              time: m.created_at ? new Date(m.created_at + (m.created_at.includes('Z') || m.created_at.includes('+') ? '' : 'Z')).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : getCurrentTime(),
              highlightColor: m.mentor_highlight || null,
              selfNote: m.mentor_note || '',
              replyTo: replyToObj
            }
          })
          console.log('🗺️ Mapped messages:', mapped)
          setMessages(mapped)
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

    console.log('📡 Setting up subscription for chatId:', chatId)
    const channel = supabase
      .channel(`chat:${chatId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        console.log('📥 NEW Realtime payload received:', payload)
        const newMessage = payload.new || payload.old
        if (!newMessage) return;

        setMessages((prev) => {
          // 1. Check if ID exists and update if it's an UPDATE event
          if (prev.some(m => String(m.id) === String(newMessage.id))) {
            return prev.map(m => String(m.id) === String(newMessage.id) ? { ...m, ...newMessage } : m);
          }
          
          if (payload.eventType !== 'INSERT') return prev;

          // 2. Check if this payload is the "real" version of an optimistic message
          // (Matching content and sender and recent timestamp)
          const optimisticMatchIndex = prev.findIndex(m =>
            m.content === newMessage.content &&
            String(m.sender_id) === String(newMessage.sender_id) &&
            Number(m.id) > 1700000000000 // Treat as number, handles Date.now() strings and numbers
          )

          // Infer type from file_url or content if type is missing from DB
          if (newMessage.type === 'assessment') {
            try {
              const details = JSON.parse(newMessage.content)
              Object.assign(newMessage, details)
            } catch (e) { }
          }
          let inferredType = newMessage.type || 'text'
          if (!newMessage.type && newMessage.file_url) {
            const ext = newMessage.file_url.split('.').pop().toLowerCase()
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) inferredType = 'image'
            else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) inferredType = 'file'
          } else if (!newMessage.type && (newMessage.content || '').startsWith('http')) {
            inferredType = 'link'
          }

          let replyToObj = null
          if (newMessage.reply_to_id) {
             const repliedMsg = prev.find(orig => String(orig.id) === String(newMessage.reply_to_id))
             if (repliedMsg) replyToObj = { ...repliedMsg }
          }
          const msgForState = {
            ...newMessage,
            from: newMessage.sender_id.toString() === currentUserId?.toString() ? 'mentor' : 'learner',
            type: inferredType,
            time: newMessage.created_at ? new Date(newMessage.created_at + (newMessage.created_at.includes('Z') || newMessage.created_at.includes('+') ? '' : 'Z')).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : getCurrentTime(),
            replyTo: replyToObj
          }

          if (optimisticMatchIndex !== -1) {
            console.log('🔄 Replacing optimistic message with real DB entry')
            const newState = [...prev]
            // Keep optimistic type if it was specific (like study_material) and DB is generic 'file'
            // or just strictly use DB state? Let's Merge carefully.
            newState[optimisticMatchIndex] = { ...newState[optimisticMatchIndex], ...msgForState }
            return newState

          }

          console.log('✅ Appending new realtime message')
          return [...prev, msgForState]
        })
      })
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        console.log('🚀 Mentor Broadcast received:', payload)
        setMessages((prev) => {
          if (prev.some(m => (m.tempId && m.tempId === payload.tempId) || String(m.id) === String(payload.id))) return prev
          return [...prev, { ...payload, from: 'learner' }].sort((a, b) => new Date(a.created_at || a.id) - new Date(b.created_at || b.id))
        })
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'scheduled_classes',
        filter: course?.course_id || course?.id ? `course_id=eq.${course?.course_id || course?.id}` : undefined
      }, (payload) => {
        console.log('🔄 Realtime update for scheduled_classes:', payload)
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const newRow = payload.new;
          if (!newRow) return;
          const mappedRow = {
            ...newRow,
            date: newRow.scheduled_date ? new Date(newRow.scheduled_date).toLocaleDateString() : '',
            time: newRow.scheduled_date ? new Date(newRow.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
          };

          setScheduledClasses(prev => {
             let updated = [...prev];
             const idx = updated.findIndex(s => String(s.id) === String(newRow.id));
             if (idx > -1) {
                updated[idx] = { ...updated[idx], ...mappedRow };
             } else {
                updated.push(mappedRow);
             }
             updated.sort((a, b) => {
               if (a.is_complete === b.is_complete) return 0;
               return a.is_complete ? 1 : -1;
             });
             return updated;
          });
        }
      })
      .subscribe((status) => {
        console.log('📡 Subscription status update:', status)
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime channel error. Check Supabase DB Replication settings.')
        }
      })

    channelRef.current = channel

    return () => {
      console.log('🔌 Cleaning up subscription for chatId:', chatId)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [chatId])


  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || {}
  
  const imminentClasses = useMemo(() => {
    const now = new Date(timeTick);
    const classes = [];
    
    scheduledClasses?.forEach(cls => {
        if (cls.is_complete || !cls.scheduled_date) return;
        if (String(cls.session_id) !== String(activeSessionId)) return; // Only show for current session
        
        const schedTime = new Date(cls.scheduled_date);
        const diffMins = (schedTime - now) / 60000;
        
        // Show 5 mins before, disappear 15 mins after scheduled time
        if (diffMins <= 5 && diffMins > -15) {
            classes.push(cls);
        }
    });
    return classes;
  }, [scheduledClasses, activeSessionId, timeTick]);

  // Filter messages by activeSessionId
  const visibleMessages = useMemo(() => {
    const cleanMessages = messages.filter(m => m.type !== 'class_imminent');
    return cleanMessages.filter(m => {
      if (Number(m.session_id) === Number(activeSessionId)) return true;
      
      const scheduledClass = scheduledClasses?.find(s => Number(s.session_id) === Number(activeSessionId));
      if (scheduledClass && Number(m.session_id) === Number(scheduledClass.id)) return true;
      
      return false;
    }).sort((a,b) => new Date(a.created_at || a.id) - new Date(b.created_at || b.id));
  }, [messages, scheduledClasses, activeSessionId]);

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
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  // Removed student assessment view states

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
          const progressMap = new Map(data.map(p => [Number(p.session_id), p.is_completed]))

          setSessions(prev => prev.map(session => {
            const sid = Number(session.id || session.sessionId)
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

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    console.log('💬 Attempting to send message:', { messageInput, chatId, userRole, currentUserId })

    if (!messageInput.trim()) {
      console.warn('❌ Cannot send empty message')
      return
    }

    const trimmedInput = messageInput.trim()
    // Detect Google Meet links
    if (trimmedInput.includes('meet.google.com')) {
      console.log('📽️ Google Meet link detected. Redirecting to schedule modal.')
      setMessageInput('')
      setScheduleClassData(prev => ({ ...prev, meeting_link: trimmedInput }))
      setShowScheduleClassModal(true)
      showModal('Official Scheduler', 'Please use the schedule classroom feature for meeting links. We have pre-filled the link for you.', 'info')
      return
    }

    if (!chatId) {
      console.error('❌ Cannot send message: chatId is missing. Course data:', course)
      showModal('Entry Error', 'Chat session not found. Please re-enter the classroom.', 'error')
      return
    }

    const pendingMsg = {
      chat_id: Number(chatId),
      session_id: Number(activeSessionId),
      role: userRole === 'mentor' ? 'mentor' : 'student',
      sender_id: Number(currentUserId),
      content: messageInput.trim(),
      read: false,
      reply_to_id: replyTo ? replyTo.id : null
    }

    console.log('📤 Sending to DB (type is omitted for DB):', pendingMsg)

    // Optimistically update the UI so the user sees it immediately
    const optimisticMsg = {
      ...pendingMsg,
      id: Date.now(), // temporary ID
      from: 'learner', // Right side for YOU
      type: 'text',   // REQUIRED for UI to show the text
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      replyTo: replyTo ? { ...replyTo } : null
    }
    setMessages(prev => [...prev, optimisticMsg])

    // 1. BROADCAST (Instant Path)
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'chat-message',
        payload: { ...optimisticMsg, from: 'mentor' } // Recipient sees message from 'mentor'
      })
    }

    // Insert to Supabase
    const { error } = await supabase
      .from('messages')
      .insert([pendingMsg])

    if (error) {
      console.error('❌ Error sending message to Supabase:', error)
      showModal('Error', 'Failed to send message: ' + error.message, 'error')
      return
    }

    console.log('✅ Message sent successfully')
    setMessageInput('')
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
      await supabase.from('messages').update({ mentor_highlight: nextColor }).eq('id', id)
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
      await supabase.from('messages').update({ mentor_highlight: nextColor }).eq('id', id)
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

  const handleDocSelected = async (e) => {
    console.log('📄 [Step 1] Document Selection Started')
    const file = e.target.files && e.target.files[0]
    if (!file) {
      console.warn('⚠️ No file selected')
      return
    }

    try {
      console.log('📤 [Step 2] Uploading file to Storage:', file.name)
      const fileExt = file.name.split('.').pop()
      const fileName = `${activeSessionId}/docs/${Date.now()}_${file.name.replace(/\s+/g, '_')}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(fileName, file)

      if (uploadError) {
        console.error('❌ Upload Error:', uploadError)
        throw uploadError
      }
      console.log('✅ Upload Success:', uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from('course-files')
        .getPublicUrl(fileName)

      // Get course ID safely
      const courseId = course?.course_id || course?.id

      console.log('💾 [Step 3] Saving to Attachments Table, User ID:', currentUserId)
      console.log('📦 Attachment payload to insert:', {
        course_id: courseId,
        session_id: activeSessionId,
        uploaded_by: currentUserId,
        type: 'file',
        file_name: file.name,
        file_url: publicUrl,
        description: 'Document Attachment',
        created_at: new Date().toISOString()
      })
      // Insert into Attachments
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('attachments')
        .insert({
          course_id: courseId,
          session_id: activeSessionId,
          uploaded_by: currentUserId,
          type: 'file', // Standard document type
          file_name: file.name,
          file_url: publicUrl,
          description: 'Document Attachment',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (attachmentError) {
        console.error('❌ Attachment Insert Error:', attachmentError)
        showModal('Error', 'Failed to save attachment info: ' + attachmentError.message, 'error')
      } else {
        console.log('✅ Attachment Reserved:', attachmentData)
      }

      console.log('💬 [Step 3] Sending Message')
      // STRICT DB SCHEMA PAYLOAD
      const messagePayload = {
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: userRole === 'mentor' ? 'mentor' : 'learner',
        sender_id: Number(currentUserId),
        content: file.name, // Storing filename in content
        file_url: publicUrl,
        read: false
        // Removed: type, fileName, fileSize, etc.
      }

      const { error: msgError } = await supabase
        .from('messages')
        .insert([messagePayload])

      if (msgError) {
        console.error('❌ Message Insert Error:', msgError)
        throw msgError
      }

      console.log('✅ Message Sent Successfully')

      // Optimistic Update
      const newMessage = {
        ...messagePayload,
        id: Date.now(),
        from: userRole === 'mentor' ? 'mentor' : 'learner',
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        time: getCurrentTime(),
        session_id: activeSessionId,
        highlightColor: null,
        selfNote: '',
      }
      setMessages((prev) => [...prev, newMessage])
      showModal('Success', 'Document sent successfully!', 'success')

    } catch (err) {
      console.error('❌ Critical Error in Document Flow:', err)
      showModal('Error', 'Error sending document: ' + err.message, 'error')
    } finally {
      e.target.value = ''
      setShowAttachOptions(false)
    }
  }

  const handleImageSelected = async (e) => {
    console.log('🖼️ [Step 1] Image Selection Started')
    const file = e.target.files && e.target.files[0]
    if (!file) {
      console.warn('⚠️ No file selected')
      return
    }

    try {
      console.log('📤 [Step 2] Uploading image to Storage:', file.name)
      const fileName = `${activeSessionId}/images/${Date.now()}_${file.name.replace(/\s+/g, '_')}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(fileName, file)

      if (uploadError) {
        console.error('❌ Upload Error:', uploadError)
        throw uploadError
      }
      console.log('✅ Upload Success:', uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from('course-files')
        .getPublicUrl(fileName)

      const courseId = course?.course_id || course?.id

      console.log('💾 [Step 3] Saving to Attachments Table, User ID:', currentUserId)
      console.log('📦 Attachment payload:', {
        course_id: courseId,
        session_id: activeSessionId,
        uploaded_by: currentUserId,
        type: 'image',
        file_name: file.name,
        file_url: publicUrl,
        description: 'Image Attachment'
      })

      const { data: attachmentData, error: attachmentError } = await supabase
        .from('attachments')
        .insert({
          course_id: courseId,
          session_id: activeSessionId,
          uploaded_by: currentUserId,
          type: 'image',
          file_name: file.name,
          file_url: publicUrl,
          description: 'Image Attachment',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (attachmentError) {
        console.error('❌ Attachment Insert Error:', attachmentError)
        showModal('Error', 'Failed to save attachment info: ' + attachmentError.message, 'error')
      } else {
        console.log('✅ Attachment Reserved:', attachmentData)
      }

      console.log('💬 [Step 3] Sending Message')
      const messagePayload = {
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: userRole === 'mentor' ? 'mentor' : 'learner',
        sender_id: Number(currentUserId),
        content: file.name, // Filename as content
        file_url: publicUrl,
        read: false
        // Removed: type, imageUrl, fileName
      }

      const { error: msgError } = await supabase
        .from('messages')
        .insert([messagePayload])

      if (msgError) {
        console.error('❌ Message Insert Error:', msgError)
        throw msgError
      }

      console.log('✅ Message Sent Successfully')

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
      showModal('Success', 'Image sent successfully!', 'success')

    } catch (err) {
      console.error('❌ Critical Error in Image Flow:', err)
      showModal('Error', 'Error sending image: ' + err.message, 'error')
    } finally {
      e.target.value = ''
      setShowAttachOptions(false)
    }
  }

  const handleAttachVoice = () => {
    const newMessage = {
      id: messages.length + 1,
      from: userRole === 'mentor' ? 'mentor' : 'learner',
      type: 'voice',
      duration: '0:15',
      time: getCurrentTime(),
      session_id: activeSessionId,
      highlightColor: null,
      selfNote: '',
    }
    setMessages((prev) => [...prev, newMessage])
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
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: userRole === 'mentor' ? 'mentor' : 'learner',
        sender_id: Number(currentUserId),
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

  const handleAttachStudyMaterial = () => {
    console.log('📤 [Start] Uploading study material:')
    if (studyMaterialInputRef.current) studyMaterialInputRef.current.click()
  }

  const handleStudyMaterialSelected = async (e) => {
    console.log('📤 [Start] Uploading study material:')
    const file = e.target.files && e.target.files[0]
    if (!file) {
      console.warn('⚠️ No file selected for study material')
      return
    }

    try {
      console.log('📤 [Start] Uploading study material:', file.name, 'Size:', file.size)
      console.log('📦 Bucket: course-files')

      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${activeSessionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`

      console.log('📄 Generated storage path:', fileName)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(fileName, file)

      if (uploadError) {
        console.error('❌ Upload failed:', uploadError)
        throw uploadError
      }
      console.log('✅ Upload successful:', uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from('course-files')
        .getPublicUrl(fileName)

      console.log('🔗 Generated Public URL:', publicUrl)

      // 2. Insert into Attachments Table
      console.log('💾 Inserting into attachments table...')
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('attachments')
        .insert({
          session_id: activeSessionId,
          uploaded_by: currentUserId,
          type: 'Document',
          file_name: file.name,
          file_url: publicUrl,
          description: 'Study Material',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (attachmentError) {
        console.error('❌ Error inserting attachment record:', attachmentError)
        showModal('Error', 'Table Insert Failed: ' + attachmentError.message, 'error')
        // throw attachmentError // Uncomment if you want to stop the flow
      } else {
        console.log('✅ Attachment record created:', attachmentData)
      }

      // 3. Send Message to Chat
      console.log('💬 Inserting message into chat...')
      const studyMsg = {
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: 'mentor',
        sender_id: Number(currentUserId),
        content: file.name,
        file_url: publicUrl,
        read: false
        // Removed: type
      }

      console.log('📤 Message payload:', studyMsg)

      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .insert([studyMsg])
        .select()

      if (msgError) {
        console.error('❌ Message insert failed:', msgError)
        throw msgError
      }
      console.log('✅ Message inserted:', msgData)

      // Optimistic UI Update
      const optimisticMsg = {
        ...studyMsg,
        id: Date.now(),
        from: 'mentor',
        time: getCurrentTime(),
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }
      setMessages(prev => [...prev, optimisticMsg])
      showModal('Success', 'Study Material uploaded successfully!', 'success')

    } catch (err) {
      console.error('❌ CRITICAL Error uploading study material:', err)
      showModal('Error', 'Failed to upload study material: ' + err.message, 'error')
    } finally {
      e.target.value = ''
      setShowAttachOptions(false)
    }
  }

  const handleSendAssessment = async () => {
    if (!newAssessment.title || !newAssessment.description || !newAssessment.dueDate) {
      showModal('Validation Error', 'Please fill in all fields', 'error')
      return
    }

    try {
      console.log('📝 Creating Assessment in Table...')
      const courseId = course?.course_id || course?.id

      const { data: createdAssessment, error } = await supabase
        .from('assessments')
        .insert({
          title: newAssessment.title,
          description: newAssessment.description,
          due_date: newAssessment.dueDate,
          course_id: courseId,
          mentor_id: currentUserId,
          student_id: Number(course?.student_id), // CRITICAL: Links the assessment to this specific student
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      console.log('✅ Assessment Created Successfully:', createdAssessment)

      // 1.5 Send Message to Chat (Card format)
      console.log('📤 Sending Assessment Message to Chat...')
      const assessmentMessage = {
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: 'mentor',
        sender_id: Number(currentUserId),
        type: 'assessment',
        content: JSON.stringify({
          assessmentId: createdAssessment.id,
          assessmentTitle: createdAssessment.title,
          assessmentDescription: createdAssessment.description,
          assessmentDueDate: createdAssessment.due_date
        }),
        read: false
      }

      const { error: msgError } = await supabase.from('messages').insert([assessmentMessage])
      if (msgError) throw msgError

      console.log('✅ Chat Notification Sent')
      showModal('Success', 'Assessment created and sent to students successfully!', 'success')

      // Clear form but DO NOT add to chat messages
      setNewAssessment({ title: '', description: '', dueDate: '' })
      setShowAssessmentForm(false)
      setShowAttachOptions(false)

    } catch (err) {
      console.error('❌ Error creating assessment:', err)
      showModal('Error', 'Failed to create assessment: ' + err.message, 'error')
    }
  }

  const handleScheduleClass = async () => {
    // 1. Validation
    if (!scheduleClassData.title || !scheduleClassData.scheduled_date || !scheduleClassData.meeting_link) {
      showModal('Validation Error', 'Please fill in all fields (Title, Date, Link)', 'error')
      return
    }

    try {
      console.log('📅 Scheduling Class...', scheduleClassData)
      const courseId = course?.course_id || course?.id
      const studentId = course?.student_id || null

      // 2. Insert into scheduled_classes table
      const { data: classData, error: dbError } = await supabase
        .from('scheduled_classes')
        .insert({
          course_id: courseId,
          session_id: activeSessionId,
          mentor_id: currentUserId,
          student_id: studentId,
          title: scheduleClassData.title,
          scheduled_date: scheduleClassData.scheduled_date,
          meeting_link: scheduleClassData.meeting_link,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (dbError) {
        console.error('❌ DB Insert Error:', dbError)
        throw dbError
      }
      console.log('✅ Class Scheduled in DB:', classData)

      // 3. Send Message to Chat (Card format)
      // We store the structured data in 'content' as a JSON string
      const contentJson = JSON.stringify({
        title: scheduleClassData.title,
        scheduled_date: scheduleClassData.scheduled_date,
        meeting_link: scheduleClassData.meeting_link,
        class_id: classData.id
      })

      const messagePayload = {
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: 'mentor',
        sender_id: Number(currentUserId),
        type: 'scheduled_class', // New Type
        content: contentJson,
        read: false
      }

      const { error: msgError } = await supabase
        .from('messages')
        .insert([messagePayload])

      if (msgError) throw msgError

      console.log('✅ Scheduled Class Message Sent')

      // Optimistic Update
      const newMessage = {
        ...messagePayload,
        id: Date.now(),
        from: 'mentor',
        time: getCurrentTime(),
        // Client-side convenient props for rendering logic
        classTitle: scheduleClassData.title,
        classDate: scheduleClassData.scheduled_date,
        classLink: scheduleClassData.meeting_link
      }
      setMessages(prev => [...prev, newMessage])

      showModal('Success', 'Class scheduled successfully!', 'success')
      setScheduleClassData({ title: '', scheduled_date: '', meeting_link: '' })
      setShowScheduleClassModal(false)

    } catch (err) {
      console.error('❌ Error scheduling class:', err)
      showModal('Error', 'Failed to schedule class: ' + err.message, 'error')
    }
  }



  const handlePostAssessmentToChat = async (assessment) => {
    try {
      console.log('📤 Posting assessment to chat:', assessment.title)

      const contentJson = JSON.stringify({
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        assessmentDescription: assessment.description,
        assessmentDueDate: assessment.due_date
      })

      const messagePayload = {
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: 'mentor',
        sender_id: Number(currentUserId),
        type: 'assessment',
        content: contentJson,
        read: false
      }

      const { error } = await supabase
        .from('messages')
        .insert([messagePayload])

      if (error) throw error

      console.log('✅ Assessment Posted')
      setShowAssessmentListModal(false)

      // Optimistic update
      const newMessage = {
        ...messagePayload,
        id: Date.now(),
        from: 'mentor',
        time: getCurrentTime(),
        assessmentTitle: assessment.title,
        assessmentDescription: assessment.description,
        assessmentDueDate: assessment.due_date
      }
      setMessages(prev => [...prev, newMessage])

    } catch (err) {
      console.error('❌ Error posting assessment:', err)
      showModal('Error', 'Failed to post assessment to chat', 'error')
    }
  }



  // --- Mentor Assessment Review Logic ---

  const handleViewAssessment = (assessment) => {
    console.log('👀 handleViewAssessment called with:', assessment)
    // If it's a message object, normalize it
    const assessmentData = assessment.assessmentId ? {
      id: assessment.assessmentId,
      title: assessment.assessmentTitle,
      description: assessment.assessmentDescription,
      due_date: assessment.assessmentDueDate,
      course_id: course?.course_id || course?.id
    } : assessment

    console.log('✅ Normalized assessmentData:', assessmentData)
    setSelectedAssessment(assessmentData)
    fetchSubmissions(assessmentData.id)
    setShowAssessmentListModal(false) // Close list modal if open
  }

  const fetchSubmissions = async (assessmentId) => {
    console.log('🔄 fetching submissions for assessmentId:', assessmentId)
    if (!assessmentId) return

    try {
      // 1. Fetch submissions first (WITHOUT JOINS to avoid FK errors)
      const { data: submissionsData, error: subError } = await supabase
        .from('assessment_submissions')
        .select('*')
        .eq('assessment_id', assessmentId)

      if (subError) {
        console.error('❌ Error fetching submissions:', subError)
        throw subError
      }

      let processedSubmissions = submissionsData || []
      console.log('📄 Raw submissions count:', processedSubmissions.length)

      // 2. Manually fetch Student Profiles & Attachments
      if (processedSubmissions.length > 0) {
        const studentIds = [...new Set(processedSubmissions.map(s => s.student_id).filter(Boolean))]
        const submissionIds = processedSubmissions.map(s => s.id)

        let studentsData = []
        let attachmentsData = []

        // A. Fetch Student Profiles
        if (studentIds.length > 0) {
          const { data, error } = await supabase
            .from('student_details')
            .select('student_id, name, profile_image')
            .in('student_id', studentIds)

          if (error) console.warn('⚠️ Could not fetch student profiles:', error)
          else studentsData = data || []
        }

        // B. Fetch Attachments
        if (submissionIds.length > 0) {
          const { data, error } = await supabase
            .from('assessment_attachments')
            .select('*')
            .in('submission_id', submissionIds)

          if (error) console.warn('⚠️ Could not fetch attachments:', error)
          else attachmentsData = data || []
        }

        // C. Merge everything back
        processedSubmissions = processedSubmissions.map(sub => {
          // Robust ID comparison (String conversion)
          const studentProfile = studentsData.find(u => String(u.student_id) === String(sub.student_id))

          const subAttachments = attachmentsData.filter(att => String(att.submission_id) === String(sub.id))

          return {
            ...sub,
            student: {
              name: studentProfile?.name || 'Unknown Student',
              email: '',
              profile_image: studentProfile?.profile_image
            },
            assessment_attachments: subAttachments
          }
        })
      }

      console.log('📥 Final processed submissions:', processedSubmissions)
      setSubmissions(processedSubmissions)
    } catch (error) {
      console.error('Error fetching submissions (catch):', error)
      // Do not clear submissions on error if you want to inspect, but here we want to avoid stale state.
      // Maybe show empty or previous state? Let's show specific error message in UI if possible, but for now empty.
      setSubmissions([])
    }
  }

  const handleMarkComplete = async (submissionId) => {
    setIsMarkingComplete(true)
    try {
      const { error } = await supabase
        .from('assessment_submissions')
        .update({ status: 'completed', reviewed_at: new Date().toISOString() })
        .eq('id', submissionId)

      if (error) throw error

      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'completed' } : s))
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(prev => ({ ...prev, status: 'completed' }))
      }
    } finally {
      setIsMarkingComplete(false)
    }
  }

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

      // 1.5 Find the correct scheduled_classes ID
      let targetId = data.original_session_id;
      
      const { data: byId } = await supabase.from('scheduled_classes').select('id').eq('id', targetId).single();
      if (!byId) {
          const { data: bySessionId } = await supabase.from('scheduled_classes').select('id').eq('session_id', targetId).single();
          if (bySessionId) {
              targetId = bySessionId.id;
          }
      }

      // 2. If approved, update the scheduled_classes table
      if (isApproved) {
        const { error: schedError } = await supabase
          .from('scheduled_classes')
          .update({
            scheduled_date: `${data.new_date}T${data.new_time}`,
            reschedule_request: false,
            reschedule_role: null,
            rescheduled_date: null,
            reschedule_reason: null
          })
          .eq('id', targetId);

        if (schedError) {
            console.error("Failed to update scheduled_classes:", schedError);
            throw schedError;
        }

      } else {
        // Reset the reschedule_request flag on rejection
        await supabase
          .from('scheduled_classes')
          .update({ reschedule_request: false, reschedule_role: null, rescheduled_date: null })
          .eq('id', targetId);
      }

      showModal('Success', `Reschedule ${action}d successfully!`, 'success');
      fetchCourseSessions();
      fetchScheduledClasses();
    } catch (err) {
      console.error('Error handling reschedule action:', err);
      showModal('Error', 'Failed to process reschedule action.', 'error');
    }
  }

  const handleRescheduleConfirm = async ({ newDate, newTime, reason }) => {
    try {
      if (!selectedSession) return;

      const newScheduledDate = `${newDate}T${newTime}`;

      const scheduleData = {
        title: selectedSession.title,
        scheduled_date: newScheduledDate,
        link: selectedSession.meeting_link,
        isRescheduled: true,
        reason: reason
      };

      // Send to the current chat
      const { error: insertError } = await supabase
        .from('messages')
        .insert([{
          chat_id: Number(chatId),
          session_id: selectedSession.session_id || selectedSession.sessionId || activeSessionId,
          role: 'mentor',
          sender_id: Number(currentUserId),
          content: JSON.stringify(scheduleData),
          type: 'scheduled_class',
          read: false
        }])

      if (insertError) {
        console.error('Error inserting scheduled_class message:', insertError);
        throw insertError;
      }

      // Update the scheduled_classes table directly
      const { error: updateError } = await supabase
        .from('scheduled_classes')
        .update({
          scheduled_date: newScheduledDate,
          reschedule_request: false,
          reschedule_role: null,
          rescheduled_date: null,
          reschedule_reason: null
        })
        .eq('id', selectedSession.id)

      if (updateError) throw updateError

      showModal('Success', 'Reschedule request sent to student!', 'success')
      setShowRescheduleModal(false)
      fetchScheduledClasses() // ALWAYS refresh scheduled classes
    } catch (err) {
      console.error('Error sending reschedule request:', err)
      showModal('Error', 'Failed to send reschedule request.', 'error')
    }
  }

  const handleRescheduleResponse = async (session, action) => {
    try {
      const isApproved = action === 'approve';

      // 1. Find and update the pending reschedule message
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', session.id)
        .eq('type', 'reschedule_request')
        .eq('chat_id', Number(chatId))
        .order('created_at', { ascending: false })
        .limit(1);

      if (msgError) throw msgError;

      if (messages && messages.length > 0) {
        const message = messages[0];
        const requestData = JSON.parse(message.content);
        const updatedData = { ...requestData, status: isApproved ? 'approved' : 'rejected' };

        await supabase
          .from('messages')
          .update({ content: JSON.stringify(updatedData) })
          .eq('id', message.id);
          
        // Optimistic UI Update for Mentor
        setMessages(prev => prev.map(m => 
          String(m.id) === String(message.id) ? { ...m, content: JSON.stringify(updatedData) } : m
        ));
      }

      // 2. Update scheduled_classes
      const updatePayload = {
        reschedule_request: false,
        reschedule_role: null,
        rescheduled_date: null,
        reschedule_reason: null
      };

      if (isApproved && session.rescheduled_date) {
        updatePayload.scheduled_date = session.rescheduled_date;
      }

      const { error: schedError } = await supabase
        .from('scheduled_classes')
        .update(updatePayload)
        .eq('id', session.id);

      if (schedError) throw schedError;

      showModal('Success', `Reschedule request ${action}d successfully!`, 'success');
      setIsResponseModalOpen(false);
      if (showSessionsModal) fetchScheduledClasses();
    } catch (err) {
      console.error('Error responding to reschedule:', err);
      showModal('Error', 'Failed to process response.', 'error');
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
    <><div className="live-classroom-page" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 9999, margin: 0, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Minimal top bar like inspo */}
      {/* V2 Glass Header */}
      <header className="live-classroom-header-v2">
        <button className="live-back-btn-v2" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="live-header-title-v2">{classroom.classroom_name || classroom.title}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          {userRole === 'mentor' && (
            <>
              <button
                className="live-complete-btn-v2"
                onClick={() => setShowScheduleClassModal(true)}
                title="Schedule Class"
                style={{ background: 'rgba(42, 126, 255, 0.1)', color: '#2a7eff', border: '1px solid rgba(42, 126, 255, 0.2)' }}
              >
                <span className="material-symbols-outlined">calendar_month</span>
              </button>
              <button
                className="live-complete-btn-v2"
                onClick={() => setShowSessionsModal(true)}
                title="Upcoming Classes"
                style={{ background: 'rgba(42, 126, 255, 0.1)', color: '#2a7eff', border: '1px solid rgba(42, 126, 255, 0.2)' }}
              >
                <span className="material-symbols-outlined">event_list</span>
              </button>
              <button
                className="live-complete-btn-v2"
                onClick={() => setShowAssessmentListModal(true)}
                title="Assessments"
                style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}
              >
                <span className="material-symbols-outlined">assignment</span>
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

          <button
            className={`live-complete-btn-v2 ${activeSession.status === 'completed' ? 'completed' : ''}`}
            onClick={handleCompleteSession}
          >
            <span className="material-symbols-outlined">
              {activeSession.status === 'completed' ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            {activeSession.status === 'completed' ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </header>

      {/* Imminent Class Banners */}
      {imminentClasses.length > 0 && (
        <div style={{ padding: '0 16px', marginTop: '16px' }}>
          {imminentClasses.map(cls => (
            <div key={cls.id} style={{
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ animation: 'pulse 2s infinite' }}>emergency_recording</span>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Class Starting Now!</div>
                  <div style={{ fontSize: '13px', opacity: 0.9 }}>{cls.courses?.title || 'Live Class'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={formatExternalLink(cls.meeting_link || '#')}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'white',
                    color: '#059669',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    display: 'inline-block'
                  }}
                >
                  Join Class
                </a>
                <button
                  onClick={() => {
                    localStorage.setItem('open_reschedule_session_id', cls.id);
                    setSelectedSession(cls);
                    setShowRescheduleModal(true);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.4)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main chat area */}
      <div className="live-main live-main-full" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
        <div className="live-session-label">{activeSession.title}</div>

        <div className="live-chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
          <div className="live-chat-feed" ref={chatFeedRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px', boxSizing: 'border-box', width: '100%' }}>
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`live-message ${String(message.sender_id) === String(currentUserId) ? 'from-learner' : 'from-mentor'}`}
              >
                <div
                  className={`${['assessment', 'scheduled_class', 'reschedule_request', 'class_imminent'].includes(message.type) ? 'live-message-custom' : 'live-message-bubble'} ${message.highlightColor ? `highlight-${message.highlightColor}` : ''
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
                    <div className="live-voice-card">
                      <div className="voice-icon">●</div>
                      <div className="voice-meta">Voice note • {message.duration}</div>
                    </div>
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
                        {userRole === 'mentor' ? (
                          <button
                            className="assessment-view-btn"
                            onClick={() => handleViewAssessment(message)}
                          >
                            Review Submissions
                          </button>
                        ) : (
                          <button className="assessment-view-btn">View & Submit</button>
                        )}
                      </div>
                    </div>
                  )}
                  {message.type === 'scheduled_class' && (() => {
                    let contentObj = {};
                    try { contentObj = JSON.parse(message.content || '{}'); } catch (e) { }
                    
                    let classDateStr = message.classDate || contentObj?.scheduled_date || contentObj?.date || null;
                    if (contentObj && contentObj.date && contentObj.time) {
                      classDateStr = `${contentObj.date}T${contentObj.time}`;
                    }

                    // Dynamically check if rescheduled
                    const liveSessionData = scheduledClasses?.find(s => String(s.session_id) === String(message.session_id));
                    let isDynamicallyRescheduled = false;
                    let currentScheduledDateStr = classDateStr;
                    let dynamicRescheduleReason = null;

                    if (liveSessionData && liveSessionData.scheduled_date) {
                      const origDate = classDateStr ? new Date(classDateStr).getTime() : 0;
                      const liveDate = new Date(liveSessionData.scheduled_date).getTime();
                      if (Math.abs(origDate - liveDate) > 60000) {
                        isDynamicallyRescheduled = true;
                        currentScheduledDateStr = liveSessionData.scheduled_date;
                        dynamicRescheduleReason = liveSessionData.reschedule_reason;
                      }
                    }

                    const scheduledTime = currentScheduledDateStr ? new Date(currentScheduledDateStr) : null;
                    const now = new Date().getTime();
                    const isExpired = scheduledTime ? now > new Date(scheduledTime.getTime() + 60 * 60000) : false; // expired if 1 hour past
                    const isRescheduled = contentObj?.isRescheduled || isDynamicallyRescheduled;

                    let borderColor = '#2a7eff';
                    let bgColor = '#eff6ff';
                    let badgeBg = '#dbeafe';
                    let badgeColor = '#1d4ed8';
                    let badgeText = 'Scheduled Class';
                    let icon = '📅';

                    if (isExpired) {
                        borderColor = '#f87171';
                        bgColor = '#fef2f2';
                        badgeBg = '#fee2e2';
                        badgeColor = '#991b1b';
                        badgeText = 'Expired';
                        icon = '⌛';
                    } else if (isRescheduled) {
                        borderColor = '#8b5cf6';
                        bgColor = '#f5f3ff';
                        badgeBg = '#ede9fe';
                        badgeColor = '#6d28d9';
                        badgeText = 'Class Rescheduled';
                        icon = '🔄';
                    }

                    return (
                    <div className="live-assessment-card" style={{ borderLeft: `4px solid ${borderColor}`, background: bgColor, minWidth: '240px' }}>
                      <div className="assessment-card-header">
                        <div className="assessment-icon">{icon}</div>
                        <div className="assessment-badge" style={{ background: badgeBg, color: badgeColor }}>
                          {badgeText}
                        </div>
                      </div>
                      <h4 className="assessment-card-title">{message.classTitle || contentObj?.title || 'Live Class'}</h4>
                      <div className="assessment-card-footer" style={{ marginTop: '8px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>event</span>
                          {isDynamicallyRescheduled ? 'Rescheduled for: ' : ''}
                          {currentScheduledDateStr ? new Date(currentScheduledDateStr).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No date'}
                        </div>
                        {isRescheduled && (contentObj?.reason || dynamicRescheduleReason) && (
                          <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', background: '#ffffff80', padding: '6px', borderRadius: '4px', width: '100%', marginTop: '4px' }}>
                            "{contentObj?.reason || dynamicRescheduleReason}"
                          </div>
                        )}
                        {isExpired && (
                          <button
                            className="btn-primary"
                            style={{
                              width: '100%', textAlign: 'center', background: '#2a7eff', padding: '8px', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }}
                            onClick={() => {
                              if (!sessionToReschedule && classDateStr) {
                                sessionToReschedule = {
                                  id: message.session_id,
                                  title: message.classTitle || contentObj?.title || 'Live Class',
                                  scheduled_date: classDateStr,
                                  date: new Date(classDateStr).toLocaleDateString(),
                                  time: new Date(classDateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                };
                              }
                              
                              if (sessionToReschedule) {
                                localStorage.setItem('open_reschedule_session_id', sessionToReschedule.id);
                                setSelectedSession(sessionToReschedule);
                                setShowRescheduleModal(true);
                              } else {
                                showModal('Error', 'Session details not found.', 'error');
                              }
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                            Reschedule
                          </button>
                        )}
                      </div>
                    </div>
                    );
                  })()}

                  {message.type === 'reschedule_request' && (() => {
                    try {
                      const data = JSON.parse(message.content);
                      
                      const isPending = data.status === 'pending';
                      const isApproved = data.status === 'approved';
                      const isRejected = data.status === 'rejected';

                      let borderColor = '#f59e0b';
                      let bgColor = '#fffef3';
                      let badgeBg = '#fef3c7';
                      let badgeColor = '#92400e';
                      let badgeText = 'Reschedule Request';
                      let icon = '⏳';

                      if (isApproved) {
                        borderColor = '#22c55e';
                        bgColor = '#f0fdf4';
                        badgeBg = '#dcfce7';
                        badgeColor = '#166534';
                        badgeText = 'Reschedule Approved';
                        icon = '✅';
                      } else if (isRejected) {
                        borderColor = '#ef4444';
                        bgColor = '#fef2f2';
                        badgeBg = '#fee2e2';
                        badgeColor = '#991b1b';
                        badgeText = 'Reschedule Rejected';
                        icon = '❌';
                      }

                      return (
                        <div
                          className="live-assessment-card"
                          style={{
                            borderLeft: `4px solid ${borderColor}`,
                            background: bgColor,
                            minWidth: '240px',
                            cursor: isPending ? 'pointer' : 'default',
                            opacity: isPending ? 1 : 0.8
                          }}
                          onClick={() => {
                            if (!isPending) return;
                            const data = JSON.parse(message.content);
                            const foundSession = scheduledClasses?.find(s => String(s.id) === String(message.session_id));
                            setSelectedSession(foundSession || {
                                id: message.session_id,
                                title: data.title,
                                date: data.original_date,
                                time: data.original_time,
                                ...data 
                            });
                            setIsResponseModalOpen(true);
                          }}
                        >
                          <div className="assessment-card-header">
                            <div className="assessment-icon">{icon}</div>
                            <div className="assessment-badge" style={{ background: badgeBg, color: badgeColor }}>{badgeText}</div>
                          </div>
                          <h4 className="assessment-card-title">{data.title || 'Live Class'}</h4>
                          <div className="assessment-card-footer" style={{ marginTop: '8px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>New Proposed Time:</div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <div style={{ fontSize: '14px', color: '#1e293b' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'text-bottom', marginRight: '4px' }}>event</span>
                                {new Date(data.new_date).toLocaleDateString()}
                              </div>
                              <div style={{ fontSize: '14px', color: '#1e293b' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'text-bottom', marginRight: '4px' }}>schedule</span>
                                {data.new_time}
                              </div>
                            </div>
                            {data.reason && (
                              <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', background: '#f8fafc', padding: '6px', borderRadius: '4px', width: '100%' }}>
                                "{data.reason}"
                              </div>
                            )}
                            {isPending && (
                              String(message.sender_id) === String(currentUserId) ? (
                                <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '500', marginTop: '8px', textAlign: 'center' }}>
                                  Waiting for Student to respond...
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
                                  <button
                                    className="btn-primary"
                                    style={{
                                      flex: 1, padding: '8px', fontSize: '13px', borderRadius: '6px', background: '#22c55e', border: 'none', color: 'white', cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRescheduleAction(message, 'approve');
                                    }}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn-secondary"
                                    style={{
                                      flex: 1, padding: '8px', fontSize: '13px', borderRadius: '6px', background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRescheduleAction(message, 'reject');
                                    }}
                                  >
                                    Reject
                                  </button>
                                </div>
                              )
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
                                await supabase.from('messages').update({ mentor_note: trimmed }).eq('id', message.id)
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
                  {message.type !== 'scheduled_class' && message.type !== 'reschedule_request' && message.type !== 'class_imminent' && (
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

          <form className="live-message-input-container" onSubmit={handleSendMessage}>
            <button
              type="button"
              className="live-attach-btn"
              aria-label="Add message attachment"
              onClick={() => setShowAttachOptions((prev) => !prev)}
            >
              +
            </button>
            <button
              type="button"
              className="live-attach-btn"
              aria-label="Send audio"
              onClick={handleAttachVoice}
              style={{ marginLeft: '8px', color: '#f97316' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
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
          <input
            type="file"
            ref={studyMaterialInputRef}
            onChange={handleStudyMaterialSelected}
            style={{ display: 'none' }}
            // Accept broadly for study materials
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,image/*"
          />

          {/* Assessment Form Modal */}
          {showAssessmentForm && (
            <div className="live-assessment-modal-overlay" onClick={() => setShowAssessmentForm(false)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header" style={{
                  background: 'linear-gradient(to right, #ffffff, #f8fafc)',
                  padding: '24px 32px',
                  borderBottom: '1px solid #e2e8f0',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
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
                      <span className="material-symbols-outlined">assignment_add</span>
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Create Assessment</h2>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Assign a new task to your students</p>
                    </div>
                  </div>
                  <button
                    className="assessment-modal-close-btn"
                    onClick={() => setShowAssessmentForm(false)}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="assessment-modal-content">
                  <div className="form-group">
                    <label className="form-label">Assessment Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., React Hooks Implementation"
                      value={newAssessment.title}
                      onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Instructions / What to Do</label>
                    <textarea
                      className="form-textarea"
                      rows="6"
                      placeholder="Describe what students need to do for this assessment..."
                      value={newAssessment.description}
                      onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
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
                </div>
                <div className="assessment-modal-actions">
                  <button
                    className="btn-primary"
                    onClick={handleSendAssessment}
                  >
                    Send Assessment
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setShowAssessmentForm(false)
                      setNewAssessment({ title: '', description: '', dueDate: '' })
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assessment List Modal for Mentors */}
          {showAssessmentListModal && (
            <div className="live-assessment-modal-overlay" style={{ zIndex: 10001 }} onClick={() => setShowAssessmentListModal(false)}>
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
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Assessments</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      className="modal-action-btn"
                      onClick={() => {
                        setShowAssessmentForm(true)
                        setShowAssessmentListModal(false)
                      }}
                      title="Create New Assessment"
                      style={{
                        background: '#2a7eff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px -1px rgba(42, 126, 255, 0.2)'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                      Create New
                    </button>
                    <button
                      className="assessment-modal-close-btn"
                      onClick={() => setShowAssessmentListModal(false)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                    </button>
                  </div>
                </div>
                <div className="assessment-modal-content">
                  {dbAssessments.length > 0 ? (
                    <div className="assessment-list-container">
                      {dbAssessments.map((assessment, idx) => (
                        <div
                          key={assessment.id || idx}
                          className="assessment-list-item hover:border-blue-400 transition-colors"
                          onClick={() => handleViewAssessment(assessment)}
                          style={{
                            padding: '16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            background: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>{assessment.title}</h4>
                            <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b' }}>
                              Due: {new Date(assessment.due_date).toLocaleDateString()}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {assessment.description}
                          </p>
                          <div style={{ alignSelf: 'flex-end', fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span>Submissions: {assessment.assessment_submissions?.[0]?.count || 0}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewAssessment(assessment)
                              }}
                              className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-xs transition-colors"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                      <p>No assessments created yet.</p>
                      <button
                        onClick={() => {
                          setShowAssessmentForm(true)
                          setShowAssessmentListModal(false)
                        }}
                        style={{
                          marginTop: '12px',
                          color: '#2a7eff',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Create your first assessment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Classes Modal */}
          {showSessionsModal && (
            <div className="live-assessment-modal-overlay" style={{ zIndex: 10001 }} onClick={() => setShowSessionsModal(false)}>
              <div className="live-assessment-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header" style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#2a7eff' }}>event_list</span>
                    <h2 style={{ margin: 0 }}>Upcoming Classes</h2>
                  </div>
                  <button className="modal-close-btn" onClick={() => setShowSessionsModal(false)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="assessment-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
                  {loadingSessions ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }}>sync</span>
                      <p>Loading sessions...</p>
                    </div>
                  ) : scheduledClasses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>event_busy</span>
                      <p>No classes scheduled for this course.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {scheduledClasses.map((session) => {
                        const now = new Date().getTime();
                        const scheduledTime = new Date(session.scheduled_date).getTime();
                        const tenMinsBefore = scheduledTime - 10 * 60000;
                        const twentyFourHoursAfter = scheduledTime + 24 * 60 * 60000;
                        
                        const isExpired = now > twentyFourHoursAfter;
                        const isEarly = now < tenMinsBefore;
                        
                        let statusText = 'Upcoming';
                        let statusBg = '#e0f2fe';
                        let statusColor = '#0369a1';
                        
                        if (session.is_complete) {
                          statusText = 'Completed';
                          statusBg = '#dcfce7';
                          statusColor = '#166534';
                        } else if (isExpired) {
                          statusText = 'Expired';
                          statusBg = '#fef2f2';
                          statusColor = '#991b1b';
                        } else if (!isEarly) {
                          statusText = 'Active';
                          statusBg = '#fef3c7'; // Amber color for active session
                          statusColor = '#92400e';
                        }

                        return (
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
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
                                background: statusBg,
                                color: statusColor,
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}>
                                {statusText}
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

                                {session.reschedule_role === 'student' ? (
                                  <button
                                    className="btn-primary"
                                    style={{
                                      padding: '8px 16px',
                                      fontSize: '13px',
                                      background: '#2a7eff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: 'white',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
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
                                      padding: '8px 16px',
                                      fontSize: '13px',
                                      background: '#f1f5f9',
                                      border: '1px solid #e2e8f0',
                                      borderRadius: '6px',
                                      color: '#475569',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
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
                              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', width: '100%', justifyContent: 'flex-end' }}>
                                {session.meeting_link && (
                                  <a
                                    href={formatExternalLink(session.meeting_link)}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      background: isExpired ? '#94a3b8' : '#2a7eff',
                                      color: 'white',
                                      borderRadius: '6px',
                                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none', padding: '8px 16px', fontSize: '13px',
                                      ...((isEarly || isExpired) ? { pointerEvents: 'none', opacity: 0.5 } : {})
                                    }}
                                    onClick={(e) => {
                                      if (isEarly || isExpired) {
                                        e.preventDefault();
                                        if (isEarly) {
                                          showModal('Too Early', 'You can only join the meeting 10 minutes before the scheduled time.', 'info');
                                        }
                                      }
                                    }}
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>video_call</span>
                                    {isExpired ? 'Expired' : (isEarly ? 'Not Yet Started' : 'Join Meeting')}
                                  </a>
                                )}
                                <button
                                  style={{
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    background: isExpired ? '#2a7eff' : 'white',
                                    border: isExpired ? 'none' : '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    color: isExpired ? 'white' : '#64748b',
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
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* Schedule Class Modal */}
          {showScheduleClassModal && (
            <div className="live-assessment-modal-overlay" onClick={() => setShowScheduleClassModal(false)}>
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
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669'
                    }}>
                      <span className="material-symbols-outlined">calendar_today</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Schedule Next Class</h2>
                  </div>
                  <button
                    className="assessment-modal-close-btn"
                    onClick={() => setShowScheduleClassModal(false)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                  </button>
                </div>
                <div className="assessment-modal-content">
                  <div className="form-group">
                    <label className="form-label">Class Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Advanced React Patterns"
                      value={scheduleClassData.title}
                      onChange={(e) => setScheduleClassData({ ...scheduleClassData, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={scheduleClassData.scheduled_date}
                      onChange={(e) => setScheduleClassData({ ...scheduleClassData, scheduled_date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Meeting Link</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., https://meet.google.com/..."
                      value={scheduleClassData.meeting_link}
                      onChange={(e) => setScheduleClassData({ ...scheduleClassData, meeting_link: e.target.value })}
                    />
                  </div>
                </div>
                <div className="assessment-modal-actions">
                  <button className="btn-secondary" onClick={() => setShowScheduleClassModal(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleScheduleClass} style={{ background: '#2a7eff' }}>
                    Save & Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom sessions bar */}
      <div className="live-sessions-bar">
        {sessions.map((session) => {
          const now = new Date().getTime();
          const scheduledTime = session.scheduled_date ? new Date(session.scheduled_date).getTime() : null;
          const tenMinsBefore = scheduledTime ? scheduledTime - 10 * 60000 : null;
          const twentyFourHoursAfter = scheduledTime ? scheduledTime + 24 * 60 * 60000 : null;
          const isExpired = scheduledTime ? now > twentyFourHoursAfter : false;
          const isEarly = scheduledTime ? now < tenMinsBefore : false;

          let displayStatus = 'Upcoming';
          if (session.status === 'current') {
            displayStatus = 'Now';
          } else if (session.status === 'completed') {
            displayStatus = 'Completed';
          } else if (isExpired) {
            displayStatus = 'Expired';
          } else if (scheduledTime && !isEarly) {
            displayStatus = 'Active';
          }

          return (
            <button
              key={session.id}
              type="button"
              className={`live-session-chip ${session.status} ${session.id === activeSessionId ? 'current' : ''
                }`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span className="live-session-title">{session.title}</span>
            </button>
          );
        })}
          {userRole === 'mentor' && (
          <button
            type="button"
            className="live-course-complete-btn"
            style={{ backgroundColor: '#8b5cf6', color: '#ffffff', marginLeft: '12px', border: 'none' }}
            onClick={() => {
              setShowAssessmentListModal(true)
              setShowAttachOptions(false)
            }}
          >
            <span className="live-session-title">Test</span>
          </button>
        )}
        <button
          type="button"
          className="live-course-complete-btn"
          style={{ backgroundColor: '#10b981', color: '#ffffff', marginLeft: '12px', border: 'none' }}
          onClick={() => setShowCompletionModal(true)}
        >
          <span className="live-session-title">Course Complete</span>
        </button>

      
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
                onClick={() => {
                  if (onBack) onBack()
                  window.location.reload()
                }}
              >
                ✅ Close Classroom
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
      {/* Mentor Assessment Review Modal */}
      {
        selectedAssessment && (
          <div className="mentor-assessment-modal-overlay" onClick={() => {
            setSelectedAssessment(null)
            setSelectedSubmission(null)
          }}>
            <div
              className="mentor-assessment-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mentor-modal-header" style={{
                padding: '24px 32px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2a7eff'
                  }}>
                    <span className="material-symbols-outlined">
                      {selectedSubmission ? 'rate_review' : 'assignment'}
                    </span>
                  </div>
                  <h2 className="mentor-modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                    {selectedSubmission ? 'Review Submission' : selectedAssessment.title}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    if (selectedSubmission) setSelectedSubmission(null)
                    else setSelectedAssessment(null)
                  }}
                  className="assessment-modal-close-btn"
                  title="Close"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                </button>
              </div>

              <div className="mentor-modal-body">
                {selectedSubmission ? (
                  // Single Submission View
                  <div className="mentor-submission-view">
                    <div className="mentor-student-submission-header">
                      <div className="student-avatar-large">
                        {selectedSubmission.student?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="student-name-large">{selectedSubmission.student?.name || 'Student'}</h3>
                        <p className="student-email">{selectedSubmission.student?.email}</p>
                        <p className="submission-meta">Submitted: {formatDate(selectedSubmission.submitted_at)}</p>
                      </div>
                      <div className="submission-status-badge-wrapper">
                        <span className={`status-badge-large ${['completed', 'graded'].includes(selectedSubmission.status?.toLowerCase()) ? 'badge-completed' : 'badge-pending'
                          }`}>
                          {['completed', 'graded'].includes(selectedSubmission.status?.toLowerCase()) ? 'Completed' : 'Pending Review'}
                        </span>
                      </div>
                    </div>

                    <div className="mentor-text-submission-card">
                      <div className="card-header">
                        <h3 className="card-title">Text Submission</h3>
                      </div>
                      {(() => {
                        const text = cleanSubmissionText(selectedSubmission.text_submission)
                        if (!text) return <div className="card-body text-content"><span className="no-content">No text provided.</span></div>

                        const parts = text.split(/(\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))/)
                        return (
                          <div className="card-body text-content">
                            {parts.map((part, index) => {
                              const markdownMatch = part.match(/\!\[(.*?)\]\((.*?)\)/) || part.match(/\[(.*?)\]\((.*?)\)/)
                              if (markdownMatch) {
                                const [_, alt, url] = markdownMatch
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
                                if (isImage) {
                                  return (
                                    <div key={index} style={{ margin: '12px 0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                      <img
                                        src={url}
                                        alt={alt}
                                        style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', display: 'block', backgroundColor: '#f8fafc' }}
                                      />
                                    </div>
                                  )
                                }
                                return <a key={index} href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#2a7eff', textDecoration: 'underline' }}>{alt || url}</a>
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
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            wordBreak: 'break-all',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            margin: '4px 0'
                                          }}
                                        >
                                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>link</span>
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

                    {(() => {
                      const dbAttachments = selectedSubmission.assessment_attachments || [];
                      const extractedAttachments = extractAttachmentsFromText(selectedSubmission.text_submission);

                      // Filter out extracted URLs that might already be in dbAttachments (by URL)
                      const uniqueExtracted = extractedAttachments.filter(ext =>
                        !dbAttachments.some(db => db.file_url === ext.file_url)
                      );

                      const allAttachments = [...dbAttachments, ...uniqueExtracted];

                      if (allAttachments.length > 0) {
                        return (
                          <div className="mentor-attachments-section" style={{ marginTop: '32px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                            <h4 style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              margin: '0 0 16px 0',
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#1e293b'
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#64748b' }}>attach_file</span>
                              Student Attachments ({allAttachments.length})
                            </h4>

                            <div className="attachments-list" style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr',
                              gap: '12px'
                            }}>
                              {allAttachments.map((att, idx) => {
                                const isImage = att.file_url && (att.file_url.toLowerCase().includes('png') || att.file_url.toLowerCase().includes('jpg') || att.file_url.toLowerCase().includes('jpeg'));
                                return (
                                  <div key={idx} className="attachment-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                          background: '#f8fafc',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: isImage ? '#f59e0b' : '#2a7eff',
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
                                        className="mentor-view-file-btn"
                                        style={{
                                          background: '#eff6ff',
                                          color: '#2a7eff',
                                          padding: '8px 16px',
                                          borderRadius: '8px',
                                          fontSize: '12px',
                                          fontWeight: '700',
                                          textDecoration: 'none',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px'
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
                                          style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain', display: 'block' }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div style={{
                            marginTop: '24px',
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
                              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Student submitted text only</p>
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {
                      selectedSubmission.status !== 'completed' && (
                        <div className="mentor-action-footer">
                          <button
                            onClick={() => handleMarkComplete(selectedSubmission.id)}
                            className="mark-complete-btn"
                            disabled={isMarkingComplete}
                            style={{
                              opacity: isMarkingComplete ? 0.7 : 1,
                              cursor: isMarkingComplete ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {isMarkingComplete ? '⏳ Marking...' : '✓ Mark as Complete'}
                          </button>
                        </div>
                      )
                    }
                  </div>
                ) : (
                  // Assessment Details & Submissions List View
                  <div className="mentor-assessment-details-view">
                    {/* Assessment Details Card */}
                    <div className="mentor-details-card">
                      <div className="mentor-details-grid">
                        <div className="mentor-main-info">
                          <div>
                            <h3 className="mentor-assessment-title">{selectedAssessment.title}</h3>
                            <p className="mentor-assessment-description">{selectedAssessment.description}</p>
                          </div>
                        </div>
                        <div className="mentor-meta-info">
                          <div className="meta-item">
                            <span className="meta-label">Course ID</span>
                            <span className="meta-value">{selectedAssessment.course_id}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Due Date</span>
                            <span className="meta-value">{formatDate(selectedAssessment.due_date)}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Status</span>
                            <span className="meta-value">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mentor-submissions-header">
                        <h3>Student Submissions</h3>
                        <span className="submission-count">{submissions.length} Total</span>
                      </div>

                      {submissions.length === 0 ? (
                        <div className="mentor-no-submissions">
                          <span className="icon">📂</span>
                          <p className="main-text">No submissions yet.</p>
                          <p className="sub-text">When students submit their work, it will appear here.</p>
                        </div>
                      ) : (
                        <div className="mentor-submissions-grid">
                          {submissions.map(sub => (
                            <div key={sub.id} className="mentor-submission-card" onClick={() => setSelectedSubmission(sub)}>
                              <div className="submission-card-header">
                                <div className="student-avatar-small">
                                  {sub.student?.name?.charAt(0) || 'S'}
                                </div>
                                <div className="student-info-small">
                                  <p className="student-name">{sub.student?.name || 'Student'}</p>
                                  <p className="submission-date">{formatDate(sub.submitted_at)}</p>
                                </div>
                              </div>

                              <div className="submission-card-footer">
                                <span className={`mini-status ${sub.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                                  {sub.status}
                                </span>
                                <span className="review-link">
                                  Review ➔
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div >
        )
      }
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
    </>
  )
}

export default MentorLiveClassroom


