import { useState } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient.js'
import { storeAuthData } from '../../utils/auth.js'
import MessageModal from '../../components/shared/MessageModal' // Import Modal

function Signup({ onBack, onSignup }) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalMessage, setModalMessage] = useState('')
    const [modalType, setModalType] = useState('info') // 'success' or 'error' or 'info'
    const [pendingAction, setPendingAction] = useState(null) // Callback after modal closes

    const showModal = (title, message, type = 'info', action = null) => {
        setModalTitle(title)
        setModalMessage(message)
        setModalType(type)
        setPendingAction(() => action)
        setModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
        if (pendingAction) {
            pendingAction()
            setPendingAction(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (!fullName || !email || !password || !confirmPassword) {
            showModal('Missing Information', 'Please fill in all fields.', 'error')
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            showModal('Password Mismatch', 'Passwords do not match.', 'error')
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            showModal('Weak Password', 'Password should be at least 6 characters.', 'error')
            setIsLoading(false)
            return
        }

        // 1️⃣ Supabase Auth signup
        const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name: fullName },
            },
        })

        if (signupError) {
            console.error('Signup error:', signupError)
            showModal('Signup Failed', signupError.message, 'error')
            setIsLoading(false)
            return
        }

        const userId = data.user.id // ✅ use auth user id

        const role = fullName === 'Mentor Test' ? 'mentor' : 'student'

        // 2️⃣ Insert into user table
        const { error: insertError } = await supabase
            .from('users')
            .insert({
                id: userId,               // ✅ REQUIRED (Supabase Auth UUID)
                // name: fullName,
                user_id: Math.floor(100000 + Math.random() * 900000), // Random integer for legacy column
                email: email,
                role: role,
                phone_number: '1234567890',
                password: password,
            })

        setIsLoading(false)

        if (insertError) {
            console.error('Insert error:', insertError)
            showModal('Database Error', insertError.message, 'error')
            return
        }

        // Store auth data with role
        storeAuthData({ id: userId, role: role })

        // Show success modal, then trigger navigation on close/confirm
        showModal(
            'Welcome to Internify!',
            'Your account has been created successfully. Click continue to go to your dashboard.',
            'success',
            () => {
                onSignup?.({
                    ...data.user,
                    role: role
                })
            }
        )
    }

    return (
        <div className="login-page-premium">
            <MessageModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                onConfirm={pendingAction}
            />

            <div className="login-premium-container">
                {/* Left Side - Visual */}
                <div className="login-premium-visual">
                    <div className="login-premium-overlay"></div>
                    <div className="login-premium-brand">
                        <span>Internify.</span>
                    </div>
                    <div className="login-premium-text">
                        <h2>Join our community.</h2>
                        <p>Start your journey with expert mentorship and accelerate your career growth.</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="login-premium-form-container">
                    <button className="back-button-simple" onClick={onBack}>
                        ← Back
                    </button>

                    <div className="login-premium-form-content">
                        <div className="login-premium-header">
                            <h1>Create Account</h1>
                            <p>Sign up to get started with Internify.</p>
                        </div>

                        <form className="login-form-modern" onSubmit={handleSubmit}>
                            {/* Error message removed */}

                            <div className="form-group-modern">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Your Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="form-group-modern">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="form-group-modern">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-wrapper-modern">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-modern"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group-modern">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="form-options-modern">
                                <label className="remember-me-modern">
                                    <input type="checkbox" required />
                                    <span>I agree to the Terms & Privacy</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="login-button-modern"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup


