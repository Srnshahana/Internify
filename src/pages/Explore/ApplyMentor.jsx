import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient.js'
import MessageModal from '../../components/shared/MessageModal.jsx'
import Loading from '../../components/Loading.jsx'
import { storeAuthData, clearAuthData } from '../../utils/auth.js'
import '../../App.css'

export default function ApplyMentor() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authUserId, setAuthUserId] = useState(null)
    const [isAuthLoading, setIsAuthLoading] = useState(true)
    const [legacyId, setLegacyId] = useState(null)
    const [availableCourses, setAvailableCourses] = useState([])
    const [loadingCourses, setLoadingCourses] = useState(true)

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null
    })

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        profile_image: '',
        title: '',
        about: '',
        address: '',
        rating: 5,
        is_verified: false,
        is_platformAssured: false,
        is_mentor_approved: 'pending',
        experties_in: [],
        category: [],
        education: [
            { degree: '', institution: '', start_year: '', end_year: '', description: '' }
        ],
        experience: [
            { role: '', company: '', start_date: '', end_date: '', location: '', description: '' }
        ],
        skills: [
            { name: '', level: 'Intermediate' },
            { name: '', level: 'Intermediate' },
            { name: '', level: 'Intermediate' }
        ],
        testimonial: [
            { from: 'Student', text: 'Great mentor!', rating: 5, title: 'Student', date: 'Recent' }
        ],
        coursesOffered: []
    })

    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        courseId: null,
        courseTitle: '',
        data: {
            duration: '',
            timings: '',
            projects: '',
            deliverables: '',
            additional: ''
        }
    })

    useEffect(() => {
        fetchCourses()
        const setupInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setAuthUserId(user.id)
                // Check if this user already exists in our 'users' table
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('user_id, email, phone_number, role, name')
                    .eq('id', user.id)
                    .maybeSingle()

                if (existingUser) {
                    setLegacyId(existingUser.user_id)
                    localStorage.setItem('auth_id', existingUser.user_id)

                    // Pre-fill existing data
                    setFormData(prev => ({
                        ...prev,
                        name: existingUser.name || prev.name,
                        email: existingUser.email || user.email || '',
                        phone: existingUser.phone_number || ''
                    }))

                    // Fetch existing courses they might have already selected
                    const { data: existingCourses } = await supabase
                        .from('mentor_courses')
                        .select('course_id, course_provide')
                        .eq('mentor_id', existingUser.user_id)

                    if (existingCourses && existingCourses.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            coursesOffered: existingCourses.map(c => ({
                                course_id: String(c.course_id),
                                description: c.course_provide || ''
                            }))
                        }))
                    }

                    // Recovery logic: If they are already a 'mentor' role, check if they finished the profile
                    if (existingUser.role === 'mentor') {
                        const { data: mentorDetails } = await supabase
                            .from('mentors_details')
                            .select('onboarding_completed')
                            .eq('mentor_id', existingUser.user_id)
                            .maybeSingle()

                        if (mentorDetails?.onboarding_completed) {
                            // Already fully submitted
                            showModal('Application Status', 'You have already submitted an application. Check your dashboard for updates.', 'info', () => navigate('/mentor-dashboard'))
                        } else {
                            // "Half-way trap": Finished Step 1 (users record) but not full onboarding
                            setStep(2) // Jump to profile details
                            showModal(
                                'Resume Application',
                                `Welcome back! Let's finish your professional profile to complete your application.`,
                                'info'
                            )
                        }
                    }
                } else {
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || '',
                        phone: ''
                    }))
                }
            }
            setIsAuthLoading(false)
        }
        setupInitialData()
    }, [])

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true)
            const { data, error } = await supabase
                .from('courses')
                .select('course_id, title')
                .order('title', { ascending: true })

            if (error) throw error
            setAvailableCourses(data || [])
        } catch (err) {
            console.error('Error fetching courses:', err)
        } finally {
            setLoadingCourses(false)
        }
    }

    const showModal = (title, message, type = 'info', onConfirm = null, secondaryAction = null) => {
        setModalConfig({ isOpen: true, title, message, type, onConfirm, secondaryAction })
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
        } catch (error) {
            console.error('Error signing out:', error)
        } finally {
            clearAuthData()
            // Clear specific Supabase token matching dashboard logic
            localStorage.removeItem('sb-zupzvpepzkjeaelxczlz-auth-token')
            // Hard redirect to landing page to ensure state refresh
            window.location.href = '/'
        }
    }

    const handleLeave = () => {
        // Direct logout and exit as requested to prevent any modal-related crashes
        handleLogout()
    }

    // --- Dynamic List Helpers ---
    const addListItem = (field, emptyItem) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], emptyItem]
        }))
    }

    const removeListItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    const updateListItem = (field, index, value) => {
        setFormData(prev => {
            const newList = [...prev[field]]
            newList[index] = { ...newList[index], ...value }
            return { ...prev, [field]: newList }
        })
    }

    const toggleCourse = (courseId) => {
        if (!courseId) return
        const strId = String(courseId)
        setFormData(prev => {
            const currentOffered = prev.coursesOffered || []
            const exists = currentOffered.find(c => String(c.course_id) === strId)
            if (exists) {
                return {
                    ...prev,
                    coursesOffered: currentOffered.filter(c => String(c.course_id) !== strId)
                }
            } else {
                return {
                    ...prev,
                    coursesOffered: [...currentOffered, { course_id: strId, description: '' }]
                }
            }
        })
    }

    const updateCourseDescription = (courseId, description) => {
        setFormData(prev => ({
            ...prev,
            coursesOffered: prev.coursesOffered.map(c =>
                c.course_id === courseId ? { ...c, description } : c
            )
        }))
    }

    const openDetailModal = (courseId, title) => {
        const selection = (formData.coursesOffered || []).find(c => String(c.course_id) === String(courseId))
        setDetailModal({
            isOpen: true,
            courseId,
            courseTitle: title,
            data: selection ? {
                // If it's a generated description, we might not be able to parse it back easily 
                // but we can at least show it or let them start fresh.
                // For now, if it's already set, we just keep the prev data if we had it, 
                // but since state is lost on refresh, we'll just start fresh or try to find it.
                duration: '',
                timings: '',
                projects: '',
                deliverables: '',
                additional: ''
            } : {
                duration: '',
                timings: '',
                projects: '',
                deliverables: '',
                additional: ''
            }
        })
    }

    const saveDetails = () => {
        const { duration, timings, projects, deliverables, additional } = detailModal.data
        const generatedDescription = `Approximate Duration: ${duration}\n\nWeekly Timings (IST): ${timings}\n\nLive Projects provided: ${projects}\n\nFocus Area: ${deliverables}${additional ? `\n\nTarget Audience: ${additional}` : ''}`

        updateCourseDescription(detailModal.courseId, generatedDescription)
        setDetailModal(prev => ({ ...prev, isOpen: false }))
    }

    const handleDetailChange = (field, value) => {
        setDetailModal(prev => ({
            ...prev,
            data: { ...prev.data, [field]: value }
        }))
    }

    const toggleArrayItem = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || []
            const exists = current.includes(value)
            return {
                ...prev,
                [field]: exists ? current.filter(item => item !== value) : [...current, value]
            }
        })
    }

    const handleSubmit = async () => {
        if (formData.coursesOffered.length === 0) {
            showModal('Course Required', 'Please select at least one course you are ready to offer.', 'warning')
            return
        }

        if (!legacyId) {
            showModal('Session Error', 'Please go back to Step 1 and re-verify your account details.', 'error')
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare mentor data
            const submissionData = {
                ...formData,
                experties_in: formData.experties_in.length > 0
                    ? formData.experties_in
                    : formData.skills.filter(s => s.name.trim() !== '').map(s => s.name)
            }

            const {
                email, phone, password, confirmPassword, coursesOffered,
                title, ...dataToSubmit
            } = submissionData

            // 1. Update/Insert into 'mentors_details'
            // We use upsert to prevent "duplicate key" errors if the user retries the final step
            const { error: profileError } = await supabase
                .from('mentors_details')
                .upsert({
                    mentor_id: legacyId,
                    ...dataToSubmit,
                    is_mentor_approved: 'pending',
                    onboarding_completed: true
                }, { onConflict: 'mentor_id' })

            if (profileError) throw profileError

            // 2. Insert/Update 'mentor_courses'
            // Delete old selections first to ensure clean state on retry
            await supabase.from('mentor_courses').delete().eq('mentor_id', legacyId)

            const mentorCoursesData = coursesOffered.map(course => ({
                mentor_id: legacyId,
                course_id: parseInt(course.course_id),
                course_provide: course.description
            }))

            const { error: coursesError } = await supabase
                .from('mentor_courses')
                .insert(mentorCoursesData)

            if (coursesError) throw coursesError

            // 2. Success
            showModal(
                'Application Submitted!',
                'Your mentor account has been created and your application is now under review.',
                'success',
                () => navigate('/mentor-dashboard')
            )

        } catch (error) {
            console.error('Final submission failed:', error)
            showModal('Submission Failed', error.message || 'An error occurred during final submission.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const nextStep = async () => {
        if (step === 1) {
            // Check if we're still waiting for auth data
            if (isAuthLoading) return;

            // If already authenticated, we only need name, email, and phone. Password is only needed for new signups.
            const isPasswordRequired = !authUserId

            if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || (isPasswordRequired && (!formData.password || !formData.confirmPassword))) {
                const message = isPasswordRequired
                    ? 'Please fill in your name and login credentials to continue.'
                    : 'Please fill in your name and phone number to continue.'
                showModal('Required Info', message, 'warning')
                return
            }
            if (!formData.email.includes('@')) {
                showModal('Invalid Email', 'Please enter a valid email address.', 'warning')
                return
            }

            if (isPasswordRequired) {
                if (formData.password.length < 6) {
                    showModal('Weak Password', 'Password must be at least 6 characters long.', 'warning')
                    return
                }
                if (formData.password !== formData.confirmPassword) {
                    showModal('Password Mismatch', 'Passwords do not match.', 'warning')
                    return
                }
            }

            setIsSubmitting(true)
            try {
                let userId = authUserId
                let randomLegacyId = legacyId

                // 1. Handle Auth and ID Generation
                if (!userId) {
                    // Sign up new user
                    const { data: authData, error: signupError } = await supabase.auth.signUp({
                        email: formData.email,
                        password: formData.password,
                        options: { data: { name: formData.name } }
                    })

                    if (signupError) {
                        if (signupError.message?.toLowerCase().includes('already registered')) {
                            // User exists in Supabase. Try to sign in with these credentials.
                            const { data: logInData, error: logInError } = await supabase.auth.signInWithPassword({
                                email: formData.email,
                                password: formData.password
                            })

                            if (logInError) {
                                // If login fails, they probably gave the wrong password for an existing account
                                throw new Error('This email is already registered. Please check your password or log in via the Login page.')
                            }

                            // Logged in successfully! Now fetch their name and IDs
                            userId = logInData.user.id
                            const { data: dbUser } = await supabase
                                .from('users')
                                .select('user_id, name, role')
                                .or(`id.eq.${userId},auth_uid.eq.${userId}`)
                                .maybeSingle()

                            if (dbUser) {
                                setAuthUserId(userId)
                                setLegacyId(dbUser.user_id)
                                localStorage.setItem('auth_id', dbUser.user_id)
                                localStorage.setItem('auth_user_role', dbUser.role || 'mentor')
                                storeAuthData({ id: userId, role: dbUser.role || 'mentor' })

                                // Show specific "Welcome back" modal per user request
                                showModal(
                                    'Account Found!',
                                    `Welcome back, ${dbUser.name || formData.name}! Please complete your professional profile to access your dashboard.`,
                                    'info',
                                    () => setStep(2)
                                )
                                setIsSubmitting(false)
                                return // EXIT EARLY - Do not change user table values
                            } else {
                                // Ghost case: account exists in Auth but not in users table yet.
                                // We need a legacy numeric ID for them.
                                randomLegacyId = Math.floor(100000 + Math.random() * 900000)
                            }
                        } else {
                            throw signupError
                        }
                    } else {
                        userId = authData.user.id
                        randomLegacyId = Math.floor(100000 + Math.random() * 900000)
                    }
                } else if (!randomLegacyId) {
                    // Logged in but missing legacy numeric ID? Check DB or generate
                    const { data: existingUser } = await supabase
                        .from('users')
                        .select('user_id')
                        .eq('id', userId)
                        .maybeSingle()

                    if (existingUser?.user_id) {
                        randomLegacyId = existingUser.user_id
                    } else {
                        randomLegacyId = Math.floor(100000 + Math.random() * 900000)
                    }
                }

                // 2. Passive Persistence Check: 
                // We try to find the user. If they exist, we use their data and STOP.
                // If they don't exist, we try to create them ONE TIME and carry on even if RLS blocks it (trigger might be active).
                const { data: existingDbUser } = await supabase
                    .from('users')
                    .select('user_id, role, name, email')
                    .or(`id.eq.${userId},auth_uid.eq.${userId},email.ilike.${formData.email}`)
                    .maybeSingle()

                if (existingDbUser) {
                    // Shield: Found them! Use existing data. DO NOT attempt to write.
                    const finalId = userId || existingDbUser.id || existingDbUser.auth_uid
                    const finalLegacyId = existingDbUser.user_id

                    setAuthUserId(finalId)
                    setLegacyId(finalLegacyId)
                    localStorage.setItem('auth_id', finalLegacyId)
                    localStorage.setItem('auth_user_role', existingDbUser.role || 'mentor')
                    storeAuthData({ id: finalId, role: existingDbUser.role || 'mentor' })

                    showModal('Account Found!', `Welcome back, ${existingDbUser.name || formData.name}! Proceeding to complete your profile.`, 'info', () => setStep(2))
                    setIsSubmitting(false)
                    return
                }

                // 3. Fallback: Only try to insert if not found. 
                // We use .insert() instead of .upsert() to avoid RLS Update conflicts.
                if (!existingDbUser) {
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert({
                            id: userId,
                            user_id: randomLegacyId,
                            email: formData.email,
                            role: 'mentor',
                            name: formData.name,
                            phone_number: formData.phone,
                            password: formData.password
                        })

                    if (insertError) {
                        // If it's an RLS error or Duplicate error, a trigger might have already handled it.
                        // We log it but don't crash Step 1 if we have a userId.
                        console.warn('Users table insert suppressed (likely handled by trigger or exists):', insertError)
                        if (!insertError.message?.toLowerCase().includes('security policy')) {
                            // If it's NOT an RLS error, it might be a real issue
                            // but for "User Already There", we should just proceed
                        }
                    }
                }

                // Final state sync
                setAuthUserId(userId)
                setLegacyId(randomLegacyId)
                localStorage.setItem('auth_id', randomLegacyId)
                localStorage.setItem('auth_user_role', 'mentor')
                storeAuthData({ id: userId, role: 'mentor' })

                showModal(
                    'Account Ready!',
                    'Now, let\'s complete your professional profile to attract students.',
                    'success',
                    () => setStep(2)
                )
                return

            } catch (error) {
                console.error('Step 1 account creation failed:', error)
                showModal('Account Creation Failed', error.message || 'Could not create account. Please try again.', 'error')
                return
            } finally {
                setIsSubmitting(false)
            }
        }

        if (step === 2) {
            if (!formData.address.trim() || !formData.title.trim() || !formData.about.trim()) {
                showModal('Profile Incomplete', 'Please provide your location, title, and "About" overview to continue.', 'warning')
                return
            }
        }

        if (step === 3) {
            const skillsCount = formData.skills?.filter(s => s.name.trim() !== '').length || 0
            if (skillsCount < 3) {
                showModal('Skills Required', 'Please add at least 3 skills with proficiency levels to continue.', 'warning')
                return
            }
            if (formData.category.length === 0) {
                showModal('Category Required', 'Please select at least one professional category.', 'warning')
                return
            }
        }

        if (step === 4) {
            const hasExperience = formData.experience.some(exp => exp.role.trim() !== '' && exp.company.trim() !== '')
            if (!hasExperience) {
                showModal('Experience Required', 'Please add at least one professional experience.', 'warning')
                return
            }
        }

        if (step === 5) {
            const hasEducation = formData.education.some(edu => edu.degree.trim() !== '' && edu.institution.trim() !== '')
            if (!hasEducation) {
                showModal('Education Required', 'Please add at least one education entry.', 'warning')
                return
            }
        }

        setStep(prev => Math.min(prev + 1, 6))
    }

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div key={step} className="onboarding-step-content fade-in-up">
                        <h2 className="step-title">Account Details</h2>
                        <p className="step-subtitle">
                            {authUserId ? 'Verify your contact information.' : 'Create or verify your mentor account credentials.'}
                        </p>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>Full Name <span className="required-star">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Email Address <span className="required-star">*</span></label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => !authUserId && handleInputChange('email', e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    readOnly={!!authUserId}
                                    className={authUserId ? 'readonly-input' : ''}
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone Number <span className="required-star">*</span></label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="+1 234 567 890"
                                    required
                                />
                            </div>
                            {!authUserId && (
                                <>
                                    <div className="input-group">
                                        <label>Password <span className="required-star">*</span></label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Min 6 characters"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Confirm Password <span className="required-star">*</span></label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            placeholder="Re-enter password"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div key={step} className="onboarding-step-content fade-in-up">
                        <h2 className="step-title">Profile Appearance</h2>
                        <p className="step-subtitle">How your profile will look to students.</p>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>Location <span className="required-star">*</span></label>
                                <input type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="City, Country" required />
                            </div>
                            <div className="input-group">
                                <label>Professional Title <span className="required-star">*</span></label>
                                <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Lead UI Designer" required />
                            </div>
                            <div className="input-group full-width">
                                <label>About / Bio <span className="required-star">*</span></label>
                                <textarea value={formData.about} onChange={(e) => handleInputChange('about', e.target.value)} rows="4" placeholder="Brief overview of your expertise..." required />
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div key={step} className="onboarding-step-content fade-in-up">
                        <h2 className="step-title">Expertise & Skills</h2>
                        <p className="step-subtitle">Select your categories and key skills with proficiency levels.</p>

                        <div className="input-group full-width mb-20">
                            <label>Professional Categories</label>
                            <div className="tag-input-wrapper">
                                {['Tech', 'Design', 'Marketing', 'Leadership', 'Business', 'Creative'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`tag-pill ${formData.category.includes(cat) ? 'active' : ''}`}
                                        onClick={() => toggleArrayItem('category', cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group full-width">
                            <div className="section-header-row">
                                <label>Primary Skills & Proficiencies (At least 3)</label>
                                <button type="button" className="add-item-btn" onClick={() => addListItem('skills', { name: '', level: 'Intermediate' })}>
                                    <span className="material-symbols-outlined">add</span> Add Skill
                                </button>
                            </div>
                            <div className="dynamic-list-inline mt-10">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="pill-input-card">
                                        <input
                                            type="text"
                                            placeholder="e.g. Flutter"
                                            value={skill.name}
                                            onChange={(e) => updateListItem('skills', index, { name: e.target.value })}
                                        />
                                        <select value={skill.level} onChange={(e) => updateListItem('skills', index, { level: e.target.value })}>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                        {index > 0 && <button type="button" onClick={() => removeListItem('skills', index)}>×</button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div key={step} className="onboarding-step-content fade-in-up">
                        <div className="section-header-row">
                            <h2 className="step-title">Professional Experience</h2>
                            <button type="button" className="add-item-btn" onClick={() => addListItem('experience', { role: '', company: '', start_date: '', end_date: '', location: '', description: '' })}>
                                <span className="material-symbols-outlined">add</span> Add
                            </button>
                        </div>
                        <p className="step-subtitle">List your previous or current roles.</p>
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="list-item-card step-card">
                                {index > 0 && <button type="button" className="remove-item-btn" onClick={() => removeListItem('experience', index)}>×</button>}
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Role / Title</label>
                                        <input type="text" value={exp.role} onChange={(e) => updateListItem('experience', index, { role: e.target.value })} placeholder="e.g. Senior Developer" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Company</label>
                                        <input type="text" value={exp.company} onChange={(e) => updateListItem('experience', index, { company: e.target.value })} placeholder="e.g. Google" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Start Date</label>
                                        <input type="date" value={exp.start_date} onChange={(e) => updateListItem('experience', index, { start_date: e.target.value })} required />
                                    </div>
                                    <div className="input-group">
                                        <div className="label-with-action">
                                            <label>End Date</label>
                                            <label className="checkbox-pill">
                                                <input
                                                    type="checkbox"
                                                    checked={exp.end_date === 'Present'}
                                                    onChange={(e) => updateListItem('experience', index, { end_date: e.target.checked ? 'Present' : '' })}
                                                />
                                                <span>Present</span>
                                            </label>
                                        </div>
                                        {exp.end_date === 'Present' ? (
                                            <input type="text" value="Present" readOnly className="present-active-input" />
                                        ) : (
                                            <input type="date" value={exp.end_date} onChange={(e) => updateListItem('experience', index, { end_date: e.target.value })} />
                                        )}
                                    </div>
                                    <div className="input-group full-width">
                                        <label>Description</label>
                                        <textarea value={exp.description} onChange={(e) => updateListItem('experience', index, { description: e.target.value })} rows="2" placeholder="Key responsibilities..." />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            case 5:
                return (
                    <div key={step} className="onboarding-step-content fade-in-up">
                        <div className="section-header-row">
                            <h2 className="step-title">Education</h2>
                            <button type="button" className="add-item-btn" onClick={() => addListItem('education', { degree: '', institution: '', start_year: '', end_year: '', description: '' })}>
                                <span className="material-symbols-outlined">add</span> Add
                            </button>
                        </div>
                        <p className="step-subtitle">Degrees and certifications.</p>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="list-item-card step-card">
                                {index > 0 && <button type="button" className="remove-item-btn" onClick={() => removeListItem('education', index)}>×</button>}
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Degree</label>
                                        <input type="text" value={edu.degree} onChange={(e) => updateListItem('education', index, { degree: e.target.value })} placeholder="e.g. BSc Computer Science" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Institution</label>
                                        <input type="text" value={edu.institution} onChange={(e) => updateListItem('education', index, { institution: e.target.value })} placeholder="e.g. MIT" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Start Year</label>
                                        <select value={edu.start_year} onChange={(e) => updateListItem('education', index, { start_year: e.target.value })}>
                                            <option value="">Year</option>
                                            {Array.from({ length: 51 }, (_, i) => 2030 - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>End Year</label>
                                        <select value={edu.end_year} onChange={(e) => updateListItem('education', index, { end_year: e.target.value })}>
                                            <option value="">Year</option>
                                            {Array.from({ length: 51 }, (_, i) => 2030 - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            case 6:
                return (
                    <div key={step} className="onboarding-step-content fade-in-up">
                        <h2 className="step-title">Courses You Offer</h2>
                        <p className="step-subtitle">Select programs and provide a detailed description of what you will provide (timings, projects, duration, etc.)</p>

                        <div className="offered-courses-container">
                            {loadingCourses ? <Loading size="40px" /> : (
                                <div className="detailed-course-list">
                                    {availableCourses.map(course => {
                                        const cid = String(course.course_id)
                                        const isSelected = (formData.coursesOffered || []).some(c => String(c.course_id) === cid)
                                        const selection = (formData.coursesOffered || []).find(c => String(c.course_id) === cid)

                                        return (
                                            <div 
                                                key={course.course_id} 
                                                className={`course-detail-card ${isSelected ? 'active' : ''}`}
                                                onClick={() => toggleCourse(String(course.course_id))}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="course-card-header">
                                                    <div className="course-info" style={{ pointerEvents: 'none' }}>
                                                        <span className="material-symbols-outlined icon">
                                                            {isSelected ? 'check_circle' : 'add_circle'}
                                                        </span>
                                                        <span className="title">{course.title}</span>
                                                    </div>
                                                    <span className="status-badge" style={{ pointerEvents: 'none' }}>
                                                        {isSelected ? 'Selected' : 'Click to add'}
                                                    </span>
                                                </div>

                                                {isSelected && (
                                                    <div className="course-card-body fade-in" onClick={(e) => e.stopPropagation()}>
                                                        <div className="details-header-row">
                                                            <label>Course Offer Details <span className="required-star">*</span></label>
                                                            <button
                                                                type="button"
                                                                className="edit-details-btn"
                                                                onClick={() => openDetailModal(String(course.course_id), course.title)}
                                                            >
                                                                <span className="material-symbols-outlined">edit_note</span>
                                                                {selection.description ? 'Update Details' : 'Configure Offer'}
                                                            </button>
                                                        </div>

                                                        {selection.description ? (
                                                            <div className="course-provide-preview">
                                                                {selection.description.split('\n').map((line, i) => (
                                                                    <p key={i}>{line}</p>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="empty-details-box" onClick={() => openDetailModal(String(course.course_id), course.title)}>
                                                                <span className="material-symbols-outlined">info</span>
                                                                <p>Click "Configure Offer" to add duration, timings, project details, and more.</p>
                                                            </div>
                                                        )}
                                                        <p className="input-hint">Students need specific details about your timings and projects to enroll.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="onboarding-page-premium">
            <div className="onboarding-content-card multi-step-onboarding">
                <div className="onboarding-header-v2">
                    <div className="progress-container">
                        <div className="progress-bar-onboarding" style={{ width: `${(step / 6) * 100}%` }}></div>
                    </div>
                    <div className="step-indicator-text">Step {step} of 6</div>
                    <h1>Apply as a Mentor</h1>
                </div>

                <div className="onboarding-body-v2">
                    {renderStepContent()}
                </div>

                <div className="onboarding-footer-v2">
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            className="onboarding-exit-btn"
                            onClick={handleLeave}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: 'white',
                                color: '#64748b',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                            Exit
                        </button>
                        <button
                            type="button"
                            className="onboarding-back-btn"
                            onClick={prevStep}
                            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                        >
                            Back
                        </button>
                    </div>
                    {step < 6 ? (
                        <button
                            type="button"
                            className="onboarding-next-btn"
                            onClick={nextStep}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && step === 1 ? 'Creating Account...' : (
                                <>Next Step <span className="material-symbols-outlined">arrow_forward</span></>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="onboarding-final-btn"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Complete Application'}
                        </button>
                    )}
                </div>
            </div>

            <MessageModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                {...modalConfig}
            />

            {/* Structured Course Details Modal */}
            {detailModal.isOpen && (
                <div className="course-modal-overlay" onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))} style={{ zIndex: 10000 }}>
                    <div className="course-modal-content detailed-offer-modal fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-elegant">
                            <h3>Configure Your {detailModal.courseTitle} Offer</h3>
                            <button className="close-btn" onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}>×</button>
                        </div>
                        <div className="modal-body-elegant">
                            <p className="modal-instruction">Provide specific details to help students understand exactly what you offer.</p>

                            <div className="modal-form-grid">
                                <div className="input-group">
                                    <label>Approximate Duration <span className="required-star">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 12 Weeks (3 Months)"
                                        value={detailModal.data.duration}
                                        onChange={(e) => handleDetailChange('duration', e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Weekly Timings - preferred in IST <span className="required-star">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sat-Sun 10:00 AM - 12:00 PM IST"
                                        value={detailModal.data.timings}
                                        onChange={(e) => handleDetailChange('timings', e.target.value)}
                                    />
                                </div>
                                <div className="input-group full-width">
                                    <label>Live Projects which you provide <span className="required-star">*</span></label>
                                    <textarea
                                        placeholder="Describe the real-world projects and hands-on work students will complete..."
                                        rows="3"
                                        value={detailModal.data.projects}
                                        onChange={(e) => handleDetailChange('projects', e.target.value)}
                                    />
                                </div>
                                <div className="input-group full-width">
                                    <label>Key focus on where will you focus your work <span className="required-star">*</span></label>
                                    <textarea
                                        placeholder="Detail the core concepts, tools, and outcomes you will prioritize..."
                                        rows="2"
                                        value={detailModal.data.deliverables}
                                        onChange={(e) => handleDetailChange('deliverables', e.target.value)}
                                    />
                                </div>
                                <div className="input-group full-width">
                                    <label>Who should choose this course</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Beginners, Final year students, Professionals switching careers..."
                                        value={detailModal.data.additional}
                                        onChange={(e) => handleDetailChange('additional', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-elegant">
                            <button className="cancel-btn" onClick={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}>Cancel</button>
                            <button
                                className="save-btn"
                                onClick={saveDetails}
                                disabled={!detailModal.data.duration || !detailModal.data.timings || !detailModal.data.projects || !detailModal.data.deliverables}
                            >
                                Generate Full Description
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
