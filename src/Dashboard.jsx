import { useState, useEffect } from 'react'
import Home from './pages/Home.jsx'
import Calendar from './pages/Calendar.jsx'
import Profile from './pages/Profile.jsx'
import Notification from './pages/Notification.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, NotificationIcon, LogoutIcon, SunIcon, MoonIcon } from './components/Icons.jsx'
import './App.css'

function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Home')
  const [isLiveClassroomActive, setIsLiveClassroomActive] = useState(false)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('dashboard-theme')
    return savedTheme || 'light'
  })
  
  // Set theme for dashboard
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const menuItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Profile', label: 'Profile', icon: ProfileIcon },
  ]

  const renderPage = (page, setPage) => {
    switch (page) {
      case 'Home':
        return <Home onNavigate={(pageName) => setPage(pageName)} />
      case 'Calendar':
        return <Calendar />
      case 'Profile':
        return <Profile />
      case 'Notification':
        return <Notification />
      default:
        return <Home onNavigate={(pageName) => setPage(pageName)} />
    }
  }
  return (
    <div className={`dashboard-layout ${isLiveClassroomActive ? 'live-classroom-active' : ''}`}>
      {!isLiveClassroomActive && (
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <div className="brand">
              <span>Internify.</span>
            </div>
          </div>

          <nav className="dashboard-topnav">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => setActivePage(item.id)}
                >
                  <span className="nav-icon">
                    <IconComponent />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="topbar-right">
            <button
              className="theme-toggle-dashboard"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon className="sun-icon-white" /> : <MoonIcon />}
            </button>
            <button className="notification-btn" onClick={() => setActivePage('Notification')}>
              <NotificationIcon />
            </button>
            <button className="logout-btn" onClick={onLogout}>
              <LogoutIcon />
            </button>
          </div>
        </header>
      )}

      <main className="dashboard-main">
        <div className="dashboard-content">
          {renderPage(activePage, setActivePage)}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
