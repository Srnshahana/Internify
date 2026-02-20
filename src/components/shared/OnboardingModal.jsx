
import React, { useState } from 'react'
import supabase from '../../supabaseClient'
import Loading from '../Loading'
import '../../App.css'

const OnboardingModal = ({ user, profile, onComplete, onClose }) => {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [formData, setFormData] = useState({
        name: profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || '',
        profile_image: profile?.profile_image || '',
        address: profile?.address || '',
        about: profile?.about || '',
        career_fields: profile?.career_fields || [],
        education: profile?.education || [{ college: '', degree: '', year: '' }],
        internships: profile?.internships || [{
            company: '',
            job_title: '',
            start_date: '',
            end_date: '',
            location: '',
            description: ''
        }],
        projects: profile?.project || [{ title: '', description: '', link: '' }],
        skills: profile?.skills || [],
        certifications: profile?.certifications || [{
            certificate_name: '',
            issuer: '',
            issued_date: '',
            credential_id: '',
            verified: false
        }]
    })

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploadingImage(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Math.random()}.${fileExt}`
            const filePath = `profile-avatars/${fileName}`

            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, profile_image: publicUrl }))
        } catch (error) {
            console.error('Error uploading image:', error.message)
            alert('Error uploading image!')
        } finally {
            setUploadingImage(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleArrayChange = (category, index, field, value) => {
        const updatedArray = [...formData[category]]
        updatedArray[index] = { ...updatedArray[index], [field]: value }
        setFormData(prev => ({ ...prev, [category]: updatedArray }))
    }

    const addArrayItem = (category, template) => {
        setFormData(prev => ({ ...prev, [category]: [...prev[category], template] }))
    }

    const removeArrayItem = (category, index) => {
        setFormData(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }))
    }

    const handleTagToggle = (category, value) => {
        setFormData(prev => {
            const current = prev[category] || []
            if (current.includes(value)) {
                return { ...prev, [category]: current.filter(item => item !== value) }
            } else {
                return { ...prev, [category]: [...current, value] }
            }
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const authId = localStorage.getItem('auth_id')

            const { error } = await supabase
                .from('student_details')
                .upsert({
                    student_id: user.id,
                    name: formData.name,
                    profile_image: formData.profile_image,
                    address: formData.address,
                    about: formData.about,
                    career_fields: formData.career_fields,
                    education: formData.education,
                    internships: formData.internships,
                    project: formData.projects,
                    skills: formData.skills,
                    certifications: formData.certifications,
                    onboarding_completed: true
                })

            if (error) throw error
            onComplete()
        } catch (error) {
            console.error('Error saving onboarding data:', error)
            alert('Failed to save data. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="onboarding-step fade-in">
                        <h2 className="onboarding-title">Let's build your profile</h2>
                        <p className="onboarding-subtitle">Tell us about yourself and your career interests.</p>

                        <div className="onboarding-profile-upload-section">
                            <div className="onboarding-avatar-preview">
                                {formData.profile_image ? (
                                    <img src={formData.profile_image} alt="Profile Preview" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                )}
                                {uploadingImage && <div className="avatar-upload-overlay"><Loading /></div>}
                            </div>
                            <div className="upload-controls">
                                <label className="onboarding-upload-btn">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} hidden />
                                    {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                                </label>
                                <p className="upload-hint">JPG, PNG or SVG. Max 2MB.</p>
                            </div>
                        </div>

                        <div className="onboarding-form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: John Doe"
                                className="onboarding-input"
                            />
                        </div>
                        <div className="onboarding-form-group">
                            <label>Location / Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Ex: New York, USA"
                                className="onboarding-input"
                            />
                        </div>
                        <div className="onboarding-form-group">
                            <label>About You</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                placeholder="A brief summary of your background and goals..."
                                className="onboarding-textarea"
                            />
                        </div>
                        <div className="onboarding-form-group">
                            <label>Career Fields (Select all that apply)</label>
                            <div className="onboarding-tags-container">
                                {['Marketing', 'Content Creation', 'Development', 'Design', 'Management'].map(field => (
                                    <button
                                        key={field}
                                        type="button"
                                        className={`onboarding-tag ${formData.career_fields.includes(field) ? 'active' : ''}`}
                                        onClick={() => handleTagToggle('career_fields', field)}
                                    >
                                        {field}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="onboarding-step fade-in">
                        <h2 className="onboarding-title">Academic Background</h2>
                        <p className="onboarding-subtitle">Add your university or college details.</p>
                        {formData.education.map((edu, idx) => (
                            <div key={idx} className="onboarding-repeatable-card">
                                {idx > 0 && <button className="remove-item-btn" onClick={() => removeArrayItem('education', idx)}>×</button>}
                                <input
                                    type="text"
                                    placeholder="College / University Name"
                                    value={edu.college}
                                    onChange={(e) => handleArrayChange('education', idx, 'college', e.target.value)}
                                    className="onboarding-input"
                                />
                                <div className="onboarding-input-row">
                                    <input
                                        type="text"
                                        placeholder="Degree (e.g. BBA Marketing)"
                                        value={edu.degree}
                                        onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)}
                                        className="onboarding-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Graduation Year"
                                        value={edu.year}
                                        onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)}
                                        className="onboarding-input"
                                    />
                                </div>
                            </div>
                        ))}
                        <button className="onboarding-add-btn" onClick={() => addArrayItem('education', { college: '', degree: '', year: '' })}>
                            + Add another education
                        </button>
                    </div>
                )
            case 3:
                return (
                    <div className="onboarding-step fade-in">
                        <h2 className="onboarding-title">Internships & Professional Experience</h2>
                        <p className="onboarding-subtitle">List your previous roles and internships.</p>
                        {formData.internships.map((intern, idx) => (
                            <div key={idx} className="onboarding-repeatable-card">
                                {idx > 0 && <button className="remove-item-btn" onClick={() => removeArrayItem('internships', idx)}>×</button>}
                                <input
                                    type="text"
                                    placeholder="Job Title"
                                    value={intern.job_title}
                                    onChange={(e) => handleArrayChange('internships', idx, 'job_title', e.target.value)}
                                    className="onboarding-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={intern.company}
                                    onChange={(e) => handleArrayChange('internships', idx, 'company', e.target.value)}
                                    className="onboarding-input"
                                />
                                <div className="onboarding-input-row">
                                    <input
                                        type="text"
                                        placeholder="Start Date"
                                        value={intern.start_date}
                                        onChange={(e) => handleArrayChange('internships', idx, 'start_date', e.target.value)}
                                        className="onboarding-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="End Date"
                                        value={intern.end_date}
                                        onChange={(e) => handleArrayChange('internships', idx, 'end_date', e.target.value)}
                                        className="onboarding-input"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Location (e.g. San Francisco, CA)"
                                    value={intern.location}
                                    onChange={(e) => handleArrayChange('internships', idx, 'location', e.target.value)}
                                    className="onboarding-input"
                                />
                                <textarea
                                    placeholder="Description of your responsibilities..."
                                    value={intern.description}
                                    onChange={(e) => handleArrayChange('internships', idx, 'description', e.target.value)}
                                    className="onboarding-textarea"
                                />
                            </div>
                        ))}
                        <button className="onboarding-add-btn" onClick={() => addArrayItem('internships', { company: '', job_title: '', start_date: '', end_date: '', location: '', description: '' })}>
                            + Add another experience
                        </button>
                    </div>
                )
            case 4:
                return (
                    <div className="onboarding-step fade-in">
                        <h2 className="onboarding-title">Skills & Projects</h2>
                        <p className="onboarding-subtitle">Tell us what you're good at and show your work.</p>

                        <div className="onboarding-form-group">
                            <label>Skills</label>
                            <div className="onboarding-tags-container">
                                {['Digital Marketing', 'SEO', 'Content Creation', 'React', 'Node.js', 'UI/UX Design'].map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        className={`onboarding-tag ${formData.skills.includes(skill) ? 'active' : ''}`}
                                        onClick={() => handleTagToggle('skills', skill)}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="onboarding-form-group">
                            <label>Projects</label>
                            {formData.projects.map((proj, idx) => (
                                <div key={idx} className="onboarding-repeatable-card">
                                    {idx > 0 && <button className="remove-item-btn" onClick={() => removeArrayItem('projects', idx)}>×</button>}
                                    <input
                                        type="text"
                                        placeholder="Project Title"
                                        value={proj.title}
                                        onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)}
                                        className="onboarding-input"
                                    />
                                    <textarea
                                        placeholder="Description of the project..."
                                        value={proj.description}
                                        onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)}
                                        className="onboarding-textarea"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Project Link"
                                        value={proj.link}
                                        onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)}
                                        className="onboarding-input"
                                    />
                                </div>
                            ))}
                            <button className="onboarding-add-btn" onClick={() => addArrayItem('projects', { title: '', description: '', link: '' })}>
                                + Add another project
                            </button>
                        </div>

                        <div className="onboarding-form-group">
                            <label>Certifications</label>
                            {formData.certifications.map((cert, idx) => (
                                <div key={idx} className="onboarding-repeatable-card">
                                    {idx > 0 && <button className="remove-item-btn" onClick={() => removeArrayItem('certifications', idx)}>×</button>}
                                    <input
                                        type="text"
                                        placeholder="Certificate Name"
                                        value={cert.certificate_name}
                                        onChange={(e) => handleArrayChange('certifications', idx, 'certificate_name', e.target.value)}
                                        className="onboarding-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Issuer (e.g. Google, Internify)"
                                        value={cert.issuer}
                                        onChange={(e) => handleArrayChange('certifications', idx, 'issuer', e.target.value)}
                                        className="onboarding-input"
                                    />
                                    <div className="onboarding-input-row">
                                        <input
                                            type="text"
                                            placeholder="Issued Date"
                                            value={cert.issued_date}
                                            onChange={(e) => handleArrayChange('certifications', idx, 'issued_date', e.target.value)}
                                            className="onboarding-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Credential ID"
                                            value={cert.credential_id}
                                            onChange={(e) => handleArrayChange('certifications', idx, 'credential_id', e.target.value)}
                                            className="onboarding-input"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button className="onboarding-add-btn" onClick={() => addArrayItem('certifications', { certificate_name: '', issuer: '', issued_date: '', credential_id: '', verified: false })}>
                                + Add another certification
                            </button>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="onboarding-step fade-in">
                        <h2 className="onboarding-title">Final Review</h2>
                        <p className="onboarding-subtitle">Check your details before finishing.</p>

                        <div className="onboarding-summary-container">
                            <section className="summary-section profile-summary-row">
                                <div className="summary-avatar">
                                    <img src={formData.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0ea5e9&color=fff`} alt="Profile" />
                                </div>
                                <div className="summary-profile-info">
                                    <p><strong>Name:</strong> {formData.name}</p>
                                    <p><strong>Location:</strong> {formData.address}</p>
                                </div>
                                <div className="summary-tags">
                                    {formData.career_fields.map(f => <span key={f} className="summary-tag">{f}</span>)}
                                </div>
                            </section>

                            <section className="summary-section">
                                <h3>Academic</h3>
                                {formData.education.map((edu, i) => (
                                    <div key={i} className="summary-item">
                                        <p><strong>{edu.college}</strong></p>
                                        <p>{edu.degree} • {edu.year}</p>
                                    </div>
                                ))}
                            </section>

                            <section className="summary-section">
                                <h3>Experience</h3>
                                {formData.internships.map((intern, i) => (
                                    <div key={i} className="summary-item">
                                        <p><strong>{intern.job_title}</strong> at {intern.company}</p>
                                        <p className="small-text">{intern.start_date} - {intern.end_date}</p>
                                        <p className="small-text">{intern.location}</p>
                                    </div>
                                ))}
                            </section>

                            <section className="summary-section">
                                <h3>Skills & Projects</h3>
                                <div className="summary-tags">
                                    {formData.skills.map(s => <span key={s} className="summary-tag">{s}</span>)}
                                </div>
                                {formData.projects.map((proj, i) => (
                                    <div key={i} className="summary-item">
                                        <p><strong>{proj.title}</strong></p>
                                        {proj.link && <p className="small-link">{proj.link}</p>}
                                    </div>
                                ))}
                            </section>

                            <section className="summary-section">
                                <h3>Certifications</h3>
                                {formData.certifications.map((cert, i) => (
                                    <div key={i} className="summary-item">
                                        <p><strong>{cert.certificate_name}</strong></p>
                                        <p className="small-text">Issued by: {cert.issuer} ({cert.issued_date})</p>
                                    </div>
                                ))}
                            </section>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-modal-v2">
                <button className="onboarding-close-btn" onClick={onClose} aria-label="Close modal">×</button>
                <div className="onboarding-progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>

                <div className="onboarding-content">
                    {renderStep()}
                </div>

                <div className="onboarding-footer">
                    {step > 1 && (
                        <button className="onboarding-btn-secondary" onClick={() => setStep(step - 1)}>
                            Back
                        </button>
                    )}
                    {step < 5 ? (
                        <button className="onboarding-btn-primary" onClick={() => setStep(step + 1)}>
                            Next Step
                        </button>
                    ) : (
                        <button className="onboarding-btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Finish Onboarding'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OnboardingModal
