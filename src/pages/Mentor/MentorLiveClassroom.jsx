import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function MentorLiveClassroom({ course, onBack }) {
  const userRole = 'mentor'
  const { refetch } = useDashboardData()

  // Define chatId from the enrollment
  const chatId = course?.id  // enrollment ID

  // Current user ID from local storage
  const currentUserId = localStorage.getItem('auth_id')
  const userid = localStorage.getItem('auth_user_id')

  // Use course.sessions (new) or course.classes (legacy)
  const initialSessions = course?.sessions || course?.classes || [
    { id: 1, title: 'Introduction & Setup', status: 'completed' },
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

  const [dbAssessments, setDbAssessments] = useState([])
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    if (showAssessmentListModal) {
      fetchDbAssessments()
    }
  }, [showAssessmentListModal])

  const fetchDbAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*, assessment_submissions(count)')
        .eq('course_id', course?.course_id || course?.id)
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
                const details = JSON.parse(m.content)
                Object.assign(m, details)
              } catch (e) {
                // Fallback if content is just text or invalid JSON
              }
            }
            if (!m.type && m.file_url) {
              const ext = m.file_url.split('.').pop().toLowerCase()
              if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) inferredType = 'image'
              else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(ext)) inferredType = 'file'
            } else if (!m.type && (m.content || '').match(/^https?:\/\//)) {
              inferredType = 'link'
            }

            return {
              ...m,
              from: m.sender_id.toString() === currentUserId?.toString() ? 'learner' : 'mentor',
              type: inferredType,
              time: m.created_at ? new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : getCurrentTime()
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
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        console.log('📥 NEW Realtime payload received:', payload)
        const newMessage = payload.new

        setMessages((prev) => {
          // 1. Check if ID exists
          if (prev.some(m => m.id === newMessage.id)) return prev

          // 2. Check if this payload is the "real" version of an optimistic message
          // (Matching content and sender and recent timestamp)
          const optimisticMatchIndex = prev.findIndex(m =>
            m.content === newMessage.content &&
            m.sender_id === newMessage.sender_id &&
            typeof m.id === 'number' && m.id > 1700000000000 // Simple check for Date.now() style IDs
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

          const msgForState = {
            ...newMessage,
            from: newMessage.sender_id.toString() === currentUserId?.toString() ? 'learner' : 'mentor',
            type: inferredType,
            time: newMessage.created_at ? new Date(newMessage.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : getCurrentTime()
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
      .subscribe((status) => {
        console.log('📡 Subscription status update:', status)
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime channel error. Check Supabase DB Replication settings.')
        }
      })

    return () => {
      console.log('🔌 Cleaning up subscription for chatId:', chatId)
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const [sessions, setSessions] = useState(initialSessions)

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[1]
  // Filter messages by activeSessionId
  const visibleMessages = messages.filter(m =>
    Number(m.session_id) === Number(activeSessionId)
  )

  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null)
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
  }, [visibleMessages])

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

    if (!chatId) {
      console.error('❌ Cannot send message: chatId is missing. Course data:', course)
      alert('Error: Chat session not found. Please re-enter the classroom.')
      return
    }

    const pendingMsg = {
      chat_id: Number(chatId),
      session_id: Number(activeSessionId),
      role: userRole === 'mentor' ? 'mentor' : 'student',
      sender_id: Number(currentUserId),
      content: messageInput.trim(),
      read: false
    }

    console.log('📤 Sending to DB (type is omitted for DB):', pendingMsg)

    // Optimistically update the UI so the user sees it immediately
    const optimisticMsg = {
      ...pendingMsg,
      id: Date.now(), // temporary ID
      from: 'learner', // Right side for YOU
      type: 'text',   // REQUIRED for UI to show the text
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }
    setMessages(prev => [...prev, optimisticMsg])

    // Insert to Supabase
    const { error } = await supabase
      .from('messages')
      .insert([pendingMsg])

    if (error) {
      console.error('❌ Error sending message to Supabase:', error)
      alert('Failed to send message: ' + error.message)
      return
    }

    console.log('✅ Message sent successfully')
    setMessageInput('')
    setReplyTo(null)
    setShowAttachOptions(false)
  }

  const handleToggleHighlight = (id) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const nextColor = m.highlightColor ? null : 'yellow'
        return { ...m, highlightColor: nextColor }
      })
    )
    setActiveMenuMessageId(null)
  }

  const handleSetHighlightColor = (id, color) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const nextColor = m.highlightColor === color ? null : color
        return { ...m, highlightColor: nextColor }
      })
    )
    setActiveMenuMessageId(null)
  }

  const handleAddSelfNote = (id) => {
    const current = messages.find((m) => m.id === id)
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
        alert('Failed to save attachment info: ' + attachmentError.message)
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
      alert('Document sent successfully!')

    } catch (err) {
      console.error('❌ Critical Error in Document Flow:', err)
      alert('Error sending document: ' + err.message)
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
        alert('Failed to save attachment info: ' + attachmentError.message)
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
      alert('Image sent successfully!')

    } catch (err) {
      console.error('❌ Critical Error in Image Flow:', err)
      alert('Error sending image: ' + err.message)
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
      alert('Failed to share link: ' + err.message)
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
        alert('Table Insert Failed: ' + attachmentError.message)
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
      alert('Study Material uploaded successfully!')

    } catch (err) {
      console.error('❌ CRITICAL Error uploading study material:', err)
      alert('Failed to upload study material: ' + err.message)
    } finally {
      e.target.value = ''
      setShowAttachOptions(false)
    }
  }

  const handleSendAssessment = async () => {
    if (!newAssessment.title || !newAssessment.description || !newAssessment.dueDate) {
      alert('Please fill in all fields')
      return
    }

    try {
      console.log('📝 Creating Assessment in Table...')
      const courseId = course?.course_id || course?.id

      const { error } = await supabase
        .from('assessments')
        .insert({
          title: newAssessment.title,
          description: newAssessment.description,
          due_date: newAssessment.dueDate,
          course_id: courseId,
          mentor_id: currentUserId,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      console.log('✅ Assessment Created Successfully')
      alert('Assessment created and stored in the specific table successfully!')

      // Clear form but DO NOT add to chat messages
      setNewAssessment({ title: '', description: '', dueDate: '' })
      setShowAssessmentForm(false)
      setShowAttachOptions(false)

    } catch (err) {
      console.error('❌ Error creating assessment:', err)
      alert('Failed to create assessment: ' + err.message)
    }
  }

  const handleScheduleClass = async () => {
    // 1. Validation
    if (!scheduleClassData.title || !scheduleClassData.scheduled_date || !scheduleClassData.meeting_link) {
      alert('Please fill in all fields (Title, Date, Link)')
      return
    }

    try {
      console.log('📅 Scheduling Class...', scheduleClassData)
      const courseId = course?.course_id || course?.id

      // 2. Insert into scheduled_classes table
      const { data: classData, error: dbError } = await supabase
        .from('scheduled_classes')
        .insert({
          course_id: courseId,
          session_id: activeSessionId,
          mentor_id: currentUserId,
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

      alert('Class scheduled successfully!')
      setScheduleClassData({ title: '', scheduled_date: '', meeting_link: '' })
      setShowScheduleClassModal(false)

    } catch (err) {
      console.error('❌ Error scheduling class:', err)
      alert('Failed to schedule class: ' + err.message)
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
      alert('Failed to post assessment to chat')
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
    try {
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select(`
            *,
            student:student_id (name, email), 
            assessment_attachments (*)
          `)
        .eq('assessment_id', assessmentId)

      if (error) {
        console.error('❌ Error fetching submissions:', error)
        throw error
      }
      console.log('📥 fetched submissions:', data)
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions (catch):', error)
      setSubmissions([])
    }
  }

  const handleMarkComplete = async (submissionId) => {
    try {
      const { error } = await supabase
        .from('assessment_submissions')
        .update({ status: 'completed', reviewed_at: new Date().toISOString() })
        .eq('id', submissionId)

      if (error) throw error

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

  return (
    <><div className="live-classroom-page">
      {/* Minimal top bar like inspo */}
      {/* V2 Glass Header */}
      <header className="live-classroom-header-v2">
        <button className="live-back-btn-v2" onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="live-header-title-v2">{classroom.title}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          {userRole === 'mentor' && (
            <>
              <button
                className="live-complete-btn-v2"
                onClick={() => setShowScheduleClassModal(true)}
                title="Schedule Class"
                style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}
              >
                <span className="material-symbols-outlined">calendar_month</span>
              </button>
              <button
                className="live-complete-btn-v2"
                onClick={() => {
                  setShowAssessmentListModal(true)
                  setShowAttachOptions(false)
                }}
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
              style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}
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

      {/* Main chat area */}
      <div className="live-main live-main-full">
        <div className="live-session-label">{activeSession.title}</div>

        <div className="live-chat-area">
          <div className="live-chat-feed" ref={chatFeedRef}>
            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`live-message ${String(message.sender_id) === String(currentUserId) ? 'from-learner' : 'from-mentor'}`}
              >
                <div
                  className={`live-message-bubble ${message.highlightColor ? `highlight-${message.highlightColor}` : ''
                    }`}
                >
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
                  {message.type === 'scheduled_class' && (
                    <div className="live-assessment-card" style={{ borderColor: '#3b82f6', background: '#eff6ff' }}>
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
                          href={message.classLink || (message.content && (() => { try { return JSON.parse(message.content).meeting_link } catch (e) { return '#' } })())}
                          target="_blank"
                          rel="noreferrer"
                          className="assessment-view-btn"
                          style={{ width: '100%', textAlign: 'center', textDecoration: 'none', background: '#3b82f6' }}
                        >
                          Join Class
                        </a>
                      </div>
                    </div>
                  )}
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
                          onClick={() => {
                            const trimmed = noteDraft.trim()
                            if (trimmed) {
                              setMessages((prev) =>
                                prev.map((m) =>
                                  m.id === message.id ? { ...m, selfNote: trimmed } : m
                                )
                              )
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
                  <button
                    type="button"
                    className="live-message-menu-btn"
                    onClick={() =>
                      setActiveMenuMessageId(
                        activeMenuMessageId === message.id ? null : message.id
                      )
                    }
                    aria-label="Message options"
                  >
                    ⋮
                  </button>
                  {activeMenuMessageId === message.id && (
                    <div className="live-message-menu">
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
            <div className="live-attach-sheet-v2">
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
                <div className="assessment-modal-header">
                  <h2>Create Assessment</h2>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowAssessmentForm(false)}
                  >
                    ✕
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
            <div className="live-assessment-modal-overlay" onClick={() => setShowAssessmentListModal(false)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header" style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                  <h2>Assessments</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="modal-action-btn"
                      onClick={() => {
                        setShowAssessmentForm(true)
                        setShowAssessmentListModal(false)
                      }}
                      title="Create New Assessment"
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      +
                    </button>
                    <button
                      className="modal-close-btn"
                      onClick={() => setShowAssessmentListModal(false)}
                    >
                      ✕
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
                          color: '#3b82f6',
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


          {/* Schedule Class Modal */}
          {showScheduleClassModal && (
            <div className="live-assessment-modal-overlay" onClick={() => setShowScheduleClassModal(false)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header">
                  <h2>Schedule Next Class</h2>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowScheduleClassModal(false)}
                  >
                    ✕
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
                  <button className="btn-primary" onClick={handleScheduleClass} style={{ background: '#3b82f6' }}>
                    Save & Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assessment List Modal for Students (Correctly placed) */}


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
        </div>
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
        <button
          type="button"
          className="live-course-complete-btn"
          onClick={() => setShowCompletionModal(true)}
        >
          <span className="live-session-title">Course Complete</span>
        </button>

        {userRole === 'mentor' && (
          <>
            <button
              type="button"
              className="live-course-complete-btn" // Reuse style or add new class
              style={{ backgroundColor: '#22c55e', marginLeft: '12px' }}
              onClick={() => {
                setShowAssessmentListModal(true)
                setShowAttachOptions(false)
              }}
            >
              <span className="live-session-title">Create Poll</span>
            </button>
            <button
              type="button"
              className="live-course-complete-btn"
              style={{ backgroundColor: '#eab308', marginLeft: '12px' }}
              onClick={handleAttachStudyMaterial}
            >
              <span className="live-session-title">Study Material</span>
            </button>
          </>
        )}
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
      {/* Mentor Assessment Review Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl relative">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedSubmission ? 'Review Submission' : selectedAssessment.title}
              </h2>
              <button
                onClick={() => {
                  if (selectedSubmission) setSelectedSubmission(null)
                  else setSelectedAssessment(null)
                }}
                className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {selectedSubmission ? (
                // Single Submission View
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                      {selectedSubmission.student?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{selectedSubmission.student?.name || 'Student'}</h3>
                      <p className="text-gray-600">{selectedSubmission.student?.email}</p>
                      <p className="text-sm text-gray-500 mt-1">Submitted: {formatDate(selectedSubmission.submitted_at)}</p>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${selectedSubmission.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {selectedSubmission.status === 'completed' ? 'Completed' : 'Pending Review'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-800">Text Submission</h3>
                    </div>
                    <div className="p-6 whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedSubmission.text_submission || <span className="text-gray-400 italic">No text provided.</span>}
                    </div>
                  </div>

                  {selectedSubmission.assessment_attachments?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-800">Attachments ({selectedSubmission.assessment_attachments.length})</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {selectedSubmission.assessment_attachments.map(att => (
                          <div key={att.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-all group">
                            <span className="text-2xl">📎</span>
                            <div className="flex-1">
                              <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-medium hover:text-blue-600 hover:underline block">
                                {att.file_name}
                              </a>
                              <span className="text-xs text-gray-500">Document</span>
                            </div>
                            <a href={att.file_url} download target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              ⬇️
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.status !== 'completed' && (
                    <div className="pt-6 border-t mt-8">
                      <button
                        onClick={() => handleMarkComplete(selectedSubmission.id)}
                        className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        ✓ Mark as Complete
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Assessment Details & Submissions List View
                <div className="space-y-8 max-w-5xl mx-auto">
                  {/* Assessment Details Card */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedAssessment.title}</h3>
                          <p className="text-gray-600 leading-relaxed text-base">{selectedAssessment.description}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg space-y-3 h-fit">
                        <div>
                          <span className="text-blue-600 text-xs font-bold uppercase tracking-wide block mb-1">Course ID</span>
                          <span className="font-medium text-gray-900">{selectedAssessment.course_id}</span>
                        </div>
                        <div>
                          <span className="text-blue-600 text-xs font-bold uppercase tracking-wide block mb-1">Due Date</span>
                          <span className="font-medium text-gray-900">{formatDate(selectedAssessment.due_date)}</span>
                        </div>
                        <div>
                          <span className="text-blue-600 text-xs font-bold uppercase tracking-wide block mb-1">Status</span>
                          <span className="font-medium text-gray-900">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-gray-900">Student Submissions</h3>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">{submissions.length} Total</span>
                    </div>

                    {submissions.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <span className="text-4xl block mb-4">📂</span>
                        <p className="text-gray-500 text-lg font-medium">No submissions yet.</p>
                        <p className="text-gray-400 text-sm mt-1">When students submit their work, it will appear here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {submissions.map(sub => (
                          <div key={sub.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col" onClick={() => setSelectedSubmission(sub)}>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                {sub.student?.name?.charAt(0) || 'S'}
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-bold text-gray-900 truncate">{sub.student?.name || 'Student'}</p>
                                <p className="text-xs text-gray-500">{formatDate(sub.submitted_at)}</p>
                              </div>
                            </div>

                            <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${sub.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                }`}>
                                {sub.status}
                              </span>
                              <span className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
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
        </div>
      )}
    </>
  )
}

export default MentorLiveClassroom


