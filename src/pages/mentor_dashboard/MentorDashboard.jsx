import { useState, useEffect } from 'react'
import Home from './Home.jsx'
import Calendar from './Calendar.jsx'
import Profile from './Profile.jsx'
import Notification from './Notification.jsx'
import Students from './Students.jsx'
import Earnings from './Earnings.jsx'
import Assessments from './Assessments.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, NotificationIcon, LogoutIcon, SunIcon, MoonIcon, SettingsIcon, SearchIcon, GridIcon, FolderIcon } from '../../components/Icons.jsx'
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

  const sidebarMenuItems = [
    { id: 'Home', icon: HomeIcon },
    { id: 'Calendar', icon: CalendarIcon },
    { id: 'Students', icon: ProfileIcon },
    { id: 'Assessments', icon: FolderIcon },
    { id: 'Earnings', icon: GridIcon },
    { id: 'Profile', icon: SettingsIcon },
  ]

  const renderPage = (page, setPage) => {
    switch (page) {
      case 'Home':
        return <Home onNavigate={(pageName) => setActivePage(pageName)} />
      case 'Calendar':
        return <Calendar />
      case 'Students':
        return <Students />
      case 'Assessments':
        return <Assessments onBack={() => setActivePage('Home')} />
      case 'Earnings':
        return <Earnings />
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
          {/* Left Sidebar Navigation */}
          <aside className="dashboard-sidebar-premium">
            <div className="sidebar-nav-top">
              <button className="sidebar-nav-logo-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
            <nav className="sidebar-nav-menu">
              {sidebarMenuItems.map((item) => {
                const IconComponent = item.icon
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActivePage(item.id)}
                    title={item.id}
                  >
                    <IconComponent />
                  </button>
                )
              })}
            </nav>
            <div className="sidebar-nav-bottom">
              <button className="sidebar-nav-item" onClick={onLogout} title="Logout">
                <LogoutIcon />
              </button>
            </div>
          </aside>

          {/* Top Header */}
          <header className="dashboard-header-new">
            <div className="header-left">
              <div className="brand-new">
                <span>Internify.</span>
              </div>
            </div>

            <div className="header-center">
              <div className="header-search">
                <SearchIcon />
                <input type="text" placeholder="Search" className="search-input" />
              </div>
            </div>

            <div className="header-right">
              <button
                className="header-icon-btn"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                className="header-icon-btn"
                onClick={() => setActivePage('Notification')}
                title="Notifications"
              >
                <NotificationIcon />
              </button>
              <button
                className="header-avatar-btn"
                title="Profile"
                onClick={() => setActivePage('Profile')}
              >
                <div className="avatar-circle">A</div>
              </button>
            </div>
          </header>
        </>
      )}

      <main className="dashboard-main-new">
        <div className={`dashboard-content-new ${activePage !== 'Home' && activePage !== 'Calendar' ? 'mentor-page-no-padding' : ''}`}>
          {renderPage(activePage, setActivePage)}
        </div>
      </main>
    </div>
  )
}

export default MentorDashboard
