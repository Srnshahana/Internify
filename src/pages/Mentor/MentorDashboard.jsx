import { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import StudentAppBar from '../../components/shared/StudentAppBar.jsx'
import Home from './Home.jsx'
import Calendar from './Calendar.jsx'
import Profile from './Profile.jsx'
import Notification from './Notification.jsx'
import MyCourses from './MyCourses.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, ClassroomIcon } from '../../components/Icons.jsx'
import '../../App.css'

import { DashboardDataProvider, useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function ApprovalPendingView({ onLogout }) {
  return (
    <div className="approval-status-screen">
      <div className="approval-status-card glass-morphism">
        <div className="status-icon-wrapper pending">
          <span className="material-symbols-outlined">schedule</span>
        </div>
        <h2>Application Under Review</h2>
        <p>Your mentor profile has been successfully submitted! Our team is currently reviewing your expertise and certifications. You'll receive full access once verified.</p>

        <div className="status-badge pending">
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>sync_saved_locally</span>
          Status: Pending Review
        </div>

        <div className="status-footer">
          <span>Expected review time: 24-48 hours</span>
          <span>We'll notify you via email once approved.</span>
        </div>

        <button onClick={onLogout} className="status-logout-btn">
          Sign Out of Account
        </button>
      </div>
    </div>
  )
}

function ApprovalRejectedView({ onLogout }) {
  return (
    <div className="approval-status-screen">
      <div className="approval-status-card glass-morphism">
        <div className="status-icon-wrapper rejected">
          <span className="material-symbols-outlined">error</span>
        </div>
        <h1>Application Not Approved</h1>
        <p>Thank you for your interest in joining Internify. After careful review, we are unable to approve your mentor application at this time.</p>

        <div className="status-badge rejected">
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>cancel</span>
          Status: Not Approved
        </div>

        <div className="status-footer">
          <span>If you believe this is a mistake, please reach out.</span>
          <span>Contact: support@internify.com</span>
        </div>

        <button onClick={onLogout} className="status-logout-btn">
          Sign Out
        </button>
      </div>
    </div>
  )
}

function DashboardContent({ onLogout, activePage, setActivePage, isLiveClassroomActive, setIsLiveClassroomActive, isCourseDetailActive, setIsCourseDetailActive, navItems }) {
  const { loading, mentorshipEnrollments, userProfile } = useDashboardData()

  if (loading) {
    return <Loading fullScreen={true} />
  }

  // Approval logic check: handle boolean true/false and string approved/pending/rejected
  const approvalValue = userProfile?.is_mentor_approved
  const isApproved = approvalValue === true || (typeof approvalValue === 'string' && approvalValue.toLowerCase() === 'approved')
  const isRejected = typeof approvalValue === 'string' && approvalValue.toLowerCase() === 'rejected'

  const renderPage = (page) => {
    switch (page) {
      case 'Home':
        return (
          <Home
            onNavigate={setActivePage}
            setIsCourseDetailActive={setIsCourseDetailActive}
            onEnterClassroom={() => setIsLiveClassroomActive(true)}
            setIsLiveClassroomActive={setIsLiveClassroomActive}
          />
        )
      case 'Classrooms':
        return (
          <MyCourses
            courses={mentorshipEnrollments}
            onBack={() => setActivePage('Home')}
            onEnterClassroom={() => setIsLiveClassroomActive(true)}
            setIsCourseDetailActive={setIsCourseDetailActive}
            setIsLiveClassroomActive={setIsLiveClassroomActive}
            onNavigate={setActivePage}
          />
        )
      case 'Calendar':
        return <Calendar />
      case 'Profile':
        return <Profile onLogout={onLogout} />
      case 'Notification':
        return <Notification />
      default:
        return <Home onNavigate={setActivePage} setIsCourseDetailActive={setIsCourseDetailActive} onEnterClassroom={() => setIsLiveClassroomActive(true)} />
    }
  }

  return (
    <div className={`dashboard-layout-new ${isLiveClassroomActive ? 'live-classroom-active' : ''}`}>
      {!isApproved && (
        <div className="approval-status-modal">
          {isRejected ? <ApprovalRejectedView onLogout={onLogout} /> : <ApprovalPendingView onLogout={onLogout} />}
        </div>
      )}
      {!isLiveClassroomActive && !isCourseDetailActive && isApproved && (
        <>
          {/* Bottom Navigation Bar */}
          <nav className="premium-bottom-nav">
            <div className="bottom-nav-container">
              {/* Sliding Glass Highlight */}
              <div
                className="nav-glass-highlight"
                style={{
                  transform: `translateX(${navItems.findIndex(item => item.id === activePage) * 100}%)`
                }}
              />

              {navItems.map((item) => {
                const IconComponent = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActivePage(item.id)}
                  >
                    <div className="nav-icon-wrapper">
                      <IconComponent />
                    </div>
                    <span className="nav-label">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Top Header */}
          {activePage !== 'Profile' && activePage !== 'Home' && activePage !== 'Classrooms' && activePage !== 'Calendar' && (
            <StudentAppBar onLogout={onLogout} />
          )}
        </>
      )}

      <main className="dashboard-main-new">
        <div
          className={`dashboard-content-new ${activePage === 'Profile' ? 'student-profile-no-padding' : ''}`}
          style={(activePage === 'Home' || activePage === 'Classrooms' || activePage === 'Calendar') ? { padding: 0, maxWidth: '100%' } : {}}
        >
          {renderPage(activePage)}
        </div>
      </main>
    </div>
  )
}

function MentorDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Home')
  const [isLiveClassroomActive, setIsLiveClassroomActive] = useState(false)
  const [isCourseDetailActive, setIsCourseDetailActive] = useState(false)
  const [theme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('dashboard-theme', 'light')
  }, [])

  const navItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Classrooms', label: 'Classrooms', icon: ClassroomIcon },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Profile', label: 'Profile', icon: ProfileIcon },
  ]

  return (
    <DashboardDataProvider>
      <style>{`
        @keyframes spinner {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <DashboardContent
        onLogout={onLogout}
        activePage={activePage}
        setActivePage={setActivePage}
        isLiveClassroomActive={isLiveClassroomActive}
        setIsLiveClassroomActive={setIsLiveClassroomActive}
        isCourseDetailActive={isCourseDetailActive}
        setIsCourseDetailActive={setIsCourseDetailActive}
        navItems={navItems}
      />
    </DashboardDataProvider>
  )
}

export default MentorDashboard
