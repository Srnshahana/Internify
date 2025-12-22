import { useState } from 'react'
import './App.css'
import supabase from './supabaseClient'
import { storeAuthData } from './utils/auth.js'

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
          .from('user')
          .insert({
            id: userId,               // ✅ REQUIRED (uuid)
            name: fullName,
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
        <div className="login-page">
            <div className="login-container">
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>

                <div className="login-content">
                    <div className="login-header">
                        <div className="brand">
                            <span>Internify.</span>
                        </div>
                        <h1>Create your account</h1>
                        <p className="login-subtitle">
                            Sign up to start your personalised mentorship journey
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="fullName">Full name</label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Your name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
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
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div> <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm password</label>
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

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" required />
                                <span>I agree to the Terms & Privacy</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="primary login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup


