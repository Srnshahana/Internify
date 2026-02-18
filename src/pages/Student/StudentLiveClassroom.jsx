import { useState, useRef, useEffect } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'


function StudentLiveClassroom({ course, onBack }) {
  const userRole = 'student'
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

  // Removed mentor assessment creation state
  const [showAssessmentListModal, setShowAssessmentListModal] = useState(false)
  const [messages, setMessages] = useState([])
  const chatFeedRef = useRef(null)
  const docInputRef = useRef(null)

  const imageInputRef = useRef(null)
  // Removed study material ref
  const assessmentFileInputRef = useRef(null)

  const [dbAssessments, setDbAssessments] = useState([])

  useEffect(() => {
    if (showAssessmentListModal) {
      fetchDbAssessments()
    }
  }, [showAssessmentListModal])

  const fetchDbAssessments = async () => {
    try {
      // 1. Fetch Assessments
      const { data: assessments, error: asmError } = await supabase
        .from('assessments')
        .select('*')
        .eq('course_id', course?.course_id || course?.id)
        .order('created_at', { ascending: false })

      if (asmError) throw asmError

      // 2. Fetch User's Submissions for these assessments
      if (assessments?.length > 0) {
        console.log('🔍 Fetching submissions for student:', currentUserId)
        const { data: submissions, error: subError } = await supabase
          .from('assessment_submissions')
          .select('*') // Select all to see what we get
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
          let inferredType = newMessage.type || 'text'

          if (newMessage.type === 'assessment') {
            try {
              const details = JSON.parse(newMessage.content)
              Object.assign(newMessage, details)
            } catch (e) { }
            inferredType = 'assessment'
          }

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
    Number(m.session_id) === Number(activeSessionId)
  )

  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [showAttachOptions, setShowAttachOptions] = useState(false)
  const [noteEditingId, setNoteEditingId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
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







  const handleViewAssessment = (assessmentMessage) => {
    setSelectedAssessment(assessmentMessage)
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
      alert('Please provide either text submission or attach files')
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

      // Construct a single text body including attachments since the 'attachments' column is missing
      let finalSubmissionText = assessmentSubmission.textSubmission || ''
      if (uploadedAttachments.length > 0) {
        finalSubmissionText += '\n\n__Attachments:__\n'
        uploadedAttachments.forEach(att => {
          finalSubmissionText += `- [${att.name}](${att.url})\n`
        })
      }

      const submissionPayload = {
        assessment_id: selectedAssessment.id,
        student_id: currentUserId,
        text_submission: finalSubmissionText, // Using text column to store everything
        // attachments: uploadedAttachments, // REMOVED: Column does not exist
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      }

      // Try inserting. If submission_text also fails, we will need to know the correct column name.
      const { error: dbError } = await supabase
        .from('assessment_submissions')
        .insert([submissionPayload])

      if (dbError) {
        console.error('❌ DB Submission Error:', dbError)
        throw dbError
      }

      console.log('✅ Submission Saved!')

      // 3. Post confirmation to Chat
      const submissionMessage = {
        chat_id: Number(chatId),
        session_id: Number(activeSessionId),
        role: 'student',
        sender_id: Number(currentUserId),
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

      alert('Assessment submitted successfully!')
      setSelectedAssessment(null)
      setAssessmentSubmission({ textSubmission: '', attachments: [] })
      setShowAssessmentListModal(false)

    } catch (err) {
      console.error('❌ Submission Failed:', err)
      alert('Failed to submit assessment: ' + err.message)
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

  return (
    <div className="live-classroom-page">
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
                className={`live-message ${message.from === 'mentor' ? 'from-mentor' : 'from-learner'}`}
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




          {/* Assessment View Modal for Students */}
          {selectedAssessment && userRole === 'student' && (
            <div className="live-assessment-modal-overlay" onClick={() => setSelectedAssessment(null)}>
              <div className="live-assessment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assessment-modal-header">
                  <h2>Assessment</h2>
                  <button
                    className="modal-close-btn"
                    onClick={() => setSelectedAssessment(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="assessment-modal-content">
                  <div className="assessment-view-header">
                    <h3>{selectedAssessment.assessmentTitle}</h3>
                    <p className="assessment-view-course">{course?.title || 'Course'}</p>
                  </div>
                  <div className="assessment-view-details">
                    <div className="info-item">
                      <span className="info-label">Due Date:</span>
                      <span className="info-value">
                        {/* {selectedAssessment.assessmentDueDate && !isNaN(new Date(selectedAssessment.assessmentDueDate).getTime())
                          ? new Date(selectedAssessment.assessmentDueDate).toLocaleDateString()
                          : 'No Due Date'} */}
                        To be announced
                      </span>
                    </div>
                  </div>
                  <div className="assessment-view-description">
                    <h4>Instructions</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{selectedAssessment.assessmentDescription}</p>
                  </div>

                  {/* Submission Form OR Status View */}
                  {selectedAssessment.mySubmission && (selectedAssessment.mySubmission.status === 'submitted' || selectedAssessment.mySubmission.status === 'completed') ? (
                    <div className="assessment-submission-form disabled-submission" style={{ opacity: 0.6, pointerEvents: 'none' }}>
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
                        <textarea
                          className="form-textarea"
                          rows="8"
                          placeholder="Describe your work, explain your approach, or provide any additional context..."
                          value={selectedAssessment.mySubmission.text_submission || selectedAssessment.mySubmission.submission_text || ''}
                          readOnly
                          style={{ background: '#f8fafc', color: '#64748b' }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Attach Files / Documents</label>

                        {/* If attachments exist, show them */}
                        {selectedAssessment.mySubmission.attachments && selectedAssessment.mySubmission.attachments.length > 0 ? (
                          <div className="attachments-list" style={{ marginTop: '12px' }}>
                            {selectedAssessment.mySubmission.attachments.map((attachment, idx) => (
                              <div key={idx} className="attachment-item">
                                <div className="attachment-icon">📎</div>
                                <div className="attachment-info">
                                  <span className="attachment-name">{attachment.name || `Attachment ${idx + 1}`}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
                            No files attached
                          </div>
                        )}
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
                <div className="assessment-modal-header">
                  <h2>All Assessments</h2>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowAssessmentListModal(false)}
                  >
                    ✕
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
                            console.log('� [DEBUG] Assessment Clicked:', assessment)

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
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
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
          <button
            type="button"
            className="live-course-complete-btn"
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
    </div >
  )
}

export default StudentLiveClassroom


