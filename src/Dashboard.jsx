import { useState, useEffect } from 'react'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import Classroom from './pages/Classroom.jsx'
import Calendar from './pages/Calendar.jsx'
import Profile from './pages/Profile.jsx'
import { HomeIcon, ExploreIcon, ClassroomIcon, CalendarIcon, ProfileIcon, NotificationIcon, LogoutIcon } from './components/Icons.jsx'
import './App.css'

function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Home')
  
  // Set light theme for dashboard only (doesn't affect landing page)
  useEffect(() => {
    // Store original theme before changing
    const originalTheme = document.documentElement.getAttribute('data-theme') || 'dark'
    document.documentElement.setAttribute('data-theme', 'light')
    
    return () => {
      // Restore original theme when component unmounts (on logout)
      document.documentElement.setAttribute('data-theme', originalTheme)
    }
  }, [])

  const menuItems = [
    { id: 'Home', label: 'Home', icon: HomeIcon },
    { id: 'Explore', label: 'Explore', icon: ExploreIcon },
    { id: 'Classroom', label: 'Classroom', icon: ClassroomIcon },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Profile', label: 'Profile', icon: ProfileIcon },
  ]

  const renderPage = (page, setPage) => {
    switch (page) {
      case 'Home':
        return <Home onNavigate={(pageName) => setPage(pageName)} />
      case 'Explore':
        return <Explore />
      case 'Classroom':
        return <Classroom />
      case 'Calendar':
        return <Calendar />
      case 'Profile':
        return <Profile />
      default:
        return <Home onNavigate={(pageName) => setPage(pageName)} />
    }
  }

  return (
    <div className="dashboard-layout">
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
          <button className="notification-btn">
            <NotificationIcon />
          </button>
          <div className="user-menu">
            <div className="user-avatar">JD</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogoutIcon />
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {renderPage(activePage, setActivePage)}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
