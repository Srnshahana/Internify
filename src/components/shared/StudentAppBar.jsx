import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'

const StudentAppBar = ({ onLogout, userImage, isTransparent, hideLogout }) => {
    return (
        <nav className={`elegant-navbar ${isTransparent ? 'transparent-navbar' : ''}`}>
            <div className="user-profile-left">
                <img
                    src={userImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                    alt="User Profile"
                />
            </div>
            {!hideLogout && (
                <div className="nav-actions-right">
                    <button className="login-btn-elegant" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}

export default StudentAppBar
