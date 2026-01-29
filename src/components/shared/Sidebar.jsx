import React from 'react'
import { LogoutIcon } from '../Icons'
import '../../App.css'

const Sidebar = ({ activePage, setActivePage, navItems, onLogout }) => {
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-logo">Internify.</h1>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const IconComponent = item.icon
                    const isActive = activePage === item.id
                    return (
                        <button
                            key={item.id}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setActivePage(item.id)}
                        >
                            <div className="sidebar-icon-wrapper">
                                <IconComponent />
                            </div>
                            <span className="sidebar-label">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={onLogout}>
                    <LogoutIcon />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
