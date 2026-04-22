import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient'
import MessageModal from '../../components/shared/MessageModal.jsx'
import Loading from '../../components/Loading'
import { storeAuthData } from '../../utils/auth.js'
import '../../App.css'

export default function ApplyMentor() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authUserId, setAuthUserId] = useState(null)
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

    useEffect(() => {
        fetchCourses()
        const setupInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setAuthUserId(user.id)
                // Check if this user already exists in our 'users' table
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('user_id, email, phone_number, role')
                    .eq('id', user.id)
                    .maybeSingle()

                if (existingUser) {
                    setLegacyId(existingUser.user_id)
                    localStorage.setItem('auth_id', existingUser.user_id)
                    
                    // Only pre-fill if it's not the name the user wants removed
                    setFormData(prev => ({
                        ...prev,
                        email: existingUser.email || user.email || '',
                        phone: existingUser.phone_number || ''
                    }))
                } else {
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || '',
                        phone: ''
                    }))
                }
            }
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

    const showModal = (title, message, type = 'info', onConfirm = null) => {
        setModalConfig({ isOpen: true, title, message, type, onConfirm })
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
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

            // 1. Update/Insert into 'mentors_details'
            // We use upsert to prevent "duplicate key" errors if the user retries the final step
            const { email, phone, password, confirmPassword, ...dataToSubmit } = submissionData
            const { error: profileError } = await supabase
                .from('mentors_details')
                .upsert({
                    mentor_id: legacyId,
                    ...dataToSubmit,
                    is_mentor_approved: 'pending'
                }, { onConflict: 'mentor_id' })

            if (profileError) throw profileError

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
            if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password || !formData.confirmPassword) {
                showModal('Required Account Info', 'Please fill in your name and login credentials to continue.', 'warning')
                return
            }
            if (!formData.email.includes('@')) {
                showModal('Invalid Email', 'Please enter a valid email address.', 'warning')
                return
            }
            if (formData.password.length < 6) {
                showModal('Weak Password', 'Password must be at least 6 characters long.', 'warning')
                return
            }
            if (formData.password !== formData.confirmPassword) {
                showModal('Password Mismatch', 'Passwords do not match.', 'warning')
                return
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
                            const { data: existingUser } = await supabase
                                .from('users')
                                .select('id, user_id')
                                .eq('email', formData.email)
                                .maybeSingle()
                            
                            if (existingUser) {
                                userId = existingUser.id
                                randomLegacyId = existingUser.user_id
                            } else {
                                throw signupError
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

                // 2. Ensure record in 'users' table with 'mentor' role
                const { error: userError } = await supabase
                    .from('users')
                    .upsert({
                        id: userId,
                        user_id: randomLegacyId,
                        email: formData.email,
                        phone_number: formData.phone,
                        role: 'mentor',
                        password: formData.password
                    }, { onConflict: 'id' })

                if (userError) throw userError

                setAuthUserId(userId)
                setLegacyId(randomLegacyId)
                localStorage.setItem('auth_id', randomLegacyId)
                localStorage.setItem('auth_user_role', 'mentor')
                storeAuthData({ id: userId, role: 'mentor' })

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
                showModal('Profile Incomplete', 'Please provide your location, title, and bio to continue.', 'warning')
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
                        <p className="step-subtitle">Create your mentor account credentials.</p>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>Full Name <span className="required-star">*</span></label>
                                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Full Name" required />
                            </div>
                            <div className="input-group">
                                <label>Email Address <span className="required-star">*</span></label>
                                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your@email.com" required />
                            </div>
                            <div className="input-group">
                                <label>Phone Number <span className="required-star">*</span></label>
                                <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+1 234 567 890" required />
                            </div>
                            <div className="input-group">
                                <label>Password <span className="required-star">*</span></label>
                                <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Min 6 characters" required />
                            </div>
                            <div className="input-group">
                                <label>Confirm Password <span className="required-star">*</span></label>
                                <input type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder="Re-enter password" required />
                            </div>
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
                        <h2 className="step-title">Course Ready to Offer</h2>
                        <p className="step-subtitle">Select the programs you are prepared to mentor students in.</p>
                        <div className="course-grid-selector onboarding-grid">
                            {loadingCourses ? <Loading size="40px" /> : (
                                availableCourses.map(course => (
                                    <button
                                        key={course.course_id}
                                        type="button"
                                        className={`course-selection-card ${formData.coursesOffered.includes(String(course.course_id)) ? 'active' : ''}`}
                                        onClick={() => toggleArrayItem('coursesOffered', String(course.course_id))}
                                    >
                                        <div className="course-title-mini">{course.title}</div>
                                        <div className="selection-indicator">
                                            {formData.coursesOffered.includes(String(course.course_id)) ? '✓ Ready' : 'Add Course'}
                                        </div>
                                    </button>
                                ))
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
                    <button
                        type="button"
                        className="onboarding-back-btn"
                        onClick={prevStep}
                        style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                    >
                        Back
                    </button>
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
        </div>
    )
}
