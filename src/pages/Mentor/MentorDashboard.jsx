import { useState, useEffect } from 'react'
import StudentAppBar from '../../components/shared/StudentAppBar.jsx'
import Home from './Home.jsx'
import Calendar from './Calendar.jsx'
import Profile from './Profile.jsx'
import Notification from './Notification.jsx'
import MyCourses from './MyCourses.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, ClassroomIcon } from '../../components/Icons.jsx'
import '../../App.css'

import { DashboardDataProvider, useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function DashboardContent({ onLogout, activePage, setActivePage, isLiveClassroomActive, setIsLiveClassroomActive, isCourseDetailActive, setIsCourseDetailActive, navItems }) {
  const { loading, enrolledCourses } = useDashboardData()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#eff9ff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e0f2fe',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '50%',
            animation: 'spinner 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#0ea5e9', fontSize: '16px', fontWeight: 500 }}>Loading mentor dashboard...</p>
        </div>
      </div>
    )
  }

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
            courses={enrolledCourses}
            onBack={() => setActivePage('Home')}
            onEnterClassroom={() => setIsLiveClassroomActive(true)}
            setIsCourseDetailActive={setIsCourseDetailActive}
            setIsLiveClassroomActive={setIsLiveClassroomActive}
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
      {!isLiveClassroomActive && !isCourseDetailActive && (
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
          style={(activePage === 'Home' || activePage === 'Classrooms') ? { padding: 0, maxWidth: '100%' } : {}}
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
