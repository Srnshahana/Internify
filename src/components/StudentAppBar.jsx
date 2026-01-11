import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const StudentAppBar = ({ onLogout, userImage }) => {
    return (
        <nav className="elegant-navbar">
            <div className="user-profile-left">
                <img
                    src={userImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                    alt="User Profile"
                />
            </div>
            <div className="nav-actions-right">
                <button className="login-btn-elegant" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default StudentAppBar
