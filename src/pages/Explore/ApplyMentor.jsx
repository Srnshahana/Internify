import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient'
import MessageModal from '../../components/shared/MessageModal.jsx'
import Loading from '../../components/Loading'
import '../../App.css'

export default function ApplyMentor() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [availableCourses, setAvailableCourses] = useState([])
    const [loadingCourses, setLoadingCourses] = useState(true)

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    })

    const [formData, setFormData] = useState({
        name: '',
        profile_image: '',
        title: '',
        about: '',
        address: '',
        rating: 8,
        is_verified: true,
        is_platformAssured: false,
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
        // Try to pre-fill name if logged in
        const userName = localStorage.getItem('auth_user_name')
        if (userName) setFormData(prev => ({ ...prev, name: userName }))
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

    const showModal = (title, message, type = 'info') => {
        setModalConfig({ isOpen: true, title, message, type })
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

        const authId = localStorage.getItem('auth_id')

        if (!authId) {
            showModal('Auth Required', 'Please login to submit your mentor application.', 'error')
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare data: ensure experties_in is populated from skills if empty
            const submissionData = {
                ...formData,
                experties_in: formData.experties_in.length > 0 
                    ? formData.experties_in 
                    : formData.skills.filter(s => s.name.trim() !== '').map(s => s.name)
            }

            // 1. Update/Insert Mentor Profile
            const { error: profileError } = await supabase
                .from('mentors_details')
                .upsert({
                    mentor_id: Number(authId),
                    ...submissionData,
                    updated_at: new Date().toISOString()
                })

            if (profileError) throw profileError

            // 2. Update User Role to 'mentor'
            const { error: roleError } = await supabase
                .from('users')
                .update({ role: 'mentor' })
                .eq('id', authId)

            if (roleError) console.warn('Note: Profile saved but role update failed.', roleError)

            showModal('Congratulations!', 'Your mentor profile is now active. Welcome to the team!', 'success')

            localStorage.setItem('auth_user_role', 'mentor')

            setTimeout(() => {
                navigate('/mentor/home')
            }, 2000)

        } catch (err) {
            console.error('Submission Error:', err)
            showModal('Error', 'Failed to save profile: ' + err.message, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name.trim() || !formData.address.trim() || !formData.title.trim() || !formData.about.trim()) {
                showModal('Required Fields', 'Please fill in all basic details to continue.', 'warning')
                return
            }
        }

        if (step === 2) {
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

        if (step === 3) {
            const hasExperience = formData.experience.some(exp => exp.role.trim() !== '' && exp.company.trim() !== '')
            if (!hasExperience) {
                showModal('Experience Required', 'Please add at least one professional experience.', 'warning')
                return
            }
            if (!formData.testimonial[0].from.trim() || !formData.testimonial[0].text.trim()) {
                showModal('Testimonial Required', 'Please provide a featured testimonial.', 'warning')
                return
            }
        }

        if (step === 4) {
            const hasEducation = formData.education.some(edu => edu.degree.trim() !== '' && edu.institution.trim() !== '')
            if (!hasEducation) {
                showModal('Education Required', 'Please add at least one education entry.', 'warning')
                return
            }
        }

        setStep(prev => Math.min(prev + 1, 5))
    }
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div key={step} className="onboarding-step-content fade-in-up">
                        <h2 className="step-title">Tell us about yourself</h2>
                        <p className="step-subtitle">Your basic details and profile appearance.</p>
                        
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Full Name <span className="required-star">*</span></label>
                                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Profile Image URL</label>
                                <input type="url" value={formData.profile_image} onChange={(e) => handleInputChange('profile_image', e.target.value)} placeholder="https://unsplash.com/..." />
                            </div>
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
            case 2:
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
            case 3:
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
                                        <label>End Date</label>
                                        <input type="text" placeholder="Date or 'Present'" value={exp.end_date} onChange={(e) => updateListItem('experience', index, { end_date: e.target.value })} />
                                    </div>
                                    <div className="input-group full-width">
                                        <label>Description</label>
                                        <textarea value={exp.description} onChange={(e) => updateListItem('experience', index, { description: e.target.value })} rows="2" placeholder="Key responsibilities..." />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="input-group full-width mt-20">
                            <label>Featured Testimonial</label>
                            <div className="list-item-card step-card">
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>From (Name)</label>
                                        <input type="text" value={formData.testimonial[0].from} onChange={(e) => {
                                            const newTest = [...formData.testimonial];
                                            newTest[0].from = e.target.value;
                                            setFormData(prev => ({ ...prev, testimonial: newTest }));
                                        }} />
                                    </div>
                                    <div className="input-group">
                                        <label>Designation</label>
                                        <input type="text" value={formData.testimonial[0].title} onChange={(e) => {
                                            const newTest = [...formData.testimonial];
                                            newTest[0].title = e.target.value;
                                            setFormData(prev => ({ ...prev, testimonial: newTest }));
                                        }} placeholder="e.g. Student, CEO" />
                                    </div>
                                    <div className="input-group full-width">
                                        <label>Testimonial Text</label>
                                        <textarea value={formData.testimonial[0].text} onChange={(e) => {
                                            const newTest = [...formData.testimonial];
                                            newTest[0].text = e.target.value;
                                            setFormData(prev => ({ ...prev, testimonial: newTest }));
                                        }} rows="3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 4:
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
                                        <input type="number" value={edu.start_year} onChange={(e) => updateListItem('education', index, { start_year: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>End Year</label>
                                        <input type="number" value={edu.end_year} onChange={(e) => updateListItem('education', index, { end_year: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            case 5:
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
                        <div className="progress-bar-onboarding" style={{ width: `${(step / 5) * 100}%` }}></div>
                    </div>
                    <div className="step-indicator-text">Step {step} of 5</div>
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
                    {step < 5 ? (
                        <button type="button" className="onboarding-next-btn" onClick={nextStep}>
                            Next Step <span className="material-symbols-outlined">arrow_forward</span>
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

