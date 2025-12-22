import { useState, useEffect } from 'react'
import Home from './pages/mentor_dashboard/Home.jsx'
import Calendar from './pages/mentor_dashboard/Calendar.jsx'
import Profile from './pages/mentor_dashboard/Profile.jsx'
import Notification from './pages/mentor_dashboard/Notification.jsx'
import { HomeIcon, CalendarIcon, ProfileIcon, NotificationIcon, LogoutIcon, SunIcon, MoonIcon } from './components/Icons.jsx'
import './App.css'

function MentorDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Home')
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('mentor-dashboard-theme')
    return savedTheme || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('mentor-dashboard-theme', theme)
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
        return <Home />
      case 'Calendar':
        return <Calendar />
      case 'Profile':
        return <Profile />
      case 'Notification':
        return <Notification />
      default:
        return <Home />
    }
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-topbar">
        <div className="topbar-left">
          <div className="brand">
            <span>Internify – Mentor</span>
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

      <main className="dashboard-main">
        <div className="dashboard-content">{renderPage(activePage, setActivePage)}</div>
      </main>
    </div>
  )
}

export default MentorDashboard


