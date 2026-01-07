import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function ApplyMentor() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedin: '',
        experience: '',
        role: '',
        company: '',
        bio: '',
        skills: '',
        expertise: 'Engineering'
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.firstName) newErrors.firstName = 'First name is required'
        if (!formData.lastName) newErrors.lastName = 'Last name is required'
        if (!formData.email) newErrors.email = 'Email is required'
        if (!formData.linkedin) newErrors.linkedin = 'LinkedIn profile is required'

        if (!formData.experience) {
            newErrors.experience = 'Years of experience is required'
        } else if (parseInt(formData.experience) < 5) {
            newErrors.experience = 'Minimum 5 years of experience is required to be a mentor'
        }

        if (!formData.role) newErrors.role = 'Current role is required'
        if (!formData.company) newErrors.company = 'Current company is required'
        if (!formData.bio) newErrors.bio = 'Bio is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            alert('Application submitted successfully! We will review your profile and get back to you.')
            navigate('/')
        }, 1500)
    }

    return (
        <div className="page apply-mentor-page">
            <div className="apply-mentor-container">
                <button className="back-button" onClick={() => navigate('/')}>← Back to Home</button>

                <div className="apply-mentor-header">
                    <h1>Apply as a Mentor</h1>
                    <p>Join our community of world-class mentors and help shape the next generation of talent.</p>
                </div>

                <form className="apply-mentor-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Jane"
                                className={errors.firstName ? 'error' : ''}
                            />
                            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className={errors.lastName ? 'error' : ''}
                            />
                            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jane@example.com"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>LinkedIn Profile URL</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/janedoe"
                            className={errors.linkedin ? 'error' : ''}
                        />
                        {errors.linkedin && <span className="error-text">{errors.linkedin}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Current Role</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Senior Software Engineer"
                                className={errors.role ? 'error' : ''}
                            />
                            {errors.role && <span className="error-text">{errors.role}</span>}
                        </div>
                        <div className="form-group">
                            <label>Current Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Tech Corp Inc."
                                className={errors.company ? 'error' : ''}
                            />
                            {errors.company && <span className="error-text">{errors.company}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="5"
                                min="0"
                                className={errors.experience ? 'error' : ''}
                            />
                            {errors.experience && <span className="error-text">{errors.experience}</span>}
                        </div>
                        <div className="form-group">
                            <label>Area of Expertise</label>
                            <select
                                name="expertise"
                                value={formData.expertise}
                                onChange={handleChange}
                            >
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Product">Product</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Leadership">Leadership</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Course you are willing to provide</label>
                        <select
                            name="courseToProvide"
                            value={formData.courseToProvide}
                            onChange={handleChange}
                            className={errors.courseToProvide ? 'error' : ''}
                        >
                            <option value="">Select a course...</option>
                            <option value="Frontend Development">Frontend Development</option>
                            <option value="Backend Development">Backend Development</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Product Management">Product Management</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="Others">Others</option>
                        </select>
                        {errors.courseToProvide && <span className="error-text">{errors.courseToProvide}</span>}
                    </div>

                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, System Design, Leadership"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio / Introduction</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about your professional journey and why you want to mentor..."
                            className={errors.bio ? 'error' : ''}
                            rows={4}
                        />
                        {errors.bio && <span className="error-text">{errors.bio}</span>}
                    </div>

                    <button type="submit" className="submit-application-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    )
}
