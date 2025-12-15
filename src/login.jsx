import { useState } from 'react'
import './App.css'

function Login({ onBack, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const theme = document.documentElement.getAttribute('data-theme') || 'dark'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (onLogin) {
        onLogin({ email, password })
      } else {
        // Default behavior - just go back
        if (onBack) onBack()
      }
    }, 1000)
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
            <h1>Welcome back</h1>
            <p className="login-subtitle">Sign in to continue your learning journey</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="primary login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <a 
                href="#" 
                className="signup-link"
                onClick={(e) => {
                  e.preventDefault()
                  // Sign up also redirects to dashboard
                  if (onLogin) {
                    onLogin({ email: email || 'newuser@example.com', password: 'signedup' })
                  }
                }}
              >
                Sign up
              </a>
            </p>
          </div>

          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button 
              className="social-button"
              onClick={(e) => {
                e.preventDefault()
                if (onLogin) {
                  onLogin({ email: 'google@example.com', password: 'google' })
                }
              }}
            >
              <span>🔵</span>
              Continue with Google
            </button>
            <button 
              className="social-button"
              onClick={(e) => {
                e.preventDefault()
                if (onLogin) {
                  onLogin({ email: 'github@example.com', password: 'github' })
                }
              }}
            >
              <span>🔷</span>
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
