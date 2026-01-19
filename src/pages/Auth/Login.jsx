import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'
import supabase from '../../supabaseClient.js'
import { fetchUserRole, storeAuthData } from '../../utils/auth.js'

function Login({ onBack, onShowSignup }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const theme = document.documentElement.getAttribute('data-theme') || 'dark'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // 1️⃣ Log in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });

    setIsLoading(false);

    console.log('Supabase Auth Response:', authData);
    console.log('Supabase Auth Error:', authError);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (!authData.user) {
      setError('User not found');
      return;
    }

    // 2️⃣ Fetch the app-specific role from users table
    const role = await fetchUserRole(authData.user.email);
    console.log('User role:', role)

    if (!role) {
      setError('Failed to fetch user role');
      return;
    }

    // 3️⃣ Store auth data
    storeAuthData({ id: authData.user.id, role });

    // 4️⃣ Check for pending course purchase and navigate
    const pendingCourse = sessionStorage.getItem('pendingCourse')
    console.log('Checking for pending course:', pendingCourse)

    if (pendingCourse) {
      // Clear the pending course and navigate to payment
      const course = JSON.parse(pendingCourse)
      console.log('Found pending course, navigating to payment:', course)
      sessionStorage.removeItem('pendingCourse')
      navigate('/payment', { state: { course } })
    } else {
      // No pending purchase - navigate to dashboard
      console.log('No pending course, navigating to dashboard')
      if (role === 'mentor') {
        navigate('/mentor-dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  };
  return (
    <div className="login-page-premium">
      <div className="login-premium-container">
        {/* Left Side - Image/Brand */}
        <div className="login-premium-visual">
          <div className="login-premium-overlay"></div>
          <div className="login-premium-brand">
            <span>Internify.</span>
          </div>
          <div className="login-premium-text">
            <h2>Start your journey today.</h2>
            <p>Connect with mentors, build your skills, and land your dream job.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-premium-form-container">
          <button className="back-button-simple" onClick={onBack}>
            ← Back
          </button>

          <div className="login-premium-form-content">
            <div className="login-premium-header">
              <h1>Welcome Back</h1>
              <p>Please enter your details to sign in.</p>
            </div>

            <form className="login-form-modern" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message-modern">
                  {error}
                </div>
              )}

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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-modern"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options-modern">
                <label className="remember-me-modern">
                  <input type="checkbox" />
                  <span>Remember for 30 days</span>
                </label>
                <a href="#" className="forgot-password-modern">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="login-button-modern"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="social-login-divider">
                <span>Or continue with</span>
              </div>

              <div className="social-login-modern">
                <button
                  className="social-button-modern"
                  onClick={(e) => {
                    e.preventDefault()
                    if (onLogin) onLogin({ email: 'google@example.com', password: 'google' })
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
                  Google
                </button>
                <button
                  className="social-button-modern"
                  onClick={(e) => {
                    e.preventDefault()
                    if (onLogin) onLogin({ email: 'github@example.com', password: 'github' })
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </button>
              </div>
            </form>

            <div className="login-footer-modern">
              Don't have an account?{' '}
              <button
                type="button"
                className="signup-link-modern"
                onClick={(e) => {
                  e.preventDefault()
                  if (onShowSignup) onShowSignup()
                }}
              >
                Sign up for free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
