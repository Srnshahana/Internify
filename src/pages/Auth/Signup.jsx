import { useState } from 'react'
import '../../App.css'
import supabase from '../../supabaseClient.js'
import { storeAuthData } from '../../utils/auth.js'

function Signup({ onBack, onSignup }) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields')
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            setError('Password should be at least 6 characters')
            setIsLoading(false)
            return
        }

        // 1️⃣ Supabase Auth signup
        const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        })

        if (signupError) {
            console.error('Signup error:', signupError)
            setError(signupError.message)
            setIsLoading(false)
            return
        }

        const userId = data.user.id // ✅ use auth user id

        // 2️⃣ Insert into user table
        const { error: insertError } = await supabase
            .from('users')
            .insert({
                // id: '15',               // ✅ REQUIRED (uuid)
                // name: fullName,
                user_id: 15,
                email: email,
                role: 'student',
                phone_number: '1234567890',
                password: password,
            })

        setIsLoading(false)

        if (insertError) {
            console.error('Insert error:', insertError)
            setError(insertError.message)
            return
        }

        // Store auth data with role (defaults to 'student' for new signups)
        storeAuthData({ id: userId, role: 'student' })

        // Pass user with role to onSignup callback
        onSignup?.({
            ...data.user,
            role: 'student'
        })
    }

    return (
        <div className="login-page-premium">
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
                            {error && <div className="error-message-modern">{error}</div>}

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


