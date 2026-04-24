import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'
import supabase from '../../supabaseClient.js'
import { fetchUserRole, storeAuthData } from '../../utils/auth.js'
import MessageModal from '../../components/shared/MessageModal.jsx'

function Login({ onBack, onShowSignup, onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const theme = 'light'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showModal('Missing Information', 'Please fill in all fields.', 'error')
      return;
    }

    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (authError) {
        showModal('Login Failed', authError.message, 'error')
        return;
      }

      const role = await fetchUserRole(authData.user.email);
      if (!role) {
        showModal('Role Error', 'Could not determine user role.', 'error')
        return;
      }

      storeAuthData({ id: authData.user.id, role });

      const pendingCourse = sessionStorage.getItem('pendingCourse')
      console.log('Post-login check - role:', role, 'pendingCourse:', pendingCourse)

      if (pendingCourse && role !== 'mentor') {
        const course = JSON.parse(pendingCourse)
        console.log('Redirecting to payment with course:', course)
        sessionStorage.removeItem('pendingCourse')
        navigate('/payment', { state: { course } })
      } else {
        console.log('Navigating to dashboard')
        navigate(role === 'mentor' ? '/mentor-dashboard' : '/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      showModal('Login Error', 'An unexpected error occurred.', 'error')
    } finally {
      setIsLoading(false)
    }
  };

  // Interactive Particle Grid Component for Login Visual
  const InteractiveGrid = () => {
    const canvasRef = useRef(null)
    const mouse = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      let animationFrameId
      let particles = []

      const resize = () => {
        if (!canvas) return
        const rect = canvas.parentNode.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        initParticles()
      }

      const initParticles = () => {
        particles = []
        const gap = 24
        const rows = Math.ceil(canvas.height / gap)
        const cols = Math.ceil(canvas.width / gap)
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            particles.push({
              x: j * gap + gap / 2,
              y: i * gap + gap / 2,
              baseX: j * gap + gap / 2,
              baseY: i * gap + gap / 2,
              size: 1.2,
              density: Math.random() * 20 + 10
            })
          }
        }
      }

      const animate = () => {
        const rect = canvas.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.32)' // Dark particles for light background

        particles.forEach(p => {
          let dx = mouse.current.x - p.x
          let dy = mouse.current.y - p.y
          let distance = Math.sqrt(dx * dx + dy * dy)
          let forceDirectionX = dx / (distance || 1)
          let forceDirectionY = dy / (distance || 1)
          let maxDistance = 100
          let force = (maxDistance - distance) / maxDistance
          let directionX = forceDirectionX * force * p.density
          let directionY = forceDirectionY * force * p.density

          if (distance < maxDistance) {
            p.x -= directionX
            p.y -= directionY
          } else {
            if (p.x !== p.baseX) p.x -= (p.x - p.baseX) / 10
            if (p.y !== p.baseY) p.y -= (p.y - p.baseY) / 10
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fill()
        })
        animationFrameId = requestAnimationFrame(animate)
      }

      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect()
        mouse.current.x = e.clientX - rect.left
        mouse.current.y = e.clientY - rect.top
      }

      const handleMouseLeave = () => {
        mouse.current.x = -1000
        mouse.current.y = -1000
      }

      window.addEventListener('resize', resize)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
      resize()
      animate()

      return () => {
        window.removeEventListener('resize', resize)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
        cancelAnimationFrame(animationFrameId)
      }
    }, [])

    return <canvas ref={canvasRef} />
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
        {/* Left Side - Image/Brand with Interactive Background */}
        <div className="login-premium-visual">
          <InteractiveGrid />
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
              {/* Error message removed */}

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
