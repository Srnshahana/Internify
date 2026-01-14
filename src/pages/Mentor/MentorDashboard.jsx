import { useState, useEffect } from 'react'
import StudentAppBar from '../../components/shared/StudentAppBar.jsx'
import Home from './Home.jsx'
import Calendar from './Calendar.jsx'
import Profile from './Profile.jsx'
import Notification from './Notification.jsx'
import MyCourses from './MyCourses.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, ClassroomIcon } from '../../components/Icons.jsx'
import '../../App.css'

function MentorDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Home')
  const [isLiveClassroomActive, setIsLiveClassroomActive] = useState(false)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('dashboard-theme')
    return savedTheme || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const navItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Classrooms', label: 'Classrooms', icon: ClassroomIcon },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Profile', label: 'Profile', icon: ProfileIcon },
  ]

  const renderPage = (page, setPage) => {
    switch (page) {
      case 'Home':
        return <Home onNavigate={(pageName) => setActivePage(pageName)} />
      case 'Classrooms':
        return <MyCourses />
      case 'Calendar':
        return <Calendar />
      case 'Profile':
        return <Profile />
      case 'Notification':
        return <Notification />
      default:
        return <Home onNavigate={(pageName) => setActivePage(pageName)} />
    }
  }

  return (
    <div className={`dashboard-layout-new ${isLiveClassroomActive ? 'live-classroom-active' : ''}`}>
      {!isLiveClassroomActive && (
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
          {activePage !== 'Profile' && <StudentAppBar onLogout={onLogout} />}
        </>
      )}

      <main className="dashboard-main-new">
        <div className={`dashboard-content-new ${activePage === 'Profile' ? 'student-profile-no-padding' : ''}`}>
          {renderPage(activePage, setActivePage)}
        </div>
      </main>
    </div>
  )
}

export default MentorDashboard
